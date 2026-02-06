import React from 'react'
import { MapPin, Phone, Star, Eye, Building } from 'lucide-react'

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

interface AISpotCardProps {
  spot: AISpot
  onView: () => void
}

const AISpotCard: React.FC<AISpotCardProps> = ({ spot, onView }) => {
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden relative">
        {spot.image_url ? (
          <img
            src={spot.image_url}
            alt={spot.name || `${spot.type_of_place} in ${spot.city}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">{getPlaceIcon(spot.type_of_place)}</div>
          </div>
        )}

        {/* Rating Badge */}
        {spot.ratings && spot.ratings > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs font-bold text-gray-900">{spot.ratings.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <Building className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">{spot.type_of_place}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
            {spot.name || `AI Spot - ${spot.city}`}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-start space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 leading-tight">{spot.city}, {spot.state}</span>
        </div>

        {/* Price */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 mb-3">
          <p className="text-xs text-green-600 font-medium">Cost for a table of 2</p>
          <div className="text-sm font-bold text-green-800">{spot.price}</div>
        </div>

        {/* Small Map Preview */}
        {spot.map_link && (
          <div className="h-24 rounded-lg overflow-hidden mb-3 border border-gray-200">
            <iframe
              src={getEmbedMapUrl(spot.map_link)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${spot.name || spot.city}`}
            />
          </div>
        )}

        {/* View Button */}
        <button
          onClick={onView}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  )
}

export default AISpotCard