/*
  # Create signup notification trigger

  1. New Functions
    - `notify_signup()` - Function to call edge function when user signs up
  
  2. New Triggers  
    - Trigger on auth.users table to call notification function
    
  3. Security
    - Function runs with security definer privileges
*/

-- Create function to call edge function
CREATE OR REPLACE FUNCTION notify_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the edge function
  PERFORM
    net.http_post(
      url := 'https://your-project-ref.supabase.co/functions/v1/signup-notification',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}',
      body := json_build_object(
        'type', 'INSERT',
        'table', 'users', 
        'record', row_to_json(NEW),
        'schema', 'auth'
      )::text
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION notify_signup();