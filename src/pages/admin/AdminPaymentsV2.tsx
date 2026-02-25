import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { Search, CreditCard, TrendingUp, IndianRupee, RefreshCw, Calendar } from 'lucide-react'

interface Payment {
  id: string
  student_email: string
  course_id: string
  payment_type: string
  original_amount: number
  discount_amount: number
  final_amount: number
  payment_status: string
  razorpay_payment_id: string | null
  created_at: string
}

export default function AdminPaymentsV2() {
  const { adminUser } = useAdminAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  async function fetchPayments() {
    try {
      setLoading(true)
      let query = supabase
        .from('payments_v2')
        .select('*')
        .order('created_at', { ascending: false })

      if (dateFrom) {
        query = query.gte('created_at', new Date(dateFrom).toISOString())
      }
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
        query = query.lte('created_at', endDate.toISOString())
      }

      const { data, error } = await query

      if (error) throw error
      setPayments(data || [])
    } catch (err) {
      console.error('Failed to fetch payments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (dateFrom || dateTo) {
      fetchPayments()
    }
  }, [dateFrom, dateTo])

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.student_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.razorpay_payment_id?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || p.payment_status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalRevenue = filteredPayments
    .filter((p) => p.payment_status === 'completed')
    .reduce((sum, p) => sum + (p.final_amount || 0), 0)

  const totalDiscount = filteredPayments
    .filter((p) => p.payment_status === 'completed')
    .reduce((sum, p) => sum + (p.discount_amount || 0), 0)

  function getStatusBadge(status: string) {
    switch (status) {
      case 'completed': return 'bg-green-600/20 text-green-400'
      case 'pending': return 'bg-yellow-600/20 text-yellow-400'
      case 'failed': return 'bg-red-600/20 text-red-400'
      case 'refunded': return 'bg-purple-600/20 text-purple-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Reports</h1>
          <p className="text-gray-400 text-sm mt-1">{payments.length} total payments</p>
        </div>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-600/20">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Revenue</p>
              <p className="text-white text-lg font-bold">{'\u20B9'}{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-600/20">
              <IndianRupee className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Discounts Given</p>
              <p className="text-white text-lg font-bold">{'\u20B9'}{totalDiscount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20">
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Completed Payments</p>
              <p className="text-white text-lg font-bold">
                {filteredPayments.filter((p) => p.payment_status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email or payment ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Payments Table */}
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
                  <th className="text-left p-3 text-gray-400 font-medium">Student</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Type</th>
                  <th className="text-right p-3 text-gray-400 font-medium">Original</th>
                  <th className="text-right p-3 text-gray-400 font-medium">Discount</th>
                  <th className="text-right p-3 text-gray-400 font-medium">Final</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="p-3 text-white text-xs">{payment.student_email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-[10px] rounded capitalize">
                        {payment.payment_type?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-300 text-right">{'\u20B9'}{(payment.original_amount || 0).toLocaleString()}</td>
                    <td className="p-3 text-orange-400 text-right">
                      {payment.discount_amount ? `-\u20B9${payment.discount_amount.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-3 text-white font-medium text-right">{'\u20B9'}{(payment.final_amount || 0).toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded capitalize ${getStatusBadge(payment.payment_status)}`}>
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No payments found matching your filters.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
