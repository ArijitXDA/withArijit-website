import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  GraduationCap,
  Clock,
  IndianRupee,
  ChevronRight,
  Filter,
  Users,
  Briefcase,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { useCourses } from '../hooks/useCourses'
import { useGeolocation } from '../hooks/useGeolocation'
import { formatCurrency, formatDualCurrency, formatMonthlyPrice } from '../lib/currency'
import { NAVIGATION_CATEGORIES } from '../lib/constants'
import type { NavigationCategory, Course } from '../types/course'

const CATEGORY_ICONS: Record<NavigationCategory, React.ReactNode> = {
  techies: <Sparkles className="w-5 h-5" />,
  non_techies: <Briefcase className="w-5 h-5" />,
  students: <BookOpen className="w-5 h-5" />,
  job_seekers: <Users className="w-5 h-5" />,
}

const CATEGORY_COLORS: Record<NavigationCategory, { bg: string; border: string; text: string; badge: string }> = {
  techies: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
  non_techies: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },
  students: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
  },
  job_seekers: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-700',
  },
}

const categoryOrder: NavigationCategory[] = ['techies', 'non_techies', 'students', 'job_seekers']

export default function CoursesV2() {
  const { courses, loading, error } = useCourses()
  const { currency } = useGeolocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<NavigationCategory | 'all'>('all')

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    let result = courses

    // Category filter
    if (activeFilter !== 'all') {
      result = result.filter((c) => c.navigation_category === activeFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.course_name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.topics?.some((t) => t.toLowerCase().includes(q)) ||
          c.course_category?.toLowerCase().includes(q)
      )
    }

    return result
  }, [courses, activeFilter, searchQuery])

  // Group filtered courses by category
  const groupedCourses = useMemo(() => {
    const groups: Partial<Record<NavigationCategory, Course[]>> = {}
    for (const cat of categoryOrder) {
      const catCourses = filteredCourses.filter((c) => c.navigation_category === cat)
      if (catCourses.length > 0) {
        groups[cat] = catCourses
      }
    }
    // Also include courses without a category
    const uncategorized = filteredCourses.filter((c) => !c.navigation_category)
    if (uncategorized.length > 0) {
      // Show them under techies as default
      groups.techies = [...(groups.techies || []), ...uncategorized]
    }
    return groups
  }, [filteredCourses])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-10 w-64 bg-white/20 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-white/20 rounded-lg animate-pulse mx-auto" />
          </div>
        </div>
        {/* Cards Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                  <div className="h-6 bg-gray-100 rounded-full w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Courses</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 relative overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-3 h-3 bg-white rounded-full" />
          <div className="absolute top-20 right-16 w-2 h-2 bg-white rounded-full" />
          <div className="absolute bottom-8 left-1/4 w-4 h-4 bg-white rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI & Tech Courses
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Learn from industry experts. Master AI, Machine Learning, and cutting-edge tech with hands-on projects.
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses by name, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
            />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div>
              <div className="text-3xl font-bold">{courses.length}</div>
              <div className="text-blue-200 text-sm">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4</div>
              <div className="text-blue-200 text-sm">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-blue-200 text-sm">Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-xl shadow-md p-3 flex flex-wrap gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-400 ml-2" />
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Courses ({courses.length})
          </button>
          {categoryOrder.map((cat) => {
            const catInfo = NAVIGATION_CATEGORIES[cat]
            const count = courses.filter((c) => c.navigation_category === cat).length
            if (count === 0) return null

            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === cat
                    ? `${CATEGORY_COLORS[cat].badge} shadow-md`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {CATEGORY_ICONS[cat]}
                <span>{catInfo.label}</span>
                <span className="text-xs opacity-70">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.keys(groupedCourses).length === 0 ? (
          <div className="text-center py-16">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-400">
              {searchQuery ? `No results for "${searchQuery}"` : 'No courses available in this category.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {categoryOrder.map((cat) => {
              const catCourses = groupedCourses[cat]
              if (!catCourses || catCourses.length === 0) return null

              const catInfo = NAVIGATION_CATEGORIES[cat]
              const colors = CATEGORY_COLORS[cat]

              return (
                <section key={cat}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                      {CATEGORY_ICONS[cat]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{catInfo.label}</h2>
                      <p className="text-sm text-gray-500">{catInfo.description}</p>
                    </div>
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                      {catCourses.length} {catCourses.length === 1 ? 'course' : 'courses'}
                    </span>
                  </div>

                  {/* Course Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catCourses.map((course) => (
                      <CourseCard key={course.id} course={course} currency={currency} colors={colors} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// =====================================================
// Course Card Component
// =====================================================

interface CourseCardProps {
  course: Course
  currency: string
  colors: { bg: string; border: string; text: string; badge: string }
}

function CourseCard({ course, currency, colors }: CourseCardProps) {
  const monthlyPriceDisplay =
    currency === 'INR'
      ? formatMonthlyPrice(course.monthly_price, 'INR')
      : formatDualCurrency(
          course.monthly_price,
          course.monthly_price * 0.012, // Approximate for display; exact from pricing_rules
          currency as any
        ) + '/mo'

  return (
    <Link
      to={`/courses/${course.course_code}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Card Header */}
      <div className={`p-5 pb-3 border-b ${colors.border} ${colors.bg}`}>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {course.course_name}
        </h3>
        {course.course_category && (
          <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
            {course.course_category}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Description */}
        {course.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>
        )}

        {/* Topics Tags */}
        {course.topics && course.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {course.topics.slice(0, 4).map((topic, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium"
              >
                {topic}
              </span>
            ))}
            {course.topics.length > 4 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-md text-[11px]">
                +{course.topics.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & Duration */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{course.duration_months} months</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-blue-600">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>{formatCurrency(course.monthly_price, 'INR')}/mo</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {course.upfront_discount_percent > 0 && `${course.upfront_discount_percent}% off on upfront`}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
            View Details
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}
