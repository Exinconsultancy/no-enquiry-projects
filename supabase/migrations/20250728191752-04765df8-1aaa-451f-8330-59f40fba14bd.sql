-- Create app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'builder', 'user', 'test');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Alter existing profiles table to use the enum (if not already using it)
DO $$ BEGIN
    ALTER TABLE public.profiles ALTER COLUMN role TYPE public.app_role USING role::public.app_role;
EXCEPTION
    WHEN others THEN null;
END $$;