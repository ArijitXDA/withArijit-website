/*
  # Create quiz_responses table

  1. New Tables
    - `quiz_responses`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `mobile` (text, not null)
      - `age` (integer, not null)
      - `occupation` (text, not null)
      - `q1` through `q8` (text, not null) - quiz answers
      - `score` (integer, not null)
      - `readiness_level` (text, not null)
      - `created_at` (timestamp, default now)

  2. Security
    - Enable RLS on `quiz_responses` table
    - Add policy for anyone to insert quiz responses
    - Add policy for authenticated users to view their own responses
*/

CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  age integer NOT NULL,
  occupation text NOT NULL,
  q1 text NOT NULL,
  q2 text NOT NULL,
  q3 text NOT NULL,
  q4 text NOT NULL,
  q5 text NOT NULL,
  q6 text NOT NULL,
  q7 text NOT NULL,
  q8 text NOT NULL,
  score integer NOT NULL,
  readiness_level text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit quiz responses"
  ON quiz_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own quiz responses"
  ON quiz_responses
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));