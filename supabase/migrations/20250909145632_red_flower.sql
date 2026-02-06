/*
  # Add discount tracking fields to payments table

  1. New Columns
    - `discount_coupon_code` (text) - Email ID or coupon code entered
    - `discount_percentage_availed` (numeric) - Percentage discount applied
    - `discount_amount_availed` (numeric) - Actual discount amount in currency

  2. Updates
    - Add indexes for better query performance
    - Update existing records to populate discount fields based on referred_by_email

  3. Data Migration
    - Populate discount fields for existing payments that have referral emails
*/

-- Add discount tracking columns to payments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'discount_coupon_code'
  ) THEN
    ALTER TABLE payments ADD COLUMN discount_coupon_code text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'discount_percentage_availed'
  ) THEN
    ALTER TABLE payments ADD COLUMN discount_percentage_availed numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'discount_amount_availed'
  ) THEN
    ALTER TABLE payments ADD COLUMN discount_amount_availed numeric DEFAULT 0;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_discount_coupon_code ON payments(discount_coupon_code);
CREATE INDEX IF NOT EXISTS idx_payments_discount_percentage ON payments(discount_percentage_availed);

-- Update existing records that have referral emails
UPDATE payments 
SET 
  discount_coupon_code = referred_by_email,
  discount_percentage_availed = 7.0,
  discount_amount_availed = CASE 
    WHEN currency = 'USD' THEN amount * 0.07
    ELSE amount * 0.07
  END
WHERE referred_by_email IS NOT NULL 
  AND discount_coupon_code IS NULL;

-- Update records with known coupon codes
UPDATE payments 
SET 
  discount_coupon_code = CASE 
    WHEN discount_coupon_code IS NULL AND amount < (CASE WHEN currency = 'USD' THEN 149 ELSE 2999 END) THEN '44agentx44'
    ELSE discount_coupon_code
  END,
  discount_percentage_availed = CASE 
    WHEN discount_percentage_availed = 0 AND amount < (CASE WHEN currency = 'USD' THEN 149 ELSE 2999 END) THEN 15.0
    ELSE discount_percentage_availed
  END,
  discount_amount_availed = CASE 
    WHEN discount_amount_availed = 0 AND amount < (CASE WHEN currency = 'USD' THEN 149 ELSE 2999 END) THEN amount * 0.15
    ELSE discount_amount_availed
  END
WHERE payment_status = 'success';