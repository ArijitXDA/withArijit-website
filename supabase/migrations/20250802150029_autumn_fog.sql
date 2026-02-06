/*
  # Allow payment insertions for all users

  1. Security Changes
    - Add policy to allow both authenticated and anonymous users to insert payment records
    - This enables the payment flow to work for both logged-in users and guests
    - Maintains existing policies for viewing own payments

  2. Notes
    - Payment records can be created by anyone (needed for guest payments)
    - Users can still only view their own payment records
    - This follows the common e-commerce pattern where payments can be made without registration
*/

-- Add policy to allow payment insertions for both authenticated and anonymous users
CREATE POLICY "Allow payment insertions for all users"
  ON payments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);