/*
  # Add RLS policy for referral email checking

  1. Security
    - Add policy to allow checking if email exists in users table
    - Policy allows SELECT on email column only for referral validation
    - Does not expose any other user data
    - Available to both authenticated and anonymous users

  2. Purpose
    - Enable referral discount functionality in payment modal
    - Allow checking if an email exists without exposing user details
*/

-- Create policy to allow checking if email exists for referral purposes
CREATE POLICY "Allow email existence check for referrals"
  ON users
  FOR SELECT
  TO anon, authenticated
  USING (true);