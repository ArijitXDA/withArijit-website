import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Award, 
  Users, 
  BookOpen, 
  Star, 
  TrendingUp, 
  Brain,
  Code,
  ArrowRight,
  CheckCircle,
  Globe,
  Calendar,
  Phone
} from 'lucide-react'

const About: React.FC = () => {
  const { user } = useAuth()

  const achievements = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "10000+",
      text: "Students Trained",
      color: "text-blue-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "18+",
      text: "Years Experience",
      color: "text-green-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      number: "4.9/5",
      text: "Average Rating",
      color: "text-yellow-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      number: "100+",
      text: "AI Projects Built",
      color: "text-purple-600"
    }
  ]

  const expertise = [
    "Artificial Intelligence & Machine Learning",
    "Agentic AI Development & Architecture",
    "Business Intelligence & Data Analytics",
    "Multi-LLM Integration & Optimization",
    "Enterprise AI Solution Design",
    "Interactive Learning Methodologies"
  ]

  const experience = [
    {
      title: "Researcher - Cognitive AI Models & Agentic AI",
      company: "Self-employed | Mumbai, Maharashtra (Hybrid)",
      duration: "Jul 2024 - Present",
      description: "Leading multi-level research projects focused on cognitive traits and their application in advanced deep learning models. Exploring replication of super-conscious outputs through AI-Agents and autonomous Agentic-AI chains in Artificial Intelligence, Quantum Mechanics, QML & Neuroscience, Brain Research & Quantification of Traits, and Large Language Models (LLM) & AI Agents."
    },
    {
      title: "Guest Instructor - AI & Quantum Computing",
      company: "Indian Institute of Technology, Bombay",
      duration: "Present",
      description: "Delivering guest lectures on Agentic AI, Business Intelligence (BI), and Quantum Computing. Providing students with data-driven insights and hands-on classroom instruction in advanced AI fields."
    },
    {
      title: "Guest Instructor - Business AI Strategy",
      company: "N. L. Dalmia Institute & K J Somaiya Institute",
      duration: "Present",
      description: "Leading sessions on Agentic AI, Business Intelligence, and Quantum Computing. Developing curriculum focused on AI model development and AI strategy for future business leaders."
    },
    {
      title: "Senior Vice President & Digital Transformation Leader",
      company: "YES BANK, Cholamandalam, HSBC, Reliance Group | India, North America & Western Europe",
      duration: "2006 - 2024",
      description: "Drove business strategy and digital transformation across major financial institutions spanning India, North America, and Western Europe. Led implementation of AI-powered platforms, automation systems, and data intelligence solutions for executive decision-making and business growth. Key expertise areas include Investment Banking, Merchant Banking, Private Banking, Startup Incubation, Fundraising, and mentoring entrepreneurs across diverse markets and regulatory environments."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Meet Arijit Chowdhury
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Trainer & Research Consultant specializing in AI, BI & Agentic AI
              </p>
              <p className="text-lg text-blue-200 mb-8 leading-relaxed">
                With over 15 years of experience in artificial intelligence and data science, 
                Arijit has helped thousands of professionals transition into successful AI careers 
                through innovative teaching methodologies and hands-on training.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/courses"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>View Courses</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-80 h-80 mx-auto mb-6 relative">
                {/* Professional white circular background with enhanced shadow */}
                <div className="absolute inset-0 bg-white rounded-full shadow-2xl ring-8 ring-white ring-opacity-30"></div>
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-full"></div>
                {/* Professional border with subtle gradient */}
                <div className="absolute inset-0 rounded-full ring-2 ring-gray-200 shadow-xl"></div>
                <img 
                  src="/82597b4e-e193-45e5-a266-e303e029de30-removebg-preview.png" 
                  alt="Arijit Chowdhury - AI Expert and Trainer"
                  className="relative z-10 w-full h-full object-cover rounded-full shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300"
                />
                {/* Subtle professional glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-gray-100/20 to-transparent"></div>
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
              
              {/* LinkedIn Follow Button */}
              <div className="flex justify-center mb-6">
                <a
                  href="https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=arijit-chowdhury-86020b19"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
                  style={{ width: '200px', height: '40px' }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Follow on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Impact & Achievements
            </h2>
            <p className="text-xl text-gray-600">
              Transforming careers through expert AI education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                <div className={`${achievement.color} mb-4 flex justify-center`}>
                  {achievement.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{achievement.number}</div>
                <p className="text-gray-600">{achievement.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Expertise */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Professional Background
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  Arijit Chowdhury is a renowned AI expert and educator with over 15 years of experience 
                  in artificial intelligence, machine learning, and data science. He has successfully 
                  trained more than 10000 professionals, helping them transition into high-paying AI careers.
                </p>
                <p>
                  As a research consultant, Arijit has worked with Fortune 500 companies to implement 
                  enterprise-grade AI solutions. His expertise spans across multiple domains including 
                  Agentic AI development, multi-LLM integration, and business intelligence systems.
                </p>
                <p>
                  What sets Arijit apart is his innovative teaching methodology - "Vibe Coding" - 
                  an interactive learning approach that makes complex AI concepts accessible and 
                  practical for professionals from all backgrounds.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Areas of Expertise
              </h2>
              <div className="space-y-4">
                {expertise.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Journey
            </h2>
            <p className="text-xl text-gray-600">
              A career dedicated to advancing AI education and innovation
            </p>
          </div>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div key={index} className="flex items-start space-x-6 bg-gray-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                    <span className="text-blue-600 font-semibold">{exp.duration}</span>
                  </div>
                  <p className="text-lg text-gray-700 mb-2">{exp.company}</p>
                  <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Teaching Philosophy
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Agentic AI Mastery</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "I believe in teaching AI, Business Intelligence, and Quantum Computing not just as technologies, but as ways of thinking. 
                  My students learn to build intelligent agents and Industrial Agentic AI systems that can reason, adapt, and solve 
                  complex real-world problems autonomously across various industries."
                </p>
              </div>
            </div>

            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Vibe Coding Method</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Through interactive, immersive coding experiences, I make complex concepts 
                  accessible. Every student builds real projects and gains practical skills 
                  they can immediately apply in their careers."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
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
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed text-sm">
                "Arijit's grip on data sciences is superb and his analytical skills cut across various industry verticals. I've observed him closely during consultancy projects across Pharma, Banking, Manufacturing, Retail & Telecom. His operational skills span from Excel/Power BI to complex AI-ML algorithms. He transforms raw data into logical dashboards that empower management decisions. His solutions are incisive and jargon-free, making them accessible to all. I wish him great success."
              </p>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">👨‍🎓</div>
                <div>
                  <p className="font-bold text-gray-900">Dr. Harish B Suri</p>
                  <p className="text-xs text-gray-600 leading-tight">Professor | IIM Mumbai | IIT Kharagpur | FMS Delhi | Business Consultant | Coach | Motorola | Unisys | Fujitsu</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed text-sm">
                "Arijit mentored and coached me with dedication and strategic insight. His blend of technical expertise and practical thinking helped me advance in data science. He's a meticulous teacher with exceptional communication skills, fostering a positive learning environment. I highly recommend him for any opportunity—his professionalism and enthusiasm are unmatched."
              </p>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">👨‍💼</div>
                <div>
                  <p className="font-bold text-gray-900">Sourav Choudhury</p>
                  <p className="text-xs text-gray-600 leading-tight">LinkedIn Trainer | Business Coach | Mentor | KJSIM | IIM Mumbai | NMIMS | IIM Ahmedabad | Harvard Business School Online | McCormick | Brenntag | Nestle</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed text-sm">
                "Arijit is a versatile professional, excelling as both a business leader and entrepreneur. His transformations are inspiring. I've benefited from his instruction in BIU and Cognitive AI. He simplifies complex concepts with ease and applies numerical analysis with mastery. Truly a standout in his field."
              </p>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">👨‍💼</div>
                <div>
                  <p className="font-bold text-gray-900">Suvajit Ray</p>
                  <p className="text-xs text-gray-600 leading-tight">Head of Product & Distribution, IIFL Capital</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed text-sm">
                "Arijit is a thorough professional with deep domain knowledge. He translates complex strategies into clear roadmaps. His analytical mind and solution-oriented approach set him apart. I wish him continued success in all his endeavors."
              </p>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">👨‍💻</div>
                <div>
                  <p className="font-bold text-gray-900">Kunal Mitra Mustaphi</p>
                  <p className="text-xs text-gray-600 leading-tight">Senior Claims Specialist, Munich Re | ISBR Business School | Consultant | Mentor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Learn from the Expert?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their careers under Arijit's guidance. 
            Start your AI journey with proven expertise and innovative teaching methods.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Explore Courses
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Get Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About