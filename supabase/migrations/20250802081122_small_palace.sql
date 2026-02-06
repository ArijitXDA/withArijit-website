/*
  # Create trigger to automatically insert user records

  1. New Functions
    - `handle_new_user()` - Function to insert user data into users table when auth user is created
  
  2. New Triggers  
    - Trigger on auth.users INSERT to call handle_new_user()
  
  3. Security
    - Function runs with security definer privileges to bypass RLS
*/

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    user_id,
    name,
    mobile_no,
    email,
    age,
    occupation,
    password_hash
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'mobile_no', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, 0),
    COALESCE(NEW.raw_user_meta_data->>'occupation', ''),
    NEW.encrypted_password
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically call the function when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();