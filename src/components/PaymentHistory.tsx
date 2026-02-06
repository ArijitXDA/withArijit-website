import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { CreditCard, CheckCircle, Clock, Calendar, Globe, AlertCircle } from 'lucide-react'
import type { Payment } from '../lib/supabase'

interface PaymentHistoryProps {
  userEmail?: string
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ userEmail }) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      if (!userEmail) {
        console.log('No userEmail provided, not fetching payments')
        setLoading(false)
        return
      }

      try {
        console.log('=== PAYMENT HISTORY DEBUG ===')
        console.log('User email for query:', userEmail)
        
        // First, let's check total payments for this user (all statuses)
        const { data: allPayments, error: allError } = await supabase
          .from('payments')
          .select('*')
          .eq('email', userEmail)
          .order('created_at', { ascending: false })
        
        console.log('All payments for user (any status):', allPayments?.length || 0)
        if (allPayments) {
          console.log('Payment statuses:', allPayments.map(p => p.payment_status))
          console.log('All payments data:', allPayments)
        }
        
        // Now get only successful payments
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('email', userEmail)
          .eq('payment_status', 'success')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching payments:', error)
          setDebugInfo(`Error: ${error.message}`)
        } else {
          const successfulCount = data?.length || 0
          const totalCount = allPayments?.length || 0
          console.log(`Found ${successfulCount} successful payments out of ${totalCount} total payments for user: ${userEmail}`)
          console.log('Successful payments data:', data)
          setDebugInfo(`Total payments: ${totalCount}, Successful: ${successfulCount}`)
          setPayments(data || [])
        }
      } catch (error) {
        console.error('Error fetching payments:', error)
        setDebugInfo(`Exception: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [userEmail])

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'success':
        return 'Success'
      case 'pending':
      default:
        return 'Pending'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50'
      case 'pending':
      default:
        return 'text-yellow-600 bg-yellow-50'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'N/A'
    return timeString.substring(0, 5) // Show HH:MM format
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No payment records found</p>
        <p className="text-sm text-gray-400 mt-2">Your payment history will appear here once you enroll in a course</p>
        {debugInfo && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 font-mono">{debugInfo}</p>
          </div>
        )}
      </div>
    )
  }

  console.log('Rendering payments:', payments.length)
  console.log('Payments to render:', payments)

  return (
    <div className="space-y-6">
      {debugInfo && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-mono">{debugInfo}</p>
        </div>
      )}
      <div className="text-sm text-gray-600 mb-4">
        Showing {payments.length} successful payments
      </div>
      {payments.map((payment) => (
        <div key={payment.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              {getStatusIcon(payment.payment_status)}
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{payment.course}</h4>
                <p className="text-gray-600 mb-2">{payment.duration}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(payment.payment_date || payment.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(payment.payment_time)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{payment.country}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2 justify-end">
                <span className="text-sm font-medium text-gray-500">Amount</span>
                <span className="text-2xl font-bold text-gray-900">
                  {payment.currency === 'USD' ? '$' : '₹'}{payment.amount}
                </span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.payment_status)}`}>
                {getStatusText(payment.payment_status)}
              </span>
            </div>
          </div>
          
          {payment.razorpay_payment_id && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Payment ID:</span>
                <span className="font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">
                  {payment.razorpay_payment_id}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PaymentHistory