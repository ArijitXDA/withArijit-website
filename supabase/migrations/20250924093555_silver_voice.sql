-- Add webinar_attended column to lead_gen_responses table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE lead_gen_responses 
ADD COLUMN IF NOT EXISTS webinar_attended boolean DEFAULT false;

-- Add a comment to document the column
COMMENT ON COLUMN lead_gen_responses.webinar_attended IS 'Indicates whether the user attended a webinar or masterclass';