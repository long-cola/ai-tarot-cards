import { getUserFromRequest } from '../services/jwt.js';
import { getPlanInfo, getTodayUsage } from '../services/usage.js';
import { getPlanQuotaSummary } from '../services/plan.js';
import { getWeeklyTopicCount, getNextMonday } from '../services/topicQuota.js';

export default async function handler(req: any, res: any) {
  // Get user from JWT token
  const user = getUserFromRequest(req);

  console.log('[/api/me] User from JWT:', {
    id: user?.id,
    email: user?.email,
    membership_expires_at: user?.membership_expires_at,
    membership_expires_at_type: typeof user?.membership_expires_at,
  });

  if (!user) {
    return res.status(200).json({ user: null });
  }

  try {
    const planInfo = await getPlanInfo(user);
    const today = await getTodayUsage(user.id);

    // ✅ Determine if user is Pro
    const now = new Date();
    const isPro = user?.membership_expires_at && new Date(user.membership_expires_at) > now;

    // ✅ Get quota based on plan type
    let quota;
    if (isPro) {
      // Pro user: return cycle quota
      quota = await getPlanQuotaSummary(user);
    } else {
      // Free user: return weekly quota
      const weeklyCount = await getWeeklyTopicCount(user.id);
      quota = {
        plan: 'free',
        topic_quota_total: 1,
        topic_quota_remaining: Math.max(1 - weeklyCount, 0),
        event_quota_per_topic: 3,
        expires_at: getNextMonday(), // 下周一
        downgrade_limited_topic_id: null,
      };
    }

    console.log('[/api/me] Calculated planInfo:', planInfo);
    console.log('[/api/me] Today usage:', today);
    console.log('[/api/me] Quota summary:', quota);

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
