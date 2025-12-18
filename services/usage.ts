import { getPool } from './db.js';
import { User } from './jwt.js';

/**
 * Get plan info by checking BOTH users.membership_expires_at AND membership_cycles table
 * This ensures paid users are recognized even if webhook didn't update users table
 */
export async function getPlanInfo(user: User | null) {
  if (!user) return { plan: 'guest', dailyLimit: 0, membershipValid: false };

  const now = new Date();
  const pool = getPool();

  // First check users.membership_expires_at (legacy/fallback)
  const expiresAt = user?.membership_expires_at ? new Date(user.membership_expires_at) : null;
  const membershipValidFromUser = expiresAt && expiresAt > now;

  // Then check membership_cycles table (more reliable)
  try {
    const cycleResult = await pool.query(
      `SELECT plan, ends_at
       FROM membership_cycles
       WHERE user_id = $1
         AND starts_at <= NOW()
         AND ends_at > NOW()
       ORDER BY
         CASE
           WHEN plan = 'pro' THEN 1
           WHEN plan = 'member' THEN 2
           WHEN plan = 'free' THEN 3
           ELSE 4
         END,
         created_at DESC
       LIMIT 1`,
      [user.id]
    );

    const activeCycle = cycleResult.rows[0];
    const membershipValidFromCycle = activeCycle && (activeCycle.plan === 'member' || activeCycle.plan === 'pro');

    // Use cycle info if available, fallback to user table
    const membershipValid = membershipValidFromCycle || membershipValidFromUser;
    const plan = membershipValid ? 'member' : 'free';
    const dailyLimit = membershipValid ? 50 : 2;

    console.log('[getPlanInfo] User plan calculation:', {
      userId: user.id,
      email: user.email,
      membership_expires_at: user.membership_expires_at,
      expiresAt: expiresAt?.toISOString(),
      activeCycle: activeCycle ? { plan: activeCycle.plan, ends_at: activeCycle.ends_at } : null,
      membershipValidFromUser,
      membershipValidFromCycle,
      finalPlan: plan,
      dailyLimit,
    });

    return { plan, dailyLimit, membershipValid };
  } catch (error) {
    console.error('[getPlanInfo] Error checking membership_cycles, falling back to user table:', error);

    // Fallback to user table only
    const plan = membershipValidFromUser ? 'member' : 'free';
    const dailyLimit = membershipValidFromUser ? 50 : 2;
    return { plan, dailyLimit, membershipValid: membershipValidFromUser };
  }
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
