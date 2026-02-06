/*
  # Remove signup notification trigger

  This migration removes any existing database triggers that automatically
  call edge functions on user signup, so we can handle email sending
  manually from the application code.
*/

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS notify_signup() CASCADE;

-- Drop any triggers on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;