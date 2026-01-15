-- 006_create_job_notifications.sql
-- Create table to track sent job notifications

CREATE TABLE job_notifications_sent (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  email_address TEXT NOT NULL,
  email_sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, student_id)
);

-- Index for faster queries
CREATE INDEX idx_job_notifications_sent_job_id ON job_notifications_sent(job_id);
CREATE INDEX idx_job_notifications_sent_student_id ON job_notifications_sent(student_id);
CREATE INDEX idx_job_notifications_sent_email_sent_at ON job_notifications_sent(email_sent_at);
