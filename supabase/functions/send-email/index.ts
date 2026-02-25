// =====================================================
// Send Email Edge Function
// =====================================================
// Provider-agnostic email sending via templates.
// Reads template from email_templates, interpolates variables,
// logs to email_send_log. Initially queues (SMTP details to come later).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json()
    const {
      template_code,
      recipient_email,
      recipient_name,
      variables = {},
      triggered_by = null,
      related_entity_type = null,
      related_entity_id = null,
    } = body

    if (!template_code || !recipient_email) {
      return new Response(
        JSON.stringify({ error: 'template_code and recipient_email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_code', template_code)
      .eq('is_active', true)
      .single()

    if (templateError || !template) {
      return new Response(
        JSON.stringify({ error: `Template '${template_code}' not found or inactive` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Interpolate variables in subject and body
    let subject = template.subject
    let bodyHtml = template.body_html
    let bodyText = template.body_text || ''

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      const val = String(value)
      subject = subject.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), val)
      bodyHtml = bodyHtml.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), val)
      bodyText = bodyText.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), val)
    }

    // Create email send log entry
    const { data: logEntry, error: logError } = await supabase
      .from('email_send_log')
      .insert({
        template_id: template.id,
        template_code: template_code,
        recipient_email,
        recipient_name: recipient_name || null,
        subject,
        body_preview: bodyText.substring(0, 200) || bodyHtml.substring(0, 200).replace(/<[^>]*>/g, ''),
        template_variables: variables,
        status: 'queued',
        triggered_by,
        related_entity_type,
        related_entity_id,
        queued_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (logError) {
      console.error('Failed to create email log:', logError)
    }

    // =====================================================
    // SMTP Integration (to be configured later)
    // =====================================================
    // When SMTP is configured, uncomment and modify:
    //
    // const smtpHost = Deno.env.get('SMTP_HOST')
    // const smtpPort = Deno.env.get('SMTP_PORT')
    // const smtpUser = Deno.env.get('SMTP_USER')
    // const smtpPass = Deno.env.get('SMTP_PASS')
    // const smtpFrom = Deno.env.get('SMTP_FROM') || 'AI@withArijit.com'
    //
    // if (smtpHost && smtpUser && smtpPass) {
    //   try {
    //     // Send email via SMTP
    //     // Update log status to 'sent'
    //     await supabase
    //       .from('email_send_log')
    //       .update({ status: 'sent', sent_at: new Date().toISOString() })
    //       .eq('id', logEntry.id)
    //   } catch (sendError) {
    //     await supabase
    //       .from('email_send_log')
    //       .update({ status: 'failed', failed_at: new Date().toISOString(), error_message: sendError.message })
    //       .eq('id', logEntry.id)
    //   }
    // }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email queued successfully',
        log_id: logEntry?.id || null,
        note: 'SMTP not yet configured - email logged but not sent',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Send email error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
