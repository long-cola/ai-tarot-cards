import { getPool } from './db.js';
import { User } from './jwt.js';
import { ensureActiveCycleForUser, getCycleTopicCounts } from './plan.js';

/**
 * Get this Monday's date (start of current week)
 * Returns YYYY-MM-DD format
 */
export function getThisWeekMonday(): string {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0=Sunday, 1=Monday, ...
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - daysFromMonday);
  monday.setUTCHours(0, 0, 0, 0);

  return monday.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

/**
 * Get next Monday's date (for displaying "resets on")
 * Returns YYYY-MM-DD format
 */
export function getNextMonday(): string {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // If Sunday, 1 day; otherwise 8 - dayOfWeek
  const nextMonday = new Date(now);
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday);
  nextMonday.setUTCHours(0, 0, 0, 0);

  return nextMonday.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

/**
 * Get the number of topics created this week by a free user
 */
export async function getWeeklyTopicCount(userId: string): Promise<number> {
  const pool = getPool();
  const weekStart = getThisWeekMonday();

  const result = await pool.query(
    'SELECT count FROM weekly_topic_usage WHERE user_id = $1 AND week_start = $2',
    [userId, weekStart]
  );

  return result.rows[0]?.count ?? 0;
}

/**
 * Increment the weekly topic count for a free user
 */
export async function incrementWeeklyTopicCount(userId: string): Promise<void> {
  const pool = getPool();
  const weekStart = getThisWeekMonday();

  await pool.query(
    `INSERT INTO weekly_topic_usage (user_id, week_start, count)
     VALUES ($1, $2, 1)
     ON CONFLICT (user_id, week_start)
     DO UPDATE SET count = weekly_topic_usage.count + 1`,
    [userId, weekStart]
  );
}

/**
 * Check if user can create a new topic
 */
export async function canCreateTopic(user: User): Promise<{
  allowed: boolean;
  reason?: string;
  remaining?: number;
}> {
  const now = new Date();
  const isPro = user?.membership_expires_at && new Date(user.membership_expires_at) > now;

  if (isPro) {
    // Pro user: check cycle quota (30 topics per cycle)
    const cycle = await ensureActiveCycleForUser(user);
    const topicCount = await getCycleTopicCounts(user.id, cycle.id);

    if (topicCount >= 30) {
      return { allowed: false, reason: 'pro_quota_exceeded', remaining: 0 };
    }
    return { allowed: true, remaining: 30 - topicCount };
  } else {
    // Free user: check weekly quota (1 topic per week)
    const weeklyCount = await getWeeklyTopicCount(user.id);

    if (weeklyCount >= 1) {
      return { allowed: false, reason: 'free_weekly_quota_exceeded', remaining: 0 };
    }
    return { allowed: true, remaining: 1 };
  }
}

/**
 * Check if user can add an event to a topic
 */
export async function canAddTopicEvent(
  user: User,
  topicId: string
): Promise<{
  allowed: boolean;
  reason?: string;
  remaining?: number;
}> {
  const pool = getPool();
  const now = new Date();
  const isPro = user?.membership_expires_at && new Date(user.membership_expires_at) > now;

  // Get current event count for this topic
  const eventCountResult = await pool.query(
    'SELECT COUNT(*) as count FROM topic_events WHERE topic_id = $1',
    [topicId]
  );
  const currentEventCount = Number(eventCountResult.rows[0]?.count ?? 0);

  if (isPro) {
    // Pro user: 500 events per topic
    if (currentEventCount >= 500) {
      return { allowed: false, reason: 'pro_event_quota_exceeded', remaining: 0 };
    }
    return { allowed: true, remaining: 500 - currentEventCount };
  } else {
    // Free user: need to check if this is a downgraded topic
    const snapshotResult = await pool.query(
      'SELECT event_count_at_downgrade FROM topic_event_snapshots WHERE topic_id = $1',
      [topicId]
    );

    if (snapshotResult.rows.length > 0) {
      // This is a downgraded topic: allow count_at_downgrade + 3 events
      const countAtDowngrade = snapshotResult.rows[0].event_count_at_downgrade;
      const allowedTotal = countAtDowngrade + 3;

      if (currentEventCount >= allowedTotal) {
        return { allowed: false, reason: 'downgraded_event_quota_exceeded', remaining: 0 };
      }
      return { allowed: true, remaining: allowedTotal - currentEventCount };
    } else {
      // This is a regular free user topic: 3 events max
      if (currentEventCount >= 3) {
        return { allowed: false, reason: 'free_event_quota_exceeded', remaining: 0 };
      }
      return { allowed: true, remaining: 3 - currentEventCount };
    }
  }
}

/**
 * Create snapshots for all user's topics when downgrading from Pro to Free
 * This preserves the event count at downgrade time, allowing +3 more events per topic
 */
export async function snapshotTopicsOnDowngrade(userId: string): Promise<void> {
  const pool = getPool();

  console.log('[snapshotTopicsOnDowngrade] Creating snapshots for user:', userId);

  // Get all topics for this user
  const topicsResult = await pool.query(
    'SELECT id FROM topics WHERE user_id = $1',
    [userId]
  );

  console.log('[snapshotTopicsOnDowngrade] Found topics:', topicsResult.rows.length);

  for (const topic of topicsResult.rows) {
    // Get current event count for this topic
    const eventCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM topic_events WHERE topic_id = $1',
      [topic.id]
    );
    const eventCount = Number(eventCountResult.rows[0]?.count ?? 0);

    // Create snapshot (if not already exists)
    await pool.query(
      `INSERT INTO topic_event_snapshots (topic_id, event_count_at_downgrade, downgrade_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (topic_id) DO NOTHING`,
      [topic.id, eventCount]
    );

    console.log('[snapshotTopicsOnDowngrade] Snapshot created for topic:', topic.id, 'events:', eventCount);
  }

  console.log('[snapshotTopicsOnDowngrade] Snapshots completed');
}
