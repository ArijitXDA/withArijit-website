-- =====================================================
-- AIwithArijit Portal Revamp - Initial Seed Data
-- Date: February 13, 2026
-- Purpose: Populate courses, Batch#101, and default configurations
-- =====================================================

-- =====================================================
-- 1. INSERT NEW COURSES (6-month duration, ₹7,999/month)
-- =====================================================

-- AI for Students (Undergraduate)
INSERT INTO courses_v2 (
  course_code, course_name, course_category, target_audience,
  duration_months, monthly_price, full_course_price, upfront_discount_percent,
  upfront_final_price, description, display_order
) VALUES (
  'AI_UG',
  'AI for Students (Undergraduate)',
  'Students',
  'Undergraduate',
  6,
  7999.00,
  47994.00,
  7.00,
  44634.42, -- 7% discount applied
  'Comprehensive AI training for undergraduate students covering Agentic AI, Python, Data Analysis, and AI Engineering',
  1
);

-- AI for Students (Postgraduate & PhD)
INSERT INTO courses_v2 (
  course_code, course_name, course_category, target_audience,
  duration_months, monthly_price, full_course_price, upfront_discount_percent,
  upfront_final_price, description, display_order
) VALUES (
  'AI_PG',
  'AI for Students (Postgraduate & PhD)',
  'Students',
  'Postgraduate',
  6,
  7999.00,
  47994.00,
  7.00,
  44634.42,
  'Advanced AI training for postgraduate students and PhD researchers focusing on Quantum Computing, Generative Transformation, and Research',
  2
);

-- AI for Students (8-16 Years Age Group)
INSERT INTO courses_v2 (
  course_code, course_name, course_category, target_audience,
  duration_months, monthly_price, full_course_price, upfront_discount_percent,
  upfront_final_price, description, display_order
) VALUES (
  'AI_KIDS',
  'AI for Students (8-16 Years Age Group)',
  'Students',
  '8-16 Years',
  6,
  7999.00,
  47994.00,
  7.00,
  44634.42,
  'Age-appropriate AI training for young learners with parental involvement and gamified content',
  3
);

-- AI for Rejoiners
INSERT INTO courses_v2 (
  course_code, course_name, course_category, target_audience,
  duration_months, monthly_price, full_course_price, upfront_discount_percent,
  upfront_final_price, description, display_order
) VALUES (
  'AI_REJOIN',
  'AI for Rejoiners (Housewives & Career Break Professionals)',
  'Professionals',
  'Rejoiners',
  6,
  7999.00,
  47994.00,
  7.00,
  44634.42,
  'AI training designed for professionals returning to work after a career break, with flexible scheduling and beginner-friendly approach',
  4
);

-- =====================================================
-- 2. INSERT MULTI-CURRENCY PRICING
-- =====================================================

-- Function to calculate upfront final price
CREATE OR REPLACE FUNCTION calculate_upfront_price(full_price DECIMAL, discount_percent DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND(full_price * (1 - discount_percent/100), 2);
END;
$$ LANGUAGE plpgsql;

-- Get all course IDs
DO $$
DECLARE
  course_record RECORD;
  inr_monthly DECIMAL := 7999.00;
  inr_full DECIMAL := 47994.00;
  inr_continued DECIMAL := 3000.00;
BEGIN
  FOR course_record IN SELECT id FROM courses_v2 LOOP

    -- INR (Base Currency)
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'INR', inr_monthly, inr_full, 7.00,
      calculate_upfront_price(inr_full, 7.00), inr_continued,
      1.0000, NOW(), false
    );

    -- USD (Example rate: 1 INR = 0.012 USD)
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'USD',
      ROUND(inr_monthly * 0.012, 2),
      ROUND(inr_full * 0.012, 2),
      7.00,
      calculate_upfront_price(ROUND(inr_full * 0.012, 2), 7.00),
      ROUND(inr_continued * 0.012, 2),
      0.0120, NOW(), true
    );

    -- EUR (Example rate: 1 INR = 0.011 EUR)
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'EUR',
      ROUND(inr_monthly * 0.011, 2),
      ROUND(inr_full * 0.011, 2),
      7.00,
      calculate_upfront_price(ROUND(inr_full * 0.011, 2), 7.00),
      ROUND(inr_continued * 0.011, 2),
      0.0110, NOW(), true
    );

    -- GBP (Example rate: 1 INR = 0.0095 GBP)
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'GBP',
      ROUND(inr_monthly * 0.0095, 2),
      ROUND(inr_full * 0.0095, 2),
      7.00,
      calculate_upfront_price(ROUND(inr_full * 0.0095, 2), 7.00),
      ROUND(inr_continued * 0.0095, 2),
      0.0095, NOW(), true
    );

    -- SGD (Example rate: 1 INR = 0.016 SGD)
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'SGD',
      ROUND(inr_monthly * 0.016, 2),
      ROUND(inr_full * 0.016, 2),
      7.00,
      calculate_upfront_price(ROUND(inr_full * 0.016, 2), 7.00),
      ROUND(inr_continued * 0.016, 2),
      0.0160, NOW(), true
    );

    -- AED (Example rate: 1 INR = 0.044 AED)
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'AED',
      ROUND(inr_monthly * 0.044, 2),
      ROUND(inr_full * 0.044, 2),
      7.00,
      calculate_upfront_price(ROUND(inr_full * 0.044, 2), 7.00),
      ROUND(inr_continued * 0.044, 2),
      0.0440, NOW(), true
    );

  END LOOP;
