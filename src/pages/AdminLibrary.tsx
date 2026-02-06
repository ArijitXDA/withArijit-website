import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import AdminLogin from '../components/AdminLogin'
import { BookOpen, Save, AlertCircle, CheckCircle, Search, Plus, Edit, Trash2, Star, Calendar, Tag, Link as LinkIcon } from 'lucide-react'

interface LibraryItem {
  id: string
  publication_type: string
  category: string
  title: string
  author_team: string
  level: string
  pages?: number
  file_size_mb?: number
  rating?: number
  url: string
  publication_date: string
  license_source: string
  tags: string[]
  contributor: string
  verified: boolean
  access: string
  thumbnail_url?: string
  github_repo?: string
  demo_url?: string
  update_date: string
  notes?: string
}

const AdminLibrary: React.FC = () => {
  const { isAdminAuthenticated } = useAdminAuth()
  const [formData, setFormData] = useState({
    id: '',
    publication_type: '',
    category: '',
    title: '',
    author_team: '',
    level: '',
    pages: '',
    file_size_mb: '',
    rating: '',
    url: '',
    publication_date: '',
    license_source: '',
    tags: '',
    contributor: '',
    verified: true,
    access: 'Anyone',
    thumbnail_url: '',
    github_repo: '',
    demo_url: '',
    notes: ''
  })
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<LibraryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [loadingItems, setLoadingItems] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const publicationTypes = [
    'Book',
    'Article', 
    'Project',
    'GitHub',
    'Newsletter',
    'Datasets & Cheatsheets'
  ]

  const categories = {
    'Book': [
      'AI in Business',
      'Learn AI for Non-Techies',
      'Learn AI Development (for Techies)',
      'Python Programming',
      'Data Analysis & Business Intelligence',
      'Excel & Office Automation',
      'General Data Science',
      'Textbooks / Reference'
    ],
    'Article': [
      'AI in Business',
      'Learn AI for Non-Techies',
      'Learn AI Development (for Techies)',
      'Python',
      'Data Analysis & Business Intelligence',
      'Excel & Office Automation',
      'Surveys & Reviews',
      'Research Paper',
      'Industry Report / Whitepaper',
      'Case Study'
    ],
    'Project': [
      'Class Projects',
      'Capstone Projects',
      'Industry Collaboration Projects',
      'Hackathon Projects',
      'Student Research'
    ],
    'GitHub': [
      'Python',
      'BI / Dashboard',
      'MLOps / Deployment',
      'Automation / RPA',
      'Web / App',
      'Demo / Live Project'
    ],
    'Newsletter': [],
    'Datasets & Cheatsheets': [
      'Cheatsheet',
      'Template',
      'Syllabus',
      'Dataset'
    ]
  }

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Non-tech', 'Manager']
  const accessLevels = ['Anyone', 'Signed Up User', 'Enrolled Student', 'Private']
  const contributors = ['Arijit', 'Student', 'External']

  // Load library items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('library')
          .select('*')
          .order('update_date', { ascending: false })

        if (error) {
          console.error('Error fetching library items:', error)
        } else {
          setLibraryItems(data || [])
          setFilteredItems(data || [])
        }
      } catch (error) {
        console.error('Error fetching library items:', error)
      } finally {
        setLoadingItems(false)
      }
    }

    if (isAdminAuthenticated) {
      fetchItems()
    }
  }, [isAdminAuthenticated])

  // Filter items based on search and type
  useEffect(() => {
    let filtered = libraryItems

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.publication_type === selectedType)
    }

    setFilteredItems(filtered)
  }, [searchQuery, selectedType, libraryItems])

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
      if (!formData.publication_type || !formData.title || !formData.author_team || !formData.level || !formData.url || !formData.publication_date || !formData.license_source || !formData.contributor || !formData.access) {
        setMessage('Please fill in all required fields')
        setMessageType('error')
        setIsSubmitting(false)
        return
      }

      // Validate URL format
      try {
        new URL(formData.url)
      } catch {
        setMessage('Please enter a valid URL')
        setMessageType('error')
        setIsSubmitting(false)
        return
      }

      // Prepare data for database
      const libraryData = {
        publication_type: formData.publication_type,
        category: formData.category || null,
        title: formData.title,
        author_team: formData.author_team,
        level: formData.level,
        pages: formData.pages ? parseInt(formData.pages) : null,
        file_size_mb: formData.file_size_mb ? parseFloat(formData.file_size_mb) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        url: formData.url,
        publication_date: formData.publication_date,
        license_source: formData.license_source,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        contributor: formData.contributor,
        verified: formData.verified,
        access: formData.access,
        thumbnail_url: formData.thumbnail_url || null,
        github_repo: formData.github_repo || null,
        demo_url: formData.demo_url || null,
        notes: formData.notes || null,
        update_date: new Date().toISOString()
      }

      console.log('Submitting library data:', libraryData)

      let result
      if (formData.id) {
        // Update existing item
        result = await supabase
          .from('library')
          .update(libraryData)
          .eq('id', formData.id)
          .select()
      } else {
        // Insert new item
        result = await supabase
          .from('library')
          .insert([libraryData])
          .select()
      }

      const { data, error } = result

      if (error) {
        console.error('Database error:', error)
        setMessage(`Database error: ${error.message}`)
        setMessageType('error')
      } else {
        console.log('Library item saved successfully:', data)
        setMessage(formData.id ? 'Library item updated successfully!' : 'Library item created successfully!')
        setMessageType('success')
        
        // Reset form
        setFormData({
          id: '',
          publication_type: '',
          category: '',
          title: '',
          author_team: '',
          level: '',
          pages: '',
          file_size_mb: '',
          rating: '',
          url: '',
          publication_date: '',
          license_source: '',
          tags: '',
          contributor: '',
          verified: true,
          access: 'Anyone',
          thumbnail_url: '',
          github_repo: '',
          demo_url: '',
          notes: ''
        })

        // Refresh items list
        const { data: updatedItems } = await supabase
          .from('library')
          .select('*')
          .order('update_date', { ascending: false })
        
        if (updatedItems) {
          setLibraryItems(updatedItems)
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

  const loadItemData = (item: LibraryItem) => {
    setFormData({
      id: item.id,
      publication_type: item.publication_type,
      category: item.category,
      title: item.title,
      author_team: item.author_team,
      level: item.level,
      pages: item.pages?.toString() || '',
      file_size_mb: item.file_size_mb?.toString() || '',
      rating: item.rating?.toString() || '',
      url: item.url,
      publication_date: item.publication_date,
      license_source: item.license_source,
      tags: item.tags.join(', '),
      contributor: item.contributor,
      verified: item.verified,
      access: item.access,
      thumbnail_url: item.thumbnail_url || '',
      github_repo: item.github_repo || '',
      demo_url: item.demo_url || '',
      notes: item.notes || ''
    })
    setMessage('')
  }

  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this library item?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('library')
        .delete()
        .eq('id', itemId)

      if (error) {
        console.error('Delete error:', error)
        setMessage(`Failed to delete item: ${error.message}`)
        setMessageType('error')
      } else {
        setMessage('Library item deleted successfully!')
        setMessageType('success')
        
        // Refresh items list
        const { data: updatedItems } = await supabase
          .from('library')
          .select('*')
          .order('update_date', { ascending: false })
        
        if (updatedItems) {
          setLibraryItems(updatedItems)
        }
      }
    } catch (error) {
      console.error('Delete error:', error)
      setMessage('Failed to delete library item')
      setMessageType('error')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin: Manage Library Content</h1>
          <p className="text-gray-600 mt-2">Add, edit, and manage content in Staran's eBook Library</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content Form */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {formData.id ? 'Update' : 'Add'} Library Content
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="publication_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Type *
                  </label>
                  <select
                    id="publication_type"
                    name="publication_type"
                    required
                    value={formData.publication_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Type</option>
                    {publicationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={!formData.publication_type || formData.publication_type === 'Newsletter'}
                  >
                    <option value="">Select Category</option>
                    {formData.publication_type && categories[formData.publication_type as keyof typeof categories]?.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter content title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="author_team" className="block text-sm font-medium text-gray-700 mb-1">
                    Author(s) / Team *
                  </label>
                  <input
                    type="text"
                    id="author_team"
                    name="author_team"
                    required
                    value={formData.author_team}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Author name(s)"
                  />
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Level *
                  </label>
                  <select
                    id="level"
                    name="level"
                    required
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Level</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
                    Pages
                  </label>
                  <input
                    type="number"
                    id="pages"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Page count"
                  />
                </div>

                <div>
                  <label htmlFor="file_size_mb" className="block text-sm font-medium text-gray-700 mb-1">
                    Size (MB)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="file_size_mb"
                    name="file_size_mb"
                    value={formData.file_size_mb}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="File size"
                  />
                </div>

                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="0-5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  Content URL *
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  required
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="https://example.com/content.pdf"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="publication_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Date *
                  </label>
                  <input
                    type="text"
                    id="publication_date"
                    name="publication_date"
                    required
                    value={formData.publication_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="YYYY-MM-DD or YYYY"
                  />
                </div>

                <div>
                  <label htmlFor="license_source" className="block text-sm font-medium text-gray-700 mb-1">
                    License / Source *
                  </label>
                  <input
                    type="text"
                    id="license_source"
                    name="license_source"
                    required
                    value={formData.license_source}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., CC-BY, Proprietary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="ai, machine learning, python"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contributor" className="block text-sm font-medium text-gray-700 mb-1">
                    Contributor *
                  </label>
                  <select
                    id="contributor"
                    name="contributor"
                    required
                    value={formData.contributor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Contributor</option>
                    {contributors.map((contributor) => (
                      <option key={contributor} value={contributor}>
                        {contributor}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="access" className="block text-sm font-medium text-gray-700 mb-1">
                    Access Level *
                  </label>
                  <select
                    id="access"
                    name="access"
                    required
                    value={formData.access}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {accessLevels.map((access) => (
                      <option key={access} value={access}>
                        {access}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  id="thumbnail_url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="github_repo" className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Repo
                  </label>
                  <input
                    type="url"
                    id="github_repo"
                    name="github_repo"
                    value={formData.github_repo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label htmlFor="demo_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    id="demo_url"
                    name="demo_url"
                    value={formData.demo_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://demo.example.com"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="verified"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="verified" className="text-sm font-medium text-gray-700">
                  Verified content
                </label>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Internal notes..."
                />
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
                    <span>{formData.id ? 'Update' : 'Add'} Content</span>
                  </>
                )}
              </button>

              {formData.id && (
                <button
                  type="button"
                  onClick={() => setFormData({
                    id: '',
                    publication_type: '',
                    category: '',
                    title: '',
                    author_team: '',
                    level: '',
                    pages: '',
                    file_size_mb: '',
                    rating: '',
                    url: '',
                    publication_date: '',
                    license_source: '',
                    tags: '',
                    contributor: '',
                    verified: true,
                    access: 'Anyone',
                    thumbnail_url: '',
                    github_repo: '',
                    demo_url: '',
                    notes: ''
                  })}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Clear Form (Add New)</span>
                </button>
              )}
            </form>
          </div>

          {/* Library Items List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Library Content ({filteredItems.length})</h2>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Search content..."
                  />
                </div>
                
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Types</option>
                  {publicationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {loadingItems ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Content</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Type/Category</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Level</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Access</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Updated</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.author_team}</div>
                            {item.rating && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs text-gray-500">{item.rating}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-sm text-gray-900">{item.publication_type}</div>
                          {item.category && (
                            <div className="text-xs text-gray-500">{item.category}</div>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.level}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.access === 'Anyone' ? 'bg-green-100 text-green-800' :
                            item.access === 'Signed Up User' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {item.access}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-sm text-gray-700">
                            {formatDate(item.update_date)}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => loadItemData(item)}
                              className="text-blue-600 hover:text-blue-500 p-1 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-500 p-1 rounded"
                              title="View Content"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => deleteItem(item.id)}
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
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No library content found</p>
                <p className="text-sm text-gray-400 mt-1">Add your first library item above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLibrary