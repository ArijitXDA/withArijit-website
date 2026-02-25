import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { Plus, Pencil, Trash2, Search, X, Mail, Code, Eye } from 'lucide-react'

interface EmailTemplate {
  id: string
  template_code: string
  template_name: string
  subject: string
  body_html: string
  trigger_event: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminEmailTemplates() {
  const { adminUser } = useAdminAuth()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [saving, setSaving] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)

  const [formData, setFormData] = useState({
    template_code: '',
    template_name: '',
    subject: '',
    body_html: '',
    trigger_event: '',
    is_active: true,
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('template_code', { ascending: true })

      if (error) throw error
      setTemplates(data || [])
    } catch (err) {
      console.error('Failed to fetch email templates:', err)
    } finally {
      setLoading(false)
    }
  }

  function openCreateForm() {
    setEditingTemplate(null)
    setFormData({
      template_code: '',
      template_name: '',
      subject: '',
      body_html: '',
      trigger_event: '',
      is_active: true,
    })
    setShowForm(true)
  }

  function openEditForm(template: EmailTemplate) {
    setEditingTemplate(template)
    setFormData({
      template_code: template.template_code,
      template_name: template.template_name,
      subject: template.subject,
      body_html: template.body_html || '',
      trigger_event: template.trigger_event || '',
      is_active: template.is_active,
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const templateData = {
        template_code: formData.template_code.toUpperCase().trim(),
        template_name: formData.template_name.trim(),
        subject: formData.subject.trim(),
        body_html: formData.body_html,
        trigger_event: formData.trigger_event || null,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      }

      if (editingTemplate) {
        const { error } = await supabase
          .from('email_templates')
          .update(templateData)
          .eq('id', editingTemplate.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('email_templates')
          .insert(templateData)
        if (error) throw error
      }

      setShowForm(false)
      fetchTemplates()
    } catch (err) {
      console.error('Failed to save template:', err)
      alert('Failed to save email template. Please check the data and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteTemplate(template: EmailTemplate) {
    if (!confirm(`Are you sure you want to delete template "${template.template_name}"?`)) return

    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', template.id)

    if (!error) fetchTemplates()
  }

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.template_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.template_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.trigger_event?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Email Templates</h1>
          <p className="text-gray-400 text-sm mt-1">{templates.length} total templates</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, code, or trigger event..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Templates List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`bg-gray-800 rounded-lg p-4 border transition-colors ${
                template.is_active ? 'border-gray-700/50 hover:border-gray-600' : 'border-red-900/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <h3 className="text-white font-medium truncate">{template.template_name}</h3>
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-[10px] font-mono rounded">
                      {template.template_code}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] rounded ${
                      template.is_active ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">Subject: {template.subject}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    {template.trigger_event && (
                      <span className="flex items-center gap-1">
                        <Code className="w-3 h-3" />
                        Trigger: {template.trigger_event}
                      </span>
                    )}
                    <span>Updated: {new Date(template.updated_at || template.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-blue-400 transition-colors"
                    title="Preview HTML"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditForm(template)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No email templates found.
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingTemplate ? 'Edit Template' : 'Create Template'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Template Code *</label>
                  <input
                    type="text"
                    value={formData.template_code}
                    onChange={(e) => setFormData({ ...formData, template_code: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="WELCOME_EMAIL"
                    disabled={!!editingTemplate}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Trigger Event</label>
                  <input
                    type="text"
                    value={formData.trigger_event}
                    onChange={(e) => setFormData({ ...formData, trigger_event: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="on_enrollment, on_payment, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Template Name *</label>
                <input
                  type="text"
                  value={formData.template_name}
                  onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="Welcome Email"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="Welcome to WithArijit - {{course_name}}"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Body HTML *</label>
                <textarea
                  value={formData.body_html}
                  onChange={(e) => setFormData({ ...formData, body_html: e.target.value })}
                  rows={12}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-orange-500 resize-y"
                  placeholder="<html>...</html>"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Available variables: {'{{student_name}}'}, {'{{student_email}}'}, {'{{course_name}}'}, {'{{batch_name}}'}, {'{{payment_amount}}'}
                </p>
              </div>

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
                disabled={saving || !formData.template_code || !formData.template_name || !formData.subject}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingTemplate ? 'Update Template' : 'Create Template'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HTML Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Preview: {previewTemplate.template_name}
              </h2>
              <button onClick={() => setPreviewTemplate(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-400 text-xs">Subject</p>
                <p className="text-white text-sm">{previewTemplate.subject}</p>
              </div>
              <div className="bg-white rounded-lg p-4 max-h-[60vh] overflow-y-auto">
                <div
                  dangerouslySetInnerHTML={{ __html: previewTemplate.body_html }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
