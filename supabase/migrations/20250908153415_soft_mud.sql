/*
  # Create student_master_data table

  1. New Tables
    - `student_master_data`
      - `email` (text, primary key)
      - `student_name` (text)
      - `current_course_name` (text)
      - `first_course_payment_amount` (numeric)
      - `first_pay_date` (date)
      - `first_pay_discount_coupon_used` (text)
      - `referred_by` (text)
      - `second_payment_amt` (numeric)
      - `second_payment_date` (date)
      - `third_payment_amt` (numeric)
      - `third_payment_date` (date)
      - `fourth_payment_amt` (numeric)
      - `fourth_payment_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `student_master_data` table
    - Add policies for authenticated users to manage their own data

  3. Data Population
    - Populate table with data from existing payments table
*/

-- Create the student_master_data table
CREATE TABLE IF NOT EXISTS public.student_master_data (
    email text PRIMARY KEY,
    student_name text,
    current_course_name text,
    first_course_payment_amount numeric,
    first_pay_date date,
    first_pay_discount_coupon_used text,
    referred_by text,
    second_payment_amt numeric,
    second_payment_date date,
    third_payment_amt numeric,
    third_payment_date date,
    fourth_payment_amt numeric,
    fourth_payment_date date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_master_data ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'student_master_data' 
    AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users" 
      ON public.student_master_data 
      FOR SELECT 
      TO authenticated 
      USING (email = (auth.jwt() ->> 'email'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'student_master_data' 
    AND policyname = 'Enable insert for authenticated users'
  ) THEN
    CREATE POLICY "Enable insert for authenticated users" 
      ON public.student_master_data 
      FOR INSERT 
      TO authenticated 
      WITH CHECK (email = (auth.jwt() ->> 'email'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'student_master_data' 
    AND policyname = 'Enable update for authenticated users'
  ) THEN
    CREATE POLICY "Enable update for authenticated users" 
      ON public.student_master_data 
      FOR UPDATE 
      TO authenticated 
      USING (email = (auth.jwt() ->> 'email'));
  END IF;
END $$;

-- Populate the table with data from payments table
INSERT INTO public.student_master_data (
    email,
    student_name,
    current_course_name,
    first_course_payment_amount,
    first_pay_date,
    referred_by,
    created_at
)
SELECT DISTINCT ON (email)
    email,
    name as student_name,
    course as current_course_name,
    amount as first_course_payment_amount,
    created_at::date as first_pay_date,
    referred_by_email as referred_by,
    created_at
FROM public.payments
WHERE payment_status = 'completed'
ORDER BY email, created_at ASC
ON CONFLICT (email) DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_student_master_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_student_master_updated_at'
  ) THEN
    CREATE TRIGGER update_student_master_updated_at
        BEFORE UPDATE ON public.student_master_data
        FOR EACH ROW
        EXECUTE FUNCTION update_student_master_updated_at();
  END IF;
END $$;