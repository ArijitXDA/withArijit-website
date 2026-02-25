import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { Search, Filter, Download, Users, RefreshCw } from 'lucide-react'

interface Enrollment {
  id: string
  student_email: string
  course_id: string
  batch_id: string | null
  enrollment_type: string
  payment_status: string
  enrollment_status: string
  enrolled_at: string
  created_at: string
}

export default function AdminEnrollments() {
  const { adminUser } = useAdminAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('')
  const [filterEnrollmentStatus, setFilterEnrollmentStatus] = useState('')

  useEffect(() => {
    fetchEnrollments()
  }, [])

  async function fetchEnrollments() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('student_enrollments_v2')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEnrollments(data || [])
    } catch (err) {
      console.error('Failed to fetch enrollments:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredEnrollments = enrollments.filter((e) => {
    const matchesSearch =
      !searchQuery ||
      e.student_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.course_id?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !filterType || e.enrollment_type === filterType
    const matchesPayment = !filterPaymentStatus || e.payment_status === filterPaymentStatus
    const matchesStatus = !filterEnrollmentStatus || e.enrollment_status === filterEnrollmentStatus
    return matchesSearch && matchesType && matchesPayment && matchesStatus
  })

  function getStatusBadge(status: string) {
    switch (status) {
      case 'active': return 'bg-green-600/20 text-green-400'
      case 'completed': return 'bg-blue-600/20 text-blue-400'
      case 'cancelled': return 'bg-red-600/20 text-red-400'
      case 'suspended': return 'bg-yellow-600/20 text-yellow-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  function getPaymentBadge(status: string) {
    switch (status) {
      case 'paid': return 'bg-green-600/20 text-green-400'
      case 'pending': return 'bg-yellow-600/20 text-yellow-400'
      case 'overdue': return 'bg-red-600/20 text-red-400'
      case 'free': return 'bg-cyan-600/20 text-cyan-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Enrollments</h1>
          <p className="text-gray-400 text-sm mt-1">{enrollments.length} total enrollments</p>
        </div>
        <button
          onClick={fetchEnrollments}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Types</option>
          <option value="paid">Paid</option>
          <option value="free">Free</option>
          <option value="trial">Trial</option>
        </select>
        <select
          value={filterPaymentStatus}
          onChange={(e) => setFilterPaymentStatus(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Payment Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="free">Free</option>
        </select>
        <select
          value={filterEnrollmentStatus}
          onChange={(e) => setFilterEnrollmentStatus(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Enrollments List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-400 font-medium">Student Email</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Course</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Batch</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Type</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Payment</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="p-3 text-white">{enrollment.student_email}</td>
                    <td className="p-3 text-gray-300 text-xs font-mono">{enrollment.course_id?.slice(0, 8)}...</td>
                    <td className="p-3 text-gray-300 text-xs font-mono">
                      {enrollment.batch_id ? `${enrollment.batch_id.slice(0, 8)}...` : '-'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded capitalize ${
                        enrollment.enrollment_type === 'paid' ? 'bg-orange-600/20 text-orange-400' : 'bg-cyan-600/20 text-cyan-400'
                      }`}>
                        {enrollment.enrollment_type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded capitalize ${getPaymentBadge(enrollment.payment_status)}`}>
                        {enrollment.payment_status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded capitalize ${getStatusBadge(enrollment.enrollment_status)}`}>
                        {enrollment.enrollment_status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {enrollment.enrolled_at
                        ? new Date(enrollment.enrolled_at).toLocaleDateString()
                        : new Date(enrollment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEnrollments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No enrollments found matching your filters.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
