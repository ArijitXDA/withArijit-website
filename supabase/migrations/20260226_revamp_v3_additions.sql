-- =====================================================
-- AIwithArijit Portal Revamp - V3 Additions Migration
-- Date: February 26, 2026
-- Purpose: Add admin_users (separate credentials), group bookings,
--          email system, and extend V2 tables with new columns
-- Prerequisite: Run 20260213_revamp_v2_schema_fixed.sql first
-- =====================================================

-- =====================================================
-- 1. ADMIN_USERS: Separate admin credential system
-- Independent from Supabase Auth - admins have their own login
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Credentials (independent of Supabase Auth)
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),

  -- Role & Permissions
  role VARCHAR(50) NOT NULL DEFAULT 'report_viewer',
  -- Roles: dev_admin, super_admin, course_admin, payment_admin,
  --        hr_admin, campaign_admin, qr_admin, aispot_admin, report_viewer
  permissions JSONB DEFAULT '{}',
  -- Example permissions: {"courses": true, "payments": true, "discounts": true}

  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  failed_login_count INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users table is accessed via service role key in edge function
-- No public access at all
DROP POLICY IF EXISTS "No public access to admin_users" ON admin_users;
CREATE POLICY "No public access to admin_users" ON admin_users
  FOR SELECT USING (false);

-- Service role bypasses RLS, so admin-auth edge function can query this table

-- =====================================================
-- 2. ADMIN_IMPERSONATION_LOG: Audit trail
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_impersonation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Admin performing impersonation
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  admin_username VARCHAR(100) NOT NULL,

  -- Target being impersonated
  target_email VARCHAR(255) NOT NULL,
  target_type VARCHAR(50) NOT NULL, -- 'student', 'admin'

  -- Session
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  ip_address VARCHAR(45),
  user_agent TEXT,

  -- Actions taken
  actions_log JSONB DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS idx_impersonation_admin ON admin_impersonation_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_impersonation_target ON admin_impersonation_log(target_email);
CREATE INDEX IF NOT EXISTS idx_impersonation_started ON admin_impersonation_log(started_at);

ALTER TABLE admin_impersonation_log ENABLE ROW LEVEL SECURITY;

-- Only accessible via service role
DROP POLICY IF EXISTS "No public access to impersonation log" ON admin_impersonation_log;
CREATE POLICY "No public access to impersonation log" ON admin_impersonation_log
  FOR SELECT USING (false);

-- =====================================================
-- 3. GROUP_BOOKINGS: Entity-level group purchases
-- =====================================================

CREATE TABLE IF NOT EXISTS group_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Entity Details (company/organization booking)
  entity_name VARCHAR(255) NOT NULL,
  entity_email VARCHAR(255) NOT NULL,
  entity_phone VARCHAR(20),
  entity_organization VARCHAR(255),

  -- Course
  course_id UUID REFERENCES courses_v2(id),
  batch_id UUID REFERENCES batches_v2(id),

  -- Seats
  total_seats INTEGER NOT NULL,
  filled_seats INTEGER DEFAULT 0,

  -- Payment
  price_per_seat DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  coupon_id UUID REFERENCES discount_coupons(id),
  currency VARCHAR(3) DEFAULT 'INR',

  -- Razorpay
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_date TIMESTAMPTZ,

  -- Invite
  invite_token UUID DEFAULT gen_random_uuid(),
  invite_expiry TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',

  -- Status
  booking_status VARCHAR(50) DEFAULT 'pending',
  -- pending, paid, partially_filled, completed, cancelled

  -- UTM Tracking
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_bookings_email ON group_bookings(entity_email);
CREATE INDEX IF NOT EXISTS idx_group_bookings_course ON group_bookings(course_id);
CREATE INDEX IF NOT EXISTS idx_group_bookings_status ON group_bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_group_bookings_token ON group_bookings(invite_token);
CREATE INDEX IF NOT EXISTS idx_group_bookings_razorpay ON group_bookings(razorpay_order_id);

ALTER TABLE group_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Entity can view their own bookings" ON group_bookings;
CREATE POLICY "Entity can view their own bookings" ON group_bookings
  FOR SELECT USING (entity_email = auth.email());

DROP POLICY IF EXISTS "Admins can manage all group bookings" ON group_bookings;
CREATE POLICY "Admins can manage all group bookings" ON group_bookings
  FOR ALL USING (is_admin());

