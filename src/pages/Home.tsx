import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from '../components/PaymentModal'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Brain, 
  Code, 
  Star, 
  Users, 
  Award, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Zap,
  ArrowRight,
  BookOpen,
  Target,
  Rocket,
  Phone,
  Building,
  BarChart3,
  Briefcase,
  DollarSign,
  Globe,
  Lightbulb,
  Database,
  Calculator
} from 'lucide-react'

const Home: React.FC = () => {
  const { user } = useAuth()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [dbTest, setDbTest] = useState<string>('Testing...')

  // Test database connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...')
        console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
        console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
        
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1)
        
        if (error) {
          console.error('Database test error:', error)
          setDbTest(`❌ DB Error: ${error.message}`)
        } else {
          console.log('Database test success:', data)
          setDbTest('✅ Database Connected!')
        }
      } catch (err) {
        console.error('Connection test failed:', err)
        setDbTest(`❌ Connection Failed: ${err.message}`)
      }
    }
    
    testConnection()
  }, [])

  const handleEnrollNow = (courseName: string) => {
    setSelectedCourse(courseName)
    setPaymentModalOpen(true)
  }
  const benefits = [
    "Master cutting-edge Agentic AI development from industry expert",
    "Build production-ready AI applications with real-world projects",
    "Learn both theoretical foundations and practical implementation",
    "Get lifetime access to course materials and community support",
    "Develop skills in high-demand AI technologies and frameworks"
  ]

  const testimonials = [
    {
      name: 'Dr. Harish B Suri',
      role: 'Professor | IIM Mumbai | IIT Kharagpur | FMS Delhi | Business Consultant | Coach',
      text: 'Arijit\'s grip on data sciences is superb and his analytical skills cut across various industry verticals. I\'ve observed him closely during consultancy projects across Pharma, Banking, Manufacturing, Retail & Telecom. His operational skills span from Excel/Power BI to complex AI-ML algorithms. He transforms raw data into logical dashboards that empower management decisions. His solutions are incisive and jargon-free, making them accessible to all. I wish him great success.',
      rating: 5,
      image: '👨‍🎓'
    },
    {
      name: 'Sourav Choudhury',
      role: 'LinkedIn Trainer | Business Coach | Mentor | KJSIM | IIM Mumbai | NMIMS | IIM Ahmedabad',
      text: 'Arijit mentored and coached me with dedication and strategic insight. His blend of technical expertise and practical thinking helped me advance in data science. He\'s a meticulous teacher with exceptional communication skills, fostering a positive learning environment. I highly recommend him for any opportunity—his professionalism and enthusiasm are unmatched.',
      rating: 5,
      image: '👨‍💼'
    },
    {
      name: 'Suvajit Ray',
      role: 'Head of Product & Distribution, IIFL Capital',
      text: 'Arijit is a versatile professional, excelling as both a business leader and entrepreneur. His transformations are inspiring. I\'ve benefited from his instruction in BIU and Cognitive AI. He simplifies complex concepts with ease and applies numerical analysis with mastery. Truly a standout in his field.',
      rating: 5,
      image: '👨‍💼'
    },
    {
      name: 'Kunal Mitra Mustaphi',
      role: 'Senior Claims Specialist, Munich Re | ISBR Business School | Consultant | Mentor',
      text: 'Arijit is a thorough professional with deep domain knowledge. He translates complex strategies into clear roadmaps. His analytical mind and solution-oriented approach set him apart. I wish him continued success in all his endeavors.',
      rating: 5,
      image: '👨‍💻'
    }
  ]

  const stats = [
    { number: '10000+', text: 'Students Trained', icon: <Users className="w-8 h-8" /> },
    { number: '95%', text: 'Success Rate', icon: <TrendingUp className="w-8 h-8" /> },
    { number: '100+', text: 'AI Projects Built', icon: <Rocket className="w-8 h-8" /> },
    { number: '4.9/5', text: 'Average Rating', icon: <Star className="w-8 h-8" /> }
  ]

  const techCourses = [
    {
      title: "Agentic AI Development",
      description: "Master the art of building intelligent AI agents that can think, reason, and act autonomously.",
      icon: <Brain className="w-8 h-8" />,
      gradient: "from-blue-600 to-indigo-600",
      link: "/courses/agentic-ai",
      course: "Agentic AI",
      features: ["Multi-LLM Integration", "Advanced Agent Frameworks", "Production Deployment", "Enterprise Architecture"]
    },
    {
      title: "Vibe Coding",
      description: "Experience coding like never before with our innovative interactive development methodology.",
      icon: <Code className="w-8 h-8" />,
      gradient: "from-green-600 to-teal-600",
      link: "/courses/vibe-coding",
      course: "Vibe Coding",
      features: ["Interactive Learning", "Real-time Collaboration", "Project-Based Learning", "Industry Best Practices"]
    },
    {
      title: "Python for ML & AI",
      description: "Complete Python mastery program with two specialized tracks for different experience levels.",
      icon: <Code className="w-8 h-8" />,
      gradient: "from-purple-600 to-pink-600",
      link: "/courses/python-ml-ai",
      course: "Python for ML & AI",
      features: ["Python Fundamentals", "Machine Learning", "Deep Learning", "AI Applications"]
    },
    {
      title: "Build AI Projects",
      description: "16-week intensive program to build 22+ enterprise-grade AI projects worth $2.5M+ in market value.",
      icon: <Rocket className="w-8 h-8" />,
      gradient: "from-orange-600 to-red-600",
      link: "/build-ai-projects",
      course: "Build AI Projects",
      features: ["22+ Enterprise Projects", "Production Ready", "Portfolio Building", "Expert Mentorship"]
    }
  ]

  const certificationCourses = [
    {
      title: "Banking & Finance Professionals",
      description: "AI certification designed specifically for banking and finance industry professionals.",
      icon: <Building className="w-8 h-8" />,
      gradient: "from-blue-600 to-cyan-600",
      link: "/ai-certification",
      course: "4 Months AI Certification For Professionals",
      features: ["32 AI Tools", "Industry-Specific", "Job Access", "Professional Certification"]
    },
    {
      title: "Pharma & FMCG Professionals",
      description: "Specialized AI certification for pharmaceutical and FMCG industry professionals.",
      icon: <Lightbulb className="w-8 h-8" />,
      gradient: "from-green-600 to-emerald-600",
      link: "/ai-certification/pharma-fmcg",
      course: "4 Months AI Certification For Professionals",
      features: ["Industry Applications", "Regulatory Compliance", "Process Optimization", "Data Analytics"]
    },
    {
      title: "Sales Professionals",
      description: "AI certification tailored for sales leaders and professionals to enhance performance.",
      icon: <TrendingUp className="w-8 h-8" />,
      gradient: "from-red-600 to-pink-600",
      link: "/ai-certification/sales",
      course: "4 Months AI Certification For Professionals",
      features: ["Sales Automation", "Customer Analytics", "Lead Generation", "Performance Tracking"]
    },
    {
      title: "Marketing Management",
      description: "Comprehensive AI certification for marketing managers and digital marketing professionals.",
      icon: <BarChart3 className="w-8 h-8" />,
      gradient: "from-purple-600 to-indigo-600",
      link: "/ai-certification/marketing",
      course: "4 Months AI Certification For Professionals",
      features: ["Campaign Optimization", "Content Creation", "Analytics", "Customer Insights"]
    },
    {
      title: "HR, Project & Product Management",
      description: "AI certification for HR professionals, project managers, and product management roles.",
      icon: <Users className="w-8 h-8" />,
      gradient: "from-teal-600 to-cyan-600",
      link: "/ai-certification/hr-project",
      course: "4 Months AI Certification For Professionals",
      features: ["Talent Management", "Project Automation", "Performance Analytics", "Strategic Planning"]
    },
    {
      title: "Startups & Entrepreneurs",
      description: "Exclusive AI certification program designed for startup founders and entrepreneurs.",
      icon: <Rocket className="w-8 h-8" />,
      gradient: "from-orange-600 to-yellow-600",
      link: "/ai-certification/startups",
      course: "4 Months AI Certification For Professionals",
      features: ["Business Strategy", "Innovation", "Scaling", "Competitive Advantage"]
    }
  ]

  const cxoProgram = {
    title: "AI for CXOs",
    description: "Executive AI leadership program designed exclusively for C-suite executives and senior leaders.",
    icon: <Target className="w-8 h-8" />,
    gradient: "from-black via-gray-900 to-black",
    link: "/ai-certification/cxo",
    course: "4 Months AI Certification For Professionals",
    features: ["Executive AI Strategy", "Leadership Transformation", "Premium Certification", "Global Recognition"]
  }

  const additionalCourses = [
    {
      title: "Quantum Computing",
      description: "Advanced quantum computing concepts and applications in AI and business.",
      icon: <Zap className="w-8 h-8" />,
      gradient: "from-violet-600 to-purple-600",
      link: "/courses#quantum-computing",
      course: "Quantum Computing",
      features: ["Quantum Algorithms", "Quantum ML", "Business Applications", "Future Technologies"]
    },
    {
      title: "Business Intelligence",
      description: "Comprehensive BI training with modern analytics and visualization tools.",
      icon: <BarChart3 className="w-8 h-8" />,
      gradient: "from-blue-600 to-teal-600",
      link: "/courses#business-intelligence",
      course: "PowerBI & Tableau",
      features: ["Data Visualization", "Dashboard Creation", "Analytics", "Reporting"]
    },
    {
      title: "Excel Automation",
      description: "Master advanced Excel automation and O365 integration for business efficiency.",
      icon: <Calculator className="w-8 h-8" />,
      gradient: "from-green-600 to-blue-600",
      link: "/courses#excel-automation",
      course: "O365 & Excel Automation",
      features: ["Advanced Formulas", "VBA Programming", "Automation", "O365 Integration"]
    },
    {
      title: "Corporate Training",
      description: "Customized AI training programs for enterprises and large organizations.",
      icon: <Building className="w-8 h-8" />,
      gradient: "from-gray-600 to-slate-600",
      link: "/courses#corporate-training",
      course: "Corporate Training",
      features: ["Custom Curriculum", "Enterprise Focus", "Team Training", "Organizational AI"]
    }
  ]
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Learn Agentic AI & Vibe Coding
              <span className="block text-blue-300 text-3xl md:text-4xl mt-2">
                with Arijit Chowdhury
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Master the future of AI development with hands-on training from industry expert. 
              Build intelligent agents and applications that solve real-world problems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/ai-readiness-quiz"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Check your AI Readiness Score</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Go to Dashboard
                </Link>
              )}
              <Link
                to="/signin"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Sign-In Or Free Sign-up
              </Link>
              <Link
                to="/ai-certificate-application"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Apply for a free AI certification course
              </Link>
              <Link
                to="/ai-spots"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                🍕☕ Find AI Spots Near You
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-blue-300 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <p className="text-blue-200 text-sm">{stat.text}</p>
                </div>
              ))}
            </div>

            {/* Perfect For Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4 text-center">🎯 Perfect for:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">💼</div>
                  <span className="text-white text-sm font-medium">Entrepreneurs</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">💻</div>
                  <span className="text-white text-sm font-medium">Tech Professionals</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">👔</div>
                  <span className="text-white text-sm font-medium">Business Leaders</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">🎓</div>
                  <span className="text-white text-sm font-medium">Students</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">🤖</div>
                  <span className="text-white text-sm font-medium">AI Enthusiasts</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <span className="text-white text-sm font-medium">Data Scientists</span>
                </div>
              </div>
            </div>

            {/* Course Highlights */}
            {/* Course Highlights - Compact */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-5xl mx-auto">
              {/* Database Connection Test */}
              <div className="mb-4 text-center">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                  <span className="text-white text-sm font-mono">{dbTest}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-medium flex items-center space-x-1">
                  <span>🎥</span><span>Live Sessions</span>
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-medium flex items-center space-x-1">
                  <span>🛠️</span><span>Real Projects</span>
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-medium flex items-center space-x-1">
                  <span>📅</span><span>Weekend Classes</span>
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-medium flex items-center space-x-1">
                  <span>🏆</span><span>Industry Certificate</span>
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-medium flex items-center space-x-1">
                  <span>🌍</span><span>Global Time Zones</span>
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-medium flex items-center space-x-1">
                  <span>💰</span><span>From ₹2999/month</span>
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-medium flex items-center space-x-1">
                  <span>⏰</span><span>4-Month Duration</span>
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-medium flex items-center space-x-1">
                  <span>🔬</span><span>Expert Instructed</span>
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-medium flex items-center space-x-1">
                  <span>🏭</span><span>Industrial Implementation</span>
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white font-medium flex items-center space-x-1">
                  <span>♾️</span><span>Lifetime Access</span>
                </span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Course Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transform Your Career with AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive courses designed to take you from beginner to expert in AI development
            </p>
          </div>

          {/* AI Development For Tech Professionals */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              🖥️ AI Development For Tech Professionals
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {techCourses.map((course, index) => (
                <div key={index} className={`bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${course.gradient} rounded-xl flex items-center justify-center mr-3 text-white`}>
                      {course.icon}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{course.title}</h4>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{course.description}</p>
                  
                  <div className="mb-4 text-center">
                    <div className="text-lg font-bold text-green-600">Starting ₹2,999/month</div>
                    <div className="text-sm text-gray-500">4-month duration</div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {course.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link
                      to={course.link}
                      className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Learn More</span>
                    </Link>
                    <button
                      onClick={() => handleEnrollNow(course.course)}
                      className={`inline-flex items-center justify-center space-x-2 bg-gradient-to-r ${course.gradient} text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm`}
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Certification for Non-Tech Professionals */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              🏢 AI Certification for Non-Tech Professionals
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificationCourses.map((course, index) => (
                <div key={index} className={`bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${course.gradient} rounded-xl flex items-center justify-center mr-3 text-white`}>
                      {course.icon}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{course.title}</h4>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{course.description}</p>
                  
                  <div className="mb-4 text-center">
                    <div className="text-lg font-bold text-green-600">Starting ₹2,999/month</div>
                    <div className="text-sm text-gray-500">4-month duration</div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {course.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link
                      to={course.link}
                      className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Learn More</span>
                    </Link>
                    <button
                      onClick={() => handleEnrollNow(course.course)}
                      className={`inline-flex items-center justify-center space-x-2 bg-gradient-to-r ${course.gradient} text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm`}
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI for CXOs - Premium Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              👑 Executive Leadership Program
            </h3>
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 group">
                {/* Premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-xl"></div>
                
                <div className="relative p-8">
                  {/* Premium badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black rounded-full text-sm font-bold mb-6 shadow-lg">
                    <div className="w-2 h-2 bg-black rounded-full mr-2 animate-pulse"></div>
                    EXECUTIVE PROGRAM
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
                      <Target className="w-8 h-8 text-black" />
                    </div>
                    <h4 className="text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">{cxoProgram.title}</h4>
                  </div>
                  
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{cxoProgram.description}</p>
                  
                  <div className="mb-6 text-center">
                    <div className="text-xl font-bold text-yellow-400">Starting ₹2,999/month</div>
                    <div className="text-sm text-gray-400">8-month executive program</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {cxoProgram.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <Link
                      to={cxoProgram.link}
                      className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 px-6 py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 hover:text-white transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/40"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>Executive Details</span>
                    </Link>
                    <button
                      onClick={() => handleEnrollNow(cxoProgram.course)}
                      className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-6 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-xl hover:shadow-yellow-500/25 transform hover:scale-105"
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Courses */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              📚 Additional Courses & Programs
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalCourses.map((course, index) => (
                <div key={index} className={`bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${course.gradient} rounded-xl flex items-center justify-center mr-3 text-white`}>
                      {course.icon}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{course.title}</h4>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{course.description}</p>
                  
                  <div className="mb-4 text-center">
                    <div className="text-lg font-bold text-green-600">Starting ₹2,999/month</div>
                    <div className="text-sm text-gray-500">4-month duration</div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {course.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link
                      to={course.link}
                      className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Learn More</span>
                    </Link>
                    <button
                      onClick={() => handleEnrollNow(course.course)}
                      className={`inline-flex items-center justify-center space-x-2 bg-gradient-to-r ${course.gradient} text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm`}
                    >
                      <span>Enroll Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive curriculum designed by industry experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Instructor Teaser */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Learn from the Expert
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Arijit Chowdhury brings over 15 years of experience in AI, machine learning, and data science. 
                As a trainer and research consultant, he has helped thousands of professionals transition into AI careers.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">18+ years industry experience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">10000+ students trained successfully</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">Expert in AI, BI & Agentic AI</span>
                </div>
              </div>
              
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6">
                <img 
                  src="/82597b4e-e193-45e5-a266-e303e029de30-removebg-preview.png" 
                  alt="Arijit Chowdhury - AI Expert and Trainer"
                  className="w-full h-full object-cover rounded-full shadow-lg"
                />
              </div>
              
              {/* Contact Bubbles */}
              <div className="flex justify-center space-x-4 mb-6">
                <a
                  href="https://wa.me/919930051053"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                  title="Chat on WhatsApp"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
                <a
                  href="tel:+919930051053"
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                  title="Call Now"
                >
                  <Phone className="w-6 h-6" />
                </a>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Arijit Chowdhury</h3>
              <p className="text-lg text-gray-600">Trainer & Research Consultant</p>
              <p className="text-blue-600 font-semibold">AI, BI & Agentic AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Industry Leaders Say
            </h2>
            <p className="text-xl text-gray-600">
              Testimonials from respected professionals and educators
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed text-sm">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-600 leading-tight">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who have successfully transitioned into AI careers. 
            Start your journey today with expert guidance and hands-on training.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultCourse={selectedCourse}
      />
    </div>
  )
}

export default Home