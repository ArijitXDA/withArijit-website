import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { MessageSquare, Save, RefreshCw, Check } from 'lucide-react'

interface ChatLimit {
  id: string
  user_type: string
  daily_message_limit: number
  monthly_message_limit: number
  created_at: string
  updated_at: string
}

export default function AdminAIChatLimits() {
  const { adminUser } = useAdminAuth()
  const [limits, setLimits] = useState<ChatLimit[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ daily: number; monthly: number }>({ daily: 0, monthly: 0 })
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  useEffect(() => {
    fetchLimits()
  }, [])

  async function fetchLimits() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ai_chat_limits')
        .select('*')
        .order('user_type', { ascending: true })

      if (error) throw error
      setLimits(data || [])
    } catch (err) {
      console.error('Failed to fetch chat limits:', err)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(limit: ChatLimit) {
    setEditingId(limit.id)
    setEditValues({
      daily: limit.daily_message_limit,
      monthly: limit.monthly_message_limit,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditValues({ daily: 0, monthly: 0 })
  }

  async function handleSave(limitId: string) {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('ai_chat_limits')
        .update({
          daily_message_limit: editValues.daily,
          monthly_message_limit: editValues.monthly,
          updated_at: new Date().toISOString(),
        })
        .eq('id', limitId)

      if (error) throw error

      setEditingId(null)
      setSavedId(limitId)
      setTimeout(() => setSavedId(null), 2000)
      fetchLimits()
    } catch (err) {
      console.error('Failed to update chat limit:', err)
      alert('Failed to update limit. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function getUserTypeBadge(type: string) {
    switch (type) {
      case 'free': return 'bg-gray-600/20 text-gray-400'
      case 'enrolled': return 'bg-green-600/20 text-green-400'
      case 'paid': return 'bg-orange-600/20 text-orange-400'
      case 'premium': return 'bg-purple-600/20 text-purple-400'
      case 'trial': return 'bg-cyan-600/20 text-cyan-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Chat Limits</h1>
          <p className="text-gray-400 text-sm mt-1">Configure message limits per user type</p>
        </div>
        <button
          onClick={fetchLimits}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-orange-600/10 border border-orange-600/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-orange-400 mt-0.5" />
          <div>
            <p className="text-orange-400 text-sm font-medium">How limits work</p>
            <p className="text-gray-400 text-xs mt-1">
              Each user type has a daily and monthly message limit for AI chat. Click on any row to edit inline. Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Limits Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/4 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-gray-400 font-medium">User Type</th>
                <th className="text-center p-4 text-gray-400 font-medium">Daily Limit</th>
                <th className="text-center p-4 text-gray-400 font-medium">Monthly Limit</th>
                <th className="text-left p-4 text-gray-400 font-medium">Last Updated</th>
                <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {limits.map((limit) => (
                <tr key={limit.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full capitalize ${getUserTypeBadge(limit.user_type)}`}>
                      {limit.user_type}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {editingId === limit.id ? (
                      <input
                        type="number"
                        value={editValues.daily}
                        onChange={(e) => setEditValues({ ...editValues, daily: parseInt(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 bg-gray-900 border border-orange-500 rounded text-white text-center focus:outline-none"
                        min={0}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="text-white cursor-pointer hover:text-orange-400 transition-colors"
                        onClick={() => startEdit(limit)}
                      >
                        {limit.daily_message_limit}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editingId === limit.id ? (
                      <input
                        type="number"
                        value={editValues.monthly}
                        onChange={(e) => setEditValues({ ...editValues, monthly: parseInt(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 bg-gray-900 border border-orange-500 rounded text-white text-center focus:outline-none"
                        min={0}
                      />
                    ) : (
                      <span
                        className="text-white cursor-pointer hover:text-orange-400 transition-colors"
                        onClick={() => startEdit(limit)}
                      >
                        {limit.monthly_message_limit}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400 text-xs">
                    {limit.updated_at
                      ? new Date(limit.updated_at).toLocaleString()
                      : new Date(limit.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    {editingId === limit.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(limit.id)}
                          disabled={saving}
                          className="flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors disabled:bg-gray-700"
                        >
                          {saving ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                          Save
                        </button>
                      </div>
                    ) : savedId === limit.id ? (
                      <span className="flex items-center justify-end gap-1 text-green-400 text-xs">
                        <Check className="w-3 h-3" />
                        Saved
                      </span>
                    ) : (
                      <button
                        onClick={() => startEdit(limit)}
                        className="text-gray-400 hover:text-orange-400 text-xs transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {limits.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No chat limits configured yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
