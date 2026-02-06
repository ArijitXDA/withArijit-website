import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PaymentModal from '../components/PaymentModal'
import { 
  Brain, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar, 
  Briefcase, 
  CheckCircle, 
  Star, 
  Send, 
  ArrowRight,
  Target,
  BookOpen,
  Users,
  Rocket,
  Award,
  Zap,
  Globe,
  Sparkles,
  Shield,
  Clock,
  TrendingUp,
  Heart,
  MessageSquare,
  UserCheck
} from 'lucide-react'

interface FormData {
  name: string
  email: string
  mobile: string
  age: string
  occupation: string
  organization: string
  city: string
  interestAreas: string[]
  timeline: string
  needsCertificate: boolean
  webinarAttended: boolean
  positiveFeedback: string
  negativeFeedback: string
  rating: number
  recommend: boolean | null
  permissionPublishFeedback: boolean | null
  ref1Name: string
  ref1Mobile: string
  ref2Name: string
  ref2Mobile: string
}

const AICertificateApplication: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    age: '',
    occupation: '',
    organization: '',
    city: '',
    interestAreas: [],
    timeline: '',
    needsCertificate: false,
    webinarAttended: false,
    positiveFeedback: '',
    negativeFeedback: '',
    rating: 0,
    recommend: null,
    permissionPublishFeedback: null,
    ref1Name: '',
    ref1Mobile: '',
    ref2Name: '',
    ref2Mobile: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const interestOptions = [
    'AI Tools for Productivity',
    'Python + AI Agent Development',
    'Advanced AI Frameworks (LangChain, AutoGen, CrewAI)',
    'AI for Business Strategy',
    'Startups / Entrepreneurship with AI'
  ]

  const timelineOptions = [
    'Immediately (next 1 month)',
    'Within 3–6 months',
    'Exploring, not sure yet'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      if (name === 'needsCertificate') {
        setFormData(prev => ({
          ...prev,
          needsCertificate: checked
        }))
      } else if (name === 'webinarAttended') {
        setFormData(prev => ({
          ...prev,
          webinarAttended: checked
        }))
      } else if (name.startsWith('interest_')) {
        const interestValue = name.replace('interest_', '')
        setFormData(prev => ({
          ...prev,
          interestAreas: checked 
            ? [...prev.interestAreas, interestValue]
            : prev.interestAreas.filter(area => area !== interestValue)
        }))
      }
    } else if (type === 'radio') {
      if (name === 'recommend') {
        setFormData(prev => ({
          ...prev,
          recommend: value === 'yes'
        }))
      } else if (name === 'permissionPublishFeedback') {
        setFormData(prev => ({
          ...prev,
          permissionPublishFeedback: value === 'yes'
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    setError('')
  }

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
    setError('')
  }

  const validateForm = () => {
    // Required fields validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.occupation) {
      return 'Please fill in all required fields marked with *'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address'
    }

    // Mobile validation (basic numeric check)
    const mobileRegex = /^[0-9+\-\s()]{10,15}$/
    if (!mobileRegex.test(formData.mobile.replace(/\s/g, ''))) {
      return 'Please enter a valid mobile number (10-15 digits)'
    }

    // Age validation (if provided)
    if (formData.age && (parseInt(formData.age) < 16 || parseInt(formData.age) > 100)) {
      return 'Please enter a valid age between 16 and 100'
    }

    // Interest areas validation
    if (formData.interestAreas.length === 0) {
      return 'Please select at least one interest area'
    }

    // Timeline validation
    if (!formData.timeline) {
      return 'Please select a timeline'
    }

    // Feedback & Rating validation (only if webinar attended)
    if (formData.webinarAttended) {
      // Rating validation
      if (formData.rating === 0) {
        return 'Please provide a rating'
      }

      // Recommendation validation
      if (formData.recommend === null) {
        return 'Please indicate if you would recommend this to others'
      }

      // Permission validation
      if (formData.permissionPublishFeedback === null) {
        return 'Please indicate permission to publish feedback'
      }
    }

    // References validation (always mandatory)
    if (!formData.ref1Name || !formData.ref1Mobile || !formData.ref2Name || !formData.ref2Mobile) {
      return 'Please provide both references with names and mobile numbers'
    }

    // Reference mobile validation
    if (!mobileRegex.test(formData.ref1Mobile.replace(/\s/g, '')) || 
        !mobileRegex.test(formData.ref2Mobile.replace(/\s/g, ''))) {
      return 'Please enter valid mobile numbers for both references'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate form
      const validationError = validateForm()
      if (validationError) {
        setError(validationError)
        setIsSubmitting(false)
        return
      }

      console.log('Submitting application form:', formData)

      // Prepare data for database
      const applicationData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        age: formData.age ? parseInt(formData.age) : null,
        occupation: formData.occupation,
        organization: formData.organization || null,
        city: formData.city || null,
        interest_areas: formData.interestAreas,
        timeline: formData.timeline,
        needs_certificate: formData.needsCertificate,
        webinar_attended: formData.webinarAttended,
        positive_feedback: formData.webinarAttended ? (formData.positiveFeedback || null) : null,
        negative_feedback: formData.webinarAttended ? (formData.negativeFeedback || null) : null,
        rating: formData.webinarAttended ? formData.rating : 0,
        recommend: formData.webinarAttended ? formData.recommend : false,
        permission_publish_feedback: formData.webinarAttended ? formData.permissionPublishFeedback : false,
        ref1_name: formData.ref1Name,
        ref1_mobile: formData.ref1Mobile,
        ref2_name: formData.ref2Name,
        ref2_mobile: formData.ref2Mobile,
        declaration_text: 'I confirm that the information provided is true to the best of my knowledge and I take responsibility for its accuracy. I provide consent to be contacted in future for AI related events, engagements, news, courses, and offers.',
        declaration_timestamp: new Date().toISOString()
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('lead_gen_responses')
        .insert([applicationData])
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        setError(`Database error: ${error.message}. Please try again or contact support.`)
        setIsSubmitting(false)
        return
      }

      console.log('Application submitted successfully:', data)
      setShowSuccess(true)

    } catch (error) {
      console.error('Application submission error:', error)
      setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`)
      setIsSubmitting(false)
    }
  }

  const getStepProgress = () => {
    const totalSteps = 4
    return (currentStep / totalSteps) * 100
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Animation */}
          <div className="text-center mb-12">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce">
                <Sparkles className="w-4 h-4 text-white m-2" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              Application Submitted!
            </h1>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto mb-4 font-light">
              Welcome to the AI Revolution
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Thanks, we have received your responses. You are now part of our AI community. 
              Do a sign-up and start accessing premium resources!
            </p>
          </div>

          {/* Success Actions - Enhanced */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Access E-Library Now
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Explore thousands of AI resources, research papers, and industry-specific content curated by experts
              </p>
              <Link
                to="/library"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                <span>Visit Library</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="group bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                Enroll in Certification
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Start your 4-month AI certification journey and become an AI professional with industry recognition
              </p>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Rocket className="w-5 h-5" />
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="group bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                Free Sign-up
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Join our community with referral earning opportunities and exclusive content access
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-xl font-bold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Users className="w-5 h-5" />
                <span>Sign Up Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Benefits Reminder - Enhanced */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-10 text-white text-center overflow-hidden shadow-2xl">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-bold text-lg shadow-lg mb-6">
                <Sparkles className="w-6 h-6 mr-2" />
                FREE COMMUNITY BENEFITS
              </div>
              
              <h3 className="text-3xl font-bold mb-8">🎁 What You Get with Free Sign-up</h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl mb-4">💰</div>
                  <h4 className="text-xl font-bold mb-3">Referral Earnings</h4>
                  <p className="text-white/90 leading-relaxed">Earn 10% commission on every successful referral</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl mb-4">📚</div>
                  <h4 className="text-xl font-bold mb-3">Library Access</h4>
                  <p className="text-white/90 leading-relaxed">Free access to industry-specific AI resources</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-4xl mb-4">📧</div>
                  <h4 className="text-xl font-bold mb-3">Regular Updates</h4>
                  <p className="text-white/90 leading-relaxed">Stay updated with latest AI trends and opportunities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-16">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-semibold text-lg transition-colors"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentModal 
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          defaultCourse="4 Months AI Certification For Professionals"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section - Enhanced */}
      <section className="relative py-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* Premium Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
              <Brain className="w-6 h-6 mr-3" />
              AI CERTIFICATION APPLICATION
              <Sparkles className="w-6 h-6 ml-3" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Become a Certified
              </span>
              <span className="block bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                AI Professional
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-5xl mx-auto mb-8 leading-relaxed font-light">
              Submit your application to unlock premium AI resources and e-library access, connect with a thriving AI learning community, 
              and stay future-ready with AI certifications, masterclasses, advanced AI tools, AI development, career pathways, and startup opportunities.
            </p>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                <div className="text-3xl mb-3">🎓</div>
                <div className="text-lg font-bold text-gray-900">Free Access</div>
                <div className="text-sm text-gray-600">Premium Resources</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                <div className="text-3xl mb-3">🤝</div>
                <div className="text-lg font-bold text-gray-900">Community</div>
                <div className="text-sm text-gray-600">AI Professionals</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                <div className="text-3xl mb-3">🚀</div>
                <div className="text-lg font-bold text-gray-900">Career Growth</div>
                <div className="text-sm text-gray-600">AI Opportunities</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                <div className="text-3xl mb-3">💰</div>
                <div className="text-lg font-bold text-gray-900">Earn Money</div>
                <div className="text-sm text-gray-600">Referral Program</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form - Completely Redesigned */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-gray-900">Application Progress</span>
                <span className="text-sm font-medium text-gray-600">Complete all sections</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getStepProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main Form Container */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">AI Certification Application</h2>
              <p className="text-blue-100 text-lg">Join thousands of professionals transforming their careers with AI</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Certificate Requirement - Enhanced */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Certificate Requirement</h3>
                </div>
                <div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                  <input
                    type="checkbox"
                    id="needsCertificate"
                    name="needsCertificate"
                    checked={formData.needsCertificate}
                    onChange={handleInputChange}
                    className="h-6 w-6 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded-lg"
                  />
                  <label htmlFor="needsCertificate" className="text-lg font-medium text-gray-800 cursor-pointer">
                    Do you need a certificate at the end of the course?
                  </label>
                </div>
              </div>

              {/* Personal Information - Enhanced */}
              <div className="space-y-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                  <div className="ml-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Required
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-3">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-gray-50 focus:bg-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-3">
                      Email Address *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-gray-50 focus:bg-white"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="mobile" className="block text-sm font-bold text-gray-800 mb-3">
                      Mobile Number *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-gray-50 focus:bg-white"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="age" className="block text-sm font-bold text-gray-800 mb-3">
                      Age
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="16"
                        max="100"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-gray-50 focus:bg-white"
                        placeholder="Your age"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="occupation" className="block text-sm font-bold text-gray-800 mb-3">
                      Current Occupation *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="occupation"
                        name="occupation"
                        type="text"
                        required
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-gray-50 focus:bg-white"
                        placeholder="Your job title"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="organization" className="block text-sm font-bold text-gray-800 mb-3">
                      Organization / Company
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="organization"
                        name="organization"
                        type="text"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-gray-50 focus:bg-white"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-bold text-gray-800 mb-3">
                      City / Location
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-gray-50 focus:bg-white"
                        placeholder="Your city"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interest & Timeline - Enhanced */}
              <div className="space-y-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Interest & Timeline</h3>
                  <div className="ml-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Required
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-6">
                      Interest Areas * (select at least one)
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {interestOptions.map((option, index) => (
                        <div key={index} className="group">
                          <label className="flex items-center space-x-4 p-6 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all duration-300">
                            <input
                              type="checkbox"
                              id={`interest_${option}`}
                              name={`interest_${option}`}
                              checked={formData.interestAreas.includes(option)}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg"
                            />
                            <span className="text-gray-800 font-medium group-hover:text-blue-700 transition-colors">
                              {option}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="timeline" className="block text-sm font-bold text-gray-800">
                      Timeline to apply AI in your work *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <select
                        id="timeline"
                        name="timeline"
                        required
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-gray-50 focus:bg-white"
                      >
                        <option value="">Select your timeline</option>
                        {timelineOptions.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Webinar Attendance - New Section */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Webinar/Masterclass Experience</h3>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="webinarAttended"
                      name="webinarAttended"
                      checked={formData.webinarAttended}
                      onChange={handleInputChange}
                      className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-lg"
                    />
                    <label htmlFor="webinarAttended" className="text-lg font-medium text-gray-800 cursor-pointer">
                      Have you attended the webinar or the masterclass?
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 ml-10">
                    Check this box if you've participated in any of our webinars or masterclasses
                  </p>
                </div>
              </div>

              {/* Feedback & Rating - Conditional */}
              {formData.webinarAttended && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Feedback & Rating</h3>
                    <div className="ml-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      Optional
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label htmlFor="positiveFeedback" className="block text-sm font-bold text-gray-800">
                          Positive Feedback
                        </label>
                        <div className="relative">
                          <textarea
                            id="positiveFeedback"
                            name="positiveFeedback"
                            rows={5}
                            value={formData.positiveFeedback}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-300 text-lg bg-white resize-none"
                            placeholder="What did you like? — course/webinar content, speaker, pace, examples..."
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="negativeFeedback" className="block text-sm font-bold text-gray-800">
                          Areas for Improvement
                        </label>
                        <div className="relative">
                          <textarea
                            id="negativeFeedback"
                            name="negativeFeedback"
                            rows={5}
                            value={formData.negativeFeedback}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-300 text-lg bg-white resize-none"
                            placeholder="What could be improved?"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-gray-800">
                        Overall Rating
                      </label>
                      <div className="flex items-center justify-center space-x-3 bg-white p-6 rounded-xl border border-yellow-200">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => handleRatingClick(rating)}
                            className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                              formData.rating >= rating
                                ? 'text-yellow-500 bg-yellow-50 shadow-lg'
                                : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
                            }`}
                          >
                            <Star className="w-8 h-8 fill-current" />
                          </button>
                        ))}
                        <div className="ml-6 text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {formData.rating > 0 ? `${formData.rating}/5` : '0/5'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formData.rating > 0 ? 'Thank you!' : 'Click to rate'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-800">
                          Would you recommend this to others?
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-4 p-4 bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 rounded-xl cursor-pointer transition-all duration-300">
                            <input
                              type="radio"
                              id="recommend_yes"
                              name="recommend"
                              value="yes"
                              checked={formData.recommend === true}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="text-gray-800 font-medium">Yes, absolutely!</span>
                          </label>
                          <label className="flex items-center space-x-4 p-4 bg-white hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-xl cursor-pointer transition-all duration-300">
                            <input
                              type="radio"
                              id="recommend_no"
                              name="recommend"
                              value="no"
                              checked={formData.recommend === false}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
                            />
                            <span className="text-gray-800 font-medium">No, not really</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-800">
                          May we publish your positive feedback on our website or media platforms?
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-4 p-4 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all duration-300">
                            <input
                              type="radio"
                              id="publish_yes"
                              name="permissionPublishFeedback"
                              value="yes"
                              checked={formData.permissionPublishFeedback === true}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="text-gray-800 font-medium">Yes, you may publish</span>
                          </label>
                          <label className="flex items-center space-x-4 p-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer transition-all duration-300">
                            <input
                              type="radio"
                              id="publish_no"
                              name="permissionPublishFeedback"
                              value="no"
                              checked={formData.permissionPublishFeedback === false}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-gray-600 focus:ring-gray-500 border-gray-300"
                            />
                            <span className="text-gray-800 font-medium">No, keep it private</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* References - Enhanced */}
              <div className="space-y-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">References</h3>
                  <div className="ml-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Required
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Reference 1</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="ref1Name" className="block text-sm font-bold text-gray-800">
                          Name *
                        </label>
                        <input
                          id="ref1Name"
                          name="ref1Name"
                          type="text"
                          required
                          value={formData.ref1Name}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg font-medium bg-white"
                          placeholder="Reference 1 name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="ref1Mobile" className="block text-sm font-bold text-gray-800">
                          Mobile *
                        </label>
                        <input
                          id="ref1Mobile"
                          name="ref1Mobile"
                          type="tel"
                          required
                          value={formData.ref1Mobile}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg font-medium bg-white"
                          placeholder="Reference 1 mobile"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Reference 2</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="ref2Name" className="block text-sm font-bold text-gray-800">
                          Name *
                        </label>
                        <input
                          id="ref2Name"
                          name="ref2Name"
                          type="text"
                          required
                          value={formData.ref2Name}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-white"
                          placeholder="Reference 2 name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="ref2Mobile" className="block text-sm font-bold text-gray-800">
                          Mobile *
                        </label>
                        <input
                          id="ref2Mobile"
                          name="ref2Mobile"
                          type="tel"
                          required
                          value={formData.ref2Mobile}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium bg-white"
                          placeholder="Reference 2 mobile"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">Invite Your References</h4>
                      <p className="text-blue-800 leading-relaxed">
                        You may ask them to do a sign-up at AIwithArijit.com to begin their AI learning journey for free, 
                        or they can enroll for any of our courses of their choice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Declaration & Consent - Enhanced */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Final Declaration & Consent</h3>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Declaration Statement</h4>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        I confirm that the information provided is true to the best of my knowledge and I take responsibility for its accuracy. 
                        I provide consent to be contacted in future for AI related events, engagements, news, courses, and offers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button - Enhanced */}
              <div className="text-center pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-16 py-6 rounded-2xl font-bold text-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:transform-none"
                >
                  <div className="flex items-center justify-center space-x-3">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-7 w-7 border-3 border-white border-t-transparent"></div>
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Submit Application</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                  
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <p className="text-gray-500 mt-6 text-lg">
                  By submitting this form, you agree to our terms and privacy policy
                </p>
              </div>
            </form>
          </div>

          {/* Back to Home - Enhanced */}
          <div className="text-center mt-16">
            <Link
              to="/"
              className="inline-flex items-center space-x-3 text-blue-600 hover:text-blue-500 font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentModal 
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          defaultCourse="4 Months AI Certification For Professionals"
        />
      </section>
    </div>
  )
}

export default AICertificateApplication