import { pool } from "./db.js";

export const ensureSchema = async () => {
  if (!pool) return;

  await pool.query(`create extension if not exists "pgcrypto";`);

  await pool.query(`
    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      provider text not null,
      provider_id text not null unique,
      email text,
      name text,
      avatar text,
      membership_expires_at timestamptz,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
  `);

  await pool.query(`
    create table if not exists daily_usage (
      user_id uuid references users(id) on delete cascade,
      usage_date date not null,
      count int not null default 0,
      primary key (user_id, usage_date)
    );
  `);

  await pool.query(`
    create table if not exists redemption_codes (
      code text primary key,
      duration_days int not null default 30,
      expires_at date,
      redeemed_by uuid references users(id),
      redeemed_at timestamptz,
      created_at timestamptz default now()
    );
  `);

  await pool.query(`
    create table if not exists membership_cycles (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      plan text not null default 'free',
      starts_at timestamptz not null default now(),
      ends_at timestamptz not null,
      topic_quota int not null default 1,
      event_quota_per_topic int not null default 3,
      source text default 'redeem',
      created_at timestamptz default now()
    );
  `);

  await pool.query(`
    create table if not exists topics (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      cycle_id uuid references membership_cycles(id) on delete set null,
      title text not null,
      language text default 'zh',
      baseline_cards jsonb,
      baseline_reading text,
      status text default 'active',
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
  `);

  await pool.query(`
    create table if not exists topic_events (
      id uuid primary key default gen_random_uuid(),
      topic_id uuid references topics(id) on delete cascade,
      cycle_id uuid references membership_cycles(id) on delete set null,
      user_id uuid references users(id) on delete cascade,
      name text not null,
      cards jsonb,
      reading text,
      created_at timestamptz default now()
    );
  `);

  await pool.query(`create index if not exists idx_topics_user on topics(user_id);`);
  await pool.query(`create index if not exists idx_topic_events_topic on topic_events(topic_id);`);
};
