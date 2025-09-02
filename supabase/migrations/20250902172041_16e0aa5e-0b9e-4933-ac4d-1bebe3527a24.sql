-- Fix critical security vulnerability in subscribers table RLS policies
-- Current policies allow anyone to insert/update subscription records

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure INSERT policy: only authenticated users can create their own subscription records
CREATE POLICY "Users can insert their own subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  auth.email() = email
);

-- Create secure UPDATE policy: only users can update their own subscriptions
CREATE POLICY "Users can update their own subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() = user_id OR 
  auth.email() = email
)
WITH CHECK (
  auth.uid() = user_id AND 
  auth.email() = email
);

-- Create secure policy for edge functions to update subscription data
-- This allows service role to bypass RLS for Stripe webhook/edge function updates
CREATE POLICY "Service role can manage subscriptions" 
ON public.subscribers 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Ensure user_id column is not nullable for better security
-- (Skip if this would break existing data)
-- ALTER TABLE public.subscribers ALTER COLUMN user_id SET NOT NULL;