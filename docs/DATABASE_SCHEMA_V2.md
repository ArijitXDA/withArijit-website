# Database Schema V2 - AIwithArijit Portal Revamp
**Date:** February 13, 2026
**Status:** Production-Safe (Parallel Tables Only)

## 🎯 Design Principles
1. **ZERO impact** on existing tables and students
2. Create **parallel tables** with `_v2` suffix
3. Maintain backward compatibility
4. Support gradual migration

---

## 📊 New Tables Overview

### **1. courses_v2**
New course catalog with 6-month duration and updated pricing

```sql
CREATE TABLE courses_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Course Identity
  course_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., "AI_UG", "AI_PG", "AI_KIDS", "AI_REJOIN"
  course_name VARCHAR(255) NOT NULL,
  course_category VARCHAR(100), -- "Students", "Professionals", "Corporate", etc.
  target_audience VARCHAR(100), -- "Undergraduate", "Postgraduate", "8-16 Age", "Rejoiners"

  -- Course Details
  duration_months INTEGER NOT NULL DEFAULT 6,
  description TEXT,
  syllabus_url TEXT,
  prerequisites TEXT,

  -- Pricing (INR)
  monthly_price DECIMAL(10,2) NOT NULL, -- 7999.00
  full_course_price DECIMAL(10,2) NOT NULL, -- 47994.00 (7999 x 6)
  upfront_discount_percent DECIMAL(5,2) DEFAULT 7.00, -- 7% instant discount
  upfront_final_price DECIMAL(10,2), -- Auto-calculated: 44634.42

  -- Continued Learning
  continued_learning_enabled BOOLEAN DEFAULT true,
  continued_learning_monthly_price DECIMAL(10,2) DEFAULT 3000.00,

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true, -- Show on website
  display_order INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_courses_v2_code ON courses_v2(course_code);
CREATE INDEX idx_courses_v2_active ON courses_v2(is_active, is_visible);

-- RLS Policies
ALTER TABLE courses_v2 ENABLE ROW LEVEL SECURITY;

-- Public can view active courses
CREATE POLICY "Public can view active courses" ON courses_v2
  FOR SELECT USING (is_active = true AND is_visible = true);

-- Only admins can modify
CREATE POLICY "Admins can manage courses" ON courses_v2
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

### **2. pricing_rules_v2**
Multi-currency pricing with real-time conversion

```sql
CREATE TABLE pricing_rules_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Course Reference
  course_id UUID REFERENCES courses_v2(id) ON DELETE CASCADE,

  -- Currency
  currency_code VARCHAR(3) NOT NULL, -- "INR", "USD", "EUR", "GBP", "SGD", "AED"

  -- Prices in local currency
  monthly_price DECIMAL(10,2) NOT NULL,
  full_course_price DECIMAL(10,2) NOT NULL,
  upfront_discount_percent DECIMAL(5,2) DEFAULT 7.00,
  upfront_final_price DECIMAL(10,2),
  continued_learning_price DECIMAL(10,2),

  -- Conversion (for display purposes)
  exchange_rate_from_inr DECIMAL(10,4), -- e.g., 0.012 for USD
  last_rate_update TIMESTAMPTZ,
  is_auto_converted BOOLEAN DEFAULT true, -- Auto-update rates

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(course_id, currency_code)
);

-- Indexes
CREATE INDEX idx_pricing_v2_course ON pricing_rules_v2(course_id);
CREATE INDEX idx_pricing_v2_currency ON pricing_rules_v2(currency_code);

-- RLS
ALTER TABLE pricing_rules_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view pricing" ON pricing_rules_v2
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage pricing" ON pricing_rules_v2
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

### **3. discount_coupons**
Flexible discount system with admin control

