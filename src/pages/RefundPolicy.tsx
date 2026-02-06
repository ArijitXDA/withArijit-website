import React from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Clock, CreditCard, AlertCircle, Mail, Phone } from 'lucide-react'

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cancellation & Refund Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Clear and transparent policies for course cancellations and refunds
            </p>
            <p className="text-blue-200">Last updated: January 2024</p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            
            {/* Overview */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Refund Policy Overview</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                At WithArijit, we are committed to providing high-quality educational services. 
                This policy outlines the terms and conditions for course cancellations and refunds.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-blue-800 font-semibold">
                  We offer flexible refund options to ensure your satisfaction with our courses.
                </p>
              </div>
            </div>

            {/* Course Refunds */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Course Refunds</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Full Course Programs (4 Months)</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Within 7 working days of enrollment:</strong> 100% refund if no classes attended</li>
                    <li><strong>After first class but within 7 working days:</strong> 80% refund</li>
                    <li><strong>After 7 working days but within 1 month:</strong> 50% refund</li>
                    <li><strong>After 1 month:</strong> No refund, but course switching allowed (subject to approval)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Master Classes (2 Hours)</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Before class starts:</strong> 100% refund</li>
                    <li><strong>Within 7 working days of enrollment:</strong> 100% refund</li>
                    <li><strong>After 7 working days:</strong> No refund, but recording access provided</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cancellation Process */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How to Cancel</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancellation Steps</h3>
                  <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                    <li>Send an email to <a href="mailto:AI@withArijit.com" className="text-blue-600 hover:text-blue-500">AI@withArijit.com</a></li>
                    <li>Include your full name, email, and course details</li>
                    <li>Specify the reason for cancellation</li>
                    <li>Provide your payment transaction ID</li>
                    <li>We will process your request within 2-3 business days</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-medium mb-2">Important Notes:</p>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Cancellation requests must be made in writing via email</li>
                        <li>• Phone or WhatsApp cancellations are not accepted</li>
                        <li>• Refund processing may take 5-10 business days</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Processing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Processing</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Time</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>All refunds are processed within 7 working days of approval</li>
                    <li>Credit/Debit Cards: 7-10 working days from processing</li>
                    <li>UPI/Net Banking: 5-7 working days from processing</li>
                    <li>International payments: 10-15 working days from processing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Method</h3>
                  <p className="text-gray-700">
                    Refunds will be processed to the original payment method used for the transaction. 
                    We cannot process refunds to different accounts or payment methods.
                  </p>
                </div>
              </div>
            </div>

            {/* Non-Refundable Items */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Non-Refundable Items</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Course materials downloaded or accessed</li>
                <li>Completed masterclasses or workshops</li>
                <li>One-on-one consultation sessions</li>
                <li>Corporate training programs (custom terms apply)</li>
                <li>Courses completed beyond the refund period</li>
              </ul>
            </div>

            {/* Special Circumstances */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Circumstances</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical/Emergency Situations</h3>
                  <p className="text-gray-700 mb-2">
                    We understand that unexpected situations may arise. In case of medical emergencies 
                    or other exceptional circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Contact us immediately with supporting documentation</li>
                    <li>We may offer course transfer to future batches</li>
                    <li>Partial refunds may be considered on a case-by-case basis</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Cancellation by WithArijit</h3>
                  <p className="text-gray-700">
                    If we need to cancel a course due to insufficient enrollment or other reasons:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Full refund will be provided within 5 business days</li>
                    <li>Alternative course options will be offered</li>
                    <li>Priority enrollment in future batches</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact for Refunds</h2>
              <p className="text-gray-700 mb-6">
                For all refund and cancellation requests, please contact us:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">AI@withArijit.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">+91 99300 51053</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Business Hours:</strong> Monday to Friday, 9:00 AM - 6:00 PM IST<br/>
                  <strong>Response Time:</strong> We aim to respond to all refund requests within 24 hours
                </p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-12 text-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RefundPolicy