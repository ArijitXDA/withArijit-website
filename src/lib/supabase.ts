import { createClient } from '@supabase/supabase-js'

// Debug environment variables
console.log('=== ENVIRONMENT VARIABLES DEBUG ===')
console.log('import.meta.env:', import.meta.env)
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY)
console.log('VITE_RAZORPAY_KEY_ID:', import.meta.env.VITE_RAZORPAY_KEY_ID)
console.log('=== END DEBUG ===')

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check for placeholder values or missing environment variables
const isPlaceholderUrl = !supabaseUrl || 
  supabaseUrl.includes('your_') || 
  supabaseUrl === 'your_supabase_url_here' ||
  supabaseUrl.startsWith('http://localhost') ||
  supabaseUrl === ''

const isPlaceholderKey = !supabaseAnonKey || 
  supabaseAnonKey.includes('your_') || 
  supabaseAnonKey === 'your_supabase_anon_key_here' ||
  supabaseAnonKey === ''

if (isPlaceholderUrl || isPlaceholderKey) {
  console.warn('Supabase environment variables not configured properly:', {
    VITE_SUPABASE_URL: supabaseUrl || 'Missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Present' : 'Missing',
    isPlaceholderUrl,
    isPlaceholderKey
  })
  
  // Create a fallback client that won't crash the app
  console.warn('Creating fallback Supabase client - some features may not work')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)

// Types for our custom database tables
export interface Payment {
  id: string
  user_id: string
  name: string
  email: string
  mobile: string
  course: string
  duration: string
  country: string
  currency: string
  payment_id?: string
  payment_date?: string
  payment_time?: string
  amount?: number
  payment_status?: 'pending' | 'success' | 'failed' | 'cancelled'
  razorpay_payment_id?: string
  razorpay_order_id?: string
  payment_method?: string
  failure_reason?: string
  created_at: string
  updated_at?: string
  referred_by_email?: string
  discount_coupon_code?: string
  discount_percentage_availed?: number
  discount_amount_availed?: number
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  mobile: string
  purpose: string
  additional_details?: string
  created_at: string
}