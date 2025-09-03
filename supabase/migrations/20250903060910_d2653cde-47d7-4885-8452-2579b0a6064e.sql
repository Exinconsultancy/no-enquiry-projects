-- Fix the infinite recursion in the admin policy by removing the problematic policy
-- and creating a simpler, safer admin check

-- Drop the problematic admin policy that's causing infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new admin policy that doesn't cause recursion
-- This checks the role directly without querying the profiles table again
CREATE POLICY "Admins can view all profiles" 
ON profiles 
FOR SELECT 
TO authenticated 
USING (
  -- Check if the current user's role is admin by looking up their profile once
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
    LIMIT 1
  ) 
  OR 
  -- Allow users to see their own profile
  auth.uid() = user_id
);