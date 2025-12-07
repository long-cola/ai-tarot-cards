import { getUserFromRequest } from "../server/jwt.js";
import { getPool } from "../server/db.js";
import { ensureSchema } from "../server/schema.js";
import { getPlanQuotaSummary, ensureActiveCycleForUser } from "../server/plan.js";

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

  try {
    if (!schemaEnsured) {
      await ensureSchema();
      schemaEnsured = true;
    }

    const { title, language = "zh", baseline_cards = null, baseline_reading = null } = req.body || {};

    if (!title || !title.trim()) {
      return res.status(400).json({ ok: false, message: "missing_title" });
    }

    const quota = await getPlanQuotaSummary(user);

    if (quota && quota.topic_quota_remaining !== null && quota.topic_quota_remaining <= 0) {
      return res.status(403).json({ ok: false, reason: "topic_quota_exhausted", quota });
    }

    const cycle = quota?.cycle || (await ensureActiveCycleForUser(user));
    if (!cycle) {
      return res.status(500).json({ ok: false, message: "cycle_unavailable" });
    }

    const insert = await pool.query(
      `INSERT INTO topics (user_id, cycle_id, title, language, baseline_cards, baseline_reading)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [user.id, cycle.id, title.trim(), language, baseline_cards, baseline_reading]
    );

    const updatedQuota = await getPlanQuotaSummary(user);
    res.json({ ok: true, topic: insert.rows[0], quota: updatedQuota });
  } catch (error) {
    console.error("[/api/topics-create] Error:", error);
    res.status(500).json({ ok: false, message: "internal_error", details: error.message });
  }
}

export const config = {
  maxDuration: 30,
};
