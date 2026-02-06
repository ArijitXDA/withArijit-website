import React, { createContext, useContext, useState, useEffect } from 'react'

interface AdminAuthContextType {
  isAdminAuthenticated: boolean
  adminLogin: (username: string, password: string) => boolean
  adminLogout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  // Check for existing admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (adminSession === 'authenticated') {
      setIsAdminAuthenticated(true)
    }
  }, [])

  const adminLogin = (username: string, password: string): boolean => {
    // Check credentials
    if (username === 'arijitwith' && password === 'reach500') {
      setIsAdminAuthenticated(true)
      localStorage.setItem('admin_session', 'authenticated')
      return true
    }
    return false
  }

  const adminLogout = () => {
    setIsAdminAuthenticated(false)
    localStorage.removeItem('admin_session')
  }

  const value = {
    isAdminAuthenticated,
    adminLogin,
    adminLogout
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}