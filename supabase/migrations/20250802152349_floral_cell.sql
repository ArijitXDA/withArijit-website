/*
  # Fix payments table RLS policy

  1. Security Changes
    - Drop all existing INSERT policies on payments table
    - Create new policy that allows both authenticated and anonymous users to insert payments
    - Ensure the policy uses WITH CHECK (true) to allow all insertions

  This resolves the "new row violates row-level security policy" error.
*/

-- Drop all existing INSERT policies on payments table
DROP POLICY IF EXISTS "Enable payment insertions for all users" ON payments;
DROP POLICY IF EXISTS "Allow all payment insertions" ON payments;
DROP POLICY IF EXISTS "Allow payment insertions" ON payments;

-- Create a new policy that allows all users to insert payment records
CREATE POLICY "payments_insert_policy" 
ON payments 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);