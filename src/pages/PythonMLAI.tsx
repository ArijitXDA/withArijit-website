import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from '../components/PaymentModal'
import { useState } from 'react'
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
  Database,
  BarChart3,
  Cpu,
  GitBranch,
  Layers,
  Network
} from 'lucide-react'

const PythonMLAI: React.FC = () => {
  const { user } = useAuth()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const intermediateTrack = [
    { session: 1, title: "Introduction to AI, ML & Course Overview", topics: "AI/ML landscape, real-world applications, Python for ML, course expectations" },
    { session: 2, title: "Python Programming Basics", topics: "Syntax, Jupyter/IDE setup, variables, data types" },
    { session: 3, title: "Control Flow & Functions in Python", topics: "Loops, conditionals, functions, best practices" },
    { session: 4, title: "Python Data Structures & Libraries", topics: "Lists, dictionaries, sets, tuples, intro to Numpy/Pandas" },
    { session: 5, title: "Data Import, Cleaning, and Exploration", topics: "Reading files, handling missing values, basic EDA with Pandas" },
    { session: 6, title: "Data Manipulation with Pandas & Numpy", topics: "Selecting, filtering, grouping, vectorized computation" },
    { session: 7, title: "Data Visualization 1 – Foundations", topics: "Matplotlib: plots, charts, customization" },
    { session: 8, title: "Data Visualization 2 – Advanced & Business KPIs", topics: "Seaborn, business-focused KPIs, dashboards" },
    { session: 9, title: "ML Fundamentals & Problem Framing", topics: "Supervised vs. unsupervised, business case framing" },
    { session: 10, title: "Data Preprocessing Techniques", topics: "Encoding, scaling, feature transformations" },
    { session: 11, title: "Regression Models – Linear & Logistic", topics: "Model intuition, code, business applications" },
    { session: 12, title: "Model Evaluation & Validation", topics: "Metrics (accuracy, RMSE, ROC), overfitting, cross-validation" },
    { session: 13, title: "Classification Algorithms 1", topics: "K-NN, Decision Trees: theory & practice" },
    { session: 14, title: "Classification Algorithms 2 & Random Forests", topics: "Ensemble methods intro, Random Forests coding" },
    { session: 15, title: "Time Series Forecasting", topics: "Date-time handling, ARIMA, exponential smoothing" },
    { session: 16, title: "Feature Engineering & Selection", topics: "Feature creation, selection, importance, practical examples" },
    { session: 17, title: "Clustering & Market Segmentation", topics: "K-means, hierarchical clustering, business use-cases" },
    { session: 18, title: "Neural Networks & Deep Learning (Basics)", topics: "Neural net basics, intro to Keras/TensorFlow, simple classification/regression" },
    { session: 19, title: "Deployment, Model Strategy & AI Ethics", topics: "Deploying ML models, business strategy, bias & fairness, responsible AI" },
    { session: 20, title: "Capstone Project Demo & Wrap-up", topics: "Capstone presentations, critical feedback, Q&A, course summary" }
  ]

  const expertTrack = [
    { session: 1, title: "Modern Dev Environments: Cursor & Copilot", topics: "Setup, workflow, productivity hacks, IDE extensions (Cursor, Copilot)" },
    { session: 2, title: "Claude Code & Command-line AI", topics: "Claude Code terminal integration, agentic workflow, advanced codebase navigation" },
    { session: 3, title: "GitHub Spark: Rapid AI App Prototyping", topics: "Building micro-apps with Spark, AI-powered prototypes, deployment pipelines" },
    { session: 4, title: "Advanced OOP in Python for AI", topics: "Abstract classes, design patterns, meta-programming for ML projects" },
    { session: 5, title: "Python for Large-scale Data Science", topics: "Async workflows, distributed computing (Dask, Ray), pipeline orchestration" },
    { session: 6, title: "NLP Fundamentals & NLTK Deep-dive", topics: "Tokenization, POS tagging, text classification, custom pipelines" },
    { session: 7, title: "Transformers & BERT in Practice", topics: "Fine-tuning BERT, embedding spaces, transfer learning, Hugging Face usage" },
    { session: 8, title: "SpaCy & Modern NLP Workflows", topics: "Entity extraction, dependency parsing, neural pipelines, custom model training" },
    { session: 9, title: "OpenAI & Llama APIs for GenAI", topics: "Building with GPT models, Llama for open-source LLMs, prompt engineering" },
    { session: 10, title: "Grok & Pinecone: Advanced Retrieval", topics: "Business search engines, semantic search, vector databases on Pinecone" },
    { session: 11, title: "Creating Custom Agents with LangChain", topics: "Multi-agent orchestration, context-aware chains, retrieval augmented generation" },
    { session: 12, title: "LangGraph for Multi-Agent Systems", topics: "Cyclical graphs, stateful orchestration, collaborative agentic workflows" },
    { session: 13, title: "Autogen, Crew AI, and Semantic Kernel", topics: "Framework comparison, workflow integration, building autonomous agent teams" },
    { session: 14, title: "Agentic Prompting & Planning", topics: "Agentic reasoning, task decomposition, advanced prompt chaining" },
    { session: 15, title: "Github-based Collaboration at Scale", topics: "Spark app collaboration, issue-driven workflows, Copilot for team productivity" },
    { session: 16, title: "GenAI for Unstructured Data", topics: "Summarization, Q&A, document clustering, multi-modal agents" },
    { session: 17, title: "Custom LLM Deployment & Monitoring", topics: "Containerized serving, API endpoints, model monitoring, CI/CD" },
    { session: 18, title: "Responsible AI: Ethics, Fairness, Security", topics: "Bias mitigation, responsible pipeline, privacy, secure agentic workflows" },
    { session: 19, title: "Real-World Capstone: Agentic AI Solutions", topics: "Build real multi-agent solution: business/coding/creative" },
    { session: 20, title: "Capstone Demo, Review & Expert Q&A", topics: "Project presentations, peer feedback, scaling, navigating advanced AI careers" }
  ]

  const benefits = [
    "Master Python programming from basics to advanced AI applications",
    "Build real-world machine learning models and AI systems",
    "Learn both traditional ML and cutting-edge generative AI techniques",
    "Get hands-on experience with industry-standard tools and frameworks",
    "Develop a portfolio of ML projects for career advancement"
  ]

  const testimonials = [
    {
      name: 'Dr. Harish B Suri',
      role: 'Professor | IIM Mumbai | IIT Kharagpur | FMS Delhi',
      text: 'Arijit\'s grip on data sciences is superb and his analytical skills cut across various industry verticals. His operational skills span from Excel/Power BI to complex AI-ML algorithms.',
      rating: 5,
      image: '👨‍🎓'
    },
    {
      name: 'Sourav Choudhury',
      role: 'LinkedIn Trainer | Business Coach | KJSIM | IIM Mumbai',
      text: 'Arijit mentored me with dedication and strategic insight. His blend of technical expertise and practical thinking helped me advance in data science.',
      rating: 5,
      image: '👨‍💼'
    }
  ]

  const stats = [
    { number: '10000+', text: 'Students Trained', icon: <Users className="w-8 h-8" /> },
    { number: '95%', text: 'Success Rate', icon: <TrendingUp className="w-8 h-8" /> },
    { number: '100+', text: 'ML Projects Built', icon: <Rocket className="w-8 h-8" /> },
    { number: '4.9/5', text: 'Average Rating', icon: <Star className="w-8 h-8" /> }
  ]

  const technologies = [
    { name: 'Python', icon: '🐍', description: 'Core programming language for ML & AI' },
    { name: 'Pandas & NumPy', icon: '📊', description: 'Data manipulation and numerical computing' },
    { name: 'Scikit-learn', icon: '🤖', description: 'Machine learning algorithms and tools' },
    { name: 'TensorFlow/Keras', icon: '🧠', description: 'Deep learning and neural networks' },
    { name: 'OpenAI API', icon: '⚡', description: 'Generative AI and language models' },
    { name: 'LangChain', icon: '🔗', description: 'Building AI applications and agents' },
    { name: 'Jupyter Notebooks', icon: '📓', description: 'Interactive development environment' },
    { name: 'Git & GitHub', icon: '🔄', description: 'Version control and collaboration' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Learn Agentic AI & Vibe Coding
              <span className="block text-green-300 text-3xl md:text-4xl mt-2">
                Complete Mastery Program
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Master Python programming and build production-ready machine learning and AI applications 
              with expert guidance from Arijit Chowdhury.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>🚀 Enroll Now</span>
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
                className="bg-white text-green-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Meet the Instructor
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-green-300 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <p className="text-green-200 text-sm">{stat.text}</p>
                </div>
              ))}
            </div>

            {/* Perfect For Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4 text-center">🎯 Perfect for:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">👨‍💻</div>
                  <span className="text-white text-sm font-medium">Developers</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <span className="text-white text-sm font-medium">Data Analysts</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">🎓</div>
                  <span className="text-white text-sm font-medium">Students</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">💼</div>
                  <span className="text-white text-sm font-medium">Business Professionals</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">🔬</div>
                  <span className="text-white text-sm font-medium">Researchers</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">🚀</div>
                  <span className="text-white text-sm font-medium">Career Switchers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Python ML & AI Mastery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From Python fundamentals to advanced AI applications - master the complete stack 
              with two specialized learning tracks designed for different experience levels.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Intermediate Track */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Intermediate Track</h3>
                  <p className="text-blue-600 font-semibold">Foundation to ML Mastery</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Perfect for beginners and those looking to build a solid foundation in Python, 
                data science, and machine learning. Start from basics and progress to building 
                real ML models.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Python Programming Fundamentals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Data Science with Pandas & NumPy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Machine Learning Algorithms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Deep Learning Basics</span>
                </div>
              </div>
            </div>

            {/* Expert Track */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Expert Track</h3>
                  <p className="text-purple-600 font-semibold">Advanced AI Development</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Advanced track for experienced developers ready to dive deep into modern AI development, 
                including generative AI, multi-agent systems, and production deployment strategies.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Modern AI Development Tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Advanced NLP & Transformers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Multi-Agent AI Systems</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Production AI Deployment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technologies You'll Master
            </h2>
            <p className="text-xl text-gray-600">
              Learn the complete Python ML & AI technology stack
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="text-4xl mb-4">{tech.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tech.name}</h3>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum - Intermediate Track */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Intermediate Track Curriculum
            </h2>
            <p className="text-xl text-gray-600">
              20 comprehensive sessions covering Python fundamentals to machine learning mastery
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-4 px-2 font-bold text-gray-900">Session</th>
                    <th className="text-left py-4 px-2 font-bold text-gray-900">Title</th>
                    <th className="text-left py-4 px-2 font-bold text-gray-900">Topics & Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {intermediateTrack.map((session, index) => (
                    <tr key={index} className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-bold text-blue-600">{session.session}</td>
                      <td className="py-4 px-2 font-semibold text-gray-900">{session.title}</td>
                      <td className="py-4 px-2 text-gray-700">{session.topics}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum - Expert Track */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Expert Track Curriculum
            </h2>
            <p className="text-xl text-gray-600">
              Advanced AI development with modern tools and cutting-edge techniques
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-200">
                    <th className="text-left py-4 px-2 font-bold text-gray-900">Session</th>
                    <th className="text-left py-4 px-2 font-bold text-gray-900">Title</th>
                    <th className="text-left py-4 px-2 font-bold text-gray-900">Topics & Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {expertTrack.map((session, index) => (
                    <tr key={index} className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-2 font-bold text-purple-600">{session.session}</td>
                      <td className="py-4 px-2 font-semibold text-gray-900">{session.title}</td>
                      <td className="py-4 px-2 text-gray-700">{session.topics}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 bg-white">
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
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Instructor */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Learn from the Expert
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Arijit Chowdhury brings over 15 years of experience in Python development, 
                machine learning, and AI. He has successfully trained thousands of professionals 
                in data science and AI technologies.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">18+ years Python & ML experience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">10000+ students trained successfully</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">Expert in Python, ML & AI</span>
                </div>
              </div>
              
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6">
                <img 
                  src="/82597b4e-e193-45e5-a266-e303e029de30-removebg-preview.png" 
                  alt="Arijit Chowdhury - Python ML & AI Expert"
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
              <p className="text-lg text-gray-600">Python ML & AI Expert</p>
              <p className="text-green-600 font-semibold">18+ Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Success stories from our Python ML & AI graduates
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Master Python for ML & AI?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who have successfully built their ML & AI careers 
            with Python. Start your journey today with expert guidance and hands-on training.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Enroll Now
            </button>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-200"
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
        defaultCourse="Python for ML & AI"
      />
    </div>
  )
}

export default PythonMLAI