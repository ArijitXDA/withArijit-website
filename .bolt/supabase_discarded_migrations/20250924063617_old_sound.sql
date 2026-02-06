/*
  # Add INSERT policy for quiz responses

  1. Security
    - Add policy to allow anonymous users to insert quiz responses
    - Allow both authenticated and anonymous users to submit quiz data
*/

-- Add INSERT policy for quiz_responses table
CREATE POLICY "Anyone can submit quiz responses"
  ON quiz_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);