```sql
CREATE TABLE discount_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Coupon Identity
  coupon_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., "WELCOME50", "EARLYBIRD"
  coupon_name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Discount Type
  discount_type VARCHAR(20) NOT NULL, -- "percentage", "fixed_amount", "first_month_free"
  discount_value DECIMAL(10,2) NOT NULL, -- 20 for 20%, 2000 for ₹2000 off

  -- Applicability
  applicable_to_courses UUID[], -- Array of course_v2 IDs, NULL = all courses
  min_purchase_amount DECIMAL(10,2), -- Minimum cart value
  max_discount_amount DECIMAL(10,2), -- Cap for percentage discounts

  -- Usage Limits
  max_total_uses INTEGER, -- Total times coupon can be used (NULL = unlimited)
  max_uses_per_student INTEGER DEFAULT 1, -- Per student limit
  current_use_count INTEGER DEFAULT 0, -- Track usage

  -- Validity
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,

  -- Restrictions
  applicable_to_new_students_only BOOLEAN DEFAULT false,
  applicable_to_payment_type VARCHAR(20), -- "upfront", "monthly", "both"

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_coupons_code ON discount_coupons(coupon_code);
CREATE INDEX idx_coupons_active ON discount_coupons(is_active);
CREATE INDEX idx_coupons_validity ON discount_coupons(valid_from, valid_until);

-- RLS
ALTER TABLE discount_coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active coupons" ON discount_coupons
  FOR SELECT USING (is_active = true AND NOW() BETWEEN valid_from AND valid_until);

CREATE POLICY "Admins can manage coupons" ON discount_coupons
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

### **4. coupon_usage_log**
Track coupon redemptions

```sql
CREATE TABLE coupon_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  coupon_id UUID REFERENCES discount_coupons(id) ON DELETE CASCADE,
  student_email VARCHAR(255) NOT NULL,
  payment_id UUID, -- Link to payments_v2 table

  -- Discount Applied
  discount_amount DECIMAL(10,2) NOT NULL,
  original_amount DECIMAL(10,2) NOT NULL,
  final_amount DECIMAL(10,2) NOT NULL,

  -- Metadata
  used_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Indexes
CREATE INDEX idx_coupon_usage_coupon ON coupon_usage_log(coupon_id);
CREATE INDEX idx_coupon_usage_student ON coupon_usage_log(student_email);
CREATE INDEX idx_coupon_usage_payment ON coupon_usage_log(payment_id);

