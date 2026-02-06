import React from 'react'
import PaymentModal from '../components/PaymentModal'
import { Target, TrendingUp, Shield, Users, BarChart3, Globe, Award, CheckCircle, ArrowRight } from 'lucide-react'

export default function AICertificationCXO() {
  const [showPaymentModal, setShowPaymentModal] = React.useState(false)

  const handleEnrollClick = () => {
    setShowPaymentModal(true)
  }

  const cxoLearningPaths = [
    {
      title: "CEO & COO",
      description: "Use Julius AI and Advance Excel with AI for market analysis and operational efficiency. Build fraud detection models and enterprise-wide automation with n8n and ClickUp.",
      color: "border-yellow-400"
    },
    {
      title: "CFO & CRO", 
      description: "Conduct financial analysis and anomaly detection. Lead risk management projects using AI-powered tools.",
      color: "border-yellow-400"
    },
    {
      title: "CMO",
      description: "Create high-impact marketing campaigns with Gamma AI and Canva Magic Studio. Automate customer engagement using Tidio AI.",
      color: "border-yellow-400"
    },
    {
      title: "CHRO",
      description: "Enhance executive communication with Fathom and Grammarly. Optimize HR strategy using Teal and AI-powered analytics.",
      color: "border-yellow-400"
    },
    {
      title: "CTO & CIO",
      description: "Master foundational models like ChatGPT. Lead tech strategy using no-code platforms like Bubble and legal AI tools like Harvey.",
      color: "border-yellow-400"
    }
  ]

  const executiveMandate = [
    {
      title: "Govern AI Strategy",
      description: "Build a competitive edge with a cohesive AI roadmap."
    },
    {
      title: "Drive Data-Driven Decisions",
      description: "Use AI-powered insights for faster, more accurate planning."
    },
    {
      title: "Champion Innovation & Efficiency",
      description: "Automate and transform operations, marketing, HR, and finance."
    },
    {
      title: "Manage AI Risk",
      description: "Understand ethical, compliance, and operational risks of AI deployment."
    }
  ]

  const curriculum = [
    {
      months: "Month 1-2",
      title: "AI Strategy & Leadership Foundations",
      topics: ["AI landscape overview", "Strategic AI planning", "Executive AI governance", "ROI measurement frameworks"]
    },
    {
      months: "Month 3-4", 
      title: "AI Tools for Executive Decision Making",
      topics: ["Julius AI for market analysis", "Advanced Excel with AI", "Data visualization", "Predictive analytics"]
    },
    {
      months: "Month 5-6",
      title: "AI-Powered Operations & Innovation", 
      topics: ["Process automation with n8n", "Marketing AI with Gamma", "HR analytics", "Financial modeling"]
    },
    {
      months: "Month 7-8",
      title: "AI Governance & Future Leadership",
      topics: ["AI ethics & compliance", "Risk management", "Change leadership", "Capstone project presentation"]
    }
  ]

  const tools = [
    "Julius AI", "Advance Excel with AI", "Gamma AI", "Canva Magic Studio", "Tidio AI",
    "Fathom", "Grammarly", "Teal", "ChatGPT", "Bubble", "Harvey",
    "n8n", "ClickUp", "Perplexity AI", "Microsoft Copilot", "NotebookLM", "bolt.new"
  ]

  const benefits = [
    "AI Certified CXO – Recognized credential for strategic AI leadership",
    "LinkedIn & Resume-ready certificate", 
    "Access to AI jobs from 8000+ companies",
    "Consulting project opportunities",
    "Full ownership of live projects for implementation"
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black rounded-full text-sm font-bold mb-8 shadow-2xl">
            <div className="w-2 h-2 bg-black rounded-full mr-3 animate-pulse"></div>
            EXECUTIVE LEADERSHIP PROGRAM
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            AI FOR
            <span className="block bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              CXOs
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-2xl md:text-3xl text-gray-300 font-light leading-relaxed mb-6">
              Lead the Future with Agentic Intelligence
            </p>
            <blockquote className="text-xl md:text-2xl text-gray-400 italic border-l-4 border-yellow-500 pl-6">
              "AI is not just a tool—it's the new language of leadership."
            </blockquote>
          </div>
          
          <button 
            onClick={handleEnrollClick}
            className="group relative px-12 py-6 bg-gradient-to-r from-yellow-500 to-amber-500 text-black rounded-2xl font-bold text-xl hover:from-yellow-400 hover:to-amber-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/25"
          >
            <span className="relative z-10">ENROLL NOW - LEAD WITH AI</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </section>

      {/* Critical Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">Why CXOs Must</span>
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent"> Upskill Now</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
              <div className="text-5xl font-black text-red-400 mb-4">85%</div>
              <p className="text-gray-300 text-lg">of enterprises will deploy AI Agents by 2025 (Gartner)</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
              <div className="text-5xl font-black text-blue-400 mb-4">70%</div>
              <p className="text-gray-300 text-lg">of Fortune 500 companies are hiring AI Agent Developers—but only 5% of professionals have these skills</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
              <div className="text-5xl font-black text-green-400 mb-4">3.5x</div>
              <p className="text-gray-300 text-lg">higher revenue growth and 30–50% cost reduction with AI adoption</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
              <div className="text-5xl font-black text-purple-400 mb-4">75%</div>
              <p className="text-gray-300 text-lg">of jobs will require AI skills by 2027 (WEF)</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 lg:col-span-2">
              <div className="text-5xl font-black text-yellow-400 mb-4">847%</div>
              <p className="text-gray-300 text-lg">growth in AI Agent skills demand over the last 12 months</p>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Mandate Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">The New Mandate for</span>
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent"> Executive Leadership</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {executiveMandate.map((item, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10">
                <div className="border-l-4 border-yellow-500 pl-6">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CXO Learning Paths Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">CXO-Specific</span>
            <span className="text-white"> Learning Paths</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {cxoLearningPaths.map((path, index) => (
              <div key={index} className={`group bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border-2 ${path.color} hover:border-yellow-300 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10`}>
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">{path.title}</h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full"></div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{path.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">Executive</span>
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent"> AI Toolkit</span>
          </h2>
          
          <div className="text-center mb-12">
            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">32 Premium AI Tools</span>
            <p className="text-gray-400 text-xl mt-2">Curated specifically for C-Suite executives</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 text-center hover:shadow-lg hover:shadow-yellow-500/10">
                <span className="text-white font-semibold group-hover:text-yellow-400 transition-colors duration-300">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">Executive</span>
            <span className="text-white"> Curriculum</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-yellow-500/30">
                <h3 className="text-2xl font-bold text-white mb-6">Program Structure</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <span className="font-bold text-yellow-400">Duration:</span>
                      <span className="text-gray-300 ml-2">8 Months</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <span className="font-bold text-yellow-400">Format:</span>
                      <span className="text-gray-300 ml-2">Live weekend sessions + lifetime access to recordings</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <span className="font-bold text-yellow-400">Projects:</span>
                      <span className="text-gray-300 ml-2">12+ hands-on projects including fraud detection, marketing automation, and enterprise AI strategy</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <span className="font-bold text-yellow-400">Capstone:</span>
                      <span className="text-gray-300 ml-2">Build and present your own AI-powered business solution</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {curriculum.map((phase, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                      {phase.months}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center space-x-3 text-gray-300">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">Executive</span>
            <span className="text-white"> Investment</span>
          </h2>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-yellow-500/30">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-8 text-center">
              <h3 className="text-3xl font-bold text-black">Executive AI Leadership Program</h3>
              <p className="text-black/80 text-lg mt-2">Transform your organization with AI mastery</p>
            </div>
            
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-yellow-500/30">
                      <th className="text-left py-6 px-6 font-bold text-yellow-400 text-lg">Region</th>
                      <th className="text-center py-6 px-6 font-bold text-yellow-400 text-lg">Monthly Investment</th>
                      <th className="text-center py-6 px-6 font-bold text-yellow-400 text-lg">Total Program</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700/50">
                      <td className="py-6 px-6 text-white text-lg">India/South Asia</td>
                      <td className="py-6 px-6 text-center">
                        <div className="text-2xl font-bold text-green-400">₹2,999</div>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <div className="text-2xl font-bold text-green-400">₹23,992</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-6 px-6 text-white text-lg">US/Canada/Europe</td>
                      <td className="py-6 px-6 text-center">
                        <div className="text-2xl font-bold text-blue-400">$149</div>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <div className="text-2xl font-bold text-blue-400">$1,192</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl border border-yellow-500/30">
                <p className="text-center text-white font-bold text-lg">
                  No upfront fee. Pay monthly. Discontinue anytime.
                </p>
                <p className="text-center text-gray-400 mt-2">
                  Flexible payment structure designed for executive schedules
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">Executive</span>
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent"> Certification Benefits</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 group-hover:bg-yellow-400 transition-colors duration-300"></div>
                  <p className="text-gray-300 text-lg font-medium group-hover:text-white transition-colors duration-300">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button 
              onClick={handleEnrollClick}
              className="group relative px-16 py-6 bg-gradient-to-r from-yellow-500 to-amber-500 text-black rounded-2xl font-bold text-xl hover:from-yellow-400 hover:to-amber-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/25"
            >
              <span className="relative z-10 flex items-center">
                START YOUR EXECUTIVE AI JOURNEY
                <ArrowRight className="w-6 h-6 ml-3" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </section>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          defaultCourse="4 Months AI Certification For Professionals"
        />
      )}
    </div>
  )
}