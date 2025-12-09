import { getUserFromRequest } from '../services/jwt.js';
import { getPlanInfo, getTodayUsage } from '../services/usage.js';
import { getPlanQuotaSummary } from '../services/plan.js';

export default async function handler(req: any, res: any) {
  // Get user from JWT token
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(200).json({ user: null });
  }

  try {
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
    console.error('[/api/me] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  maxDuration: 10,
};
