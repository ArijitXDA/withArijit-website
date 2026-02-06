import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const navigate = useNavigate();
  const { completePasswordRecovery } = useAuth();

  useEffect(() => {
    console.log('ResetPassword component mounted');
    console.log('Current URL:', window.location.href);
    console.log('Hash:', window.location.hash);
    console.log('Recovery flag:', sessionStorage.getItem('password_recovery_flow'));
    
    // Parse hash parameters once for the entire useEffect
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    // Set recovery flag if we detect recovery type in URL
    if (type === 'recovery') {
      console.log('Setting recovery flag from ResetPassword component');
      sessionStorage.setItem('password_recovery_flow', 'true');
    }
    
    // Check for error parameters in URL
    const error = hashParams.get('error');
    const errorCode = hashParams.get('error_code');
    const errorDescription = hashParams.get('error_description');
    
    console.log('URL parameters:', { error, errorCode, errorDescription });
    
    if (error) {
      console.log('Error found in URL:', error, errorCode, errorDescription);
      if (errorCode === 'otp_expired' || error === 'access_denied') {
        setError('This password reset link has expired or is invalid. Please request a new password reset link.');
        setPageLoading(false);
        return;
      }
    }
    
    const validateResetSession = async () => {
      try {
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log('Hash parameters:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        if (accessToken && refreshToken && type === 'recovery') {
          console.log('Password reset tokens found in URL - setting session');
          
          // Ensure recovery flag is set
          sessionStorage.setItem('password_recovery_flow', 'true');
          
          // Set the session with the tokens from URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Error setting session:', error);
            setError('Invalid or expired reset link. Please request a new password reset.');
          } else {
            console.log('Session set successfully for password reset');
            setSessionValid(true);
            // Don't clean up URL hash yet - keep it until password is reset
          }
        } else {
          // Check if we already have a valid recovery session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Session error:', error);
            setError('Invalid or expired reset link. Please request a new password reset.');
          } else if (session && session.user) {
            console.log('Valid session found for password reset');
            setSessionValid(true);
          } else {
            setError('Invalid or expired reset link. Please request a new password reset.');
          }
        }
      } catch (err) {
        console.error('Error validating reset session:', err);
        setError('Failed to validate reset link. Please try again.');
      } finally {
        setPageLoading(false);
      }
    };

    validateResetSession();
  }, [completePasswordRecovery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        // Complete the password recovery process
        completePasswordRecovery();
        
        // Clear the URL hash
        window.history.replaceState(null, '', window.location.pathname);
        
        // Sign out the user so they can sign in with their new password
        await supabase.auth.signOut();
        
        // Redirect to sign in page with success message
        navigate('/signin', { 
          state: { 
            message: 'Password updated successfully! Please sign in with your new password.' 
          } 
        });
      }
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Validating reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error || 'Invalid or expired reset link. Please request a new password reset.'}
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/forgot-password')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Request New Reset Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set New Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}