import React, { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import AdminSidebar from './AdminSidebar'
import ImpersonationBanner from './ImpersonationBanner'

/**
 * Admin Layout wrapper - provides sidebar + content area for all /admin/* routes.
 * Redirects to login if not authenticated.
 */
export default function AdminLayout() {
  const { isAdminAuthenticated, loading, isImpersonating } = useAdminAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Impersonation Banner */}
      <ImpersonationBanner />

      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        } ${isImpersonating ? 'pt-10' : ''}`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
