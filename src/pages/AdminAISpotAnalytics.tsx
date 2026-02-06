import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import AdminLogin from '../components/AdminLogin'
import {
  BarChart3,
  Users,
  MapPin,
  Calendar,
  Search,
  Filter,
  TrendingUp,
  Award,
  RefreshCw,
  Download,
  Eye,
  Settings
} from 'lucide-react'

interface QuizAnalytics {
  id: string
  name: string
  email: string
  mobile: string
  created_at: string
  aispot_id?: string
  spot_name?: string
  spot_city?: string
  spot_type?: string
}

interface AISpotSummary {
  aispot_id: string
  spot_name: string
  spot_city: string
  spot_type: string
  quiz_count: number
}

const AdminAISpotAnalytics: React.FC = () => {
  const { isAdminAuthenticated } = useAdminAuth()
  const [analytics, setAnalytics] = useState<QuizAnalytics[]>([])
  const [filteredAnalytics, setFilteredAnalytics] = useState<QuizAnalytics[]>([])
  const [topSpots, setTopSpots] = useState<AISpotSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Filter states
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    city: '',
    spotName: '',
    spotEmail: '',
    dateFrom: '',
    dateTo: ''
  })

  // Summary metrics
  const [metrics, setMetrics] = useState({
    totalScansToday: 0,
    totalSpots: 0,
    totalScansAllTime: 0
  })

  // Show admin login if not authenticated
  if (!isAdminAuthenticated) {
    return <AdminLogin onSuccess={() => {}} />
  }

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Fetch quiz responses with AI Spot information
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_responses')
        .select(`
          id,
          name,
          email,
          mobile,
          created_at,
          aispot_id
        `)
        .order('created_at', { ascending: false })

      if (quizError) {
        console.error('Error fetching quiz analytics:', quizError)
        return
      }

      // Fetch AI Spot details
      const { data: spotsData, error: spotsError } = await supabase
        .from('aispot_master')
        .select('aispot_id, city, type_of_place, owner_manager_name')

      if (spotsError) {
        console.error('Error fetching AI Spots:', spotsError)
        return
      }

      // Create a map of AI Spot details
      const spotsMap = new Map()
      spotsData?.forEach(spot => {
        spotsMap.set(spot.aispot_id, {
          spot_name: `${spot.type_of_place} - ${spot.city}`,
          spot_city: spot.city,
          spot_type: spot.type_of_place
        })
      })

      // Combine quiz data with spot information
      const enrichedAnalytics = quizData?.map(quiz => ({
        ...quiz,
        spot_name: quiz.aispot_id ? spotsMap.get(quiz.aispot_id)?.spot_name || 'Unknown Spot' : 'Direct Website',
        spot_city: quiz.aispot_id ? spotsMap.get(quiz.aispot_id)?.spot_city || 'Unknown' : 'Online',
        spot_type: quiz.aispot_id ? spotsMap.get(quiz.aispot_id)?.spot_type || 'Unknown' : 'Website'
      })) || []

      setAnalytics(enrichedAnalytics)
      setFilteredAnalytics(enrichedAnalytics)

      // Calculate metrics
      const today = new Date().toDateString()
      const scansToday = enrichedAnalytics.filter(quiz => 
        new Date(quiz.created_at).toDateString() === today
      ).length

      const uniqueSpots = new Set(enrichedAnalytics.filter(quiz => quiz.aispot_id).map(quiz => quiz.aispot_id))

      setMetrics({
        totalScansToday: scansToday,
        totalSpots: spotsData?.length || 0,
        totalScansAllTime: enrichedAnalytics.length
      })

      // Calculate top spots
      const spotCounts = new Map()
      enrichedAnalytics.forEach(quiz => {
        if (quiz.aispot_id) {
          const count = spotCounts.get(quiz.aispot_id) || 0
          spotCounts.set(quiz.aispot_id, count + 1)
        }
      })

      const topSpotsArray = Array.from(spotCounts.entries())
        .map(([spotId, count]) => ({
          aispot_id: spotId,
          spot_name: spotsMap.get(spotId)?.spot_name || 'Unknown',
          spot_city: spotsMap.get(spotId)?.spot_city || 'Unknown',
          spot_type: spotsMap.get(spotId)?.spot_type || 'Unknown',
          quiz_count: count
        }))
        .sort((a, b) => b.quiz_count - a.quiz_count)
        .slice(0, 3)

      setTopSpots(topSpotsArray)
      setLastRefresh(new Date())

    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchAnalytics()
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchAnalytics, 2 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = analytics

    if (filters.country) {
      // This would require joining with AI Spot data for country filtering
      // For now, we'll skip this complex filter
    }
    if (filters.state) {
      filtered = filtered.filter(item => 
        item.spot_city?.toLowerCase().includes(filters.state.toLowerCase())
      )
    }
    if (filters.city) {
      filtered = filtered.filter(item => 
        item.spot_city?.toLowerCase().includes(filters.city.toLowerCase())
      )
    }
    if (filters.spotName) {
      filtered = filtered.filter(item => 
        item.spot_name?.toLowerCase().includes(filters.spotName.toLowerCase())
      )
    }
    if (filters.spotEmail) {
      filtered = filtered.filter(item => 
        item.email.toLowerCase().includes(filters.spotEmail.toLowerCase())
      )
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.created_at) >= new Date(filters.dateFrom)
      )
    }
    if (filters.dateTo) {
      filtered = filtered.filter(item => 
        new Date(item.created_at) <= new Date(filters.dateTo + 'T23:59:59')
      )
    }

    setFilteredAnalytics(filtered)
  }, [filters, analytics])

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Spot Analytics</h1>
            <p className="text-gray-600 mt-2">Track quiz submissions and AI Spot performance</p>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/admin/ai-spot-management"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Manage Spots</span>
            </Link>
            <div className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <button
              onClick={fetchAnalytics}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Scans Today</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalScansToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total AI Spots</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalSpots}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Scans All Time</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalScansAllTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Active Spots */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Top 3 Active AI Spots</h2>
          
          {topSpots.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {topSpots.map((spot, index) => (
                <div key={spot.aispot_id} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{spot.spot_name}</h3>
                      <p className="text-sm text-gray-600">{spot.spot_city}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{spot.quiz_count}</div>
                  <p className="text-sm text-gray-600">Quiz submissions</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No AI Spot data available yet</p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Filter Analytics</h3>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter state"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AI Spot Name</label>
              <input
                type="text"
                value={filters.spotName}
                onChange={(e) => handleFilterChange('spotName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Search spot name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User Email</label>
              <input
                type="text"
                value={filters.spotEmail}
                onChange={(e) => handleFilterChange('spotEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Search user email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Analytics Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Quiz Submissions ({filteredAnalytics.length})
            </h2>
            
            <button
              onClick={() => {
                // Export functionality can be added here
                console.log('Export data:', filteredAnalytics)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAnalytics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Visitor Name</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Email</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Mobile</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Date & Time</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">AI Spot ID</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">AI Spot Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAnalytics.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium text-gray-900">{item.name}</td>
                      <td className="py-3 px-2 text-gray-700">{item.email}</td>
                      <td className="py-3 px-2 text-gray-700">{item.mobile}</td>
                      <td className="py-3 px-2 text-gray-700">{formatDateTime(item.created_at)}</td>
                      <td className="py-3 px-2">
                        {item.aispot_id ? (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {item.aispot_id.substring(0, 8)}...
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            Direct
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-700">{item.spot_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No analytics data found</p>
              <p className="text-sm text-gray-400 mt-1">Data will appear here as users take the quiz</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminAISpotAnalytics