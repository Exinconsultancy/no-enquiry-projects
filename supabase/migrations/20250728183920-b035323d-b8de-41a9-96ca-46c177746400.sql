-- Update profiles table to have role column with proper values
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

-- Update any existing NULL roles to 'user'
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;

-- Create admin user profile (you can change the email to your preference)
INSERT INTO public.profiles (user_id, display_name, role) 
VALUES (gen_random_uuid(), 'Admin User', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- The profiles table already has: user, admin roles supported
-- Let's add builder role support if not already there
-- No changes needed to table structure