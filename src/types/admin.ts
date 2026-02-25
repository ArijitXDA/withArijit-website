// =====================================================
// Admin Types - Separate Credentials System
// =====================================================

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  display_name: string | null;
  role: AdminRole;
  permissions: AdminPermissions;
  is_active: boolean;
  last_login_at: string | null;
  login_count: number;
  created_at: string;
  updated_at: string;
}

export type AdminRole =
  | 'dev_admin'
  | 'super_admin'
  | 'course_admin'
  | 'payment_admin'
  | 'hr_admin'
  | 'campaign_admin'
  | 'qr_admin'
  | 'aispot_admin'
  | 'report_viewer';

export interface AdminPermissions {
  courses?: boolean;
  batches?: boolean;
  students?: boolean;
  enrollments?: boolean;
  payments?: boolean;
  discounts?: boolean;
  group_bookings?: boolean;
  study_materials?: boolean;
  ai_chat?: boolean;
  email_templates?: boolean;
  reports?: boolean;
  qr_campaigns?: boolean;
  ai_spot?: boolean;
  certificates?: boolean;
  session_links?: boolean;
  user_management?: boolean;
  impersonation?: boolean;
  [key: string]: boolean | undefined;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  admin?: AdminUser;
  error?: string;
}

export interface AdminSession {
  admin: AdminUser;
  token: string;
  expiresAt: number; // Unix timestamp
  isImpersonating: boolean;
  impersonatingEmail?: string;
}

export interface ImpersonationLog {
  id: string;
  admin_user_id: string;
  admin_username: string;
  target_email: string;
  target_type: 'student' | 'admin';
  started_at: string;
  ended_at: string | null;
  ip_address: string | null;
  actions_log: Record<string, unknown>[];
}

// =====================================================
// Role Hierarchy & Menu Configuration
// =====================================================

export interface AdminMenuItem {
  label: string;
  icon: string; // Lucide icon name
  path: string;
  permission: keyof AdminPermissions | null; // null = always visible
  children?: AdminMenuItem[];
}

// Role display info
export interface RoleInfo {
  role: AdminRole;
  label: string;
  description: string;
  level: number; // Higher = more access
}

// =====================================================
// Email Template Types
// =====================================================

export interface EmailTemplate {
  id: string;
  template_code: string;
  template_name: string;
  subject: string;
  body_html: string;
  body_text: string | null;
  trigger_event: string | null;
  available_variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailSendLog {
  id: string;
  template_id: string | null;
  template_code: string | null;
  recipient_email: string;
  recipient_name: string | null;
  subject: string | null;
  body_preview: string | null;
  template_variables: Record<string, string>;
  status: EmailStatus;
  provider: string | null;
  provider_message_id: string | null;
  error_message: string | null;
  queued_at: string;
  sent_at: string | null;
  delivered_at: string | null;
  failed_at: string | null;
  triggered_by: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
}

export type EmailStatus = 'queued' | 'sending' | 'sent' | 'failed' | 'bounced';