-- RLS
ALTER TABLE coupon_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own usage" ON coupon_usage_log
  FOR SELECT USING (student_email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can view all usage" ON coupon_usage_log
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

### **5. batches_v2**
Course batch scheduling and management

```sql
CREATE TABLE batches_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Batch Identity
  batch_code VARCHAR(50) UNIQUE NOT NULL, -- "BATCH101", "AI_UG_FEB26_MON7PM"
  batch_name VARCHAR(255) NOT NULL,

  -- Course Reference
  course_id UUID REFERENCES courses_v2(id) ON DELETE CASCADE,

  -- Batch Type
  batch_type VARCHAR(50) NOT NULL, -- "free_intro" (Batch#101), "paid", "continued_learning"

  -- Schedule
  session_days VARCHAR(100), -- "Monday, Wednesday, Friday"
  session_time TIME, -- e.g., "19:00:00" for 7 PM
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',

  -- Batch Period
  start_date DATE,
  end_date DATE,

  -- Capacity
  max_students INTEGER,
  current_student_count INTEGER DEFAULT 0,

  -- Access Control
  is_full BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_visible_for_enrollment BOOLEAN DEFAULT true,

  -- Content Access
  accessible_content_ids UUID[], -- Array of content/material IDs

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_batches_v2_code ON batches_v2(batch_code);
CREATE INDEX idx_batches_v2_course ON batches_v2(course_id);
CREATE INDEX idx_batches_v2_type ON batches_v2(batch_type);
CREATE INDEX idx_batches_v2_active ON batches_v2(is_active, is_visible_for_enrollment);

-- RLS
ALTER TABLE batches_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view available batches" ON batches_v2
  FOR SELECT USING (is_active = true AND is_visible_for_enrollment = true);

CREATE POLICY "Admins can manage batches" ON batches_v2
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

### **6. student_enrollments_v2**
New enrollment tracking (parallel to student_master_table)

```sql
CREATE TABLE student_enrollments_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Student Identity
  student_email VARCHAR(255) NOT NULL,
  student_name VARCHAR(255),
  auth_user_id UUID REFERENCES auth.users(id),

  -- Course & Batch
  course_id UUID REFERENCES courses_v2(id),
  batch_id UUID REFERENCES batches_v2(id),

  -- Enrollment Details
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  enrollment_type VARCHAR(50), -- "free" (Batch#101), "paid", "continued_learning"

  -- Payment Info
  payment_type VARCHAR(20), -- "upfront", "monthly"
  payment_status VARCHAR(50) DEFAULT 'pending', -- "pending", "partial", "completed"
  total_amount_paid DECIMAL(10,2) DEFAULT 0,
  total_amount_due DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'INR',

  -- Course Progress
  course_start_date DATE,
  course_end_date DATE,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,

  -- Continued Learning
  is_continued_learning BOOLEAN DEFAULT false,
  continued_learning_start_date DATE,
  continued_learning_status VARCHAR(20), -- "active", "paused", "cancelled"

  -- Status
  enrollment_status VARCHAR(50) DEFAULT 'active', -- "active", "paused", "cancelled", "completed"

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_enrollments_v2_email ON student_enrollments_v2(student_email);
CREATE INDEX idx_enrollments_v2_course ON student_enrollments_v2(course_id);
CREATE INDEX idx_enrollments_v2_batch ON student_enrollments_v2(batch_id);
CREATE INDEX idx_enrollments_v2_status ON student_enrollments_v2(enrollment_status);

-- RLS
ALTER TABLE student_enrollments_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own enrollments" ON student_enrollments_v2
  FOR SELECT USING (student_email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can manage all enrollments" ON student_enrollments_v2
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

### **7. payments_v2**
Enhanced payment tracking with installments

```sql
CREATE TABLE payments_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Student & Enrollment
  student_email VARCHAR(255) NOT NULL,
  enrollment_id UUID REFERENCES student_enrollments_v2(id),
  course_id UUID REFERENCES courses_v2(id),

  -- Payment Details
  payment_type VARCHAR(20) NOT NULL, -- "upfront", "monthly", "continued_learning"
  installment_number INTEGER, -- 1, 2, 3, 4, 5, 6 for monthly payments

  -- Amounts
  original_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',

  -- Discount/Coupon
  coupon_id UUID REFERENCES discount_coupons(id),
  coupon_code VARCHAR(50),

  -- Razorpay Integration
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(500),

  -- Status
  payment_status VARCHAR(50) DEFAULT 'pending', -- "pending", "success", "failed", "refunded"
  payment_method VARCHAR(50), -- "card", "upi", "netbanking", etc.
  failure_reason TEXT,

  -- Timestamps
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payments_v2_email ON payments_v2(student_email);
CREATE INDEX idx_payments_v2_enrollment ON payments_v2(enrollment_id);
CREATE INDEX idx_payments_v2_status ON payments_v2(payment_status);
CREATE INDEX idx_payments_v2_razorpay_order ON payments_v2(razorpay_order_id);

-- RLS
ALTER TABLE payments_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own payments" ON payments_v2
  FOR SELECT USING (student_email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can manage all payments" ON payments_v2
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

### **8. ai_chat_history**
OpenAI chat conversations with rate limiting

```sql
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User Identity
  user_email VARCHAR(255) NOT NULL,
  auth_user_id UUID REFERENCES auth.users(id),
  session_id UUID NOT NULL, -- Group messages by conversation

  -- Message
  role VARCHAR(20) NOT NULL, -- "user", "assistant", "system"
  message TEXT NOT NULL,

  -- OpenAI Metadata
  openai_model VARCHAR(50), -- "gpt-4", "gpt-3.5-turbo"
  tokens_used INTEGER,

  -- Context
  enrollment_type VARCHAR(50), -- "free" (Batch#101), "paid", "continued_learning"

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_history_user ON ai_chat_history(user_email);
CREATE INDEX idx_chat_history_session ON ai_chat_history(session_id);
CREATE INDEX idx_chat_history_created ON ai_chat_history(created_at);

-- RLS
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chats" ON ai_chat_history
  FOR SELECT USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert their own chats" ON ai_chat_history
  FOR INSERT WITH CHECK (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can view all chats" ON ai_chat_history
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

### **9. ai_chat_limits**
Admin-controlled rate limiting for AI chat

```sql
CREATE TABLE ai_chat_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Limit Type
  user_type VARCHAR(50) NOT NULL, -- "free" (Batch#101), "paid", "continued_learning", "admin"

  -- Daily Limits
  daily_message_limit INTEGER, -- NULL = unlimited
  daily_token_limit INTEGER,

  -- Monthly Limits
  monthly_message_limit INTEGER,
  monthly_token_limit INTEGER,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_type)
);

-- Insert Default Limits
INSERT INTO ai_chat_limits (user_type, daily_message_limit, monthly_message_limit) VALUES
  ('free', 10, 100),
  ('paid', 50, 1000),
  ('continued_learning', 100, NULL),
  ('admin', NULL, NULL);

-- RLS
ALTER TABLE ai_chat_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view limits" ON ai_chat_limits
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage limits" ON ai_chat_limits
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

### **10. parent_student_relationship**
For 8-16 age group parental consent and dashboard

```sql
CREATE TABLE parent_student_relationship (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Parent Details
  parent_email VARCHAR(255) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  parent_mobile VARCHAR(20),
  parent_auth_user_id UUID REFERENCES auth.users(id),

  -- Student Details
  student_email VARCHAR(255) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  student_age INTEGER,
  student_auth_user_id UUID REFERENCES auth.users(id),

  -- Relationship
  relationship_type VARCHAR(50), -- "parent", "guardian"

  -- Consent
  consent_given BOOLEAN DEFAULT false,
  consent_date TIMESTAMPTZ,
  consent_ip_address VARCHAR(45),

  -- Access Control
  parent_dashboard_access BOOLEAN DEFAULT true,
  can_view_progress BOOLEAN DEFAULT true,
  can_view_chat_history BOOLEAN DEFAULT true,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_parent_student_parent ON parent_student_relationship(parent_email);
CREATE INDEX idx_parent_student_student ON parent_student_relationship(student_email);

-- RLS
ALTER TABLE parent_student_relationship ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children" ON parent_student_relationship
  FOR SELECT USING (parent_email = auth.jwt() ->> 'email');

CREATE POLICY "Students can view their parents" ON parent_student_relationship
  FOR SELECT USING (student_email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can manage relationships" ON parent_student_relationship
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

### **11. study_materials_v2**
Content library for courses and batches

```sql
CREATE TABLE study_materials_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Material Identity
  title VARCHAR(255) NOT NULL,
  description TEXT,
  material_type VARCHAR(50) NOT NULL, -- "pdf", "video", "article", "e-book", "webinar"

  -- File/URL
  file_url TEXT,
  file_size_mb DECIMAL(10,2),
  duration_minutes INTEGER, -- For videos/webinars

  -- Access Control
  access_level VARCHAR(50) NOT NULL, -- "free" (Batch#101), "paid", "continued_learning", "all"
  applicable_courses UUID[], -- Array of course_v2 IDs
  applicable_batches UUID[], -- Array of batches_v2 IDs

  -- Content Metadata
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_materials_v2_type ON study_materials_v2(material_type);
CREATE INDEX idx_materials_v2_access ON study_materials_v2(access_level);
CREATE INDEX idx_materials_v2_active ON study_materials_v2(is_active);

-- RLS
ALTER TABLE study_materials_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view free materials" ON study_materials_v2
  FOR SELECT USING (access_level = 'free' AND is_active = true);

CREATE POLICY "Paid students can view paid materials" ON study_materials_v2
  FOR SELECT USING (
    access_level IN ('free', 'paid', 'all')
    AND is_active = true
    AND EXISTS (
      SELECT 1 FROM student_enrollments_v2
      WHERE student_email = auth.jwt() ->> 'email'
      AND enrollment_type IN ('paid', 'continued_learning')
    )
  );

CREATE POLICY "Admins can manage materials" ON study_materials_v2
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM crm_employees WHERE role = 'admin')
  );
```

---

## 🔄 Migration Strategy

### Phase 1: Setup (Week 1)
1. Create all new tables with RLS policies
2. Insert default data (Batch#101, default AI limits, initial courses)
3. Test all policies with different user roles

### Phase 2: Parallel Run (Week 2)
1. New signups → Use new tables only
2. Existing students → Continue using old tables
3. Admin panel → Show both old and new data

### Phase 3: Gradual Migration (Week 3-4)
1. Allow existing students to opt-in to new system
2. Provide migration tool for admins
3. Monitor both systems in parallel

---

## 📝 Notes

**CRITICAL:**
- NEVER modify existing tables: `student_master_table`, `payments`, `masterclass_payments`, etc.
- All new features use `_v2` tables
- Existing students remain unaffected
- Admin panel shows unified view of old + new systems

**Next Steps:**
1. Review and approve this schema
2. Create SQL migration files
3. Apply to production database
4. Build admin interfaces
5. Update frontend components
