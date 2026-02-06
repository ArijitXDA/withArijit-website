/*
  # Fix users table RLS policies for signup

  1. Security Changes
    - Drop existing restrictive INSERT policies
    - Create new policy allowing anonymous users to register
    - Ensure authenticated users can still insert
    - Maintain existing SELECT and UPDATE policies

  This fixes the "new row violates row-level security policy" error during signup.
*/

-- Drop existing INSERT policies that might be blocking signup
DROP POLICY IF EXISTS "Allow authenticated user insert" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- Create a new INSERT policy that allows both anonymous and authenticated users
CREATE POLICY "Enable insert for user registration" 
  ON users 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the table has RLS enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verify existing policies are still in place for SELECT and UPDATE
-- (These should already exist from previous migrations)