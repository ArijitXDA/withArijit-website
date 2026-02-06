import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Download, 
  Star, 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  Github, 
  ExternalLink,
  Lock,
  UserPlus,
  CreditCard
} from 'lucide-react'

interface LibraryItem {
  id: string
  publication_type: string
  category: string
  title: string
  author_team: string
  level: string
  pages?: number
  file_size_mb?: number
  rating?: number
  url: string
  publication_date: string
  license_source: string
  tags: string[]
  contributor: string
  verified: boolean
  access: string
  thumbnail_url?: string
  github_repo?: string
  demo_url?: string
  update_date: string
  notes?: string
}

interface LibraryCardProps {
  item: LibraryItem
  isEnrolledStudent: boolean
}

const LibraryCard: React.FC<LibraryCardProps> = ({ item, isEnrolledStudent }) => {
  const { user } = useAuth()

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      case 'Non-tech':
        return 'bg-blue-100 text-blue-800'
      case 'Manager':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccessIcon = (access: string) => {
    switch (access) {
      case 'Anyone':
        return <Download className="w-4 h-4" />
      case 'Signed Up User':
        return user ? <Download className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />
      case 'Enrolled Student':
      case 'Private':
        return isEnrolledStudent ? <Download className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />
      default:
        return <Lock className="w-4 h-4" />
    }
  }

  const getAccessText = (access: string) => {
    switch (access) {
      case 'Anyone':
        return 'Download'
      case 'Signed Up User':
        return user ? 'Download' : 'Sign In to Download'
      case 'Enrolled Student':
      case 'Private':
        return isEnrolledStudent ? 'Download' : 'Enroll to Access'
      default:
        return 'Restricted'
    }
  }

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'Anyone':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'Signed Up User':
        return user 
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      case 'Enrolled Student':
      case 'Private':
        return isEnrolledStudent 
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-orange-600 hover:bg-orange-700 text-white'
      default:
        return 'bg-gray-400 cursor-not-allowed text-white'
    }
  }

  const handleDownloadClick = () => {
    if (item.access === 'Anyone') {
      window.open(item.url, '_blank')
    } else if (item.access === 'Signed Up User') {
      if (user) {
        window.open(item.url, '_blank')
      } else {
        // Redirect to sign in
        window.location.href = '/signin'
      }
    } else if (item.access === 'Enrolled Student' || item.access === 'Private') {
      if (isEnrolledStudent) {
        window.open(item.url, '_blank')
      } else if (user) {
        // Redirect to courses for enrollment
        window.location.href = '/courses'
      } else {
        // Redirect to sign up
        window.location.href = '/signup'
      }
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Thumbnail */}
      {item.thumbnail_url && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img 
            src={item.thumbnail_url} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors leading-tight">
              {item.title}
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{item.author_team}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(item.level)}`}>
              {item.level}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          {item.rating && (
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">{item.rating}/5</span>
            </div>
          )}
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Updated: {formatDate(item.update_date)}</span>
            </div>
            {item.pages && (
              <span>{item.pages} pages</span>
            )}
            {item.file_size_mb && (
              <span>{item.file_size_mb} MB</span>
            )}
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadClick}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${getAccessColor(item.access)}`}
            disabled={item.access === 'Private' && !isEnrolledStudent}
          >
            {getAccessIcon(item.access)}
            <span>{getAccessText(item.access)}</span>
          </button>
          
          {item.github_repo && (
            <a
              href={item.github_repo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          
          {item.demo_url && (
            <a
              href={item.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              title="View Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Publication Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Published: {item.publication_date}</span>
            <span>{item.contributor}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibraryCard