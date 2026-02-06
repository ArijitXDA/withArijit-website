import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from '../components/PaymentModal'
import { useState } from 'react'
import { 
  Zap, 
  Code, 
  Star, 
  Users, 
  Award, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  ArrowRight,
  BookOpen,
  Target,
  Rocket,
  Phone,
  Lightbulb,
  Heart,
  Music,
  Palette,
  Sparkles,
  Play,
  Globe
} from 'lucide-react'

const VibeCoding: React.FC = () => {
  const { user } = useAuth()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const vibeMethodology = [
    {
      title: "Feel the Code",
      description: "Experience coding as an emotional and intuitive journey, not just logical problem-solving",
      icon: <Heart className="w-8 h-8" />,
      color: "text-red-500"
    },
    {
      title: "Rhythm-Based Learning",
      description: "Learn programming concepts through musical patterns and rhythmic thinking",
      icon: <Music className="w-8 h-8" />,
      color: "text-purple-500"
    },
    {
      title: "Visual Creativity",
      description: "Transform abstract code concepts into visual, artistic representations",
      icon: <Palette className="w-8 h-8" />,
      color: "text-blue-500"
    },
    {
      title: "Intuitive Flow",
      description: "Develop natural coding instincts through immersive, flow-state programming",
      icon: <Sparkles className="w-8 h-8" />,
      color: "text-yellow-500"
    }
  ]

  const curriculum = [
    {
      week: "Week 1-2",
      title: "Vibe Foundation",
      topics: [
        "Introduction to Vibe Coding Philosophy",
        "Setting Up Your Creative Development Environment",
        "Feeling Your First Lines of Code",
        "Understanding Code Rhythm and Flow"
      ]
    },
    {
      week: "Week 3-4",
      title: "Emotional Programming",
      topics: [
        "Coding with Emotion and Intuition",
        "Building Empathy into Your Applications",
        "User Experience Through Developer Experience",
        "Creating Code That Tells Stories"
      ]
    },
    {
      week: "Week 5-8",
      title: "Interactive Development",
      topics: [
        "Real-time Collaborative Coding",
        "Live Code Jamming Sessions",
        "Building Interactive AI Applications",
        "Community-Driven Development"
      ]
    },
    {
      week: "Week 9-12",
      title: "Creative AI Integration",
      topics: [
        "AI-Assisted Creative Coding",
        "Building Emotionally Intelligent Applications",
        "Artistic Code Generation",
        "Human-AI Collaborative Development"
      ]
    },
    {
      week: "Week 13-16",
      title: "Vibe Mastery",
      topics: [
        "Advanced Vibe Coding Techniques",
        "Teaching Others the Vibe Method",
        "Building Your Signature Coding Style",
        "Capstone Vibe Project Showcase"
      ]
    }
  ]

  const technologies = [
    { name: 'JavaScript/TypeScript', description: 'Modern web development with emotional intelligence' },
    { name: 'React & Next.js', description: 'Building interactive, responsive user experiences' },
    { name: 'Node.js & Express', description: 'Server-side development with creative flair' },
    { name: 'AI APIs Integration', description: 'Connecting with OpenAI, Claude, and other AI services' },
    { name: 'Real-time Technologies', description: 'WebSockets, live collaboration tools' },
    { name: 'Creative Coding Libraries', description: 'p5.js, Three.js for artistic programming' },
    { name: 'Database Design', description: 'MongoDB, PostgreSQL with intuitive schemas' },
    { name: 'Deployment & DevOps', description: 'Vercel, Netlify, Docker with smooth workflows' }
  ]

  const uniqueFeatures = [
    {
      title: "Live Coding Jams",
      description: "Participate in live coding sessions where we build applications together in real-time, sharing the creative energy and problem-solving process.",
      icon: <Play className="w-6 h-6" />
    },
    {
      title: "Emotional Debugging",
      description: "Learn to debug not just with logic, but by understanding the 'feelings' of your code and developing intuitive problem-solving skills.",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Code Poetry",
      description: "Write code that's not just functional but beautiful, readable, and expressive - treating programming as an art form.",
      icon: <Palette className="w-6 h-6" />
    },
    {
      title: "Collaborative Flow States",
      description: "Experience group flow states while coding, where the entire team enters a synchronized, highly productive creative zone.",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      title: "Rhythmic Development",
      description: "Use music, rhythm, and timing to enhance your coding productivity and create more harmonious development workflows.",
      icon: <Music className="w-6 h-6" />
    },
    {
      title: "Intuitive Architecture",
      description: "Design software architecture that feels natural and flows logically, making complex systems feel simple and elegant.",
      icon: <Lightbulb className="w-6 h-6" />
    }
  ]

  const projects = [
    {
      title: "Emotion-Responsive Chat App",
      description: "Build a chat application that responds to user emotions and adapts its interface accordingly",
      duration: "Week 3-4"
    },
    {
      title: "Musical Code Generator",
      description: "Create an AI tool that generates code based on musical inputs and rhythmic patterns",
      duration: "Week 6-7"
    },
    {
      title: "Collaborative Art Platform",
      description: "Develop a real-time collaborative platform where multiple users create digital art together",
      duration: "Week 9-10"
    },
    {
      title: "Vibe-Based Learning System",
      description: "Build an adaptive learning platform that adjusts to users' emotional and learning states",
      duration: "Week 12-13"
    },
    {
      title: "Personal Vibe Assistant",
      description: "Create an AI assistant that understands and adapts to your personal coding style and preferences",
      duration: "Week 15-16"
    }
  ]

  const testimonials = [
    {
      name: 'Dr. Harish B Suri',
      role: 'Professor | IIM Mumbai | IIT Kharagpur | FMS Delhi',
      text: 'Arijit\'s innovative teaching methodology transforms how students approach technology. His Vibe Coding method makes complex programming concepts accessible and enjoyable.',
      rating: 5,
      image: '👨‍🎓'
    },
    {
      name: 'Sourav Choudhury',
      role: 'LinkedIn Trainer | Business Coach | KJSIM | IIM Mumbai',
      text: 'The Vibe Coding approach is revolutionary. It combines technical excellence with creative thinking in ways I\'ve never seen before.',
      rating: 5,
      image: '👨‍💼'
    }
  ]

  const stats = [
    { number: '10000+', text: 'Students Trained', icon: <Users className="w-8 h-8" /> },
    { number: '95%', text: 'Love the Vibe Method', icon: <Heart className="w-8 h-8" /> },
    { number: '100+', text: 'Creative Projects Built', icon: <Palette className="w-8 h-8" /> },
    { number: '4.9/5', text: 'Average Rating', icon: <Star className="w-8 h-8" /> }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg mb-8">
              <Sparkles className="w-6 h-6 mr-2" />
              Revolutionary Learning Method
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Experience
              <span className="block text-pink-300 text-3xl md:text-4xl mt-2">
                Vibe Coding
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              A revolutionary approach to learning programming that combines technical excellence 
              with creativity, emotion, and intuitive understanding. Code with your heart, not just your mind.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>✨ Start Your Vibe Journey</span>
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
                Meet the Creator
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-pink-300 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <p className="text-blue-200 text-sm">{stat.text}</p>
                </div>
              ))}
            </div>

            {/* What Makes It Different */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4 text-center">💫 What Makes Vibe Coding Different:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <span className="text-white text-sm font-medium">Creative & Artistic Approach</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🎵</div>
                  <span className="text-white text-sm font-medium">Rhythm-Based Learning</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💝</div>
                  <span className="text-white text-sm font-medium">Emotional Intelligence</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🌊</div>
                  <span className="text-white text-sm font-medium">Flow State Programming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vibe Methodology */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Vibe Coding Methodology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A revolutionary approach that transforms how you think about and experience programming
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {vibeMethodology.map((method, index) => (
              <div key={index} className="text-center bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className={`${method.color} mb-6 flex justify-center`}>
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{method.title}</h3>
                <p className="text-gray-600 leading-relaxed">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Features */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unique Vibe Coding Features
            </h2>
            <p className="text-xl text-gray-600">
              Experience programming like never before with our innovative approach
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technologies You'll Master
            </h2>
            <p className="text-xl text-gray-600">
              Learn modern development stack through the lens of Vibe Coding
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <Code className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tech.name}</h3>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              16-Week Vibe Coding Journey
            </h2>
            <p className="text-xl text-gray-600">
              Progressive learning path that builds both technical skills and creative intuition
            </p>
          </div>

          <div className="space-y-8">
            {curriculum.map((phase, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4 text-white">
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{phase.title}</h3>
                    <p className="text-purple-600 font-semibold">{phase.week}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {phase.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects You'll Build */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Creative Projects You'll Build
            </h2>
            <p className="text-xl text-gray-600">
              Unique projects that combine technical skills with creative expression
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {project.duration}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
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
                Learn from the Creator
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Arijit Chowdhury developed the Vibe Coding methodology after years of observing how 
                traditional programming education often disconnects students from the creative and 
                intuitive aspects of software development.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">Creator of Vibe Coding methodology</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">10000+ students experienced Vibe Coding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">18+ years in innovative education</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">Teaching across 3 continents</span>
                </div>
              </div>
              
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                <span>Meet Arijit Chowdhury</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6">
                <img 
                  src="/82597b4e-e193-45e5-a266-e303e029de30-removebg-preview.png" 
                  alt="Arijit Chowdhury - Creator of Vibe Coding"
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
              <p className="text-lg text-gray-600">Creator of Vibe Coding</p>
              <p className="text-purple-600 font-semibold">Revolutionary Educator</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Students Say About Vibe Coding
            </h2>
            <p className="text-xl text-gray-600">
              Transformative experiences from our Vibe Coding community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100">
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

      {/* Why Vibe Coding Works */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Vibe Coding Works
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Scientific principles behind our revolutionary approach to programming education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-4">Neuroplasticity</h3>
              <p className="text-purple-100">Engaging multiple brain regions creates stronger neural pathways for learning</p>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Flow State</h3>
              <p className="text-purple-100">Optimal learning occurs when challenge meets skill in a supportive environment</p>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-4">Social Learning</h3>
              <p className="text-purple-100">Collaborative coding amplifies individual learning through shared experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Vibe Coding?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join the revolution in programming education. Discover how coding can be creative, 
            intuitive, and deeply satisfying when you learn through the Vibe Coding methodology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              ✨ Start Your Vibe Journey
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
        defaultCourse="Vibe Coding"
      />
    </div>
  )
}

export default VibeCoding