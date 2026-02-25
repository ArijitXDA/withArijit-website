// =====================================================
// Admin Auth Edge Function
// Separate credential system - independent of Supabase Auth
// Verifies admin username/password against admin_users table
// =====================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginRequest {
  action: 'login' | 'verify' | 'change-password'
  username?: string
  password?: string
  token?: string
  newPassword?: string
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Use service role to bypass RLS on admin_users table
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const body: LoginRequest = await req.json()

    switch (body.action) {
      case 'login':
        return await handleLogin(supabase, body)
      case 'verify':
        return await handleVerify(supabase, body)
      case 'change-password':
        return await handleChangePassword(supabase, body)
      default:
        return jsonResponse({ success: false, error: 'Invalid action' }, 400)
    }
  } catch (error) {
    return jsonResponse(
      { success: false, error: error instanceof Error ? error.message : 'Internal error' },
      500
    )
  }
})

async function handleLogin(supabase: any, body: LoginRequest) {
  const { username, password } = body

  if (!username || !password) {
    return jsonResponse({ success: false, error: 'Username and password required' }, 400)
  }

  // Fetch admin user by username
  const { data: admin, error: fetchError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username.toLowerCase().trim())
    .eq('is_active', true)
    .single()

  if (fetchError || !admin) {
    // Don't reveal whether username exists
    return jsonResponse({ success: false, error: 'Invalid credentials' }, 401)
  }

  // Check if account is locked
  if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
    return jsonResponse(
      { success: false, error: 'Account is temporarily locked. Try again later.' },
      403
    )
  }

  // Verify password with bcrypt
  const passwordValid = await bcrypt.compare(password, admin.password_hash)

  if (!passwordValid) {
    // Increment failed login count
    const failedCount = (admin.failed_login_count || 0) + 1
    const updateFields: any = { failed_login_count: failedCount }

    // Lock account after 5 failed attempts (30 min lockout)
    if (failedCount >= 5) {
      updateFields.locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString()
    }

    await supabase.from('admin_users').update(updateFields).eq('id', admin.id)

    return jsonResponse({ success: false, error: 'Invalid credentials' }, 401)
  }

  // Successful login - reset failed count, update last login
  await supabase
    .from('admin_users')
    .update({
      last_login_at: new Date().toISOString(),
      login_count: (admin.login_count || 0) + 1,
      failed_login_count: 0,
      locked_until: null,
    })
    .eq('id', admin.id)

  // Generate a simple session token (in production, use JWT)
  const token = crypto.randomUUID()

  // Return admin data (without password_hash)
  const { password_hash: _, ...safeAdmin } = admin

  return jsonResponse({
    success: true,
    admin: safeAdmin,
    token,
  })
}

async function handleVerify(supabase: any, body: LoginRequest) {
  // Simple token verification - in production, verify JWT
  const { token } = body

  if (!token) {
    return jsonResponse({ success: false, error: 'Token required' }, 400)
  }

  // For now, tokens are session-based (stored client-side)
  // In a full implementation, we'd store and verify tokens server-side
  return jsonResponse({ success: true })
}

async function handleChangePassword(supabase: any, body: LoginRequest) {
  const { username, password, newPassword } = body

  if (!username || !password || !newPassword) {
    return jsonResponse(
      { success: false, error: 'Username, current password, and new password required' },
      400
    )
  }

  // Verify current credentials
  const { data: admin, error: fetchError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username.toLowerCase().trim())
    .eq('is_active', true)
    .single()

  if (fetchError || !admin) {
    return jsonResponse({ success: false, error: 'Invalid credentials' }, 401)
  }

  const passwordValid = await bcrypt.compare(password, admin.password_hash)
  if (!passwordValid) {
    return jsonResponse({ success: false, error: 'Current password is incorrect' }, 401)
  }

  // Hash new password
  const newHash = await bcrypt.hash(newPassword)

  await supabase
    .from('admin_users')
    .update({
      password_hash: newHash,
      updated_at: new Date().toISOString(),
    })
    .eq('id', admin.id)

  return jsonResponse({ success: true, message: 'Password changed successfully' })
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
