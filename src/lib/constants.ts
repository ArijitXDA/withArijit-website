// =====================================================
// Application Constants
// =====================================================

import type { AdminRole, RoleInfo, AdminMenuItem } from '../types/admin';
import type { CurrencyCode } from '../types/course';

// =====================================================
// Currency Configuration
// =====================================================

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '\u20B9',
  USD: '$',
  EUR: '\u20AC',
  GBP: '\u00A3',
  SGD: 'S$',
  AED: 'AED',
};

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  SGD: 'Singapore Dollar',
  AED: 'UAE Dirham',
};

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP', 'SGD', 'AED'];

// Country to currency mapping (common countries)
export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  IE: 'EUR',
  PT: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  SG: 'SGD',
  AE: 'AED',
  SA: 'AED',
  QA: 'AED',
  BH: 'AED',
  KW: 'AED',
  OM: 'AED',
};

// =====================================================
// Admin Role Definitions
// =====================================================

export const ADMIN_ROLES: RoleInfo[] = [
  {
    role: 'dev_admin',
    label: 'Developer Admin',
    description: 'Full access + create admins + impersonate + assign roles',
    level: 100,
  },
  {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Full access except creating dev_admins',
    level: 90,
  },
  {
    role: 'course_admin',
    label: 'Course Admin',
    description: 'Courses, batches, materials, enrollments',
    level: 50,
  },
  {
    role: 'payment_admin',
    label: 'Payment Admin',
    description: 'Payments, discounts, group bookings',
    level: 50,
  },
  {
    role: 'hr_admin',
    label: 'HR Admin',
    description: 'Students, enrollments, certificates, reports',
    level: 50,
  },
  {
    role: 'campaign_admin',
    label: 'Campaign Admin',
    description: 'Discount coupons, email templates',
    level: 40,
  },
  {
    role: 'qr_admin',
    label: 'QR Admin',
    description: 'QR campaigns, registrations',
    level: 30,
  },
  {
    role: 'aispot_admin',
    label: 'AI Spot Admin',
    description: 'AI Spot management & analytics',
    level: 30,
  },
  {
    role: 'report_viewer',
    label: 'Report Viewer',
    description: 'Read-only access to all reports',
    level: 10,
  },
];

// =====================================================
// Admin Sidebar Menu Configuration
// =====================================================

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/admin',
    permission: null, // Always visible to all admins
  },
  {
    label: 'Courses',
    icon: 'GraduationCap',
    path: '/admin/courses',
    permission: 'courses',
  },
  {
    label: 'Batches',
    icon: 'Users',
    path: '/admin/batches',
    permission: 'batches',
  },
  {
    label: 'Enrollments',
    icon: 'ClipboardList',
    path: '/admin/enrollments',
    permission: 'enrollments',
  },
  {
    label: 'Payments',
    icon: 'CreditCard',
    path: '/admin/payments',
    permission: 'payments',
  },
  {
    label: 'Discounts',
    icon: 'Tag',
    path: '/admin/discounts',
    permission: 'discounts',
  },
  {
    label: 'Group Bookings',
    icon: 'Building2',
    path: '/admin/group-bookings',
    permission: 'group_bookings',
  },
  {
    label: 'Study Materials',
    icon: 'BookOpen',
    path: '/admin/study-materials',
    permission: 'study_materials',
  },
  {
    label: 'AI Chat Limits',
    icon: 'MessageSquare',
    path: '/admin/ai-chat-limits',
    permission: 'ai_chat',
  },
  {
    label: 'Email Templates',
    icon: 'Mail',
    path: '/admin/email-templates',
    permission: 'email_templates',
  },
  {
    label: 'Reports',
    icon: 'BarChart3',
    path: '/admin/reports',
    permission: 'reports',
  },
  {
    label: 'Sessions',
    icon: 'Video',
    path: '/admin/sessions',
    permission: 'session_links',
  },
  {
    label: 'Students',
    icon: 'UserCheck',
    path: '/admin/students',
    permission: 'students',
  },
  {
    label: 'Certificates',
    icon: 'Award',
    path: '/admin/certificates',
    permission: 'certificates',
  },
  {
    label: 'QR Campaigns',
    icon: 'QrCode',
    path: '/admin/qr-campaigns',
    permission: 'qr_campaigns',
  },
  {
    label: 'AI Spot',
    icon: 'Sparkles',
    path: '/admin/ai-spot',
    permission: 'ai_spot',
  },
  {
    label: 'User Management',
    icon: 'Shield',
    path: '/admin/user-management',
    permission: 'user_management',
  },
];

// =====================================================
// Default Batch #101 Configuration
// =====================================================

export const FREE_INTRO_BATCH_CODE = 'BATCH101';

// =====================================================
// Navigation Categories
// =====================================================

export const NAVIGATION_CATEGORIES = {
  techies: {
    label: 'Techies',
    description: 'AI Development for Tech Professionals',
    order: 1,
  },
  non_techies: {
    label: 'Non-Techies',
    description: 'AI Certification for Non-Tech Professionals',
    order: 2,
  },
  students: {
    label: 'Students',
    description: 'AI Training for Students',
    order: 3,
  },
  job_seekers: {
    label: 'Job Seekers',
    description: 'AI for Career Transitions',
    order: 4,
  },
} as const;

// =====================================================
// Payment Configuration
// =====================================================

export const PAYMENT_CONFIG = {
  UPFRONT_DISCOUNT_PERCENT: 7,
  CONTINUED_LEARNING_MONTHLY_PRICE_INR: 2999,
  DEFAULT_COURSE_DURATION_MONTHS: 6,
  DEFAULT_MONTHLY_PRICE_INR: 7999,
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
} as const;

// =====================================================
// AI Chat Configuration
// =====================================================

export const AI_CHAT_CONFIG = {
  AGENT_NAME: 'oStaran',
  AGENT_SUBTITLE: 'The AI Assistant',
  DEFAULT_MODEL_FREE: 'gpt-4o-mini',
  DEFAULT_MODEL_PAID: 'gpt-4o',
  MAX_MESSAGE_LENGTH: 2000,
} as const;
