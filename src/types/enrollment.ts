// =====================================================
// Enrollment & Batch Types
// =====================================================

export interface StudentEnrollmentV2 {
  id: string;
  student_email: string;
  student_name: string | null;
  auth_user_id: string | null;

  // Course & Batch
  course_id: string | null;
  batch_id: string | null;

  // Enrollment Details
  enrollment_date: string;
  enrollment_type: EnrollmentType;

  // Payment Info
  payment_type: string | null;
  payment_status: string;
  total_amount_paid: number;
  total_amount_due: number | null;
  currency: string;

  // Course Progress
  course_start_date: string | null;
  course_end_date: string | null;
  completion_percentage: number;
  is_completed: boolean;

  // Continued Learning
  is_continued_learning: boolean;
  continued_learning_start_date: string | null;
  continued_learning_status: ContinuedLearningStatus | null;

  // Group Booking
  group_booking_id: string | null;

  // UTM Tracking
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;

  // Status
  enrollment_status: EnrollmentStatus;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type EnrollmentType = 'free' | 'paid' | 'group' | 'continued_learning';
export type EnrollmentStatus = 'active' | 'paused' | 'completed' | 'cancelled' | 'expired';
export type ContinuedLearningStatus = 'active' | 'paused' | 'cancelled';

// =====================================================
// Batch Types
// =====================================================

export interface BatchV2 {
  id: string;
  batch_code: string;
  batch_name: string;
  course_id: string | null;
  batch_type: BatchType;

  // Schedule
  session_days: string | null;
  session_time: string | null; // TIME as string HH:MM:SS
  timezone: string;

  // Batch Period
  start_date: string | null;
  end_date: string | null;

  // Capacity
  max_students: number | null;
  current_student_count: number;

  // Access Control
  is_full: boolean;
  is_active: boolean;
  is_visible_for_enrollment: boolean;

  // Content
  accessible_content_ids: string[] | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type BatchType = 'free_intro' | 'paid' | 'trial' | 'masterclass';

// =====================================================
// AI Chat Types
// =====================================================

export interface AIChatMessage {
  id: string;
  user_email: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  message: string;
  openai_model: string | null;
  tokens_used: number | null;
  enrollment_type: string | null;
  created_at: string;
}

export interface AIChatLimit {
  id: string;
  user_type: string;
  daily_message_limit: number | null;
  monthly_message_limit: number | null;
  daily_token_limit: number | null;
  monthly_token_limit: number | null;
  is_active: boolean;
}

export interface AIChatSession {
  session_id: string;
  messages: AIChatMessage[];
  created_at: string;
  last_message_at: string;
}

// =====================================================
// Study Material Types
// =====================================================

export interface StudyMaterialV2 {
  id: string;
  title: string;
  description: string | null;
  material_type: MaterialType;
  file_url: string | null;
  file_size_mb: number | null;
  duration_minutes: number | null;
  access_level: AccessLevel;
  applicable_courses: string[] | null;
  applicable_batches: string[] | null;
  tags: string[] | null;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type MaterialType = 'pdf' | 'video' | 'e-book' | 'article' | 'webinar' | 'quiz' | 'assignment';
export type AccessLevel = 'free' | 'paid' | 'continued_learning' | 'all';

// =====================================================
// Parent-Student Relationship Types
// =====================================================

export interface ParentStudentRelationship {
  id: string;
  parent_email: string;
  parent_name: string;
  parent_mobile: string | null;
  parent_auth_user_id: string | null;
  student_email: string;
  student_name: string;
  student_age: number | null;
  student_auth_user_id: string | null;
  relationship_type: string | null;
  consent_given: boolean;
  consent_date: string | null;
  parent_dashboard_access: boolean;
  can_view_progress: boolean;
  can_view_chat_history: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
