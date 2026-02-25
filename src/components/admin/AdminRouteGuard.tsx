import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import type { AdminPermissions } from '../../types/admin'
import { ShieldAlert } from 'lucide-react'

interface AdminRouteGuardProps {
  children: React.ReactNode
  requiredPermission?: keyof AdminPermissions
}

/**
 * Guards admin routes. Redirects to /admin/login if not authenticated.
 * If a requiredPermission is specified, shows access denied if the admin
 * doesn't have that permission.
 */
export default function AdminRouteGuard({ children, requiredPermission }: AdminRouteGuardProps) {
  const { isAdminAuthenticated, loading, checkPermission } = useAdminAuth()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Check specific permission if required
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400 max-w-md">
          You don't have permission to access this page.
          Contact your administrator if you believe this is an error.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
