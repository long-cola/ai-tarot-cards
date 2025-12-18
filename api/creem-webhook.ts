/**
 * Creem Webhook Handler
 *
 * Handles payment events from Creem.io:
 * - order.created: New order created
 * - order.completed: Payment completed successfully
 * - subscription.activated: Subscription started
 * - subscription.renewed: Subscription renewed
 * - subscription.cancelled: Subscription cancelled
 */

import { query } from '../services/db.js';

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('[Creem Webhook] Received webhook');
  console.log('[Creem Webhook] Headers:', JSON.stringify(req.headers, null, 2));

  try {
    const event = req.body;
    console.log('[Creem Webhook] Event type:', event.type);
    console.log('[Creem Webhook] Event data:', JSON.stringify(event, null, 2));

    // Extract event type and data
    const eventType = event.type;
    const eventData = event.data;

    if (!eventType || !eventData) {
      console.error('[Creem Webhook] Invalid webhook payload');
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    // Handle different event types
    switch (eventType) {
      case 'order.completed':
        await handleOrderCompleted(eventData);
        break;

      case 'subscription.activated':
        await handleSubscriptionActivated(eventData);
        break;

      case 'subscription.renewed':
        await handleSubscriptionRenewed(eventData);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(eventData);
        break;

      default:
        console.log('[Creem Webhook] Unhandled event type:', eventType);
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({ received: true });

  } catch (error: any) {
    console.error('[Creem Webhook] Error processing webhook:', error);
    // Still return 200 to avoid retry spam
    return res.status(200).json({ received: true, error: error.message });
  }
}

/**
 * Handle order.completed event (one-time payment)
 */
async function handleOrderCompleted(data: any) {
  console.log('[Creem Webhook] Handling order.completed');

  const userId = data.metadata?.user_id;
  const userEmail = data.metadata?.user_email;

  if (!userId) {
    console.error('[Creem Webhook] No user_id in metadata');
    return;
  }

  // For monthly subscription, grant 30 days of membership
  const durationDays = 30;
  const startsAt = new Date();
  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + durationDays);

  console.log('[Creem Webhook] Granting membership:', {
    userId,
    userEmail,
    startsAt,
    endsAt,
  });

  // First, end any active free cycles to avoid conflicts
  await query(
    `UPDATE membership_cycles
     SET ends_at = NOW()
     WHERE user_id = $1
       AND plan = 'free'
       AND starts_at <= NOW()
       AND ends_at > NOW()`,
    [userId]
  );

  // Create a new membership cycle
  await query(
    `INSERT INTO membership_cycles (user_id, plan, starts_at, ends_at, topic_quota, event_quota_per_topic, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, 'pro', startsAt, endsAt, 999, 999, 'creem']
  );

  // Update user's membership_expires_at
  await query(
    `UPDATE users
     SET membership_expires_at = $1, updated_at = NOW()
     WHERE id = $2`,
    [endsAt, userId]
  );

  console.log('[Creem Webhook] Membership granted successfully');
}

/**
 * Handle subscription.activated event
 */
async function handleSubscriptionActivated(data: any) {
  console.log('[Creem Webhook] Handling subscription.activated');

  const userId = data.metadata?.user_id;
  const subscriptionId = data.id;

  if (!userId) {
    console.error('[Creem Webhook] No user_id in metadata');
    return;
  }

  // For subscription, grant membership for the billing period
  const durationDays = 30; // Assuming monthly subscription
  const startsAt = new Date();
  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + durationDays);

  console.log('[Creem Webhook] Activating subscription:', {
    userId,
    subscriptionId,
    startsAt,
    endsAt,
  });

  // First, end any active free cycles to avoid conflicts
  await query(
    `UPDATE membership_cycles
     SET ends_at = NOW()
     WHERE user_id = $1
       AND plan = 'free'
       AND starts_at <= NOW()
       AND ends_at > NOW()`,
    [userId]
  );

  // Create a new membership cycle
  await query(
    `INSERT INTO membership_cycles (user_id, plan, starts_at, ends_at, topic_quota, event_quota_per_topic, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, 'pro', startsAt, endsAt, 999, 999, 'creem_subscription']
  );

  // Update user's membership_expires_at
  await query(
    `UPDATE users
     SET membership_expires_at = $1, updated_at = NOW()
     WHERE id = $2`,
    [endsAt, userId]
  );

  console.log('[Creem Webhook] Subscription activated successfully');
}

/**
 * Handle subscription.renewed event
 */
async function handleSubscriptionRenewed(data: any) {
  console.log('[Creem Webhook] Handling subscription.renewed');

  const userId = data.metadata?.user_id;

  if (!userId) {
    console.error('[Creem Webhook] No user_id in metadata');
    return;
  }

  // Extend membership by 30 days from the current expiry date
  const result = await query(
    `SELECT membership_expires_at FROM users WHERE id = $1`,
    [userId]
  );

  const currentExpiry = result.rows[0]?.membership_expires_at;
  const startsAt = currentExpiry && new Date(currentExpiry) > new Date()
    ? new Date(currentExpiry)
    : new Date();

  const endsAt = new Date(startsAt);
  endsAt.setDate(endsAt.getDate() + 30);

  console.log('[Creem Webhook] Renewing subscription:', {
    userId,
    startsAt,
    endsAt,
  });

  // First, end any active free cycles to avoid conflicts
  await query(
    `UPDATE membership_cycles
     SET ends_at = NOW()
     WHERE user_id = $1
       AND plan = 'free'
       AND starts_at <= NOW()
       AND ends_at > NOW()`,
    [userId]
  );

  // Create a new membership cycle
  await query(
    `INSERT INTO membership_cycles (user_id, plan, starts_at, ends_at, topic_quota, event_quota_per_topic, source)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, 'pro', startsAt, endsAt, 999, 999, 'creem_subscription']
  );

  // Update user's membership_expires_at
  await query(
    `UPDATE users
     SET membership_expires_at = $1, updated_at = NOW()
     WHERE id = $2`,
    [endsAt, userId]
  );

  console.log('[Creem Webhook] Subscription renewed successfully');
}

/**
 * Handle subscription.cancelled event
 */
async function handleSubscriptionCancelled(data: any) {
  console.log('[Creem Webhook] Handling subscription.cancelled');

  const userId = data.metadata?.user_id;

  if (!userId) {
    console.error('[Creem Webhook] No user_id in metadata');
    return;
  }

  console.log('[Creem Webhook] Subscription cancelled for user:', userId);
  // Note: We don't immediately revoke access - let it expire naturally
  console.log('[Creem Webhook] Membership will expire at the end of current cycle');
}

export const config = {
  maxDuration: 10,
  api: {
    bodyParser: true,
  },
};
