import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import AdminLogin from '../components/AdminLogin'
import { Video, Save, AlertCircle, CheckCircle, Users, Calendar, Link as LinkIcon } from 'lucide-react'

interface BatchSessionLink {
  id: string
  batch_id: string
  course_name: string
  teams_meeting_link: string
  meeting_id?: string
  passcode?: string
  recurring_schedule?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

const AdminSessionLinks: React.FC = () => {
  const { isAdminAuthenticated } = useAdminAuth()
  const [formData, setFormData] = useState({
    id: '',
    batch_id: '',
    course_name: '',
    teams_meeting_link: '',
    meeting_id: '',
    passcode: '',
    recurring_schedule: '',
    is_active: true
  })
  const [existingLinks, setExistingLinks] = useState<BatchSessionLink[]>([])
  const [loadingLinks, setLoadingLinks] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  // Load existing session links
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('batch_session_links')
          .select('*')
          .order('course_name', { ascending: true })

        if (error) {
          console.error('Error fetching session links:', error)
        } else {
          setExistingLinks(data || [])
        }
      } catch (error) {
        console.error('Error fetching session links:', error)
      } finally {
        setLoadingLinks(false)
      }
    }

    if (isAdminAuthenticated) {
      fetchLinks()
    }
  }, [isAdminAuthenticated])

  // Show admin login if not authenticated
  if (!isAdminAuthenticated) {
    return <AdminLogin onSuccess={() => {}} />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // Validate required fields
      if (!formData.batch_id || !formData.course_name || !formData.teams_meeting_link) {
        setMessage('Please fill in all required fields')
        setMessageType('error')
        setIsSubmitting(false)
        return
      }

      // Validate Teams meeting link format
      if (!formData.teams_meeting_link.includes('teams.microsoft.com') && !formData.teams_meeting_link.includes('teams.live.com')) {
        setMessage('Please enter a valid Microsoft Teams meeting link')
        setMessageType('error')
        setIsSubmitting(false)
        return
      }

      // Prepare data for database
      const linkData = {
        batch_id: formData.batch_id,
        course_name: formData.course_name,
        teams_meeting_link: formData.teams_meeting_link,
        meeting_id: formData.meeting_id || null,
        passcode: formData.passcode || null,
        recurring_schedule: formData.recurring_schedule || null,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      }

      console.log('Submitting session link data:', linkData)

      let result
      if (formData.id) {
        // Update existing link
        result = await supabase
          .from('batch_session_links')
          .update(linkData)
          .eq('id', formData.id)
          .select()
      } else {
        // Insert new link
        result = await supabase
          .from('batch_session_links')
          .insert([linkData])
          .select()
      }

      const { data, error } = result

      if (error) {
        console.error('Database error:', error)
        setMessage(`Database error: ${error.message}`)
        setMessageType('error')
      } else {
        console.log('Session link saved successfully:', data)
        setMessage(formData.id ? 'Session link updated successfully!' : 'Session link created successfully!')
        setMessageType('success')
        
        // Reset form
        setFormData({
          id: '',
          batch_id: '',
          course_name: '',
          teams_meeting_link: '',
          meeting_id: '',
          passcode: '',
          recurring_schedule: '',
          is_active: true
        })

        // Refresh links list
        const { data: updatedLinks } = await supabase
          .from('batch_session_links')
          .select('*')
          .order('course_name', { ascending: true })
        
        if (updatedLinks) {
          setExistingLinks(updatedLinks)
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      setMessage(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadLinkData = (link: BatchSessionLink) => {
    setFormData({
      id: link.id,
      batch_id: link.batch_id,
      course_name: link.course_name,
      teams_meeting_link: link.teams_meeting_link,
      meeting_id: link.meeting_id || '',
      passcode: link.passcode || '',
      recurring_schedule: link.recurring_schedule || '',
      is_active: link.is_active
    })
    setMessage('')
  }

  const courseOptions = [
    'Agentic AI',
    'Vibe Coding',
    'Python for ML & AI',
    '4 Months AI Certification For Professionals',
    'PowerBI & Tableau',
    'O365 & Excel Automation',
    'Quantum Computing',
    'Build AI Projects',
    'Masterclass'
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin: Manage Session Links</h1>
          <p className="text-gray-600 mt-2">Create and manage MS Teams recurring meeting links for each batch</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Session Link Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {formData.id ? 'Update' : 'Create'} Session Link
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-4 rounded-lg ${
                  messageType === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {messageType === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <p className={`text-sm ${
                      messageType === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {message}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Batch ID *
                  </label>
                  <input
                    type="text"
                    id="batch_id"
                    name="batch_id"
                    required
                    value={formData.batch_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., AGENTIC_AI_BATCH_1"
                  />
                </div>

                <div>
                  <label htmlFor="course_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name *
                  </label>
                  <select
                    id="course_name"
                    name="course_name"
                    required
                    value={formData.course_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="teams_meeting_link" className="block text-sm font-medium text-gray-700 mb-2">
                  MS Teams Meeting Link *
                </label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    id="teams_meeting_link"
                    name="teams_meeting_link"
                    required
                    value={formData.teams_meeting_link}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://teams.microsoft.com/l/meetup-join/..."
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter the recurring MS Teams meeting link for 25 weeks</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="meeting_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting ID (Optional)
                  </label>
                  <input
                    type="text"
                    id="meeting_id"
                    name="meeting_id"
                    value={formData.meeting_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 123 456 789"
                  />
                </div>

                <div>
                  <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 mb-2">
                    Passcode (Optional)
                  </label>
                  <input
                    type="text"
                    id="passcode"
                    name="passcode"
                    value={formData.passcode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Meeting passcode"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="recurring_schedule" className="block text-sm font-medium text-gray-700 mb-2">
                  Recurring Schedule (Optional)
                </label>
                <input
                  type="text"
                  id="recurring_schedule"
                  name="recurring_schedule"
                  value={formData.recurring_schedule}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Every Sunday 12:30 PM IST for 25 weeks"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active (students can join this meeting)
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{formData.id ? 'Update' : 'Create'} Session Link</span>
                  </>
                )}
              </button>

              {formData.id && (
                <button
                  type="button"
                  onClick={() => setFormData({
                    id: '',
                    batch_id: '',
                    course_name: '',
                    teams_meeting_link: '',
                    meeting_id: '',
                    passcode: '',
                    recurring_schedule: '',
                    is_active: true
                  })}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Clear Form (Create New)
                </button>
              )}
            </form>
          </div>

          {/* Existing Session Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Existing Session Links</h2>
            
            {loadingLinks ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : existingLinks.length > 0 ? (
              <div className="space-y-4">
                {existingLinks.map((link) => (
                  <div 
                    key={link.id} 
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => loadLinkData(link)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {link.batch_id}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          link.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {link.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{link.course_name}</span>
                      </div>
                      
                      {link.recurring_schedule && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{link.recurring_schedule}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="w-4 h-4" />
                        <span className="truncate">{link.teams_meeting_link}</span>
                      </div>
                      
                      {link.meeting_id && (
                        <div className="text-xs text-blue-600">
                          Meeting ID: {link.meeting_id}
                          {link.passcode && ` | Passcode: ${link.passcode}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No session links found</p>
                <p className="text-sm text-gray-400 mt-1">Create your first batch session link above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSessionLinks