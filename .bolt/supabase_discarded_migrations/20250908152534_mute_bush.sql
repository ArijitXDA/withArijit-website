/*
  # Populate Student Master Table with existing payment data

  1. Data Population
    - Extract successful payments ≥ INR 2000 or USD 100
    - Assign student IDs starting from wi300
    - Set all students to Batch_33 initially
    - Aggregate payment data per student per course

  2. Session Schedule
    - Create 25 sample sessions for Batch_33
    - Weekly schedule starting February 2024
    - Session links to be updated manually

  3. Automation
    - Trigger function for future payment processing
    - Automatic student creation for qualifying payments
*/

-- First, let's see what columns actually exist in Student_Master_Table
-- (This is just for verification - you can remove this line after checking)
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'Student_Master_Table';

-- Create Session_Master_Table if it doesn't exist
CREATE TABLE IF NOT EXISTS Session_Master_Table (
  session_id SERIAL PRIMARY KEY,
  batch_id TEXT NOT NULL,
  session_date DATE,
  session_start_time TIME,
  session_link TEXT,
  study_material_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Session_Master_Table
ALTER TABLE Session_Master_Table ENABLE ROW LEVEL SECURITY;

-- Create policy for Session_Master_Table (enrolled students can view)
CREATE POLICY "Enrolled students can view sessions"
  ON Session_Master_Table
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM payments p
      WHERE p.user_id = (auth.uid())::text
      AND p.payment_status = 'success'
      AND (
        (p.currency = 'INR' AND p.amount >= 2000) OR
        (p.currency = 'USD' AND p.amount >= 100)
      )
    )
  );

-- Populate Student_Master_Table with existing payment data
INSERT INTO Student_Master_Table (
  student_id,
  student_name,
  email,
  mobile,
  current_course_name,
  batch_id,
  first_course_payment_amount,
  first_pay_date,
  first_pay_discount_coupon_used,
  referred_by,
  second_payment_amt,
  second_payment_date,
  third_payment_amt,
  third_payment_date,
  fourth_payment_amt,
  fourth_payment_date
)
SELECT 
  'wi' || (300 + ROW_NUMBER() OVER (ORDER BY first_payment.created_at)) AS student_id,
  first_payment.name AS student_name,
  first_payment.email,
  first_payment.mobile,
  first_payment.course AS current_course_name,
  'Batch_33' AS batch_id,
  first_payment.amount AS first_course_payment_amount,
  first_payment.payment_date AS first_pay_date,
  CASE 
    WHEN first_payment.referred_by_email IS NOT NULL THEN 'referral_7%'
    ELSE NULL 
  END AS first_pay_discount_coupon_used,
  first_payment.referred_by_email AS referred_by,
  second_payment.amount AS second_payment_amt,
  second_payment.payment_date AS second_payment_date,
  third_payment.amount AS third_payment_amt,
  third_payment.payment_date AS third_payment_date,
  fourth_payment.amount AS fourth_payment_amt,
  fourth_payment.payment_date AS fourth_payment_date
FROM (
  -- Get first payment for each student
  SELECT DISTINCT ON (email, course) 
    name, email, mobile, course, amount, payment_date, created_at, referred_by_email,
    ROW_NUMBER() OVER (PARTITION BY email, course ORDER BY created_at) as payment_order
  FROM payments 
  WHERE payment_status = 'success' 
    AND (
      (currency = 'INR' AND amount >= 2000) OR 
      (currency = 'USD' AND amount >= 100)
    )
  ORDER BY email, course, created_at
) first_payment
LEFT JOIN (
  -- Get second payment
  SELECT email, course, amount, payment_date,
    ROW_NUMBER() OVER (PARTITION BY email, course ORDER BY created_at) as payment_order
  FROM payments 
  WHERE payment_status = 'success'
) second_payment ON first_payment.email = second_payment.email 
  AND first_payment.course = second_payment.course 
  AND second_payment.payment_order = 2
LEFT JOIN (
  -- Get third payment
  SELECT email, course, amount, payment_date,
    ROW_NUMBER() OVER (PARTITION BY email, course ORDER BY created_at) as payment_order
  FROM payments 
  WHERE payment_status = 'success'
) third_payment ON first_payment.email = third_payment.email 
  AND first_payment.course = third_payment.course 
  AND third_payment.payment_order = 3
LEFT JOIN (
  -- Get fourth payment
  SELECT email, course, amount, payment_date,
    ROW_NUMBER() OVER (PARTITION BY email, course ORDER BY created_at) as payment_order
  FROM payments 
  WHERE payment_status = 'success'
) fourth_payment ON first_payment.email = fourth_payment.email 
  AND first_payment.course = fourth_payment.course 
  AND fourth_payment.payment_order = 4
WHERE first_payment.payment_order = 1
ON CONFLICT (email, current_course_name) DO UPDATE SET
  second_payment_amt = EXCLUDED.second_payment_amt,
  second_payment_date = EXCLUDED.second_payment_date,
  third_payment_amt = EXCLUDED.third_payment_amt,
  third_payment_date = EXCLUDED.third_payment_date,
  fourth_payment_amt = EXCLUDED.fourth_payment_amt,
  fourth_payment_date = EXCLUDED.fourth_payment_date;

-- Create sample sessions for Batch_33 (25 sessions, weekly schedule)
INSERT INTO Session_Master_Table (
  batch_id,
  session_date,
  session_start_time,
  session_link,
  study_material_link
)
SELECT 
  'Batch_33' AS batch_id,
  ('2024-02-04'::date + (generate_series(0, 24) * interval '1 week'))::date AS session_date,
  '12:30:00'::time AS session_start_time,
  NULL AS session_link, -- Will be updated after each class
  NULL AS study_material_link -- Will be updated after each class
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_master_email ON Student_Master_Table(email);
CREATE INDEX IF NOT EXISTS idx_student_master_batch ON Student_Master_Table(batch_id);
CREATE INDEX IF NOT EXISTS idx_session_master_batch ON Session_Master_Table(batch_id);
CREATE INDEX IF NOT EXISTS idx_session_master_date ON Session_Master_Table(session_date);

-- Create trigger function to automatically add students when they make qualifying payments
CREATE OR REPLACE FUNCTION add_student_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process successful payments that qualify for course access
  IF NEW.payment_status = 'success' AND (
    (NEW.currency = 'INR' AND NEW.amount >= 2000) OR 
    (NEW.currency = 'USD' AND NEW.amount >= 100)
  ) THEN
    -- Insert or update student record
    INSERT INTO Student_Master_Table (
      student_id,
      student_name,
      email,
      mobile,
      current_course_name,
      batch_id,
      first_course_payment_amount,
      first_pay_date,
      first_pay_discount_coupon_used,
      referred_by
    )
    SELECT 
      'wi' || (300 + COALESCE((
        SELECT COUNT(*) FROM Student_Master_Table
      ), 0) + 1),
      NEW.name,
      NEW.email,
      NEW.mobile,
      NEW.course,
      'Batch_33',
      NEW.amount,
      NEW.payment_date,
      CASE 
        WHEN NEW.referred_by_email IS NOT NULL THEN 'referral_7%'
        ELSE NULL 
      END,
      NEW.referred_by_email
    WHERE NOT EXISTS (
      SELECT 1 FROM Student_Master_Table 
      WHERE email = NEW.email AND current_course_name = NEW.course
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on payments table
DROP TRIGGER IF EXISTS trigger_add_student_on_payment ON payments;
CREATE TRIGGER trigger_add_student_on_payment
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION add_student_on_payment();