-- Ensure kunaldasd8@gmail.com has admin role
UPDATE profiles 
SET role = 'admin', updated_at = now() 
WHERE user_id = 'cec6d976-57b0-46a9-8edc-8766a94d4027';

-- Also ensure the profile exists and has proper admin privileges
INSERT INTO profiles (user_id, display_name, role, plan, projects_limit) 
VALUES ('cec6d976-57b0-46a9-8edc-8766a94d4027', 'Kunal', 'admin', 'Admin Access', 999)
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'admin',
  plan = 'Admin Access',
  projects_limit = 999,
  updated_at = now();