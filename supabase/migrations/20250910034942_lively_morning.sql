/*
  # Migrate student data and cleanup redundant table

  1. Data Migration
    - Migrate data from `student_master_data` to `student_master_table`
    - Handle conflicts and duplicates safely
    
  2. Table Cleanup
    - Drop the redundant `student_master_data` table
    - Clean up any references or dependencies
    
  3. Security
    - Maintain existing RLS policies on `student_master_table`
    - Ensure data integrity during migration
*/

-- First, migrate any data from student_master_data to student_master_table that doesn't already exist
INSERT INTO student_master_table (
  student_name,
  email,
  current_course_name,
  "1st_Course_Payment_Amount",
  "1st_Pay_Date",
  "1st_Pay_Discount_Coupon_Used",
  referred_by,
  "2nd_Payment_Amt",
  "2nd_Payment_Date",
  "3rd_Payment_Amt",
  "3rd_Payment_Date",
  "4th_Payment_Amt",
  "4th_Payment_Date",
  batch_id,
  created_at,
  updated_at
)
SELECT 
  smd.student_name,
  smd.email,
  smd.current_course_name,
  smd.first_course_payment_amount,
  smd.first_pay_date,
  smd.first_pay_discount_coupon_used,
  smd.referred_by,
  smd.second_payment_amt,
  smd.second_payment_date,
  smd.third_payment_amt,
  smd.third_payment_date,
  smd.fourth_payment_amt,
  smd.fourth_payment_date,
  smd.batch_id,
  smd.created_at,
  smd.updated_at
FROM student_master_data smd
WHERE NOT EXISTS (
  SELECT 1 FROM student_master_table smt 
  WHERE smt.email = smd.email 
  AND smt.current_course_name = smd.current_course_name
);

-- Drop the redundant student_master_data table
DROP TABLE IF EXISTS student_master_data CASCADE;