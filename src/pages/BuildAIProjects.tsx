import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from '../components/PaymentModal'
import { useState } from 'react'
import { 
  Rocket, 
  Code, 
  Brain, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  Clock,
  Award,
  Target,
  Lightbulb,
  Cpu,
  Database,
  Globe,
  Phone
} from 'lucide-react'

const BuildAIProjects: React.FC = () => {
  const { user } = useAuth()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const projects = [
    {
      title: "AI Chatbot Assistant",
      description: "Build an intelligent conversational AI that can understand context and provide helpful responses",
      technologies: ["OpenAI API", "LangChain", "React", "Node.js"],
      difficulty: "Beginner",
      duration: "2-3 weeks",
      icon: "🤖",
      features: [
        "Natural language processing",
        "Context-aware responses",
        "Multi-turn conversations",
        "Custom knowledge base integration"
      ]
    },
    {
      title: "Document Analysis AI",
      description: "Create an AI system that can analyze, summarize, and extract insights from documents",
      technologies: ["Python", "OpenAI", "Streamlit", "PDF Processing"],
      difficulty: "Intermediate",
      duration: "3-4 weeks",
      icon: "📄",
      features: [
        "PDF text extraction",
        "Intelligent summarization",
        "Key insights extraction",
        "Multi-document comparison"
      ]
    },
    {
      title: "AI Image Generator",
      description: "Build a creative AI application that generates unique images from text descriptions",
      technologies: ["DALL-E API", "Stable Diffusion", "React", "Express"],
      difficulty: "Intermediate",
      duration: "2-3 weeks",
      icon: "🎨",
      features: [
        "Text-to-image generation",
        "Style customization",
        "Batch processing",
        "Image enhancement"
      ]
    },
    {
      title: "Smart Data Analyzer",
      description: "Develop an AI-powered analytics tool that provides intelligent insights from data",
      technologies: ["Python", "Pandas", "OpenAI", "Plotly"],
      difficulty: "Advanced",
      duration: "4-5 weeks",
      icon: "📊",
      features: [
        "Automated data analysis",
        "Intelligent visualizations",
        "Predictive insights",
        "Natural language queries"
      ]
    },
    {
      title: "AI Code Assistant",
      description: "Create an intelligent coding companion that helps with code generation and debugging",
      technologies: ["GitHub Copilot API", "VS Code Extension", "TypeScript"],
      difficulty: "Advanced",
      duration: "5-6 weeks",
      icon: "💻",
      features: [
        "Code generation",
        "Bug detection",
        "Code optimization",
        "Documentation generation"
      ]
    },
    {
      title: "Voice AI Assistant",
      description: "Build a voice-activated AI assistant with speech recognition and synthesis",
      technologies: ["Speech API", "OpenAI", "Web Audio API", "React"],
      difficulty: "Advanced",
      duration: "4-5 weeks",
      icon: "🎤",
      features: [
        "Speech-to-text conversion",
        "Voice command processing",
        "Text-to-speech synthesis",
        "Multi-language support"
      ]
    }
  ]

  const learningPath = [
    {
      phase: "Foundation",
      duration: "Week 1-2",
      topics: [
        "AI & Machine Learning Fundamentals",
        "API Integration Basics",
        "Development Environment Setup",
        "Version Control with Git"
      ]
    },
    {
      phase: "Core Development",
      duration: "Week 3-8",
      topics: [
        "Building Your First AI Project",
        "Advanced API Usage",
        "Data Processing & Analysis",
        "User Interface Development"
      ]
    },
    {
      phase: "Advanced Projects",
      duration: "Week 9-12",
      topics: [
        "Complex AI Integrations",
        "Performance Optimization",
        "Deployment Strategies",
        "Production Best Practices"
      ]
    },
    {
      phase: "Portfolio & Career",
      duration: "Week 13-16",
      topics: [
        "Portfolio Development",
        "Project Documentation",
        "Career Guidance",
        "Industry Networking"
      ]
    }
  ]

  const benefits = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Hands-On Learning",
      description: "Build real AI projects from day one with practical, industry-relevant applications"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Expert Mentorship",
      description: "Get personalized guidance from Arijit Chowdhury throughout your learning journey"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Portfolio Ready",
      description: "Create a professional portfolio of AI projects to showcase to employers"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description: "Join a community of AI enthusiasts and get help when you need it"
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Build Real AI Projects
              <span className="block text-purple-300 text-3xl md:text-4xl mt-2">
                From Concept to Deployment
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Transform your AI knowledge into practical skills by building production-ready 
              AI applications with expert guidance and hands-on mentorship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>🚀 Start Building Now</span>
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
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Meet Your Mentor
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-purple-300 mb-2 flex justify-center">
                  <Rocket className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold mb-1">22+</div>
                <p className="text-blue-200 text-sm">Enterprise Projects</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-purple-300 mb-2 flex justify-center">
                  <Brain className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold mb-1">$2.5M+</div>
                <p className="text-blue-200 text-sm">Portfolio Value</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-purple-300 mb-2 flex justify-center">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold mb-1">40+</div>
                <p className="text-blue-200 text-sm">Training Sessions</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-purple-300 mb-2 flex justify-center">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold mb-1">100%</div>
                <p className="text-blue-200 text-sm">Production Ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Projects Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI Projects You'll Build
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From beginner-friendly chatbots to advanced AI systems, build a diverse portfolio 
              of projects that showcase your AI development skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{project.icon}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{project.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Key Features:</h4>
                    {project.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your 16-Week Learning Journey
            </h2>
            <p className="text-xl text-gray-600">
              Structured progression from AI fundamentals to advanced project development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {learningPath.map((phase, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{phase.phase}</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {phase.duration}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {phase.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-start space-x-2">
                      <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects you'll build with Arijit */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🚀 Projects You'll Build with Arijit
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Build real-world, production-ready AI systems worth hundreds of thousands of dollars. 
              These are actual enterprise-grade projects that you can use in your portfolio or start your own business.
            </p>
          </div>

          {/* Advanced Enterprise Projects */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🏢 Advanced Enterprise AI Projects
              </h3>
              <p className="text-lg text-gray-600">
                Build cutting-edge AI systems for Fortune 500 companies and enterprise clients
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-200">
                      <th className="text-left py-4 px-2 font-bold text-gray-900">Project Name</th>
                      <th className="text-left py-4 px-2 font-bold text-gray-900">Sessions</th>
                      <th className="text-left py-4 px-2 font-bold text-gray-900">Market Value</th>
                      <th className="text-left py-4 px-2 font-bold text-gray-900">Technologies</th>
                      <th className="text-left py-4 px-2 font-bold text-gray-900">Target Industry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Multi-LLM Intelligence Platform</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">3-5</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$50,000</td>
                      <td className="py-4 px-2 text-gray-700">Python, NumPy, Pandas, OpenAI API, Claude API, Gemini API, Cost tracking</td>
                      <td className="py-4 px-2 text-gray-700">AI Consulting, Tech Companies, Enterprise IT</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Advanced Document Intelligence System</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">7-9</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$75,000</td>
                      <td className="py-4 px-2 text-gray-700">LangChain, PDF processing, Word2Vec, BERT, Sentence-transformers, Pinecone, Chroma, FAISS</td>
                      <td className="py-4 px-2 text-gray-700">Legal Services, Compliance, Research</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Multi-Agent Content Creation Platform</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">11-13</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$85,000</td>
                      <td className="py-4 px-2 text-gray-700">CrewAI, LangGraph, Multi-agent collaboration, State management, Workflow orchestration</td>
                      <td className="py-4 px-2 text-gray-700">Digital Marketing, E-learning, Publishing, Media</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Enterprise Workflow Automation Suite</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">15-17</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$100,000</td>
                      <td className="py-4 px-2 text-gray-700">n8n, Make, Multi-platform integration, API orchestration, Business automation</td>
                      <td className="py-4 px-2 text-gray-700">Enterprises, Business Process Automation</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">AI-Driven Analytics & Intelligence Hub</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">18-19</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$120,000</td>
                      <td className="py-4 px-2 text-gray-700">LangFlow, Relevance.ai, Advanced embeddings, Semantic search, Custom models</td>
                      <td className="py-4 px-2 text-gray-700">Data Analytics, Business Intelligence, Fortune 500</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Production-Ready Agent Ecosystem</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">20</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$150,000</td>
                      <td className="py-4 px-2 text-gray-700">All frameworks integration, Cloud deployment, Monitoring, Complete architecture</td>
                      <td className="py-4 px-2 text-gray-700">System Integration, Digital Transformation</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Enterprise Multi-Agent Architecture</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">22-25</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$200,000</td>
                      <td className="py-4 px-2 text-gray-700">Advanced CrewAI, LangGraph, AutoGen, Cross-platform communication, Message queuing</td>
                      <td className="py-4 px-2 text-gray-700">Enterprise Architecture, Fintech, Supply Chain</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Advanced Semantic Intelligence Platform</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">27-29</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$250,000</td>
                      <td className="py-4 px-2 text-gray-700">Custom embeddings, Multi-modal models, Knowledge graphs, Vector optimization</td>
                      <td className="py-4 px-2 text-gray-700">AI Research, Knowledge Management, Search Providers</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Scalable Production Infrastructure</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">31-33</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$300,000</td>
                      <td className="py-4 px-2 text-gray-700">Kubernetes, Docker, Service Mesh, Infra as Code, Advanced monitoring</td>
                      <td className="py-4 px-2 text-gray-700">Cloud Services, DevOps, Enterprise IT</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Security & Compliance Framework</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">35-36</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$350,000</td>
                      <td className="py-4 px-2 text-gray-700">Zero Trust Architecture, Compliance automation, Security testing, Audit systems</td>
                      <td className="py-4 px-2 text-gray-700">Cybersecurity, Government, Financial Services</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Complete MLOps & Business Strategy Platform</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">38-39</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$400,000</td>
                      <td className="py-4 px-2 text-gray-700">MLOps pipelines, Business strategy, Client acquisition, Industry applications</td>
                      <td className="py-4 px-2 text-gray-700">ML Engineering, Consulting, Strategic Advisory</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Next-Generation Enterprise Ecosystem</td>
                      <td className="py-4 px-2 text-blue-600 font-medium">40</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$450,000</td>
                      <td className="py-4 px-2 text-gray-700">All technologies integration, Future trends, Complete business solution</td>
                      <td className="py-4 px-2 text-gray-700">Fortune 500, Global Consulting, Innovation Labs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Business & SME Projects */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                💼 Business & SME AI Solutions
              </h3>
              <p className="text-lg text-gray-600">
                Practical AI applications for small to medium enterprises and startups
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-green-200">
                      <th className="text-left py-4 px-2 font-bold text-gray-900">Project Name</th>
                      <th className="text-left py-4 px-2 font-bold text-gray-900">Sessions</th>
                      <th className="text-left py-4 px-2 font-bold text-gray-900">Market Value</th>
                      <th className="text-left py-4 px-2 font-bold text-gray-900">Technologies</th>
                      <th className="text-left py-4 px-2 font-bold text-gray-900">Target Industry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100">
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">AI-Powered Personal Finance Manager</td>
                      <td className="py-4 px-2 text-green-600 font-medium">3-6 (Month 1)</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$35,000</td>
                      <td className="py-4 px-2 text-gray-700">Cursor AI, Claude AI, Banking APIs, Data visualization</td>
                      <td className="py-4 px-2 text-gray-700">Fintech, Personal Finance, Banking</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">E-commerce Business Suite</td>
                      <td className="py-4 px-2 text-green-600 font-medium">8-11 (Month 2)</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$50,000</td>
                      <td className="py-4 px-2 text-gray-700">Lovable, Bolt, Payment integration, Inventory management</td>
                      <td className="py-4 px-2 text-gray-700">E-commerce, Retail, SME businesses</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Enterprise CRM & Analytics Dashboard</td>
                      <td className="py-4 px-2 text-green-600 font-medium">13-16 (Month 3)</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$45,000</td>
                      <td className="py-4 px-2 text-gray-700">n8n, API integration, Data management, Sales, Marketing, Reporting</td>
                      <td className="py-4 px-2 text-gray-700">Sales, Marketing, Professional Services</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Multi-Channel Business Automation</td>
                      <td className="py-4 px-2 text-green-600 font-medium">17-18 (Month 3)</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$30,000</td>
                      <td className="py-4 px-2 text-gray-700">Make, Multi-platform integration, Workflow automation</td>
                      <td className="py-4 px-2 text-gray-700">Business Automation, Process Optimization</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Complete Business Management Platform</td>
                      <td className="py-4 px-2 text-green-600 font-medium">19-20 (Month 4)</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$75,000</td>
                      <td className="py-4 px-2 text-gray-700">Multiple platforms integration, Cloud deployment, Mobile app</td>
                      <td className="py-4 px-2 text-gray-700">Startups, SMEs, Consulting</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Multi-Agent System Architecture</td>
                      <td className="py-4 px-2 text-green-600 font-medium">21 (Month 5)</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$100,000</td>
                      <td className="py-4 px-2 text-gray-700">Advanced n8n, Database integration, Enterprise security</td>
                      <td className="py-4 px-2 text-gray-700">Large Enterprises, Government, Healthcare</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Enterprise Research & Analysis Crew</td>
                      <td className="py-4 px-2 text-green-600 font-medium">22-25 (Month 5)</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$125,000</td>
                      <td className="py-4 px-2 text-gray-700">LangFlow, Relevance.ai, Advanced analytics, Custom models</td>
                      <td className="py-4 px-2 text-gray-700">Data Analytics, Business Intelligence, Consulting</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Complex Workflow Agent</td>
                      <td className="py-4 px-2 text-green-600 font-medium">26 (Month 6)</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$90,000</td>
                      <td className="py-4 px-2 text-gray-700">Advanced Make, Cross-platform APIs, Service orchestration</td>
                      <td className="py-4 px-2 text-gray-700">System Integrators, Enterprise IT, Digital Transformation</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Multi-Agent Development Team</td>
                      <td className="py-4 px-2 text-green-600 font-medium">27-30 (Month 6)</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$150,000</td>
                      <td className="py-4 px-2 text-gray-700">Custom platform dev, SDK creation, Plugin architecture</td>
                      <td className="py-4 px-2 text-gray-700">Platform Providers, Developer Tools, Enterprise Software</td>
                    </tr>
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-gray-900">Cross-Platform Agent Network</td>
                      <td className="py-4 px-2 text-green-600 font-medium">31-40 (Month 7-8)</td>
                      <td className="py-4 px-2 text-green-600 font-bold">$200,000</td>
                      <td className="py-4 px-2 text-gray-700">All platforms integration, Business strategy, Deployment</td>
                      <td className="py-4 px-2 text-gray-700">Fortune 500, System Integrators, Global Consulting</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">💰 Total Portfolio Value: $2.5+ Million</h3>
            <p className="text-lg mb-6">
              Build a portfolio of AI projects worth over $2.5 million in market value. 
              These aren't just learning exercises - they're real business solutions you can sell or use to start your own AI consulting company.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="text-2xl font-bold mb-2">22+</div>
                <p className="text-sm">Enterprise Projects</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="text-2xl font-bold mb-2">40+</div>
                <p className="text-sm">Training Sessions</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="text-2xl font-bold mb-2">100%</div>
                <p className="text-sm">Production Ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Project-Based Learning?
            </h2>
            <p className="text-xl text-gray-600">
              Learn by doing with real-world AI projects that build your portfolio and skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentor Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Learn from Industry Expert
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Get personalized mentorship from Arijit Chowdhury, who brings over 15 years of 
                experience in AI development and has helped thousands of professionals build 
                successful AI careers.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">1:1 project guidance and code reviews</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Cpu className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">Industry best practices and optimization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Database className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700">Career guidance and portfolio development</span>
                </div>
              </div>
              
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>Meet Your Mentor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6">
                <img 
                  src="/82597b4e-e193-45e5-a266-e303e029de30-removebg-preview.png" 
                  alt="Arijit Chowdhury - AI Expert and Mentor"
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
              <p className="text-lg text-gray-600">AI Expert & Project Mentor</p>
              <p className="text-blue-600 font-semibold">15+ Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your AI Portfolio?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our intensive 16-week program and transform from AI learner to AI builder. 
            Create real projects, get expert mentorship, and launch your AI career.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Start Building Today
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
        defaultCourse="Build AI Projects"
      />
    </div>
  )
}

export default BuildAIProjects