import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import {
  TrendingUp, Users, CreditCard, GraduationCap, BookOpen,
  Calendar, IndianRupee, UserPlus, BarChart3, Activity, RefreshCw
} from 'lucide-react'

interface ReportStats {
  totalCourses: number
  activeBatches: number
  totalEnrollments: number
  paidEnrollments: number
  freeEnrollments: number
  totalRevenue: number
  totalPayments: number
  completedPayments: number
  pendingPayments: number
  failedPayments: number
  studyMaterials: number
  groupBookings: number
  recentEnrollments: number
  recentRevenue: number
}

export default function AdminReports() {
  const { adminUser } = useAdminAuth()
  const [stats, setStats] = useState<ReportStats>({
    totalCourses: 0,
    activeBatches: 0,
    totalEnrollments: 0,
    paidEnrollments: 0,
    freeEnrollments: 0,
    totalRevenue: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    studyMaterials: 0,
    groupBookings: 0,
    recentEnrollments: 0,
    recentRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [])

  async function fetchReportData() {
    try {
      setLoading(true)

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const [
        { count: coursesCount },
        { count: batchesCount },
        { count: enrollmentsCount },
        { count: paidEnrollments },
        { count: freeEnrollments },
        { data: allPayments },
        { count: materialsCount },
        { count: groupBookingsCount },
        { count: recentEnrollmentsCount },
        { data: recentPayments },
      ] = await Promise.all([
        supabase.from('courses_v2').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('batches_v2').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('student_enrollments_v2').select('*', { count: 'exact', head: true }),
        supabase.from('student_enrollments_v2').select('*', { count: 'exact', head: true }).eq('enrollment_type', 'paid'),
        supabase.from('student_enrollments_v2').select('*', { count: 'exact', head: true }).eq('enrollment_type', 'free'),
        supabase.from('payments_v2').select('final_amount, payment_status'),
        supabase.from('study_materials_v2').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('group_bookings').select('*', { count: 'exact', head: true }),
        supabase.from('student_enrollments_v2').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('payments_v2').select('final_amount').eq('payment_status', 'completed').gte('created_at', thirtyDaysAgo.toISOString()),
      ])

      const completedPayments = allPayments?.filter((p) => p.payment_status === 'completed') || []
      const pendingPayments = allPayments?.filter((p) => p.payment_status === 'pending') || []
      const failedPayments = allPayments?.filter((p) => p.payment_status === 'failed') || []
      const totalRevenue = completedPayments.reduce((sum, p) => sum + (p.final_amount || 0), 0)
      const recentRevenue = recentPayments?.reduce((sum, p) => sum + (p.final_amount || 0), 0) || 0

      setStats({
        totalCourses: coursesCount || 0,
        activeBatches: batchesCount || 0,
        totalEnrollments: enrollmentsCount || 0,
        paidEnrollments: paidEnrollments || 0,
        freeEnrollments: freeEnrollments || 0,
        totalRevenue,
        totalPayments: allPayments?.length || 0,
        completedPayments: completedPayments.length,
        pendingPayments: pendingPayments.length,
        failedPayments: failedPayments.length,
        studyMaterials: materialsCount || 0,
        groupBookings: groupBookingsCount || 0,
        recentEnrollments: recentEnrollmentsCount || 0,
        recentRevenue,
      })
    } catch (err) {
      console.error('Failed to fetch report data:', err)
    } finally {
      setLoading(false)
    }
  }

  const overviewCards = [
    { label: 'Total Revenue', value: `\u20B9${stats.totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
    { label: 'Total Enrollments', value: stats.totalEnrollments, icon: Users, color: 'text-blue-400', bg: 'bg-blue-600/20' },
    { label: 'Active Courses', value: stats.totalCourses, icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-600/20' },
    { label: 'Active Batches', value: stats.activeBatches, icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-600/20' },
  ]

  const revenueCards = [
    { label: 'Total Payments', value: stats.totalPayments, icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-600/20' },
    { label: 'Completed', value: stats.completedPayments, icon: CreditCard, color: 'text-green-400', bg: 'bg-green-600/20' },
    { label: 'Pending', value: stats.pendingPayments, icon: CreditCard, color: 'text-yellow-400', bg: 'bg-yellow-600/20' },
    { label: 'Failed', value: stats.failedPayments, icon: CreditCard, color: 'text-red-400', bg: 'bg-red-600/20' },
  ]

  const recentCards = [
    { label: 'Enrollments (30d)', value: stats.recentEnrollments, icon: UserPlus, color: 'text-orange-400', bg: 'bg-orange-600/20' },
    { label: 'Revenue (30d)', value: `\u20B9${stats.recentRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
    { label: 'Paid Students', value: stats.paidEnrollments, icon: Users, color: 'text-orange-400', bg: 'bg-orange-600/20' },
    { label: 'Free Students', value: stats.freeEnrollments, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-600/20' },
  ]

  function renderCardGrid(title: string, cards: typeof overviewCards) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-24 mb-3" />
                <div className="h-8 bg-gray-700 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div key={card.label} className="bg-gray-800 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">{card.label}</span>
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Overview of your platform metrics</p>
        </div>
        <button
          onClick={fetchReportData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Overview */}
      {renderCardGrid('Platform Overview', overviewCards)}

      {/* Payment Breakdown */}
      {renderCardGrid('Payment Breakdown', revenueCards)}

      {/* Recent Activity */}
      {renderCardGrid('Last 30 Days', recentCards)}

      {/* Additional Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Additional Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-pink-600/20">
                <BookOpen className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Study Materials</p>
                <p className="text-white text-xl font-bold">{loading ? '...' : stats.studyMaterials}</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs">Active study materials published</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-indigo-600/20">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Group Bookings</p>
                <p className="text-white text-xl font-bold">{loading ? '...' : stats.groupBookings}</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs">Total group booking requests</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-600/20">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Avg Revenue / Student</p>
                <p className="text-white text-xl font-bold">
                  {loading
                    ? '...'
                    : stats.paidEnrollments > 0
                      ? `\u20B9${Math.round(stats.totalRevenue / stats.paidEnrollments).toLocaleString('en-IN')}`
                      : '\u20B90'}
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-xs">Revenue per paid student</p>
          </div>
        </div>
      </div>

      {/* Placeholder for future charts */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700/50 border-dashed">
        <div className="text-center">
          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-gray-400 font-medium mb-1">Charts Coming Soon</h3>
          <p className="text-gray-500 text-sm">
            Revenue trends, enrollment graphs, and conversion funnels will be added here.
          </p>
        </div>
      </div>
    </div>
  )
}
