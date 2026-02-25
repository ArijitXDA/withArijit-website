import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Building2,
  Mail,
  Phone,
  CreditCard,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  GraduationCap,
} from 'lucide-react'
import { useCourses } from '../hooks/useCourses'
import { useGroupBooking } from '../hooks/useGroupBooking'
import { formatCurrency } from '../lib/currency'
import { isValidEmail, isValidGroupSeats, validateEmailList } from '../lib/validators'
import type { Course } from '../types/course'

/**
 * Group Booking page - Entity form for group purchases.
 * Entity fills name, email, phone, course, seat count, member emails.
 */
export default function GroupBooking() {
  const navigate = useNavigate()
  const { courses, loading: coursesLoading } = useCourses()
  const { createGroupBooking } = useGroupBooking()

  // Form state
  const [entityName, setEntityName] = useState('')
  const [entityEmail, setEntityEmail] = useState('')
  const [entityPhone, setEntityPhone] = useState('')
  const [entityOrg, setEntityOrg] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [memberEmails, setMemberEmails] = useState<string[]>([''])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'summary' | 'success'>('form')
  const [bookingId, setBookingId] = useState<string | null>(null)

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)
  const seatCount = memberEmails.filter((e) => e.trim()).length
  const pricePerSeat = selectedCourse?.monthly_price || 0
  const totalAmount = pricePerSeat * seatCount * (selectedCourse?.duration_months || 1)

  // Add member email slot
  const addMemberSlot = () => {
    if (memberEmails.length < 50) {
      setMemberEmails([...memberEmails, ''])
    }
  }

  // Remove member email slot
  const removeMemberSlot = (index: number) => {
    if (memberEmails.length > 1) {
      setMemberEmails(memberEmails.filter((_, i) => i !== index))
    }
  }

  // Update member email
  const updateMemberEmail = (index: number, value: string) => {
    const updated = [...memberEmails]
    updated[index] = value
    setMemberEmails(updated)
  }

  // Validate form
  const validateForm = (): string | null => {
    if (!entityName.trim()) return 'Please enter contact name'
    if (!entityEmail.trim() || !isValidEmail(entityEmail)) return 'Please enter a valid email'
    if (!selectedCourseId) return 'Please select a course'

    const validEmails = memberEmails.filter((e) => e.trim())
    if (validEmails.length < 2) return 'Please add at least 2 member emails for group booking'

    const emailValidation = validateEmailList(validEmails)
    if (!emailValidation.isValid) return emailValidation.error || 'Invalid email addresses'

    // Check for duplicates
    const unique = new Set(validEmails.map((e) => e.toLowerCase().trim()))
    if (unique.size !== validEmails.length) return 'Duplicate email addresses found'

    return null
  }

  const handleReviewBooking = () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setStep('summary')
  }

  const handleSubmitBooking = async () => {
    setSubmitting(true)
    setError('')

    try {
      const validEmails = memberEmails.filter((e) => e.trim()).map((e) => e.toLowerCase().trim())

      const result = await createGroupBooking({
        entity_name: entityName.trim(),
        entity_email: entityEmail.toLowerCase().trim(),
        entity_phone: entityPhone.trim() || null,
        entity_organization: entityOrg.trim() || null,
        course_id: selectedCourseId,
        total_seats: validEmails.length,
        member_emails: validEmails,
        price_per_seat: pricePerSeat,
        currency: 'INR',
      })

      if (result?.id) {
        setBookingId(result.id)
        setStep('success')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Group Booking</h1>
          <p className="text-gray-600">
            Enroll your team in an AI course. Pay once, invite your team members.
          </p>
        </div>

        {/* Success State */}
        {step === 'success' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Created!</h2>
            <p className="text-gray-600 mb-4">
              Your group booking has been created. Complete the payment to send invites to your team.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Booking reference: <code className="bg-gray-100 px-2 py-0.5 rounded">{bookingId}</code>
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Summary State */}
        {step === 'summary' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Review Your Booking</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Contact Name</span>
                <span className="font-medium text-gray-900">{entityName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{entityEmail}</span>
              </div>
              {entityOrg && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Organization</span>
                  <span className="font-medium text-gray-900">{entityOrg}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Course</span>
                <span className="font-medium text-gray-900">{selectedCourse?.course_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Team Size</span>
                <span className="font-medium text-gray-900">{seatCount} members</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Price per Seat</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(pricePerSeat, 'INR')}/mo × {selectedCourse?.duration_months || 1} months
                </span>
              </div>
              <div className="flex justify-between py-3 bg-blue-50 rounded-lg px-3">
                <span className="font-semibold text-gray-700">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(totalAmount, 'INR')}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members</h4>
              <div className="space-y-1">
                {memberEmails.filter((e) => e.trim()).map((email, i) => (
                  <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-3 h-3 text-gray-400" />
                    {email}
                  </div>
                ))}
              </div>
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
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Edit
              </button>
              <button
                onClick={handleSubmitBooking}
                disabled={submitting}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Form State */}
        {step === 'form' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Entity Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  required
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
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input
                  type="text"
                  value={entityOrg}
                  onChange={(e) => setEntityOrg(e.target.value)}
                  placeholder="Company name (optional)"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
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

            {/* Member Emails */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Team Member Emails * (minimum 2)
              </label>
              <div className="space-y-2">
                {memberEmails.map((email, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateMemberEmail(i, e.target.value)}
                      placeholder={`Member ${i + 1} email`}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                    {memberEmails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMemberSlot(i)}
                        className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMemberSlot}
                className="mt-2 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            {/* Quick Summary */}
            {selectedCourse && seatCount >= 2 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {seatCount} seats × {formatCurrency(pricePerSeat, 'INR')}/mo × {selectedCourse.duration_months} months
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(totalAmount, 'INR')}
                  </span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleReviewBooking}
              disabled={!selectedCourseId || !entityName || !entityEmail}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Review Booking
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
