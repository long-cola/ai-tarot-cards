import { getPool } from './db.js';
import { User } from './jwt.js';

export function getPlanInfo(user: User | null) {
  if (!user) return { plan: 'guest', dailyLimit: 0, membershipValid: false };

  const now = new Date();
  const membershipValid =
    user?.membership_expires_at && new Date(user.membership_expires_at) > now;
  const plan = membershipValid ? 'member' : 'free';
  const dailyLimit = membershipValid ? 50 : 2;
  return { plan, dailyLimit, membershipValid };
}

export async function getTodayUsage(userId: string) {
  const pool = getPool();
  const today = new Date().toISOString().slice(0, 10);
  const result = await pool.query(
    `SELECT count FROM daily_usage WHERE user_id=$1 AND usage_date=$2`,
    [userId, today]
  );
  return { count: result.rows[0]?.count ?? 0, date: today };
}

export async function incrementUsage(userId: string, date: string) {
  const pool = getPool();
  await pool.query(
    `
    INSERT INTO daily_usage (user_id, usage_date, count)
    VALUES ($1, $2, 1)
    ON CONFLICT (user_id, usage_date)
    DO UPDATE SET count = daily_usage.count + 1
  `,
    [userId, date]
  );
}
