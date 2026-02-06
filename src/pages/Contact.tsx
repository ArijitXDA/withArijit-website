import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Send, 
  CheckCircle,
  Clock,
  Users,
  MessageSquare
} from 'lucide-react'

const Contact: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Check if coming from referral claim
  const fromReferralClaim = searchParams.get('referral') === 'claim'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    purpose: fromReferralClaim ? 'request_referral_commission' : '',
    additional_details: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const purposeOptions = [
    { value: '', label: 'Select your purpose' },
    { value: 'join_agentic_ai', label: 'Join Agentic AI Course' },
    { value: 'join_vive_coding', label: 'Join Vive Coding Course' },
    { value: 'free_session', label: 'Need Free Session' },
    { value: 'corporate_session', label: 'Corporate Session' },
    { value: 'ai_consulting', label: 'AI Consulting' },
    { value: 'seeking_ai_developer', label: 'Seeking AI Developer' },
    { value: 'request_referral_commission', label: 'Request for referral commission payout' },
    { value: 'looking_for_ai_job', label: 'Looking for an AI skillset job' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      console.log('Form submission started:', formData)
      
      // Validate required fields
      if (!formData.name || !formData.email || !formData.mobile || !formData.purpose) {
        setError('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      console.log('Supabase config check:', {
        urlExists: !!supabaseUrl,
        keyExists: !!supabaseKey,
        url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'Missing'
      })
      
      if (!supabaseUrl || !supabaseKey) {
        setError('Configuration error: Supabase not properly configured. Please contact support.')
        setIsSubmitting(false)
        return
      }

      // Insert into Supabase
      console.log('Inserting into Supabase...')
      const { data, error: dbError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          purpose: formData.purpose,
          additional_details: formData.additional_details || null
        }])
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        setError(`Database error: ${dbError.message}. Please try again or contact support.`)
        setIsSubmitting(false)
        return
      }

      console.log('Form submitted successfully:', data)

      // Send notification email
      try {
        console.log('Sending notification email...')
        console.log('Email function payload:', {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          purpose: formData.purpose,
          additional_details: formData.additional_details
        })
        
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-contact-notification', {
          body: {
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            purpose: formData.purpose,
            additional_details: formData.additional_details
          }
        })
        console.log('Email function response:', { emailData, emailError })

        if (emailError) {
          console.error('Email error:', emailError)
          console.error('Email error details:', JSON.stringify(emailError, null, 2))
          // Don't fail the form submission if email fails - show fallback message
          console.log('📧 Email service temporarily unavailable - contact saved to database')
          
          // Create fallback notification in console for immediate access
          console.log('🔔 NEW CONTACT FORM SUBMISSION:')
          console.log('📝 Name:', formData.name)
          console.log('📧 Email:', formData.email)
          console.log('📱 Mobile:', formData.mobile)
          console.log('🎯 Purpose:', formData.purpose)
          console.log('💬 Details:', formData.additional_details)
          console.log('⏰ Time:', new Date().toLocaleString())
          console.log('🆔 Record ID:', data.id)
        } else {
          console.log('Email sent successfully:', emailData)
          console.log('✅ Email notification sent to star.analytix.ai@gmail.com')
        }
      } catch (emailError) {
        console.error('Email function error:', emailError)
        console.error('Email function error details:', JSON.stringify(emailError, null, 2))
        // Don't fail the form submission if email fails - show fallback
        console.log('📧 Email service error - contact saved to database')
        
        // Create fallback notification in console for immediate access
        console.log('🔔 NEW CONTACT FORM SUBMISSION (EMAIL FAILED):')
        console.log('📝 Name:', formData.name)
        console.log('📧 Email:', formData.email)
        console.log('📱 Mobile:', formData.mobile)
        console.log('🎯 Purpose:', formData.purpose)
        console.log('💬 Details:', formData.additional_details)
        console.log('⏰ Time:', new Date().toLocaleString())
        console.log('🆔 Record ID:', data.id)
      }

      // Success - redirect to success page
      console.log('Redirecting to success page...')
      navigate('/contact-success')

    } catch (error) {
      console.error('Form submission error:', error)
      setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`)
      setIsSubmitting(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Ready to start your AI journey? Have questions about our courses? 
              We're here to help you every step of the way.
            </p>
          </div>
        </div>

      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
              <a
                href="https://wa.me/919930051053"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                title="Chat on WhatsApp"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
              <a
                href="tel:+919930051053"
                className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                title="Call Now"
              >
                <Phone className="w-7 h-7" />
              </a>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose *
                  </label>
                  <select
                    id="purpose"
                    name="purpose"
                    required
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {purposeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="additional_details" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    id="additional_details"
                    name="additional_details"
                    rows={4}
                    value={formData.additional_details}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us more about your requirements or questions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">+91 99300 51053</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">AI@withArijit.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Website</h3>
                      <p className="text-gray-600">www.AIwithArijit.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Response Times</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Course inquiries: Within 2 hours</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Corporate training: Within 4 hours</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">General questions: Within 24 hours</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST</p>
                  <p><strong>Saturday - Sunday:</strong> 10:00 AM - 4:00 PM IST</p>
                  <p className="text-xs text-gray-500"><strong>Managed by:</strong> Ms Antara Chowdhury, Star Analytix, A201, Shree Samruddhi, Mira Road, Mumbai-401107, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact