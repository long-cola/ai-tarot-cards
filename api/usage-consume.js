import { getUserFromRequest } from "../server/jwt.js";
import { getPool } from "../server/db.js";
import { ensureSchema } from "../server/schema.js";

let schemaEnsured = false;

const getPlanInfo = (user) => {
  if (!user) return { plan: "guest", dailyLimit: 0 };

  const now = new Date();
  const expiresAt = user.membership_expires_at ? new Date(user.membership_expires_at) : null;

  if (expiresAt && expiresAt > now) {
    return { plan: "member", dailyLimit: 50 };
  }

  return { plan: "free", dailyLimit: 5 };
};

const getTodayUsage = async (userId) => {
  const pool = getPool();
  if (!pool) return { count: 0, date: new Date().toISOString().split('T')[0] };

  const today = new Date().toISOString().split('T')[0];
  const result = await pool.query(
    `SELECT count FROM daily_usage WHERE user_id = $1 AND usage_date = $2`,
    [userId, today]
  );

  return {
    count: result.rows.length ? result.rows[0].count : 0,
    date: today,
  };
};

const incrementUsage = async (userId, date) => {
  const pool = getPool();
  if (!pool) return;

  await pool.query(
    `INSERT INTO daily_usage (user_id, usage_date, count)
     VALUES ($1, $2, 1)
     ON CONFLICT (user_id, usage_date)
     DO UPDATE SET count = daily_usage.count + 1`,
    [userId, date]
  );
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ ok: false, message: "not_authenticated" });
  }

  try {
    const pool = getPool();
    if (!pool) {
      return res.status(500).json({ ok: false, message: "db_not_configured" });
    }

    if (!schemaEnsured) {
      await ensureSchema();
      schemaEnsured = true;
    }

    const planInfo = getPlanInfo(user);
    const today = await getTodayUsage(user.id);

    if (today.count >= planInfo.dailyLimit) {
      return res.status(429).json({
        ok: false,
        message: "daily_limit_reached",
        plan: planInfo.plan,
        used_today: today.count,
        daily_limit: planInfo.dailyLimit,
        requireRedemption: planInfo.plan === "free",
      });
    }

    await incrementUsage(user.id, today.date);
    const remaining = planInfo.dailyLimit - (today.count + 1);

    res.json({
      ok: true,
      plan: planInfo.plan,
      remaining,
      daily_limit: planInfo.dailyLimit,
      membership_expires_at: user.membership_expires_at,
    });
  } catch (error) {
    console.error("[/api/usage/consume] Error:", error);
    res.status(500).json({ ok: false, message: "internal_error" });
  }
}

export const config = {
  maxDuration: 10,
};
