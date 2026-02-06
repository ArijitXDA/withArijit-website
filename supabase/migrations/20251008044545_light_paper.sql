/*
  # AI Spots System Database Setup

  1. New Tables
    - `AIspot_master`
      - `AISpot_ID` (uuid, primary key)
      - `Type_of_Place` (text)
      - `Address` (text)
      - `Country` (text)
      - `State` (text)
      - `City` (text)
      - `Pin_Zip` (text)
      - `Telephone` (text)
      - `AISpot_Email` (text, unique)
      - `Owner_Manager_Name` (text)
      - `Mobile` (text)
      - `Email` (text)
      - `Price` (text)
      - `Ratings` (numeric)
      - `Image_URL` (text)
      - `Map_Link` (text)
      - `QR_Code_Link` (text)
      - `Consent` (boolean)
      - `Is_Approved` (boolean)
      - `Created_At` (timestamp)
      - `Updated_At` (timestamp)

  2. Table Modifications
    - Add `AISpot_ID` column to `quiz_responses` table

  3. Functions and Triggers
    - Create `generate_aispot_qr_link()` function
    - Create trigger for automatic QR link generation

  4. Security
    - Enable RLS on `AIspot_master` table
    - Add policies for public read access to approved spots
    - Add policies for admin management
*/

-- Create AIspot_master table
CREATE TABLE IF NOT EXISTS public.AIspot_master (
  AISpot_ID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  Type_of_Place text NOT NULL,
  Address text NOT NULL,
  Country text NOT NULL,
  State text NOT NULL,
  City text NOT NULL,
  Pin_Zip text NOT NULL,
  Telephone text NOT NULL,
  AISpot_Email text UNIQUE NOT NULL,
  Owner_Manager_Name text NOT NULL,
  Mobile text NOT NULL,
  Email text NOT NULL,
  Price text NOT NULL,
  Ratings numeric DEFAULT 0.0,
  Image_URL text,
  Map_Link text,
  QR_Code_Link text,
  Consent boolean NOT NULL DEFAULT false,
  Is_Approved boolean NOT NULL DEFAULT false,
  Created_At timestamptz DEFAULT now(),
  Updated_At timestamptz DEFAULT now()
);

-- Add AISpot_ID column to quiz_responses table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_responses' AND column_name = 'aispot_id'
  ) THEN
    ALTER TABLE public.quiz_responses ADD COLUMN AISpot_ID text;
  END IF;
END $$;

-- Create function to generate QR code link
CREATE OR REPLACE FUNCTION public.generate_aispot_qr_link()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate QR code link using the AISpot_ID
  NEW.QR_Code_Link := 'https://www.aiwitharijit.com/ai-readiness-quiz?spot_id=' || NEW.AISpot_ID::text;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for QR link generation
DROP TRIGGER IF EXISTS trigger_generate_qr_link ON public.AIspot_master;
CREATE TRIGGER trigger_generate_qr_link
  BEFORE INSERT ON public.AIspot_master
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_aispot_qr_link();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_aispot_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.Updated_At = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_aispot_updated_at ON public.AIspot_master;
CREATE TRIGGER update_aispot_updated_at
  BEFORE UPDATE ON public.AIspot_master
  FOR EACH ROW
  EXECUTE FUNCTION public.update_aispot_updated_at();

-- Enable RLS on AIspot_master table
ALTER TABLE public.AIspot_master ENABLE ROW LEVEL SECURITY;

-- Policy for public to view approved AI Spots
CREATE POLICY "Public can view approved AI Spots"
  ON public.AIspot_master
  FOR SELECT
  TO public
  USING (Is_Approved = true);

-- Policy for anyone to submit applications
CREATE POLICY "Anyone can submit AI Spot applications"
  ON public.AIspot_master
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy for admins to manage all AI Spots
CREATE POLICY "Admins can manage all AI Spots"
  ON public.AIspot_master
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aispot_country ON public.AIspot_master(Country);
CREATE INDEX IF NOT EXISTS idx_aispot_state ON public.AIspot_master(State);
CREATE INDEX IF NOT EXISTS idx_aispot_city ON public.AIspot_master(City);
CREATE INDEX IF NOT EXISTS idx_aispot_type ON public.AIspot_master(Type_of_Place);
CREATE INDEX IF NOT EXISTS idx_aispot_approved ON public.AIspot_master(Is_Approved);
CREATE INDEX IF NOT EXISTS idx_quiz_aispot_id ON public.quiz_responses(AISpot_ID) WHERE AISpot_ID IS NOT NULL;