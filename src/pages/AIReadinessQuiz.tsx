import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PaymentModal from '../components/PaymentModal'
import { useEffect } from 'react'
import { 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Target, 
  Rocket, 
  BookOpen, 
  Users, 
  Star,
  TrendingUp,
  Zap,
  Award,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar
} from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: {
    text: string
    points: number
  }[]
}

interface UserDetails {
  name: string
  email: string
  mobile: string
  age: string
  occupation: string
}

const AIReadinessQuiz: React.FC = () => {
  const [searchParams] = useSearchParams()
  const spotId = searchParams.get('spot_id') // Get AI Spot ID from URL
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(new Array(8).fill(''))
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    mobile: '',
    age: '',
    occupation: ''
  })
  const [showUserForm, setShowUserForm] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [readinessLevel, setReadinessLevel] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [error, setError] = useState('')

  // Scroll to top when results are shown
  useEffect(() => {
    if (showResults) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [showResults])

  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What best describes your background?',
      options: [
        { text: 'Sales / Marketing / HR / Finance / Any other Non-Tech role', points: 1 },
        { text: 'Technology / IT Consulting / Software Development', points: 2 },
        { text: 'Advanced Tech / Data Science / AI Projects', points: 3 }
      ]
    },
    {
      id: 'q2',
      question: "What's your comfort level with coding?",
      options: [
        { text: 'No coding, prefer AI tools', points: 1 },
        { text: 'Comfortable with basic Python or willing to learn', points: 2 },
        { text: 'Experienced coder, want to learn advanced AI frameworks', points: 3 }
      ]
    },
    {
      id: 'q3',
      question: "What's your goal with AI?",
      options: [
        { text: 'Automate tasks, improve efficiency at work', points: 1 },
        { text: 'Build AI agents & apps using code/low-code', points: 2 },
        { text: 'Master advanced AI frameworks & deployment', points: 3 }
      ]
    },
    {
      id: 'q4',
      question: 'How much time can you invest in learning AI per week?',
      options: [
        { text: '2–3 hrs (basic tools, automation)', points: 1 },
        { text: '4–6 hrs (Python, AI agents)', points: 2 },
        { text: '6+ hrs (advanced frameworks, deployment)', points: 3 }
      ]
    },
    {
      id: 'q5',
      question: 'Which excites you the most?',
      options: [
        { text: 'Using AI tools to get faster & smarter at work', points: 1 },
        { text: 'Building AI-powered apps/agents', points: 2 },
        { text: 'Designing future-ready AI systems for industry', points: 3 }
      ]
    },
    {
      id: 'q6',
      question: 'What is your current role in your organization?',
      options: [
        { text: 'Student / Fresher', points: 1 },
        { text: 'Working Professional (Non-Tech)', points: 1 },
        { text: 'Working Professional (Tech)', points: 2 },
        { text: 'Entrepreneur / Freelancer', points: 2 },
        { text: 'Senior Leader / Manager', points: 3 }
      ]
    },
    {
      id: 'q7',
      question: 'Have you used AI tools (like ChatGPT, Gemini, Copilot) before?',
      options: [
        { text: 'Never tried', points: 1 },
        { text: 'Used casually', points: 2 },
        { text: 'Regular user', points: 2 },
        { text: 'Built apps or automation with AI', points: 3 }
      ]
    },
    {
      id: 'q8',
      question: "What's your primary motivation for learning AI?",
      options: [
        { text: 'Career growth / new job', points: 2 },
        { text: 'Boost productivity in current role', points: 1 },
        { text: 'Build side projects / startups', points: 2 },
        { text: 'Stay updated (personal interest)', points: 1 }
      ]
    }
  ]

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = questions[currentQuestion].options[optionIndex].text
    setAnswers(newAnswers)
    setError('')
  }

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      setError('Please select an answer before proceeding')
      return
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowUserForm(true)
    }
    setError('')
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
    setError('')
  }

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const calculateScore = () => {
    let totalScore = 0
    answers.forEach((answer, index) => {
      const question = questions[index]
      const selectedOption = question.options.find(option => option.text === answer)
      if (selectedOption) {
        totalScore += selectedOption.points
      }
    })
    return totalScore
  }

  const getReadinessLevel = (score: number) => {
    if (score >= 8 && score <= 15) {
      return 'Beginner / Tool-User'
    } else if (score >= 16 && score <= 20) {
      return 'Intermediate / Builder'
    } else if (score >= 21 && score <= 24) {
      return 'Advanced / Innovator'
    }
    return 'Beginner / Tool-User'
  }

  const getReadinessDescription = (level: string) => {
    switch (level) {
      case 'Beginner / Tool-User':
        return 'Start with AI tools, no-code agents, and automation basics.'
      case 'Intermediate / Builder':
        return 'Learn Python, AI agent development, and AI architectures.'
      case 'Advanced / Innovator':
        return 'Dive into LangChain, AutoGen, CrewAI, and industrial AI deployment.'
      default:
        return 'Start with AI tools, no-code agents, and automation basics.'
    }
  }

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'Beginner / Tool-User':
        return 'from-green-600 to-emerald-600'
      case 'Intermediate / Builder':
        return 'from-blue-600 to-indigo-600'
      case 'Advanced / Innovator':
        return 'from-purple-600 to-pink-600'
      default:
        return 'from-green-600 to-emerald-600'
    }
  }

  const handleSubmitQuiz = async () => {
    // Validate user details
    if (!userDetails.name || !userDetails.email || !userDetails.mobile || !userDetails.age || !userDetails.occupation) {
      setError('Please fill in all required fields')
      return
    }

    if (parseInt(userDetails.age) < 16 || parseInt(userDetails.age) > 100) {
      setError('Please enter a valid age between 16 and 100')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const calculatedScore = calculateScore()
      const level = getReadinessLevel(calculatedScore)

      // Prepare quiz response data
      const quizResponse = {
        name: userDetails.name,
        email: userDetails.email,
        mobile: userDetails.mobile,
        age: parseInt(userDetails.age),
        occupation: userDetails.occupation,
        q1: answers[0],
        q2: answers[1],
        q3: answers[2],
        q4: answers[3],
        q5: answers[4],
        q6: answers[5],
        q7: answers[6],
        q8: answers[7],
        score: calculatedScore,
        readiness_level: level,
        aispot_id: spotId
      }

      console.log('Submitting quiz response:', quizResponse)

      // Insert into Supabase
      const { data, error } = await supabase
        .from('quiz_responses')
        .insert([quizResponse])
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        setError(`Failed to save quiz results: ${error.message}`)
        return
      }

      console.log('Quiz response saved successfully:', data)

      // Set results and show them
      setScore(calculatedScore)
      setReadinessLevel(level)
      setShowResults(true)

    } catch (error) {
      console.error('Quiz submission error:', error)
      setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🎉 Quiz Complete!
            </h1>
            <p className="text-xl text-gray-600">
              Here's your personalized AI readiness assessment
            </p>
          </div>

          {/* Results Card */}
          <div className={`bg-gradient-to-br ${getReadinessColor(readinessLevel)} rounded-3xl shadow-2xl p-8 text-white mb-8`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Your AI Readiness Score:
              </h2>
              <div className="mb-6">
                <span className="block text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 bg-clip-text text-transparent drop-shadow-2xl">
                  {score}/24
                </span>
              </div>
              <div className="text-2xl font-bold mb-4">{readinessLevel}</div>
              <p className="text-xl opacity-90">{getReadinessDescription(readinessLevel)}</p>
            </div>

            {/* Score Breakdown */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-center">📊 Your Learning Path</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`text-center p-4 rounded-xl ${score >= 8 && score <= 15 ? 'bg-white/30' : 'bg-white/10'}`}>
                  <div className="text-2xl mb-2">🌱</div>
                  <div className="font-bold">Beginner</div>
                  <div className="text-sm opacity-80">8-15 points</div>
                </div>
                <div className={`text-center p-4 rounded-xl ${score >= 16 && score <= 20 ? 'bg-white/30' : 'bg-white/10'}`}>
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="font-bold">Intermediate</div>
                  <div className="text-sm opacity-80">16-20 points</div>
                </div>
                <div className={`text-center p-4 rounded-xl ${score >= 21 && score <= 24 ? 'bg-white/30' : 'bg-white/10'}`}>
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-bold">Advanced</div>
                  <div className="text-sm opacity-80">21-24 points</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const message = `🤔 How AI-ready are you?
⚡ Take this free 1-min quiz 👉 https://www.aiwitharijit.com/ai-readiness-quiz

✅ Forward this challenge to 3 friends & find out who's the most AI-ready! 🚀`
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
                  window.open(whatsappUrl, '_blank')
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>Challenge Your Friends</span>
              </button>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <Rocket className="w-5 h-5" />
                <span>Enroll Now</span>
              </button>
              <Link
                to="/library"
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Visit e-Library</span>
              </Link>
              <Link
                to="/signup"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Free Sign-up</span>
              </Link>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Start Learning</h3>
              <p className="text-gray-600 mb-4">
                Begin your AI journey with our comprehensive 4-month certification program
              </p>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Enroll Now
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free Resources</h3>
              <p className="text-gray-600 mb-4">
                Access our comprehensive e-library with industry-specific AI resources
              </p>
              <Link
                to="/library"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                Browse Library
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Join Community</h3>
              <p className="text-gray-600 mb-4">
                Free sign-up with referral earning opportunities and exclusive content access
              </p>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                Sign Up Free
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentModal 
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          defaultCourse="4 Months AI Certification For Professionals"
        />
      </div>
    )
  }

  if (showUserForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Almost Done!</h2>
              <p className="text-gray-600">Please provide your details to get your personalized AI readiness score</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-blue-800 text-sm">
                  📧 Your scores, more AI quizzes, and exclusive AI resources will be sent directly to you in the future.
                </p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuiz(); }} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={userDetails.name}
                    onChange={handleUserDetailsChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={userDetails.email}
                    onChange={handleUserDetailsChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    value={userDetails.mobile}
                    onChange={handleUserDetailsChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      required
                      min="16"
                      max="100"
                      value={userDetails.age}
                      onChange={handleUserDetailsChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Age"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Occupation *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="occupation"
                      name="occupation"
                      type="text"
                      required
                      value={userDetails.occupation}
                      onChange={handleUserDetailsChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your job title"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  By submitting this form, you are providing us your consent to contact you with your score, AI quizzes, resources, and other learning related topics in future.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setShowUserForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Quiz</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Getting Results...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      <span>Get My Score</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How AI-Ready Are You? Take the 2-Minute Quiz 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find your AI Readiness Score and discover the right learning path for you — Beginner, Intermediate, or Advanced.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{currentQuestion + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Quiz Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Question {currentQuestion + 1}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              {questions[currentQuestion].question}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Options */}
          <div className="space-y-4 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  answers[currentQuestion] === option.text
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === option.text
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === option.text && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{option.text}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              <span>{currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quiz Benefits */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Personalized Path</h3>
            <p className="text-gray-600 text-sm">Get a customized learning recommendation based on your current skills and goals</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Assessment</h3>
            <p className="text-gray-600 text-sm">Takes only 2 minutes to complete and provides instant, actionable insights</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Guidance</h3>
            <p className="text-gray-600 text-sm">Recommendations based on 18+ years of AI training experience</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AIReadinessQuiz