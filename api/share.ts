import { getUserFromRequest } from '../services/jwt.js';
import { getPool } from '../services/db.js';

export default async function handler(req: any, res: any) {
  const pool = getPool();
  const fullPath = req.url || '';
  const path = fullPath.split('?')[0];
  const method = req.method;

  console.log('[share] Request:', method, path);

  try {
    // Extract share ID from path if present
    const shareIdMatch = path.match(/\/share\/([^/]+)/);
    const shareId = shareIdMatch ? shareIdMatch[1] : null;

    // GET /api/share/:id - Get shared reading (public, no auth required)
    if (method === 'GET' && shareId) {
      return await handleGetSharedReading(req, res, pool, shareId);
    }

    // POST /api/share - Create new shareable link (requires auth)
    if (method === 'POST' && path === '/api/share') {
      return await handleCreateShare(req, res, pool);
    }

    console.log('[share] No route matched');
    return res.status(404).json({ ok: false, message: 'not_found' });
  } catch (error: any) {
    console.error('[/api/share] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error', details: error.message });
  }
}

// Create a new shareable link
async function handleCreateShare(req: any, res: any, pool: any) {
  const user = getUserFromRequest(req);

  // Auth is optional for guest quick readings
  const userId = user?.id || null;

  const {
    shareType,
    question,
    cards,
    reading,
    language,
    topicId,
    eventId
  } = req.body || {};

  if (!shareType || !['quick', 'topic_event', 'topic_baseline'].includes(shareType)) {
    return res.status(400).json({ ok: false, message: 'invalid_share_type' });
  }

  // Validate required fields based on share type
  if (shareType === 'quick') {
    if (!question || !cards || !reading) {
      return res.status(400).json({ ok: false, message: 'missing_required_fields' });
    }
  } else if (shareType === 'topic_event') {
    if (!eventId) {
      return res.status(400).json({ ok: false, message: 'missing_event_id' });
    }

    // Verify event exists and belongs to user
    if (user) {
      const eventRes = await pool.query(
        'SELECT * FROM topic_events WHERE id=$1 AND user_id=$2 LIMIT 1',
        [eventId, user.id]
      );
      if (!eventRes.rows.length) {
        return res.status(404).json({ ok: false, message: 'event_not_found' });
      }
    }
  } else if (shareType === 'topic_baseline') {
    if (!topicId) {
      return res.status(400).json({ ok: false, message: 'missing_topic_id' });
    }

    // Verify topic exists and belongs to user
    if (user) {
      const topicRes = await pool.query(
        'SELECT * FROM topics WHERE id=$1 AND user_id=$2 LIMIT 1',
        [topicId, user.id]
      );
      if (!topicRes.rows.length) {
        return res.status(404).json({ ok: false, message: 'topic_not_found' });
      }
    }
  }

  // Parse cards if it's a string
  let parsedCards = cards;
  if (typeof parsedCards === 'string') {
    try {
      parsedCards = JSON.parse(parsedCards);
    } catch (e) {
      console.error('[share] Failed to parse cards:', e);
    }
  }

  const cardsJson = parsedCards ? JSON.stringify(parsedCards) : null;

  // Insert shared reading
  const insert = await pool.query(
    `INSERT INTO shared_readings (share_type, question, cards, reading, language, topic_id, event_id, created_by)
     VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8)
     RETURNING id`,
    [shareType, question || null, cardsJson, reading || null, language || null, topicId || null, eventId || null, userId]
  );

  const shareId = insert.rows[0].id;

  console.log('[share] Created share:', shareId, 'type:', shareType);

  return res.json({
    ok: true,
    shareId,
    shareUrl: `https://ai-tarotcards.vercel.app/share/${shareId}`
  });
}

// Get shared reading (public endpoint)
async function handleGetSharedReading(req: any, res: any, pool: any, shareId: string) {
  // Fetch the shared reading
  const shareRes = await pool.query(
    `SELECT * FROM shared_readings WHERE id=$1 LIMIT 1`,
    [shareId]
  );

  if (!shareRes.rows.length) {
    return res.status(404).json({ ok: false, message: 'share_not_found' });
  }

  const share = shareRes.rows[0];

  // Increment view count
  await pool.query(
    `UPDATE shared_readings SET view_count = view_count + 1 WHERE id=$1`,
    [shareId]
  );

  let readingData: any = {
    shareType: share.share_type,
    viewCount: share.view_count + 1,
    createdAt: share.created_at,
  };

  if (share.share_type === 'quick') {
    // Quick reading - data is stored directly
    readingData.question = share.question;
    readingData.cards = share.cards;
    readingData.reading = share.reading;
    readingData.language = share.language || 'zh';
  } else if (share.share_type === 'topic_event') {
    // Topic event - fetch from topic_events table
    const eventRes = await pool.query(
      `SELECT e.*, t.title as topic_title, t.language as topic_language
       FROM topic_events e
       JOIN topics t ON e.topic_id = t.id
       WHERE e.id=$1 LIMIT 1`,
      [share.event_id]
    );

    if (!eventRes.rows.length) {
      return res.status(404).json({ ok: false, message: 'event_not_found' });
    }

    const event = eventRes.rows[0];
    readingData.question = event.name;
    readingData.cards = event.cards;
    readingData.reading = event.reading;
    readingData.language = event.topic_language || 'zh';
    readingData.topicTitle = event.topic_title;
    readingData.createdAt = event.created_at;
  } else if (share.share_type === 'topic_baseline') {
    // Topic baseline - fetch from topics table
    const topicRes = await pool.query(
      `SELECT * FROM topics WHERE id=$1 LIMIT 1`,
      [share.topic_id]
    );

    if (!topicRes.rows.length) {
      return res.status(404).json({ ok: false, message: 'topic_not_found' });
    }

    const topic = topicRes.rows[0];
    readingData.question = topic.title;
    readingData.cards = topic.baseline_cards;
    readingData.reading = topic.baseline_reading;
    readingData.language = topic.language || 'zh';
    readingData.topicTitle = topic.title;
    readingData.createdAt = topic.created_at;
  }

  console.log('[share] Fetched share:', shareId, 'type:', share.share_type, 'views:', readingData.viewCount);

  return res.json({ ok: true, data: readingData });
}

export const config = {
  maxDuration: 10,
};
