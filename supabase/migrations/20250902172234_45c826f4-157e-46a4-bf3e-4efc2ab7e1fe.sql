-- Fix remaining security vulnerability in subscribers SELECT policy
-- Remove email-based access that allows users to access other users' data

-- Drop the current select policy that allows email-based access
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

-- Create secure SELECT policy: only allow user_id based access
CREATE POLICY "Users can view their own subscription" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Also update the UPDATE policy to remove email-based access for consistency
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;

CREATE POLICY "Users can update their own subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  auth.uid() = user_id AND 
  auth.email() = email
);