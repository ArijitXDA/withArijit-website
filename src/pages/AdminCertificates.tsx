import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import AdminLogin from '../components/AdminLogin'
import { Award, Save, AlertCircle, CheckCircle, Users, Calendar, Link as LinkIcon, Search, Plus, Edit, Trash2 } from 'lucide-react'

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

interface User {
  user_id: string
  email: string
  name: string
}

const AdminCertificates: React.FC = () => {
  const { isAdminAuthenticated } = useAdminAuth()
  const [formData, setFormData] = useState({
    id: '',
    user_email: '',
    certificate_name: '',
    date_of_issuing: '',
    certificate_image_link: '',
    is_active: true
  })
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchEmail, setSearchEmail] = useState('')
  const [loadingCertificates, setLoadingCertificates] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  // Load certificates and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch certificates
        const { data: certificatesData, error: certificatesError } = await supabase
          .from('certificates')
          .select('*')
          .order('date_of_issuing', { ascending: false })

        if (certificatesError) {
          console.error('Error fetching certificates:', certificatesError)
        } else {
          setCertificates(certificatesData || [])
        }

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('user_id, email, name')
          .order('name', { ascending: true })

        if (usersError) {
          console.error('Error fetching users:', usersError)
        } else {
          setUsers(usersData || [])
          setFilteredUsers(usersData || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoadingCertificates(false)
        setLoadingUsers(false)
      }
    }

    if (isAdminAuthenticated) {
      fetchData()
    }
  }, [isAdminAuthenticated])

  // Filter users based on search
  useEffect(() => {
    if (searchEmail.trim() === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
        user.name.toLowerCase().includes(searchEmail.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchEmail, users])

  // Show admin login if not authenticated
  if (!isAdminAuthenticated) {
    return <AdminLogin onSuccess={() => {}} />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleUserSelect = (email: string) => {
    setFormData(prev => ({
      ...prev,
      user_email: email
    }))
    setSearchEmail('')
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // Validate required fields
      if (!formData.user_email || !formData.certificate_name || !formData.date_of_issuing || !formData.certificate_image_link) {
        setMessage('Please fill in all required fields')
        setMessageType('error')
        setIsSubmitting(false)
        return
      }

      // Validate image URL format
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
      const url = formData.certificate_image_link.toLowerCase()
      const hasValidExtension = imageExtensions.some(ext => url.includes(ext)) ||
        url.includes('sharepoint.com') ||
        url.includes('onedrive.live.com') ||
        url.includes('1drv.ms') ||
        url.includes('drive.google.com') ||
        url.includes('dropbox.com') ||
        url.includes('imgur.com') ||
        url.includes('cloudinary.com') ||
        url.includes('amazonaws.com') ||
        url.includes('supabase.co')
      
      if (!hasValidExtension) {
        setMessage('Please enter a valid image URL. Supported formats: .jpg, .png, .gif, .webp, .bmp, or links from OneDrive, SharePoint, Google Drive, Dropbox, Imgur, Cloudinary, AWS S3, or Supabase.')
        setMessageType('error')
        setIsSubmitting(false)
        return
      }

      // Prepare data for database
      const certificateData = {
        user_email: formData.user_email,
        certificate_name: formData.certificate_name,
        date_of_issuing: formData.date_of_issuing,
        certificate_image_link: formData.certificate_image_link,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      }

      console.log('Submitting certificate data:', certificateData)

      let result
      if (formData.id) {
        // Update existing certificate
        result = await supabase
          .from('certificates')
          .update(certificateData)
          .eq('id', formData.id)
          .select()
      } else {
        // Insert new certificate
        result = await supabase
          .from('certificates')
          .insert([certificateData])
          .select()
      }

      const { data, error } = result

      if (error) {
        console.error('Database error:', error)
        setMessage(`Database error: ${error.message}`)
        setMessageType('error')
      } else {
        console.log('Certificate saved successfully:', data)
        setMessage(formData.id ? 'Certificate updated successfully!' : 'Certificate created successfully!')
        setMessageType('success')
        
        // Reset form
        setFormData({
          id: '',
          user_email: '',
          certificate_name: '',
          date_of_issuing: '',
          certificate_image_link: '',
          is_active: true
        })

        // Refresh certificates list
        const { data: updatedCertificates } = await supabase
          .from('certificates')
          .select('*')
          .order('date_of_issuing', { ascending: false })
        
        if (updatedCertificates) {
          setCertificates(updatedCertificates)
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

  const loadCertificateData = (certificate: Certificate) => {
    setFormData({
      id: certificate.id,
      user_email: certificate.user_email,
      certificate_name: certificate.certificate_name,
      date_of_issuing: certificate.date_of_issuing,
      certificate_image_link: certificate.certificate_image_link,
      is_active: certificate.is_active
    })
    setMessage('')
  }

  const deleteCertificate = async (certificateId: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', certificateId)

      if (error) {
        console.error('Delete error:', error)
        setMessage(`Failed to delete certificate: ${error.message}`)
        setMessageType('error')
      } else {
        setMessage('Certificate deleted successfully!')
        setMessageType('success')
        
        // Refresh certificates list
        const { data: updatedCertificates } = await supabase
          .from('certificates')
          .select('*')
          .order('date_of_issuing', { ascending: false })
        
        if (updatedCertificates) {
          setCertificates(updatedCertificates)
        }
      }
    } catch (error) {
      console.error('Delete error:', error)
      setMessage('Failed to delete certificate')
      setMessageType('error')
    }
  }

  const certificateTypes = [
    'AI Agent Development Certification',
    'Vibe Coding Certification',
    'Python for ML & AI Certification',
    'AI Certification for Professionals',
    'PowerBI & Tableau Certification',
    'Excel Automation Certification',
    'Quantum Computing Certification',
    'Masterclass Completion Certificate',
    'Custom Certificate'
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin: Manage Certificates</h1>
          <p className="text-gray-600 mt-2">Issue and manage certificates for users</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Certificate Form */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {formData.id ? 'Update' : 'Issue'} Certificate
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

              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
                  User Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    required
                    value={formData.user_email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter user email"
                  />
                </div>
                
                {/* User Search */}
                <div className="mt-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Search users by email or name"
                    />
                  </div>
                  
                  {searchEmail && filteredUsers.length > 0 && (
                    <div className="mt-1 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                      {filteredUsers.slice(0, 10).map((user) => (
                        <button
                          key={user.user_id}
                          type="button"
                          onClick={() => handleUserSelect(user.email)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="certificate_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Name *
                </label>
                <select
                  id="certificate_name"
                  name="certificate_name"
                  required
                  value={formData.certificate_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Certificate Type</option>
                  {certificateTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date_of_issuing" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Issuing *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    id="date_of_issuing"
                    name="date_of_issuing"
                    required
                    value={formData.date_of_issuing}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="certificate_image_link" className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Image URL *
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    id="certificate_image_link"
                    name="certificate_image_link"
                    required
                    value={formData.certificate_image_link}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/certificate.jpg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter an image URL. Supports direct image links (.jpg, .png, .gif, .webp, .bmp) or cloud storage links (OneDrive, SharePoint, Google Drive, Dropbox, etc.).
                </p>
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
                  Active (certificate is visible to user)
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
                    <span>{formData.id ? 'Update' : 'Issue'} Certificate</span>
                  </>
                )}
              </button>

              {formData.id && (
                <button
                  type="button"
                  onClick={() => setFormData({
                    id: '',
                    user_email: '',
                    certificate_name: '',
                    date_of_issuing: '',
                    certificate_image_link: '',
                    is_active: true
                  })}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Clear Form (Create New)</span>
                </button>
              )}
            </form>
          </div>

          {/* Certificates List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Issued Certificates</h2>
            
            {loadingCertificates ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : certificates.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">User</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Certificate</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Date Issued</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {certificates.map((certificate) => (
                      <tr key={certificate.id} className="hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="text-sm font-medium text-gray-900">{certificate.user_email}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-sm text-gray-900">{certificate.certificate_name}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-sm text-gray-700">
                            {new Date(certificate.date_of_issuing).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            certificate.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {certificate.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => loadCertificateData(certificate)}
                              className="text-blue-600 hover:text-blue-500 p-1 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <a
                              href={certificate.certificate_image_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-500 p-1 rounded"
                              title="View Certificate"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => deleteCertificate(certificate.id)}
                              className="text-red-600 hover:text-red-500 p-1 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No certificates found</p>
                <p className="text-sm text-gray-400 mt-1">Issue your first certificate above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCertificates