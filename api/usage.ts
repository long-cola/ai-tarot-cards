import { getUserFromRequest } from '../services/jwt.js';
import { getPlanInfo, getTodayUsage, incrementUsage } from '../services/usage.js';

export default async function handler(req: any, res: any) {
  // Strip query string
  const fullPath = req.url || '';
  const path = fullPath.split('?')[0];
  const method = req.method;

  console.log('[usage] Request:', method, path);

  // POST /api/usage/consume - Consume daily usage
  if (path.includes('/consume') && method === 'POST') {
    return handleConsumeUsage(req, res);
  }

  console.log('[usage] No route matched');
  return res.status(404).json({ ok: false, message: 'not_found' });
}

// Consume daily usage
async function handleConsumeUsage(req: any, res: any) {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ ok: false, message: 'not_authenticated' });
  }

  try {
    const planInfo = getPlanInfo(user);
    const today = await getTodayUsage(user.id);

    console.log('[/api/usage/consume] User quota check:', {
      userId: user.id,
      email: user.email,
      membershipExpiresAt: user.membership_expires_at,
      membershipExpiresAtType: typeof user.membership_expires_at,
      now: new Date().toISOString(),
      plan: planInfo.plan,
      membershipValid: planInfo.membershipValid,
      dailyLimit: planInfo.dailyLimit,
      todayCount: today.count,
      todayDate: today.date,
    });

    if (today.count >= planInfo.dailyLimit) {
      console.warn('[/api/usage/consume] Daily limit reached:', {
        plan: planInfo.plan,
        used: today.count,
        limit: planInfo.dailyLimit,
      });
      return res.status(429).json({
        ok: false,
        message: 'daily_limit_reached',
        plan: planInfo.plan,
        used_today: today.count,
        daily_limit: planInfo.dailyLimit,
        requireRedemption: planInfo.plan === 'free',
      });
    }

    await incrementUsage(user.id, today.date);
    const remaining = planInfo.dailyLimit - (today.count + 1);

    console.log('[/api/usage/consume] Usage incremented successfully:', {
      newCount: today.count + 1,
      remaining,
    });

    res.json({
      ok: true,
      plan: planInfo.plan,
      remaining,
      daily_limit: planInfo.dailyLimit,
      membership_expires_at: user.membership_expires_at,
    });
  } catch (error) {
    console.error('[/api/usage/consume] Error:', error);
    res.status(500).json({ ok: false, message: 'internal_error' });
  }
}

export const config = {
  maxDuration: 10,
};
