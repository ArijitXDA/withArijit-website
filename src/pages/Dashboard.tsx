import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from '../components/PaymentModal'
import PaymentHistory from '../components/PaymentHistory'
import { supabase } from '../lib/supabase'
import { 
  User, 
  BookOpen, 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  CreditCard, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Download, 
  ExternalLink,
  Users,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Gift,
  Target,
  TrendingUp,
  Play,
  Star,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Share,
  Rocket
} from 'lucide-react'

interface SessionRecord {
  session_id: number
  batch_id: string
  session_date: string
  session_start_time: string
  session_link?: string
  study_material_link?: string
  session_title?: string
  session_description?: string
}

interface StudentRecord {
  id: string
  student_name: string
  email: string
  current_course_name: string
  batch_id?: string
  enrollment_date: string
  total_amount_paid: number
}

interface BatchSessionLink {
  id: string
  batch_id: string
  course_name: string
  teams_meeting_link: string
  meeting_id?: string
  passcode?: string
  recurring_schedule?: string
  is_active: boolean
}

interface PaymentRecord {
  id: string
  user_id: string
  name: string
  email: string
  course: string
  amount: number
  currency: string
  payment_status: string
  payment_date?: string
  payment_time?: string
  created_at: string
  razorpay_payment_id?: string
}

interface UserProfile {
  user_id: string
  name: string
  email: string
  age: number
  occupation: string
  created_at: string
}

interface ReferralData {
  referredStudents: PaymentRecord[]
  totalReferralIncome: number
}

interface Certificate {
  id: string
  user_email: string
  certificate_name: string
  date_of_issuing: string
  certificate_image_link: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [renewalPaymentModalOpen, setRenewalPaymentModalOpen] = useState(false)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [sessions, setSessions] = useState<SessionRecord[]>([])
  const [studentRecord, setStudentRecord] = useState<StudentRecord | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [batchSessionLink, setBatchSessionLink] = useState<BatchSessionLink | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([])
  const [referralData, setReferralData] = useState<ReferralData>({ referredStudents: [], totalReferralIncome: 0 })
  const [loading, setLoading] = useState(true)
  const [loadingCertificates, setLoadingCertificates] = useState(true)
  const [error, setError] = useState('')
  const [certificateViewerOpen, setCertificateViewerOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.email) {
        setLoading(false)
        return
      }

