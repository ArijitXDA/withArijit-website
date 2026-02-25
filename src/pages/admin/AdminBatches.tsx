import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { Plus, Pencil, Search, X, Calendar, Users, Clock } from 'lucide-react'

interface Batch {
  id: string
  batch_code: string
  batch_name: string
  course_id: string
  session_days: string[]
  session_time: string
  max_students: number
  current_student_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminBatches() {
  const { adminUser } = useAdminAuth()
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    batch_code: '',
    batch_name: '',
    course_id: '',
    session_days: '' as string,
    session_time: '',
    max_students: 30,
    is_active: true,
  })

  useEffect(() => {
    fetchBatches()
  }, [])

  async function fetchBatches() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('batches_v2')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBatches(data || [])
    } catch (err) {
      console.error('Failed to fetch batches:', err)
    } finally {
      setLoading(false)
    }
  }

  function openCreateForm() {
    setEditingBatch(null)
    setFormData({
      batch_code: '',
      batch_name: '',
      course_id: '',
      session_days: '',
      session_time: '',
      max_students: 30,
      is_active: true,
    })
    setShowForm(true)
  }

  function openEditForm(batch: Batch) {
    setEditingBatch(batch)
    setFormData({
      batch_code: batch.batch_code,
      batch_name: batch.batch_name,
      course_id: batch.course_id || '',
      session_days: Array.isArray(batch.session_days) ? batch.session_days.join(', ') : '',
      session_time: batch.session_time || '',
      max_students: batch.max_students || 30,
      is_active: batch.is_active,
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const daysArray = formData.session_days
        ? formData.session_days.split(',').map((d) => d.trim()).filter(Boolean)
        : null

      const batchData = {
        batch_code: formData.batch_code.toUpperCase().trim(),
        batch_name: formData.batch_name.trim(),
        course_id: formData.course_id || null,
        session_days: daysArray,
        session_time: formData.session_time || null,
        max_students: formData.max_students,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      }

      if (editingBatch) {
        const { error } = await supabase
          .from('batches_v2')
          .update(batchData)
          .eq('id', editingBatch.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('batches_v2')
          .insert(batchData)
        if (error) throw error
      }

      setShowForm(false)
      fetchBatches()
    } catch (err) {
      console.error('Failed to save batch:', err)
      alert('Failed to save batch. Please check the data and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(batch: Batch) {
    const { error } = await supabase
      .from('batches_v2')
      .update({ is_active: !batch.is_active, updated_at: new Date().toISOString() })
      .eq('id', batch.id)

    if (!error) fetchBatches()
  }

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      !searchQuery ||
      b.batch_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.batch_code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Batch Management</h1>
          <p className="text-gray-400 text-sm mt-1">{batches.length} total batches</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Batch
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search batches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Batch List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className={`bg-gray-800 rounded-lg p-4 border transition-colors ${
                batch.is_active ? 'border-gray-700/50 hover:border-gray-600' : 'border-red-900/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium truncate">{batch.batch_name}</h3>
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-[10px] font-mono rounded">
                      {batch.batch_code}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] rounded ${
                      batch.is_active ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {batch.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {Array.isArray(batch.session_days) ? batch.session_days.join(', ') : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {batch.session_time || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {batch.current_student_count || 0}/{batch.max_students || '-'}
                    </span>
                    {batch.course_id && <span>Course: {batch.course_id}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => toggleActive(batch)}
                    className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                      batch.is_active
                        ? 'text-yellow-400 hover:bg-gray-700'
                        : 'text-green-400 hover:bg-gray-700'
                    }`}
                  >
                    {batch.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openEditForm(batch)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title="Edit batch"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredBatches.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No batches found matching your search.
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingBatch ? 'Edit Batch' : 'Create Batch'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Batch Code *</label>
                  <input
                    type="text"
                    value={formData.batch_code}
                    onChange={(e) => setFormData({ ...formData, batch_code: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="BATCH_AI_001"
                    disabled={!!editingBatch}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Course ID</label>
                  <input
                    type="text"
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Course UUID"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Batch Name *</label>
                <input
                  type="text"
                  value={formData.batch_name}
                  onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="AI Weekday Batch - March 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Session Days (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.session_days}
                    onChange={(e) => setFormData({ ...formData, session_days: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Mon, Wed, Fri"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Session Time</label>
                  <input
                    type="text"
                    value={formData.session_time}
                    onChange={(e) => setFormData({ ...formData, session_time: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="7:00 PM - 8:30 PM IST"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Max Students</label>
                  <input
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min={1}
                  />
                </div>
                <div className="flex items-end">
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
              </div>
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
                disabled={saving || !formData.batch_code || !formData.batch_name}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingBatch ? 'Update Batch' : 'Create Batch'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
