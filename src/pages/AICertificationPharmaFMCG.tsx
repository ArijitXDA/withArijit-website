import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from '../components/PaymentModal'
import { useState } from 'react'
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Award, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Star,
  Target,
  Rocket,
  Phone,
  Building,
  DollarSign,
  Briefcase,
  Shield,
  BarChart3,
  Zap,
  Globe,
  BookOpen,
  Lightbulb,
  Cpu
} from 'lucide-react'

const AICertificationPharmaFMCG: React.FC = () => {
  const { user } = useAuth()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const criticalStats = [
    { number: '85M', text: 'Jobs Will Disappear by 2025', icon: <TrendingUp className="w-8 h-8" />, color: 'text-red-600' },
    { number: '97M', text: 'AI-Augmented Roles Created', icon: <Rocket className="w-8 h-8" />, color: 'text-green-600' },
    { number: '340%', text: 'Salary Hike with AI Skills', icon: <DollarSign className="w-8 h-8" />, color: 'text-blue-600' },
    { number: '1600%', text: 'Higher Fortune 500 Hiring', icon: <Building className="w-8 h-8" />, color: 'text-purple-600' }
  ]

  const additionalStats = [
    { number: '75%', text: 'Jobs Will Require AI Skills by 2027', color: 'text-orange-600' },
    { number: '78%', text: 'Gap in AI-Skilled Professionals', color: 'text-red-600' },
    { number: '3500%', text: 'Growth in AI Job Postings Since 2020', color: 'text-green-600' },
    { number: '12%', text: 'Professionals Actively Learning AI', color: 'text-blue-600' },
    { number: '72%', text: 'Fear Job Displacement', color: 'text-yellow-600' }
  ]

  const perfectForRoles = [
    'Sales Leaders', 'Product Managers', 'Project Managers', 'Analysts', 
    'HR Professionals', 'Marketing Managers', 'Audit & Risk Managers', 
    'Credit Managers', 'Actuaries', 'Finance Managers', 'Consultants', 
    'Legal Advisors'
  ]

  const aiTools = [
    { name: 'bolt.new', purpose: 'AI Search & Knowledge Discovery' },
    { name: 'NotebookLM', purpose: 'AI-Powered Research & Notetaking' },
    { name: 'Julius AI', purpose: 'Data Analysis with AI' },
    { name: 'Microsoft Copilot', purpose: 'AI Assistant for Productivity Suite' },
    { name: 'Advance Excel with AI', purpose: 'Advanced Data Analysis & Modeling' },
    { name: 'ChatGPT', purpose: 'Conversational AI, Coding, Research' },
    { name: 'Canva Magic Studio', purpose: 'AI Design & Image Generation' },
    { name: 'Gamma AI', purpose: 'AI Slide Generation' },
    { name: 'Grammarly', purpose: 'Writing Assistant' },
    { name: 'Fathom', purpose: 'Meeting Assistant' },
    { name: 'Notion AI', purpose: 'Productivity & Knowledge Management' },
    { name: 'Murf.ai', purpose: 'Voice Generation' },
    { name: 'DALL·E 3', purpose: 'Image Generation' },
    { name: 'Perplexity AI', purpose: 'AI Search Engine' },
    { name: 'ClickUp', purpose: 'Project Management' },
    { name: 'Reclaim', purpose: 'AI Scheduling' },
    { name: 'Tidio AI', purpose: 'Customer Service Automation' },
    { name: 'Shortwave', purpose: 'AI Email Assistant' },
    { name: 'Suno', purpose: 'Music Generation' },
    { name: 'Vista Social', purpose: 'Social Media Management' },
    { name: 'Teal', purpose: 'Resume & Career Assistant' },
    { name: 'Manus', purpose: 'Autonomous AI Agents' },
    { name: 'Gumloop', purpose: 'No-code AI Automation' },
    { name: 'Cursor', purpose: 'AI Coding Assistant' },
    { name: 'Gemini (Google)', purpose: 'Multimodal AI' },
    { name: 'n8n', purpose: 'Workflow Automation' },
    { name: 'ElevenLabs', purpose: 'Voice Cloning & Generation' },
    { name: 'Bubble', purpose: 'No-code App Builder' },
    { name: 'Guru', purpose: 'Knowledge Management' },
    { name: 'Playground AI', purpose: 'Image-to-Image Design' },
    { name: 'Magic Hour', purpose: 'Image & Video Editing Suite' },
    { name: 'Harvey', purpose: 'AI for Legal Research & Contract Analysis' }
  ]

  const curriculum = [
    {
      month: 1,
      title: "Foundations of AI & Prompting",
      sessions: [
        { 
          session: 1, 
          title: "Introduction to Prompt Engineering", 
          topics: "Core concepts, ChatGPT & Copilot hands-on", 
          project: "Create a personal prompt library for 10 business tasks" 
        },
        { 
          session: 2, 
          title: "Advanced Prompt Engineering", 
          topics: "Chain-of-thought, few-shot, persona-based prompting", 
          project: "Build a virtual analyst prompt for structured business summaries" 
        },
        { 
          session: 3, 
          title: "Creative & Strategic Prompting", 
          topics: "Marketing copy, SWOT/PESTLE, AI workflows", 
          project: "Design a marketing campaign using chained prompts" 
        },
        { 
          session: 4, 
          title: "The AI Landscape", 
          topics: "AI, ML, DL, Generative AI, business value", 
          project: "Analyze 3 case studies to identify AI types and outcomes" 
        },
        { 
          session: 5, 
          title: "AI in Business", 
          topics: "AI in Finance, Healthcare, Retail, HR, etc.", 
          project: "Map AI use cases for your role or business" 
        }
      ]
    },
    {
      month: 2,
      title: "AI Tools for Business Productivity",
      sessions: [
        { 
          session: 6, 
          title: "AI for Data Analysis & BI", 
          topics: "Julius AI, Advance Excel with AI", 
          project: "Analyze sales data and visualize top products/regions" 
        },
        { 
          session: 7, 
          title: "AI for Research & Knowledge Mgmt", 
          topics: "NotebookLM, bolt.new, Perplexity AI", 
          project: "Create a research hub with summaries and insights" 
        },
        { 
          session: 8, 
          title: "AI for Presentations & Visuals", 
          topics: "Gamma AI, Canva Magic Studio", 
          project: "Build a 10-slide business proposal in 20 minutes" 
        },
        { 
          session: 9, 
          title: "AI for Writing & Communication", 
          topics: "Grammarly, ChatGPT", 
          project: "Edit a business document into a polished version" 
        },
        { 
          session: 10, 
          title: "AI for Productivity & Meetings", 
          topics: "Notion AI, Fathom", 
          project: "Auto-generate meeting summary and action items" 
        }
      ]
    },
    {
      month: 3,
      title: "AI for Operations, Sales & HR",
      sessions: [
        { 
          session: 11, 
          title: "AI for Project & Task Management", 
          topics: "ClickUp, Reclaim", 
          project: "Create a project plan with AI-generated tasks and risk analysis" 
        },
        { 
          session: 12, 
          title: "AI for Workflow Automation", 
          topics: "n8n", 
          project: "Automate saving email attachments to cloud and notify" 
        },
        { 
          session: 13, 
          title: "AI for Sales & Customer Engagement", 
          topics: "Tidio AI, Shortwave", 
          project: "Deploy a chatbot for FAQs on a sample website" 
        },
        { 
          session: 14, 
          title: "AI for HR & Career Growth", 
          topics: "Teal", 
          project: "Optimize a resume for a specific job using AI suggestions" 
        },
        { 
          session: 15, 
          title: "AI for Creative Content", 
          topics: "Suno, Murf.ai, DALL·E 3", 
          project: "Create a promo video with AI-generated music and voiceover" 
        }
      ]
    },
    {
      month: 4,
      title: "Advanced Tools & Capstone Project",
      sessions: [
        { 
          session: 16, 
          title: "No-Code & Development Tools", 
          topics: "Bubble, Cursor", 
          project: "Design UI for a simple web app using Bubble" 
        },
        { 
          session: 17, 
          title: "Specialized & Expert AI Tools", 
          topics: "Harvey, Manus", 
          project: "Analyze a contract for key clauses and risks using Harvey" 
        },
        { 
          session: 18, 
          title: "Live Project – Ideation & Planning", 
          topics: "Capstone project setup", 
          project: "Define scope, problem, and AI tools for solution" 
        },
        { 
          session: 19, 
          title: "Live Project – Building & Execution", 
          topics: "Hands-on project development", 
          project: "Build core components of your AI-powered solution" 
        },
        { 
          session: 20, 
          title: "Project Showcase & Certification", 
          topics: "Final presentation, review, certification", 
          project: "Present and submit final project for evaluation" 
        }
      ]
    }
  ]

  const certificationBenefits = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "AI Certified Professional",
      description: "Official certification recognized by industry leaders"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "LinkedIn & Resume-Ready Credentials",
      description: "Professional credentials that stand out to employers"
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Access to AI Jobs from 8000+ Companies",
      description: "Exclusive job opportunities across 17 industries in India, USA & Canada"
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Consulting Project Opportunities",
      description: "Get connected with real consulting projects and clients"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Full Project Ownership",
      description: "Implement your live projects in your organization"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Strategic AI Leadership Preparation",
      description: "Prepare for CXO roles with AI strategic thinking"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              AI Certification for
              <span className="block text-purple-300 text-3xl md:text-4xl mt-2">
                Pharma & FMCG Professionals
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Transform your career with AI skills that matter. Master 32 cutting-edge AI tools 
              and become an AI-certified professional in just 4 months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>🚀 Get Certified Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              {user && (
                <Link
                  to="/dashboard"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Go to Dashboard
                </Link>
              )}
              <Link
                to="/about"
                className="bg-white text-purple-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Meet the Instructor
              </Link>
            </div>

            {/* Critical Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
              {criticalStats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className={`${stat.color} mb-2 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <p className="text-blue-200 text-sm">{stat.text}</p>
                </div>
              ))}
            </div>

            {/* Perfect For Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-5xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4 text-center">🎯 Perfect for Roles Like:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {perfectForRoles.map((role, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <span className="text-white text-sm font-medium">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Course Is Critical */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🔥 Why This Course Is Critical
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The AI revolution is here. Don't get left behind - join the professionals who are future-proofing their careers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {additionalStats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
                <p className="text-gray-700 font-medium">{stat.text}</p>
              </div>
            ))}
          </div>

          {/* Exclusive Job Access */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Exclusive Job Access</h3>
              <p className="text-lg text-gray-700">
                Certified students get access to AI jobs from <span className="font-bold text-blue-600">8000+ companies</span> across 
                <span className="font-bold text-blue-600"> 17 industries</span> in India, USA & Canada via withArijit.com.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-3xl mb-3">🇮🇳</div>
                <h4 className="font-bold text-gray-900 mb-2">India</h4>
                <p className="text-gray-600 text-sm">Access to top Indian companies and startups</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-3xl mb-3">🇺🇸</div>
                <h4 className="font-bold text-gray-900 mb-2">USA</h4>
                <p className="text-gray-600 text-sm">Fortune 500 and Silicon Valley opportunities</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-3xl mb-3">🇨🇦</div>
                <h4 className="font-bold text-gray-900 mb-2">Canada</h4>
                <p className="text-gray-600 text-sm">Tech hubs and financial institutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Mastery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🛠️ Master 32 AI Tools & Technologies
            </h2>
            <p className="text-xl text-gray-600">
              From productivity to advanced automation - become proficient in the complete AI toolkit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {aiTools.map((tool, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{tool.name}</h3>
                    <p className="text-gray-600 text-xs">{tool.purpose}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📚 Curriculum: Month-by-Month Breakdown
            </h2>
            <p className="text-xl text-gray-600">
              20 comprehensive sessions designed for non-tech professionals
            </p>
          </div>

          <div className="space-y-12">
            {curriculum.map((month, monthIndex) => (
              <div key={monthIndex} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Month {month.month}: {month.title}
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-200">
                        <th className="text-left py-4 px-2 font-bold text-gray-900">Session</th>
                        <th className="text-left py-4 px-2 font-bold text-gray-900">Title</th>
                        <th className="text-left py-4 px-2 font-bold text-gray-900">Topics Covered</th>
                        <th className="text-left py-4 px-2 font-bold text-gray-900">Project to be Built</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      {month.sessions.map((session, sessionIndex) => (
                        <tr key={sessionIndex} className="hover:bg-white/50 transition-colors">
                          <td className="py-4 px-2 font-bold text-blue-600">{session.session}</td>
                          <td className="py-4 px-2 font-semibold text-gray-900">{session.title}</td>
                          <td className="py-4 px-2 text-gray-700">{session.topics}</td>
                          <td className="py-4 px-2 text-gray-700">{session.project}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Get After Certification */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎓 What You'll Get After Certification
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive benefits that transform your career prospects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificationBenefits.map((benefit, index) => (
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

      {/* About Instructor */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Learn from AI Industry Expert
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Arijit Chowdhury brings over 18 years of experience in AI, pharma, FMCG, and digital transformation. 
                He has successfully trained 10,000+ professionals and led digital initiatives across 
                Fortune 500 companies in India, North America, and Western Europe.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">18+ years in AI & Industry</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">10,000+ professionals trained</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">Global experience across 3 continents</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">Senior roles at YES BANK, HSBC, Reliance</span>
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
                  alt="Arijit Chowdhury - AI Expert and Industry Professional"
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
              <p className="text-lg text-gray-600">AI Expert & Industry Professional</p>
              <p className="text-blue-600 font-semibold">18+ Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Future-Proof Your Career?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of pharma and FMCG professionals who have transformed their careers 
            with AI certification. Don't wait - the AI revolution is happening now.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Get Certified Now
            </button>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              Get Free Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultCourse="4 Months AI Certification For Professionals"
      />
    </div>
  )
}

export default AICertificationPharmaFMCG