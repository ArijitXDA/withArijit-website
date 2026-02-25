import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, ArrowRight, User, LogOut } from 'lucide-react'
import { useCourses } from '../../hooks/useCourses'
import { NAVIGATION_CATEGORIES } from '../../lib/constants'
import type { NavigationCategory, Course } from '../../types/course'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  user: { email?: string } | null
  onSignOut: () => void
}

/**
 * Mobile navigation drawer with collapsible course categories.
 * Same tree structure as CourseDropdown but optimized for touch/mobile.
 */
export default function MobileNav({ isOpen, onClose, user, onSignOut }: MobileNavProps) {
  const [expandedCategory, setExpandedCategory] = useState<NavigationCategory | null>(null)
  const [coursesExpanded, setCoursesExpanded] = useState(false)
  const location = useLocation()
  const { courses, loading } = useCourses()

  const categoryOrder: NavigationCategory[] = ['techies', 'non_techies', 'students', 'job_seekers']

  const getCoursesByCategory = (cat: NavigationCategory): Course[] => {
    return courses.filter((c) => c.navigation_category === cat)
  }

  const toggleCategory = (cat: NavigationCategory) => {
    setExpandedCategory(expandedCategory === cat ? null : cat)
  }

  const handleLinkClick = () => {
    setCoursesExpanded(false)
    setExpandedCategory(null)
    onClose()
  }

  const isActive = (path: string) => location.pathname === path
  const isCoursesActive = location.pathname.startsWith('/courses') || location.pathname.startsWith('/ai-certification')

  if (!isOpen) return null

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Build AI Projects', href: '/build-ai-projects' },
    { name: 'Find an AI Job', href: '/find-ai-job' },
    { name: "Staran's eBook Library", href: '/library' },
    { name: 'About Instructor', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <div className="md:hidden bg-white border-t border-gray-200 shadow-lg max-h-[80vh] overflow-y-auto">
      <div className="px-4 py-4 space-y-1">
        {/* Home */}
        <Link
          to="/"
          onClick={handleLinkClick}
          className={`block px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
            isActive('/')
              ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          Home
        </Link>

        {/* Courses - Expandable Section */}
        <div>
          <button
            onClick={() => setCoursesExpanded(!coursesExpanded)}
            className={`w-full flex items-center justify-between px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
              isCoursesActive
                ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <span>Courses</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${coursesExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {coursesExpanded && (
            <div className="mt-1 ml-2 space-y-1">
              {/* View All Courses */}
              <Link
                to="/courses"
                onClick={handleLinkClick}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isActive('/courses')
                    ? 'text-blue-700 bg-blue-100'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
                <span>View All Courses</span>
              </Link>

              {/* Category Sections */}
              {categoryOrder.map((cat) => {
                const catInfo = NAVIGATION_CATEGORIES[cat]
                const catCourses = getCoursesByCategory(cat)
                const isCatExpanded = expandedCategory === cat

                return (
                  <div key={cat}>
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(cat)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        isCatExpanded
                          ? 'bg-gray-100 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{catInfo.label}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                          {catCourses.length}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          isCatExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {/* Category Courses */}
                    {isCatExpanded && (
                      <div className="ml-3 mt-1 space-y-0.5">
                        {loading ? (
                          <div className="px-4 py-2 space-y-2">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
                            ))}
                          </div>
                        ) : catCourses.length > 0 ? (
                          <>
                            {catCourses.map((course) => (
                              <Link
                                key={course.id}
                                to={`/courses/${course.course_code}`}
                                onClick={handleLinkClick}
                                className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                  isActive(`/courses/${course.course_code}`)
                                    ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-500'
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                              >
                                <div className="font-medium">{course.course_name}</div>
                                {course.topics && course.topics.length > 0 && (
                                  <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                                    {course.topics.slice(0, 2).join(' · ')}
                                  </div>
                                )}
                              </Link>
                            ))}

                            {/* Cross-link for Students */}
                            {cat === 'students' && (
                              <Link
                                to="/courses"
                                onClick={handleLinkClick}
                                className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50"
                              >
                                <ArrowRight className="w-3 h-3" />
                                <span>Browse Techies & Non-Techies courses too</span>
                              </Link>
                            )}
                          </>
                        ) : (
                          <div className="px-4 py-2 text-xs text-gray-400">
                            No courses in this category yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Other Nav Items */}
        {navItems.slice(1).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={handleLinkClick}
            className={`block px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
              isActive(item.href)
                ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {item.name}
          </Link>
        ))}

        {/* Auth Section */}
        {user ? (
          <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
            <Link
              to="/dashboard"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
            >
              <User className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={() => {
                onSignOut()
                handleLinkClick()
              }}
              className="flex items-center space-x-3 px-4 py-3 text-base font-semibold text-gray-700 hover:text-red-600 w-full text-left rounded-xl hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
            <Link
              to="/signin"
              onClick={handleLinkClick}
              className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 text-center"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={handleLinkClick}
              className="block px-4 py-3 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-center hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Free Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
