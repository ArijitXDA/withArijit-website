// =====================================================
// Payment, Discount & Group Booking Types
// =====================================================

export interface PaymentV2 {
  id: string;
  student_email: string;
  enrollment_id: string | null;
  course_id: string | null;

  // Payment Details
  payment_type: PaymentType;
  installment_number: number | null;

  // Amounts
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  currency: string;

  // Discount/Coupon
  coupon_id: string | null;
  coupon_code: string | null;

  // Razorpay
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;

  // Status
  payment_status: PaymentStatus;
  payment_method: string | null;
  failure_reason: string | null;

  // Timestamps
  payment_date: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentType = 'upfront' | 'monthly' | 'continued_learning';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

// =====================================================
// Discount / Coupon Types
// =====================================================

export interface DiscountCoupon {
  id: string;
  coupon_code: string;
  coupon_name: string;
  description: string | null;

  // Discount Type
  discount_type: DiscountType;
  discount_value: number;

  // Applicability
  applicable_to_courses: string[] | null;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;

  // Usage Limits
  max_total_uses: number | null;
  max_uses_per_student: number;
  current_use_count: number;

  // Validity
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;

  // Restrictions
  applicable_to_new_students_only: boolean;
  applicable_to_payment_type: string | null;

  // V3 additions
  applicable_to_utm_source: string | null;
  applicable_to_utm_code: string | null;
  applicable_to_country: string | null;
  applicable_to_city: string | null;
  applicable_to_installment: InstallmentType | null;
  pause_date: string | null;
  stop_date: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type DiscountType = 'percentage' | 'fixed_amount' | 'first_month_free';
export type InstallmentType = 'full_payment' | '1st_installment' | '2nd_onwards' | 'continued_learning';

export interface CouponValidationResult {
  isValid: boolean;
  errorMessage?: string;
  discountAmount?: number;
  finalAmount?: number;
  coupon?: DiscountCoupon;
}

export interface CouponUsageLog {
  id: string;
  coupon_id: string;
  student_email: string;
  payment_id: string | null;
  discount_amount: number;
  original_amount: number;
  final_amount: number;
  used_at: string;
}

// =====================================================
// Group Booking Types
// =====================================================

export interface GroupBooking {
  id: string;
  entity_name: string;
  entity_email: string;
  entity_phone: string | null;
  entity_organization: string | null;

  // Course
  course_id: string | null;
  batch_id: string | null;

  // Seats
  total_seats: number;
  filled_seats: number;

  // Payment
  price_per_seat: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  coupon_id: string | null;
  currency: string;

  // Razorpay
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  payment_status: PaymentStatus;
  payment_date: string | null;

  // Invite
  invite_token: string;
  invite_expiry: string;

  // Status
  booking_status: GroupBookingStatus;

  // UTM
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

export type GroupBookingStatus = 'pending' | 'paid' | 'partially_filled' | 'completed' | 'cancelled';

export interface GroupBookingMember {
  id: string;
  group_booking_id: string;
  member_email: string;
  member_name: string | null;
  member_phone: string | null;

  // Invite
  invite_sent: boolean;
  invite_sent_at: string | null;
  invite_accepted: boolean;
  invite_accepted_at: string | null;

  // Signup
  has_signed_up: boolean;
  signed_up_at: string | null;
  auth_user_id: string | null;
  enrollment_id: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

// =====================================================
// Price Calculation Types
// =====================================================

export interface PriceBreakdown {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  currencySymbol: string;
  paymentType: PaymentType;
  installmentNumber?: number;
  couponApplied?: string;
  upfrontDiscountApplied?: boolean;
}
