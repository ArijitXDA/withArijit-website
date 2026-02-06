import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import AdminLogin from '../components/AdminLogin'
import { Calendar, Clock, Video, FileText, Save, AlertCircle, CheckCircle } from 'lucide-react'

interface SessionRecord {
  session_id: number
  batch_id: string
  session_date: string
  session_start_time: string
  session_link?: string
  study_material_link?: string
  session_title?: string
  session_description?: string
  created_at: string
  updated_at?: string
}

const AdminSessions: React.FC = () => {
  const { isAdminAuthenticated } = useAdminAuth()
  const [formData, setFormData] = useState({
    session_id: '',
    batch_id: '',
    session_date: '',
    session_start_time: '',
    session_link: '',
    study_material_link: '',
    session_title: '',
    session_description: '',
    created_at: '',
    updated_at: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [existingSessions, setExistingSessions] = useState<SessionRecord[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  // Load existing sessions for reference
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('session_master_table')
          .select('*')
          .order('session_date', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Error fetching sessions:', error)
        } else {
          setExistingSessions(data || [])
        }
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setLoadingSessions(false)
      }
    }

    fetchSessions()
  }, [])

  // Show admin login if not authenticated
  if (!isAdminAuthenticated) {
    return <AdminLogin onSuccess={() => {}} />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // Validate required fields
      if (!formData.session_id || !formData.batch_id || !formData.session_date || !formData.session_start_time || !formData.created_at) {
        setMessage('Please fill in all required fields')
        setMessageType('error')
        setIsSubmitting(false)
        return
      }

      // Prepare data for database
      const sessionData = {
        session_id: parseInt(formData.session_id),
        batch_id: formData.batch_id,
        session_date: formData.session_date,
        session_start_time: formData.session_start_time,
        session_link: formData.session_link || null,
        study_material_link: formData.study_material_link || null,
        session_title: formData.session_title || null,
        session_description: formData.session_description || null,
        created_at: formData.created_at,
        updated_at: formData.updated_at || new Date().toISOString()
      }

      console.log('Submitting session data:', sessionData)

      // Check if session exists (for update) or create new
      const { data: existingSession } = await supabase
        .from('session_master_table')
        .select('session_id')
        .eq('session_id', sessionData.session_id)
        .single()

      let result
      if (existingSession) {
        // Update existing session
        result = await supabase
          .from('session_master_table')
          .update(sessionData)
          .eq('session_id', sessionData.session_id)
          .select()
      } else {
        // Insert new session
        result = await supabase
          .from('session_master_table')
          .insert([sessionData])
          .select()
      }

      const { data, error } = result

      if (error) {
        console.error('Database error:', error)
        setMessage(`Database error: ${error.message}`)
        setMessageType('error')
      } else {
        console.log('Session saved successfully:', data)
        setMessage(existingSession ? 'Session updated successfully!' : 'Session created successfully!')
        setMessageType('success')
        
        // Reset form
        setFormData({
          session_id: '',
          batch_id: '',
          session_date: '',
          session_start_time: '',
          session_link: '',
          study_material_link: '',
          session_title: '',
          session_description: '',
          created_at: '',
          updated_at: ''
        })

        // Refresh sessions list
        const { data: updatedSessions } = await supabase
          .from('session_master_table')
          .select('*')
          .order('session_date', { ascending: false })
          .limit(10)
        
        if (updatedSessions) {
          setExistingSessions(updatedSessions)
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

  const loadSessionData = (session: SessionRecord) => {
    setFormData({
      session_id: session.session_id.toString(),
      batch_id: session.batch_id,
      session_date: session.session_date,
      session_start_time: session.session_start_time,
      session_link: session.session_link || '',
      study_material_link: session.study_material_link || '',
      session_title: session.session_title || '',
      session_description: session.session_description || '',
      created_at: session.created_at,
      updated_at: session.updated_at || ''
    })
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin: Session Management</h1>
          <p className="text-gray-600 mt-2">Create and update session records</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Session Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Update Session Record</h2>
            
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
                  <label htmlFor="session_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Session ID *
                  </label>
                  <input
                    type="number"
                    id="session_id"
                    name="session_id"
                    required
                    value={formData.session_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter session ID"
                  />
                </div>

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
                    placeholder="Enter batch ID (e.g., AGENTIC_AI_BATCH_1)"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="session_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Session Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      id="session_date"
                      name="session_date"
                      required
                      value={formData.session_date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="session_start_time" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      id="session_start_time"
                      name="session_start_time"
                      required
                      value={formData.session_start_time}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="session_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title
                </label>
                <input
                  type="text"
                  id="session_title"
                  name="session_title"
                  value={formData.session_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter session title"
                />
              </div>

              <div>
                <label htmlFor="session_description" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Description
                </label>
                <textarea
                  id="session_description"
                  name="session_description"
                  rows={3}
                  value={formData.session_description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter session description"
                />
              </div>

              <div>
                <label htmlFor="session_link" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Link (URL)
                </label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    id="session_link"
                    name="session_link"
                    value={formData.session_link}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="study_material_link" className="block text-sm font-medium text-gray-700 mb-2">
                  Study Material Link (URL)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    id="study_material_link"
                    name="study_material_link"
                    value={formData.study_material_link}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="created_at" className="block text-sm font-medium text-gray-700 mb-2">
                    Created At *
                  </label>
                  <input
                    type="datetime-local"
                    id="created_at"
                    name="created_at"
                    required
                    value={formData.created_at}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="updated_at" className="block text-sm font-medium text-gray-700 mb-2">
                    Updated At
                  </label>
                  <input
                    type="datetime-local"
                    id="updated_at"
                    name="updated_at"
                    value={formData.updated_at}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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
                    <span>Save Session</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Existing Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Sessions</h2>
            
            {loadingSessions ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : existingSessions.length > 0 ? (
              <div className="space-y-4">
                {existingSessions.map((session) => (
                  <div 
                    key={session.session_id} 
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => loadSessionData(session)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Session #{session.session_id}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {session.batch_id}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(session.session_date).toLocaleDateString()}</span>
                        <Clock className="w-4 h-4 ml-4" />
                        <span>{session.session_start_time}</span>
                      </div>
                      {session.session_title && (
                        <p className="font-medium text-gray-700">{session.session_title}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        {session.session_link && (
                          <span className="text-green-600 text-xs">📹 Has Video Link</span>
                        )}
                        {session.study_material_link && (
                          <span className="text-blue-600 text-xs">📄 Has Materials</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No sessions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSessions