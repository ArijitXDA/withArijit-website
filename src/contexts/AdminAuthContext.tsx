import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { AdminUser, AdminSession, AdminLoginResponse, AdminPermissions, AdminRole } from '../types/admin'
import { hasPermission } from '../lib/permissions'

// =====================================================
// Admin Auth Context - Separate Credentials System
// Admin auth is independent of Supabase Auth.
// Admins log in with username/password verified by
// the admin-auth edge function (bcrypt check).
// =====================================================

interface AdminAuthContextType {
  // State
  isAdminAuthenticated: boolean
  adminSession: AdminSession | null
  adminUser: AdminUser | null
  loading: boolean

  // Auth actions
  adminLogin: (username: string, password: string) => Promise<AdminLoginResponse>
  adminLogout: () => void

  // Permission checks
  checkPermission: (permission: keyof AdminPermissions) => boolean
  isDevAdmin: boolean
  isSuperAdmin: boolean
  role: AdminRole | null

  // Impersonation
  isImpersonating: boolean
  startImpersonation: (targetEmail: string) => void
  stopImpersonation: () => void
  impersonatingEmail: string | null
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

const ADMIN_SESSION_KEY = 'aijit_admin_session'
const SESSION_EXPIRY_HOURS = 12

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(ADMIN_SESSION_KEY)
    if (savedSession) {
      try {
        const session: AdminSession = JSON.parse(savedSession)
        // Check if session is expired
        if (session.expiresAt > Date.now()) {
          setAdminSession(session)
        } else {
          localStorage.removeItem(ADMIN_SESSION_KEY)
        }
      } catch {
        localStorage.removeItem(ADMIN_SESSION_KEY)
      }
    }
    setLoading(false)
  }, [])

  // Login via admin-auth edge function
  const adminLogin = useCallback(async (username: string, password: string): Promise<AdminLoginResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', username, password },
      })

      if (error) {
        return { success: false, error: error.message || 'Login failed' }
      }

      if (!data?.success) {
        return { success: false, error: data?.error || 'Invalid credentials' }
      }

      // Create session
      const session: AdminSession = {
        admin: data.admin,
        token: data.token,
        expiresAt: Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000,
        isImpersonating: false,
      }

      setAdminSession(session)
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))

      return { success: true, admin: data.admin, token: data.token }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      return { success: false, error: message }
    }
  }, [])

  const adminLogout = useCallback(() => {
    setAdminSession(null)
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }, [])

  // Permission checking
  const checkPermission = useCallback((permission: keyof AdminPermissions): boolean => {
    if (!adminSession) return false
    return hasPermission(adminSession.admin.role, permission, adminSession.admin.permissions)
  }, [adminSession])

  // Impersonation (dev_admin only)
  const startImpersonation = useCallback((targetEmail: string) => {
    if (!adminSession || adminSession.admin.role !== 'dev_admin') return

    const updatedSession: AdminSession = {
      ...adminSession,
      isImpersonating: true,
      impersonatingEmail: targetEmail,
    }
    setAdminSession(updatedSession)
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(updatedSession))
  }, [adminSession])

  const stopImpersonation = useCallback(() => {
    if (!adminSession) return

    const updatedSession: AdminSession = {
      ...adminSession,
      isImpersonating: false,
      impersonatingEmail: undefined,
    }
    setAdminSession(updatedSession)
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(updatedSession))
  }, [adminSession])

  const isAdminAuthenticated = !!adminSession && adminSession.expiresAt > Date.now()
  const adminUser = adminSession?.admin || null
  const role = adminUser?.role || null
  const isDevAdmin = role === 'dev_admin'
  const isSuperAdmin = role === 'super_admin'
  const isImpersonating = adminSession?.isImpersonating || false
  const impersonatingEmail = adminSession?.impersonatingEmail || null

  const value: AdminAuthContextType = {
    isAdminAuthenticated,
    adminSession,
    adminUser,
    loading,
    adminLogin,
    adminLogout,
    checkPermission,
    isDevAdmin,
    isSuperAdmin,
    role,
    isImpersonating,
    startImpersonation,
    stopImpersonation,
    impersonatingEmail,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
