import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import {
  Plus, Pencil, Trash2, Search, X, BookOpen, Star, StarOff,
  FileText, Video, Link as LinkIcon, Eye, EyeOff
} from 'lucide-react'

interface StudyMaterial {
  id: string
  title: string
  material_type: string
  access_level: string
  file_url: string | null
  is_featured: boolean
  display_order: number
  is_active: boolean
  description: string | null
  course_id: string | null
  created_at: string
  updated_at: string
}

export default function AdminStudyMaterials() {
  const { adminUser } = useAdminAuth()
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    material_type: 'document',
    access_level: 'free',
    file_url: '',
    is_featured: false,
    display_order: 0,
    is_active: true,
    description: '',
    course_id: '',
  })

  useEffect(() => {
    fetchMaterials()
  }, [])

  async function fetchMaterials() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('study_materials_v2')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setMaterials(data || [])
    } catch (err) {
      console.error('Failed to fetch study materials:', err)
    } finally {
      setLoading(false)
    }
  }

  function openCreateForm() {
    setEditingMaterial(null)
    setFormData({
      title: '',
      material_type: 'document',
      access_level: 'free',
      file_url: '',
      is_featured: false,
      display_order: materials.length + 1,
      is_active: true,
      description: '',
      course_id: '',
    })
    setShowForm(true)
  }

  function openEditForm(material: StudyMaterial) {
    setEditingMaterial(material)
    setFormData({
      title: material.title,
      material_type: material.material_type || 'document',
      access_level: material.access_level || 'free',
      file_url: material.file_url || '',
      is_featured: material.is_featured,
      display_order: material.display_order,
      is_active: material.is_active,
      description: material.description || '',
      course_id: material.course_id || '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const materialData = {
        title: formData.title.trim(),
        material_type: formData.material_type,
        access_level: formData.access_level,
        file_url: formData.file_url || null,
        is_featured: formData.is_featured,
        display_order: formData.display_order,
        is_active: formData.is_active,
        description: formData.description || null,
        course_id: formData.course_id || null,
        updated_at: new Date().toISOString(),
      }

      if (editingMaterial) {
        const { error } = await supabase
          .from('study_materials_v2')
          .update(materialData)
          .eq('id', editingMaterial.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('study_materials_v2')
          .insert(materialData)
        if (error) throw error
      }

      setShowForm(false)
      fetchMaterials()
    } catch (err) {
      console.error('Failed to save material:', err)
      alert('Failed to save study material. Please check the data and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleFeatured(material: StudyMaterial) {
    const { error } = await supabase
      .from('study_materials_v2')
      .update({ is_featured: !material.is_featured, updated_at: new Date().toISOString() })
      .eq('id', material.id)

    if (!error) fetchMaterials()
  }

  async function toggleActive(material: StudyMaterial) {
    const { error } = await supabase
      .from('study_materials_v2')
      .update({ is_active: !material.is_active, updated_at: new Date().toISOString() })
      .eq('id', material.id)

    if (!error) fetchMaterials()
  }

  async function deleteMaterial(material: StudyMaterial) {
    if (!confirm(`Are you sure you want to delete "${material.title}"?`)) return

    const { error } = await supabase
      .from('study_materials_v2')
      .delete()
      .eq('id', material.id)

    if (!error) fetchMaterials()
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-purple-400" />
      case 'link': return <LinkIcon className="w-4 h-4 text-blue-400" />
      default: return <FileText className="w-4 h-4 text-cyan-400" />
    }
  }

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !filterType || m.material_type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Study Materials</h1>
          <p className="text-gray-400 text-sm mt-1">{materials.length} total materials</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Material
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Types</option>
          <option value="document">Document</option>
          <option value="video">Video</option>
          <option value="link">Link</option>
          <option value="pdf">PDF</option>
          <option value="presentation">Presentation</option>
        </select>
      </div>

      {/* Materials List */}
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
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className={`bg-gray-800 rounded-lg p-4 border transition-colors ${
                material.is_active ? 'border-gray-700/50 hover:border-gray-600' : 'border-red-900/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(material.material_type)}
                    <h3 className="text-white font-medium truncate">{material.title}</h3>
                    {material.is_featured && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                    <span className={`px-2 py-0.5 text-[10px] rounded capitalize ${
                      material.access_level === 'free' ? 'bg-green-600/20 text-green-400'
                        : material.access_level === 'enrolled' ? 'bg-blue-600/20 text-blue-400'
                        : 'bg-orange-600/20 text-orange-400'
                    }`}>
                      {material.access_level}
                    </span>
                  </div>
                  {material.description && (
                    <p className="text-gray-400 text-sm line-clamp-1 mb-1">{material.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span className="capitalize">{material.material_type}</span>
                    <span>Order: {material.display_order}</span>
                    {material.file_url && (
                      <a href={material.file_url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
                        View File
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => toggleFeatured(material)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors"
                    title={material.is_featured ? 'Unfeature' : 'Feature'}
                  >
                    {material.is_featured ? <StarOff className="w-4 h-4 text-yellow-400" /> : <Star className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => toggleActive(material)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors"
                    title={material.is_active ? 'Hide' : 'Show'}
                  >
                    {material.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditForm(material)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMaterial(material)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No study materials found.
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
                {editingMaterial ? 'Edit Material' : 'Add Material'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="Introduction to AI - Chapter 1"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="Brief description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Material Type *</label>
                  <select
                    value={formData.material_type}
                    onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="link">Link</option>
                    <option value="pdf">PDF</option>
                    <option value="presentation">Presentation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Access Level *</label>
                  <select
                    value={formData.access_level}
                    onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="free">Free</option>
                    <option value="enrolled">Enrolled Students</option>
                    <option value="paid">Paid Students</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">File URL</label>
                <input
                  type="url"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Course ID (optional)</label>
                  <input
                    type="text"
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Course UUID"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    min={0}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-orange-500"
                  />
                  <span className="text-sm text-gray-300">Featured</span>
                </label>
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

            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingMaterial ? 'Update Material' : 'Create Material'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
