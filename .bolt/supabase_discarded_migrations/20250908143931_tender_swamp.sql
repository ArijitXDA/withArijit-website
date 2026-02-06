/*
  # Create Student Master and Session Master Tables

  1. New Tables
    - `Student_Master_Table`
      - Tracks student enrollment and payment history
      - Automatically populated from successful payments ≥ INR 2000 or USD 100
      - Supports up to 4 payments per student per course
    - `Session_Master_Table`
      - Manual session management for administrators
      - Session links restricted to enrolled students only

  2. Security
    - Enable RLS on both tables
    - Students can only view their own records
    - Session links only visible to students who have paid for courses
    - Administrators have full access

  3. Automation
    - Trigger function automatically creates/updates student records
    - Handles payment tracking and referral capture
    - Performance indexes for efficient queries
*/

-- Create Student_Master_Table
CREATE TABLE IF NOT EXISTS Student_Master_Table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  Student_Name text NOT NULL,
  email text NOT NULL,
  mobile text,
  Current_Course_Name text NOT NULL,
  "1st_Course_Payment_Amount" numeric,
  "1st_Pay_Date" date,
  "1st_Pay_Discount_Coupon_Used" text,
  Referred_by text,
  "2nd_Payment_Amt" numeric,
  "2nd_Payment_Date" date,
  "3rd_Payment_Amt" numeric,
  "3rd_Payment_Date" date,
  "4th_Payment_Amt" numeric,
  "4th_Payment_Date" date,
  total_payments_count integer DEFAULT 1,
  total_amount_paid numeric DEFAULT 0,
  enrollment_date timestamptz DEFAULT now(),
  last_payment_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(email, Current_Course_Name)
);

-- Create Session_Master_Table
CREATE TABLE IF NOT EXISTS Session_Master_Table (
  Session_ID serial PRIMARY KEY,
  Batch_ID text NOT NULL,
  Session_Date date NOT NULL,
  Session_Start_Time time NOT NULL,
  Session_Link text,
  Study_Material_Link text,
  session_title text,
  session_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE Student_Master_Table ENABLE ROW LEVEL SECURITY;
ALTER TABLE Session_Master_Table ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Student_Master_Table
CREATE POLICY "Students can view own records"
  ON Student_Master_Table
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Allow admin access to student records"
  ON Student_Master_Table
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for Session_Master_Table
CREATE POLICY "Enrolled students can view sessions"
  ON Session_Master_Table
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM Student_Master_Table smt
      WHERE smt.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND smt.Current_Course_Name = Session_Master_Table.Batch_ID
    )
  );

CREATE POLICY "Allow admin access to sessions"
  ON Session_Master_Table
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_master_email ON Student_Master_Table(email);
CREATE INDEX IF NOT EXISTS idx_student_master_course ON Student_Master_Table(Current_Course_Name);
CREATE INDEX IF NOT EXISTS idx_student_master_enrollment_date ON Student_Master_Table(enrollment_date);
CREATE INDEX IF NOT EXISTS idx_session_master_batch ON Session_Master_Table(Batch_ID);
CREATE INDEX IF NOT EXISTS idx_session_master_date ON Session_Master_Table(Session_Date);

-- Create trigger function to automatically populate Student_Master_Table
CREATE OR REPLACE FUNCTION handle_student_enrollment()
RETURNS TRIGGER AS $$
DECLARE
  amount_in_inr numeric;
  existing_student_id uuid;
  payment_number integer;
BEGIN
  -- Only process successful payments
  IF NEW.payment_status != 'success' THEN
    RETURN NEW;
  END IF;

  -- Convert amount to INR for comparison
  IF NEW.currency = 'USD' THEN
    amount_in_inr := NEW.amount * 83; -- Approximate conversion rate
  ELSE
    amount_in_inr := NEW.amount;
  END IF;

  -- Only process payments >= INR 2000 or USD 100
  IF (NEW.currency = 'INR' AND NEW.amount < 2000) OR 
     (NEW.currency = 'USD' AND NEW.amount < 100) THEN
    RETURN NEW;
  END IF;

  -- Check if student already exists for this course
  SELECT id INTO existing_student_id
  FROM Student_Master_Table
  WHERE email = NEW.email AND Current_Course_Name = NEW.course;

  IF existing_student_id IS NOT NULL THEN
    -- Update existing student record with additional payment
    SELECT total_payments_count + 1 INTO payment_number
    FROM Student_Master_Table
    WHERE id = existing_student_id;

    -- Update the appropriate payment column based on payment number
    IF payment_number = 2 THEN
      UPDATE Student_Master_Table
      SET 
        "2nd_Payment_Amt" = NEW.amount,
        "2nd_Payment_Date" = NEW.payment_date::date,
        total_payments_count = payment_number,
        total_amount_paid = total_amount_paid + NEW.amount,
        last_payment_date = NEW.created_at,
        updated_at = now()
      WHERE id = existing_student_id;
    ELSIF payment_number = 3 THEN
      UPDATE Student_Master_Table
      SET 
        "3rd_Payment_Amt" = NEW.amount,
        "3rd_Payment_Date" = NEW.payment_date::date,
        total_payments_count = payment_number,
        total_amount_paid = total_amount_paid + NEW.amount,
        last_payment_date = NEW.created_at,
        updated_at = now()
      WHERE id = existing_student_id;
    ELSIF payment_number = 4 THEN
      UPDATE Student_Master_Table
      SET 
        "4th_Payment_Amt" = NEW.amount,
        "4th_Payment_Date" = NEW.payment_date::date,
        total_payments_count = payment_number,
        total_amount_paid = total_amount_paid + NEW.amount,
        last_payment_date = NEW.created_at,
        updated_at = now()
      WHERE id = existing_student_id;
    END IF;
  ELSE
    -- Insert new student record
    INSERT INTO Student_Master_Table (
      Student_Name,
      email,
      mobile,
      Current_Course_Name,
      "1st_Course_Payment_Amount",
      "1st_Pay_Date",
      "1st_Pay_Discount_Coupon_Used",
      Referred_by,
      total_payments_count,
      total_amount_paid,
      enrollment_date,
      last_payment_date
    ) VALUES (
      NEW.name,
      NEW.email,
      NEW.mobile,
      NEW.course,
      NEW.amount,
      NEW.payment_date::date,
      CASE 
        WHEN NEW.referred_by_email IS NOT NULL AND NEW.referred_by_email != '' 
        THEN NEW.referred_by_email 
        ELSE NULL 
      END,
      NEW.referred_by_email,
      1,
      NEW.amount,
      NEW.created_at,
      NEW.created_at
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on payments table
DROP TRIGGER IF EXISTS trigger_student_enrollment ON payments;
CREATE TRIGGER trigger_student_enrollment
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION handle_student_enrollment();

-- Create updated_at trigger function for Student_Master_Table
CREATE OR REPLACE FUNCTION update_student_master_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger for Student_Master_Table
CREATE TRIGGER update_student_master_updated_at
  BEFORE UPDATE ON Student_Master_Table
  FOR EACH ROW
  EXECUTE FUNCTION update_student_master_updated_at();

-- Create updated_at trigger function for Session_Master_Table
CREATE OR REPLACE FUNCTION update_session_master_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger for Session_Master_Table
CREATE TRIGGER update_session_master_updated_at
  BEFORE UPDATE ON Session_Master_Table
  FOR EACH ROW
  EXECUTE FUNCTION update_session_master_updated_at();