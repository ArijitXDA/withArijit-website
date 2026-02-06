import React from 'react'
import { Link } from 'react-router-dom'
import { Package, Download, Globe, Clock, Mail, Phone } from 'lucide-react'

const ShippingPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Shipping & Exchange Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Information about our digital course delivery and exchange policies
            </p>
            <p className="text-blue-200">Last updated: January 2024</p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            
            {/* Digital Nature Notice */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Digital Course Delivery</h2>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <p className="text-blue-800 font-semibold mb-2">Important Notice:</p>
                <p className="text-blue-700">
                  WithArijit provides exclusively digital educational services. Our products do not fall under 
                  shipping or exchange categories as all courses, materials, and resources are delivered 
                  electronically through our online platform.
                </p>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                This policy explains how we deliver our digital courses and handle course switching options.
              </p>
            </div>

            {/* Course Delivery */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How Courses Are Delivered</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Live Online Sessions</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Sessions conducted via Zoom or similar platforms</li>
                    <li>Meeting links sent via email 24 hours before each session</li>
                    <li>Interactive live sessions with real-time Q&A</li>
                    <li>Session recordings available for enrolled students</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Materials</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Digital resources accessible through our learning platform</li>
                    <li>Downloadable PDFs, code samples, and project files</li>
                    <li>Access provided within 24 hours of enrollment</li>
                    <li>Lifetime access to course materials</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Certificates</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Digital certificates issued upon course completion</li>
                    <li>Downloadable in PDF format</li>
                    <li>Includes verification QR code</li>
                    <li>Available within 7 days of course completion</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Delivery Timeline</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Immediate Access</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Course enrollment confirmation</li>
                    <li>• Welcome email with instructions</li>
                    <li>• Access to community groups</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Within 24 Hours</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Course materials and resources</li>
                    <li>• Session schedule and calendar invites</li>
                    <li>• Platform access credentials</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Course Exchange Policy */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Course Switching Policy</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Switching Options</h3>
                  <p className="text-gray-700 mb-4">
                    Since our products do not fall under traditional shipping or exchange categories, 
                    we offer course switching options for our digital educational services:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Course Switching</h4>
                      <p className="text-gray-700 text-sm">
                        Switch between courses within 48 hours by contacting Star Analytix, 
                        subject to approval of Star Analytix management
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Future Batch</h4>
                      <p className="text-gray-700 text-sm">
                        Move your enrollment to a future batch of the same course 
                        (subject to availability and management approval)
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Schedule Change</h4>
                      <p className="text-gray-700 text-sm">
                        Switch between different time slots or days for the same course 
                        (subject to availability and management approval)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Switching Conditions</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Course switching requests must be made within 48 hours of enrollment</li>
                    <li>All requests must be made by contacting Star Analytix directly</li>
                    <li>Course switching is subject to Star Analytix management approval</li>
                    <li>Subject to availability in the target course/batch</li>
                    <li>Price differences must be paid if switching to a higher-value course</li>
                    <li>Refunds will be processed if switching to a lower-value course</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Requirements */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Requirements</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">System Requirements</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Minimum Requirements:</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Stable internet connection (5 Mbps+)</li>
                      <li>• Modern web browser (Chrome, Firefox, Safari)</li>
                      <li>• Audio output (speakers/headphones)</li>
                      <li>• Microphone for interactive sessions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recommended:</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• High-speed broadband connection</li>
                      <li>• Webcam for better interaction</li>
                      <li>• Dual monitor setup</li>
                      <li>• Quiet learning environment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Support & Troubleshooting */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Support</h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  If you experience any technical issues with course delivery or access:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Before Sessions</h3>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Test your setup 30 minutes early</li>
                      <li>• Check email for session links</li>
                      <li>• Update your browser/software</li>
                      <li>• Contact support if issues persist</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">During Sessions</h3>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Use chat for technical issues</li>
                      <li>• Recording available if you miss content</li>
                      <li>• Alternative dial-in numbers provided</li>
                      <li>• Support team monitors all sessions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Star Analytix for Course Switching</h2>
              <p className="text-gray-700 mb-6">
                For course switching requests or any questions about our digital course delivery:
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
                  <strong>Support Hours:</strong> Monday to Friday, 9:00 AM - 6:00 PM IST<br/>
                  <strong>Course Switching:</strong> Requests processed within 48 hours<br/>
                  <strong>Response Time:</strong> Within 24 hours during business hours
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

export default ShippingPolicy