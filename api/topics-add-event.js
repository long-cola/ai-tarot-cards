import { getUserFromRequest } from "../server/jwt.js";
import { getPool } from "../server/db.js";
import { ensureSchema } from "../server/schema.js";
import { getPlanQuotaSummary } from "../server/plan.js";

let schemaEnsured = false;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ ok: false, message: "not_authenticated" });
  }

  const pool = getPool();
  if (!pool) {
    return res.status(500).json({ ok: false, message: "db_not_configured" });
  }

  // Extract topic ID from query or body
  const topicId = req.query.id || req.body?.topicId;

  if (!topicId) {
    return res.status(400).json({ ok: false, message: "missing_topic_id" });
  }

  try {
    if (!schemaEnsured) {
      await ensureSchema();
      schemaEnsured = true;
    }

    const { name, cards = null, reading = null } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ ok: false, message: "missing_event_name" });
    }

    const topicRes = await pool.query(
      `SELECT * FROM topics WHERE id=$1 AND user_id=$2 LIMIT 1`,
      [topicId, user.id]
    );

    if (!topicRes.rows.length) {
      return res.status(404).json({ ok: false, message: "topic_not_found" });
    }

    const topic = topicRes.rows[0];

    const quota = await getPlanQuotaSummary(user);

    if (quota?.plan === "free" && quota?.downgrade_limited_topic_id && quota.downgrade_limited_topic_id !== topic.id) {
      return res.status(403).json({ ok: false, reason: "downgraded_topic_locked", quota });
    }

    const eventCountRes = await pool.query(
      `SELECT COUNT(*) as count FROM topic_events WHERE topic_id=$1`,
      [topicId]
    );
    const eventCount = Number(eventCountRes.rows[0]?.count ?? 0);

    if (quota?.event_quota_per_topic != null && eventCount >= quota.event_quota_per_topic) {
      return res.status(403).json({ ok: false, reason: "event_quota_exhausted", quota, used: eventCount });
    }

    const cycleId = topic.cycle_id || quota?.cycle?.id || null;

    // Parse cards if it's a string, otherwise use as-is
    let parsedCards = cards;
    if (typeof cards === 'string') {
      try {
        parsedCards = JSON.parse(cards);
      } catch (e) {
        console.error("[/api/topics-add-event] Failed to parse cards:", e);
        parsedCards = null;
      }
    }

    const insert = await pool.query(
      `INSERT INTO topic_events (topic_id, cycle_id, user_id, name, cards, reading)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [topicId, cycleId, user.id, name.trim(), parsedCards, reading]
    );

    await pool.query(`UPDATE topics SET updated_at=NOW() WHERE id=$1`, [topicId]);

    const newCount = eventCount + 1;
    const remaining = quota?.event_quota_per_topic != null
      ? Math.max(quota.event_quota_per_topic - newCount, 0)
      : null;

    res.json({
      ok: true,
      event: insert.rows[0],
      event_usage: { used: newCount, remaining },
      quota,
    });
  } catch (error) {
    console.error("[/api/topics-add-event] Error:", error);
    res.status(500).json({ ok: false, message: "internal_error", details: error.message });
  }
}

export const config = {
  maxDuration: 30,
};
