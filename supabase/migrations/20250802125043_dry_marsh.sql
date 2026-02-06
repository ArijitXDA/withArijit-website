/*
  # Remove all signup notification triggers

  1. Remove triggers
    - Drop any triggers on auth.users table
    - Drop the signup notification function
  
  2. Clean up
    - Ensure no automatic function calls on user signup
*/

-- Drop any existing triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the signup notification function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Also check for any other potential triggers
DROP TRIGGER IF EXISTS signup_notification_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.signup_notification();