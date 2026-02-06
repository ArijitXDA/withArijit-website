/*
  # Add batch_id column to student_master_data table

  1. Schema Changes
    - Add `batch_id` column to `student_master_data` table
    - Update existing records with appropriate batch IDs based on course names
    - Add index for better query performance

  2. Data Updates
    - Map course names to batch IDs for proper session scheduling
    - Ensure all students have valid batch assignments
*/

-- Add batch_id column to student_master_data table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_master_data' AND column_name = 'batch_id'
  ) THEN
    ALTER TABLE student_master_data ADD COLUMN batch_id text;
  END IF;
END $$;

-- Update existing records with batch IDs based on course names
UPDATE student_master_data 
SET batch_id = CASE 
  WHEN current_course_name = 'Agentic AI' THEN 'AGENTIC_AI_2024'
  WHEN current_course_name = 'Vibe Coding' THEN 'VIBE_CODING_2024'
  WHEN current_course_name = 'Python for ML & AI' THEN 'PYTHON_ML_AI_2024'
  WHEN current_course_name = '4 Months AI Certification For Professionals' THEN 'AI_CERT_PROF_2024'
  WHEN current_course_name = 'Build AI Projects' THEN 'BUILD_AI_PROJ_2024'
  WHEN current_course_name = 'Masterclass' THEN 'MASTERCLASS_2024'
  WHEN current_course_name = 'PowerBI & Tableau' THEN 'POWERBI_TABLEAU_2024'
  WHEN current_course_name = 'O365 & Excel Automation' THEN 'O365_EXCEL_2024'
  WHEN current_course_name = 'Quantum Computing' THEN 'QUANTUM_COMP_2024'
  WHEN current_course_name = 'Zodiac Premium AI Course' THEN 'ZODIAC_AI_2024'
  ELSE 'GENERAL_AI_2024'
END
WHERE batch_id IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_student_master_batch_id ON student_master_data(batch_id);

-- Update session_master_table to ensure we have sessions for all batch IDs
INSERT INTO session_master_table (batch_id, session_date, session_start_time, session_title, session_description)
SELECT DISTINCT 
  smd.batch_id,
  CURRENT_DATE + INTERVAL '7 days' + (ROW_NUMBER() OVER (PARTITION BY smd.batch_id ORDER BY smd.batch_id) - 1) * INTERVAL '7 days' as session_date,
  '10:00:00'::time as session_start_time,
  'Session ' || ROW_NUMBER() OVER (PARTITION BY smd.batch_id ORDER BY smd.batch_id) as session_title,
  'Live session for ' || smd.current_course_name as session_description
FROM student_master_data smd
WHERE smd.batch_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM session_master_table smt 
    WHERE smt.batch_id = smd.batch_id
  )
LIMIT 5; -- Create 5 sessions per new batch