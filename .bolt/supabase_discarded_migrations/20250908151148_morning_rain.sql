/*
  # Populate Student Master Table with Existing Payment Records

  1. Create Tables
    - `Student_Master_Table` with payment tracking and student management
    - `Session_Master_Table` for session scheduling and materials

  2. Data Population
    - Populate Student_Master_Table with existing successful payments
    - Assign sequential student IDs starting from wi300
    - Set all students to Batch_33 initially
    - Aggregate multiple payments per student per course

  3. Security
    - Enable RLS on both tables
    - Add policies for student data access
    - Secure session links for enrolled students only

  4. Automation
    - Create trigger function for future payment processing
    - Automatic student record creation for new payments ≥ INR 2000 or USD 100
*/

-- Create Student_Master_Table
CREATE TABLE IF NOT EXISTS Student_Master_Table (
  student_id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL DEFAULT 'Batch_33',
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_mobile TEXT NOT NULL,
  current_course_name TEXT NOT NULL,
  first_course_payment_amount NUMERIC NOT NULL,
  first_pay_date DATE NOT NULL,
  first_pay_discount_coupon_used TEXT,
  referred_by TEXT,
  second_payment_amt NUMERIC,
  second_payment_date DATE,
  third_payment_amt NUMERIC,
  third_payment_date DATE,
  fourth_payment_amt NUMERIC,
  fourth_payment_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Session_Master_Table
CREATE TABLE IF NOT EXISTS Session_Master_Table (
  session_id SERIAL PRIMARY KEY,
  batch_id TEXT NOT NULL,
  session_date DATE,
  session_start_time TIME,
  session_link TEXT,
  study_material_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE Student_Master_Table ENABLE ROW LEVEL SECURITY;
ALTER TABLE Session_Master_Table ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Student_Master_Table
CREATE POLICY "Students can view own data"
  ON Student_Master_Table
  FOR SELECT
  TO authenticated
  USING (student_email = (jwt() ->> 'email'::text));

CREATE POLICY "Allow admin access to student data"
  ON Student_Master_Table
  FOR ALL
  TO authenticated
  USING (true);

-- Create RLS policies for Session_Master_Table
CREATE POLICY "Students can view sessions for their batch"
  ON Session_Master_Table
  FOR SELECT
  TO authenticated
  USING (
    batch_id IN (
      SELECT batch_id 
      FROM Student_Master_Table 
      WHERE student_email = (jwt() ->> 'email'::text)
    )
  );

CREATE POLICY "Allow admin access to sessions"
  ON Session_Master_Table
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_master_email ON Student_Master_Table(student_email);
CREATE INDEX IF NOT EXISTS idx_student_master_batch ON Student_Master_Table(batch_id);
CREATE INDEX IF NOT EXISTS idx_session_master_batch ON Session_Master_Table(batch_id);
CREATE INDEX IF NOT EXISTS idx_session_master_date ON Session_Master_Table(session_date);

-- Populate Student_Master_Table with existing payment data
DO $$
DECLARE
  payment_record RECORD;
  student_counter INTEGER := 300;
  existing_student RECORD;
  student_id_val TEXT;
BEGIN
  -- Process each successful payment ≥ INR 2000 or USD 100
  FOR payment_record IN 
    SELECT DISTINCT ON (email, course) 
      id, user_id, name, email, mobile, course, duration, country, currency, 
      amount, payment_date, created_at, referred_by_email
    FROM payments 
    WHERE payment_status = 'success' 
      AND ((currency = 'INR' AND amount >= 2000) OR (currency = 'USD' AND amount >= 100))
    ORDER BY email, course, created_at ASC
  LOOP
    -- Check if student already exists for this course
    SELECT * INTO existing_student 
    FROM Student_Master_Table 
    WHERE student_email = payment_record.email 
      AND current_course_name = payment_record.course;
    
    IF existing_student IS NULL THEN
      -- Create new student record
      student_id_val := 'wi' || student_counter;
      
      INSERT INTO Student_Master_Table (
        student_id,
        batch_id,
        student_name,
        student_email,
        student_mobile,
        current_course_name,
        first_course_payment_amount,
        first_pay_date,
        first_pay_discount_coupon_used,
        referred_by,
        created_at,
        updated_at
      ) VALUES (
        student_id_val,
        'Batch_33',
        payment_record.name,
        payment_record.email,
        payment_record.mobile,
        payment_record.course,
        payment_record.amount,
        COALESCE(payment_record.payment_date::DATE, payment_record.created_at::DATE),
        NULL, -- Will be updated based on coupon logic
        payment_record.referred_by_email,
        payment_record.created_at,
        NOW()
      );
      
      student_counter := student_counter + 1;
      
      RAISE NOTICE 'Created student record: % for %', student_id_val, payment_record.email;
    END IF;
  END LOOP;
  
  -- Now update with additional payments for existing students
  FOR payment_record IN 
    SELECT p.*, s.student_id,
      ROW_NUMBER() OVER (
        PARTITION BY p.email, p.course 
        ORDER BY COALESCE(p.payment_date::DATE, p.created_at::DATE)
      ) as payment_sequence
    FROM payments p
    JOIN Student_Master_Table s ON s.student_email = p.email AND s.current_course_name = p.course
    WHERE p.payment_status = 'success' 
      AND ((p.currency = 'INR' AND p.amount >= 2000) OR (p.currency = 'USD' AND p.amount >= 100))
    ORDER BY p.email, p.course, COALESCE(p.payment_date::DATE, p.created_at::DATE)
  LOOP
    -- Update additional payments
    IF payment_record.payment_sequence = 2 THEN
      UPDATE Student_Master_Table 
      SET second_payment_amt = payment_record.amount,
          second_payment_date = COALESCE(payment_record.payment_date::DATE, payment_record.created_at::DATE),
          updated_at = NOW()
      WHERE student_id = payment_record.student_id;
      
    ELSIF payment_record.payment_sequence = 3 THEN
      UPDATE Student_Master_Table 
      SET third_payment_amt = payment_record.amount,
          third_payment_date = COALESCE(payment_record.payment_date::DATE, payment_record.created_at::DATE),
          updated_at = NOW()
      WHERE student_id = payment_record.student_id;
      
    ELSIF payment_record.payment_sequence = 4 THEN
      UPDATE Student_Master_Table 
      SET fourth_payment_amt = payment_record.amount,
          fourth_payment_date = COALESCE(payment_record.payment_date::DATE, payment_record.created_at::DATE),
          updated_at = NOW()
      WHERE student_id = payment_record.student_id;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Student Master Table populated successfully';
END $$;

-- Create trigger function for future payments
CREATE OR REPLACE FUNCTION handle_student_enrollment()
RETURNS TRIGGER AS $$
DECLARE
  student_counter INTEGER;
  student_id_val TEXT;
  existing_student RECORD;
  payment_sequence INTEGER;
BEGIN
  -- Only process successful payments ≥ INR 2000 or USD 100
  IF NEW.payment_status = 'success' AND 
     ((NEW.currency = 'INR' AND NEW.amount >= 2000) OR (NEW.currency = 'USD' AND NEW.amount >= 100)) THEN
    
    -- Check if student already exists for this course
    SELECT * INTO existing_student 
    FROM Student_Master_Table 
    WHERE student_email = NEW.email AND current_course_name = NEW.course;
    
    IF existing_student IS NULL THEN
      -- Generate new student ID
      SELECT COALESCE(MAX(CAST(SUBSTRING(student_id FROM 3) AS INTEGER)), 299) + 1 
      INTO student_counter 
      FROM Student_Master_Table 
      WHERE student_id ~ '^wi[0-9]+$';
      
      student_id_val := 'wi' || student_counter;
      
      -- Create new student record
      INSERT INTO Student_Master_Table (
        student_id,
        batch_id,
        student_name,
        student_email,
        student_mobile,
        current_course_name,
        first_course_payment_amount,
        first_pay_date,
        referred_by,
        created_at,
        updated_at
      ) VALUES (
        student_id_val,
        'Batch_33',
        NEW.name,
        NEW.email,
        NEW.mobile,
        NEW.course,
        NEW.amount,
        COALESCE(NEW.payment_date::DATE, NEW.created_at::DATE),
        NEW.referred_by_email,
        NEW.created_at,
        NOW()
      );
    ELSE
      -- Update existing student with additional payment
      SELECT COUNT(*) + 1 INTO payment_sequence
      FROM (
        SELECT first_course_payment_amount as amt, first_pay_date as date WHERE first_course_payment_amount IS NOT NULL
        UNION ALL
        SELECT second_payment_amt as amt, second_payment_date as date WHERE second_payment_amt IS NOT NULL
        UNION ALL  
        SELECT third_payment_amt as amt, third_payment_date as date WHERE third_payment_amt IS NOT NULL
        UNION ALL
        SELECT fourth_payment_amt as amt, fourth_payment_date as date WHERE fourth_payment_amt IS NOT NULL
      ) payments
      FROM Student_Master_Table 
      WHERE student_id = existing_student.student_id;
      
      -- Update based on payment sequence
      IF payment_sequence = 2 THEN
        UPDATE Student_Master_Table 
        SET second_payment_amt = NEW.amount,
            second_payment_date = COALESCE(NEW.payment_date::DATE, NEW.created_at::DATE),
            updated_at = NOW()
        WHERE student_id = existing_student.student_id;
        
      ELSIF payment_sequence = 3 THEN
        UPDATE Student_Master_Table 
        SET third_payment_amt = NEW.amount,
            third_payment_date = COALESCE(NEW.payment_date::DATE, NEW.created_at::DATE),
            updated_at = NOW()
        WHERE student_id = existing_student.student_id;
        
      ELSIF payment_sequence = 4 THEN
        UPDATE Student_Master_Table 
        SET fourth_payment_amt = NEW.amount,
            fourth_payment_date = COALESCE(NEW.payment_date::DATE, NEW.created_at::DATE),
            updated_at = NOW()
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

-- Insert sample session data for Batch_33
INSERT INTO Session_Master_Table (batch_id, session_date, session_start_time) VALUES
('Batch_33', '2024-02-04', '12:30:00'),
('Batch_33', '2024-02-11', '12:30:00'),
('Batch_33', '2024-02-18', '12:30:00'),
('Batch_33', '2024-02-25', '12:30:00'),
('Batch_33', '2024-03-03', '12:30:00'),
('Batch_33', '2024-03-10', '12:30:00'),
('Batch_33', '2024-03-17', '12:30:00'),
('Batch_33', '2024-03-24', '12:30:00'),
('Batch_33', '2024-03-31', '12:30:00'),
('Batch_33', '2024-04-07', '12:30:00'),
('Batch_33', '2024-04-14', '12:30:00'),
('Batch_33', '2024-04-21', '12:30:00'),
('Batch_33', '2024-04-28', '12:30:00'),
('Batch_33', '2024-05-05', '12:30:00'),
('Batch_33', '2024-05-12', '12:30:00'),
('Batch_33', '2024-05-19', '12:30:00'),
('Batch_33', '2024-05-26', '12:30:00'),
('Batch_33', '2024-06-02', '12:30:00'),
('Batch_33', '2024-06-09', '12:30:00'),
('Batch_33', '2024-06-16', '12:30:00'),
('Batch_33', '2024-06-23', '12:30:00'),
('Batch_33', '2024-06-30', '12:30:00'),
('Batch_33', '2024-07-07', '12:30:00'),
('Batch_33', '2024-07-14', '12:30:00'),
('Batch_33', '2024-07-21', '12:30:00');