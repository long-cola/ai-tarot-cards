import { getUserFromRequest } from "../server/jwt.js";
import { getPool } from "../server/db.js";
import { ensureSchema } from "../server/schema.js";
import { getPlanQuotaSummary } from "../server/plan.js";

let schemaEnsured = false;

export default async function handler(req, res) {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ ok: false, message: "not_authenticated" });
  }

  const pool = getPool();
  if (!pool) {
    return res.status(500).json({ ok: false, message: "db_not_configured" });
  }

  // Extract topic ID from query or path
  const topicId = req.query.id || req.url?.split('/').pop();

  if (!topicId) {
    return res.status(400).json({ ok: false, message: "missing_topic_id" });
  }

  try {
    if (!schemaEnsured) {
      await ensureSchema();
      schemaEnsured = true;
    }

    const topicRes = await pool.query(
      `SELECT * FROM topics WHERE id=$1 AND user_id=$2 LIMIT 1`,
      [topicId, user.id]
    );

    if (!topicRes.rows.length) {
      return res.status(404).json({ ok: false, message: "topic_not_found" });
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
        remaining: quota?.event_quota_per_topic != null
          ? Math.max(quota.event_quota_per_topic - eventCount, 0)
          : null,
      },
    });
  } catch (error) {
    console.error("[/api/topics-detail] Error:", error);
    res.status(500).json({ ok: false, message: "internal_error", details: error.message });
  }
}

export const config = {
  maxDuration: 30,
};
