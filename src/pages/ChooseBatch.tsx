import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useBatches } from '../hooks/useBatches'
import { useEnrollment } from '../hooks/useEnrollment'
import type { BatchV2 } from '../types/enrollment'

/**
 * Batch selection page - shown after successful payment.
 * Displays available batches for the paid course.
 */
export default function ChooseBatch() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { batches, loading: batchesLoading } = useBatches()
  const { enrollments, loading: enrollLoading, selectBatch, needsBatchSelection } = useEnrollment()

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Find the enrollment that needs batch selection
  const pendingEnrollment = enrollments.find(
    (e) => e.enrollment_type === 'paid' && !e.batch_id && e.enrollment_status === 'active'
  )

  // If no pending enrollment, redirect to dashboard
  useEffect(() => {
    if (!enrollLoading && !pendingEnrollment && enrollments.length > 0) {
      navigate('/dashboard', { replace: true })
    }
  }, [enrollLoading, pendingEnrollment, enrollments, navigate])

  // Filter batches for this course
  const availableBatches = pendingEnrollment
    ? batches.filter(
        (b) =>
          b.course_id === pendingEnrollment.course_id &&
          b.batch_type === 'paid' &&
          b.is_active &&
          b.is_visible_for_enrollment &&
          !b.is_full
      )
    : []

  const handleSelectBatch = async () => {
    if (!selectedBatchId || !pendingEnrollment) return

    setSubmitting(true)
    setError('')

    try {
      await selectBatch(pendingEnrollment.id, selectedBatchId)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select batch')
      setSubmitting(false)
    }
  }

  if (batchesLoading || enrollLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading available batches...</p>
        </div>
      </div>
    )
  }

  if (!pendingEnrollment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Batch Selection Required</h2>
          <p className="text-gray-500 mb-4">
            You don't have any enrollments pending batch selection.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Batch</h1>
          <p className="text-gray-600">
            Select a batch that fits your schedule. You can change later by contacting support.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Batch Cards */}
        {availableBatches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Batches Available</h3>
            <p className="text-gray-500">
              New batches will be available soon. You'll be notified when they open.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableBatches.map((batch) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                isSelected={selectedBatchId === batch.id}
                onSelect={() => setSelectedBatchId(batch.id)}
              />
            ))}
          </div>
        )}

        {/* Confirm Button */}
        {availableBatches.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleSelectBatch}
              disabled={!selectedBatchId || submitting}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Batch Selection
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// =====================================================
// Batch Card Component
// =====================================================

interface BatchCardProps {
  batch: BatchV2
  isSelected: boolean
  onSelect: () => void
}

function BatchCard({ batch, isSelected, onSelect }: BatchCardProps) {
  const spotsLeft = batch.max_students ? batch.max_students - batch.current_student_count : null

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-blue-600 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{batch.batch_name}</h3>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {batch.batch_code}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
            {batch.session_days && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{batch.session_days}</span>
              </div>
            )}
            {batch.session_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{batch.session_time} ({batch.timezone})</span>
              </div>
            )}
            {batch.start_date && (
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span>Starts {new Date(batch.start_date).toLocaleDateString()}</span>
              </div>
            )}
            {spotsLeft !== null && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className={spotsLeft < 5 ? 'text-orange-600 font-medium' : ''}>
                  {spotsLeft} spots left
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Selection Indicator */}
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
            isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
          }`}
        >
          {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
        </div>
      </div>
    </button>
  )
}
