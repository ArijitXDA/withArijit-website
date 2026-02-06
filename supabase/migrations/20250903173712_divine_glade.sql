/*
  # Add referral tracking to payments table

  1. New Columns
    - `referred_by_email` (text, nullable) - Email of the person who referred this student
  
  2. Changes
    - Add new column to track referrals
    - Add index for efficient referral queries
  
  3. Security
    - No RLS changes needed as existing policies cover new column
*/

-- Add referral tracking column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'referred_by_email'
  ) THEN
    ALTER TABLE payments ADD COLUMN referred_by_email text;
  END IF;
END $$;

-- Add index for efficient referral queries
CREATE INDEX IF NOT EXISTS idx_payments_referred_by_email 
ON payments (referred_by_email) 
WHERE referred_by_email IS NOT NULL;