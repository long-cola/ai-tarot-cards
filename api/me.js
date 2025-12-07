import { getUserFromRequest } from "../server/jwt.js";
import { getPool } from "../server/db.js";
import { ensureSchema } from "../server/schema.js";
import { getPlanQuotaSummary } from "../server/plan.js";

let schemaEnsured = false;

// Get plan info for a user
const getPlanInfo = (user) => {
  if (!user) return { plan: "guest", dailyLimit: 0 };

  const now = new Date();
  const expiresAt = user.membership_expires_at ? new Date(user.membership_expires_at) : null;

  if (expiresAt && expiresAt > now) {
    return { plan: "member", dailyLimit: 50 };
  }

  return { plan: "free", dailyLimit: 5 };
};

// Get today's usage for a user
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

export default async function handler(req, res) {
  // Get user from JWT token
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(200).json({ user: null });
  }

  try {
    // Ensure schema on first request
    const pool = getPool();
    if (pool && !schemaEnsured) {
      await ensureSchema();
      schemaEnsured = true;
    }

    const planInfo = getPlanInfo(user);
    const today = await getTodayUsage(user.id);
    const quota = await getPlanQuotaSummary(user);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        membership_expires_at: user.membership_expires_at,
      },
      plan: quota?.plan || planInfo.plan,
      membership_expires_at: user.membership_expires_at,
      daily_limit: planInfo.dailyLimit,
      used_today: today.count,
      remaining_today: Math.max(planInfo.dailyLimit - today.count, 0),
      topic_quota_total: quota?.topic_quota_total ?? null,
      topic_quota_remaining: quota?.topic_quota_remaining ?? null,
      event_quota_per_topic: quota?.event_quota_per_topic ?? null,
      cycle_expires_at: quota?.expires_at ?? null,
      downgrade_limited_topic_id: quota?.downgrade_limited_topic_id ?? null,
    });
  } catch (error) {
    console.error("[/api/me] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const config = {
  maxDuration: 10,
};
