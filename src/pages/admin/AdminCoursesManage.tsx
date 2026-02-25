import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Course, NavigationCategory } from '../../types/course'
import { Plus, Pencil, Eye, EyeOff, Trash2, Search, X } from 'lucide-react'
import { NAVIGATION_CATEGORIES, PAYMENT_CONFIG } from '../../lib/constants'

export default function AdminCoursesManage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    course_category: '',
    target_audience: '',
    duration_months: 6,
    monthly_price: PAYMENT_CONFIG.DEFAULT_MONTHLY_PRICE_INR,
    full_course_price: PAYMENT_CONFIG.DEFAULT_MONTHLY_PRICE_INR * 6,
    upfront_discount_percent: PAYMENT_CONFIG.UPFRONT_DISCOUNT_PERCENT,
    continued_learning_monthly_price: PAYMENT_CONFIG.CONTINUED_LEARNING_MONTHLY_PRICE_INR,
    description: '',
    navigation_category: '' as NavigationCategory | '',
    topics: '',
    display_order: 0,
    is_active: true,
    is_visible: true,
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('courses_v2')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setCourses(data || [])
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    } finally {
      setLoading(false)
    }
  }

  function openCreateForm() {
    setEditingCourse(null)
    setFormData({
      course_code: '',
      course_name: '',
      course_category: '',
      target_audience: '',
      duration_months: 6,
      monthly_price: PAYMENT_CONFIG.DEFAULT_MONTHLY_PRICE_INR,
      full_course_price: PAYMENT_CONFIG.DEFAULT_MONTHLY_PRICE_INR * 6,
      upfront_discount_percent: PAYMENT_CONFIG.UPFRONT_DISCOUNT_PERCENT,
      continued_learning_monthly_price: PAYMENT_CONFIG.CONTINUED_LEARNING_MONTHLY_PRICE_INR,
      description: '',
      navigation_category: '',
      topics: '',
      display_order: courses.length + 1,
      is_active: true,
      is_visible: true,
    })
    setShowForm(true)
  }

  function openEditForm(course: Course) {
    setEditingCourse(course)
    setFormData({
      course_code: course.course_code,
      course_name: course.course_name,
      course_category: course.course_category || '',
      target_audience: course.target_audience || '',
      duration_months: course.duration_months,
      monthly_price: course.monthly_price,
      full_course_price: course.full_course_price,
      upfront_discount_percent: course.upfront_discount_percent,
      continued_learning_monthly_price: course.continued_learning_monthly_price,
      description: course.description || '',
      navigation_category: course.navigation_category || '',
      topics: course.topics?.join(', ') || '',
      display_order: course.display_order,
      is_active: course.is_active,
      is_visible: course.is_visible,
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const upfrontFinalPrice = formData.full_course_price * (1 - formData.upfront_discount_percent / 100)
      const topicsArray = formData.topics
        ? formData.topics.split(',').map((t) => t.trim()).filter(Boolean)
        : null

      const courseData = {
        course_code: formData.course_code.toUpperCase().trim(),
        course_name: formData.course_name.trim(),
        course_category: formData.course_category || null,
        target_audience: formData.target_audience || null,
        duration_months: formData.duration_months,
        monthly_price: formData.monthly_price,
        full_course_price: formData.full_course_price,
        upfront_discount_percent: formData.upfront_discount_percent,
        upfront_final_price: Math.round(upfrontFinalPrice * 100) / 100,
        continued_learning_monthly_price: formData.continued_learning_monthly_price,
        description: formData.description || null,
        navigation_category: formData.navigation_category || null,
        topics: topicsArray,
        display_order: formData.display_order,
        is_active: formData.is_active,
        is_visible: formData.is_visible,
        updated_at: new Date().toISOString(),
      }

      if (editingCourse) {
        const { error } = await supabase
          .from('courses_v2')
          .update(courseData)
          .eq('id', editingCourse.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('courses_v2')
          .insert(courseData)
        if (error) throw error
      }

      setShowForm(false)
      fetchCourses()
    } catch (err) {
      console.error('Failed to save course:', err)
      alert('Failed to save course. Please check the data and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleVisibility(course: Course) {
    const { error } = await supabase
      .from('courses_v2')
      .update({ is_visible: !course.is_visible, updated_at: new Date().toISOString() })
      .eq('id', course.id)

    if (!error) fetchCourses()
  }

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course_code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filterCategory || c.navigation_category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Auto-calculate full_course_price when monthly_price or duration changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      full_course_price: prev.monthly_price * prev.duration_months,
    }))
  }, [formData.monthly_price, formData.duration_months])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Course Management</h1>
          <p className="text-gray-400 text-sm mt-1">{courses.length} total courses</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Categories</option>
          {Object.entries(NAVIGATION_CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-gray-800 rounded-lg p-4 border transition-colors ${
                course.is_active ? 'border-gray-700/50 hover:border-gray-600' : 'border-red-900/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium truncate">{course.course_name}</h3>
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-[10px] font-mono rounded">
                      {course.course_code}
                    </span>
                    {course.navigation_category && (
                      <span className="px-2 py-0.5 bg-orange-600/20 text-orange-400 text-[10px] rounded capitalize">
                        {course.navigation_category.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-1">{course.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{course.duration_months} months</span>
                    <span>{'\u20B9'}{course.monthly_price.toLocaleString()}/mo</span>
                    <span>Upfront: {'\u20B9'}{course.upfront_final_price?.toLocaleString()}</span>
                    <span>Order: {course.display_order}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => toggleVisibility(course)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title={course.is_visible ? 'Hide course' : 'Show course'}
                  >
                    {course.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditForm(course)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title="Edit course"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No courses found matching your search.
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingCourse ? 'Edit Course' : 'Create Course'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Course Code *</label>
                  <input
                    type="text"
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="AI_EXAMPLE"
                    disabled={!!editingCourse}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Navigation Category</label>
                  <select
                    value={formData.navigation_category}
                    onChange={(e) => setFormData({ ...formData, navigation_category: e.target.value as NavigationCategory })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select category</option>
                    {Object.entries(NAVIGATION_CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={key}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Course Name *</label>
                <input
                  type="text"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="AI for Example"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="Course description..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Topics (comma-separated)</label>
                <input
                  type="text"
                  value={formData.topics}
                  onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="Topic 1, Topic 2, Topic 3"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Duration (months)</label>
                  <input
                    type="number"
                    value={formData.duration_months}
                    onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) || 6 })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Monthly Price ({'\u20B9'})</label>
                  <input
                    type="number"
                    value={formData.monthly_price}
                    onChange={(e) => setFormData({ ...formData, monthly_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min={0}
                    step={100}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Full Price ({'\u20B9'})</label>
                  <input
                    type="number"
                    value={formData.full_course_price}
                    onChange={(e) => setFormData({ ...formData, full_course_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min={0}
                    step={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Upfront Discount %</label>
                  <input
                    type="number"
                    value={formData.upfront_discount_percent}
                    onChange={(e) => setFormData({ ...formData, upfront_discount_percent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min={0}
                    max={100}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Continued Learning ({'\u20B9'}/mo)</label>
                  <input
                    type="number"
                    value={formData.continued_learning_monthly_price}
                    onChange={(e) => setFormData({ ...formData, continued_learning_monthly_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min={0}
                    step={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min={0}
                  />
                </div>
                <div className="flex items-end gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded accent-orange-500"
                    />
                    <span className="text-sm text-gray-300">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                      className="w-4 h-4 rounded accent-orange-500"
                    />
                    <span className="text-sm text-gray-300">Visible</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.course_code || !formData.course_name}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingCourse ? 'Update Course' : 'Create Course'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