      try {
        console.log('Fetching dashboard data for user:', user.email)

        // Fetch user profile from users table
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .maybeSingle()

        if (profileError) {
          console.error('Error fetching user profile:', profileError)
        } else {
          console.log('User profile found:', profileData)
          if (profileData) {
            setUserProfile(profileData)
          } else {
            // User profile doesn't exist, create it as fallback
            console.log('User profile not found, creating fallback profile')
            try {
              const { data: newProfile, error: insertError } = await supabase
                .from('users')
                .insert([{
                  user_id: user.id,
                  email: user.email,
                  name: user.user_metadata?.name || user.email.split('@')[0],
                  mobile_no: user.user_metadata?.mobile_no || '',
                  age: user.user_metadata?.age || 25,
                  occupation: user.user_metadata?.occupation || 'Professional'
                }])
                .select()
                .single()
              
              if (insertError) {
                console.error('Error creating fallback profile:', insertError)
                setError('Failed to create user profile')
              } else {
                setUserProfile(newProfile)
              }
            } catch (fallbackError) {
              console.error('Error in fallback profile creation:', fallbackError)
              setError('Failed to create user profile')
            }
          }
        }

        // Fetch student record
        const { data: studentData, error: studentError } = await supabase
          .from('student_master_table')
          .select('*')
          .eq('email', user.email)
          .maybeSingle()

        if (studentError) {
          console.error('Error fetching student record:', studentError)
          if (studentError.code !== 'PGRST116') { // Not found error
            setError('Failed to load student information')
          }
        } else {
          console.log('Student record found:', studentData)
          setStudentRecord(studentData)

          // If student has a batch_id, fetch batch session link
          if (studentData?.batch_id) {
            const { data: linkData, error: linkError } = await supabase
              .from('batch_session_links')
              .select('*')
              .eq('batch_id', studentData.batch_id)
              .eq('is_active', true)
              .single()

            if (linkError) {
              console.error('Error fetching batch session link:', linkError)
            } else {
              console.log('Batch session link found:', linkData)
              setBatchSessionLink(linkData)
            }

            // Fetch sessions for the student's batch from session_master_table
            console.log('Fetching sessions for batch:', studentData.batch_id)
            const { data: sessionsData, error: sessionsError } = await supabase
              .from('session_master_table')
              .select('session_id, batch_id, session_date, session_start_time, session_link, study_material_link, session_title, session_description, created_at, updated_at')
              .eq('batch_id', studentData.batch_id)
              .order('session_date', { ascending: true })

            if (sessionsError) {
              console.error('Error fetching sessions:', sessionsError)
              console.error('Session error details:', sessionsError)
            } else {
              console.log('Sessions found for batch:', studentData.batch_id)
              console.log('Number of sessions:', sessionsData?.length || 0)
              console.log('Session data sample:', sessionsData?.[0])
              setSessions(sessionsData || [])
            }
          }
        }

        // Fetch payment history
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('email', user.email)
          .eq('payment_status', 'success')
          .order('created_at', { ascending: false })

        if (paymentsError) {
          console.error('Error fetching payments:', paymentsError)
        } else {
          console.log('Payment history found:', paymentsData)
          setPaymentHistory(paymentsData || [])
        }

        // Fetch referral data
        const { data: referralPayments, error: referralError } = await supabase
          .from('payments')
          .select('*')
          .eq('referred_by_email', user.email)
          .eq('payment_status', 'success')

        if (referralError) {
          console.error('Error fetching referral data:', referralError)
        } else {
          console.log('Referral payments found:', referralPayments)
          const totalIncome = (referralPayments || []).reduce((sum, payment) => {
            return sum + (payment.amount * 0.10) // 10% referral commission
          }, 0)
          
          setReferralData({
            referredStudents: referralPayments || [],
            totalReferralIncome: totalIncome
          })
        }

        // Fetch user certificates
        const { data: certificatesData, error: certificatesError } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_email', user.email)
          .eq('is_active', true)
          .order('date_of_issuing', { ascending: false })

        if (certificatesError) {
          console.error('Error fetching certificates:', certificatesError)
        } else {
          setCertificates(certificatesData || [])
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
        setLoadingCertificates(false)
      }
    }

