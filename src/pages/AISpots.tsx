import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AISpotCard from '../components/AISpotCard'
import AISpotDetailModal from '../components/AISpotDetailModal'
import { 
  MapPin, 
  Search, 
  Filter, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  Globe,
  Building,
  Phone,
  Mail,
  User,
  DollarSign,
  Send,
  Target,
  Zap,
  Brain,
  QrCode
} from 'lucide-react'

interface AISpot {
  aispot_id: string
  name?: string
  type_of_place: string
  address: string
  country: string
  state: string
  city: string
  pin_zip: string
  telephone: string
  aispot_email: string
  owner_manager_name: string
  mobile: string
  email: string
  price: string
  ratings?: number
  image_url?: string
  map_link?: string
  qr_code_link?: string
  is_approved: boolean
  created_at: string
}

const AISpots: React.FC = () => {
  const [aiSpots, setAiSpots] = useState<AISpot[]>([])
  const [filteredSpots, setFilteredSpots] = useState<AISpot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSpot, setSelectedSpot] = useState<AISpot | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [showOwnerForm, setShowOwnerForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [error, setError] = useState('')

  // Filter states
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    city: '',
    type: ''
  })

  // Form data
  const [formData, setFormData] = useState({
    Name: '',
    Type_of_Place: '',
    Address: '',
    Country: 'India',
    State: '',
    City: '',
    Pin_Zip: '',
    Telephone: '',
    AISpot_Email: '',
    Owner_Manager_Name: '',
    Mobile: '',
    Email: '',
    Price: '',
    Map_Link: '',
    Image_URL: '',
    Consent: false
  })

  const placeTypes = [
    'Restaurants',
    'Pubs',
    'Cafes',
    'Libraries',
    'Office Canteens',
    'Mall Food Courts',
    'Clubs',
    'Co-working Spaces',
    'Hotels',
    'Others'
  ]

  const countries = [
    'India',
    'USA',
    'Canada',
    'UK',
    'Australia',
    'Others'
  ]

  // Fetch AI Spots
  useEffect(() => {
    const fetchAISpots = async () => {
      try {
        const { data, error } = await supabase
          .from('aispot_master')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching AI Spots:', error)
        } else {
          setAiSpots(data || [])
          setFilteredSpots(data || [])
        }
      } catch (error) {
        console.error('Error fetching AI Spots:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAISpots()
  }, [])

  // Filter AI Spots
  useEffect(() => {
    let filtered = aiSpots

    if (filters.country) {
      filtered = filtered.filter(spot => spot.country === filters.country)
    }
    if (filters.state) {
      filtered = filtered.filter(spot => spot.state.toLowerCase().includes(filters.state.toLowerCase()))
    }
    if (filters.city) {
      filtered = filtered.filter(spot => spot.city.toLowerCase().includes(filters.city.toLowerCase()))
    }
    if (filters.type) {
      filtered = filtered.filter(spot => spot.type_of_place === filters.type)
    }

    setFilteredSpots(filtered)
  }, [filters, aiSpots])

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    setError('')
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSubmitMessage('')

    try {
      // Validate required fields
      const requiredFields = [
        'Name', 'Type_of_Place', 'Address', 'Country', 'State', 'City', 'Pin_Zip',
        'Telephone', 'AISpot_Email', 'Owner_Manager_Name', 'Mobile', 'Email', 'Price'
      ]

      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          setError(`Please fill in the ${field.replace('_', ' ')} field`)
          setIsSubmitting(false)
          return
        }
      }

      if (!formData.Consent) {
        setError('Please agree to the terms and conditions')
        setIsSubmitting(false)
        return
      }

      // Submit to database
      const { data, error } = await supabase
        .from('aispot_master')
        .insert([{
          name: formData.Name,
          type_of_place: formData.Type_of_Place,
          address: formData.Address,
          country: formData.Country,
          state: formData.State,
          city: formData.City,
          pin_zip: formData.Pin_Zip,
          telephone: formData.Telephone,
          aispot_email: formData.AISpot_Email,
          owner_manager_name: formData.Owner_Manager_Name,
          mobile: formData.Mobile,
          email: formData.Email,
          price: formData.Price,
          map_link: formData.Map_Link || null,
          image_url: formData.Image_URL || null,
          consent: formData.Consent,
          is_approved: false // Requires admin approval
        }])
        .select()

      if (error) {
        console.error('Error submitting AI Spot application:', error)
        setError(`Failed to submit application: ${error.message}`)
      } else {
        console.log('AI Spot application submitted successfully:', data)
        setSubmitMessage('Thank you! Your AI Spot application has been received. Our team will review it shortly.')
        
        // Reset form
        setFormData({
          Name: '',
          Type_of_Place: '',
          Address: '',
          Country: 'India',
          State: '',
          City: '',
          Pin_Zip: '',
          Telephone: '',
          AISpot_Email: '',
          Owner_Manager_Name: '',
          Mobile: '',
          Email: '',
          Price: '',
          Map_Link: '',
          Image_URL: '',
          Consent: false
        })
        setShowOwnerForm(false)
      }
    } catch (error) {
      console.error('Error submitting AI Spot application:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewSpot = (spot: AISpot) => {
    setSelectedSpot(spot)
    setModalOpen(true)
  }

  const stats = [
    { number: `${aiSpots.length}+`, text: 'AI Spots Active', icon: <MapPin className="w-8 h-8" /> },
    { number: '10000+', text: 'Quiz Submissions', icon: <Users className="w-8 h-8" /> },
    { number: '50+', text: 'Cities Covered', icon: <Globe className="w-8 h-8" /> },
    { number: '4.8★', text: 'Average Rating', icon: <Star className="w-8 h-8" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              AI Spots
              <span className="block text-cyan-300 text-3xl md:text-4xl mt-2">
                Innovation Hub Network
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover AI-enabled venues across India where innovation meets everyday life. 
              Take the AI Readiness Quiz and join the future of learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 max-w-5xl mx-auto">
              <div className="flex-1">
                <button
                  onClick={() => document.getElementById('find-spots')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Find AI Spots Near You</span>
                </button>
                <p className="text-xs text-blue-100 mt-2 text-center px-2">
                  If you are an individual looking to learn & innovate with AI over some food, coffee or drinks, staying ultra relevant in the current era.
                </p>
              </div>
              <div className="flex-1">
                <button
                  onClick={() => {
                    setShowOwnerForm(true)
                    setTimeout(() => {
                      document.getElementById('owner-form')?.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                  }}
                  className="w-full bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                >
                  <Building className="w-5 h-5" />
                  <span>Become an AI Spot</span>
                </button>
                <p className="text-xs text-blue-100 mt-2 text-center px-2">
                  If you own or manage high-footfall business places like cafe, restaurants, foodcourts, library or a store.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-cyan-300 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <p className="text-blue-200 text-sm">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* (A) What is an AI Spot */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🤖 What is an AI Spot?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              AI Spots are the future of learning and innovation hubs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">High-Footfall Places</h3>
              <p className="text-gray-600 text-sm">AI Spots are high-footfall places promoting AI awareness</p>
            </div>

            <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">QR Code Quiz</h3>
              <p className="text-gray-600 text-sm">Guests can scan a QR code to take a 2-minute AI Readiness Quiz</p>
            </div>

            <div className="text-center bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-2xl border border-teal-100">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Innovation Network</h3>
              <p className="text-gray-600 text-sm">Venues become part of a growing innovation hub network</p>
            </div>

            <div className="text-center bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Free Lifetime Access</h3>
              <p className="text-gray-600 text-sm">Visitors get lifetime access to AI resources, AI conferences and webinars, AI certification courses from AIwithArijit.com. All free!!</p>
            </div>
          </div>
        </div>
      </section>

      {/* (B) Find Your Nearest AI Spot */}
      <section id="find-spots" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📍 Find Your Nearest AI Spot
            </h2>
            <p className="text-xl text-gray-600">
              Discover AI-enabled venues in your area
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Filter AI Spots</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Place</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {placeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* AI Spots Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : filteredSpots.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSpots.map((spot) => (
                <AISpotCard
                  key={spot.AISpot_ID}
                  spot={spot}
                  onView={() => handleViewSpot(spot)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No AI Spots in this area yet</h3>
              <p className="text-gray-600 mb-8">
                Be the first to bring AI innovation to your area!
              </p>
              <button
                onClick={() => setShowOwnerForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply to Become an AI Spot
              </button>
            </div>
          )}
        </div>
      </section>

      {/* (C) Become an AI Spot */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              🚀 Become an AI Spot
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Convert your place into an AI Spot and engage with the AI Innovators of India. 
                Display your unique QR code and let your guests explore AI through the 2-minute AI Readiness Quiz. 
                Apply now to join the AI Spot network.
              </p>
              
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white mb-8">
                <h3 className="text-2xl font-bold mb-6">Benefits of Being an AI Spot</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Target className="w-12 h-12 mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Attract Tech-Savvy Customers</h4>
                    <p className="text-blue-100 text-sm">Draw AI enthusiasts and professionals to your venue</p>
                  </div>
                  <div className="text-center">
                    <Zap className="w-12 h-12 mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Free Marketing</h4>
                    <p className="text-blue-100 text-sm">Get featured on our platform and social media</p>
                  </div>
                  <div className="text-center">
                    <Brain className="w-12 h-12 mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Innovation Hub Status</h4>
                    <p className="text-blue-100 text-sm">Position your venue as a forward-thinking space</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Customer Analytics</h4>
                    <p className="text-blue-100 text-sm">Get realtime customer analytics even when your customers have stepped out of your place, engage with them more with offers, discounts, personalized invitations for future campaigns</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-12 h-12 mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Free AI Courses for Your Guests</h4>
                    <p className="text-blue-100 text-sm">Give free AI courses and learnings to your customers/guests as an ultra modern complementary gift in their AI journey for lifetime</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowOwnerForm(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 mx-auto"
              >
                <span>Apply to Convert Your Place into an AI Spot</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* (D) Owner Application Form */}
      {showOwnerForm && (
        <section id="owner-form" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Apply to Convert Your Place into an AI Spot
                </h2>
                <p className="text-gray-600">
                  Join the AI innovation network and attract tech-savvy customers
                </p>
              </div>

              {submitMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <p className="text-green-700 font-medium">{submitMessage}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-2">
                    AI Spot Name *
                  </label>
                  <input
                    type="text"
                    id="Name"
                    name="Name"
                    required
                    value={formData.Name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Baa Mee, The Lounge Pub, Starbucks"
                  />
                  <p className="text-xs text-gray-500 mt-1">The name of your business/venue</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="Type_of_Place" className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Place *
                    </label>
                    <select
                      id="Type_of_Place"
                      name="Type_of_Place"
                      required
                      value={formData.Type_of_Place}
                      onChange={handleFormChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select type of place</option>
                      {placeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="Country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      id="Country"
                      name="Country"
                      required
                      value={formData.Country}
                      onChange={handleFormChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="Address" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    id="Address"
                    name="Address"
                    required
                    rows={3}
                    value={formData.Address}
                    onChange={handleFormChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter complete address"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="State" className="block text-sm font-medium text-gray-700 mb-2">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      id="State"
                      name="State"
                      required
                      value={formData.State}
                      onChange={handleFormChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label htmlFor="City" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="City"
                      name="City"
                      required
                      value={formData.City}
                      onChange={handleFormChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label htmlFor="Pin_Zip" className="block text-sm font-medium text-gray-700 mb-2">
                      Pin / Zip Code *
                    </label>
                    <input
                      type="text"
                      id="Pin_Zip"
                      name="Pin_Zip"
                      required
                      value={formData.Pin_Zip}
                      onChange={handleFormChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter pin/zip"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="Telephone" className="block text-sm font-medium text-gray-700 mb-2">
                      Venue Telephone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="Telephone"
                        name="Telephone"
                        required
                        value={formData.Telephone}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Venue phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="AISpot_Email" className="block text-sm font-medium text-gray-700 mb-2">
                      AI Spot Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="AISpot_Email"
                        name="AISpot_Email"
                        required
                        value={formData.AISpot_Email}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="AI Spot contact email"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="Owner_Manager_Name" className="block text-sm font-medium text-gray-700 mb-2">
                      Owner / Manager Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="Owner_Manager_Name"
                        name="Owner_Manager_Name"
                        required
                        value={formData.Owner_Manager_Name}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="Mobile" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Mobile *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="Mobile"
                        name="Mobile"
                        required
                        value={formData.Mobile}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your mobile number"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="Email"
                        name="Email"
                        required
                        value={formData.Email}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="Price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price for 2 OR Price for 30-minutes *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="Price"
                        name="Price"
                        required
                        value={formData.Price}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., ₹500 for 2 people or ₹100 for 30 minutes"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="Map_Link" className="block text-sm font-medium text-gray-700 mb-2">
                      Google Maps Link
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        id="Map_Link"
                        name="Map_Link"
                        value={formData.Map_Link}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Optional: Link to your location on Google Maps</p>
                  </div>

                  <div>
                    <label htmlFor="Image_URL" className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="Image_URL"
                      name="Image_URL"
                      value={formData.Image_URL}
                      onChange={handleFormChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional: Link to an image of your venue</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="Consent"
                    name="Consent"
                    checked={formData.Consent}
                    onChange={handleFormChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="Consent" className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                      terms & conditions
                    </Link>{' '}
                    and consent to being contacted regarding my AI Spot application.
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setShowOwnerForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* AI Spot Detail Modal */}
      <AISpotDetailModal
        spot={selectedSpot}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

export default AISpots