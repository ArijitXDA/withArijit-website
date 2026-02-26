import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Building2,
  Mail,
  Phone,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Shield,
  ChevronRight,
  ArrowLeft,
  Hash,
  Calendar,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCourses } from '../hooks/useCourses'
import { useBatches } from '../hooks/useBatches'
import { formatCurrency } from '../lib/currency'
import { isValidEmail } from '../lib/validators'
import type { BatchV2 } from '../types/enrollment'

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

type Step = 'form' | 'review' | 'paying' | 'members' | 'success'

/**
 * Group Booking page - Enterprise/Team enrollment flow.
 * Flow: Entity Info → Review → Payment (Razorpay) → Member Collection → Success
 * Based on enrollment flowchart: payment comes FIRST, then member email collection.
 */
export default function GroupBooking() {
  const navigate = useNavigate()
  const { courses, loading: coursesLoading } = useCourses()

  // ─── Step 1: Entity + Course Info ──────────────────────────────────────────
  const [entityName, setEntityName] = useState('')
  const [entityEmail, setEntityEmail] = useState('')
  const [entityPhone, setEntityPhone] = useState('')
  const [entityOrg, setEntityOrg] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [seatCount, setSeatCount] = useState(2)
  const [paymentType, setPaymentType] = useState<'upfront' | 'monthly'>('monthly')

  // ─── Post-Payment State ─────────────────────────────────────────────────────
  const [bookingId, setBookingId] = useState<string | null>(null)

  // ─── Step 4: Member Collection ──────────────────────────────────────────────
  const [emailsText, setEmailsText] = useState('')
  const [sameBatch, setSameBatch] = useState<boolean | null>(null)
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [perPersonBatches, setPerPersonBatches] = useState<Record<string, string>>({})

  // ─── UI State ────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ─── Derived Values ──────────────────────────────────────────────────────────
  const selectedCourse = courses.find((c) => c.id === selectedCourseId)
  const pricePerSeat = selectedCourse?.monthly_price || 0
  const upfrontPricePerSeat = selectedCourse?.upfront_final_price || 0
  const durationMonths = selectedCourse?.duration_months || 1
  const upfrontDiscountPercent = selectedCourse?.upfront_discount_percent || 7

  const totalAmount =
    paymentType === 'upfront'
      ? upfrontPricePerSeat * seatCount
      : pricePerSeat * seatCount

  // Fetch batches for the selected course (for member batch assignment)
  const { getAvailableBatches } = useBatches(selectedCourseId || undefined)
  const availableBatches = selectedCourseId ? getAvailableBatches(selectedCourseId) : []

  // ─── Email Parsing ────────────────────────────────────────────────────────────
  const parseEmails = (text: string): string[] =>
    text
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0 && isValidEmail(e))

  const parsedEmails = parseEmails(emailsText)
  const emailCountMismatch = parsedEmails.length > 0 && parsedEmails.length !== seatCount

  // ─── Step 1 Validation ────────────────────────────────────────────────────────
  const validateForm = (): string | null => {
    if (!entityName.trim()) return 'Please enter your name'
    if (!entityEmail.trim() || !isValidEmail(entityEmail)) return 'Please enter a valid email'
    if (!selectedCourseId) return 'Please select a course'
    if (seatCount < 2) return 'Minimum 2 seats for group booking'
    if (seatCount > 50) return 'Maximum 50 seats per group booking'
    return null
  }

  const handleReview = () => {
    const err = validateForm()
    if (err) {
      setError(err)
      return
    }
    setError('')
    setStep('review')
  }

  // ─── Razorpay Payment ─────────────────────────────────────────────────────────
  const initiateRazorpayPayment = useCallback(async () => {
    // Load Razorpay SDK dynamically
    if (typeof window.Razorpay === 'undefined') {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.crossOrigin = 'anonymous'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load payment gateway'))
        document.head.appendChild(script)
      })
      await new Promise((r) => setTimeout(r, 1000))
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Payment gateway failed to load. Please refresh and try again.')
      }
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!razorpayKey) throw new Error('Payment gateway not configured')

    // Create a pending payment record in payments_v2
    const { data: paymentData, error: dbError } = await supabase
      .from('payments_v2')
      .insert({
        student_email: entityEmail.toLowerCase().trim(),
        course_id: selectedCourseId,
        payment_type: paymentType,
        installment_number: paymentType === 'monthly' ? 1 : null,
        original_amount: totalAmount,
        discount_amount: 0,
        final_amount: totalAmount,
        currency: 'INR',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (dbError || !paymentData) {
      throw new Error('Failed to initialise payment. Please try again.')
    }

    // Create Razorpay order via edge function
    const { data: orderResponse, error: orderError } = await supabase.functions.invoke(
      'create-razorpay-order',
      {
        body: {
          amount: totalAmount,
          currency: 'INR',
          receipt: `grp_${paymentData.id}`,
          notes: {
            entity_name: entityName.trim(),
            entity_email: entityEmail.trim(),
            course_id: selectedCourseId,
            seat_count: seatCount,
            reference_id: paymentData.id,
            payment_version: 'v2',
            booking_type: 'group',
          },
        },
      }
    )

    if (orderError || !orderResponse?.success) {
      await supabase
        .from('payments_v2')
        .update({ payment_status: 'failed', failure_reason: 'Order creation failed' })
        .eq('id', paymentData.id)
      throw new Error(orderError?.message || 'Failed to create payment order')
    }

    // Open Razorpay checkout
    const options: Record<string, unknown> = {
      key: razorpayKey,
      order_id: orderResponse.order.id,
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      name: 'WithArijit',
      description: `Group Enrollment – ${selectedCourse?.course_name} (${seatCount} seats)`,
      image: `${window.location.origin}/82597b4e-e193-45e5-a266-e303e029de30-removebg-preview.png`,
      prefill: {
        name: entityName.trim(),
        email: entityEmail.trim(),
        contact: entityPhone.trim(),
      },
      notes: {
        booking_type: 'group',
        seat_count: seatCount,
        reference_id: paymentData.id,
        payment_version: 'v2',
      },
      theme: { color: '#2563eb' },

      handler: async (response: RazorpaySuccessResponse) => {
        // Mark payment as completed
        await supabase
          .from('payments_v2')
          .update({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature || null,
            payment_status: 'completed',
            payment_date: new Date().toISOString(),
          })
          .eq('id', paymentData.id)

        // Create the group_bookings record
        const { data: booking } = await supabase
          .from('group_bookings')
          .insert({
            entity_name: entityName.trim(),
            entity_email: entityEmail.toLowerCase().trim(),
            entity_phone: entityPhone.trim() || null,
            entity_organization: entityOrg.trim() || null,
            course_id: selectedCourseId,
            total_seats: seatCount,
            filled_seats: 0,
            price_per_seat: pricePerSeat,
            total_amount: totalAmount,
            discount_amount: 0,
            final_amount: totalAmount,
            currency: 'INR',
            booking_status: 'confirmed',
            payment_status: 'paid',
            razorpay_payment_id: response.razorpay_payment_id,
          })
          .select()
          .single()

        setBookingId(booking?.id || null)
        setStep('members')
      },

      modal: {
        ondismiss: async () => {
          await supabase
            .from('payments_v2')
            .update({ payment_status: 'failed', failure_reason: 'Cancelled by user' })
            .eq('id', paymentData.id)
          setStep('review')
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', async (response: RazorpayFailureResponse) => {
      await supabase
        .from('payments_v2')
        .update({
          payment_status: 'failed',
          failure_reason: response.error?.description || 'Payment failed',
        })
        .eq('id', paymentData.id)
      setError(`Payment failed: ${response.error?.description || 'Please try again.'}`)
      setStep('review')
    })

    rzp.open()
  }, [entityName, entityEmail, entityPhone, entityOrg, selectedCourseId, seatCount, paymentType, totalAmount, pricePerSeat, selectedCourse])

  const handlePay = async () => {
    setError('')
    setStep('paying')
    try {
      await initiateRazorpayPayment()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setStep('review')
    }
  }

  // ─── Step 4: Send Invites ─────────────────────────────────────────────────────
  const handleSendInvites = async () => {
    if (!bookingId) {
      setError('Booking reference not found. Please contact support.')
      return
    }

    if (parsedEmails.length === 0) {
      setError('Please enter at least one valid email address.')
      return
    }

    if (parsedEmails.length !== seatCount) {
      setError(
        `You purchased ${seatCount} seat${seatCount !== 1 ? 's' : ''} but entered ${parsedEmails.length} email${parsedEmails.length !== 1 ? 's' : ''}. Please fix the count.`
      )
      return
    }

    const uniqueEmails = new Set(parsedEmails)
    if (uniqueEmails.size !== parsedEmails.length) {
      setError('Duplicate email addresses found. Each member must have a unique email.')
      return
    }

    if (sameBatch === null) {
      setError('Please answer: will all members join the same batch?')
      return
    }

    if (sameBatch && !selectedBatchId) {
      setError('Please select a batch for your team.')
      return
    }

    if (!sameBatch) {
      // Check all per-person batches are filled
      const allFilled = parsedEmails.every((email) => perPersonBatches[email])
      if (!allFilled) {
        setError('Please assign a batch to each team member.')
        return
      }
    }

    setSubmitting(true)
    setError('')

    try {
      // Build member records
      const members = parsedEmails.map((email) => ({
        group_booking_id: bookingId,
        member_email: email,
        batch_id: sameBatch
          ? selectedBatchId || null
          : perPersonBatches[email] || null,
        invite_sent: false,
      }))

      const { error: membersError } = await supabase
        .from('group_booking_members')
        .insert(members)

      if (membersError) throw new Error('Failed to save member list: ' + membersError.message)

      // Update booking with filled_seats and batch_id (if same batch)
      const bookingUpdate: Record<string, unknown> = { filled_seats: parsedEmails.length }
      if (sameBatch && selectedBatchId) bookingUpdate.batch_id = selectedBatchId

      await supabase.from('group_bookings').update(bookingUpdate).eq('id', bookingId)

      // Trigger invite emails via edge function
      await supabase.functions.invoke('group-invite', {
        body: { group_booking_id: bookingId },
      })

      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invites. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Loading State ─────────────────────────────────────────────────────────────
  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Group / Team Enrollment</h1>
          <p className="text-gray-600">
            Enroll your entire team. Pay once, then invite members by email.
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center mt-6 gap-2">
            {(['form', 'review', 'paying', 'members', 'success'] as Step[]).map((s, i) => {
              const labels = ['Details', 'Review', 'Payment', 'Members', 'Done']
              const current =
                s === step ||
                (['form', 'review', 'paying', 'members', 'success'] as Step[]).indexOf(step) >
                  (['form', 'review', 'paying', 'members', 'success'] as Step[]).indexOf(s)
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className={`text-[10px] mt-1 ${current ? 'text-blue-600' : 'text-gray-400'}`}>
                      {labels[i]}
                    </span>
                  </div>
                  {i < 4 && (
                    <div
                      className={`h-px w-6 mb-4 ${
                        (['form', 'review', 'paying', 'members', 'success'] as Step[]).indexOf(step) > i
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* ─── STEP 1: Entity Form ─────────────────────────────────────────────── */}
        {step === 'form' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Contact Details */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Your Contact Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={entityEmail}
                    onChange={(e) => setEntityEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={entityPhone}
                    onChange={(e) => setEntityPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={entityOrg}
                    onChange={(e) => setEntityOrg(e.target.value)}
                    placeholder="Company / Team name"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Course + Seats */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Enrollment Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white"
                  >
                    <option value="">Select a course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.course_name} — {formatCurrency(c.monthly_price, 'INR')}/mo
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Seats * (min 2, max 50)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSeatCount(Math.max(2, seatCount - 1))}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-lg font-bold text-gray-600 hover:bg-gray-50"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={2}
                      max={50}
                      value={seatCount}
                      onChange={(e) => setSeatCount(Math.max(2, Math.min(50, parseInt(e.target.value) || 2)))}
                      className="w-20 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-center focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => setSeatCount(Math.min(50, seatCount + 1))}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-lg font-bold text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500">seats</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment type */}
            {selectedCourse && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Payment Option
                </h2>
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
                    <div className="text-base font-bold text-blue-600">
                      {formatCurrency(pricePerSeat * seatCount, 'INR')}
                      <span className="text-xs font-normal text-gray-500">/mo</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {seatCount} × {formatCurrency(pricePerSeat, 'INR')}/mo
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
                      <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full">
                        SAVE {upfrontDiscountPercent}%
                      </span>
                    )}
                    <div className="text-sm font-semibold text-gray-900">Upfront</div>
                    <div className="text-base font-bold text-green-600">
                      {formatCurrency(upfrontPricePerSeat * seatCount, 'INR')}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {seatCount} × {formatCurrency(upfrontPricePerSeat, 'INR')} one-time
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Quick price summary */}
            {selectedCourse && (
              <div className="bg-blue-50 rounded-xl p-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{seatCount} seats</span>
                  {paymentType === 'monthly'
                    ? ` × ${formatCurrency(pricePerSeat, 'INR')}/mo`
                    : ` × ${formatCurrency(upfrontPricePerSeat, 'INR')} upfront`}
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(totalAmount, 'INR')}
                  {paymentType === 'monthly' && (
                    <span className="text-sm font-normal text-gray-500">/mo</span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleReview}
              disabled={!selectedCourseId || !entityName || !entityEmail}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Review Booking
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ─── STEP 2: Review ──────────────────────────────────────────────────── */}
        {step === 'review' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Review Your Booking</h2>

            <div className="space-y-2 text-sm divide-y divide-gray-100">
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Contact Name</span>
                <span className="font-medium text-gray-900">{entityName}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{entityEmail}</span>
              </div>
              {entityOrg && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Organization</span>
                  <span className="font-medium text-gray-900">{entityOrg}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Course</span>
                <span className="font-medium text-gray-900">{selectedCourse?.course_name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Seats</span>
                <span className="font-medium text-gray-900">{seatCount} members</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Payment Type</span>
                <span className="font-medium text-gray-900 capitalize">{paymentType}</span>
              </div>
              <div className="flex justify-between py-3 bg-blue-50 rounded-lg px-3 mt-2">
                <span className="font-semibold text-gray-700">Total Due Now</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(totalAmount, 'INR')}
                  {paymentType === 'monthly' && <span className="text-sm font-normal text-gray-500">/mo</span>}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              <strong>After payment:</strong> You'll enter the team member emails and they'll receive signup invite links.
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handlePay}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Pay {formatCurrency(totalAmount, 'INR')} to Continue
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              Secure payment via Razorpay
            </div>
          </div>
        )}

        {/* ─── STEP 3: Paying (processing) ─────────────────────────────────────── */}
        {step === 'paying' && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment…</h3>
            <p className="text-sm text-gray-500">
              Please complete the payment in the Razorpay window.
            </p>
          </div>
        )}

        {/* ─── STEP 4: Member Collection ────────────────────────────────────────── */}
        {step === 'members' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
              </div>
              <p className="text-sm text-gray-600">
                Now add your team members' emails so they can sign up for the course.
              </p>
            </div>

            {/* Seat count reminder */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-sm">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-blue-800">
                You purchased <strong>{seatCount} seat{seatCount !== 1 ? 's' : ''}</strong>.
                Enter exactly {seatCount} unique email{seatCount !== 1 ? 's' : ''} below.
              </span>
            </div>

            {/* Email input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Team Member Emails *
              </label>
              <textarea
                value={emailsText}
                onChange={(e) => setEmailsText(e.target.value)}
                placeholder={`Paste emails separated by commas or new lines:\n\nalice@company.com\nbob@company.com, carol@company.com`}
                rows={5}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-mono"
              />
              {parsedEmails.length > 0 && (
                <p
                  className={`text-xs mt-1 ${
                    emailCountMismatch ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {parsedEmails.length} valid email{parsedEmails.length !== 1 ? 's' : ''} detected
                  {emailCountMismatch && ` — need ${seatCount}`}
                </p>
              )}
            </div>

            {/* Q: Same batch? */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Will all members join the same batch / timeslot?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setSameBatch(true); setPerPersonBatches({}) }}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                    sameBatch === true
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  ✓ Yes – Same batch
                </button>
                <button
                  type="button"
                  onClick={() => { setSameBatch(false); setSelectedBatchId('') }}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                    sameBatch === false
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  → Different batches
                </button>
              </div>
            </div>

            {/* If same batch → show one batch selector */}
            {sameBatch === true && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Select Batch for All Members
                </label>
                {availableBatches.length > 0 ? (
                  <div className="space-y-2">
                    {availableBatches.map((batch) => (
                      <button
                        key={batch.id}
                        type="button"
                        onClick={() => setSelectedBatchId(batch.id)}
                        className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-all ${
                          selectedBatchId === batch.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{batch.batch_name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {batch.session_days} · {batch.session_time} ({batch.timezone})
                          {batch.max_students != null && ` · ${batch.max_students - batch.current_student_count} spots left`}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    No batches available right now. The admin will assign batches after sign-up.
                  </p>
                )}
              </div>
            )}

            {/* If different batches → per-person batch selectors (shown after emails are parsed) */}
            {sameBatch === false && parsedEmails.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign a Batch to Each Member
                </label>
                <div className="space-y-2">
                  {parsedEmails.map((email, i) => (
                    <div key={email} className="flex items-center gap-3">
                      <div className="flex-1 truncate">
                        <span className="text-xs text-gray-400 mr-1">#{i + 1}</span>
                        <span className="text-sm text-gray-700">{email}</span>
                      </div>
                      {availableBatches.length > 0 ? (
                        <select
                          value={perPersonBatches[email] || ''}
                          onChange={(e) =>
                            setPerPersonBatches((prev) => ({ ...prev, [email]: e.target.value }))
                          }
                          className="flex-shrink-0 w-40 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white"
                        >
                          <option value="">Choose batch…</option>
                          {availableBatches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.batch_name} – {b.session_days}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No batches available</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleSendInvites}
              disabled={submitting || parsedEmails.length === 0 || emailCountMismatch}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Invites…
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Invites to {parsedEmails.length > 0 ? parsedEmails.length : seatCount} Members
                </>
              )}
            </button>
          </div>
        )}

        {/* ─── STEP 5: Success ──────────────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Set! 🎉</h2>
            <p className="text-gray-600 mb-2">
              Your group booking is confirmed. Invite emails have been sent to all{' '}
              <strong>{parsedEmails.length} members</strong>.
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Each member will receive a signup link to claim their seat.
            </p>
            {bookingId && (
              <p className="text-xs text-gray-400 mb-6">
                Booking ID:{' '}
                <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">{bookingId}</code>
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
