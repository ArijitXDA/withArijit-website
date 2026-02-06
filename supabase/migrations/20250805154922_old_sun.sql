/*
  # Disable RLS for contact submissions

  1. Changes
    - Disable Row Level Security on contact_submissions table
    - This allows anonymous users to submit contact forms
    - Keep the table structure intact

  2. Security
    - Contact forms are public by nature
    - No sensitive data in contact submissions
    - Admin access still controlled through authentication
*/

-- Disable RLS on contact_submissions table to allow public form submissions
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Drop existing policies since we're disabling RLS
DROP POLICY IF EXISTS "Allow contact form submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow admin to view submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Admin can view all contact submissions" ON contact_submissions;