-- Migration: Add topic_full share type to shared_readings table
-- This allows sharing entire topics with all events

-- Drop the existing constraints
ALTER TABLE shared_readings DROP CONSTRAINT IF EXISTS shared_readings_share_type_check;
ALTER TABLE shared_readings DROP CONSTRAINT IF EXISTS check_share_type_data;

-- Add updated share_type check constraint with topic_full
ALTER TABLE shared_readings ADD CONSTRAINT shared_readings_share_type_check
  CHECK (share_type IN ('quick', 'topic_event', 'topic_baseline', 'topic_full'));

-- Add updated data validation constraint with topic_full
ALTER TABLE shared_readings ADD CONSTRAINT check_share_type_data CHECK (
  (share_type = 'quick' AND question IS NOT NULL AND cards IS NOT NULL AND reading IS NOT NULL) OR
  (share_type = 'topic_event' AND event_id IS NOT NULL) OR
  (share_type = 'topic_baseline' AND topic_id IS NOT NULL) OR
  (share_type = 'topic_full' AND topic_id IS NOT NULL)
);

-- Add comment
COMMENT ON COLUMN shared_readings.share_type IS 'Type of share: quick, topic_event, topic_baseline, or topic_full';
