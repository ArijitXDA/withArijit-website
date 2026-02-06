import React from 'react'
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  ExternalLink, 
  QrCode,
  Building,
  User,
  DollarSign
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

interface AISpotDetailModalProps {
  spot: AISpot | null
  isOpen: boolean
  onClose: () => void
}

const AISpotDetailModal: React.FC<AISpotDetailModalProps> = ({ spot, isOpen, onClose }) => {
  if (!isOpen || !spot) return null

  const getEmbedMapUrl = (mapLink: string) => {
    try {
      // Extract coordinates or place_id from various Google Maps URL formats
      if (mapLink.includes('place/')) {
        // Format: https://maps.google.com/maps/place/...
        const placeMatch = mapLink.match(/place\/([^\/]+)/)
        if (placeMatch) {
          return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(placeMatch[1])}`
        }
      } else if (mapLink.includes('@')) {
        // Format: https://maps.google.com/maps?q=@lat,lng
        const coordMatch = mapLink.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
        if (coordMatch) {
          return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${coordMatch[1]},${coordMatch[2]}&zoom=15`
        }
      } else if (mapLink.includes('q=')) {
        // Format: https://maps.google.com/maps?q=location
        const qMatch = mapLink.match(/q=([^&]+)/)
        if (qMatch) {
          return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${qMatch[1]}`
        }
      }
      // Fallback: use the location as search
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(spot.city + ', ' + spot.state)}`
    } catch (error) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(spot.city + ', ' + spot.state)}`
    }
  }

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'Restaurants':
        return '🍽️'
      case 'Pubs':
        return '🍺'
      case 'Cafes':
        return '☕'
      case 'Libraries':
        return '📚'
      case 'Office Canteens':
        return '🏢'
      case 'Mall Food Courts':
        return '🛍️'
      case 'Clubs':
        return '🎵'
      case 'Co-working Spaces':
        return '💻'
      case 'Hotels':
        return '🏨'
      default:
        return '📍'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getPlaceIcon(spot.type_of_place)}</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{spot.name || `AI Spot - ${spot.city}`}</h3>
              <p className="text-blue-600 font-medium">{spot.type_of_place}</p>
              {spot.ratings && spot.ratings > 0 && (
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-gray-700">{spot.ratings.toFixed(1)} / 5.0</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Large Image */}
          <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl overflow-hidden mb-6">
            {spot.image_url ? (
              <img
                src={spot.image_url}
                alt={spot.name || `${spot.type_of_place} in ${spot.city}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-8xl">{getPlaceIcon(spot.type_of_place)}</div>
              </div>
            )}
          </div>

          {/* Pricing Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-xs font-medium text-green-600 uppercase">Cost for a table of 2</p>
                <p className="text-lg font-bold text-green-800">{spot.price}</p>
              </div>
            </div>
          </div>

          {/* Contact Person Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Contact Person</span>
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{spot.owner_manager_name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-600" />
                <a href={`tel:${spot.mobile}`} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                  {spot.mobile}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-purple-600" />
                <a href={`mailto:${spot.email}`} className="text-sm text-blue-600 hover:text-blue-500 break-all">
                  {spot.email}
                </a>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
            <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Location</span>
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">{spot.address}</p>
              <p className="text-sm text-gray-700">{spot.city}, {spot.state} {spot.pin_zip}</p>
              <p className="text-sm text-gray-700">{spot.country}</p>
              <div className="pt-2">
                <p className="text-xs text-gray-500">Venue Contact</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Phone className="w-3 h-3 text-gray-500" />
                  <a href={`tel:${spot.telephone}`} className="text-sm text-blue-600 hover:text-blue-500">
                    {spot.telephone}
                  </a>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="w-3 h-3 text-gray-500" />
                  <a href={`mailto:${spot.aispot_email}`} className="text-sm text-blue-600 hover:text-blue-500 break-all">
                    {spot.aispot_email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Map */}
          {spot.map_link && (
            <div className="rounded-xl overflow-hidden mb-6 border border-gray-200">
              <iframe
                src={getEmbedMapUrl(spot.map_link)}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${spot.name || spot.city}`}
              />
            </div>
          )}

          {/* QR Code Section */}
          {spot.qr_code_link && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <QrCode className="w-6 h-6 text-blue-600" />
                <h4 className="text-lg font-bold text-gray-900">Take the AI Readiness Quiz</h4>
              </div>
              <p className="text-gray-600 mb-4">
                Scan the QR code at this venue or click the link below to take your AI Readiness Quiz
              </p>
              <a
                href={spot.qr_code_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>Take Quiz Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {spot.map_link && (
              <a
                href={spot.map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MapPin className="w-5 h-5" />
                <span>Open Map</span>
              </a>
            )}

            <a
              href={`tel:${spot.mobile}`}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </a>

            <a
              href={`mailto:${spot.email}`}
              className="bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AISpotDetailModal