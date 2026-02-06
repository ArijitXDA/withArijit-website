/*
  # Add batch_id column to student_master_table

  1. Schema Changes
    - Add `batch_id` column to `student_master_table`
    - Add index for better performance
    - Update existing records with default batch IDs based on course names

  2. Data Updates
    - Map existing students to appropriate batches
    - Ensure referential integrity

  3. Performance
    - Add index on batch_id for faster queries
*/

-- Add batch_id column to student_master_table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_master_table' AND column_name = 'batch_id'
  ) THEN
    ALTER TABLE student_master_table ADD COLUMN batch_id text;
  END IF;
END $$;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_student_master_batch_id 
ON student_master_table(batch_id);

-- Update existing records with batch IDs based on course names
UPDATE student_master_table 
SET batch_id = CASE 
  WHEN current_course_name ILIKE '%agentic%ai%' THEN 'AGENTIC_AI_BATCH_1'
  WHEN current_course_name ILIKE '%vibe%coding%' THEN 'VIBE_CODING_BATCH_1'
  WHEN current_course_name ILIKE '%python%' THEN 'PYTHON_ML_AI_BATCH_1'
  WHEN current_course_name ILIKE '%certification%' THEN 'AI_CERT_BATCH_1'
  WHEN current_course_name ILIKE '%build%ai%' THEN 'BUILD_AI_BATCH_1'
  ELSE 'GENERAL_BATCH_1'
END
WHERE batch_id IS NULL;