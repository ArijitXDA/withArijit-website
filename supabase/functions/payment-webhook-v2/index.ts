// =====================================================
// Payment Webhook V2 Edge Function
// =====================================================
// Handles Razorpay webhook callbacks for V2 payments.
// Updates payments_v2, creates/updates student_enrollments_v2,
// logs coupon usage, triggers email notifications.
// Does NOT touch legacy tables (payments, student_master_table).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.208.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const razorpayWebhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    // Verify webhook signature if secret is configured
    if (razorpayWebhookSecret && signature) {
      const encoder = new TextEncoder()
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(razorpayWebhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
      const expectedSignature = Array.from(new Uint8Array(sig))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      if (expectedSignature !== signature) {
        console.error('Invalid webhook signature')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    const payload = JSON.parse(body)
    const event = payload.event
    const paymentEntity = payload.payload?.payment?.entity

    if (!paymentEntity) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Only process V2 payments (check notes for payment_version)
    const notes = paymentEntity.notes || {}
    if (notes.payment_version !== 'v2') {
      // Not a V2 payment - ignore (let legacy webhook handle it)
      return new Response(
        JSON.stringify({ message: 'Not a V2 payment, skipping' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const referenceId = notes.reference_id
    const courseId = notes.course_id
    const email = notes.email

    if (!referenceId) {
      return new Response(
        JSON.stringify({ error: 'Missing reference_id in notes' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle different webhook events
    switch (event) {
      case 'payment.captured': {
        // Update payment record
        await supabase
          .from('payments_v2')
          .update({
            razorpay_payment_id: paymentEntity.id,
            razorpay_order_id: paymentEntity.order_id,
            payment_status: 'completed',
            payment_method: paymentEntity.method || null,
            payment_date: new Date().toISOString(),
          })
          .eq('id', referenceId)

        // Get payment details
        const { data: payment } = await supabase
          .from('payments_v2')
          .select('*')
          .eq('id', referenceId)
          .single()

        if (payment && email && courseId) {
          // Create or update enrollment
          const { data: existingEnrollment } = await supabase
            .from('student_enrollments_v2')
            .select('id')
            .eq('student_email', email.toLowerCase())
            .eq('course_id', courseId)
            .single()

          if (existingEnrollment) {
            // Update existing enrollment
            await supabase
              .from('student_enrollments_v2')
              .update({
                payment_status: 'completed',
                total_amount_paid: payment.final_amount,
                enrollment_status: 'active',
                utm_source: notes.utm_source || null,
                utm_medium: notes.utm_medium || null,
                utm_campaign: notes.utm_campaign || null,
              })
              .eq('id', existingEnrollment.id)
          } else {
            // Create new enrollment
            await supabase.from('student_enrollments_v2').insert({
              student_email: email.toLowerCase(),
              course_id: courseId,
              enrollment_type: 'paid',
              payment_type: payment.payment_type,
              payment_status: 'completed',
              total_amount_paid: payment.final_amount,
              currency: payment.currency || 'INR',
              enrollment_status: 'active',
              utm_source: notes.utm_source || null,
              utm_medium: notes.utm_medium || null,
              utm_campaign: notes.utm_campaign || null,
            })
          }

          // Log coupon usage if applicable
          if (payment.coupon_id && payment.coupon_code) {
            await supabase.from('coupon_usage_log').insert({
              coupon_id: payment.coupon_id,
              student_email: email.toLowerCase(),
              payment_id: referenceId,
              discount_amount: payment.discount_amount,
              original_amount: payment.original_amount,
              final_amount: payment.final_amount,
            })
          }

          // Trigger payment success email
          try {
            await supabase.functions.invoke('send-email', {
              body: {
                template_code: 'PAYMENT_SUCCESS',
                recipient_email: email,
                variables: {
                  student_name: email.split('@')[0],
                  course_name: notes.course || 'AI Course',
                  amount: payment.final_amount.toString(),
                  payment_id: paymentEntity.id,
                },
                triggered_by: 'payment-webhook-v2',
                related_entity_type: 'payment',
                related_entity_id: referenceId,
              },
            })
          } catch (emailErr) {
            console.error('Failed to send payment email:', emailErr)
          }
        }

        break
      }

      case 'payment.failed': {
        await supabase
          .from('payments_v2')
          .update({
            razorpay_payment_id: paymentEntity.id,
            payment_status: 'failed',
            failure_reason: paymentEntity.error_description || 'Payment failed',
          })
          .eq('id', referenceId)

        break
      }

      case 'refund.created': {
        await supabase
          .from('payments_v2')
          .update({
            payment_status: 'refunded',
          })
          .eq('razorpay_payment_id', paymentEntity.payment_id)

        break
      }

      default:
        console.log(`Unhandled webhook event: ${event}`)
    }

    return new Response(
      JSON.stringify({ success: true, event }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Payment webhook V2 error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
