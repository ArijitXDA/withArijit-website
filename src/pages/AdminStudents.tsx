import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import AdminLogin from '../components/AdminLogin'
import { Users, Mail, Save, AlertCircle, CheckCircle } from 'lucide-react'

interface Student {
  id: string
  student_name: string
  email: string
  current_course_name: string
  batch_id?: string
}

interface BatchOption {
  batch_id: string
  course_name: string
}

const AdminStudents: React.FC = () => {
  const { isAdminAuthenticated } = useAdminAuth()
  const [formData, setFormData] = useState({
    selectedStudentId: '',
    selectedStudentEmail: '',
    batch_id: ''
  })
  const [students, setStudents] = useState<Student[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [loadingStudents, setLoadingStudents] = useState(true)

  // Load students and batches
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('student_master_table')
          .select('id, student_name, email, current_course_name, batch_id')
          .order('student_name', { ascending: true })

        if (studentsError) {
          console.error('Error fetching students:', studentsError)
        } else {
          setStudents(studentsData || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoadingStudents(false)
      }
    }

    fetchData()
  }, [])

  // Show admin login if not authenticated
  if (!isAdminAuthenticated) {
    return <AdminLogin onSuccess={() => {}} />
  }

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value
    const selectedStudent = students.find(s => s.id === studentId)
    
    setFormData(prev => ({
      ...prev,
      selectedStudentId: studentId,
      selectedStudentEmail: selectedStudent?.email || '',
      batch_id: selectedStudent?.batch_id || ''
    }))
    setMessage('')
  }

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      batch_id: e.target.value
    }))
    setMessage('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (!formData.selectedStudentId || !formData.batch_id) {
        setMessage('Please select both student and batch ID')
        setMessageType('error')
        setIsSubmitting(false)
        return
      }

      console.log('Updating student batch assignment:', formData)

      // Update student's batch_id
      const { data, error } = await supabase
        .from('student_master_table')
        .update({
          batch_id: formData.batch_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', formData.selectedStudentId)
        .select()

      if (error) {
        console.error('Database error:', error)
        setMessage(`Database error: ${error.message}`)
        setMessageType('error')
      } else {
        console.log('Student batch updated successfully:', data)
        setMessage('Student batch assignment updated successfully!')
        setMessageType('success')
        
        // Refresh students list
        const { data: updatedStudents } = await supabase
          .from('student_master_table')
          .select('id, student_name, email, current_course_name, batch_id')
          .order('student_name', { ascending: true })
        
        if (updatedStudents) {
          setStudents(updatedStudents)
        }

        // Reset form
        setFormData({
          selectedStudentId: '',
          selectedStudentEmail: '',
          batch_id: ''
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      setMessage(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin: Student Batch Assignment</h1>
          <p className="text-gray-600 mt-2">Assign batch IDs to students</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assignment Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Assign Batch to Student</h2>
            
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

              <div>
                <label htmlFor="selectedStudentId" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="selectedStudentId"
                    name="selectedStudentId"
                    required
                    value={formData.selectedStudentId}
                    onChange={handleStudentChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loadingStudents}
                  >
                    <option value="">
                      {loadingStudents ? 'Loading students...' : 'Select a student'}
                    </option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.student_name} ({student.current_course_name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="selectedStudentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Email (Auto-populated)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="selectedStudentEmail"
                    name="selectedStudentEmail"
                    value={formData.selectedStudentEmail}
                    readOnly
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    placeholder="Email will auto-populate"
                  />
                </div>
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

              <button
                type="submit"
                disabled={isSubmitting || !formData.selectedStudentId || !formData.batch_id}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Assign Batch</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Current Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Current Batch Assignments</h2>
            
            {loadingStudents ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Student</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Course</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Batch ID</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-medium text-gray-900">{student.student_name}</div>
                            <div className="text-xs text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-700">{student.current_course_name}</td>
                        <td className="py-3 px-2">
                          {student.batch_id ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {student.batch_id}
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              Not Assigned
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => {
                              setFormData({
                                selectedStudentId: student.id,
                                selectedStudentEmail: student.email,
                                batch_id: student.batch_id || ''
                              })
                            }}
                            className="text-blue-600 hover:text-blue-500 text-xs font-medium"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No students found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStudents