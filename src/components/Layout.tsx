import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import PaymentModal from './PaymentModal'
import { User, LogOut, Menu, X, Phone, Mail, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const { isAdminAuthenticated, adminLogout } = useAdminAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  // Ensure floating button is always visible
  useEffect(() => {
    const ensureButtonVisibility = () => {
      const button = document.getElementById('floating-payment-button')
      if (button) {
        // Force visibility styles
        button.style.position = 'fixed'
        button.style.bottom = '24px'
        button.style.right = '24px'
        button.style.zIndex = '9999'
        button.style.display = 'flex'
        button.style.visibility = 'visible'
        button.style.opacity = '1'
        button.style.pointerEvents = 'auto'
      }
    }

    // Run immediately and on DOM changes
    ensureButtonVisibility()
    const observer = new MutationObserver(ensureButtonVisibility)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [location.pathname])

  const navigation = [
    { name: 'Home', href: '/' },
    { 
      name: 'AI Development For Tech Professionals', 
      href: '/courses',
      dropdown: [
        { name: 'All Courses', href: '/courses' },
        { name: 'Agentic AI Development', href: '/courses/agentic-ai' },
        { name: 'Vibe Coding', href: '/courses/vibe-coding' },
        { name: 'Python for ML & AI', href: '/courses/python-ml-ai' },
        { name: 'Other Courses', href: '/courses/other' }
      ]
    },
    { 
      name: 'AI Certification for Non-Tech Professionals', 
      href: '/ai-certification',
      dropdown: [
        { name: 'AI Certification for Banking & Finance Professionals', href: '/ai-certification' },
        { name: 'AI Certification for Pharma & FMCG Professionals', href: '/ai-certification/pharma-fmcg' },
        { name: 'AI Certification for Sales Professionals', href: '/ai-certification/sales' },
        { name: 'AI Certification for Marketing Management', href: '/ai-certification/marketing' },
        { name: 'AI Certification for HR, Project & Product Management', href: '/ai-certification/hr-project' },
        { name: 'Exclusive for Startups & Entrepreneurs', href: '/ai-certification/startups' },
        { name: 'AI for CXOs', href: '/ai-certification/cxo' }
      ]
    },
    { name: 'Build AI Projects', href: '/build-ai-projects' },
    { name: 'Find an AI Job', href: '/find-ai-job' },
    { name: "Staran's eBook Library", href: '/library' },
    { name: 'About Instructor', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  const handleSignOut = async () => {
    await signOut()
    // Also logout admin if authenticated
    if (isAdminAuthenticated) {
      adminLogout()
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">WithArijit<span className="text-sm font-normal">.com</span></span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setDropdownOpen(item.name)}
                      onMouseLeave={() => {
                        // Add a small delay before closing to prevent flickering
                        setTimeout(() => setDropdownOpen(null), 150)
                      }}
                    >
                      <Link
                        to={item.href}
                        className={`relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group flex items-center space-x-1 ${
                          location.pathname === item.href || location.pathname.startsWith('/courses')
                            ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transform scale-105'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md hover:scale-105'
                        }`}
                      >
                        <span className="relative z-10">{item.name}</span>
                        <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {!(location.pathname === item.href || location.pathname.startsWith('/courses')) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        )}
                      </Link>
                      
                      {/* Dropdown Menu */}
                      {dropdownOpen === item.name && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 transform opacity-100 scale-100 transition-all duration-200"
                          onMouseEnter={() => setDropdownOpen(item.name)}
                          onMouseLeave={() => setDropdownOpen(null)}
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.href}
                              className={`block px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                location.pathname === dropdownItem.href
                                  ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 mx-2 rounded-lg'
                                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 mx-2 rounded-lg'
                              }`}
                              onClick={() => setDropdownOpen(null)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group ${
                        location.pathname === item.href
                          ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transform scale-105'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md hover:scale-105'
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {location.pathname !== item.href && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/signin"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Free Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <Link
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
                          location.pathname === item.href || location.pathname.startsWith('/courses')
                            ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                        }`}
                      >
                        {item.name}
                      </Link>
                      <div className="ml-4 mt-2 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              location.pathname === dropdownItem.href
                                ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-500'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
                        location.pathname === item.href
                          ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {user ? (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
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
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl mx-0 text-center hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Free Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Register Now Floating Button - Only for non-authenticated users */}
      {!location.pathname.includes('/signin') && !location.pathname.includes('/signup') && !location.pathname.includes('/forgot-password') && !location.pathname.includes('/zodiac-premium-ai') && (
        <div className="floating-button bottom-6 right-6">
          <button
            onClick={() => setPaymentModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 min-w-max whitespace-nowrap"
            id="floating-payment-button"
          >
            <span>💳 Pay Now to Book Your Seat</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-bold">WithArijit<span className="text-sm font-normal">.com</span></span>
              </div>
              <p className="text-gray-400 mb-4">
                Learn Agentic AI & Vibe Coding with expert instruction from Arijit Chowdhury.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>+91 99300 51053</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>AI@withArijit.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span>www.AIwitharijit.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/ai-readiness-quiz"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Check your AI-Readiness
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ai-certificate-application"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    AI Certificate Application Form
                  </Link>
                </li>
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Course Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/courses/agentic-ai"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Agentic AI Course
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses/vibe-coding"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Vibe Coding Course
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses/python-ml-ai"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Python for ML & AI
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses/other"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Other Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/masterclass"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Master Class
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses#quantum-computing"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Quantum Computing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses#business-intelligence"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Business Intelligence
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses#excel-automation"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Excel Automation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/library"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Staran's eBook Library
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">
                    Shipping & Exchange
                  </Link>
                </li>
                <li>
                  <Link to="/zodiac-premium-ai" className="text-gray-400 hover:text-white transition-colors">
                    Zodiac Premium AI Course
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Admin Tools</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/admin/sessions" className="text-gray-400 hover:text-white transition-colors">
                    Manage Sessions
                  </Link>
                </li>
                <li>
                  <Link to="/admin/students" className="text-gray-400 hover:text-white transition-colors">
                    Assign Student Batches
                  </Link>
                </li>
                <li>
                  <Link to="/admin/session-links" className="text-gray-400 hover:text-white transition-colors">
                    Manage Session Links
                  </Link>
                </li>
                <li>
                  <Link to="/admin/certificates" className="text-gray-400 hover:text-white transition-colors">
                    Manage Certificates
                  </Link>
                </li>
                <li>
                  <Link to="/admin/library" className="text-gray-400 hover:text-white transition-colors">
                    Manage Library Content
                  </Link>
                </li>
                <li>
                  <Link to="/admin/ai-spot-management" className="text-gray-400 hover:text-white transition-colors">
                    AI Spot Management
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2024 Star Analytix. AIwithArijit & withArijit are the educational brands under Star Analytix. Empowering the next generation of AI developers.
            </p>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultCourse=""
      />
    </div>
  )
}

export default Layout