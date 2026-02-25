import React, { useState, useEffect } from 'react'
import { Tag, Loader2, CheckCircle, XCircle, X } from 'lucide-react'
import { useDiscounts } from '../../hooks/useDiscounts'
import { useUTM } from '../../hooks/useUTM'
import type { CouponValidationResult, InstallmentType } from '../../types/payment'

interface DiscountInputProps {
  courseId: string
  studentEmail: string
  paymentType: 'upfront' | 'monthly'
  installmentType?: InstallmentType
  originalAmount: number
  country?: string
  onValidation: (result: CouponValidationResult | null) => void
}

/**
 * Coupon code input with "Apply" button.
 * Auto-fills coupon_code from UTM params if present.
 */
export default function DiscountInput({
  courseId,
  studentEmail,
  paymentType,
  installmentType,
  originalAmount,
  country,
  onValidation,
}: DiscountInputProps) {
  const [code, setCode] = useState('')
  const { validating, validationResult, validateCoupon, clearValidation } = useDiscounts()
  const { utmParams, couponCode: utmCoupon } = useUTM()

  // Auto-fill coupon code from UTM
  useEffect(() => {
    if (utmCoupon && !code) {
      setCode(utmCoupon)
    }
  }, [utmCoupon])

  // Pass validation result up
  useEffect(() => {
    onValidation(validationResult)
  }, [validationResult, onValidation])

  const handleApply = async () => {
    if (!code.trim()) return

    await validateCoupon({
      code: code.trim(),
      courseId,
      studentEmail,
      paymentType,
      installmentType,
      utmSource: utmParams.utm_source || undefined,
      utmCode: utmParams.utm_campaign || undefined,
      country,
      originalAmount,
    })
  }

  const handleClear = () => {
    setCode('')
    clearValidation()
    onValidation(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply()
    }
  }

  const isApplied = validationResult?.isValid === true

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <Tag className="w-4 h-4" />
        Coupon Code
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              if (validationResult) clearValidation()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter coupon code"
            disabled={isApplied}
            className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono uppercase tracking-wider transition-colors ${
              isApplied
                ? 'border-green-300 bg-green-50 text-green-800'
                : validationResult?.isValid === false
                ? 'border-red-300 bg-red-50 text-red-800'
                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
            }`}
          />
          {isApplied && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-green-600 hover:text-red-500 transition-colors"
              title="Remove coupon"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!isApplied && (
          <button
            onClick={handleApply}
            disabled={!code.trim() || validating}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 min-w-[80px] justify-center"
          >
            {validating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Apply'
            )}
          </button>
        )}
      </div>

      {/* Validation Feedback */}
      {validationResult && (
        <div
          className={`flex items-start gap-2 text-sm px-3 py-2 rounded-lg ${
            validationResult.isValid
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {validationResult.isValid ? (
            <>
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Coupon applied!</span>
                {validationResult.discountAmount && (
                  <span className="ml-1">
                    You save ₹{validationResult.discountAmount.toLocaleString()}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{validationResult.errorMessage}</span>
            </>
          )}
        </div>
      )}

      {/* UTM Coupon Hint */}
      {utmCoupon && !validationResult && code === utmCoupon && (
        <p className="text-xs text-blue-500">
          Coupon auto-filled from your referral link. Click "Apply" to activate.
        </p>
      )}
    </div>
  )
}
