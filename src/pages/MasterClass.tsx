import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from '../components/PaymentModal'
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  CheckCircle, 
  ArrowRight,
  Star,
  Globe,
  Zap
} from 'lucide-react'

const MasterClass: React.FC = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const courseParam = searchParams.get('course') || ''
  const onlyRenewalParam = searchParams.get('onlyRenewal') === 'true'

  // Check for payment parameter in URL
  useEffect(() => {
    const paymentParam = searchParams.get('payment')
    if (paymentParam === 'true') {
      setPaymentModalOpen(true)
    }
  }, [searchParams])

  const handlePayNow = () => {
    setPaymentModalOpen(true)
  }

  const masterClasses = [
    {
      title: "AI Agent Development AND Vive Coding Masterclass",
      subtitle: "Complete AI Development Experience",
      duration: "2 Hours",
      format: "Live Interactive Session",
      description: "Experience both AI Agent Development and Vive Coding in one comprehensive masterclass. Learn to build intelligent AI agents and master interactive development techniques with hands-on guidance from industry expert Arijit Chowdhury.",
      highlights: [
        {
          icon: "🤖",
          title: "Live AI Agent Development",
          description: "Build intelligent agents in real-time with expert guidance"
        },
        {
          icon: "⚡",
          title: "Vibe Coding Methodology",
          description: "Experience revolutionary interactive development techniques"
        },
        {
          icon: "🛠️",
          title: "Complete Development Setup",
          description: "Get your AI development environment configured perfectly"
        },
        {
          icon: "💬",
          title: "Expert Q&A Session",
          description: "Direct interaction with industry veteran Arijit Chowdhury"
        },
        {
          icon: "📦",
          title: "Premium Resources Package",
          description: "Downloadable code templates, guides, and project starters"
        },
        {
          icon: "🏆",
          title: "Official Certification",
          description: "Verified certificate of completion for your portfolio"
        },
        {
          icon: "👥",
          title: "Exclusive Community Access",
          description: "Join our private network of AI professionals and learners"
        },
        {
          icon: "🔄",
          title: "Real-time Collaboration",
          description: "Learn advanced techniques for team-based AI development"
        }
      ],
      technologies: [
        {
          category: "AI Frameworks",
          items: ["OpenAI API", "Claude AI", "Gemini", "Grok", "Llama", "LangChain", "CrewAI"]
        },
        {
          category: "Development Tools",
          items: ["Cursor AI", "GitHub Copilot", "VS Code", "Python", "Jupyter"]
        },
        {
          category: "Low-Code Platforms",
          items: ["Bolt.new", "Lovable", "n8n", "Make.com"]
        },
        {
          category: "Databases",
          items: ["SQL", "Azure DB", "MySQL", "PostgreSQL"]
        },
        {
          category: "Deployment",
          items: ["Vercel", "Netlify", "Supabase", "GitHub"]
        }
      ],
      nextSession: "Sunday 12:30 PM IST (for India Time Zone participants) & Sunday 10 AM ET (for US/Canada Time Zone participants)",
      price: "₹199 / $4.99",
      gradient: "from-blue-600 via-purple-600 to-indigo-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn to develop AI Agents & Agentic AI systems yourself
            </h1>
            <p className="text-2xl md:text-3xl text-blue-200 mb-6">
              in just 2 hours
            </p>
            
            {/* Certificate Badge */}
            <div className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg mb-8">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Get Certified in Agentic AI
            </div>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Join our live masterclass and experience world-class AI training
              with hands-on learning and expert guidance
            </p>
            
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <Video className="w-6 h-6 text-blue-300" />
                <span className="text-blue-100">Live Interactive</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-green-300" />
                <span className="text-blue-100">Expert Instruction</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-300" />
                <span className="text-blue-100">This Sunday (only 2 hours)</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <span className="text-blue-100">Get certified instantly</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💰</span>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-200 line-through text-lg">₹3999/-</span>
                  <span className="text-blue-100 font-bold text-xl">₹199/-</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎁</span>
                <span className="text-blue-100">Bonus AI Agent Codes</span>
              </div>
            </div>
            
            {/* No Prior Skills Required */}
            <div className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg mb-6 inline-block">
              ✨ No prior technology skill required
            </div>
            
            {/* Target Audience */}
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
          </div>
        </div>
      </section>

      {/* Master Classes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {masterClasses.map((masterClass, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${masterClass.gradient} p-8 text-white`}>
                  <h3 className="text-2xl font-bold mb-2">{masterClass.title}</h3>
                  <p className="text-lg opacity-90 mb-4">{masterClass.subtitle}</p>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>{masterClass.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Video className="w-5 h-5" />
                      <span>{masterClass.format}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {masterClass.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">🎯 What You'll Get</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {masterClass.highlights.map((highlight, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl flex-shrink-0">{highlight.icon}</div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-1">{highlight.title}</h5>
                              <p className="text-sm text-gray-600">{highlight.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">🛠️ Technologies You'll Learn</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      {masterClass.technologies.map((tech, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <h5 className="font-bold text-gray-900 mb-3 text-center">{tech.category}</h5>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {tech.items.map((item, itemIdx) => (
                              <span key={itemIdx} className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Next Session</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg text-gray-500 line-through">₹3999/-</div>
                        <div className="text-2xl font-bold text-green-600">₹199/-</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-blue-100">
                        <span className="text-2xl">🇮🇳</span>
                        <div>
                          <div className="font-semibold text-gray-900">India Time Zone</div>
                          <div className="text-blue-600 font-medium">Sunday 12:30 PM IST</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-green-100">
                        <span className="text-2xl">🇺🇸🇨🇦</span>
                        <div>
                          <div className="font-semibold text-gray-900">US & Canada Time Zone</div>
                          <div className="text-green-600 font-medium">Sunday 10:00 AM ET</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handlePayNow}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-colors text-center flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <span>Pay Now to Book Your Seat</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🏆 Get Officially Certified in Agentic AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Receive a professional certificate that validates your AI Agent development skills 
              and enhances your career prospects
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-gradient-to-r from-yellow-400 to-orange-500">
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg mb-4">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Official Certificate Sample
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="/MC_Sample_Certificate.jpg" 
                  alt="Official Agentic AI Masterclass Certificate Sample"
                  className="w-full h-auto rounded-xl shadow-lg border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
              
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <div className="text-3xl mb-3">🎓</div>
                  <h3 className="font-bold text-gray-900 mb-2">Instant Certification</h3>
                  <p className="text-sm text-gray-600">Get your certificate immediately after completing the 2-hour masterclass</p>
                </div>
                
                <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <div className="text-3xl mb-3">🔗</div>
                  <h3 className="font-bold text-gray-900 mb-2">LinkedIn Ready</h3>
                  <p className="text-sm text-gray-600">Perfect for showcasing your AI skills on professional networks</p>
                </div>
                
                <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="font-bold text-gray-900 mb-2">Industry Recognition</h3>
                  <p className="text-sm text-gray-600">Recognized certificate from industry expert Arijit Chowdhury</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg p-4">
                  <p className="text-yellow-800 font-semibold mb-2">
                    💰 All this for just ₹199 (was ₹3999)
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Professional certification + 2 hours of expert training + bonus resources + community access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Attend Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Attend Our Master Classes?
            </h2>
            <p className="text-xl text-gray-600">
              Get a taste of our world-class training methodology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hands-On Learning</h3>
              <p className="text-gray-600">Experience our interactive teaching methodology with real coding sessions</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Learn directly from Arijit Chowdhury with 15+ years of industry experience</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Community</h3>
              <p className="text-gray-600">Connect with like-minded professionals from around the world</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience World-Class AI Training?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our free masterclasses and discover why thousands of professionals 
            choose WithArijit for their AI learning journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  to="/contact"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  🚀 Get Session Details
                </Link>
              </>
            ) : (
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                🚀 Get Session Details
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultCourse={courseParam || "Masterclass"}
        onlyRenewalOption={onlyRenewalParam}
      />
    </div>
  )
}

export default MasterClass