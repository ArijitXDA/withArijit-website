import React from 'react'
import { Link } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'

const PaymentCancelled: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h2>
          <p className="text-gray-600 mb-8">
            Your payment was cancelled. Don't worry, no charges were made to your account.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Want to try again?</h3>
              <p className="text-sm text-blue-800">
                You can retry your payment anytime. We accept all major payment methods 
                including cards, UPI, and net banking.
              </p>
            </div>

            <div className="text-center space-y-3">
              <Link
                to="/courses"
                className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Payment Again</span>
              </Link>
              
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:AI@withArijit.com" className="text-blue-600 hover:text-blue-500">
              AI@withArijit.com
            </a>{' '}
            or call{' '}
            <a href="tel:+919930051053" className="text-blue-600 hover:text-blue-500">
              +91 99300 51053
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancelled