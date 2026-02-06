/*
  # Create batch session links table

  1. New Tables
    - `batch_session_links`
      - `id` (uuid, primary key)
      - `batch_id` (text, unique)
      - `course_name` (text)
      - `teams_meeting_link` (text)
      - `meeting_id` (text, optional)
      - `passcode` (text, optional)
      - `recurring_schedule` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `batch_session_links` table
    - Add policy for authenticated users to read their batch links
    - Add policy for service role to manage all links

  3. Indexes
    - Index on batch_id for fast lookups
    - Index on course_name for filtering
*/

CREATE TABLE IF NOT EXISTS batch_session_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id text UNIQUE NOT NULL,
  course_name text NOT NULL,
  teams_meeting_link text NOT NULL,
  meeting_id text,
  passcode text,
  recurring_schedule text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE batch_session_links ENABLE ROW LEVEL SECURITY;

-- Policy for students to read their batch links
CREATE POLICY "Students can view their batch session links"
  ON batch_session_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_master_table smt
      WHERE smt.email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )::text
      AND smt.batch_id = batch_session_links.batch_id
    )
  );

-- Policy for service role to manage all links
CREATE POLICY "Service role can manage all batch session links"
  ON batch_session_links
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users with admin access
CREATE POLICY "Admin access to batch session links"
  ON batch_session_links
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_batch_session_links_batch_id 
  ON batch_session_links(batch_id);

CREATE INDEX IF NOT EXISTS idx_batch_session_links_course_name 
  ON batch_session_links(course_name);

CREATE INDEX IF NOT EXISTS idx_batch_session_links_active 
  ON batch_session_links(is_active) WHERE is_active = true;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_batch_session_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_batch_session_links_updated_at
  BEFORE UPDATE ON batch_session_links
  FOR EACH ROW
  EXECUTE FUNCTION update_batch_session_links_updated_at();