import { getPool } from "./db.js";

export const ensureSchema = async () => {
  const pool = getPool();
  if (!pool) {
    console.warn("[Schema] Pool not available, skipping schema initialization");
    return;
  }

  console.log("[Schema] Starting schema initialization...");

  try {
    // Try to create pgcrypto extension, but don't fail if it doesn't work
    // (Neon pooled connections may not support this)
    try {
      await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
      console.log("[Schema] pgcrypto extension ensured");
    } catch (extError) {
      console.warn("[Schema] Could not create pgcrypto extension (may already exist or not needed):", extError.message);
    }

    // Create all tables in a single transaction for better performance
    console.log("[Schema] Creating tables...");
    await pool.query(`
      BEGIN;

      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        provider TEXT NOT NULL,
        provider_id TEXT NOT NULL UNIQUE,
        email TEXT,
        name TEXT,
        avatar TEXT,
        membership_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS daily_usage (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        usage_date DATE NOT NULL,
        count INT NOT NULL DEFAULT 0,
        PRIMARY KEY (user_id, usage_date)
      );

      CREATE TABLE IF NOT EXISTS redemption_codes (
        code TEXT PRIMARY KEY,
        duration_days INT NOT NULL DEFAULT 30,
        expires_at DATE,
        redeemed_by UUID REFERENCES users(id),
        redeemed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS membership_cycles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        plan TEXT NOT NULL DEFAULT 'free',
        starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ends_at TIMESTAMPTZ NOT NULL,
        topic_quota INT NOT NULL DEFAULT 1,
        event_quota_per_topic INT NOT NULL DEFAULT 3,
        source TEXT DEFAULT 'redeem',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS topics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        cycle_id UUID REFERENCES membership_cycles(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        language TEXT DEFAULT 'zh',
        baseline_cards JSONB,
        baseline_reading TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS topic_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
        cycle_id UUID REFERENCES membership_cycles(id) ON DELETE SET NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        cards JSONB,
        reading TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_topics_user ON topics(user_id);
      CREATE INDEX IF NOT EXISTS idx_topic_events_topic ON topic_events(topic_id);

      COMMIT;
    `);

    console.log("[Schema] Schema initialization completed successfully");
  } catch (error) {
    console.error("[Schema] Schema initialization failed:", error);
    console.error("[Schema] Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });

    // Try to rollback if we're in a transaction
    try {
      await pool.query('ROLLBACK;');
    } catch (rollbackError) {
      // Ignore rollback errors
    }

    throw error;
  }
};
