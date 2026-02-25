import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import {
  Users, GraduationCap, CreditCard, BookOpen,
  TrendingUp, UserPlus, Calendar
} from 'lucide-react'

interface DashboardStats {
  totalCourses: number
  activeBatches: number
  totalEnrollments: number
  paidEnrollments: number
  freeEnrollments: number
  totalPayments: number
  totalRevenue: number
  studyMaterials: number
}

export default function AdminDashboard() {
  const { adminUser } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    activeBatches: 0,
    totalEnrollments: 0,
    paidEnrollments: 0,
    freeEnrollments: 0,
    totalPayments: 0,
    totalRevenue: 0,
    studyMaterials: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [
        { count: coursesCount },
        { count: batchesCount },
        { count: enrollmentsCount },
        { count: paidCount },
        { count: freeCount },
        { data: payments },
        { count: materialsCount },
      ] = await Promise.all([
        supabase.from('courses_v2').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('batches_v2').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('student_enrollments_v2').select('*', { count: 'exact', head: true }),
        supabase.from('student_enrollments_v2').select('*', { count: 'exact', head: true }).eq('enrollment_type', 'paid'),
        supabase.from('student_enrollments_v2').select('*', { count: 'exact', head: true }).eq('enrollment_type', 'free'),
        supabase.from('payments_v2').select('final_amount').eq('payment_status', 'completed'),
        supabase.from('study_materials_v2').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ])

      const totalRevenue = payments?.reduce((sum, p) => sum + (p.final_amount || 0), 0) || 0

      setStats({
        totalCourses: coursesCount || 0,
        activeBatches: batchesCount || 0,
        totalEnrollments: enrollmentsCount || 0,
        paidEnrollments: paidCount || 0,
        freeEnrollments: freeCount || 0,
        totalPayments: payments?.length || 0,
        totalRevenue,
        studyMaterials: materialsCount || 0,
      })
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Active Courses', value: stats.totalCourses, icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-600/20' },
    { label: 'Active Batches', value: stats.activeBatches, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-600/20' },
    { label: 'Total Enrollments', value: stats.totalEnrollments, icon: Users, color: 'text-green-400', bg: 'bg-green-600/20' },
    { label: 'Paid Students', value: stats.paidEnrollments, icon: UserPlus, color: 'text-orange-400', bg: 'bg-orange-600/20' },
    { label: 'Free Students', value: stats.freeEnrollments, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-600/20' },
    { label: 'Total Revenue', value: `\u20B9${stats.totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
    { label: 'Payments', value: stats.totalPayments, icon: CreditCard, color: 'text-yellow-400', bg: 'bg-yellow-600/20' },
    { label: 'Study Materials', value: stats.studyMaterials, icon: BookOpen, color: 'text-pink-400', bg: 'bg-pink-600/20' },
  ]

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {adminUser?.display_name || adminUser?.username}
        </h1>
        <p className="text-gray-400 mt-1">
          Here's an overview of your portal's performance.
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
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

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a href="/admin/courses" className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors">
            <GraduationCap className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300 text-sm">Manage Courses</span>
          </a>
          <a href="/admin/discounts" className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors">
            <CreditCard className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300 text-sm">Create Discount Coupon</span>
          </a>
          <a href="/admin/enrollments" className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors">
            <Users className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300 text-sm">View Enrollments</span>
          </a>
        </div>
      </div>
    </div>
  )
}
