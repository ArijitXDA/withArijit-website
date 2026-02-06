import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from '../components/PaymentModal'
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
  MessageSquare,
  Globe,
  Database,
  BarChart3,
  Calculator,
  Building2,
  Atom
} from 'lucide-react'

const Courses: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('agentic-ai')
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')

  // Handle hash navigation for other courses sections
  useEffect(() => {
    const hash = location.hash
    if (hash) {
      const sectionId = hash.substring(1) // Remove the #
      const otherCourseSections = ['quantum-computing', 'business-intelligence', 'excel-automation', 'corporate-training']
      
      if (otherCourseSections.includes(sectionId)) {
        // Switch to other tab first
        setActiveTab('other')
        
        // Wait for the tab content to render, then scroll to section
        setTimeout(() => {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }
  }, [location.hash])

  // Determine which course section to show based on URL
  const currentPath = location.pathname
  const isAgenticAI = currentPath.includes('/agentic-ai')
  const isViveCoding = currentPath.includes('/vive-coding')
  const isOtherCourses = currentPath.includes('/other')
  const isAllCourses = currentPath === '/courses'

  const handlePayNow = (courseName: string) => {
    setSelectedCourse(courseName)
    setPaymentModalOpen(true)
  }

  const getBreadcrumb = () => {
    if (isAgenticAI) return 'Agentic AI Development'
    if (isViveCoding) return 'Vive Coding'
    if (isOtherCourses) return 'Other Courses'
    return 'All Courses'
  }

  const getPageTitle = () => {
    if (isAgenticAI) return 'Master Agentic AI Development'
    if (isViveCoding) return 'Learn Vive Coding Methodology'
    if (isOtherCourses) return 'Specialized Professional Courses'
    return 'Transform Your Career with AI'
  }

  const getPageDescription = () => {
    if (isAgenticAI) return 'Build intelligent AI agents that can think, reason, and act autonomously using cutting-edge frameworks'
    if (isViveCoding) return 'Experience revolutionary interactive development techniques that make complex concepts accessible'
    if (isOtherCourses) return 'Expand your expertise with specialized courses in emerging technologies and business intelligence'
    return 'Choose from our comprehensive courses designed to take you from beginner to expert in AI development'
  }

  const mainCourses = [
    {
      id: 'agentic-ai',
      title: 'Agentic AI Development',
      subtitle: 'Build Intelligent AI Agents',
      description: 'Master the art of building intelligent AI agents that can think, reason, and act autonomously. Learn cutting-edge frameworks like CrewAI, LangChain, and AutoGen to create production-ready applications.',
      duration: '4 Months',
      format: 'Live + Recorded',
      price: { inr: 2999, usd: 149 },
      gradient: 'from-blue-600 via-purple-600 to-indigo-600',
      icon: <Brain className="w-8 h-8 text-white" />,
      features: [
        'Multi-LLM Integration & Optimization (OpenAI, Claude, Gemini, Grok, Llama)',
        'Advanced Agent Frameworks (CrewAI, LangChain, AutoGen)',
        'Production Deployment Strategies (Vercel, Netlify, Supabase)',
        'Enterprise-Grade Architecture & Scalability',
        'Real-world Project Portfolio Development',
        'Industry Expert Mentorship & Code Reviews',
        'AI Agent Orchestration & Workflow Management',
        'Vector Databases & Semantic Search Integration',
        'Custom Tool Development & API Integration',
        'Monitoring, Logging & Performance Optimization'
      ],
      technologies: [
        'OpenAI GPT-4/4o', 'Claude 3.5 Sonnet', 'Gemini Pro', 'Grok', 'Llama 3.1',
        'LangChain', 'CrewAI', 'AutoGen', 'LangGraph', 'Haystack',
        'Python', 'FastAPI', 'Streamlit', 'Gradio',
        'n8n', 'Make.com', 'Zapier', 'Relevance AI',
        'Cursor AI', 'GitHub Copilot', 'Bolt.new', 'Lovable',
        'Vector DBs (Pinecone, Weaviate, Chroma)', 'PostgreSQL', 'Supabase',
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP'
      ],
      curriculum: [
        {
          module: 'Module 1: AI Foundations & Multi-LLM Integration',
          sessions: [
            {
              title: 'Session 1: Introduction to Agentic AI',
              topics: [
                'What is Agentic AI and why it matters',
                'Difference between traditional AI and Agentic AI',
                'Real-world applications and use cases',
                'Setting up development environment'
              ]
            },
            {
              title: 'Session 2: Understanding Large Language Models',
              topics: [
                'LLM architecture and capabilities',
                'Prompt engineering fundamentals',
                'Token management and optimization',
                'Model selection criteria'
              ]
            },
            {
              title: 'Session 3: OpenAI GPT-4/4o Integration',
              topics: [
                'OpenAI API setup and authentication',
                'Chat completions and function calling',
                'Streaming responses and error handling',
                'Best practices for production use'
              ]
            },
            {
              title: 'Session 4: Claude 3.5 Sonnet Implementation',
              topics: [
                'Anthropic API integration',
                'Claude-specific prompt patterns',
                'Safety and constitutional AI principles',
                'Comparing Claude vs GPT performance'
              ]
            },
            {
              title: 'Session 5: Multi-LLM Strategy',
              topics: [
                'Gemini Pro and Grok integration',
                'LLM routing and fallback strategies',
                'Cost optimization techniques',
                'Performance benchmarking'
              ]
            },
            {
              title: 'Session 6: Advanced Prompt Engineering',
              topics: [
                'Chain-of-thought prompting',
                'Few-shot and zero-shot learning',
                'Prompt templates and versioning',
                'A/B testing prompts'
              ]
            }
          ]
        },
        {
          module: 'Module 2: Agent Frameworks & Architecture',
          sessions: [
            {
              title: 'Session 7: LangChain Framework Deep Dive',
              topics: [
                'LangChain architecture and components',
                'Chains, agents, and memory systems',
                'Document loaders and text splitters',
                'Vector stores and retrievers'
              ]
            },
            {
              title: 'Session 8: Building Your First Agent',
              topics: [
                'Agent types and selection criteria',
                'Tool integration and custom tools',
                'Agent memory and conversation history',
                'Error handling and debugging'
              ]
            },
            {
              title: 'Session 9: CrewAI Multi-Agent Systems',
              topics: [
                'CrewAI framework introduction',
                'Defining agents, tasks, and crews',
                'Agent collaboration patterns',
                'Hierarchical vs sequential execution'
              ]
            },
            {
              title: 'Session 10: AutoGen Conversational Agents',
              topics: [
                'AutoGen framework setup',
                'Multi-agent conversations',
                'Code generation and execution',
                'Human-in-the-loop workflows'
              ]
            },
            {
              title: 'Session 11: LangGraph Workflow Orchestration',
              topics: [
                'Graph-based agent workflows',
                'State management and persistence',
                'Conditional routing and branching',
                'Complex workflow patterns'
              ]
            },
            {
              title: 'Session 12: Advanced Agent Architecture',
              topics: [
                'Agent communication protocols',
                'Distributed agent systems',
                'Performance optimization',
                'Monitoring and observability'
              ]
            }
          ]
        },
        {
          module: 'Module 3: Production Development & Deployment',
          sessions: [
            {
              title: 'Session 13: FastAPI Backend Development',
              topics: [
                'FastAPI project structure',
                'API endpoints and request handling',
                'Async programming patterns',
                'API documentation with Swagger'
              ]
            },
            {
              title: 'Session 14: Database Integration',
              topics: [
                'PostgreSQL setup and configuration',
                'Supabase integration and real-time features',
                'Database schema design for AI apps',
                'Connection pooling and optimization'
              ]
            },
            {
              title: 'Session 15: Vector Database Implementation',
              topics: [
                'Vector database concepts and use cases',
                'Pinecone, Weaviate, and Chroma setup',
                'Embedding generation and storage',
                'Similarity search and retrieval'
              ]
            },
            {
              title: 'Session 16: UI Development with Streamlit & Gradio',
              topics: [
                'Streamlit app development',
                'Gradio interface creation',
                'Custom components and styling',
                'User experience best practices'
              ]
            },
            {
              title: 'Session 17: Authentication & Security',
              topics: [
                'User authentication systems',
                'API key management',
                'Rate limiting and abuse prevention',
                'Data privacy and compliance'
              ]
            },
            {
              title: 'Session 18: Cloud Deployment Strategies',
              topics: [
                'Deployment to Vercel and Netlify',
                'AWS, Azure, and GCP deployment',
                'Environment configuration',
                'Monitoring and logging setup'
              ]
            }
          ]
        },
        {
          module: 'Module 4: Advanced Projects & Portfolio',
          sessions: [
            {
              title: 'Session 19: Customer Service AI Agent Project',
              topics: [
                'Requirements analysis and design',
                'Multi-channel integration (chat, email, phone)',
                'Knowledge base integration',
                'Escalation and handoff mechanisms'
              ]
            },
            {
              title: 'Session 20: Research Assistant with RAG',
              topics: [
                'Retrieval-Augmented Generation implementation',
                'Document processing and indexing',
                'Query understanding and retrieval',
                'Answer generation and citation'
              ]
            },
            {
              title: 'Session 21: Multi-Agent Collaboration System',
              topics: [
                'Complex multi-agent workflows',
                'Agent specialization and coordination',
                'Conflict resolution and consensus',
                'Performance optimization'
              ]
            },
            {
              title: 'Session 22: Industry-Specific AI Solutions',
              topics: [
                'Healthcare AI applications',
                'Financial services automation',
                'E-commerce personalization',
                'Legal document processing'
              ]
            },
            {
              title: 'Session 23: Performance Monitoring & Analytics',
              topics: [
                'Agent performance metrics',
                'User interaction analytics',
                'Cost tracking and optimization',
                'A/B testing frameworks'
              ]
            },
            {
              title: 'Session 24: Portfolio & Career Preparation',
              topics: [
                'Portfolio project presentation',
                'GitHub repository optimization',
                'Technical interview preparation',
                'Job search strategies and networking'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'vive-coding',
      title: 'Vive Coding',
      subtitle: 'Interactive Development Experience',
      description: 'Experience coding like never before with our innovative Vive Coding methodology. Learn through immersive, interactive sessions that make complex concepts easy to understand.',
      duration: '4 Months',
      format: 'Live Interactive',
      price: { inr: 2999, usd: 149 },
      gradient: 'from-green-600 via-teal-600 to-emerald-600',
      icon: <Code className="w-8 h-8 text-white" />,
      features: [
        'Interactive Learning Environment with Live Coding',
        'Real-time Code Collaboration & Pair Programming',
        'Project-Based Learning with Industry Standards',
        'Modern Development Tools & Best Practices',
        'Live Problem Solving & Debugging Sessions',
        'Peer Learning Community & Code Reviews',
        'Full-Stack Development Mastery',
        'DevOps & Deployment Automation',
        'Testing & Quality Assurance',
        'Agile Development Methodologies'
      ],
      technologies: [
        'React 18', 'Next.js 14', 'TypeScript', 'JavaScript ES2024',
        'Node.js', 'Express.js', 'FastAPI', 'Python',
        'PostgreSQL', 'MongoDB', 'Supabase', 'Firebase',
        'Tailwind CSS', 'Framer Motion', 'Shadcn/ui',
        'n8n', 'Make.com', 'Zapier', 'Relevance AI',
        'Cursor AI', 'GitHub Copilot', 'Bolt.new', 'Lovable',
        'Git', 'GitHub Actions', 'Docker', 'Vercel', 'Netlify'
      ],
      curriculum: [
        {
          module: 'Module 1: Modern Frontend Development',
          sessions: [
            {
              title: 'Session 1: Introduction to Vive Coding',
              topics: [
                'What is Vive Coding methodology',
                'Interactive development principles',
                'Setting up modern development environment',
                'Live coding best practices'
              ]
            },
            {
              title: 'Session 2: React 18 Fundamentals',
              topics: [
                'React 18 new features and improvements',
                'Hooks deep dive (useState, useEffect, custom hooks)',
                'Context API and state management',
                'Component composition patterns'
              ]
            },
            {
              title: 'Session 3: TypeScript for React',
              topics: [
                'TypeScript setup and configuration',
                'Type-safe React components',
                'Props and state typing',
                'Advanced TypeScript patterns'
              ]
            },
            {
              title: 'Session 4: Next.js 14 App Router',
              topics: [
                'Next.js 14 App Router architecture',
                'Server and Client Components',
                'Routing and navigation',
                'Data fetching strategies'
              ]
            },
            {
              title: 'Session 5: Modern Styling with Tailwind CSS',
              topics: [
                'Tailwind CSS setup and configuration',
                'Utility-first CSS methodology',
                'Responsive design patterns',
                'Custom components with Tailwind'
              ]
            },
            {
              title: 'Session 6: Component Libraries & UI Systems',
              topics: [
                'Shadcn/ui component library',
                'Building design systems',
                'Accessibility best practices',
                'Component documentation'
              ]
            }
          ]
        },
        {
          module: 'Module 2: Backend & Database Integration',
          sessions: [
            {
              title: 'Session 7: Node.js & Express.js Mastery',
              topics: [
                'Node.js runtime and event loop',
                'Express.js server setup and middleware',
                'RESTful API design principles',
                'Error handling and validation'
              ]
            },
            {
              title: 'Session 8: Python FastAPI Development',
              topics: [
                'FastAPI framework introduction',
                'Async/await patterns in Python',
                'Automatic API documentation',
                'Performance optimization techniques'
              ]
            },
            {
              title: 'Session 9: Database Design & PostgreSQL',
              topics: [
                'Relational database design principles',
                'PostgreSQL advanced features',
                'Query optimization and indexing',
                'Database migrations and versioning'
              ]
            },
            {
              title: 'Session 10: Supabase Backend-as-a-Service',
              topics: [
                'Supabase setup and configuration',
                'Real-time subscriptions',
                'Row Level Security (RLS)',
                'Edge Functions development'
              ]
            },
            {
              title: 'Session 11: Authentication & Authorization',
              topics: [
                'JWT token-based authentication',
                'OAuth and social login integration',
                'Role-based access control',
                'Security best practices'
              ]
            },
            {
              title: 'Session 12: API Development & GraphQL',
              topics: [
                'RESTful API best practices',
                'GraphQL schema design',
                'API versioning strategies',
                'Rate limiting and caching'
              ]
            }
          ]
        },
        {
          module: 'Module 3: DevOps & Deployment',
          sessions: [
            {
              title: 'Session 13: Git Workflows & Team Collaboration',
              topics: [
                'Advanced Git workflows (GitFlow, GitHub Flow)',
                'Branch management strategies',
                'Code review best practices',
                'Conflict resolution techniques'
              ]
            },
            {
              title: 'Session 14: CI/CD with GitHub Actions',
              topics: [
                'GitHub Actions workflow setup',
                'Automated testing pipelines',
                'Deployment automation',
                'Security scanning and quality gates'
              ]
            },
            {
              title: 'Session 15: Docker Containerization',
              topics: [
                'Docker fundamentals and best practices',
                'Multi-stage builds optimization',
                'Docker Compose for development',
                'Container orchestration basics'
              ]
            },
            {
              title: 'Session 16: Cloud Deployment Strategies',
              topics: [
                'Vercel and Netlify deployment',
                'AWS, Azure, and GCP platforms',
                'Serverless vs traditional hosting',
                'CDN and performance optimization'
              ]
            },
            {
              title: 'Session 17: Environment & Configuration Management',
              topics: [
                'Environment variable management',
                'Configuration as code',
                'Secrets management',
                'Multi-environment deployment'
              ]
            },
            {
              title: 'Session 18: Monitoring & Error Tracking',
              topics: [
                'Application performance monitoring',
                'Error tracking and alerting',
                'Log aggregation and analysis',
                'Health checks and uptime monitoring'
              ]
            }
          ]
        },
        {
          module: 'Module 4: Full-Stack Projects & Career Prep',
          sessions: [
            {
              title: 'Session 19: E-commerce Platform Project',
              topics: [
                'E-commerce architecture design',
                'Product catalog and inventory management',
                'Shopping cart and checkout flow',
                'Payment integration and security'
              ]
            },
            {
              title: 'Session 20: Social Media Application',
              topics: [
                'Social media app architecture',
                'User profiles and authentication',
                'Post creation and media handling',
                'Social features (likes, comments, follows)'
              ]
            },
            {
              title: 'Session 21: Real-time Chat Application',
              topics: [
                'WebSocket implementation',
                'Real-time messaging architecture',
                'Chat rooms and private messaging',
                'Message persistence and history'
              ]
            },
            {
              title: 'Session 22: Portfolio Website Development',
              topics: [
                'Personal branding and portfolio design',
                'Showcase project presentation',
                'SEO optimization techniques',
                'Performance optimization'
              ]
            },
            {
              title: 'Session 23: Testing & Quality Assurance',
              topics: [
                'Unit testing with Jest and React Testing Library',
                'Integration and E2E testing',
                'Code quality tools (ESLint, Prettier)',
                'Test-driven development practices'
              ]
            },
            {
              title: 'Session 24: Career Preparation & Job Search',
              topics: [
                'Technical interview preparation',
                'Coding challenge strategies',
                'Portfolio optimization for job search',
                'Networking and industry connections'
              ]
            }
          ]
        }
      ]
    }
  ]

  const otherCourses = [
    {
      id: 'quantum-computing',
      title: 'Quantum Computing',
      subtitle: 'Next-Generation Computing',
      description: 'Dive into the revolutionary world of quantum computing and learn to build quantum algorithms and applications.',
      duration: '4 Months',
      format: 'Live + Recorded',
      price: { inr: 11999, usd: 599 },
      gradient: 'from-purple-600 via-violet-600 to-indigo-600',
      icon: <Atom className="w-8 h-8 text-white" />,
      features: [
        'Quantum Algorithms & Principles',
        'Quantum Machine Learning',
        'Quantum Computing Platforms',
        'Real-world Applications',
        'Quantum Cryptography',
        'Research Project Development'
      ],
      tools: [
        { name: 'Qiskit', color: 'bg-purple-100 text-purple-800' },
        { name: 'Cirq', color: 'bg-blue-100 text-blue-800' },
        { name: 'PennyLane', color: 'bg-green-100 text-green-800' },
        { name: 'PyQuil', color: 'bg-orange-100 text-orange-800' },
        { name: 'Quantum SDK', color: 'bg-pink-100 text-pink-800' },
        { name: 'IBM Quantum', color: 'bg-indigo-100 text-indigo-800' }
      ]
    },
    {
      id: 'business-intelligence',
      title: 'Business Intelligence with Power BI & Tableau',
      subtitle: 'Data Visualization & Analytics',
      description: 'Master business intelligence tools and create powerful dashboards and analytics solutions for data-driven decision making.',
      duration: '4 Months',
      format: 'Live + Recorded',
      price: { inr: 2999, usd: 149 },
      gradient: 'from-blue-600 via-cyan-600 to-teal-600',
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      features: [
        'Power BI Dashboard Development',
        'Tableau Advanced Visualizations',
        'Data Modeling & ETL Processes',
        'Business Analytics & KPIs',
        'Cloud Integration (Azure/AWS)',
        'SQL Database Management'
      ],
      tools: [
        { name: '📊 Power BI', color: 'bg-yellow-100 text-yellow-800' },
        { name: '📈 Tableau', color: 'bg-blue-100 text-blue-800' },
        { name: '🗃️ SQL', color: 'bg-gray-100 text-gray-800' },
        { name: '☁️ Azure', color: 'bg-blue-100 text-blue-800' },
        { name: '🚀 AWS', color: 'bg-orange-100 text-orange-800' },
        { name: '🐍 Python', color: 'bg-green-100 text-green-800' }
      ]
    },
    {
      id: 'excel-automation',
      title: 'Microsoft Excel & O365 Automation with Python, VBA & AI',
      subtitle: 'Automate Your Workflow',
      description: 'Transform your productivity with advanced Excel automation, O365 integration, and AI-powered solutions.',
      duration: '4 Months',
      format: 'Live + Recorded',
      price: { inr: 2999, usd: 149 },
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      icon: <Calculator className="w-8 h-8 text-white" />,
      features: [
        'Excel Automation with Python',
        'VBA Macro Development',
        'O365 API Integration',
        'AI-Powered Data Processing',
        'Power Automate Workflows',
        'Power Apps Development'
      ],
      tools: [
        { name: '📊 Excel', color: 'bg-green-100 text-green-800' },
        { name: '🐍 Python', color: 'bg-blue-100 text-blue-800' },
        { name: '⚡ VBA', color: 'bg-purple-100 text-purple-800' },
        { name: '🔄 Power Automate', color: 'bg-blue-100 text-blue-800' },
        { name: '📱 Power Apps', color: 'bg-red-100 text-red-800' },
        { name: '🤖 Copilot Studio', color: 'bg-indigo-100 text-indigo-800' }
      ]
    },
    {
      id: 'corporate-training',
      title: 'Corporate Training',
      subtitle: 'Custom Team Solutions',
      description: 'Tailored training programs for organizations looking to upskill their teams in AI, data science, and modern technologies.',
      duration: 'Flexible',
      format: 'On-site/Remote',
      price: { inr: 0, usd: 0, custom: true },
      gradient: 'from-gray-600 via-slate-600 to-zinc-600',
      icon: <Building2 className="w-8 h-8 text-white" />,
      features: [
        'Team Training Programs',
        'Custom Curriculum Development',
        'Implementation Support',
        'Ongoing Consultation',
        'Progress Tracking & Assessment',
        'Certificate Programs'
      ],
      isCustom: true
    }
  ]

  const stats = [
    { number: '10000+', text: 'Students Trained', icon: <Users className="w-8 h-8" /> },
    { number: '95%', text: 'Success Rate', icon: <TrendingUp className="w-8 h-8" /> },
    { number: '100+', text: 'AI Projects Built', icon: <Rocket className="w-8 h-8" /> },
    { number: '4.9/5', text: 'Average Rating', icon: <Star className="w-8 h-8" /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-blue-200 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-blue-300 mx-2" />
                    <Link to="/courses" className="text-blue-200 hover:text-white transition-colors">
                      Courses
                    </Link>
                  </div>
                </li>
                {!isAllCourses && (
                  <li>
                    <div className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-blue-300 mx-2" />
                      <span className="text-white font-medium">{getBreadcrumb()}</span>
                    </div>
                  </li>
                )}
              </ol>
            </nav>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {getPageTitle()}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              {getPageDescription()}
            </p>
            
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
          </div>
        </div>

        {/* Quick Course Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="text-center mb-6">
            <p className="text-blue-200 text-sm font-medium">Explore All Our Courses</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              to="/courses/agentic-ai"
              className={`bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-lg text-center transition-all duration-200 hover:scale-105 border border-white/20 ${isAgenticAI ? 'ring-2 ring-white/50' : ''}`}
            >
              <div className="text-2xl mb-1">🤖</div>
              <div className="text-xs font-semibold">Agentic AI</div>
            </Link>
            <Link
              to="/courses/vive-coding"
              className={`bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-lg text-center transition-all duration-200 hover:scale-105 border border-white/20 ${isViveCoding ? 'ring-2 ring-white/50' : ''}`}
            >
              <div className="text-2xl mb-1">💻</div>
              <div className="text-xs font-semibold">Vive Coding</div>
            </Link>
            <Link
              to="/courses#quantum-computing"
              className={`bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-lg text-center transition-all duration-200 hover:scale-105 border border-white/20 ${isOtherCourses ? 'ring-2 ring-white/50' : ''}`}
            >
              <div className="text-2xl mb-1">⚛️</div>
              <div className="text-xs font-semibold">Quantum Computing</div>
            </Link>
            <Link
              to="/courses#business-intelligence"
              className={`bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-lg text-center transition-all duration-200 hover:scale-105 border border-white/20 ${isOtherCourses ? 'ring-2 ring-white/50' : ''}`}
            >
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs font-semibold">Business Intelligence</div>
            </Link>
            <Link
              to="/courses#excel-automation"
              className={`bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-lg text-center transition-all duration-200 hover:scale-105 border border-white/20 ${isOtherCourses ? 'ring-2 ring-white/50' : ''}`}
            >
              <div className="text-2xl mb-1">📈</div>
              <div className="text-xs font-semibold">Excel Automation</div>
            </Link>
            <Link
              to="/courses#corporate-training"
              className={`bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-lg text-center transition-all duration-200 hover:scale-105 border border-white/20 ${isOtherCourses ? 'ring-2 ring-white/50' : ''}`}
            >
              <div className="text-2xl mb-1">🏢</div>
              <div className="text-xs font-semibold">Corporate Training</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Courses Section */}
      {(isAllCourses || isAgenticAI || isViveCoding) && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {isAllCourses ? 'Our Flagship Courses' : 'Course Details'}
              </h2>
              <p className="text-xl text-gray-600">
                {isAllCourses ? 'Master AI development with expert guidance' : 'Comprehensive curriculum designed by industry experts'}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {mainCourses
                .filter(course => {
                  if (isAgenticAI) return course.id === 'agentic-ai'
                  if (isViveCoding) return course.id === 'vive-coding'
                  return true
                })
                .map((course, index) => (
                <div key={index} className={`bg-gradient-to-br ${course.gradient} rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="p-8 text-white">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                        {course.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                        <p className="text-lg opacity-90">{course.subtitle}</p>
                      </div>
                    </div>
                    
                    <p className="text-lg opacity-90 mb-6 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>{course.format}</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">
                          ₹{course.price.inr}/month or ${course.price.usd}/month
                        </div>
                        <p className="text-sm opacity-80">4 months duration • Monthly payments</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      {course.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                          <span className="text-white/90">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Course Highlights */}
                    <div className="mb-6">
                      <h4 className="text-xl font-bold mb-4 text-center">🌟 Why Choose This Course?</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-3">
                          <span className="text-2xl">🎥</span>
                          <div>
                            <div className="font-semibold text-white">100% Live Sessions</div>
                            <div className="text-white/80 text-sm">Not Pre-recorded</div>
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-3">
                          <span className="text-2xl">🛠️</span>
                          <div>
                            <div className="font-semibold text-white">Build Real Projects</div>
                            <div className="text-white/80 text-sm">With Arijit's Guidance</div>
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-3">
                          <span className="text-2xl">🏆</span>
                          <div>
                            <div className="font-semibold text-white">2 Certificates</div>
                            <div className="text-white/80 text-sm">Intermediate + Expert</div>
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-3">
                          <span className="text-2xl">🌍</span>
                          <div>
                            <div className="font-semibold text-white">Global Time Zones</div>
                            <div className="text-white/80 text-sm">Batch Timing Options</div>
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-3">
                          <span className="text-2xl">📅</span>
                          <div>
                            <div className="font-semibold text-white">Weekend Classes</div>
                            <div className="text-white/80 text-sm">Work-Life Balance</div>
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-3">
                          <span className="text-2xl">🏭</span>
                          <div>
                            <div className="font-semibold text-white">Industrial Guidance</div>
                            <div className="text-white/80 text-sm">Real Implementation</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3">Technologies You'll Learn:</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.technologies.map((tech, idx) => (
                          <span key={idx} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Curriculum - Only show on individual course pages or if it's the main courses page */}
                    {(course.curriculum && (isAgenticAI || isViveCoding || isAllCourses)) && (
                      <div className="mb-6">
                        <h4 className="text-xl font-bold mb-6 text-center">📚 Course Curriculum</h4>
                        
                        {/* Intermediate Track */}
                        <div className="mb-8">
                          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                            <h5 className="text-lg font-bold text-center text-green-300 mb-2">
                              🎯 Intermediate Track (4 Months)
                            </h5>
                            <p className="text-center text-white/80 text-sm">
                              Build strong foundations and core skills
                            </p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {course.curriculum.slice(0, 2).map((module, moduleIdx) => (
                              <div key={moduleIdx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                                <h6 className="font-bold text-white mb-3 text-center border-b border-white/20 pb-2">
                                  {module.module} (2 Months)
                                </h6>
                                <ul className="text-sm text-white/90 space-y-2">
                                  {module.sessions.map((session, sessionIdx) => (
                                    <li key={sessionIdx} className="flex items-start space-x-3">
                                      <span className="text-green-300 mt-1 text-lg">✓</span>
                                      <span className="leading-relaxed">{session.title}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Expert Track */}
                        <div className="mb-6">
                          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                            <h5 className="text-lg font-bold text-center text-yellow-300 mb-2">
                              🚀 Expert Track (4 Months)
                            </h5>
                            <p className="text-center text-white/80 text-sm">
                              Advanced concepts and real-world projects
                            </p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {course.curriculum.slice(2, 4).map((module, moduleIdx) => (
                              <div key={moduleIdx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                                <h6 className="font-bold text-white mb-3 text-center border-b border-white/20 pb-2">
                                  {module.module} (2 Months)
                                </h6>
                                <ul className="text-sm text-white/90 space-y-2">
                                  {module.sessions.map((session, sessionIdx) => (
                                    <li key={sessionIdx} className="flex items-start space-x-3">
                                      <span className="text-yellow-300 mt-1 text-lg">★</span>
                                      <span className="leading-relaxed">{session.title}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handlePayNow(course.title)}
                      className="w-full bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <span>Enroll Now - ₹{course.price.inr}/month</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Courses Section */}
      {(isAllCourses || isOtherCourses) && (
        <section id="other-courses" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Specialized Professional Courses
              </h2>
              <p className="text-xl text-gray-600">
                Expand your expertise with cutting-edge technologies and business intelligence
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {otherCourses.map((course, index) => (
                <div key={index} id={course.id} className={`bg-gradient-to-br ${course.gradient} rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300`}>
                  <div className="p-8 text-white">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                        {course.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                        <p className="text-lg opacity-90">{course.subtitle}</p>
                      </div>
                    </div>
                    
                    <p className="text-lg opacity-90 mb-6 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>{course.format}</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                      <div className="text-center">
                        {course.isCustom ? (
                          <div>
                            <div className="text-3xl font-bold mb-2">Custom Pricing</div>
                            <p className="text-sm opacity-80">Contact us for tailored solutions</p>
                          </div>
                        ) : (
                          <div>
                            <div className="text-3xl font-bold mb-2">
                              ₹{course.price.inr}/month or ${course.price.usd}/month
                            </div>
                            <p className="text-sm opacity-80">4 months duration • Monthly payments</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {course.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                          <span className="text-white/90">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tools/Technologies */}
                    {course.tools && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-3">Tools & Technologies:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {course.tools.map((tool, idx) => (
                            <span key={idx} className={`${tool.color} px-3 py-2 rounded-lg text-sm font-medium text-center`}>
                              {tool.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {course.isCustom ? (
                      <div className="space-y-3">
                        <a
                          href="https://wa.me/919930051053?text=Hi! I'm interested in Corporate Training programs. Please share more details about custom training solutions for my organization."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span>Chat with Arijit on WhatsApp</span>
                        </a>
                        <a
                          href="tel:+919930051053"
                          className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                        >
                          <Phone className="w-5 h-5" />
                          <span>Call Arijit Now</span>
                        </a>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePayNow(course.title)}
                        className="w-full bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <span>Enroll Now - ₹{course.price.inr}/month</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
            {!user ? (
              <>
                
                <Link
                  to="/contact"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
                >
                  Get Free Consultation
                </Link>
              </>
            ) : (
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                🚀 Get Free Consultation
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultCourse={selectedCourse}
      />

      {/* Live Projects Section - Only for Agentic AI */}
      {activeTab === 'agentic-ai' && (
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                🚀 Live Projects You'll Build
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
                Develop 12 production-ready AI projects worth over $2.5 Million in market value. 
                Each project is designed to solve real-world problems and can be deployed immediately.
              </p>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                  <div className="text-sm text-gray-600">Live Projects</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">$2.5M+</div>
                  <div className="text-sm text-gray-600">Total Market Value</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">40</div>
                  <div className="text-sm text-gray-600">Training Sessions</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                  <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
                  <div className="text-sm text-gray-600">Industries Covered</div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project 1 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Multi-LLM Intelligence Platform</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Sessions 3-5</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$50,000</div>
                  <div className="text-blue-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Python</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">OpenAI API</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Claude API</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Gemini API</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">AI Consulting, Tech Companies, Enterprise IT</p>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Advanced Document Intelligence System</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Sessions 7-9</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$75,000</div>
                  <div className="text-green-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">LangChain</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">BERT</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Pinecone</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">FAISS</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">Legal Services, Compliance, Research</p>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Multi-Agent Content Creation Platform</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Sessions 11-13</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$85,000</div>
                  <div className="text-purple-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">CrewAI</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">LangGraph</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Multi-agent</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Workflow</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">Digital Marketing, E-learning, Publishing, Media</p>
                  </div>
                </div>
              </div>

              {/* Project 4 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Enterprise Workflow Automation Suite</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Sessions 15-17</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$100,000</div>
                  <div className="text-orange-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">n8n</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Make</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">API Integration</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Automation</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">Enterprises, Business Process Automation</p>
                  </div>
                </div>
              </div>

              {/* Project 5 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">AI-Driven Analytics & Intelligence Hub</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Sessions 18-19</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$120,000</div>
                  <div className="text-teal-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">LangFlow</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Relevance.ai</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Embeddings</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Semantic Search</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">Data Analytics, Business Intelligence, Fortune 500</p>
                  </div>
                </div>
              </div>

              {/* Project 6 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Production-Ready Agent Ecosystem</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Session 20</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$150,000</div>
                  <div className="text-indigo-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">All Frameworks</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Cloud Deploy</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Monitoring</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Architecture</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">System Integration, Digital Transformation</p>
                  </div>
                </div>
              </div>

              {/* Project 7 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Enterprise Multi-Agent Architecture</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Sessions 22-25</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$200,000</div>
                  <div className="text-red-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Advanced CrewAI</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">LangGraph</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">AutoGen</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Message Queue</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">Enterprise Architecture, Fintech, Supply Chain</p>
                  </div>
                </div>
              </div>

              {/* Project 8 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Advanced Semantic Intelligence Platform</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Sessions 27-29</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$250,000</div>
                  <div className="text-yellow-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Custom Embeddings</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Multi-modal</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Knowledge Graphs</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Vector Optimization</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">AI Research, Knowledge Management, Search Providers</p>
                  </div>
                </div>
              </div>

              {/* Project 9 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-gray-600 to-slate-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Scalable Production Infrastructure</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Sessions 31-33</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$300,000</div>
                  <div className="text-gray-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Kubernetes</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Docker</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Service Mesh</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Monitoring</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">Cloud Services, DevOps, Enterprise IT</p>
                  </div>
                </div>
              </div>

              {/* Project 10 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-rose-600 to-red-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Security & Compliance Framework</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Sessions 35-36</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$350,000</div>
                  <div className="text-rose-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Zero Trust</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Compliance</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Security Testing</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Audit Systems</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">Cybersecurity, Government, Financial Services</p>
                  </div>
                </div>
              </div>

              {/* Project 11 */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Complete MLOps & Business Strategy Platform</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Sessions 38-39</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$400,000</div>
                  <div className="text-emerald-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">MLOps Pipelines</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Business Strategy</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Client Acquisition</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Industry Apps</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm">ML Engineering, Consulting, Strategic Advisory</p>
                  </div>
                </div>
              </div>

              {/* Project 12 - Capstone */}
              <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden border-2 border-gradient-to-r from-yellow-400 to-orange-500 relative">
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  🏆 CAPSTONE
                </div>
                <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">Next-Generation Enterprise Ecosystem</h3>
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">Session 40</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">$450,000</div>
                  <div className="text-yellow-100 text-sm">Market Value</div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">All Technologies</span>
                      <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-2 py-1 rounded-full text-xs font-medium">Future Trends</span>
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">Complete Solution</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Industry:</h4>
                    <p className="text-gray-600 text-sm font-medium">Fortune 500, Global Consulting, Innovation Labs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Build Million-Dollar AI Solutions?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Join our Agentic AI course and develop 12 production-ready projects that can transform your career 
                  and potentially generate significant revenue.
                </p>
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  🚀 Start Building Today - Enroll Now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Courses