/*
  # Create MasterclassPayment table for testing

  1. New Tables
    - `masterclass_payments`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `mobile` (text, required)
      - `amount` (numeric, default 149)
      - `currency` (text, default 'INR')
      - `razorpay_order_id` (text, nullable)
      - `razorpay_payment_id` (text, nullable)
      - `payment_status` (text, default 'pending')
      - `payment_method` (text, nullable)
      - `failure_reason` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `masterclass_payments` table
    - Add policy for anyone to insert (for testing)
    - Add policy for viewing own payments

  3. Indexes
    - Index on email for faster lookups
    - Index on payment_status for filtering
    - Index on razorpay_payment_id for webhook processing
*/

CREATE TABLE IF NOT EXISTS masterclass_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  amount numeric DEFAULT 149,
  currency text DEFAULT 'INR',
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_status text DEFAULT 'pending',
  payment_method text,
  failure_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE masterclass_payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can insert masterclass payments"
  ON masterclass_payments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own masterclass payments"
  ON masterclass_payments
  FOR SELECT
  TO anon, authenticated
  USING (true); -- For testing, allow viewing all

-- Indexes
CREATE INDEX IF NOT EXISTS idx_masterclass_payments_email 
  ON masterclass_payments(email);

CREATE INDEX IF NOT EXISTS idx_masterclass_payments_status 
  ON masterclass_payments(payment_status);

CREATE INDEX IF NOT EXISTS idx_masterclass_payments_razorpay_payment_id 
  ON masterclass_payments(razorpay_payment_id);

CREATE INDEX IF NOT EXISTS idx_masterclass_payments_razorpay_order_id 
  ON masterclass_payments(razorpay_order_id);

-- Update trigger
CREATE OR REPLACE FUNCTION update_masterclass_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_masterclass_payments_updated_at
  BEFORE UPDATE ON masterclass_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_masterclass_payments_updated_at();