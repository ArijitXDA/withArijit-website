import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { Plus, Pencil, Search, X, Shield, ShieldAlert, ShieldCheck, UserCog } from 'lucide-react'

interface AdminUserRecord {
  id: string
  username: string
  email: string
  display_name: string | null
  role: string
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

const ADMIN_ROLES = [
  { value: 'dev_admin', label: 'Dev Admin', description: 'Full system access' },
  { value: 'super_admin', label: 'Super Admin', description: 'All admin features' },
  { value: 'admin', label: 'Admin', description: 'Standard admin access' },
  { value: 'moderator', label: 'Moderator', description: 'Limited admin access' },
]

export default function AdminUserManagement() {
  const { adminUser, isDevAdmin } = useAdminAuth()
  const [users, setUsers] = useState<AdminUserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    display_name: '',
    role: 'admin',
    is_active: true,
    password: '',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, username, email, display_name, role, is_active, last_login_at, created_at, updated_at')
        .order('created_at', { ascending: true })

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Failed to fetch admin users:', err)
    } finally {
      setLoading(false)
    }
  }

  // Only dev_admin can access this page
  if (!isDevAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Only dev_admin users can access user management.</p>
        </div>
      </div>
    )
  }

  function openCreateForm() {
    setEditingUser(null)
    setFormData({
      username: '',
      email: '',
      display_name: '',
      role: 'admin',
      is_active: true,
      password: '',
    })
    setShowForm(true)
  }

  function openEditForm(user: AdminUserRecord) {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      display_name: user.display_name || '',
      role: user.role,
      is_active: user.is_active,
      password: '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editingUser) {
        const updateData: Record<string, unknown> = {
          email: formData.email.trim(),
          display_name: formData.display_name.trim() || null,
          role: formData.role,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        }

        const { error } = await supabase
          .from('admin_users')
          .update(updateData)
          .eq('id', editingUser.id)
        if (error) throw error
      } else {
        // For creating new admin users, we insert the record
        // The password should be hashed by the backend/edge function
        const { error } = await supabase
          .from('admin_users')
          .insert({
            username: formData.username.toLowerCase().trim(),
            email: formData.email.trim(),
            display_name: formData.display_name.trim() || null,
            role: formData.role,
            is_active: formData.is_active,
          })
        if (error) throw error
      }

      setShowForm(false)
      fetchUsers()
    } catch (err) {
      console.error('Failed to save admin user:', err)
      alert('Failed to save admin user. Please check the data and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(user: AdminUserRecord) {
    if (user.role === 'dev_admin') {
      alert('Cannot deactivate dev_admin accounts.')
      return
    }

    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: !user.is_active, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (!error) fetchUsers()
  }

  function getRoleBadge(role: string) {
    switch (role) {
      case 'dev_admin': return 'bg-red-600/20 text-red-400'
      case 'super_admin': return 'bg-purple-600/20 text-purple-400'
      case 'admin': return 'bg-orange-600/20 text-orange-400'
      case 'moderator': return 'bg-blue-600/20 text-blue-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  function getRoleIcon(role: string) {
    switch (role) {
      case 'dev_admin': return <ShieldAlert className="w-4 h-4 text-red-400" />
      case 'super_admin': return <ShieldCheck className="w-4 h-4 text-purple-400" />
      case 'admin': return <Shield className="w-4 h-4 text-orange-400" />
      default: return <UserCog className="w-4 h-4 text-blue-400" />
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin User Management</h1>
          <p className="text-gray-400 text-sm mt-1">{users.length} admin users</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-red-400 text-sm font-medium">Dev Admin Only</p>
            <p className="text-gray-400 text-xs mt-1">
              This page is restricted to dev_admin role. Changes to admin accounts affect system access and security.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by username, email, or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Users List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-gray-800 rounded-lg p-4 border transition-colors ${
                user.is_active ? 'border-gray-700/50 hover:border-gray-600' : 'border-red-900/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getRoleIcon(user.role)}
                    <h3 className="text-white font-medium">{user.display_name || user.username}</h3>
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-[10px] font-mono rounded">
                      @{user.username}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] rounded capitalize ${getRoleBadge(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] rounded ${
                      user.is_active ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                    {user.last_login_at && (
                      <span>Last login: {new Date(user.last_login_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => toggleActive(user)}
                    disabled={user.role === 'dev_admin'}
                    className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                      user.role === 'dev_admin'
                        ? 'text-gray-600 cursor-not-allowed'
                        : user.is_active
                          ? 'text-yellow-400 hover:bg-gray-700'
                          : 'text-green-400 hover:bg-gray-700'
                    }`}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openEditForm(user)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No admin users found.
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingUser ? 'Edit Admin User' : 'Create Admin User'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="johndoe"
                  disabled={!!editingUser}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="admin@witharijit.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  {ADMIN_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Initial Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Set via edge function after creation"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Note: Password must be set through the admin-auth edge function with bcrypt hashing.
                  </p>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded accent-orange-500"
                />
                <span className="text-sm text-gray-300">Active</span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.username || !formData.email}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingUser ? 'Update User' : 'Create User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
