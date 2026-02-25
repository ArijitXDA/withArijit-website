import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { Search, Users, Building2, RefreshCw, Eye, CheckCircle, XCircle } from 'lucide-react'

interface GroupBooking {
  id: string
  entity_name: string
  entity_email: string
  course_id: string
  total_seats: number
  filled_seats: number
  booking_status: string
  payment_status: string
  contact_person: string | null
  contact_phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export default function AdminGroupBookings() {
  const { adminUser } = useAdminAuth()
  const [bookings, setBookings] = useState<GroupBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBookingStatus, setFilterBookingStatus] = useState('')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<GroupBooking | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('group_bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (err) {
      console.error('Failed to fetch group bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateBookingStatus(bookingId: string, status: string) {
    const { error } = await supabase
      .from('group_bookings')
      .update({ booking_status: status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)

    if (!error) {
      fetchBookings()
      setSelectedBooking(null)
    }
  }

  async function updatePaymentStatus(bookingId: string, status: string) {
    const { error } = await supabase
      .from('group_bookings')
      .update({ payment_status: status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)

    if (!error) {
      fetchBookings()
      setSelectedBooking(null)
    }
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      !searchQuery ||
      b.entity_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.entity_email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBooking = !filterBookingStatus || b.booking_status === filterBookingStatus
    const matchesPayment = !filterPaymentStatus || b.payment_status === filterPaymentStatus
    return matchesSearch && matchesBooking && matchesPayment
  })

  function getBookingStatusBadge(status: string) {
    switch (status) {
      case 'confirmed': return 'bg-green-600/20 text-green-400'
      case 'pending': return 'bg-yellow-600/20 text-yellow-400'
      case 'cancelled': return 'bg-red-600/20 text-red-400'
      case 'completed': return 'bg-blue-600/20 text-blue-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  function getPaymentStatusBadge(status: string) {
    switch (status) {
      case 'paid': return 'bg-green-600/20 text-green-400'
      case 'partial': return 'bg-orange-600/20 text-orange-400'
      case 'pending': return 'bg-yellow-600/20 text-yellow-400'
      case 'refunded': return 'bg-purple-600/20 text-purple-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Group Bookings</h1>
          <p className="text-gray-400 text-sm mt-1">{bookings.length} total bookings</p>
        </div>
        <button
          onClick={fetchBookings}
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
            placeholder="Search by entity name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        <select
          value={filterBookingStatus}
          onChange={(e) => setFilterBookingStatus(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Booking Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filterPaymentStatus}
          onChange={(e) => setFilterPaymentStatus(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Payment Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-orange-400" />
                    <h3 className="text-white font-medium truncate">{booking.entity_name}</h3>
                    <span className={`px-2 py-0.5 text-[10px] rounded capitalize ${getBookingStatusBadge(booking.booking_status)}`}>
                      {booking.booking_status}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] rounded capitalize ${getPaymentStatusBadge(booking.payment_status)}`}>
                      Payment: {booking.payment_status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{booking.entity_email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {booking.filled_seats}/{booking.total_seats} seats filled
                    </span>
                    <span>Course: {booking.course_id?.slice(0, 8)}...</span>
                    {booking.contact_person && <span>Contact: {booking.contact_person}</span>}
                    <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {booking.booking_status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="p-2 rounded-lg text-green-400 hover:bg-gray-700 transition-colors"
                        title="Confirm"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="p-2 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
                        title="Cancel"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No group bookings found.
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full border border-gray-700">
            <div className="border-b border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs">Entity Name</p>
                  <p className="text-white text-sm">{selectedBooking.entity_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white text-sm">{selectedBooking.entity_email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Total Seats</p>
                  <p className="text-white text-sm">{selectedBooking.total_seats}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Filled Seats</p>
                  <p className="text-white text-sm">{selectedBooking.filled_seats}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Booking Status</p>
                  <span className={`px-2 py-0.5 text-xs rounded capitalize ${getBookingStatusBadge(selectedBooking.booking_status)}`}>
                    {selectedBooking.booking_status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Payment Status</p>
                  <span className={`px-2 py-0.5 text-xs rounded capitalize ${getPaymentStatusBadge(selectedBooking.payment_status)}`}>
                    {selectedBooking.payment_status}
                  </span>
                </div>
                {selectedBooking.contact_person && (
                  <div>
                    <p className="text-gray-400 text-xs">Contact Person</p>
                    <p className="text-white text-sm">{selectedBooking.contact_person}</p>
                  </div>
                )}
                {selectedBooking.contact_phone && (
                  <div>
                    <p className="text-gray-400 text-xs">Contact Phone</p>
                    <p className="text-white text-sm">{selectedBooking.contact_phone}</p>
                  </div>
                )}
              </div>
              {selectedBooking.notes && (
                <div>
                  <p className="text-gray-400 text-xs mb-1">Notes</p>
                  <p className="text-gray-300 text-sm bg-gray-900 rounded-lg p-3">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Quick Status Updates */}
              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-xs mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateBookingStatus(selectedBooking.id, status)}
                      disabled={selectedBooking.booking_status === status}
                      className={`px-3 py-1 text-xs rounded-lg capitalize transition-colors ${
                        selectedBooking.booking_status === status
                          ? 'bg-orange-600/20 text-orange-400 cursor-default'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mb-2 mt-3">Update Payment</p>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'partial', 'paid', 'refunded'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updatePaymentStatus(selectedBooking.id, status)}
                      disabled={selectedBooking.payment_status === status}
                      className={`px-3 py-1 text-xs rounded-lg capitalize transition-colors ${
                        selectedBooking.payment_status === status
                          ? 'bg-orange-600/20 text-orange-400 cursor-default'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
