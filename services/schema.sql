-- Lightweight schema for Vercel Functions + Neon + JWT
-- No Auth.js, simple and practical

-- Users table (OAuth users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  email TEXT,
  name TEXT,
  avatar TEXT,
  membership_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_id)
);

-- Admin users (separate from regular users for security)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily usage tracking
CREATE TABLE IF NOT EXISTS daily_usage (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL,
  count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, usage_date)
);

-- Redemption codes for membership
CREATE TABLE IF NOT EXISTS redemption_codes (
  code TEXT PRIMARY KEY,
  duration_days INT NOT NULL DEFAULT 30,
  expires_at DATE,
  redeemed_by UUID REFERENCES users(id),
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membership cycles
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

-- Topics (user's tarot reading topics)
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

-- Topic events (timeline entries for each topic)
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

-- AI Prompts (configurable prompt templates)
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'zh',
  trigger_type TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]',
  template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(key, language)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_topics_user ON topics(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_events_topic ON topic_events(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_events_user ON topic_events(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_cycles_user ON membership_cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_usage(user_id, usage_date);
CREATE INDEX IF NOT EXISTS idx_prompts_key_language ON prompts(key, language);
CREATE INDEX IF NOT EXISTS idx_prompts_trigger_type ON prompts(trigger_type);
