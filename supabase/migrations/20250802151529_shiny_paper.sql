/*
  # Fix payments table RLS policy for insertions

  1. Security Changes
    - Drop existing restrictive INSERT policy
    - Create new policy allowing all users to insert payment records
    - Maintain existing SELECT policy for data privacy

  This allows both authenticated and anonymous users to create payment records,
  which is essential for e-commerce functionality where guests can make purchases.
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Allow payment insertions for all users" ON payments;

-- Create a new policy that allows all users to insert payment records
CREATE POLICY "Enable payment insertions for all users"
  ON payments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);