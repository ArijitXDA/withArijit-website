import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import AdminLogin from '../components/AdminLogin'
import { MapPin, CheckCircle, XCircle, Eye, CreditCard as Edit, Trash2, Search, Filter, Download, QrCode, ExternalLink, BarChart3, X } from 'lucide-react'

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
  consent: boolean
  is_approved: boolean
  created_at: string
  updated_at?: string
}

const AdminAISpotManagement: React.FC = () => {
  const { isAdminAuthenticated } = useAdminAuth()
  const [aiSpots, setAiSpots] = useState<AISpot[]>([])
  const [filteredSpots, setFilteredSpots] = useState<AISpot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSpot, setSelectedSpot] = useState<AISpot | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Fetch AI Spots
  useEffect(() => {
    const fetchAISpots = async () => {
      try {
        const { data, error } = await supabase
          .from('aispot_master')
          .select('*')
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

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(spot =>
        spot.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.type_of_place.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.owner_manager_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.aispot_email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(spot =>
        statusFilter === 'approved' ? spot.is_approved : !spot.is_approved
      )
    }

    setFilteredSpots(filtered)
  }, [searchQuery, statusFilter, aiSpots])

  // Show admin login if not authenticated - moved after hooks to follow Rules of Hooks
  if (!isAdminAuthenticated) {
    return <AdminLogin onSuccess={() => {}} />
  }

  const handleApprovalToggle = async (spotId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('aispot_master')
        .update({
          is_approved: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('aispot_id', spotId)

      if (error) {
        console.error('Error updating approval status:', error)
        alert('Failed to update approval status')
      } else {
        // Refresh the list
        const { data } = await supabase
          .from('aispot_master')
          .select('*')
          .order('created_at', { ascending: false })

        if (data) {
          setAiSpots(data)
        }
      }
    } catch (error) {
      console.error('Error updating approval status:', error)
      alert('Failed to update approval status')
    }
  }

  const handleDelete = async (spotId: string) => {
    if (!confirm('Are you sure you want to delete this AI Spot? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('aispot_master')
        .delete()
        .eq('aispot_id', spotId)

      if (error) {
        console.error('Error deleting AI Spot:', error)
        alert('Failed to delete AI Spot')
      } else {
        // Refresh the list
        const { data } = await supabase
          .from('aispot_master')
          .select('*')
          .order('created_at', { ascending: false })

        if (data) {
          setAiSpots(data)
        }
      }
    } catch (error) {
      console.error('Error deleting AI Spot:', error)
      alert('Failed to delete AI Spot')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin: AI Spot Management</h1>
            <p className="text-gray-600 mt-2">Manage AI Spot applications and approvals</p>
          </div>
          <Link
            to="/admin/ai-spot-analytics"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <BarChart3 className="w-5 h-5" />
            <span>View Analytics</span>
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900">{aiSpots.length}</div>
            <p className="text-gray-600">Total Applications</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-green-600">{aiSpots.filter(s => s.is_approved).length}</div>
            <p className="text-gray-600">Approved Spots</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-orange-600">{aiSpots.filter(s => !s.is_approved).length}</div>
            <p className="text-gray-600">Pending Approval</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-blue-600">{new Set(aiSpots.map(s => s.city)).size}</div>
            <p className="text-gray-600">Cities Covered</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search AI Spots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Spots Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              AI Spot Applications ({filteredSpots.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredSpots.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Spot Details</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Location</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Contact</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Applied</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSpots.map((spot) => (
                    <tr key={spot.aispot_id} className="hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div>
                          {spot.name && (
                            <div className="font-bold text-gray-900">{spot.name}</div>
                          )}
                          <div className="font-medium text-gray-700">{spot.type_of_place}</div>
                          <div className="text-xs text-gray-500">{spot.price}</div>
                          {spot.qr_code_link && (
                            <div className="flex items-center space-x-1 mt-1">
                              <QrCode className="w-3 h-3 text-blue-600" />
                              <span className="text-xs text-blue-600">QR Generated</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm text-gray-900">{spot.city}</div>
                        <div className="text-xs text-gray-500">{spot.state}, {spot.country}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm text-gray-900">{spot.owner_manager_name}</div>
                        <div className="text-xs text-gray-500">{spot.email}</div>
                        <div className="text-xs text-gray-500">{spot.mobile}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          spot.is_approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {spot.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm text-gray-700">
                          {formatDate(spot.created_at)}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSpot(spot)
                              setModalOpen(true)
                            }}
                            className="text-blue-600 hover:text-blue-500 p-1 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleApprovalToggle(spot.aispot_id, spot.is_approved)}
                            className={`p-1 rounded ${
                              spot.is_approved
                                ? 'text-orange-600 hover:text-orange-500'
                                : 'text-green-600 hover:text-green-500'
                            }`}
                            title={spot.is_approved ? 'Revoke Approval' : 'Approve Spot'}
                          >
                            {spot.is_approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>

                          {spot.qr_code_link && (
                            <a
                              href={spot.qr_code_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-500 p-1 rounded"
                              title="View QR Link"
                            >
                              <QrCode className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            onClick={() => handleDelete(spot.aispot_id)}
                            className="text-red-600 hover:text-red-500 p-1 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No AI Spot applications found</p>
              <p className="text-sm text-gray-400 mt-1">Applications will appear here as they are submitted</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {modalOpen && selectedSpot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">AI Spot Details</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {selectedSpot.name && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">AI Spot Name</label>
                    <p className="text-xl font-bold text-gray-900">{selectedSpot.name}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type of Place</label>
                    <p className="text-gray-900">{selectedSpot.type_of_place}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedSpot.is_approved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {selectedSpot.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Full Address</label>
                  <p className="text-gray-900">{selectedSpot.address}</p>
                  <p className="text-gray-600">{selectedSpot.city}, {selectedSpot.state} {selectedSpot.pin_zip}</p>
                  <p className="text-gray-600">{selectedSpot.country}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Venue Contact</label>
                    <p className="text-gray-900">{selectedSpot.telephone}</p>
                    <p className="text-gray-600">{selectedSpot.aispot_email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Owner/Manager</label>
                    <p className="text-gray-900">{selectedSpot.owner_manager_name}</p>
                    <p className="text-gray-600">{selectedSpot.email}</p>
                    <p className="text-gray-600">{selectedSpot.mobile}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Pricing</label>
                  <p className="text-gray-900">{selectedSpot.price}</p>
                </div>

                {selectedSpot.map_link && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-700">Google Maps Link</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <a
                        href={selectedSpot.map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm break-all"
                      >
                        {selectedSpot.map_link}
                      </a>
                    </div>
                  </div>
                )}

                {selectedSpot.image_url && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-700">Image URL</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <ExternalLink className="w-4 h-4 text-green-600" />
                      <a
                        href={selectedSpot.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-500 text-sm break-all"
                      >
                        {selectedSpot.image_url}
                      </a>
                    </div>
                  </div>
                )}

                {selectedSpot.qr_code_link && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-700">QR Code Link</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <QrCode className="w-4 h-4 text-blue-600" />
                      <a
                        href={selectedSpot.qr_code_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm break-all"
                      >
                        {selectedSpot.qr_code_link}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => handleApprovalToggle(selectedSpot.aispot_id, selectedSpot.is_approved)}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                      selectedSpot.is_approved
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedSpot.is_approved ? (
                      <>
                        <XCircle className="w-5 h-5" />
                        <span>Revoke Approval</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve Spot</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(selectedSpot.aispot_id)}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAISpotManagement