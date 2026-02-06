import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import LibraryCard from '../components/LibraryCard'
import PaymentModal from '../components/PaymentModal'
import { 
  Brain, 
  BookOpen, 
  FileText, 
  Code, 
  Github, 
  Mail, 
  Database,
  Sparkles,
  Rocket,
  Users,
  Star,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Shield,
  Globe
} from 'lucide-react'

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

interface StudentRecord {
  id: string
  student_name: string
  email: string
  current_course_name: string
  batch_id?: string
}

const Library: React.FC = () => {
  const { user } = useAuth()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([])
  const [studentRecord, setStudentRecord] = useState<StudentRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const isEnrolledStudent = !!studentRecord

  // Publication types and their categories
  const publicationTypes = {
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
    'Newsletter': [], // No subcategories
    'Datasets & Cheatsheets': [
      'Cheatsheet',
      'Template',
      'Syllabus',
      'Dataset'
    ]
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is enrolled student
        if (user?.email) {
          const { data: studentData } = await supabase
            .from('student_master_table')
            .select('*')
            .eq('email', user.email)
            .maybeSingle()
          
          setStudentRecord(studentData)
        }

        // Fetch library items
        const { data: libraryData, error } = await supabase
          .from('library')
          .select('*')
          .order('update_date', { ascending: false })

        if (error) {
          console.error('Error fetching library items:', error)
        } else {
          setLibraryItems(libraryData || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.email])

  const getItemsByTypeAndCategory = (type: string, category: string, limit: number = 5) => {
    return libraryItems
      .filter(item => 
        item.publication_type === type && 
        item.category === category &&
        (searchQuery === '' || 
         item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.author_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
      .slice(0, limit)
  }

  const getNewsletterItems = (limit: number = 20) => {
    return libraryItems
      .filter(item => 
        item.publication_type === 'Newsletter' &&
        (searchQuery === '' || 
         item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.author_team.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .slice(0, limit)
  }

  const filteredItems = selectedType === 'all' 
    ? libraryItems.filter(item =>
        searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : libraryItems.filter(item => 
        item.publication_type === selectedType &&
        (selectedCategory === 'all' || item.category === selectedCategory) &&
        (searchQuery === '' || 
         item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.author_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )

  const stats = [
    { number: `${libraryItems.length}+`, text: 'Free Resources', icon: <BookOpen className="w-8 h-8" /> },
    { number: '10000+', text: 'Students Benefited', icon: <Users className="w-8 h-8" /> },
    { number: '5★', text: 'Quality Content', icon: <Star className="w-8 h-8" /> },
    { number: '24/7', text: 'Access Available', icon: <Globe className="w-8 h-8" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 rounded-full blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-6 py-3 rounded-full font-bold text-lg shadow-2xl mb-8">
              <Sparkles className="w-6 h-6 mr-2" />
              STARAN'S AI INTELLIGENCE LIBRARY
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Staran's
              </span>
              <span className="block text-white mt-2">eBook Library</span>
              <span className="block text-gray-300 text-2xl md:text-3xl mt-2 font-normal">
                Free Access to Premium AI Resources
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Meet <strong className="text-yellow-400">Staran</strong> - the most intelligent AI Agent developed and hosted by 
              Arijit & his students. Access thousands of premium AI resources, research papers, 
              project codes, and exclusive content curated by industry experts.
            </p>

            {/* Access Requirements */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-4xl mx-auto border border-yellow-500/20">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">📚 Access Levels</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
                  <div className="font-bold text-green-300 mb-1">🌍 Public Access</div>
                  <p className="text-gray-300">Basic resources available to everyone</p>
                </div>
                <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30">
                  <div className="font-bold text-blue-300 mb-1">👤 Registered Users</div>
                  <p className="text-gray-300">Premium content for signed-up users</p>
                </div>
                <div className="bg-orange-500/20 backdrop-blur-sm rounded-lg p-3 border border-orange-500/30">
                  <div className="font-bold text-orange-300 mb-1">🎓 Enrolled Students</div>
                  <p className="text-gray-300">Exclusive resources for course students</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-2xl flex items-center justify-center space-x-2"
              >
                <Rocket className="w-5 h-5" />
                <span>🚀 Enroll Now & Join Staran</span>
              </button>
              
              {!user && (
                <Link
                  to="/signup"
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Sign Up for Free Access</span>
                </Link>
              )}
              
              <Link
                to="/about"
                className="bg-transparent border-2 border-yellow-500 text-yellow-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 hover:text-black transition-all duration-200"
              >
                Meet the Creator
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20">
                  <div className="text-yellow-300 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <p className="text-gray-300 text-sm">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value)
                  setSelectedCategory('all')
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {Object.keys(publicationTypes).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              {selectedType !== 'all' && selectedType !== 'Newsletter' && publicationTypes[selectedType as keyof typeof publicationTypes] && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {publicationTypes[selectedType as keyof typeof publicationTypes].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : selectedType === 'all' ? (
            // Show all categories when no filter is selected
            <div className="space-y-16">
              {/* Books Section */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">📚 Books</h2>
                </div>
                
                {publicationTypes.Book.map(category => {
                  const items = getItemsByTypeAndCategory('Book', category, 5)
                  if (items.length === 0) return null
                  
                  return (
                    <div key={category} className="mb-12">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">{category}</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map(item => (
                          <LibraryCard key={item.id} item={item} isEnrolledStudent={isEnrolledStudent} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Articles Section */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">📄 Articles</h2>
                </div>
                
                {publicationTypes.Article.map(category => {
                  const items = getItemsByTypeAndCategory('Article', category, 5)
                  if (items.length === 0) return null
                  
                  return (
                    <div key={category} className="mb-12">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">{category}</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map(item => (
                          <LibraryCard key={item.id} item={item} isEnrolledStudent={isEnrolledStudent} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Projects Section */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">🚀 Projects</h2>
                </div>
                
                {publicationTypes.Project.map(category => {
                  const items = getItemsByTypeAndCategory('Project', category, 5)
                  
                  return (
                    <div key={category} className="mb-12">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">{category}</h3>
                      {items.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {items.map(item => (
                            <LibraryCard key={item.id} item={item} isEnrolledStudent={isEnrolledStudent} />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 text-center">
                          <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                          <h4 className="text-lg font-bold text-orange-800 mb-2">Restricted/Not Available</h4>
                          <p className="text-orange-700">This content is exclusively available to enrolled students.</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* GitHub Section */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-black rounded-xl flex items-center justify-center mr-4">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">💻 GitHub Repositories</h2>
                </div>
                
                {publicationTypes.GitHub.map(category => {
                  const items = getItemsByTypeAndCategory('GitHub', category, 5)
                  
                  return (
                    <div key={category} className="mb-12">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">{category}</h3>
                      {items.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {items.map(item => (
                            <LibraryCard key={item.id} item={item} isEnrolledStudent={isEnrolledStudent} />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 text-center">
                          <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                          <h4 className="text-lg font-bold text-orange-800 mb-2">Restricted/Not Available</h4>
                          <p className="text-orange-700">This content is exclusively available to enrolled students.</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Newsletter Section */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">📧 Newsletters</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getNewsletterItems(20).map(item => (
                    <LibraryCard key={item.id} item={item} isEnrolledStudent={isEnrolledStudent} />
                  ))}
                </div>
              </div>

              {/* Datasets & Cheatsheets Section */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">📊 Datasets & Cheatsheets</h2>
                </div>
                
                {publicationTypes['Datasets & Cheatsheets'].map(category => {
                  const items = getItemsByTypeAndCategory('Datasets & Cheatsheets', category, 5)
                  if (items.length === 0) return null
                  
                  return (
                    <div key={category} className="mb-12">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">{category}</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map(item => (
                          <LibraryCard key={item.id} item={item} isEnrolledStudent={isEnrolledStudent} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            // Show filtered results
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {selectedType} {selectedCategory !== 'all' ? `- ${selectedCategory}` : ''}
              </h2>
              
              {filteredItems.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <LibraryCard key={item.id} item={item} isEnrolledStudent={isEnrolledStudent} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Content Found</h3>
                  <p className="text-gray-600 mb-8">
                    {(selectedType === 'Project' || selectedType === 'GitHub') 
                      ? 'This content is restricted or not available yet.'
                      : 'No content matches your search criteria.'}
                  </p>
                  {!user && (
                    <Link
                      to="/signup"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Sign Up for More Access
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Access Premium AI Resources?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who are advancing their AI careers with Staran's curated resources. 
            Sign up for free access or enroll in our courses for exclusive premium content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  📝 Sign Up for Free
                </Link>
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
                >
                  🚀 Enroll in Courses
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  📊 Go to Dashboard
                </Link>
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
                >
                  🚀 Enroll in More Courses
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultCourse=""
      />
    </div>
  )
}

export default Library