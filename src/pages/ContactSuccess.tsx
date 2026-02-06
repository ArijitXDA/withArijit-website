import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowLeft, Home, Mail } from 'lucide-react'

const ContactSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for contacting us. We've received your message and will get back to you soon.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• We'll review your message within 24 hours</li>
                <li>• You'll receive a response via email</li>
                <li>• For urgent matters, call +91 99300 51053</li>
                <li>• Check out our courses while you wait</li>
              </ul>
            </div>

            <div className="text-center space-y-3">
              <Link
                to="/courses"
                className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>🚀 Explore Courses</span>
              </Link>
              
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need immediate help?{' '}
            <a href="mailto:AI@withArijit.com" className="text-blue-600 hover:text-blue-500">
              AI@withArijit.com
            </a>{' '}
            or{' '}
            <a href="tel:+919930051053" className="text-blue-600 hover:text-blue-500">
              +91 99300 51053
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactSuccess