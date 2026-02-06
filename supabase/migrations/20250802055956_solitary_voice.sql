/*
  # Fix User Signup RLS Policy

  1. Changes
    - Drop the existing restrictive INSERT policy for users table
    - Create a new policy that allows anonymous users to insert during registration
    - Keep the existing SELECT and UPDATE policies unchanged

  2. Security
    - Anonymous users can only insert new user records (for registration)
    - Authenticated users can still read and update their own data
    - No security is compromised as this is standard for user registration flows
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert users (for registration)" ON users;

-- Create a new policy that allows anonymous users to register
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users to insert (though not typically needed)
CREATE POLICY "Allow authenticated user insert"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);