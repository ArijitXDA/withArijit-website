import React, { useState, useEffect, useCallback } from 'react'
import { X, CreditCard, User, Mail, Phone, Loader2, AlertCircle, Shield } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useCourses } from '../../hooks/useCourses'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useUTM } from '../../hooks/useUTM'
import { formatCurrency } from '../../lib/currency'
import { PAYMENT_CONFIG } from '../../lib/constants'
import DiscountInput from './DiscountInput'
import PricingSummary from './PricingSummary'
import type { Course, CurrencyCode } from '../../types/course'
import type { CouponValidationResult } from '../../types/payment'

// =====================================================
// Razorpay Type Declarations
// =====================================================

interface RazorpaySuccessResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature?: string
}

interface RazorpayFailureResponse {
  error: {
    code: string
    description: string
    source: string
    step: string
    reason: string
    metadata: Record<string, unknown>
  }
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (response: RazorpayFailureResponse) => void) => void
    }
  }
}

// =====================================================
// Props
// =====================================================

interface PaymentModalV2Props {
  isOpen: boolean
  onClose: () => void
  courseId?: string
  courseCode?: string
  onPaymentSuccess?: (paymentId: string) => void
}

/**
 * PaymentModalV2 - DB-driven payment modal.
 * Receives courseId or courseCode, fetches from courses_v2,
 * integrates discount validation and Razorpay payment.
 * Writes to payments_v2 (NOT legacy payments table).
 */
