/*
  # Add payment status tracking columns

  1. New Columns
    - `payment_status` (text) - tracks payment status: 'pending', 'success', 'failed', 'cancelled'
    - `razorpay_payment_id` (text) - stores Razorpay's payment ID
    - `razorpay_order_id` (text) - stores Razorpay's order ID
    - `payment_method` (text) - stores payment method used
    - `failure_reason` (text) - stores failure reason if payment fails

  2. Updates
    - Set default status to 'pending' for existing records
    - Add indexes for better query performance
*/

-- Add new columns to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
ADD COLUMN IF NOT EXISTS razorpay_order_id text,
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS failure_reason text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Update existing records to have 'pending' status
UPDATE payments 
SET payment_status = 'pending', updated_at = now() 
WHERE payment_status IS NULL;

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payments_updated_at();