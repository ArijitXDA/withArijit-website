/*
  # Remove all signup triggers and functions

  This migration removes any database triggers that automatically call edge functions
  when users sign up, so we can control the email sending manually from the application.

  1. Drop any triggers on auth.users table
  2. Drop any trigger functions
  3. Clean up any webhook configurations
*/

-- Drop any triggers on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop any trigger functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.send_signup_notification();

-- Remove any webhook configurations (if they exist)
-- Note: Webhooks are typically configured via Supabase dashboard, not SQL