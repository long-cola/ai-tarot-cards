import { getUserFromRequest } from '../services/jwt.js';
import { getPool } from '../services/db.js';
import { getPlanQuotaSummary, ensureActiveCycleForUser } from '../services/plan.js';

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
      (SELECT COUNT(*) FROM topic_events e WHERE e.topic_id = t.id) as event_count
    FROM topics t
    WHERE t.user_id=$1
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

// Create new topic
async function handleCreateTopic(req: any, res: any, user: any, pool: any) {
  const { title, language = 'zh', baseline_cards = null, baseline_reading = null } = req.body || {};

  if (!title || !title.trim()) {
    return res.status(400).json({ ok: false, message: 'missing_title' });
  }

  const quota = await getPlanQuotaSummary(user);

  if (quota && quota.topic_quota_remaining !== null && quota.topic_quota_remaining <= 0) {
    return res.status(403).json({ ok: false, reason: 'topic_quota_exhausted', quota });
  }

  const cycle = quota?.cycle || (await ensureActiveCycleForUser(user));
  if (!cycle) {
    return res.status(500).json({ ok: false, message: 'cycle_unavailable' });
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
    [user.id, cycle.id, title.trim(), language, cardsJson, baseline_reading]
  );

  const updatedQuota = await getPlanQuotaSummary(user);
  return res.json({ ok: true, topic: insert.rows[0], quota: updatedQuota });
}

// Get topic detail with events
async function handleGetTopic(req: any, res: any, user: any, pool: any, topicId: string) {
  const topicRes = await pool.query(`SELECT * FROM topics WHERE id=$1 AND user_id=$2 LIMIT 1`, [
    topicId,
    user.id,
  ]);

  if (!topicRes.rows.length) {
    return res.status(404).json({ ok: false, message: 'topic_not_found' });
  }

  const eventsRes = await pool.query(
    `SELECT * FROM topic_events WHERE topic_id=$1 ORDER BY created_at ASC`,
    [topicId]
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
  const quota = await getPlanQuotaSummary(user);

  if (
    quota?.plan === 'free' &&
    quota?.downgrade_limited_topic_id &&
    quota.downgrade_limited_topic_id !== topic.id
  ) {
    return res.status(403).json({ ok: false, reason: 'downgraded_topic_locked', quota });
  }

  const eventCountRes = await pool.query(
    `SELECT COUNT(*) as count FROM topic_events WHERE topic_id=$1`,
    [topicId]
  );
  const eventCount = Number(eventCountRes.rows[0]?.count ?? 0);

  if (quota?.event_quota_per_topic != null && eventCount >= quota.event_quota_per_topic) {
    return res.status(403).json({ ok: false, reason: 'event_quota_exhausted', quota, used: eventCount });
  }

  const cycleId = topic.cycle_id || quota?.cycle?.id || null;

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
  const remaining =
    quota?.event_quota_per_topic != null ? Math.max(quota.event_quota_per_topic - newCount, 0) : null;

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
