import { getUserFromRequest } from "../server/jwt.js";
import { getPool } from "../server/db.js";
import { ensureSchema } from "../server/schema.js";
import { getPlanQuotaSummary, ensureActiveCycleForUser } from "../server/plan.js";

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

  try {
    if (!schemaEnsured) {
      await ensureSchema();
      schemaEnsured = true;
    }

    // Handle POST (create topic)
    if (req.method === 'POST') {
      const { title, language = "zh", baseline_cards = null, baseline_reading = null } = req.body || {};

      console.log("[/api/topics] Received baseline_cards type:", typeof baseline_cards);
      console.log("[/api/topics] Received baseline_cards (first 200 chars):",
        typeof baseline_cards === 'string' ? baseline_cards.substring(0, 200) : JSON.stringify(baseline_cards)?.substring(0, 200));

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

      // Parse baseline_cards - handle multiple levels of encoding
      let parsedCards = baseline_cards;
      console.log("[/api/topics] Received baseline_cards type:", typeof baseline_cards);

      // Keep parsing if it's a string until we get an object or fail
      while (typeof parsedCards === 'string' && parsedCards) {
        try {
          const temp = JSON.parse(parsedCards);
          console.log("[/api/topics] Parsed one level, new type:", typeof temp);
          parsedCards = temp;
        } catch (e) {
          console.error("[/api/topics] Failed to parse, using null. Error:", e.message);
          console.error("[/api/topics] Problematic value (first 300):", parsedCards.substring(0, 300));
          parsedCards = null;
          break;
        }
      }

      console.log("[/api/topics] Final parsedCards type:", typeof parsedCards);
      console.log("[/api/topics] Final parsedCards:", parsedCards ? JSON.stringify(parsedCards).substring(0, 200) : 'null');

      // Always stringify to JSON, then let PostgreSQL parse it with ::jsonb
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

    // Handle GET (list topics)
    const quota = await getPlanQuotaSummary(user);

    const topicsRes = await pool.query(
      `SELECT t.*,
        (SELECT COUNT(*) FROM topic_events e WHERE e.topic_id = t.id) as event_count
      FROM topics t
      WHERE t.user_id=$1
      ORDER BY t.created_at DESC`,
      [user.id]
    );

    const topics = topicsRes.rows.map((row) => {
      const count = Number(row.event_count || 0);
      const remaining = quota?.event_quota_per_topic != null
        ? Math.max(quota.event_quota_per_topic - count, 0)
        : null;
      return { ...row, event_remaining: remaining };
    });

    res.json({ ok: true, topics, quota });
  } catch (error) {
    console.error("[/api/topics] Error:", error);
    res.status(500).json({ ok: false, message: "internal_error", details: error.message });
  }
}

export const config = {
  maxDuration: 30,
};
