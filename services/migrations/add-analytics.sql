-- Analytics and statistics tracking
-- Run this migration to add analytics tables

-- Daily analytics table
CREATE TABLE IF NOT EXISTS daily_analytics (
  date DATE NOT NULL PRIMARY KEY,
  page_views INT NOT NULL DEFAULT 0,
  unique_visitors INT NOT NULL DEFAULT 0,
  baseline_readings INT NOT NULL DEFAULT 0,
  event_readings INT NOT NULL DEFAULT 0,
  new_users INT NOT NULL DEFAULT 0,
  new_topics INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page view tracking (for unique visitor counting)
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL, -- Client-generated UUID or session ID
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  page_path TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(date(created_at));
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views(visitor_id, date(created_at));

-- Function to increment daily analytics
CREATE OR REPLACE FUNCTION increment_analytics(
  p_date DATE,
  p_field TEXT,
  p_increment INT DEFAULT 1
) RETURNS VOID AS $$
BEGIN
  -- Insert or update the analytics record
  INSERT INTO daily_analytics (date, page_views, unique_visitors, baseline_readings, event_readings, new_users, new_topics)
  VALUES (
    p_date,
    CASE WHEN p_field = 'page_views' THEN p_increment ELSE 0 END,
    CASE WHEN p_field = 'unique_visitors' THEN p_increment ELSE 0 END,
    CASE WHEN p_field = 'baseline_readings' THEN p_increment ELSE 0 END,
    CASE WHEN p_field = 'event_readings' THEN p_increment ELSE 0 END,
    CASE WHEN p_field = 'new_users' THEN p_increment ELSE 0 END,
    CASE WHEN p_field = 'new_topics' THEN p_increment ELSE 0 END
  )
  ON CONFLICT (date)
  DO UPDATE SET
    page_views = CASE WHEN p_field = 'page_views' THEN daily_analytics.page_views + p_increment ELSE daily_analytics.page_views END,
    unique_visitors = CASE WHEN p_field = 'unique_visitors' THEN daily_analytics.unique_visitors + p_increment ELSE daily_analytics.unique_visitors END,
    baseline_readings = CASE WHEN p_field = 'baseline_readings' THEN daily_analytics.baseline_readings + p_increment ELSE daily_analytics.baseline_readings END,
    event_readings = CASE WHEN p_field = 'event_readings' THEN daily_analytics.event_readings + p_increment ELSE daily_analytics.event_readings END,
    new_users = CASE WHEN p_field = 'new_users' THEN daily_analytics.new_users + p_increment ELSE daily_analytics.new_users END,
    new_topics = CASE WHEN p_field = 'new_topics' THEN daily_analytics.new_topics + p_increment ELSE daily_analytics.new_topics END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Initial data for today
INSERT INTO daily_analytics (date)
VALUES (CURRENT_DATE)
ON CONFLICT (date) DO NOTHING;
