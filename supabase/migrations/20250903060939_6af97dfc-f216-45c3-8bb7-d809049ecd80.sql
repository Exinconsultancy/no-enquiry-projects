-- Create a security definer function to safely check user roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Drop the problematic policy and create a new one using the function
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a safe admin policy using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON profiles 
FOR SELECT 
TO authenticated 
USING (
  public.get_current_user_role() = 'admin' 
  OR 
  auth.uid() = user_id
);