import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Note: LinkedIn uses 'linkedin_oidc' as the Supabase provider ID
type OAuthProvider = 'google' | 'linkedin_oidc' | 'github' | 'azure'

interface OAuthButtonsProps {
  redirectTo?: string
  mode?: 'signin' | 'signup'
}

const PROVIDERS: {
  id: OAuthProvider
  label: string
  icon: React.ReactNode
  bgColor: string
  textColor: string
  borderColor: string
}[] = [
  {
    id: 'google',
    label: 'Google',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    bgColor: 'bg-white hover:bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border border-gray-300',
  },
  {
    id: 'linkedin_oidc',
    label: 'LinkedIn',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    bgColor: 'bg-[#0A66C2] hover:bg-[#004182]',
    textColor: 'text-white',
    borderColor: 'border border-[#0A66C2]',
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    bgColor: 'bg-gray-900 hover:bg-gray-800',
    textColor: 'text-white',
    borderColor: 'border border-gray-800',
  },
  {
    id: 'azure',
    label: 'Microsoft',
    icon: (
      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
        <path d="M11.4 24H0V12.6h11.4V24z" fill="#F1511B" />
        <path d="M24 24H12.6V12.6H24V24z" fill="#80CC28" />
        <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#00ADEF" />
        <path d="M24 11.4H12.6V0H24v11.4z" fill="#FBBC09" />
      </svg>
    ),
    bgColor: 'bg-white hover:bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border border-gray-300',
  },
]

/**
 * OAuth login buttons — Google, LinkedIn, GitHub, Microsoft.
 * 2×2 grid layout. Works on both SignIn and SignUp pages.
 */
export default function OAuthButtons({ redirectTo, mode = 'signin' }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)
  const [error, setError] = useState('')

  const handleOAuth = async (provider: OAuthProvider) => {
    setLoadingProvider(provider)
    setError('')

    try {
      const redirectUrl = `${window.location.origin}/auth/callback${
        redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''
      }`

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          ...(provider === 'azure' ? { scopes: 'email' } : {}),
          ...(provider === 'linkedin_oidc' ? { scopes: 'openid profile email' } : {}),
        },
      })

      if (authError) throw authError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth sign-in failed. Please try again.')
      setLoadingProvider(null)
    }
  }

  const actionLabel = mode === 'signup' ? 'Sign up' : 'Sign in'

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* 2×2 grid of provider buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleOAuth(provider.id)}
            disabled={loadingProvider !== null}
            title={`${actionLabel} with ${provider.label}`}
            className={`
              flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
              font-medium text-sm transition-all duration-200 shadow-sm
              ${provider.bgColor} ${provider.textColor} ${provider.borderColor}
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:shadow-md active:scale-95
            `}
          >
            {loadingProvider === provider.id ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              provider.icon
            )}
            <span className="truncate">{provider.label}</span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-400">or continue with email</span>
        </div>
      </div>
    </div>
  )
}
