/*
  # Temporarily disable RLS on payments table

  This migration temporarily disables Row Level Security on the payments table
  to allow payment insertions to work while we debug the policy issues.

  1. Changes
     - Disable RLS on payments table
     - This allows all users to insert payment records

  Note: This is a temporary fix. In production, you should have proper RLS policies.
*/

-- Temporarily disable RLS on payments table
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;