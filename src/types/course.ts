// =====================================================
// Course & Pricing Types
// =====================================================

export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  course_category: string | null;
  target_audience: string | null;
  duration_months: number;
  description: string | null;
  syllabus_url: string | null;
  prerequisites: string | null;

  // Pricing (INR base)
  monthly_price: number;
  full_course_price: number;
  upfront_discount_percent: number;
  upfront_final_price: number | null;

  // Continued Learning
  continued_learning_enabled: boolean;
  continued_learning_monthly_price: number;

  // Navigation
  navigation_category: NavigationCategory | null;
  topics: string[] | null;
  curriculum: CurriculumItem[] | null;

  // Status
  is_active: boolean;
  is_visible: boolean;
  display_order: number;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type NavigationCategory = 'techies' | 'non_techies' | 'students' | 'job_seekers';

export interface CurriculumItem {
  week: number;
  title: string;
  topics: string[];
  description?: string;
}

export interface PricingRule {
  id: string;
  course_id: string;
  currency_code: CurrencyCode;
  monthly_price: number;
  full_course_price: number;
  upfront_discount_percent: number;
  upfront_final_price: number | null;
  continued_learning_price: number | null;
  exchange_rate_from_inr: number | null;
  last_rate_update: string | null;
  is_auto_converted: boolean;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'SGD' | 'AED';

export interface NavNode {
  label: string;
  category?: NavigationCategory;
  courses?: NavCourseLink[];
  children?: NavNode[];
  href?: string;
  isCrossLink?: boolean;
}

export interface NavCourseLink {
  course_code: string;
  course_name: string;
  href: string;
}

// Navigation tree structure for the Courses dropdown
export interface CourseNavTree {
  techies: Course[];
  non_techies: Course[];
  students: Course[];
  job_seekers: Course[];
}