    fetchDashboardData()
  }, [user?.email])

  const calculateNextPaymentDate = () => {
    // Filter payments above ₹2000 or $100 (significant course payments)
    const significantPayments = paymentHistory.filter(payment => {
      const amount = payment.amount || 0
      const currency = payment.currency || 'INR'
      
      if (currency === 'USD') {
        return amount >= 100
      } else {
        return amount >= 2000
      }
    })
    
    if (significantPayments.length === 0) return null
    
    const lastPayment = significantPayments[0] // Most recent significant payment
    const lastPaymentDate = new Date(lastPayment.payment_date || lastPayment.created_at)
    const nextPaymentDate = new Date(lastPaymentDate)
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30) // Add 30 days
    
    return nextPaymentDate
  }

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    setCertificateViewerOpen(true)
  }

  const handleDownloadCertificate = async (certificate: Certificate) => {
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = certificate.certificate_image_link
      
      // Set download attribute with a proper filename
      const fileExtension = certificate.certificate_image_link.includes('.jpg') ? '.jpg' :
                           certificate.certificate_image_link.includes('.jpeg') ? '.jpeg' :
                           certificate.certificate_image_link.includes('.png') ? '.png' :
                           certificate.certificate_image_link.includes('.pdf') ? '.pdf' :
                           '.jpg' // default extension
      
      const fileName = `${certificate.certificate_name.replace(/[^a-zA-Z0-9]/g, '_')}${fileExtension}`
      link.download = fileName
      
      // For SharePoint/OneDrive links, we need to open in new tab since download attribute may not work
      if (certificate.certificate_image_link.includes('sharepoint.com') || 
          certificate.certificate_image_link.includes('1drv.ms') || 
          certificate.certificate_image_link.includes('onedrive.live.com')) {
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
      }
      
      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('Certificate download initiated:', fileName)
    } catch (error) {
      console.error('Error downloading certificate:', error)
      // Fallback to opening in new tab
      window.open(certificate.certificate_image_link, '_blank')
    }
  }

  const calculateCourseFees = () => {
    if (!studentRecord) return { fullFee: 0, totalPaid: 0, remaining: 0 }
    
    // Determine full course fee based on course type
    let fullFee = 0
    const courseName = studentRecord.current_course_name
    
    if (courseName.includes('Quantum Computing')) {
      fullFee = 47996 // 4 months × ₹11999
    } else {
      fullFee = 11996 // 4 months × ₹2999
    }
    
    const totalPaid = studentRecord.total_amount_paid || 0
    const remaining = Math.max(0, fullFee - totalPaid)
    
    return { fullFee, totalPaid, remaining }
  }

  const handleJoinMeeting = () => {
    if (batchSessionLink?.teams_meeting_link) {
      window.open(batchSessionLink.teams_meeting_link, '_blank')
    }
  }

  const handleShareWhatsApp = () => {
    const message = `Transform your career with AI! 

Join me in learning Agentic AI & Vibe Coding with AI expert Arijit Chowdhury.

✅ Become AI-skilled in 4 months
✅ Industry-recognized certification  
✅ 10,000+ students trained
✅ Real-world live projects
✅ Fee 2789/- per month

Use my email ${user?.email} as referral code to get 7% discount!

Enroll now: https://AIwithArijit.com

#AI #AgenticAI #VibeCoding #CareerGrowth #AIWithArijit`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5) // Show HH:MM format
  }

  const nextPaymentDate = calculateNextPaymentDate()
  const { fullFee, totalPaid, remaining } = calculateCourseFees()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 font-medium">Loading your dashboard...</p>
          <p className="text-gray-500 mt-2">Please wait while we fetch your learning data</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-8">You need to be signed in to access your dashboard.</p>
          <Link
            to="/signin"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* (A) Top Section - Welcome & Profile */}
          <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl border border-gray-200 p-4 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
            
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Welcome Section */}
              <div className="lg:col-span-2 relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                      Welcome, {userProfile?.name || studentRecord?.student_name || user.user_metadata?.name || 'Student'}! 🎉
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mt-2 font-medium">Your AI learning journey continues here</p>
                  </div>
                </div>
                
                {/* (B) Next Payment Date Section - Only for enrolled students */}
                {nextPaymentDate && (
                  <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-2xl p-4 md:p-6 shadow-2xl border border-orange-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20"></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                          <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="relative z-10">
                          <div className="text-sm font-medium opacity-90">Your Upcoming Payment Date</div>
                          <div className="text-2xl md:text-3xl font-bold">{formatDate(nextPaymentDate.toISOString())}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setRenewalPaymentModalOpen(true)}
                        className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 border border-white/30"
                      >
                        <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Pay Your Fee</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* (C) Profile Section */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 md:p-6 relative z-10">
                <div className="text-center mb-6 md:mb-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    Profile Information
                  </h3>
                  <p className="text-gray-500 mt-1">Your learning identity</p>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  {/* Highlighted Name */}
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 md:p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                        <span className="text-blue-700 font-bold text-base md:text-lg">Student Name</span>
                      </div>
                      <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {userProfile?.name || studentRecord?.student_name || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Highlighted Batch ID */}
                  <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-2xl p-4 md:p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Users className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                        <span className="text-green-700 font-bold text-base md:text-lg">Batch ID</span>
                      </div>
                      {studentRecord?.batch_id ? (
                        <div className="text-xl md:text-2xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          {studentRecord.batch_id}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-orange-600 text-sm font-medium">Not enrolled yet</p>
                          <div className="bg-black rounded-lg border border-red-500/30 p-3 md:p-4">
                            <p className="text-white text-xs md:text-sm font-medium mb-2">
                              🚀 Enroll to become a certified AI skilled professional in 4 months
                            </p>
                            <p className="text-orange-300 text-base md:text-lg font-bold">Starting ₹2,999/-</p>
                          </div>
                          <button
                            onClick={() => setPaymentModalOpen(true)}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-200 text-sm"
                          >
                            Enroll Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Other Profile Details */}
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                      <span className="text-gray-700 font-medium text-sm md:text-base">{user.email}</span>
                    </div>
                    {userProfile?.age && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                        <span className="text-gray-700 font-medium text-sm md:text-base">Age: {userProfile.age}</span>
                      </div>
                    )}
                    {userProfile?.mobile_no && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                        <span className="text-gray-700 font-medium text-sm md:text-base">{userProfile.mobile_no}</span>
                      </div>
                    )}
                    {studentRecord?.current_course_name && (
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                        <span className="text-gray-700 font-medium text-sm md:text-base">{studentRecord.current_course_name}</span>
                      </div>
                    )}
                    {studentRecord?.enrollment_date && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                        <span className="text-gray-700 font-medium text-sm md:text-base">Enrolled: {formatDate(studentRecord.enrollment_date)}</span>
                      </div>
                    )}
                    {userProfile?.created_at && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                        <span className="text-gray-700 font-medium text-sm md:text-base">Registered: {formatDate(userProfile.created_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* (D) Premium Referral Program */}
          <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl shadow-2xl border-2 border-yellow-500/30 p-6 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
            {/* Golden decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-400/10 to-orange-400/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-lg mb-4">
                  <Gift className="w-4 h-4 md:w-6 md:h-6 mr-2" />
                  PREMIUM REFERRAL PROGRAM
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  Earn with Every Referral
                </h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                  Share your referral link and earn 10% commission on every successful enrollment
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 md:p-6 border border-yellow-500/20">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4">How It Works</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
                      <p className="text-gray-300 text-sm md:text-base">Your email ID is your referral code</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">2</div>
                      <p className="text-gray-300 text-sm md:text-base">Your referee gets instant 7% discount</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">3</div>
                      <p className="text-gray-300 text-sm md:text-base">You earn 10% commission on enrollment</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 md:p-6 border border-yellow-500/20">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4">Your Referral Stats</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                        ₹{referralData.totalReferralIncome.toFixed(2)}
                      </div>
                      <p className="text-gray-400 text-sm">Total Earnings</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl md:text-2xl font-bold text-green-400">
                        {referralData.referredStudents.length}
                      </div>
                      <p className="text-gray-400 text-sm">Successful Referrals</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-2xl p-4 md:p-6 border border-yellow-500/30 mb-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4">Your Referral Code</h3>
                <div className="bg-black/50 rounded-lg p-3 md:p-4 border border-yellow-500/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div>
                      <p className="text-gray-400 text-sm">Share this email as referral code:</p>
                      <p className="text-yellow-400 font-mono text-base md:text-lg font-bold">{user.email}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(user.email)}
                      className="bg-yellow-500 text-black px-3 md:px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-sm"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 md:px-6 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Share className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Share on WhatsApp</span>
                </button>
                <Link
                  to="/contact?referral=claim"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-4 md:px-6 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-amber-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Claim Earnings</span>
                </Link>
              </div>
            </div>
          </div>

          {/* (E) Join the Class Link - Only for enrolled students with batch */}
          {studentRecord?.batch_id && batchSessionLink && (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">Join Your Class</h3>
                    <p className="text-gray-600">{batchSessionLink.course_name}</p>
                    {batchSessionLink.recurring_schedule && (
                      <p className="text-sm text-gray-500">{batchSessionLink.recurring_schedule}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleJoinMeeting}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Video className="w-5 h-5" />
                  <span>Join MS Teams</span>
                </button>
              </div>
            </div>
          )}

          {/* (F) Your Sessions - Only for enrolled students */}
          {studentRecord?.batch_id && (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">Your Sessions</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span>Total sessions: <strong>25</strong></span>
                    <span>Updated sessions: <strong>{sessions.length}</strong></span>
                    <span>Remaining sessions: <strong>{Math.max(0, 25 - sessions.length)}</strong></span>
                  </div>
                </div>
              </div>

              {sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.session_id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 md:p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                            <h4 className="font-bold text-gray-900 text-lg">
                              Session #{session.session_id}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(session.session_date)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatTime(session.session_start_time)}</span>
                              </div>
                            </div>
                          </div>
                          {session.session_title && (
                            <p className="font-semibold text-gray-800 mb-2">{session.session_title}</p>
                          )}
                          {session.session_description && (
                            <p className="text-gray-600 text-sm">{session.session_description}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          {session.session_link && (
                            <a
                              href={session.session_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                            >
                              <Play className="w-4 h-4" />
                              <span>Recorded Session</span>
                            </a>
                          )}
                          {session.study_material_link && (
                            <a
                              href={session.study_material_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Study Material</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No sessions available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Sessions will appear here once they are scheduled</p>
                </div>
              )}
            </div>
          )}

          {/* (G) Course Investment/Progress - Only for enrolled students */}
          {studentRecord && (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">Course Investment & Progress</h3>
                  <p className="text-gray-600">Track your course payment progress</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-2xl border border-blue-200 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">₹{fullFee.toLocaleString()}</div>
                  <p className="text-gray-700 font-medium">Full Course Fee</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-2xl border border-green-200 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">₹{totalPaid.toLocaleString()}</div>
                  <p className="text-gray-700 font-medium">Amount Paid</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-6 rounded-2xl border border-orange-200 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-2">₹{remaining.toLocaleString()}</div>
                  <p className="text-gray-700 font-medium">Remaining Amount</p>
                </div>
              </div>

              {remaining > 0 && (
                <div className="text-center">
                  <button
                    onClick={() => setRenewalPaymentModalOpen(true)}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Pay Remaining Amount</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* (H) Certificates Section */}
          <div className="bg-gradient-to-br from-red-900 via-black to-gray-900 rounded-3xl shadow-2xl border-2 border-red-500/30 p-6 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
            {/* Red decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/10 to-red-400/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-lg mb-4">
                  <Award className="w-4 h-4 md:w-6 md:h-6 mr-2" />
                  CERTIFICATES
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  LinkedIn & Resume Ready Certificates
                </h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto">
                  Your certificates are professionally designed and ready to showcase on LinkedIn and your resume. 
                  For LinkedIn, Select "Star Analytix" as the issuing educational institute. 
                  Add your certificates to LinkedIn and resume today and become an AI skilled professional.
                </p>
              </div>

              {loadingCertificates ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              ) : certificates.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 md:p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">{certificate.certificate_name}</h4>
                        <p className="text-gray-400 text-sm">Issued: {formatDate(certificate.date_of_issuing)}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleViewCertificate(certificate)}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadCertificate(certificate)}
                          className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                  <h4 className="text-2xl font-bold text-white mb-4">No certificates yet</h4>
                  <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                    Enroll now and become an AI certified professional in just 4 months
                  </p>
                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <Rocket className="w-5 h-5" />
                    <span>Enroll Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* (I) Payment History - Compact */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Payment History</h3>
                <p className="text-gray-600">Your successful course payments</p>
              </div>
            </div>

            <PaymentHistory userEmail={user.email} />
          </div>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {certificateViewerOpen && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{selectedCertificate.certificate_name}</h3>
              <button
                onClick={() => setCertificateViewerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <img 
                src={selectedCertificate.certificate_image_link} 
                alt={selectedCertificate.certificate_name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleDownloadCertificate(selectedCertificate)}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Certificate</span>
                </button>
                <a
                  href={selectedCertificate.certificate_image_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Open in New Tab</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modals */}
      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultCourse=""
      />

      <PaymentModal 
        isOpen={renewalPaymentModalOpen}
        onClose={() => setRenewalPaymentModalOpen(false)}
        defaultCourse=""
        isRenewalPayment={true}
      />
    </>
  )
}

export default Dashboard