END $$;

-- =====================================================
-- 3. CREATE BATCH #101 (Free Intro Batch)
-- =====================================================

-- Batch #101 is a special permanent batch for all free users
INSERT INTO batches_v2 (
  batch_code, batch_name, course_id, batch_type,
  session_days, session_time, timezone,
  start_date, end_date,
  max_students, is_active, is_visible_for_enrollment
) VALUES (
  'BATCH101',
  'Free Intro Batch - Batch #101',
  NULL, -- Not tied to any specific course
  'free_intro',
  'Available 24/7', -- Always available
  NULL,
  'Asia/Kolkata',
  '2026-02-13', -- Today
  NULL, -- No end date (permanent)
  NULL, -- Unlimited students
  true,
  true
);

-- =====================================================
-- 4. CREATE SAMPLE BATCHES FOR NEW COURSES
-- =====================================================

DO $$
DECLARE
  ai_ug_id UUID;
  ai_pg_id UUID;
  ai_kids_id UUID;
  ai_rejoin_id UUID;
BEGIN
  -- Get course IDs
  SELECT id INTO ai_ug_id FROM courses_v2 WHERE course_code = 'AI_UG';
  SELECT id INTO ai_pg_id FROM courses_v2 WHERE course_code = 'AI_PG';
  SELECT id INTO ai_kids_id FROM courses_v2 WHERE course_code = 'AI_KIDS';
  SELECT id INTO ai_rejoin_id FROM courses_v2 WHERE course_code = 'AI_REJOIN';

  -- AI_UG Batches
  INSERT INTO batches_v2 (
    batch_code, batch_name, course_id, batch_type,
    session_days, session_time, timezone,
    start_date, max_students, is_active, is_visible_for_enrollment
  ) VALUES
  ('AI_UG_FEB26_MON7PM', 'AI Undergraduate - Mon/Wed/Fri 7PM', ai_ug_id, 'paid',
   'Monday, Wednesday, Friday', '19:00:00', 'Asia/Kolkata',
   '2026-03-01', 30, true, true),
  ('AI_UG_FEB26_SAT10AM', 'AI Undergraduate - Sat/Sun 10AM', ai_ug_id, 'paid',
   'Saturday, Sunday', '10:00:00', 'Asia/Kolkata',
   '2026-03-01', 30, true, true);

  -- AI_PG Batches
  INSERT INTO batches_v2 (
    batch_code, batch_name, course_id, batch_type,
    session_days, session_time, timezone,
    start_date, max_students, is_active, is_visible_for_enrollment
  ) VALUES
  ('AI_PG_FEB26_TUE8PM', 'AI Postgraduate - Tue/Thu 8PM', ai_pg_id, 'paid',
   'Tuesday, Thursday', '20:00:00', 'Asia/Kolkata',
   '2026-03-01', 25, true, true),
  ('AI_PG_FEB26_SUN11AM', 'AI Postgraduate - Sun 11AM', ai_pg_id, 'paid',
   'Sunday', '11:00:00', 'Asia/Kolkata',
   '2026-03-01', 25, true, true);

  -- AI_KIDS Batches
  INSERT INTO batches_v2 (
    batch_code, batch_name, course_id, batch_type,
    session_days, session_time, timezone,
    start_date, max_students, is_active, is_visible_for_enrollment
  ) VALUES
  ('AI_KIDS_FEB26_SAT4PM', 'AI Kids - Sat 4PM', ai_kids_id, 'paid',
   'Saturday', '16:00:00', 'Asia/Kolkata',
   '2026-03-01', 20, true, true),
  ('AI_KIDS_FEB26_SUN4PM', 'AI Kids - Sun 4PM', ai_kids_id, 'paid',
   'Sunday', '16:00:00', 'Asia/Kolkata',
   '2026-03-01', 20, true, true);

  -- AI_REJOIN Batches
  INSERT INTO batches_v2 (
    batch_code, batch_name, course_id, batch_type,
    session_days, session_time, timezone,
    start_date, max_students, is_active, is_visible_for_enrollment
  ) VALUES
  ('AI_REJOIN_FEB26_WED11AM', 'AI Rejoiners - Wed 11AM', ai_rejoin_id, 'paid',
   'Wednesday', '11:00:00', 'Asia/Kolkata',
   '2026-03-01', 30, true, true),
  ('AI_REJOIN_FEB26_SAT2PM', 'AI Rejoiners - Sat 2PM', ai_rejoin_id, 'paid',
   'Saturday', '14:00:00', 'Asia/Kolkata',
   '2026-03-01', 30, true, true);

