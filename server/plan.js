import { pool } from "./db.js";

const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
};

const topicQuotaForDuration = (durationDays = 30) => {
  const months = Math.max(1, Math.round(durationDays / 30));
  return months * 30;
};

const eventQuotaPerTopic = 500;

export const startMembershipCycle = async ({ userId, durationDays = 30, source = "redeem" }) => {
  if (!pool || !userId) return null;
  const now = new Date();
  const ends_at = addDays(now, durationDays);
  const insert = await pool.query(
    `insert into membership_cycles (user_id, plan, starts_at, ends_at, topic_quota, event_quota_per_topic, source)
     values ($1,$2,$3,$4,$5,$6,$7)
     returning *`,
    [userId, "member", now, ends_at, topicQuotaForDuration(durationDays), eventQuotaPerTopic, source]
  );
  return insert.rows[0];
};

const defaultCycleForUser = (user) => {
  const now = new Date();
  const membershipValid = user?.membership_expires_at && new Date(user.membership_expires_at) > now;
  const plan = membershipValid ? "member" : "free";
  const ends_at = membershipValid ? new Date(user.membership_expires_at) : addDays(now, 365);

  return {
    plan,
    starts_at: now,
    ends_at,
    topic_quota: membershipValid ? topicQuotaForDuration(Math.ceil((ends_at - now) / (1000 * 60 * 60 * 24))) : 1,
    event_quota_per_topic: membershipValid ? eventQuotaPerTopic : 3,
    source: membershipValid ? "membership" : "free-default",
  };
};

export const ensureActiveCycleForUser = async (user) => {
  if (!pool || !user?.id) return null;

  const existing = await pool.query(
    `select * from membership_cycles
     where user_id=$1 and starts_at <= now() and ends_at > now()
     order by starts_at desc
     limit 1`,
    [user.id]
  );

  if (existing.rows.length) return existing.rows[0];

  const fallback = defaultCycleForUser(user);
  const insert = await pool.query(
    `insert into membership_cycles (user_id, plan, starts_at, ends_at, topic_quota, event_quota_per_topic, source)
     values ($1,$2,$3,$4,$5,$6,$7)
     returning *`,
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
};

export const getCycleTopicCounts = async (userId, cycleId) => {
  if (!pool || !userId || !cycleId) return 0;
  const res = await pool.query(
    `select count(*) as count from topics where user_id=$1 and cycle_id=$2`,
    [userId, cycleId]
  );
  return Number(res.rows[0]?.count ?? 0);
};

export const getLastTopicIdForUser = async (userId) => {
  if (!pool || !userId) return null;
  const res = await pool.query(
    `select id from topics where user_id=$1 order by created_at desc limit 1`,
    [userId]
  );
  return res.rows[0]?.id ?? null;
};

export const getPlanQuotaSummary = async (user) => {
  if (!pool || !user?.id) return null;

  const cycle = await ensureActiveCycleForUser(user);
  if (!cycle) return null;

  const topicCount = await getCycleTopicCounts(user.id, cycle.id);
  const remainingTopics = Math.max((cycle.topic_quota ?? 0) - topicCount, 0);
  const downgradeLimitedTopicId =
    cycle.plan === "free" ? await getLastTopicIdForUser(user.id) : null;

  return {
    plan: cycle.plan === "member" ? "member" : "free",
    topic_quota_total: cycle.topic_quota,
    topic_quota_remaining: remainingTopics,
    event_quota_per_topic: cycle.event_quota_per_topic,
    expires_at: cycle.ends_at,
    downgrade_limited_topic_id: downgradeLimitedTopicId,
    cycle,
  };
};
