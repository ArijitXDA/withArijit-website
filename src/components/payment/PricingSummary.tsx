import React from 'react'
import { IndianRupee, Zap, Tag, ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../lib/currency'
import type { CouponValidationResult } from '../../types/payment'

interface PricingSummaryProps {
  paymentType: 'upfront' | 'monthly'
  monthlyPrice: number
  fullCoursePrice: number
  upfrontPrice: number
  upfrontDiscountPercent: number
  durationMonths: number
  couponResult: CouponValidationResult | null
  currency?: string
}

/**
 * Price breakdown component showing original price, discounts, and final amount.
 */
export default function PricingSummary({
  paymentType,
  monthlyPrice,
  fullCoursePrice,
  upfrontPrice,
  upfrontDiscountPercent,
  durationMonths,
  couponResult,
  currency = 'INR',
}: PricingSummaryProps) {
  // Calculate amounts based on payment type
  const isUpfront = paymentType === 'upfront'
  const baseAmount = isUpfront ? fullCoursePrice : monthlyPrice

  // For upfront, the original amount before discount
  const upfrontSavings = isUpfront ? fullCoursePrice - upfrontPrice : 0
  const amountAfterUpfrontDiscount = isUpfront ? upfrontPrice : monthlyPrice

  // Coupon discount applied after upfront discount
  const couponDiscount = couponResult?.isValid ? (couponResult.discountAmount || 0) : 0
  const finalAmount = amountAfterUpfrontDiscount - couponDiscount

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Price Breakdown
      </h4>

      <div className="space-y-2">
        {/* Base Price */}
        {isUpfront ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Monthly × {durationMonths} months
              </span>
              <span className="text-gray-900">
                {formatCurrency(monthlyPrice, 'INR')} × {durationMonths} = {formatCurrency(fullCoursePrice, 'INR')}
              </span>
            </div>

            {/* Upfront Discount */}
            {upfrontDiscountPercent > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  Upfront discount ({upfrontDiscountPercent}%)
                </span>
                <span>−{formatCurrency(upfrontSavings, 'INR')}</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Monthly payment</span>
            <span className="text-gray-900">{formatCurrency(monthlyPrice, 'INR')}/mo</span>
          </div>
        )}

        {/* Coupon Discount */}
        {couponResult?.isValid && couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Coupon ({couponResult.coupon?.coupon_code})
            </span>
            <span>−{formatCurrency(couponDiscount, 'INR')}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-2" />

        {/* Final Amount */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">
            {isUpfront ? 'Total Due Now' : 'Due Today'}
          </span>
          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(Math.max(finalAmount, 0), 'INR')}
          </span>
        </div>

        {/* Monthly note for upfront */}
        {isUpfront && (
          <p className="text-xs text-gray-400">
            One-time payment for the full course
          </p>
        )}

        {/* Monthly installment note */}
        {!isUpfront && (
          <p className="text-xs text-gray-400">
            {durationMonths} monthly payments of {formatCurrency(monthlyPrice, 'INR')} each.
            Total: {formatCurrency(fullCoursePrice, 'INR')}
          </p>
        )}

        {/* Total savings summary */}
        {(upfrontSavings > 0 || couponDiscount > 0) && (
          <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 mt-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-green-700">
              <Zap className="w-4 h-4" />
              Total savings: {formatCurrency(upfrontSavings + couponDiscount, 'INR')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
