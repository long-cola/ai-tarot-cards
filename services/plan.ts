import { getPool } from './db.js';
import { User } from './jwt.js';

const addDays = (date: Date, days: number): Date => {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
};

const topicQuotaForDuration = (durationDays: number = 30): number => {
  const months = Math.max(1, Math.round(durationDays / 30));
  return months * 30;
};

const eventQuotaPerTopic = 500;

export async function startMembershipCycle({
  userId,
  durationDays = 30,
  source = 'redeem',
}: {
  userId: string;
  durationDays?: number;
  source?: string;
}) {
  const pool = getPool();
  const now = new Date();
  const ends_at = addDays(now, durationDays);
  const insert = await pool.query(
    `INSERT INTO membership_cycles (user_id, plan, starts_at, ends_at, topic_quota, event_quota_per_topic, source)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [userId, 'member', now, ends_at, topicQuotaForDuration(durationDays), eventQuotaPerTopic, source]
  );
  return insert.rows[0];
}

const defaultCycleForUser = (user: User) => {
  const now = new Date();
  const membershipValid =
    user?.membership_expires_at && new Date(user.membership_expires_at) > now;
  // Use 'member' as the standard paid plan name (pro is also treated as member)
  const plan = membershipValid ? 'member' : 'free';
  const ends_at = membershipValid ? new Date(user.membership_expires_at!) : addDays(now, 365);

  return {
    plan,
    starts_at: now,
    ends_at,
    topic_quota: membershipValid
      ? topicQuotaForDuration(Math.ceil((ends_at.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 1,
    event_quota_per_topic: membershipValid ? eventQuotaPerTopic : 3,
    source: membershipValid ? 'membership' : 'free-default',
  };
};

export async function ensureActiveCycleForUser(user: User) {
  const pool = getPool();

  const existing = await pool.query(
    `SELECT * FROM membership_cycles
     WHERE user_id=$1 AND starts_at <= NOW() AND ends_at > NOW()
     ORDER BY starts_at DESC
     LIMIT 1`,
    [user.id]
  );

  if (existing.rows.length) return existing.rows[0];

  const fallback = defaultCycleForUser(user);
  const insert = await pool.query(
    `INSERT INTO membership_cycles (user_id, plan, starts_at, ends_at, topic_quota, event_quota_per_topic, source)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [
      user.id,
      fallback.plan,
      fallback.starts_at,
      fallback.ends_at,
      fallback.topic_quota,
      fallback.event_quota_per_topic,
      fallback.source,
    ]
  );

  return insert.rows[0];
}

export async function getCycleTopicCounts(userId: string, cycleId: string): Promise<number> {
  const pool = getPool();
  const res = await pool.query(
    `SELECT COUNT(*) as count FROM topics WHERE user_id=$1 AND cycle_id=$2`,
    [userId, cycleId]
  );
  return Number(res.rows[0]?.count ?? 0);
}

export async function getLastTopicIdForUser(userId: string): Promise<string | null> {
  const pool = getPool();
  const res = await pool.query(
    `SELECT id FROM topics WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return res.rows[0]?.id ?? null;
}

export async function getPlanQuotaSummary(user: User) {
  const cycle = await ensureActiveCycleForUser(user);
  if (!cycle) return null;

  const topicCount = await getCycleTopicCounts(user.id, cycle.id);
  const remainingTopics = Math.max((cycle.topic_quota ?? 0) - topicCount, 0);
  const downgradeLimitedTopicId =
    cycle.plan === 'free' ? await getLastTopicIdForUser(user.id) : null;

  return {
    plan: (cycle.plan === 'member' || cycle.plan === 'pro') ? 'member' : 'free',
    topic_quota_total: cycle.topic_quota,
    topic_quota_remaining: remainingTopics,
    event_quota_per_topic: cycle.event_quota_per_topic,
    expires_at: cycle.ends_at,
    downgrade_limited_topic_id: downgradeLimitedTopicId,
    cycle,
  };
}