-- =====================================================
-- 4. GROUP_BOOKING_MEMBERS: Individual member tracking
-- =====================================================

CREATE TABLE IF NOT EXISTS group_booking_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Group Booking Reference
  group_booking_id UUID REFERENCES group_bookings(id) ON DELETE CASCADE,

  -- Member Details
  member_email VARCHAR(255) NOT NULL,
  member_name VARCHAR(255),
  member_phone VARCHAR(20),

  -- Invite Status
  invite_sent BOOLEAN DEFAULT false,
  invite_sent_at TIMESTAMPTZ,
  invite_accepted BOOLEAN DEFAULT false,
  invite_accepted_at TIMESTAMPTZ,

  -- Signup Status
  has_signed_up BOOLEAN DEFAULT false,
  signed_up_at TIMESTAMPTZ,
  auth_user_id UUID REFERENCES auth.users(id),
  enrollment_id UUID REFERENCES student_enrollments_v2(id),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_members_booking ON group_booking_members(group_booking_id);
CREATE INDEX IF NOT EXISTS idx_group_members_email ON group_booking_members(member_email);

ALTER TABLE group_booking_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view their own record" ON group_booking_members;
CREATE POLICY "Members can view their own record" ON group_booking_members
  FOR SELECT USING (member_email = auth.email());

DROP POLICY IF EXISTS "Entity can view their group members" ON group_booking_members;
CREATE POLICY "Entity can view their group members" ON group_booking_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_bookings gb
      WHERE gb.id = group_booking_members.group_booking_id
      AND gb.entity_email = auth.email()
    )
  );

DROP POLICY IF EXISTS "Admins can manage all group members" ON group_booking_members;
CREATE POLICY "Admins can manage all group members" ON group_booking_members
  FOR ALL USING (is_admin());

-- =====================================================
-- 5. EMAIL_TEMPLATES: Provider-agnostic email templates
-- =====================================================

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Template Identity
  template_code VARCHAR(100) UNIQUE NOT NULL,
  template_name VARCHAR(255) NOT NULL,

  -- Template Content
  subject VARCHAR(500) NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT, -- Fallback plain text

  -- Trigger
  trigger_event VARCHAR(100),
  -- Events: user.signup, payment.success, enrollment.created,
  --         group.invite, batch.assigned, course.completed,
  --         continued_learning.activated, continued_learning.paused

  -- Variables (documenting what placeholders are available)
  available_variables JSONB DEFAULT '[]',
  -- e.g., ["{{student_name}}", "{{course_name}}", "{{batch_code}}"]

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id)
);

CREATE INDEX IF NOT EXISTS idx_email_templates_code ON email_templates(template_code);
CREATE INDEX IF NOT EXISTS idx_email_templates_trigger ON email_templates(trigger_event);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Templates are only managed by admins via service role
DROP POLICY IF EXISTS "No public access to email templates" ON email_templates;
CREATE POLICY "No public access to email templates" ON email_templates
  FOR SELECT USING (false);

-- =====================================================
-- 6. EMAIL_SEND_LOG: Track all sent emails
-- =====================================================

CREATE TABLE IF NOT EXISTS email_send_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Template Reference
  template_id UUID REFERENCES email_templates(id),
  template_code VARCHAR(100),

  -- Recipient
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),

  -- Content (snapshot of what was sent)
  subject VARCHAR(500),
  body_preview TEXT, -- First 500 chars of rendered body

  -- Variables used
  template_variables JSONB DEFAULT '{}',

  -- Delivery
  status VARCHAR(50) DEFAULT 'queued',
  -- queued, sending, sent, failed, bounced
  provider VARCHAR(50), -- SMTP provider name
  provider_message_id VARCHAR(255),
  error_message TEXT,

  -- Timestamps
  queued_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,

  -- Context
  triggered_by VARCHAR(100), -- What event triggered this email
  related_entity_type VARCHAR(50), -- 'enrollment', 'payment', 'group_booking'
  related_entity_id UUID
);

