import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { ADMIN_MENU_ITEMS } from '../../lib/constants'
import {
  LayoutDashboard, GraduationCap, Users, ClipboardList, CreditCard,
  Tag, Building2, BookOpen, MessageSquare, Mail, BarChart3, Video,
  UserCheck, Award, QrCode, Sparkles, Shield, LogOut, ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Map icon names to components
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  GraduationCap,
  Users,
  ClipboardList,
  CreditCard,
  Tag,
  Building2,
  BookOpen,
  MessageSquare,
  Mail,
  BarChart3,
  Video,
  UserCheck,
  Award,
  QrCode,
  Sparkles,
  Shield,
}

interface AdminSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function AdminSidebar({ collapsed, onToggleCollapse }: AdminSidebarProps) {
  const { adminUser, checkPermission, adminLogout } = useAdminAuth()
  const location = useLocation()

  // Filter menu items based on admin permissions
  const visibleItems = ADMIN_MENU_ITEMS.filter((item) => {
    if (!item.permission) return true // Always visible (e.g., Dashboard)
    return checkPermission(item.permission)
  })

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <div className="min-w-0">
            <h2 className="text-white font-bold text-lg truncate">Admin</h2>
            <p className="text-gray-500 text-xs truncate">
              {adminUser?.display_name || adminUser?.username}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-orange-600/20 text-orange-400 text-[10px] font-medium rounded-full uppercase">
              {adminUser?.role?.replace('_', ' ')}
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors flex-shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {visibleItems.map((item) => {
          const IconComponent = iconMap[item.icon] || LayoutDashboard
          const isActive = item.path === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.path)

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 mx-2 my-0.5 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-600/20 text-orange-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-800">
        <button
          onClick={adminLogout}
          title={collapsed ? 'Logout' : undefined}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
