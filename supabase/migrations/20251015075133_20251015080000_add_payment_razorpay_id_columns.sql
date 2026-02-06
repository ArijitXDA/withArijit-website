/*
  # Add Payment Razorpay ID Tracking Columns

  ## Purpose
  This migration adds Razorpay payment ID columns to the student_master_table to:
  - Enable duplicate payment detection across all payment slots
  - Create complete audit trail linking each payment slot to its Razorpay transaction
  - Prevent race conditions and duplicate processing in payment webhooks
  - Support data reconciliation and payment verification

  ## Changes

  1. New Columns Added
    - `1st_Payment_Razorpay_ID` (text, nullable) - Links 1st payment to Razorpay transaction
    - `2nd_Payment_Razorpay_ID` (text, nullable) - Links 2nd payment to Razorpay transaction
    - `3rd_Payment_Razorpay_ID` (text, nullable) - Links 3rd payment to Razorpay transaction
    - `4th_Payment_Razorpay_ID` (text, nullable) - Links 4th payment to Razorpay transaction

  2. Indexes
    - Individual indexes on each payment ID column for fast duplicate detection
    - Composite index for email-based payment lookups

  3. Data Integrity
    - All columns default to NULL for existing records
    - No data loss - only adding new tracking columns
    - Existing payment amounts and dates remain unchanged

  ## Notes
  - These columns will be populated by the payment webhook going forward
  - A separate data repair script will backfill IDs for existing payments
  - Having all four payment ID columns ensures consistency across all slots
*/

-- Add payment razorpay_id columns for all four payment slots
DO $$
BEGIN
  -- 1st payment razorpay ID
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_master_table' AND column_name = '1st_Payment_Razorpay_ID'
  ) THEN
    ALTER TABLE student_master_table ADD COLUMN "1st_Payment_Razorpay_ID" text DEFAULT NULL;
  END IF;

  -- 2nd payment razorpay ID
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_master_table' AND column_name = '2nd_Payment_Razorpay_ID'
  ) THEN
    ALTER TABLE student_master_table ADD COLUMN "2nd_Payment_Razorpay_ID" text DEFAULT NULL;
  END IF;

  -- 3rd payment razorpay ID
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_master_table' AND column_name = '3rd_Payment_Razorpay_ID'
  ) THEN
    ALTER TABLE student_master_table ADD COLUMN "3rd_Payment_Razorpay_ID" text DEFAULT NULL;
  END IF;

  -- 4th payment razorpay ID
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_master_table' AND column_name = '4th_Payment_Razorpay_ID'
  ) THEN
    ALTER TABLE student_master_table ADD COLUMN "4th_Payment_Razorpay_ID" text DEFAULT NULL;
  END IF;
END $$;

-- Create indexes for fast duplicate detection and lookups
CREATE INDEX IF NOT EXISTS idx_student_master_1st_razorpay_id
  ON student_master_table("1st_Payment_Razorpay_ID")
  WHERE "1st_Payment_Razorpay_ID" IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_student_master_2nd_razorpay_id
  ON student_master_table("2nd_Payment_Razorpay_ID")
  WHERE "2nd_Payment_Razorpay_ID" IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_student_master_3rd_razorpay_id
  ON student_master_table("3rd_Payment_Razorpay_ID")
  WHERE "3rd_Payment_Razorpay_ID" IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_student_master_4th_razorpay_id
  ON student_master_table("4th_Payment_Razorpay_ID")
  WHERE "4th_Payment_Razorpay_ID" IS NOT NULL;

-- Composite index for efficient email + payment ID lookups
CREATE INDEX IF NOT EXISTS idx_student_master_email_payment_ids
  ON student_master_table(email);

-- Add comment to table documenting the change
COMMENT ON COLUMN student_master_table."1st_Payment_Razorpay_ID" IS
  'Razorpay payment ID for 1st payment - used for duplicate detection and audit trail';
COMMENT ON COLUMN student_master_table."2nd_Payment_Razorpay_ID" IS
  'Razorpay payment ID for 2nd payment - used for duplicate detection and audit trail';
COMMENT ON COLUMN student_master_table."3rd_Payment_Razorpay_ID" IS
  'Razorpay payment ID for 3rd payment - used for duplicate detection and audit trail';
COMMENT ON COLUMN student_master_table."4th_Payment_Razorpay_ID" IS
  'Razorpay payment ID for 4th payment - used for duplicate detection and audit trail';
