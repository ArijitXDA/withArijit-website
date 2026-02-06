import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from '../components/PaymentModal'
import { useState } from 'react'
import { 
  Briefcase, 
  Building, 
  Globe, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Star,
  Target,
  Rocket,
  Phone,
  DollarSign,
  Shield,
  BarChart3,
  Zap,
  BookOpen,
  Lightbulb,
  Cpu,
  MapPin,
  TrendingUp,
  Lock
} from 'lucide-react'

const FindAIJob: React.FC = () => {
  const { user } = useAuth()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const jobStats = [
    { number: '8000+', text: 'Partner Companies', icon: <Building className="w-8 h-8" />, color: 'text-blue-600' },
    { number: '17', text: 'Industry Sectors', icon: <BarChart3 className="w-8 h-8" />, color: 'text-green-600' },
    { number: '3', text: 'Countries', icon: <Globe className="w-8 h-8" />, color: 'text-purple-600' },
    { number: '340%', text: 'Increase your chance to get hired in AI augmented jobs within your industry', icon: <TrendingUp className="w-8 h-8" />, color: 'text-orange-600' }
  ]

  const countries = [
    {
      name: 'India',
      flag: '🇮🇳',
      description: 'Access to top Indian companies, startups, and unicorns',
      sectors: 'IT & Software, Banking & Financial Services, Healthcare & Pharmaceuticals, E-commerce & Retail, Fintech & Digital Payments, Manufacturing & Automotive, Consulting & Professional Services, Education & EdTech, Energy & Utilities, Government & Public Sector'
    },
    {
      name: 'United States',
      flag: '🇺🇸',
      description: 'Fortune 500 companies and Silicon Valley opportunities',
      sectors: 'Technology Giants (Google, Microsoft, Apple), Startups & Unicorns, Investment Banking & Finance, Healthcare & Biotech, Management Consulting, Media & Entertainment, Aerospace & Defense, Real Estate & PropTech, Legal & LegalTech'
    },
    {
      name: 'Canada',
      flag: '🇨🇦',
      description: 'Tech hubs and innovation centers across major cities',
      sectors: 'Technology & AI Labs, Banking & Financial Institutions, Government & Public Services, Research & Development, Healthcare & MedTech, Energy & Natural Resources, Transportation & Logistics, Agriculture & FoodTech'
    }
  ]

  const industries = [
    { name: 'Technology & Software', icon: '💻' },
    { name: 'Banking & Financial Services', icon: '🏦' },
    { name: 'Healthcare & Pharmaceuticals', icon: '🏥' },
    { name: 'E-commerce & Retail', icon: '🛒' },
    { name: 'Consulting & Professional Services', icon: '💼' },
    { name: 'Manufacturing & Automotive', icon: '🏭' },
    { name: 'Media & Entertainment', icon: '🎬' },
    { name: 'Education & EdTech', icon: '🎓' },
    { name: 'Energy & Utilities', icon: '⚡' },
    { name: 'Real Estate & Construction', icon: '🏢' },
    { name: 'Transportation & Logistics', icon: '🚚' },
    { name: 'Agriculture & Food Tech', icon: '🌾' },
    { name: 'Government & Public Sector', icon: '🏛️' },
    { name: 'Non-Profit & Social Impact', icon: '🤝' },
    { name: 'Sports & Fitness', icon: '⚽' },
    { name: 'Travel & Hospitality', icon: '✈️' },
    { name: 'Legal & Compliance', icon: '⚖️' }
  ]

  const aiJobRoles = [
    { title: 'AI Engineer', salaryUSD: '$120K - $180K', salaryINR: '₹1.0Cr - ₹1.5Cr', demand: 'Very High' },
    { title: 'Machine Learning Engineer', salaryUSD: '$110K - $170K', salaryINR: '₹90L - ₹1.4Cr', demand: 'Very High' },
    { title: 'Data Scientist', salaryUSD: '$100K - $160K', salaryINR: '₹80L - ₹1.3Cr', demand: 'High' },
    { title: 'AI Product Manager', salaryUSD: '$130K - $200K', salaryINR: '₹1.1Cr - ₹1.7Cr', demand: 'Very High' },
    { title: 'AI Research Scientist', salaryUSD: '$140K - $220K', salaryINR: '₹1.2Cr - ₹1.8Cr', demand: 'High' },
    { title: 'AI Solutions Architect', salaryUSD: '$150K - $250K', salaryINR: '₹1.2Cr - ₹2.1Cr', demand: 'Very High' },
    { title: 'AI Consultant', salaryUSD: '$120K - $200K', salaryINR: '₹1.0Cr - ₹1.7Cr', demand: 'High' },
    { title: 'AI Ethics Specialist', salaryUSD: '$90K - $140K', salaryINR: '₹75L - ₹1.2Cr', demand: 'Growing' },
    { title: 'AI Trainer/Educator', salaryUSD: '$80K - $130K', salaryINR: '₹65L - ₹1.1Cr', demand: 'Growing' },
    { title: 'AI Business Analyst', salaryUSD: '$85K - $135K', salaryINR: '₹70L - ₹1.1Cr', demand: 'High' },
    { title: 'AI Operations Engineer', salaryUSD: '$95K - $150K', salaryINR: '₹80L - ₹1.2Cr', demand: 'High' },
    { title: 'AI Security Specialist', salaryUSD: '$110K - $170K', salaryINR: '₹90L - ₹1.4Cr', demand: 'Very High' },
    { title: 'AI UX Designer', salaryUSD: '$90K - $140K', salaryINR: '₹75L - ₹1.2Cr', demand: 'Growing' },
    { title: 'AI Sales Engineer', salaryUSD: '$100K - $160K', salaryINR: '₹80L - ₹1.3Cr', demand: 'High' }
  ]

  const exclusiveBenefits = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Premium Job Matching",
      description: "AI-powered job matching based on your skills and preferences"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Direct Employer Connect",
      description: "Skip the queue with direct connections to hiring managers"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Portfolio Showcase",
      description: "Showcase your AI projects to potential employers"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Career Acceleration",
      description: "Fast-track your AI career with expert guidance"
    }
  ]

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High':
        return 'bg-red-100 text-red-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Growing':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg mb-8">
              <Lock className="w-6 h-6 mr-2" />
              This section is exclusive for enrolled students
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream
              <span className="block text-purple-300 text-3xl md:text-4xl mt-2">
                AI Job
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Enrolled students can apply to AI-based jobs available with 8000+ employers, 
              from 17 different sectors, in USA, Canada & India
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>📝 Sign Up</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>🚀 Enroll Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>📊 Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>🚀 Enroll in More Courses</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {jobStats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className={`${stat.color} mb-2 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <p className="text-blue-200 text-sm">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Job Opportunities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🌍 Global AI Job Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access exclusive AI job opportunities across three major markets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {countries.map((country, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-center">
                <div className="text-6xl mb-4">{country.flag}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{country.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{country.description}</p>
                
                <div className="text-sm text-gray-600 text-left">
                  <strong>Key Sectors:</strong> {country.sectors}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 17 Industry Sectors */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🏢 17 Industry Sectors
            </h2>
            <p className="text-xl text-gray-600">
              AI opportunities across diverse industries and business sectors
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="text-2xl mb-2">{industry.icon}</div>
                <div>
                  <h3 className="font-medium text-gray-900 text-xs leading-tight">{industry.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular AI Job Roles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              💼 Popular AI Job Roles
            </h2>
            <p className="text-xl text-gray-600">
              High-demand AI positions with competitive salaries (tentative market outlook on salary ranges)
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiJobRoles.map((role, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">{role.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDemandColor(role.demand)}`}>
                    {role.demand}
                  </span>
                </div>
                <div className="space-y-2 mb-2">
                  <div className="text-lg font-bold text-green-600">{role.salaryUSD}</div>
                  <div className="text-lg font-bold text-blue-600">{role.salaryINR}</div>
                </div>
                <p className="text-gray-600 text-xs">Annual salary ranges (tentative market outlook)</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Benefits for Enrolled Students */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎯 Exclusive Benefits for Enrolled Students
            </h2>
            <p className="text-xl text-gray-600">
              Premium job placement support and career acceleration services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {exclusiveBenefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🚀 How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple 3-step process to access exclusive AI job opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enroll in Course</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete enrollment in any of our AI certification programs or courses
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Build Your Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete your AI skills assessment and build your professional portfolio
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Matched</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive personalized job matches and direct employer connections
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Access Requirements */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🔐 Access Requirements
            </h2>
            <p className="text-xl text-gray-600">
              To access our exclusive AI job portal, you need to be an enrolled student
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">✅ Eligible Students</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700">Enrolled in any AI certification program</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700">Completed Agentic AI or Vibe Coding courses</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700">Active students in Python ML & AI program</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700">Build AI Projects program participants</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 What You Get</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Star className="w-6 h-6 text-yellow-500" />
                      <span className="text-gray-700">Access to 8000+ partner companies</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-6 h-6 text-blue-500" />
                      <span className="text-gray-700">Jobs across USA, Canada & India</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="w-6 h-6 text-purple-500" />
                      <span className="text-gray-700">17 different industry sectors</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Rocket className="w-6 h-6 text-orange-500" />
                      <span className="text-gray-700">Priority placement support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Access Exclusive AI Jobs?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their careers with our AI courses 
            and gained access to premium job opportunities worldwide.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                📝 Sign Up Now
              </Link>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                🚀 Enroll in Course
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                📊 Go to Dashboard
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                Contact for Job Access
              </Link>
            </div>
          )}
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

export default FindAIJob