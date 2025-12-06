import { pool } from "./db.js";

export const getPlanInfo = (user) => {
  const now = new Date();
  const membershipValid = user?.membership_expires_at && new Date(user.membership_expires_at) > now;
  const plan = membershipValid ? "member" : "free";
  const dailyLimit = membershipValid ? 50 : 2;
  return { plan, dailyLimit, membershipValid };
};

export const getTodayUsage = async (userId) => {
  const today = new Date().toISOString().slice(0, 10);
  const result = await pool.query(
    `select count from daily_usage where user_id=$1 and usage_date=$2`,
    [userId, today]
  );
  return { count: result.rows[0]?.count ?? 0, date: today };
};

export const incrementUsage = async (userId, date) => {
  await pool.query(
    `
    insert into daily_usage (user_id, usage_date, count)
    values ($1, $2, 1)
    on conflict (user_id, usage_date)
    do update set count = daily_usage.count + 1
  `,
    [userId, date]
  );
};
