/*
  # Fix contact submissions RLS policy

  1. Security Changes
    - Drop existing restrictive policies
    - Create new policy that allows anonymous submissions
    - Ensure proper access for both anon and authenticated users

  2. Policy Updates
    - Allow INSERT for anonymous and authenticated users
    - Allow SELECT for authenticated users only (admin access)
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Admin can view all contact submissions" ON contact_submissions;

-- Create new policies with proper permissions
CREATE POLICY "Allow contact form submissions"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin to view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);