CREATE INDEX IF NOT EXISTS idx_email_log_recipient ON email_send_log(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_log_status ON email_send_log(status);
CREATE INDEX IF NOT EXISTS idx_email_log_template ON email_send_log(template_id);
CREATE INDEX IF NOT EXISTS idx_email_log_queued ON email_send_log(queued_at);

ALTER TABLE email_send_log ENABLE ROW LEVEL SECURITY;

-- Only accessible via service role
DROP POLICY IF EXISTS "No public access to email log" ON email_send_log;
CREATE POLICY "No public access to email log" ON email_send_log
  FOR SELECT USING (false);

-- =====================================================
-- 7. ALTER V2 TABLES: Add new columns
-- =====================================================

-- 7A. discount_coupons - Add UTM, geo, installment, and date control columns
ALTER TABLE discount_coupons
  ADD COLUMN IF NOT EXISTS applicable_to_utm_source VARCHAR(255),
  ADD COLUMN IF NOT EXISTS applicable_to_utm_code VARCHAR(255),
  ADD COLUMN IF NOT EXISTS applicable_to_country VARCHAR(100),
  ADD COLUMN IF NOT EXISTS applicable_to_city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS applicable_to_installment VARCHAR(50),
  -- Values: full_payment, 1st_installment, 2nd_onwards, continued_learning
  ADD COLUMN IF NOT EXISTS pause_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stop_date TIMESTAMPTZ;

-- 7B. courses_v2 - Add navigation category, topics, and curriculum
ALTER TABLE courses_v2
  ADD COLUMN IF NOT EXISTS navigation_category VARCHAR(50),
  -- Values: techies, non_techies, students, job_seekers
  ADD COLUMN IF NOT EXISTS topics TEXT[],
  ADD COLUMN IF NOT EXISTS curriculum JSONB DEFAULT '[]';

CREATE INDEX IF NOT EXISTS idx_courses_v2_nav_category ON courses_v2(navigation_category);

-- 7C. student_enrollments_v2 - Add group booking ref and UTM tracking
ALTER TABLE student_enrollments_v2
  ADD COLUMN IF NOT EXISTS group_booking_id UUID REFERENCES group_bookings(id),
  ADD COLUMN IF NOT EXISTS utm_source VARCHAR(255),
  ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(255),
  ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(255);

-- 7D. Fix continued_learning_monthly_price from 3000 to 2999
UPDATE courses_v2 SET continued_learning_monthly_price = 2999.00
  WHERE continued_learning_monthly_price = 3000.00;

-- =====================================================
-- 8. UPDATE is_admin() FUNCTION
-- Uses admin_users table instead of crm_employees
-- Still checks auth.email() for RLS policies
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.email()
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- New helper: get admin role
CREATE OR REPLACE FUNCTION get_admin_role()
RETURNS VARCHAR AS $$
DECLARE
  admin_role VARCHAR;
BEGIN
  SELECT role INTO admin_role FROM admin_users
  WHERE email = auth.email()
  AND is_active = true;
  RETURN admin_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- New helper: check specific permission
CREATE OR REPLACE FUNCTION has_admin_permission(permission_key TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.email()
    AND is_active = true
    AND (
      role IN ('dev_admin', 'super_admin')
      OR (permissions ->> permission_key)::boolean = true
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. SEED: Default email templates
-- =====================================================

INSERT INTO email_templates (template_code, template_name, subject, body_html, trigger_event, available_variables)
VALUES
  ('welcome_signup', 'Welcome - New Signup', 'Welcome to AIwithArijit!',
   '<h1>Welcome, {{student_name}}!</h1><p>Thank you for signing up at AIwithArijit. You have been assigned to <strong>Batch #101</strong> (Free Intro) and can now access our free learning materials.</p><p>Explore courses at <a href="https://www.witharijit.com/courses">witharijit.com/courses</a></p>',
   'user.signup',
   '["{{student_name}}", "{{student_email}}", "{{batch_name}}"]'::jsonb),

  ('payment_success', 'Payment Confirmation', 'Payment Successful - {{course_name}}',
   '<h1>Payment Confirmed!</h1><p>Hi {{student_name}},</p><p>Your payment of {{currency}} {{amount}} for <strong>{{course_name}}</strong> has been received.</p><p>Transaction ID: {{razorpay_payment_id}}</p><p>Please choose your batch at <a href="https://www.witharijit.com/choose-batch">witharijit.com/choose-batch</a></p>',
   'payment.success',
   '["{{student_name}}", "{{course_name}}", "{{amount}}", "{{currency}}", "{{razorpay_payment_id}}"]'::jsonb),

  ('enrollment_created', 'Enrollment Confirmation', 'You are enrolled in {{course_name}}!',
   '<h1>Enrollment Confirmed!</h1><p>Hi {{student_name}},</p><p>You have been enrolled in <strong>{{course_name}}</strong> ({{batch_name}}).</p><p>Sessions: {{session_days}} at {{session_time}}</p><p>Access your dashboard at <a href="https://www.witharijit.com/dashboard">witharijit.com/dashboard</a></p>',
   'enrollment.created',
   '["{{student_name}}", "{{course_name}}", "{{batch_name}}", "{{session_days}}", "{{session_time}}"]'::jsonb),

  ('group_invite', 'Group Booking - Member Invite', 'You have been invited to {{course_name}}!',
   '<h1>You''re Invited!</h1><p>Hi,</p><p>{{entity_name}} has enrolled you in <strong>{{course_name}}</strong> at AIwithArijit.</p><p>Please sign up using this link to claim your seat:</p><p><a href="{{signup_link}}">{{signup_link}}</a></p><p>This invitation expires on {{expiry_date}}.</p>',
   'group.invite',
   '["{{entity_name}}", "{{course_name}}", "{{signup_link}}", "{{expiry_date}}"]'::jsonb),

  ('batch_assigned', 'Batch Assignment', 'Your batch has been assigned - {{batch_name}}',
   '<h1>Batch Assigned!</h1><p>Hi {{student_name}},</p><p>You have been assigned to <strong>{{batch_name}}</strong> for {{course_name}}.</p><p>Sessions: {{session_days}} at {{session_time}} ({{timezone}})</p><p>Start Date: {{start_date}}</p>',
   'batch.assigned',
   '["{{student_name}}", "{{batch_name}}", "{{course_name}}", "{{session_days}}", "{{session_time}}", "{{timezone}}", "{{start_date}}"]'::jsonb),

  ('continued_learning_activated', 'Continued Learning Activated', 'Continued Learning - {{course_name}}',
   '<h1>Continued Learning Active!</h1><p>Hi {{student_name}},</p><p>Your Continued Learning subscription for <strong>{{course_name}}</strong> is now active.</p><p>Monthly fee: INR 2,999</p><p>Access your materials at <a href="https://www.witharijit.com/dashboard">witharijit.com/dashboard</a></p>',
   'continued_learning.activated',
   '["{{student_name}}", "{{course_name}}"]'::jsonb),

  ('continued_learning_paused', 'Continued Learning Paused', 'Continued Learning Paused - {{course_name}}',
   '<h1>Subscription Paused</h1><p>Hi {{student_name}},</p><p>Your Continued Learning subscription for <strong>{{course_name}}</strong> has been paused by the admin.</p><p>Contact us if you wish to resume.</p>',
   'continued_learning.paused',
   '["{{student_name}}", "{{course_name}}"]'::jsonb)

ON CONFLICT (template_code) DO NOTHING;

-- =====================================================
-- 10. SEED: All courses with navigation categories
-- These are the additional courses not in the original seed
-- =====================================================

-- Techies courses
INSERT INTO courses_v2 (
  course_code, course_name, course_category, target_audience,
  duration_months, monthly_price, full_course_price, upfront_discount_percent,
  upfront_final_price, continued_learning_monthly_price,
  description, display_order, navigation_category, topics
) VALUES
  ('AI_AGENTIC', 'Agentic AI Development', 'Tech', 'Tech Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'Master the art of building autonomous AI agents with real-world applications',
   10, 'techies',
   ARRAY['Agentic AI', 'LangChain', 'AutoGen', 'CrewAI', 'Tool Calling', 'RAG']),

  ('AI_ADVLLM', 'Advance Agentic Development (Language Model Development)', 'Tech', 'Tech Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'Deep dive into LLM development, fine-tuning, and advanced agentic architectures',
   11, 'techies',
   ARRAY['LLM Development', 'Fine-tuning', 'RLHF', 'Model Architecture', 'Inference Optimization']),

  ('AI_VIBE', 'Vibe Coding', 'Tech', 'Tech Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'Learn to code with AI-powered tools and collaborative development workflows',
   12, 'techies',
   ARRAY['AI-Assisted Coding', 'Copilot', 'Claude Code', 'Cursor', 'Prompt Engineering for Dev']),

  ('AI_PYTHON', 'Python for ML & AI', 'Tech', 'Tech Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'Comprehensive Python training focused on Machine Learning and AI applications',
   13, 'techies',
   ARRAY['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow', 'PyTorch']),

  ('AI_QUANTUM', 'Quantum Computing', 'Tech', 'Tech Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'Introduction to Quantum Computing and its intersection with AI',
   14, 'techies',
   ARRAY['Quantum Computing', 'Qiskit', 'Quantum ML', 'Quantum Algorithms']),

  ('AI_POWERBI', 'PowerBI & Tableau', 'Tech', 'Tech Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'Data visualization and business intelligence using PowerBI and Tableau',
   15, 'techies',
   ARRAY['PowerBI', 'Tableau', 'Data Visualization', 'Business Intelligence', 'DAX'])

ON CONFLICT (course_code) DO UPDATE SET
  navigation_category = EXCLUDED.navigation_category,
  topics = EXCLUDED.topics,
  continued_learning_monthly_price = EXCLUDED.continued_learning_monthly_price;

-- Non-Techies courses
INSERT INTO courses_v2 (
  course_code, course_name, course_category, target_audience,
  duration_months, monthly_price, full_course_price, upfront_discount_percent,
  upfront_final_price, continued_learning_monthly_price,
  description, display_order, navigation_category, topics
) VALUES
  ('AI_BANKING', 'AI for Banking & Finance', 'Non-Tech', 'Banking Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'AI applications in banking, financial analysis, risk management, and fintech',
   20, 'non_techies',
   ARRAY['AI in Banking', 'Risk Analysis', 'Fintech', 'Regulatory AI', 'Fraud Detection']),

  ('AI_PHARMA', 'AI for Pharma & FMCG', 'Non-Tech', 'Pharma/FMCG Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'AI applications in pharmaceutical research, supply chain, and FMCG operations',
   21, 'non_techies',
   ARRAY['Drug Discovery', 'Supply Chain AI', 'Quality Control', 'Market Analysis']),

  ('AI_SALES', 'AI for Sales', 'Non-Tech', 'Sales Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'Leverage AI to enhance sales processes, lead generation, and customer engagement',
   22, 'non_techies',
   ARRAY['Sales Automation', 'Lead Scoring', 'CRM AI', 'Predictive Sales']),

  ('AI_MARKETING', 'AI for Marketing', 'Non-Tech', 'Marketing Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'AI-powered marketing strategies, content generation, and campaign optimization',
   23, 'non_techies',
   ARRAY['AI Marketing', 'Content AI', 'Campaign Optimization', 'SEO AI', 'Social Media AI']),

  ('AI_MGMT', 'AI for HR/Project/Product Management', 'Non-Tech', 'Management Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'AI tools and strategies for HR, project management, and product management',
   24, 'non_techies',
   ARRAY['HR AI', 'Project Management AI', 'Product Management', 'Process Automation']),

  ('AI_STARTUP', 'AI for Startups & Entrepreneurs', 'Non-Tech', 'Entrepreneurs',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'Build AI-powered startups and leverage AI as a competitive advantage',
   25, 'non_techies',
   ARRAY['AI Strategy', 'MVP with AI', 'Fundraising', 'AI Product Development']),

  ('AI_CXO', 'AI for CXOs', 'Non-Tech', 'C-Suite Executives',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'Strategic AI adoption for business leaders and C-suite executives',
   26, 'non_techies',
   ARRAY['AI Strategy', 'Digital Transformation', 'AI Governance', 'ROI of AI']),

  ('AI_EXCEL', 'Excel Automation with AI', 'Non-Tech', 'Business Professionals',
   6, 7999.00, 47994.00, 7.00, 44634.42, 2999.00,
   'Automate Excel workflows using AI, advanced formulas, and VBA with AI',
   27, 'non_techies',
   ARRAY['Excel AI', 'VBA', 'Power Automate', 'Data Analysis', 'Automation'])

ON CONFLICT (course_code) DO UPDATE SET
  navigation_category = EXCLUDED.navigation_category,
  topics = EXCLUDED.topics,
  continued_learning_monthly_price = EXCLUDED.continued_learning_monthly_price;

-- Update existing seed courses with navigation_category and corrected price
UPDATE courses_v2 SET
  navigation_category = 'students',
  continued_learning_monthly_price = 2999.00
WHERE course_code IN ('AI_UG', 'AI_PG', 'AI_KIDS');

UPDATE courses_v2 SET
  navigation_category = 'job_seekers',
  continued_learning_monthly_price = 2999.00
WHERE course_code = 'AI_REJOIN';

-- Also update pricing_rules_v2 continued_learning_price from 3000 to 2999
UPDATE pricing_rules_v2 SET
  continued_learning_price = ROUND(2999.00 * exchange_rate_from_inr, 2)
WHERE continued_learning_price IS NOT NULL;

-- =====================================================
-- 11. SEED: Multi-currency pricing for new courses
-- =====================================================

DO $$
DECLARE
  course_record RECORD;
  inr_monthly DECIMAL := 7999.00;
  inr_full DECIMAL := 47994.00;
  inr_continued DECIMAL := 2999.00;
BEGIN
  -- Only process courses that don't already have pricing entries
  FOR course_record IN
    SELECT id FROM courses_v2
    WHERE id NOT IN (SELECT DISTINCT course_id FROM pricing_rules_v2 WHERE course_id IS NOT NULL)
  LOOP

    -- INR (Base Currency)
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'INR', inr_monthly, inr_full, 7.00,
      ROUND(inr_full * (1 - 7.00/100), 2), inr_continued,
      1.0000, NOW(), false
    );

    -- USD
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'USD',
      ROUND(inr_monthly * 0.012, 2), ROUND(inr_full * 0.012, 2), 7.00,
      ROUND(ROUND(inr_full * 0.012, 2) * (1 - 7.00/100), 2),
      ROUND(inr_continued * 0.012, 2),
      0.0120, NOW(), true
    );

    -- EUR
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'EUR',
      ROUND(inr_monthly * 0.011, 2), ROUND(inr_full * 0.011, 2), 7.00,
      ROUND(ROUND(inr_full * 0.011, 2) * (1 - 7.00/100), 2),
      ROUND(inr_continued * 0.011, 2),
      0.0110, NOW(), true
    );

    -- GBP
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'GBP',
      ROUND(inr_monthly * 0.0095, 2), ROUND(inr_full * 0.0095, 2), 7.00,
      ROUND(ROUND(inr_full * 0.0095, 2) * (1 - 7.00/100), 2),
      ROUND(inr_continued * 0.0095, 2),
      0.0095, NOW(), true
    );

    -- SGD
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'SGD',
      ROUND(inr_monthly * 0.016, 2), ROUND(inr_full * 0.016, 2), 7.00,
      ROUND(ROUND(inr_full * 0.016, 2) * (1 - 7.00/100), 2),
      ROUND(inr_continued * 0.016, 2),
      0.0160, NOW(), true
    );

    -- AED
    INSERT INTO pricing_rules_v2 (
      course_id, currency_code, monthly_price, full_course_price,
      upfront_discount_percent, upfront_final_price, continued_learning_price,
      exchange_rate_from_inr, last_rate_update, is_auto_converted
    ) VALUES (
      course_record.id, 'AED',
      ROUND(inr_monthly * 0.044, 2), ROUND(inr_full * 0.044, 2), 7.00,
      ROUND(ROUND(inr_full * 0.044, 2) * (1 - 7.00/100), 2),
      ROUND(inr_continued * 0.044, 2),
      0.0440, NOW(), true
    );

  END LOOP;
END $$;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'V3 ADDITIONS MIGRATION COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'New Tables: admin_users, admin_impersonation_log, group_bookings, group_booking_members, email_templates, email_send_log';
  RAISE NOTICE 'Altered Tables: discount_coupons (+7 cols), courses_v2 (+3 cols), student_enrollments_v2 (+4 cols)';
  RAISE NOTICE 'Updated Functions: is_admin(), get_admin_role(), has_admin_permission()';
  RAISE NOTICE 'Continued Learning Price: Fixed to INR 2,999';
  RAISE NOTICE 'Courses Added: %', (SELECT COUNT(*) FROM courses_v2);
  RAISE NOTICE 'Email Templates: %', (SELECT COUNT(*) FROM email_templates);
  RAISE NOTICE '========================================';
END $$;
