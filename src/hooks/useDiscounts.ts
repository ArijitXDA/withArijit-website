// =====================================================
// useDiscounts - Validate/apply coupon codes from DB
// =====================================================

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { DiscountCoupon, CouponValidationResult, InstallmentType } from '../types/payment';

interface UseDiscountsResult {
  validating: boolean;
  validationResult: CouponValidationResult | null;
  validateCoupon: (params: ValidateCouponParams) => Promise<CouponValidationResult>;
  clearValidation: () => void;
}

interface ValidateCouponParams {
  code: string;
  courseId: string;
  studentEmail: string;
  paymentType: 'upfront' | 'monthly';
  installmentType?: InstallmentType;
  utmSource?: string;
  utmCode?: string;
  country?: string;
  city?: string;
  originalAmount: number;
}

export function useDiscounts(): UseDiscountsResult {
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<CouponValidationResult | null>(null);

  const validateCoupon = useCallback(
    async (params: ValidateCouponParams): Promise<CouponValidationResult> => {
      setValidating(true);

      try {
        // 1. Fetch the coupon by code
        const { data: coupon, error: couponError } = await supabase
          .from('discount_coupons')
          .select('*')
          .eq('coupon_code', params.code.toUpperCase().trim())
          .eq('is_active', true)
          .single();

        if (couponError || !coupon) {
          const result: CouponValidationResult = {
            isValid: false,
            errorMessage: 'Invalid coupon code',
          };
          setValidationResult(result);
          return result;
        }

        const typedCoupon = coupon as DiscountCoupon;

        // 2. Check validity dates
        const now = new Date();
        if (typedCoupon.valid_from && new Date(typedCoupon.valid_from) > now) {
          const result: CouponValidationResult = {
            isValid: false,
            errorMessage: 'This coupon is not yet active',
          };
          setValidationResult(result);
          return result;
        }
        if (typedCoupon.valid_until && new Date(typedCoupon.valid_until) < now) {
          const result: CouponValidationResult = {
            isValid: false,
            errorMessage: 'This coupon has expired',
          };
          setValidationResult(result);
          return result;
        }

        // 3. Check pause/stop dates
        if (typedCoupon.pause_date && new Date(typedCoupon.pause_date) <= now) {
          const result: CouponValidationResult = {
            isValid: false,
            errorMessage: 'This coupon is currently paused',
          };
          setValidationResult(result);
          return result;
        }
        if (typedCoupon.stop_date && new Date(typedCoupon.stop_date) <= now) {
          const result: CouponValidationResult = {
            isValid: false,
            errorMessage: 'This coupon has been discontinued',
          };
          setValidationResult(result);
          return result;
        }

        // 4. Check total usage limit
        if (
          typedCoupon.max_total_uses &&
          typedCoupon.current_use_count >= typedCoupon.max_total_uses
        ) {
          const result: CouponValidationResult = {
            isValid: false,
            errorMessage: 'This coupon has reached its usage limit',
          };
          setValidationResult(result);
          return result;
        }

        // 5. Check per-student usage limit
        if (typedCoupon.max_uses_per_student) {
          const { count } = await supabase
            .from('coupon_usage_log')
            .select('*', { count: 'exact', head: true })
            .eq('coupon_id', typedCoupon.id)
            .eq('student_email', params.studentEmail);

          if (count && count >= typedCoupon.max_uses_per_student) {
            const result: CouponValidationResult = {
              isValid: false,
              errorMessage: 'You have already used this coupon',
            };
            setValidationResult(result);
            return result;
          }
        }

        // 6. Check course applicability
        if (
          typedCoupon.applicable_to_courses &&
          typedCoupon.applicable_to_courses.length > 0 &&
          !typedCoupon.applicable_to_courses.includes(params.courseId)
        ) {
          const result: CouponValidationResult = {
            isValid: false,
            errorMessage: 'This coupon is not valid for this course',
          };
          setValidationResult(result);
          return result;
        }

        // 7. Check payment type
        if (
          typedCoupon.applicable_to_payment_type &&
          typedCoupon.applicable_to_payment_type !== 'both' &&
          typedCoupon.applicable_to_payment_type !== params.paymentType
        ) {
          const result: CouponValidationResult = {
            isValid: false,
            errorMessage: `This coupon is only valid for ${typedCoupon.applicable_to_payment_type} payments`,
          };
          setValidationResult(result);
          return result;
        }

        // 8. Check installment type
        if (
          typedCoupon.applicable_to_installment &&
          params.installmentType &&
          typedCoupon.applicable_to_installment !== params.installmentType
        ) {
          const result: CouponValidationResult = {
            isValid: false,
            errorMessage: 'This coupon is not valid for this installment type',
          };
          setValidationResult(result);
          return result;
        }

        // 9. Check UTM source
        if (typedCoupon.applicable_to_utm_source && params.utmSource) {
          if (typedCoupon.applicable_to_utm_source !== params.utmSource) {
            const result: CouponValidationResult = {
              isValid: false,
              errorMessage: 'This coupon is not valid for your referral source',
            };
            setValidationResult(result);
            return result;
          }
        }

        // 10. Check country
        if (typedCoupon.applicable_to_country && params.country) {
          if (
            typedCoupon.applicable_to_country.toLowerCase() !== params.country.toLowerCase()
          ) {
            const result: CouponValidationResult = {
              isValid: false,
              errorMessage: 'This coupon is not available in your country',
            };
            setValidationResult(result);
            return result;
          }
        }

        // 11. Check minimum purchase amount
        if (
          typedCoupon.min_purchase_amount &&
          params.originalAmount < typedCoupon.min_purchase_amount
        ) {
          const result: CouponValidationResult = {
            isValid: false,
            errorMessage: `Minimum purchase amount is ₹${typedCoupon.min_purchase_amount.toLocaleString()}`,
          };
          setValidationResult(result);
          return result;
        }

        // 12. Calculate discount
        let discountAmount = 0;

        switch (typedCoupon.discount_type) {
          case 'percentage':
            discountAmount = (params.originalAmount * typedCoupon.discount_value) / 100;
            break;
          case 'fixed_amount':
            discountAmount = typedCoupon.discount_value;
            break;
          case 'first_month_free':
            discountAmount = typedCoupon.discount_value; // Usually equals monthly price
            break;
        }

        // Apply max discount cap
        if (typedCoupon.max_discount_amount && discountAmount > typedCoupon.max_discount_amount) {
          discountAmount = typedCoupon.max_discount_amount;
        }

        // Ensure discount doesn't exceed original amount
        discountAmount = Math.min(discountAmount, params.originalAmount);
        discountAmount = Math.round(discountAmount * 100) / 100;

        const finalAmount = Math.round((params.originalAmount - discountAmount) * 100) / 100;

        const result: CouponValidationResult = {
          isValid: true,
          discountAmount,
          finalAmount,
          coupon: typedCoupon,
        };
        setValidationResult(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to validate coupon';
        const result: CouponValidationResult = {
          isValid: false,
          errorMessage: message,
        };
        setValidationResult(result);
        return result;
      } finally {
        setValidating(false);
      }
    },
    []
  );

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    validating,
    validationResult,
    validateCoupon,
    clearValidation,
  };
}
