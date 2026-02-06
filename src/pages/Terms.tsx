import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Scale, Shield, AlertTriangle, Mail, Phone } from 'lucide-react'

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
            <p className="text-blue-200">Last updated: January 2024</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            
            {/* Introduction */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Agreement to Terms</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your use of WithArijit's website and educational services. 
                By accessing or using our services, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you disagree with any part of these terms, then you may not access our services.
              </p>
            </div>

            {/* Services Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
              <p className="text-gray-700 mb-4">
                WithArijit provides online educational services including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Agentic AI Development courses</li>
                <li>Vive Coding interactive learning programs</li>
                <li>Live masterclasses and workshops</li>
                <li>Educational content and resources</li>
                <li>Community access and support</li>
              </ul>
            </div>

            {/* User Accounts */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">User Accounts</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Creation</h3>
                  <p className="text-gray-700">
                    You must provide accurate and complete information when creating an account. 
                    You are responsible for maintaining the security of your account credentials.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Keep your login credentials secure</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Provide accurate personal information</li>
                    <li>Use the account only for lawful purposes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Course Enrollment and Payment */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Enrollment and Payment</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enrollment</h3>
                  <p className="text-gray-700">
                    Course enrollment is subject to availability. We reserve the right to cancel or reschedule 
                    courses with appropriate notice and refund options.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Terms</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Payment is required before course access</li>
                    <li>All prices are in the currency specified at checkout</li>
                    <li>Refunds are subject to our refund policy</li>
                    <li>We reserve the right to change pricing with notice</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Scale className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Intellectual Property</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Content</h3>
                  <p className="text-gray-700">
                    All course materials, videos, text, graphics, and other content are owned by WithArijit 
                    and protected by copyright and other intellectual property laws.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Projects</h3>
                  <p className="text-gray-700">
                    You retain ownership of projects you create during courses. However, you grant us 
                    permission to use anonymized examples for educational purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* User Conduct */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">User Conduct</h2>
              <p className="text-gray-700 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Share course materials with unauthorized parties</li>
                <li>Use our services for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt our services</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Harass or abuse other users or instructors</li>
                <li>Post spam or inappropriate content</li>
              </ul>
            </div>

            {/* Disclaimers */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Disclaimers</h2>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Our services are provided "as is" without warranties of any kind. We do not guarantee:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Specific career outcomes or job placement</li>
                  <li>Uninterrupted access to services</li>
                  <li>Error-free content or materials</li>
                  <li>Compatibility with all devices or browsers</li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
              <p className="text-gray-700">
                To the maximum extent permitted by law, WithArijit shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to 
                loss of profits, data, or other intangible losses.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to our services at our sole discretion, 
                without prior notice, for conduct that we believe violates these Terms or is harmful to 
                other users, us, or third parties.
              </p>
              <p className="text-gray-700">
                You may terminate your account at any time by contacting us. Upon termination, 
                your right to use our services will cease immediately.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of 
                significant changes via email or through our website. Continued use of our services 
                after changes constitutes acceptance of the new Terms.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of India. 
                Any disputes arising from these Terms or our services shall be subject to the 
                jurisdiction of Indian courts.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms of Service, please contact us:
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

export default Terms