import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  CheckCircle,
  Star,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  CreditCard,
  Zap,
  Shield,
  Calendar,
} from 'lucide-react'
import { useCourses } from '../hooks/useCourses'
import { useGeolocation } from '../hooks/useGeolocation'
import { useAuth } from '../contexts/AuthContext'
import { formatCurrency, formatDualCurrency } from '../lib/currency'
import { NAVIGATION_CATEGORIES, PAYMENT_CONFIG } from '../lib/constants'
import type { Course, CurriculumItem, NavigationCategory } from '../types/course'
import PaymentModal from '../components/PaymentModal'

export default function CourseDetailV2() {
  const { courseCode } = useParams<{ courseCode: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { courses, loading, error, getCourseByCode } = useCourses()
  const { currency } = useGeolocation()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null)

  const course = courseCode ? getCourseByCode(courseCode) : undefined

  // Redirect if course not found after loading
  useEffect(() => {
    if (!loading && !course && courses.length > 0) {
      // Course not found - might be a legacy URL
      // Let legacy routes handle it or show 404
    }
  }, [loading, course, courses])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-24 mb-8" />
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-6 bg-gray-100 rounded w-1/2 mb-8" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="h-32 bg-gray-200 rounded-xl" />
                <div className="h-48 bg-gray-200 rounded-xl" />
              </div>
              <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {error ? 'Error Loading Course' : 'Course Not Found'}
          </h2>
          <p className="text-gray-500 mb-4">
            {error || `We couldn't find the course "${courseCode}".`}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Courses
          </Link>
        </div>
      </div>
    )
  }

  const catInfo = course.navigation_category
    ? NAVIGATION_CATEGORIES[course.navigation_category]
    : null

  const upfrontPrice = course.upfront_final_price || course.full_course_price
  const savings = course.full_course_price - upfrontPrice

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Breadcrumb */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <Link to="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            {catInfo && (
              <>
                <span>/</span>
                <span>{catInfo.label}</span>
              </>
            )}
            <span>/</span>
            <span className="text-white">{course.course_name}</span>
          </nav>

          {/* Course Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.course_name}</h1>

          {/* Category Badge + Duration */}
          <div className="flex flex-wrap items-center gap-3">
            {catInfo && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {catInfo.label}
              </span>
            )}
            <span className="flex items-center gap-1 text-blue-200">
              <Clock className="w-4 h-4" />
              {course.duration_months} months
            </span>
            {course.target_audience && (
              <span className="flex items-center gap-1 text-blue-200">
                <Users className="w-4 h-4" />
                {course.target_audience}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            {course.description && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Course</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{course.description}</p>
              </section>
            )}

            {/* Topics Covered */}
            {course.topics && course.topics.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Topics Covered</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.topics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curriculum */}
            {course.curriculum && course.curriculum.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  <BookOpen className="w-5 h-5 inline-block mr-2 text-blue-600" />
                  Course Curriculum
                </h2>
                <div className="space-y-2">
                  {course.curriculum.map((item: CurriculumItem) => (
                    <div
                      key={item.week}
                      className="border border-gray-100 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedWeek(expandedWeek === item.week ? null : item.week)
                        }
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                            {item.week}
                          </span>
                          <span className="font-semibold text-gray-900">{item.title}</span>
                        </div>
                        {expandedWeek === item.week ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {expandedWeek === item.week && (
                        <div className="px-4 py-3 bg-white">
                          {item.description && (
                            <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                          )}
                          <ul className="space-y-1.5">
                            {item.topics.map((topic, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prerequisites */}
            {course.prerequisites && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Prerequisites</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{course.prerequisites}</p>
              </section>
            )}
          </div>

          {/* Right Column - Pricing Sticky Card */}
          <div className="md:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Pricing Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
                  <div className="text-sm text-blue-200 mb-1">Monthly Price</div>
                  <div className="text-3xl font-bold">
                    {formatCurrency(course.monthly_price, 'INR')}
                    <span className="text-lg font-normal text-blue-200">/mo</span>
                  </div>
                  <div className="text-sm text-blue-200 mt-1">
                    for {course.duration_months} months
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Full Course Price */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Full Course Price</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(course.full_course_price, 'INR')}
                    </span>
                  </div>

                  {/* Upfront Discount */}
                  {course.upfront_discount_percent > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">
                          Pay Upfront & Save {course.upfront_discount_percent}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600">Upfront Price</span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-700">
                            {formatCurrency(upfrontPrice, 'INR')}
                          </span>
                          {savings > 0 && (
                            <span className="text-xs text-green-600 block">
                              Save {formatCurrency(savings, 'INR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Continued Learning */}
                  {course.continued_learning_enabled && (
                    <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
                      <span className="text-gray-500">Post-course access</span>
                      <span className="font-medium text-gray-700">
                        {formatCurrency(course.continued_learning_monthly_price, 'INR')}/mo
                      </span>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Enroll Now
                  </button>

                  {/* Trust Indicators */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-3.5 h-3.5 text-green-500" />
                      <span>Secure Razorpay payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>Start immediately after payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star className="w-3.5 h-3.5 text-yellow-500" />
                      <span>Certificate on completion</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Info */}
              {course.syllabus_url && (
                <a
                  href={course.syllabus_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 text-center text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Download Syllabus PDF
                </a>
              )}

              {/* Back to courses */}
              <Link
                to="/courses"
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal - Legacy modal for now, will be replaced by PaymentModalV2 */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultCourse={course.course_name}
      />
    </div>
  )
}
