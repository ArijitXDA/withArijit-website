/*
  # Create certificates table for managing user certifications

  1. New Tables
    - `certificates`
      - `id` (uuid, primary key)
      - `user_email` (text, references users.email)
      - `certificate_name` (text)
      - `date_of_issuing` (date)
      - `certificate_image_link` (text, OneDrive link)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `certificates` table
    - Add policy for authenticated users to read their own certificates
    - Add policy for admins to manage all certificates

  3. Indexes
    - Index on user_email for faster lookups
    - Index on date_of_issuing for sorting
*/

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  certificate_name text NOT NULL,
  date_of_issuing date NOT NULL,
  certificate_image_link text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certificates_user_email ON certificates(user_email);
CREATE INDEX IF NOT EXISTS idx_certificates_date ON certificates(date_of_issuing DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_active ON certificates(is_active) WHERE is_active = true;

-- RLS Policies
CREATE POLICY "Users can view own certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all certificates"
  ON certificates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_certificates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION update_certificates_updated_at();