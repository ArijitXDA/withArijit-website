import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-react'
import { useCourses } from '../../hooks/useCourses'
import { NAVIGATION_CATEGORIES } from '../../lib/constants'
import type { NavigationCategory, Course } from '../../types/course'

interface CourseDropdownProps {
  onLinkClick?: () => void
}

/**
 * Single "Courses" dropdown with tree structure:
 * Techies -> courses, Non-Techies -> courses, Students -> courses + "View All",
 * Job Seekers -> courses
 */
export default function CourseDropdown({ onLinkClick }: CourseDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<NavigationCategory | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)
  const location = useLocation()
  const { courses, loading } = useCourses()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setActiveCategory(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on route change
  useEffect(() => {
    setIsOpen(false)
    setActiveCategory(null)
  }, [location.pathname])

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false)
      setActiveCategory(null)
    }, 200)
  }

  const categoryOrder: NavigationCategory[] = ['techies', 'non_techies', 'students', 'job_seekers']

  const getCoursesByCategory = (cat: NavigationCategory): Course[] => {
    return courses.filter((c) => c.navigation_category === cat)
  }

  const isCoursesPage = location.pathname.startsWith('/courses') || location.pathname.startsWith('/ai-certification')

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <Link
        to="/courses"
        className={`relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group flex items-center space-x-1 ${
          isCoursesPage
            ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transform scale-105'
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md hover:scale-105'
        }`}
      >
        <span>Courses</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Link>

      {/* Mega Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 flex min-w-[600px]"
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
          }}
        >
          {/* Category List (Left Panel) */}
          <div className="w-48 bg-gray-50 rounded-l-xl border-r border-gray-100 py-2">
            {categoryOrder.map((cat) => {
              const catInfo = NAVIGATION_CATEGORIES[cat]
              const catCourses = getCoursesByCategory(cat)
              const isActive = activeCategory === cat

              return (
                <button
                  key={cat}
                  onMouseEnter={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-white hover:text-blue-600'
                  }`}
                >
                  <span>{catInfo.label}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400">{catCourses.length}</span>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  </div>
                </button>
              )
            })}

            {/* View All Courses Link */}
            <div className="border-t border-gray-200 mt-2 pt-2 px-4">
              <Link
                to="/courses"
                onClick={() => { setIsOpen(false); onLinkClick?.() }}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 py-2"
              >
                <span>View All Courses</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Course List (Right Panel) */}
          <div className="flex-1 py-2 min-h-[200px]">
            {!activeCategory ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Hover over a category to see courses
              </div>
            ) : loading ? (
              <div className="p-4 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div>
                <div className="px-4 py-2 mb-1">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {NAVIGATION_CATEGORIES[activeCategory].label}
                  </h4>
                </div>

                {getCoursesByCategory(activeCategory).map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.course_code}`}
                    onClick={() => { setIsOpen(false); onLinkClick?.() }}
                    className={`block px-4 py-2.5 text-sm transition-all duration-200 ${
                      location.pathname === `/courses/${course.course_code}`
                        ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 mx-2 rounded-lg'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 mx-2 rounded-lg'
                    }`}
                  >
                    <div className="font-medium">{course.course_name}</div>
                    {course.topics && course.topics.length > 0 && (
                      <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                        {course.topics.slice(0, 3).join(' \u00B7 ')}
                      </div>
                    )}
                  </Link>
                ))}

                {getCoursesByCategory(activeCategory).length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    No courses in this category yet
                  </div>
                )}

                {/* Cross-link for Students category */}
                {activeCategory === 'students' && (
                  <div className="border-t border-gray-100 mt-2 pt-2 mx-2">
                    <Link
                      to="/courses"
                      onClick={() => { setIsOpen(false); onLinkClick?.() }}
                      className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50"
                    >
                      <ArrowRight className="w-3 h-3" />
                      <span>Browse Techies & Non-Techies courses too</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
