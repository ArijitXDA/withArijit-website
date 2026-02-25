import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import PaymentModal from './PaymentModal'
import CourseDropdown from './navigation/CourseDropdown'
import MobileNav from './navigation/MobileNav'
import { User, LogOut, Menu, X, Phone, Mail, Globe } from 'lucide-react'

// Lazy load the AI Chat widget (non-critical, loads after main content)
const AIChatWidget = lazy(() => import('./chat/AIChatWidget'))

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const { isAdminAuthenticated, adminLogout } = useAdminAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  // Ensure floating button is always visible
  useEffect(() => {
    const ensureButtonVisibility = () => {
      const button = document.getElementById('floating-payment-button')
      if (button) {
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

    ensureButtonVisibility()
    const observer = new MutationObserver(ensureButtonVisibility)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [location.pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    if (isAdminAuthenticated) {
      adminLogout()
    }
    setMobileMenuOpen(false)
  }

  // Simple nav items (non-dropdown)
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Build AI Projects', href: '/build-ai-projects' },
    { name: 'Find an AI Job', href: '/find-ai-job' },
    { name: "Staran's eBook Library", href: '/library' },
    { name: 'About Instructor', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  // Don't show chat widget on auth or admin pages
  const showChatWidget =
    !location.pathname.includes('/signin') &&
    !location.pathname.includes('/signup') &&
    !location.pathname.includes('/forgot-password') &&
    !location.pathname.includes('/reset-password') &&
    !location.pathname.includes('/admin')

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
              <span className="text-xl font-bold text-gray-900">
                WithArijit<span className="text-sm font-normal">.com</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* Home */}
              <Link
                to="/"
                className={`relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group ${
                  isActive('/')
                    ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md hover:scale-105'
                }`}
              >
                <span className="relative z-10">Home</span>
                {!isActive('/') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                )}
              </Link>

              {/* Courses Mega Dropdown */}
              <CourseDropdown onLinkClick={() => setMobileMenuOpen(false)} />

              {/* Other Nav Items */}
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group ${
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transform scale-105'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md hover:scale-105'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {!isActive(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  )}
                </Link>
              ))}
            </nav>

            {/* User Menu - Desktop */}
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
        <MobileNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          user={user}
          onSignOut={handleSignOut}
        />
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* oStaran AI Chat Widget - lazy loaded, shown on non-auth pages */}
      {showChatWidget && (
        <Suspense fallback={null}>
          <AIChatWidget />
        </Suspense>
      )}

      {/* Register Now Floating Button */}
      {!location.pathname.includes('/signin') &&
        !location.pathname.includes('/signup') &&
        !location.pathname.includes('/forgot-password') &&
        !location.pathname.includes('/zodiac-premium-ai') && (
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
            {/* Brand & Contact */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-bold">
                  WithArijit<span className="text-sm font-normal">.com</span>
                </span>
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

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/ai-readiness-quiz" className="text-gray-400 hover:text-white transition-colors">
                    Check your AI-Readiness
                  </Link>
                </li>
                <li>
                  <Link to="/ai-certificate-application" className="text-gray-400 hover:text-white transition-colors">
                    AI Certificate Application Form
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link to="/build-ai-projects" className="text-gray-400 hover:text-white transition-colors">
                    Build AI Projects
                  </Link>
                </li>
                <li>
                  <Link to="/find-ai-job" className="text-gray-400 hover:text-white transition-colors">
                    Find an AI Job
                  </Link>
                </li>
                <li>
                  <Link to="/library" className="text-gray-400 hover:text-white transition-colors">
                    Staran's eBook Library
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Instructor
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Course Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Course Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/courses/agentic-ai" className="text-gray-400 hover:text-white transition-colors">
                    Agentic AI Course
                  </Link>
                </li>
                <li>
                  <Link to="/courses/vibe-coding" className="text-gray-400 hover:text-white transition-colors">
                    Vibe Coding Course
                  </Link>
                </li>
                <li>
                  <Link to="/courses/python-ml-ai" className="text-gray-400 hover:text-white transition-colors">
                    Python for ML & AI
                  </Link>
                </li>
                <li>
                  <Link to="/courses/other" className="text-gray-400 hover:text-white transition-colors">
                    Other Courses
                  </Link>
                </li>
                <li>
                  <Link to="/masterclass" className="text-gray-400 hover:text-white transition-colors">
                    Master Class
                  </Link>
                </li>
                <li>
                  <Link to="/courses#quantum-computing" className="text-gray-400 hover:text-white transition-colors">
                    Quantum Computing
                  </Link>
                </li>
                <li>
                  <Link to="/courses#business-intelligence" className="text-gray-400 hover:text-white transition-colors">
                    Business Intelligence
                  </Link>
                </li>
                <li>
                  <Link to="/courses#excel-automation" className="text-gray-400 hover:text-white transition-colors">
                    Excel Automation
                  </Link>
                </li>
                <li>
                  <Link to="/library" className="text-gray-400 hover:text-white transition-colors">
                    Staran's eBook Library
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
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
