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
};
