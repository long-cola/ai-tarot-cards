-- Migration: Add weekly quota tracking tables for new quota system
-- This migration adds tables to support:
-- 1. Weekly topic quota for free users (no cycle concept)
-- 2. Downgrade snapshots to preserve event counts when Pro users downgrade

-- Weekly topic usage tracking for free users
CREATE TABLE IF NOT EXISTS weekly_topic_usage (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,  -- Monday date, e.g. 2025-12-23
  count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, week_start)
);

-- Index for fast weekly quota lookups
CREATE INDEX IF NOT EXISTS idx_weekly_topic_usage_week ON weekly_topic_usage(user_id, week_start);

-- Topic event snapshots for downgrade handling
-- When a Pro user downgrades to Free, we snapshot each topic's event count
-- This allows: "each existing topic can add 3 more events after downgrade"
CREATE TABLE IF NOT EXISTS topic_event_snapshots (
  topic_id UUID PRIMARY KEY REFERENCES topics(id) ON DELETE CASCADE,
  event_count_at_downgrade INT NOT NULL,  -- Number of events when downgraded
  downgrade_at TIMESTAMPTZ NOT NULL,      -- When the downgrade happened
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast snapshot lookups
CREATE INDEX IF NOT EXISTS idx_topic_event_snapshots_downgrade ON topic_event_snapshots(downgrade_at DESC);

-- Add comments
COMMENT ON TABLE weekly_topic_usage IS 'Tracks weekly topic creation for free users (resets every Monday)';
COMMENT ON TABLE topic_event_snapshots IS 'Snapshots topic event counts when Pro users downgrade to Free';