export default function PaymentModalV2({
  isOpen,
  onClose,
  courseId,
  courseCode,
  onPaymentSuccess,
}: PaymentModalV2Props) {
  const { user } = useAuth()
  const { courses, getCourseByCode } = useCourses()
  const { currency, country, countryCode } = useGeolocation()
  const { utmParams } = useUTM()

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [paymentType, setPaymentType] = useState<'upfront' | 'monthly'>('monthly')
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null)

  // UI state
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')

  // Prefill from user context
  useEffect(() => {
    if (user) {
      setName(user.name || user.user_metadata?.full_name || '')
      setEmail(user.email || '')
      setMobile(user.mobile_no || user.user_metadata?.phone || '')
    }
  }, [user])

  // Set initial course from props
  useEffect(() => {
    if (courseId) {
      setSelectedCourseId(courseId)
    } else if (courseCode) {
      const c = getCourseByCode(courseCode)
      if (c) setSelectedCourseId(c.id)
    }
  }, [courseId, courseCode, getCourseByCode])

  // Get selected course details
  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  // Calculate amounts
  const monthlyPrice = selectedCourse?.monthly_price || 0
  const fullCoursePrice = selectedCourse?.full_course_price || 0
  const upfrontDiscountPercent = selectedCourse?.upfront_discount_percent || PAYMENT_CONFIG.UPFRONT_DISCOUNT_PERCENT
  const upfrontPrice = selectedCourse?.upfront_final_price ||
    Math.round(fullCoursePrice * (1 - upfrontDiscountPercent / 100))
  const durationMonths = selectedCourse?.duration_months || PAYMENT_CONFIG.DEFAULT_COURSE_DURATION_MONTHS

  // Base amount for current payment type
  const baseAmount = paymentType === 'upfront' ? upfrontPrice : monthlyPrice

  // Apply coupon discount
  const couponDiscount = couponResult?.isValid ? (couponResult.discountAmount || 0) : 0
  const finalAmount = Math.max(baseAmount - couponDiscount, 0)

  const handleCouponValidation = useCallback((result: CouponValidationResult | null) => {
    setCouponResult(result)
  }, [])

  // =====================================================
  // Razorpay Payment Flow
  // =====================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedCourse) {
      setError('Please select a course')
      return
    }
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    setIsProcessing(true)
    setStep('processing')

    try {
      await initiateRazorpayPayment()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed'
      setError(msg)
      setStep('form')
      setIsProcessing(false)
    }
  }

  const initiateRazorpayPayment = async () => {
    // Check secure context
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      throw new Error('Razorpay requires HTTPS or localhost')
    }

    // Load Razorpay SDK if needed
    if (typeof window.Razorpay === 'undefined') {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.crossOrigin = 'anonymous'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
        document.head.appendChild(script)
      })
      await new Promise((r) => setTimeout(r, 1000))
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Failed to load Razorpay SDK')
      }
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!razorpayKey) {
      throw new Error('Razorpay Key is not configured')
    }

    // Determine user ID
    const paymentUserId = user?.id || `guest_${crypto.randomUUID()}`

    // Create payment record in payments_v2
    const paymentRecord = {
      student_email: email.toLowerCase().trim(),
      enrollment_id: null,
      course_id: selectedCourse!.id,
      payment_type: paymentType,
      installment_number: paymentType === 'monthly' ? 1 : null,
      original_amount: baseAmount,
      discount_amount: couponDiscount,
      final_amount: finalAmount,
      currency: 'INR',
      coupon_id: couponResult?.coupon?.id || null,
      coupon_code: couponResult?.coupon?.coupon_code || null,
      payment_status: 'pending',
      payment_method: null,
      failure_reason: null,
    }

    const { data: paymentData, error: dbError } = await supabase
      .from('payments_v2')
      .insert([paymentRecord])
      .select()
      .single()

    if (dbError) {
      throw new Error(`Failed to create payment record: ${dbError.message}`)
    }

    // Create Razorpay order via edge function
    const { data: orderResponse, error: orderError } = await supabase.functions.invoke(
      'create-razorpay-order',
      {
        body: {
          amount: finalAmount,
          currency: 'INR',
          receipt: `v2_receipt_${paymentData.id}`,
          notes: {
            course: selectedCourse!.course_name,
            course_id: selectedCourse!.id,
            email: email,
            mobile: mobile,
            reference_id: paymentData.id,
            payment_version: 'v2',
            utm_source: utmParams.utm_source || null,
            utm_medium: utmParams.utm_medium || null,
            utm_campaign: utmParams.utm_campaign || null,
          },
        },
      }
    )

    if (orderError || !orderResponse?.success) {
      throw new Error(orderError?.message || orderResponse?.error || 'Failed to create order')
    }

    // Calculate amount in paise
    const razorpayAmount = Math.round(finalAmount * 100)

    // Razorpay options
    const options = {
      key: razorpayKey,
      order_id: orderResponse.order.id,
      amount: razorpayAmount,
      currency: 'INR',
      name: 'WithArijit',
      description: `${selectedCourse!.course_name} - ${paymentType === 'upfront' ? 'Full Payment' : 'Monthly'}`,
      image: `${window.location.origin}/82597b4e-e193-45e5-a266-e303e029de30-removebg-preview.png`,
      prefill: {
        name: name,
        email: email,
        contact: mobile,
      },
      notes: {
        course: selectedCourse!.course_name,
        course_id: selectedCourse!.id,
        email: email,
        reference_id: paymentData.id,
        payment_version: 'v2',
      },
      theme: { color: '#2563eb' },
      handler: async (response: RazorpaySuccessResponse) => {
        await handlePaymentSuccess(response, paymentData.id)
      },
      modal: {
        ondismiss: async () => {
          await handlePaymentCancel(paymentData.id)
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response: RazorpayFailureResponse) => {
      handlePaymentFailure(response, paymentData.id)
    })
    rzp.open()
  }

  // =====================================================
  // Payment Result Handlers
  // =====================================================

  const handlePaymentSuccess = async (response: RazorpaySuccessResponse, paymentId: string) => {
    try {
      // Update payment record
      await supabase
        .from('payments_v2')
        .update({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature || null,
          payment_status: 'completed',
          payment_date: new Date().toISOString(),
        })
        .eq('id', paymentId)

      // Log coupon usage if applied
      if (couponResult?.coupon) {
        await supabase.from('coupon_usage_log').insert({
          coupon_id: couponResult.coupon.id,
          student_email: email.toLowerCase().trim(),
          payment_id: paymentId,
          discount_amount: couponDiscount,
          original_amount: baseAmount,
          final_amount: finalAmount,
        })

        // Increment usage count
        await supabase.rpc('increment_coupon_usage', { coupon_id: couponResult.coupon.id })
      }

      setStep('success')
      setIsProcessing(false)
      onPaymentSuccess?.(paymentId)
    } catch (err) {
      // Payment was successful on Razorpay side, just failed to update locally
      setStep('success')
      setIsProcessing(false)
    }
  }

  const handlePaymentFailure = async (response: RazorpayFailureResponse, paymentId: string) => {
    await supabase
      .from('payments_v2')
      .update({
        payment_status: 'failed',
        failure_reason: response.error?.description || 'Payment failed',
      })
      .eq('id', paymentId)

    setError(`Payment failed: ${response.error?.description || 'Unknown error'}`)
    setStep('form')
    setIsProcessing(false)
  }

  const handlePaymentCancel = async (paymentId: string) => {
    await supabase
      .from('payments_v2')
      .update({
        payment_status: 'failed',
        failure_reason: 'Cancelled by user',
      })
      .eq('id', paymentId)

    setStep('form')
    setIsProcessing(false)
  }

  // =====================================================
  // Render
  // =====================================================

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Enroll Now
          </h2>
          <p className="text-blue-200 text-sm mt-1">Secure payment powered by Razorpay</p>
        </div>

        {/* Success State */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your enrollment for <strong>{selectedCourse?.course_name}</strong> is confirmed.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Check your email at <strong>{email}</strong> for details.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <div className="p-8 text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Processing Payment...</h3>
            <p className="text-sm text-gray-500 mt-2">Please complete the payment in the Razorpay window.</p>
          </div>
        )}

        {/* Form State */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white"
                required
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_name} - {formatCurrency(c.monthly_price, 'INR')}/mo
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4" />
                Mobile (optional)
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Payment Type */}
            {selectedCourse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Option</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType('monthly')}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      paymentType === 'monthly'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900">Monthly</div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(monthlyPrice, 'INR')}
                      <span className="text-sm font-normal text-gray-500">/mo</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {durationMonths} payments
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('upfront')}
                    className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                      paymentType === 'upfront'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {upfrontDiscountPercent > 0 && (
                      <span className="absolute -top-2.5 right-2 px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full">
                        SAVE {upfrontDiscountPercent}%
                      </span>
                    )}
                    <div className="text-sm font-semibold text-gray-900">Upfront</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(upfrontPrice, 'INR')}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      One-time payment
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Discount Input */}
            {selectedCourse && (
              <DiscountInput
                courseId={selectedCourse.id}
                studentEmail={email}
                paymentType={paymentType}
                originalAmount={baseAmount}
                country={country || undefined}
                onValidation={handleCouponValidation}
              />
            )}

            {/* Price Summary */}
            {selectedCourse && (
              <PricingSummary
                paymentType={paymentType}
                monthlyPrice={monthlyPrice}
                fullCoursePrice={fullCoursePrice}
                upfrontPrice={upfrontPrice}
                upfrontDiscountPercent={upfrontDiscountPercent}
                durationMonths={durationMonths}
                couponResult={couponResult}
              />
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isProcessing || !selectedCourse}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay {finalAmount > 0 ? formatCurrency(finalAmount, 'INR') : 'Now'}
                </>
              )}
            </button>

            {/* Trust footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
              <Shield className="w-3.5 h-3.5" />
              <span>256-bit SSL encrypted. Powered by Razorpay.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