END $$;

-- =====================================================
-- 5. CREATE SAMPLE DISCOUNT COUPONS
-- =====================================================

-- Welcome coupon - 10% off for new students
INSERT INTO discount_coupons (
  coupon_code, coupon_name, description,
  discount_type, discount_value,
  applicable_to_courses, min_purchase_amount, max_discount_amount,
  max_total_uses, max_uses_per_student,
  valid_from, valid_until,
  applicable_to_new_students_only, applicable_to_payment_type,
  is_active
) VALUES (
  'WELCOME10',
  'Welcome Discount - 10% Off',
  'First-time student welcome offer',
  'percentage',
  10.00,
  NULL, -- Applicable to all courses
  NULL,
  5000.00, -- Max ₹5000 discount
  500,
  1,
  NOW(),
  NOW() + INTERVAL '90 days',
  true,
  'both',
  true
);

-- Early bird - ₹5000 flat discount
INSERT INTO discount_coupons (
  coupon_code, coupon_name, description,
  discount_type, discount_value,
  applicable_to_courses, min_purchase_amount, max_discount_amount,
  max_total_uses, max_uses_per_student,
  valid_from, valid_until,
  applicable_to_new_students_only, applicable_to_payment_type,
  is_active
) VALUES (
  'EARLYBIRD5K',
  'Early Bird - ₹5000 Off',
  'Limited time early bird offer',
  'fixed_amount',
  5000.00,
  NULL,
  40000.00, -- Minimum purchase ₹40000
  NULL,
  100,
  1,
  NOW(),
  NOW() + INTERVAL '30 days',
  false,
  'upfront',
  true
);

-- First month free
INSERT INTO discount_coupons (
  coupon_code, coupon_name, description,
  discount_type, discount_value,
  applicable_to_courses, min_purchase_amount, max_discount_amount,
  max_total_uses, max_uses_per_student,
  valid_from, valid_until,
  applicable_to_new_students_only, applicable_to_payment_type,
  is_active
) VALUES (
  'FIRSTFREE',
  'First Month Free',
  'Get your first month completely free',
  'first_month_free',
  7999.00,
  NULL,
  NULL,
  NULL,
  50,
  1,
  NOW(),
  NOW() + INTERVAL '60 days',
  true,
  'monthly',
  true
);

-- =====================================================
-- 6. CREATE SAMPLE STUDY MATERIALS FOR BATCH #101
-- =====================================================

INSERT INTO study_materials_v2 (
  title, description, material_type, access_level,
  file_url, is_active, is_featured, display_order
) VALUES
  ('Introduction to AI - Free Guide', 'Comprehensive guide to getting started with AI', 'pdf', 'free',
   'https://example.com/intro-to-ai.pdf', true, true, 1),

  ('Python Basics - Video Series', 'Learn Python fundamentals for AI', 'video', 'free',
   'https://example.com/python-basics', true, true, 2),

  ('AI Terminology - E-Book', 'Essential AI terms and concepts', 'e-book', 'free',
   'https://example.com/ai-terminology.pdf', true, false, 3),

  ('Getting Started with ChatGPT', 'Hands-on guide to using ChatGPT effectively', 'article', 'free',
   'https://example.com/chatgpt-guide', true, true, 4),

  ('Free Webinar: AI Career Paths', 'Recording of our popular AI career webinar', 'webinar', 'free',
   'https://example.com/ai-careers-webinar', true, false, 5);

-- =====================================================
-- SEED DATA COMPLETE
-- =====================================================

-- Summary
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SEED DATA INSERTION COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Courses Created: %', (SELECT COUNT(*) FROM courses_v2);
  RAISE NOTICE 'Pricing Rules Created: %', (SELECT COUNT(*) FROM pricing_rules_v2);
  RAISE NOTICE 'Batches Created: %', (SELECT COUNT(*) FROM batches_v2);
  RAISE NOTICE 'Discount Coupons Created: %', (SELECT COUNT(*) FROM discount_coupons);
  RAISE NOTICE 'Study Materials Created: %', (SELECT COUNT(*) FROM study_materials_v2);
  RAISE NOTICE '========================================';
END $$;
