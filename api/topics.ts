import { getUserFromRequest } from '../services/jwt.js';
import { getPool } from '../services/db.js';
import { getPlanQuotaSummary, ensureActiveCycleForUser } from '../services/plan.js';
import {
  canCreateTopic,
  canAddTopicEvent,
  incrementWeeklyTopicCount,
} from '../services/topicQuota.js';

export default async function handler(req: any, res: any) {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ ok: false, message: 'not_authenticated' });
  }

  const pool = getPool();
  // Strip query string
  const fullPath = req.url || '';
  const path = fullPath.split('?')[0];
  const method = req.method;

  console.log('[topics] Request:', method, path);

  try {
    // Extract topic ID from path if present
    const topicIdMatch = path.match(/\/topics\/([^/]+)/);
    const topicId = topicIdMatch ? topicIdMatch[1] : null;

    // DELETE /api/topics/:id - Delete topic
    if (method === 'DELETE' && topicId && !path.includes('/events')) {
      return await handleDeleteTopic(req, res, user, pool, topicId);
    }

    // POST /api/topics/:id/events - Add event to topic
    if (method === 'POST' && topicId && path.includes('/events')) {
      return await handleAddEvent(req, res, user, pool, topicId);
    }

    // GET /api/topics/:id - Get topic detail
    if (method === 'GET' && topicId && !path.includes('/events')) {
      return await handleGetTopic(req, res, user, pool, topicId);
    }

    // POST /api/topics - Create new topic
    if (method === 'POST' && path === '/api/topics') {
      return await handleCreateTopic(req, res, user, pool);
    }

    // GET /api/topics - List all topics
    if (method === 'GET' && path === '/api/topics') {
      return await handleListTopics(req, res, user, pool);
    }

    console.log('[topics] No route matched');
    return res.status(404).json({ ok: false, message: 'not_found' });
  } catch (error: any) {
    console.error('[/api/topics] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error', details: error.message });
  }
}

// List all topics for user
async function handleListTopics(req: any, res: any, user: any, pool: any) {
  const quota = await getPlanQuotaSummary(user);

  const topicsRes = await pool.query(
    `SELECT t.*,
      (SELECT COUNT(*) FROM topic_events e WHERE e.topic_id = t.id AND e.user_id = $1) as event_count
    FROM topics t
    WHERE t.user_id=$1 AND t.status='active'
    ORDER BY t.created_at DESC`,
    [user.id]
  );

  const topics = topicsRes.rows.map((row: any) => {
    const count = Number(row.event_count || 0);
    const remaining =
      quota?.event_quota_per_topic != null ? Math.max(quota.event_quota_per_topic - count, 0) : null;
    return { ...row, event_remaining: remaining };
  });

  res.json({ ok: true, topics, quota });
}

// Delete topic (soft delete)
async function handleDeleteTopic(req: any, res: any, user: any, pool: any, topicId: string) {
  // Verify topic belongs to user
  const topicRes = await pool.query(`SELECT * FROM topics WHERE id=$1 AND user_id=$2 AND status='active' LIMIT 1`, [
    topicId,
    user.id,
  ]);

  if (!topicRes.rows.length) {
    return res.status(404).json({ ok: false, message: 'topic_not_found' });
  }

  // Soft delete - mark as deleted instead of removing from database
  // This preserves quota usage (deleted topics still count toward the user's total)
  await pool.query(`UPDATE topics SET status='deleted', updated_at=NOW() WHERE id=$1 AND user_id=$2`, [topicId, user.id]);

  const quota = await getPlanQuotaSummary(user);
  res.json({ ok: true, quota });
}

// Create new topic
async function handleCreateTopic(req: any, res: any, user: any, pool: any) {
  const { title, language = 'zh', baseline_cards = null, baseline_reading = null } = req.body || {};

  if (!title || !title.trim()) {
    return res.status(400).json({ ok: false, message: 'missing_title' });
  }

  // ✅ Check quota using new system
  const quotaCheck = await canCreateTopic(user);
  if (!quotaCheck.allowed) {
    const message =
      quotaCheck.reason === 'free_weekly_quota_exceeded'
        ? '本周配额已用完，下周一重置'
        : 'Pro 配额已达上限（30个topics）';

    return res.status(403).json({
      ok: false,
      error: 'quota_exceeded',
      message,
      reason: quotaCheck.reason,
    });
  }

  // Determine if user is Pro
  const now = new Date();
  const isPro = user?.membership_expires_at && new Date(user.membership_expires_at) > now;

  // Pro users need a cycle, free users don't
  let cycle = null;
  if (isPro) {
    const quota = await getPlanQuotaSummary(user);
    cycle = quota?.cycle || (await ensureActiveCycleForUser(user));
    if (!cycle) {
      return res.status(500).json({ ok: false, message: 'cycle_unavailable' });
    }
  }

  // Parse baseline_cards - handle multiple levels of encoding
  let parsedCards = baseline_cards;

  while (typeof parsedCards === 'string' && parsedCards) {
    try {
      const temp = JSON.parse(parsedCards);
      parsedCards = temp;
    } catch (e) {
      console.error('[/api/topics] Failed to parse baseline_cards:', e);
      parsedCards = null;
      break;
    }
  }

  const cardsJson = parsedCards ? JSON.stringify(parsedCards) : null;

  const insert = await pool.query(
    `INSERT INTO topics (user_id, cycle_id, title, language, baseline_cards, baseline_reading)
     VALUES ($1,$2,$3,$4,$5::jsonb,$6)
     RETURNING *`,
    [user.id, cycle?.id || null, title.trim(), language, cardsJson, baseline_reading]
  );

  // ✅ Increment weekly topic count for free users
  if (!isPro) {
    await incrementWeeklyTopicCount(user.id);
  }

  const updatedQuota = await getPlanQuotaSummary(user);
  return res.json({ ok: true, topic: insert.rows[0], quota: updatedQuota });
}

