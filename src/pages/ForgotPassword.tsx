import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail, ArrowLeft, Send, CheckCircle, ArrowRight } from 'lucide-react'

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError('')
  }

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Sending password reset email to:', email)
      
      // First, check if the email exists in our users table
      console.log('Checking if email exists in users table...')
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle()
      
      if (userCheckError) {
        console.error('Error checking user existence:', userCheckError)
        setError('Unable to verify email. Please try again.')
        setIsLoading(false)
        return
      }
      
      if (!existingUser) {
        console.log('Email not found in users table:', email)
        setError('You are not yet registered with us. Please do a free sign-up first.')
        setIsLoading(false)
        return
      }
      
      console.log('Email found in users table, proceeding with password reset')
      
      // Use Supabase's built-in password reset functionality with proper redirect
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
        captchaToken: undefined // Disable captcha for now
      })

      if (error) {
        console.error('Password reset error:', error)
        setError(error.message)
      } else {
        console.log('Password reset email sent successfully')
        setEmailSent(true)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Show email sent confirmation
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">WithArijit<span className="text-lg font-normal">.com</span></span>
            </Link>
            
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                <ol className="text-sm text-blue-800 space-y-2 text-left">
                  <li>1. Check your email inbox</li>
                  <li>2. Click the "Reset Password" link in the email</li>
                  <li>3. You'll be taken to a page to set your new password</li>
                  <li>4. Sign in with your new password</li>
                </ol>
              </div>
              
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              
              <div className="flex flex-col space-y-3">
                <Link
                  to="/signin"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Sign In
                </Link>
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  Try Different Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show email input form by default
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">WithArijit<span className="text-lg font-normal">.com</span></span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">Enter your email to receive a password reset link</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSendResetLink} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-600 text-sm">
                  <p>{error}</p>
                  {error.includes('not yet registered') && (
                    <div className="mt-3">
                      <Link
                        to="/signup"
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                      >
                        <span>Sign Up Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
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
                  value={email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/signin"
              className="flex items-center justify-center space-x-2 text-sm text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword