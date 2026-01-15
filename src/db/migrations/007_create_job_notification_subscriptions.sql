-- 007_create_job_notification_subscriptions.sql
-- Table to track students who want to receive job notifications

CREATE TABLE job_notification_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id)
);

-- Index for faster lookups
CREATE INDEX idx_job_notification_subscriptions_student_id ON job_notification_subscriptions(student_id);
CREATE INDEX idx_job_notification_subscriptions_is_active ON job_notification_subscriptions(student_id, is_active);

COMMENT ON TABLE job_notification_subscriptions IS 'Tracks students who opted in to receive job notifications via email';
