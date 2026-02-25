import React from 'react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { AlertTriangle, X } from 'lucide-react'

/**
 * Yellow banner displayed when a dev_admin is impersonating another user.
 * Shows at the top of the page with an option to stop impersonation.
 */
export default function ImpersonationBanner() {
  const { isImpersonating, impersonatingEmail, stopImpersonation, adminUser } = useAdminAuth()

  if (!isImpersonating || !impersonatingEmail) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium text-sm">
            Impersonating: <strong>{impersonatingEmail}</strong>
          </span>
          <span className="text-yellow-800 text-xs">
            (logged in as {adminUser?.username})
          </span>
        </div>
        <button
          onClick={stopImpersonation}
          className="flex items-center gap-1 px-3 py-1 bg-black/20 hover:bg-black/30 rounded text-sm font-medium transition-colors"
        >
          <X className="w-4 h-4" />
          Stop Impersonation
        </button>
      </div>
    </div>
  )
}
