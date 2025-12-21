-- Migration: Add shared_readings table for shareable reading links
-- This table stores all types of shareable readings (quick readings, topic events, baselines)

CREATE TABLE IF NOT EXISTS shared_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Type of shared reading
  share_type VARCHAR(20) NOT NULL CHECK (share_type IN ('quick', 'topic_event', 'topic_baseline')),

  -- For quick readings
  question TEXT,
  cards JSONB,
  reading TEXT,
  language VARCHAR(5),

  -- For topic events and baselines (reference to existing data)
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  event_id UUID REFERENCES topic_events(id) ON DELETE CASCADE,

  -- Metadata
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Indexes
  CONSTRAINT check_share_type_data CHECK (
    (share_type = 'quick' AND question IS NOT NULL AND cards IS NOT NULL AND reading IS NOT NULL) OR
    (share_type = 'topic_event' AND event_id IS NOT NULL) OR
    (share_type = 'topic_baseline' AND topic_id IS NOT NULL)
  )
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_shared_readings_type ON shared_readings(share_type);
CREATE INDEX IF NOT EXISTS idx_shared_readings_topic_id ON shared_readings(topic_id) WHERE topic_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_shared_readings_event_id ON shared_readings(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_shared_readings_created_by ON shared_readings(created_by) WHERE created_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_shared_readings_created_at ON shared_readings(created_at DESC);

-- Add comment
COMMENT ON TABLE shared_readings IS 'Stores shareable tarot readings for public viewing via links';
