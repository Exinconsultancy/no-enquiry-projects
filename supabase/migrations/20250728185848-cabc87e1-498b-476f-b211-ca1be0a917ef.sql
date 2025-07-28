-- Add test role to allow testing without subscriptions
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'test';

-- Insert a test user profile (you can use this email to sign up)
INSERT INTO public.profiles (user_id, display_name, role, projects_limit, projects_viewed)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Test User',
  'test',
  999999,
  0
) ON CONFLICT (user_id) DO UPDATE SET
  role = 'test',
  projects_limit = 999999;