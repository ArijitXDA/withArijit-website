/*
  # Remove foreign key constraint from payments table

  1. Changes
    - Remove foreign key constraint between payments and users tables
    - Allow payments to be made by both authenticated and guest users
    - Keep user_id as text field for flexibility

  2. Security
    - Payments table still has RLS enabled
    - Guest payments use unique identifiers
*/

-- Remove the foreign key constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;

-- Update the user_id column comment to reflect the change
COMMENT ON COLUMN payments.user_id IS 'User identifier - can be authenticated user ID or guest identifier';