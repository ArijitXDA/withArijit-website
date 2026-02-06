/*
  # Fix AI Spot Trigger to Use Lowercase Column Names

  1. Changes
    - Update generate_aispot_qr_link() function to use lowercase column names
    - Update update_aispot_updated_at() function to use lowercase column names
    - Ensure triggers work correctly with actual table schema

  2. Security
    - No security changes, just fixing column name references
*/

-- Fix the QR link generation function
CREATE OR REPLACE FUNCTION public.generate_aispot_qr_link()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate QR code link using the aispot_id (lowercase)
  NEW.qr_code_link := 'https://www.aiwitharijit.com/ai-readiness-quiz?spot_id=' || NEW.aispot_id::text;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix the updated_at function
CREATE OR REPLACE FUNCTION public.update_aispot_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;