/*
  # Add Name Field to AI Spot Table

  1. Changes
    - Add `name` column to `aispot_master` table for the AI Spot's name
    - This will store the business/venue name (e.g., "Baa Mee", "The Lounge Pub")
    - Make it required (NOT NULL) for new entries

  2. Notes
    - Existing records without names will need to be updated manually
    - For existing records, we'll allow NULL temporarily
*/

-- Add name column to aispot_master table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aispot_master' AND column_name = 'name'
  ) THEN
    ALTER TABLE public.aispot_master 
    ADD COLUMN name text;
  END IF;
END $$;

-- Add a comment to explain the column
COMMENT ON COLUMN public.aispot_master.name IS 'The business/venue name of the AI Spot (e.g., "Baa Mee", "The Lounge Pub")';