// Get topic detail with events
async function handleGetTopic(req: any, res: any, user: any, pool: any, topicId: string) {
  const topicRes = await pool.query(`SELECT * FROM topics WHERE id=$1 AND user_id=$2 AND status='active' LIMIT 1`, [
    topicId,
    user.id,
  ]);

  if (!topicRes.rows.length) {
    return res.status(404).json({ ok: false, message: 'topic_not_found' });
  }

  const eventsRes = await pool.query(
    `SELECT * FROM topic_events WHERE topic_id=$1 AND user_id=$2 ORDER BY created_at ASC`,
    [topicId, user.id]
  );

  const quota = await getPlanQuotaSummary(user);
  const eventCount = eventsRes.rows.length;

  res.json({
    ok: true,
    topic: topicRes.rows[0],
    events: eventsRes.rows,
    quota,
    event_usage: {
      used: eventCount,
      remaining:
        quota?.event_quota_per_topic != null
          ? Math.max(quota.event_quota_per_topic - eventCount, 0)
          : null,
    },
  });
}

// Add event to topic
async function handleAddEvent(req: any, res: any, user: any, pool: any, topicId: string) {
  const { name, cards = null, reading = null } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ ok: false, message: 'missing_event_name' });
  }

  const topicRes = await pool.query(`SELECT * FROM topics WHERE id=$1 AND user_id=$2 LIMIT 1`, [
    topicId,
    user.id,
  ]);

  if (!topicRes.rows.length) {
    return res.status(404).json({ ok: false, message: 'topic_not_found' });
  }

  const topic = topicRes.rows[0];

  // ✅ Check event quota using new system
  const eventQuotaCheck = await canAddTopicEvent(user, topicId);
  if (!eventQuotaCheck.allowed) {
    let message = '';
    if (eventQuotaCheck.reason === 'free_event_quota_exceeded') {
      message = '免费用户每个命题最多 3 个事件';
    } else if (eventQuotaCheck.reason === 'downgraded_event_quota_exceeded') {
      message = '降级用户该命题已达上限';
    } else if (eventQuotaCheck.reason === 'pro_event_quota_exceeded') {
      message = 'Pro 用户该命题已达上限（500个events）';
    }

    return res.status(403).json({
      ok: false,
      error: 'quota_exceeded',
      message,
      reason: eventQuotaCheck.reason,
    });
  }

  // Get current event count for response
  const eventCountRes = await pool.query(
    `SELECT COUNT(*) as count FROM topic_events WHERE topic_id=$1 AND user_id=$2`,
    [topicId, user.id]
  );
  const eventCount = Number(eventCountRes.rows[0]?.count ?? 0);

  const cycleId = topic.cycle_id || null;

  // Parse cards
  let parsedCards = cards;
  while (typeof parsedCards === 'string' && parsedCards) {
    try {
      parsedCards = JSON.parse(parsedCards);
    } catch (e) {
      console.error('[/api/topics] Failed to parse cards:', e);
      parsedCards = null;
      break;
    }
  }

  const cardsJson = parsedCards ? JSON.stringify(parsedCards) : null;

  const insert = await pool.query(
    `INSERT INTO topic_events (topic_id, cycle_id, user_id, name, cards, reading)
     VALUES ($1,$2,$3,$4,$5::jsonb,$6)
     RETURNING *`,
    [topicId, cycleId, user.id, name.trim(), cardsJson, reading]
  );

  await pool.query(`UPDATE topics SET updated_at=NOW() WHERE id=$1`, [topicId]);

  const newCount = eventCount + 1;
  // Calculate remaining from quota check (which already accounts for downgrade logic)
  const remaining = eventQuotaCheck.remaining != null ? eventQuotaCheck.remaining - 1 : null;

  const quota = await getPlanQuotaSummary(user);

  res.json({
    ok: true,
    event: insert.rows[0],
    event_usage: { used: newCount, remaining },
    quota,
  });
}

export const config = {
  maxDuration: 30,
};
