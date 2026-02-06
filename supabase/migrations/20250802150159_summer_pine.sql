/*
  # Fix payments table RLS policy for anonymous insertions

  1. Changes
    - Drop the conflicting INSERT policy that requires authenticated users
    - Keep the existing policy that allows all users to insert payments
    - Ensure anonymous users can create payment records

  2. Security
    - Maintains existing SELECT policies for user data protection
    - Allows payment creation for both authenticated and anonymous users
*/

-- Drop the restrictive INSERT policy that only allows authenticated users
DROP POLICY IF EXISTS "Users can insert own payments" ON payments;

-- Ensure the permissive policy exists and allows all users to insert
DROP POLICY IF EXISTS "Allow payment insertions for all users" ON payments;

CREATE POLICY "Allow payment insertions for all users"
  ON payments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);