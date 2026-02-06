/*
  # Populate Student Master Table with Existing Payment Data

  1. Create Tables
    - `Student_Master_Table` with payment tracking columns
    - `Session_Master_Table` for session management

  2. Populate Data
    - Extract existing successful payments ≥ INR 2000 or USD 100
    - Assign student IDs starting from wi300
    - Set all batch IDs to "Batch_33"
    - Track referrals and discounts

  3. Security
    - Enable RLS on both tables
    - Add policies for student data access
    - Create trigger for future automation
*/

-- Create Student_Master_Table if not exists
CREATE TABLE IF NOT EXISTS Student_Master_Table (
  student_id text PRIMARY KEY,
  batch_id text NOT NULL DEFAULT 'Batch_33',
  student_name text NOT NULL,
  student_email_id text NOT NULL,
  student_mobile text NOT NULL,
  current_course_name text NOT NULL,
  first_course_payment_amount numeric NOT NULL,
  first_pay_date date NOT NULL,
  first_pay_discount_coupon_used text,
  referred_by text,
  second_payment_amt numeric,
  second_payment_date date,
  third_payment_amt numeric,
  third_payment_date date,
  fourth_payment_amt numeric,
  fourth_payment_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Session_Master_Table if not exists
CREATE TABLE IF NOT EXISTS Session_Master_Table (
  session_id serial PRIMARY KEY,
  batch_id text NOT NULL,
  session_date date,
  session_start_time time,
  session_link text,
  study_material_link text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE Student_Master_Table ENABLE ROW LEVEL SECURITY;
ALTER TABLE Session_Master_Table ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Student_Master_Table
CREATE POLICY "Students can view own data" ON Student_Master_Table
  FOR SELECT TO authenticated
  USING (student_email_id = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Allow admin access" ON Student_Master_Table
  FOR ALL TO authenticated
  USING (true);

-- Create RLS policies for Session_Master_Table
CREATE POLICY "Students can view sessions for their batch" ON Session_Master_Table
  FOR SELECT TO authenticated
  USING (
    batch_id IN (
      SELECT batch_id FROM Student_Master_Table 
      WHERE student_email_id = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Allow admin access to sessions" ON Session_Master_Table
  FOR ALL TO authenticated
  USING (true);

-- Populate Student_Master_Table with existing payment data
DO $$
DECLARE
  payment_record RECORD;
  student_counter INTEGER := 300;
  existing_student RECORD;
BEGIN
  -- Loop through successful payments with significant amounts
  FOR payment_record IN 
    SELECT DISTINCT ON (email, course) 
      email, name, mobile, course, amount, currency, created_at,
      CASE 
        WHEN amount >= 2000 AND currency = 'INR' THEN true
        WHEN amount >= 100 AND currency = 'USD' THEN true
        ELSE false
      END as is_eligible
    FROM payments 
    WHERE payment_status = 'success'
      AND ((amount >= 2000 AND currency = 'INR') OR (amount >= 100 AND currency = 'USD'))
    ORDER BY email, course, created_at ASC
  LOOP
    -- Check if student already exists for this course
    SELECT * INTO existing_student 
    FROM Student_Master_Table 
    WHERE student_email_id = payment_record.email 
      AND current_course_name = payment_record.course;
    
    IF NOT FOUND THEN
      -- Insert new student record
      INSERT INTO Student_Master_Table (
        student_id,
        batch_id,
        student_name,
        student_email_id,
        student_mobile,
        current_course_name,
        first_course_payment_amount,
        first_pay_date,
        first_pay_discount_coupon_used,
        referred_by,
        created_at,
        updated_at
      ) VALUES (
        'wi' || student_counter,
        'Batch_33',
        payment_record.name,
        payment_record.email,
        payment_record.mobile,
        payment_record.course,
        payment_record.amount,
        payment_record.created_at::date,
        NULL, -- Will be updated by trigger for future payments
        NULL, -- Will be updated by trigger for future payments
        payment_record.created_at,
        payment_record.created_at
      );
      
      student_counter := student_counter + 1;
      
      RAISE NOTICE 'Created student record: wi% for % - %', student_counter-1, payment_record.name, payment_record.course;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Student Master Table populated with % students', student_counter - 300;
END $$;

-- Create sample sessions for Batch_33
INSERT INTO Session_Master_Table (batch_id, session_date, session_start_time, session_link, study_material_link)
SELECT 
  'Batch_33',
  '2024-02-04'::date + (generate_series(0, 24) * interval '1 week'),
  '12:30:00'::time,
  NULL, -- Will be updated manually
  NULL  -- Will be updated manually
WHERE NOT EXISTS (SELECT 1 FROM Session_Master_Table WHERE batch_id = 'Batch_33');

-- Create trigger function for future student enrollment
CREATE OR REPLACE FUNCTION handle_student_enrollment()
RETURNS TRIGGER AS $$
DECLARE
  student_counter INTEGER;
  existing_student RECORD;
  payment_amount_inr NUMERIC;
BEGIN
  -- Convert amount to INR for comparison
  payment_amount_inr := CASE 
    WHEN NEW.currency = 'USD' THEN NEW.amount * 83
    ELSE NEW.amount
  END;
  
  -- Only process successful payments with significant amounts
  IF NEW.payment_status = 'success' AND payment_amount_inr >= 2000 THEN
    
    -- Check if student already exists for this course
    SELECT * INTO existing_student 
    FROM Student_Master_Table 
    WHERE student_email_id = NEW.email 
      AND current_course_name = NEW.course;
    
    IF NOT FOUND THEN
      -- Get next student counter
      SELECT COALESCE(MAX(CAST(SUBSTRING(student_id FROM 3) AS INTEGER)), 299) + 1 
      INTO student_counter 
      FROM Student_Master_Table 
      WHERE student_id ~ '^wi[0-9]+$';
      
      -- Insert new student record
      INSERT INTO Student_Master_Table (
        student_id,
        batch_id,
        student_name,
        student_email_id,
        student_mobile,
        current_course_name,
        first_course_payment_amount,
        first_pay_date,
        first_pay_discount_coupon_used,
        referred_by,
        created_at,
        updated_at
      ) VALUES (
        'wi' || student_counter,
        'Batch_33',
        NEW.name,
        NEW.email,
        NEW.mobile,
        NEW.course,
        NEW.amount,
        COALESCE(NEW.payment_date::date, NEW.created_at::date),
        NULL, -- Extract from coupon logic if needed
        NEW.referred_by_email,
        NEW.created_at,
        NEW.created_at
      );
      
    ELSE
      -- Update existing student with additional payment
      IF existing_student.second_payment_amt IS NULL THEN
        UPDATE Student_Master_Table 
        SET second_payment_amt = NEW.amount,
            second_payment_date = COALESCE(NEW.payment_date::date, NEW.created_at::date),
            updated_at = NEW.created_at
        WHERE student_id = existing_student.student_id;
      ELSIF existing_student.third_payment_amt IS NULL THEN
        UPDATE Student_Master_Table 
        SET third_payment_amt = NEW.amount,
            third_payment_date = COALESCE(NEW.payment_date::date, NEW.created_at::date),
            updated_at = NEW.created_at
        WHERE student_id = existing_student.student_id;
      ELSIF existing_student.fourth_payment_amt IS NULL THEN
        UPDATE Student_Master_Table 
        SET fourth_payment_amt = NEW.amount,
            fourth_payment_date = COALESCE(NEW.payment_date::date, NEW.created_at::date),
            updated_at = NEW.created_at
        WHERE student_id = existing_student.student_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS student_enrollment_trigger ON payments;
CREATE TRIGGER student_enrollment_trigger
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION handle_student_enrollment();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_master_email ON Student_Master_Table(student_email_id);
CREATE INDEX IF NOT EXISTS idx_student_master_batch ON Student_Master_Table(batch_id);
CREATE INDEX IF NOT EXISTS idx_session_master_batch ON Session_Master_Table(batch_id);
CREATE INDEX IF NOT EXISTS idx_session_master_date ON Session_Master_Table(session_date);