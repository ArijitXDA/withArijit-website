import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

/**
 * OAuth callback handler.
 * Route: /auth/callback
 * Handles redirect after OAuth login (Google, GitHub, Microsoft).
 * On success, redirects to the intended destination or /dashboard.
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    handleAuthCallback()
  }, [])

  async function handleAuthCallback() {
    try {
      // Supabase handles the token exchange automatically via URL hash
      const { data: { session }, error: authError } = await supabase.auth.getSession()

      if (authError) throw authError

      if (session) {
        // Determine redirect destination
        const redirect = searchParams.get('redirect') || '/dashboard'
        navigate(redirect, { replace: true })
      } else {
        // Wait a moment for the auth state to settle
        await new Promise((r) => setTimeout(r, 2000))

        const { data: { session: retrySession } } = await supabase.auth.getSession()
        if (retrySession) {
          const redirect = searchParams.get('redirect') || '/dashboard'
          navigate(redirect, { replace: true })
        } else {
          setError('Authentication failed. Please try again.')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication callback failed')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Authentication Error</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/signin')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-700">Completing sign in...</h2>
        <p className="text-sm text-gray-500 mt-2">Please wait while we verify your account.</p>
      </div>
    </div>
  )
}
