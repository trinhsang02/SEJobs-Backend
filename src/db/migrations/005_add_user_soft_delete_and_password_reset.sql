-- 005_add_user_soft_delete_and_password_reset.sql
-- Adds is_active soft delete and password reset token columns

BEGIN;

-- Add soft-delete column (defaults to active)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Add password reset fields (nullable)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS reset_token text,
  ADD COLUMN IF NOT EXISTS reset_token_expires timestamptz;

-- Speed up reset token lookup
CREATE INDEX IF NOT EXISTS users_reset_token_idx
  ON public.users (reset_token)
  WHERE reset_token IS NOT NULL;

COMMIT;