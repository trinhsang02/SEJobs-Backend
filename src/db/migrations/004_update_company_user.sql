-- Add user_id column
ALTER TABLE companies
ADD COLUMN user_id INT UNIQUE;

-- Add foreign key
ALTER TABLE companies
ADD CONSTRAINT companies_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- Optional: backfill if you have existing company users
-- (skip if starting fresh)