import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { DiscountCoupon } from '../../types/payment'
import { Plus, Pencil, Pause, StopCircle, Play, Search, X, Copy, Check } from 'lucide-react'

export default function AdminDiscounts() {
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<DiscountCoupon | null>(null)
  const [saving, setSaving] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    coupon_code: '',
    coupon_name: '',
    description: '',
    discount_type: 'percentage' as string,
    discount_value: 0,
    min_purchase_amount: '' as string | number,
    max_discount_amount: '' as string | number,
    max_total_uses: '' as string | number,
    max_uses_per_student: 1,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
    applicable_to_new_students_only: false,
    applicable_to_payment_type: 'both',
    applicable_to_utm_source: '',
    applicable_to_utm_code: '',
    applicable_to_country: '',
    applicable_to_city: '',
    applicable_to_installment: '',
    is_active: true,
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  async function fetchCoupons() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCoupons(data || [])
    } catch (err) {
      console.error('Failed to fetch coupons:', err)
    } finally {
      setLoading(false)
    }
  }

  function openCreateForm() {
    setEditingCoupon(null)
    setFormData({
      coupon_code: '',
      coupon_name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_purchase_amount: '',
      max_discount_amount: '',
      max_total_uses: '',
      max_uses_per_student: 1,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: '',
      applicable_to_new_students_only: false,
      applicable_to_payment_type: 'both',
      applicable_to_utm_source: '',
      applicable_to_utm_code: '',
      applicable_to_country: '',
      applicable_to_city: '',
      applicable_to_installment: '',
      is_active: true,
    })
    setShowForm(true)
  }

  function openEditForm(coupon: DiscountCoupon) {
    setEditingCoupon(coupon)
    setFormData({
      coupon_code: coupon.coupon_code,
      coupon_name: coupon.coupon_name,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_purchase_amount: coupon.min_purchase_amount || '',
      max_discount_amount: coupon.max_discount_amount || '',
      max_total_uses: coupon.max_total_uses || '',
      max_uses_per_student: coupon.max_uses_per_student,
      valid_from: coupon.valid_from?.split('T')[0] || '',
      valid_until: coupon.valid_until?.split('T')[0] || '',
      applicable_to_new_students_only: coupon.applicable_to_new_students_only,
      applicable_to_payment_type: coupon.applicable_to_payment_type || 'both',
      applicable_to_utm_source: coupon.applicable_to_utm_source || '',
      applicable_to_utm_code: coupon.applicable_to_utm_code || '',
      applicable_to_country: coupon.applicable_to_country || '',
      applicable_to_city: coupon.applicable_to_city || '',
      applicable_to_installment: coupon.applicable_to_installment || '',
      is_active: coupon.is_active,
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const couponData = {
        coupon_code: formData.coupon_code.toUpperCase().trim(),
        coupon_name: formData.coupon_name.trim(),
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        min_purchase_amount: formData.min_purchase_amount ? Number(formData.min_purchase_amount) : null,
        max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : null,
        max_total_uses: formData.max_total_uses ? Number(formData.max_total_uses) : null,
        max_uses_per_student: formData.max_uses_per_student,
        valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : new Date().toISOString(),
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
        applicable_to_new_students_only: formData.applicable_to_new_students_only,
        applicable_to_payment_type: formData.applicable_to_payment_type || null,
        applicable_to_utm_source: formData.applicable_to_utm_source || null,
        applicable_to_utm_code: formData.applicable_to_utm_code || null,
        applicable_to_country: formData.applicable_to_country || null,
        applicable_to_city: formData.applicable_to_city || null,
        applicable_to_installment: formData.applicable_to_installment || null,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      }

      if (editingCoupon) {
        const { error } = await supabase.from('discount_coupons').update(couponData).eq('id', editingCoupon.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('discount_coupons').insert(couponData)
        if (error) throw error
      }

      setShowForm(false)
      fetchCoupons()
    } catch (err) {
      console.error('Failed to save coupon:', err)
      alert('Failed to save coupon. Please check the data.')
    } finally {
      setSaving(false)
    }
  }

  async function pauseCoupon(coupon: DiscountCoupon) {
    await supabase.from('discount_coupons').update({
      pause_date: new Date().toISOString(),
      is_active: false,
      updated_at: new Date().toISOString(),
    }).eq('id', coupon.id)
    fetchCoupons()
  }

  async function resumeCoupon(coupon: DiscountCoupon) {
    await supabase.from('discount_coupons').update({
      pause_date: null,
      is_active: true,
      updated_at: new Date().toISOString(),
    }).eq('id', coupon.id)
    fetchCoupons()
  }

  async function stopCoupon(coupon: DiscountCoupon) {
    await supabase.from('discount_coupons').update({
      stop_date: new Date().toISOString(),
      is_active: false,
      updated_at: new Date().toISOString(),
    }).eq('id', coupon.id)
    fetchCoupons()
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filteredCoupons = coupons.filter((c) =>
    !searchQuery ||
    c.coupon_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.coupon_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function getStatusBadge(coupon: DiscountCoupon) {
    if (coupon.stop_date) return { label: 'Stopped', color: 'bg-red-600/20 text-red-400' }
    if (coupon.pause_date) return { label: 'Paused', color: 'bg-yellow-600/20 text-yellow-400' }
    if (!coupon.is_active) return { label: 'Inactive', color: 'bg-gray-600/20 text-gray-400' }
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) return { label: 'Expired', color: 'bg-gray-600/20 text-gray-400' }
    return { label: 'Active', color: 'bg-green-600/20 text-green-400' }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Discount Management</h1>
          <p className="text-gray-400 text-sm mt-1">{coupons.length} total coupons</p>
        </div>
        <button onClick={openCreateForm} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Search coupons..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => (<div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse"><div className="h-5 bg-gray-700 rounded w-1/3 mb-2" /><div className="h-4 bg-gray-700 rounded w-1/4" /></div>))}</div>
      ) : (
        <div className="space-y-3">
          {filteredCoupons.map((coupon) => {
            const status = getStatusBadge(coupon)
            return (
              <div key={coupon.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <button onClick={() => copyCode(coupon.coupon_code)} className="flex items-center gap-1 font-mono text-orange-400 text-sm hover:text-orange-300" title="Click to copy">
                        {coupon.coupon_code}
                        {copiedCode === coupon.coupon_code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <span className={`px-2 py-0.5 text-[10px] rounded ${status.color}`}>{status.label}</span>
                      <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-[10px] rounded capitalize">{coupon.discount_type.replace('_', ' ')}</span>
                    </div>
                    <p className="text-white text-sm">{coupon.coupon_name}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `\u20B9${coupon.discount_value.toLocaleString()}`} off
                      </span>
                      <span>Used: {coupon.current_use_count}{coupon.max_total_uses ? `/${coupon.max_total_uses}` : ''}</span>
                      {coupon.applicable_to_utm_source && <span>UTM: {coupon.applicable_to_utm_source}</span>}
                      {coupon.applicable_to_installment && <span>Installment: {coupon.applicable_to_installment}</span>}
                      {coupon.valid_until && <span>Expires: {new Date(coupon.valid_until).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {coupon.is_active && !coupon.stop_date ? (
                      <button onClick={() => pauseCoupon(coupon)} className="p-2 rounded-lg text-yellow-400 hover:bg-gray-700 transition-colors" title="Pause">
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : coupon.pause_date && !coupon.stop_date ? (
                      <button onClick={() => resumeCoupon(coupon)} className="p-2 rounded-lg text-green-400 hover:bg-gray-700 transition-colors" title="Resume">
                        <Play className="w-4 h-4" />
                      </button>
                    ) : null}
                    {!coupon.stop_date && (
                      <button onClick={() => stopCoupon(coupon)} className="p-2 rounded-lg text-red-400 hover:bg-gray-700 transition-colors" title="Stop permanently">
                        <StopCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => openEditForm(coupon)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Coupon Code *</label>
                  <input type="text" value={formData.coupon_code} onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" placeholder="WELCOME10" disabled={!!editingCoupon} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Discount Type *</label>
                  <select value={formData.discount_type} onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount</option>
                    <option value="first_month_free">First Month Free</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Coupon Name *</label>
                <input type="text" value={formData.coupon_name} onChange={(e) => setFormData({ ...formData, coupon_name: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Discount Value *</label>
                  <input type="number" value={formData.discount_value} onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" min={0} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Min Purchase ({'\u20B9'})</label>
                  <input type="number" value={formData.min_purchase_amount} onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" min={0} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Max Discount ({'\u20B9'})</label>
                  <input type="number" value={formData.max_discount_amount} onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" min={0} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Valid From</label>
                  <input type="date" value={formData.valid_from} onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Valid Until</label>
                  <input type="date" value={formData.valid_until} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Payment Type</label>
                  <select value={formData.applicable_to_payment_type} onChange={(e) => setFormData({ ...formData, applicable_to_payment_type: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500">
                    <option value="both">Both</option>
                    <option value="upfront">Upfront Only</option>
                    <option value="monthly">Monthly Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Installment Type</label>
                  <select value={formData.applicable_to_installment} onChange={(e) => setFormData({ ...formData, applicable_to_installment: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500">
                    <option value="">Any</option>
                    <option value="full_payment">Full Payment</option>
                    <option value="1st_installment">1st Installment</option>
                    <option value="2nd_onwards">2nd Onwards</option>
                    <option value="continued_learning">Continued Learning</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">UTM Source</label>
                  <input type="text" value={formData.applicable_to_utm_source} onChange={(e) => setFormData({ ...formData, applicable_to_utm_source: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" placeholder="google, facebook" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Country</label>
                  <input type="text" value={formData.applicable_to_country} onChange={(e) => setFormData({ ...formData, applicable_to_country: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" placeholder="IN, US, etc." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Max Total Uses</label>
                  <input type="number" value={formData.max_total_uses} onChange={(e) => setFormData({ ...formData, max_total_uses: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" min={0} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Max Per Student</label>
                  <input type="number" value={formData.max_uses_per_student} onChange={(e) => setFormData({ ...formData, max_uses_per_student: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500" min={1} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.applicable_to_new_students_only} onChange={(e) => setFormData({ ...formData, applicable_to_new_students_only: e.target.checked })} className="w-4 h-4 rounded accent-orange-500" />
                <span className="text-sm text-gray-300">New students only</span>
              </label>
            </div>
            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !formData.coupon_code || !formData.coupon_name} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white rounded-lg transition-colors">
                {saving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
