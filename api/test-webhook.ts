/**
 * Test Webhook Handler
 * 用于手动测试 Webhook 处理逻辑
 * 只能通过管理员权限访问
 */

import { isAdminAuthorized } from '../services/admin.js';
import { query } from '../services/db.js';

export default async function handler(req: any, res: any) {
  // Check admin authorization
  if (!(await isAdminAuthorized(req))) {
    return res.status(403).json({ ok: false, message: 'forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, userEmail } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    console.log('[Test Webhook] Simulating payment for user:', userId);

    // Grant membership (same logic as webhook)
    const durationDays = 30;
    const startsAt = new Date();
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + durationDays);

    // Create membership cycle
    await query(
      `INSERT INTO membership_cycles (user_id, plan, starts_at, ends_at, topic_quota, event_quota_per_topic, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, 'pro', startsAt, endsAt, 999, 999, 'test_webhook']
    );

    // Update user's membership_expires_at
    await query(
      `UPDATE users
       SET membership_expires_at = $1, updated_at = NOW()
       WHERE id = $2`,
      [endsAt, userId]
    );

    console.log('[Test Webhook] Membership granted successfully');

    return res.status(200).json({
      ok: true,
      message: 'Membership granted',
      userId,
      endsAt: endsAt.toISOString(),
    });
  } catch (error: any) {
    console.error('[Test Webhook] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  maxDuration: 10,
};
