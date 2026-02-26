import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Users,
  CheckCircle,
  Loader2,
  AlertCircle,
  Mail,
  GraduationCap,
  ArrowRight,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useGroupBooking } from '../hooks/useGroupBooking'
import type { GroupBooking, GroupBookingMember } from '../types/payment'

/**
 * Group Booking Signup page - for invited members.
 * Route: /group-booking/signup/:token
 * Verifies invite token, shows group details, allows member to sign up.
 */
export default function GroupBookingSignup() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getGroupBookingByToken } = useGroupBooking()

  const [booking, setBooking] = useState<GroupBooking | null>(null)
  const [member, setMember] = useState<GroupBookingMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  // Fetch group booking by token
  useEffect(() => {
    if (!token) {
      setError('Invalid invite link')
      setLoading(false)
      return
    }

    loadBooking()
  }, [token])

  async function loadBooking() {
    try {
      setLoading(true)

      // Fetch booking by token
      const { data: bookingData, error: bookingError } = await supabase
        .from('group_bookings')
        .select('*')
        .eq('invite_token', token)
        .single()

      if (bookingError || !bookingData) {
        setError('Invalid or expired invite link')
        return
      }

      setBooking(bookingData as GroupBooking)

      // Check if invite has expired
      if (bookingData.invite_expiry && new Date(bookingData.invite_expiry) < new Date()) {
        setError('This invite link has expired')
        return
      }

      // Check if booking is paid
      if (bookingData.payment_status !== 'paid' && bookingData.payment_status !== 'completed') {
        setError('The group booking payment has not been completed yet')
        return
      }

      // If user is logged in, check if they're a member
      if (user?.email) {
        const { data: memberData } = await supabase
          .from('group_booking_members')
          .select('*')
          .eq('group_booking_id', bookingData.id)
          .eq('member_email', user.email.toLowerCase())
          .single()

        if (memberData) {
          setMember(memberData as GroupBookingMember)
          if (memberData.has_signed_up) {
            setClaimed(true)
          }
        }
      }
    } catch (err) {
      setError('Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  const handleClaimSeat = async () => {
    if (!user || !booking || !member) {
      // Redirect to signup first
      navigate(`/signup?redirect=/group-booking/signup/${token}`)
      return
    }

    setClaiming(true)
    setError('')

    try {
      // Update member record
      await supabase
        .from('group_booking_members')
        .update({
          invite_accepted: true,
          invite_accepted_at: new Date().toISOString(),
          has_signed_up: true,
          signed_up_at: new Date().toISOString(),
          auth_user_id: user.id,
        })
        .eq('id', member.id)

      // Create enrollment
      await supabase.from('student_enrollments_v2').insert({
        student_email: user.email?.toLowerCase(),
        student_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
        auth_user_id: user.id,
        course_id: booking.course_id,
        enrollment_type: 'group',
        payment_status: 'completed',
        enrollment_status: 'active',
        group_booking_id: booking.id,
      })

      // Update filled seats count
      await supabase.rpc('increment_group_seats', { booking_id: booking.id })

      setClaimed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim seat')
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Verifying your invite...</p>
        </div>
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Invalid Invite</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You've Been Invited!</h1>
          <p className="text-gray-600">
            {booking?.entity_name} has enrolled your team in an AI course.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Booking Details */}
          <div className="p-6 space-y-4">
            {booking?.entity_organization && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Organization:</span>
                <span className="font-medium text-gray-900">{booking.entity_organization}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Course:</span>
              <span className="font-medium text-gray-900">AI Course</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Group size:</span>
              <span className="font-medium text-gray-900">{booking?.total_seats} seats</span>
            </div>
          </div>

          {/* Action Area */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            {claimed ? (
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Seat Claimed!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You've been enrolled. Head to your dashboard to start learning.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : !user ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Sign up or sign in to claim your seat in this group enrollment.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to={`/signup?redirect=/group-booking/signup/${token}`}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to={`/signin?redirect=/group-booking/signup/${token}`}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            ) : member ? (
              <div className="text-center">
                {error && (
                  <div className="mb-4 text-sm text-red-600">{error}</div>
                )}
                <p className="text-sm text-gray-600 mb-4">
                  Signed in as <strong>{user.email}</strong>. Click below to claim your seat.
                </p>
                <button
                  onClick={handleClaimSeat}
                  disabled={claiming}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 mx-auto"
                >
                  {claiming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Claim My Seat
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">
                  Your email (<strong>{user.email}</strong>) was not found in the invite list. Contact {booking?.entity_name} to add you.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
