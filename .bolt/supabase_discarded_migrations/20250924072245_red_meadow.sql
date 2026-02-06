/*
  # Create lead generation responses table

  1. New Tables
    - `lead_gen_responses`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `mobile` (text, required)
      - `age` (integer, optional)
      - `occupation` (text, required)
      - `organization` (text, optional)
      - `city` (text, optional)
      - `interest_areas` (text array)
      - `timeline` (text, required)
      - `needs_certificate` (boolean, optional)
      - `positive_feedback` (text, optional)
      - `negative_feedback` (text, optional)
      - `rating` (integer, required)
      - `recommend` (boolean, required)
      - `permission_publish_feedback` (boolean, required)
      - `ref1_name` (text, required)
      - `ref1_mobile` (text, required)
      - `ref2_name` (text, required)
      - `ref2_mobile` (text, required)
      - `declaration_text` (text, required)
      - `declaration_timestamp` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `lead_gen_responses` table
    - Add policy for anonymous users to insert responses
    - Add policy for authenticated users to view their own responses
*/

CREATE TABLE IF NOT EXISTS lead_gen_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  age integer,
  occupation text NOT NULL,
  organization text,
  city text,
  interest_areas text[],
  timeline text NOT NULL,
  needs_certificate boolean,
  positive_feedback text,
  negative_feedback text,
  rating integer NOT NULL,
  recommend boolean NOT NULL,
  permission_publish_feedback boolean NOT NULL,
  ref1_name text NOT NULL,
  ref1_mobile text NOT NULL,
  ref2_name text NOT NULL,
  ref2_mobile text NOT NULL,
  declaration_text text NOT NULL,
  declaration_timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lead_gen_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit lead gen responses"
  ON lead_gen_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own lead gen responses"
  ON lead_gen_responses
  FOR SELECT
  TO authenticated
  USING (email = (SELECT users.email FROM auth.users WHERE users.id = uid())::text);