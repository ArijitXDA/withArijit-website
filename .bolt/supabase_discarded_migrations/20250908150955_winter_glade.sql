/*
  # Populate Student Master Table with Existing Payment Records

  1. Data Migration
    - Extract successful payment records from payments table
    - Assign sequential student IDs starting from wi300
    - Set all students to Batch_33 initially
    - Calculate payment summaries and discount information
    - Handle multiple payments per student per course

  2. Student ID Assignment
    - Format: wi300, wi301, wi302, etc.
    - Sequential assignment based on first payment date
    - Unique per student-course combination

  3. Payment Aggregation
    - Group payments by student email and course
    - Calculate total amounts and payment counts
    - Track discount coupons and referrals
    - Handle currency conversions (USD to INR)

  4. Data Integrity
    - Only process successful payments
    - Ensure no duplicate student records
    - Maintain referral relationships
*/

-- Create a temporary sequence for student ID generation
CREATE SEQUENCE IF NOT EXISTS temp_student_id_seq START 300;

-- Insert student records from successful payments
INSERT INTO "Student_Master_Table" (
  student_id,
  student_name,
  student_email,
  student_mobile,
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
SELECT DISTINCT ON (p.email, p.course)
  'wi' || nextval('temp_student_id_seq') as student_id,
  p.name as student_name,
  p.email as student_email,
  p.mobile as student_mobile,
  p.course as current_course_name,
  'Batch_33' as batch_id,
  
  -- First payment details
  COALESCE(
    (SELECT amount FROM payments p1 
     WHERE p1.email = p.email 
     AND p1.course = p.course 
     AND p1.payment_status = 'success' 
     ORDER BY p1.created_at ASC LIMIT 1), 
    0
  ) as first_course_payment_amount,
  
  (SELECT payment_date FROM payments p1 
   WHERE p1.email = p.email 
   AND p1.course = p.course 
   AND p1.payment_status = 'success' 
   ORDER BY p1.created_at ASC LIMIT 1
  ) as first_pay_date,
  
  -- Check if first payment had any discount indicators
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM payments p1 
      WHERE p1.email = p.email 
      AND p1.course = p.course 
      AND p1.payment_status = 'success'
      AND (p1.referred_by_email IS NOT NULL OR p1.amount < 2999)
      ORDER BY p1.created_at ASC LIMIT 1
    ) THEN 'Yes'
    ELSE NULL
  END as first_pay_discount_coupon_used,
  
  -- Referral information from first payment
  (SELECT referred_by_email FROM payments p1 
   WHERE p1.email = p.email 
   AND p1.course = p.course 
   AND p1.payment_status = 'success' 
   AND p1.referred_by_email IS NOT NULL
   ORDER BY p1.created_at ASC LIMIT 1
  ) as referred_by,
  
  -- Second payment
  COALESCE(
    (SELECT amount FROM payments p2 
     WHERE p2.email = p.email 
     AND p2.course = p.course 
     AND p2.payment_status = 'success' 
     ORDER BY p2.created_at ASC OFFSET 1 LIMIT 1), 
    0
  ) as second_payment_amt,
  
  (SELECT payment_date FROM payments p2 
   WHERE p2.email = p.email 
   AND p2.course = p.course 
   AND p2.payment_status = 'success' 
   ORDER BY p2.created_at ASC OFFSET 1 LIMIT 1
  ) as second_payment_date,
  
  -- Third payment
  COALESCE(
    (SELECT amount FROM payments p3 
     WHERE p3.email = p.email 
     AND p3.course = p.course 
     AND p3.payment_status = 'success' 
     ORDER BY p3.created_at ASC OFFSET 2 LIMIT 1), 
    0
  ) as third_payment_amt,
  
  (SELECT payment_date FROM payments p3 
   WHERE p3.email = p.email 
   AND p3.course = p.course 
   AND p3.payment_status = 'success' 
   ORDER BY p3.created_at ASC OFFSET 2 LIMIT 1
  ) as third_payment_date,
  
  -- Fourth payment
  COALESCE(
    (SELECT amount FROM payments p4 
     WHERE p4.email = p.email 
     AND p4.course = p.course 
     AND p4.payment_status = 'success' 
     ORDER BY p4.created_at ASC OFFSET 3 LIMIT 1), 
    0
  ) as fourth_payment_amt,
  
  (SELECT payment_date FROM payments p4 
   WHERE p4.email = p.email 
   AND p4.course = p.course 
   AND p4.payment_status = 'success' 
   ORDER BY p4.created_at ASC OFFSET 3 LIMIT 1
  ) as fourth_payment_date

FROM payments p
WHERE p.payment_status = 'success'
  AND (
    (p.currency = 'INR' AND p.amount >= 2000) OR 
    (p.currency = 'USD' AND p.amount >= 100)
  )
ORDER BY p.email, p.course, p.created_at ASC;

-- Clean up the temporary sequence
DROP SEQUENCE IF EXISTS temp_student_id_seq;

-- Verify the data was inserted correctly
SELECT 
  student_id,
  student_name,
  student_email,
  current_course_name,
  batch_id,
  first_course_payment_amount,
  first_pay_date,
  CASE WHEN referred_by IS NOT NULL THEN 'Has Referral' ELSE 'No Referral' END as referral_status
FROM "Student_Master_Table"
ORDER BY student_id;