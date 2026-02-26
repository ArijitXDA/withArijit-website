// =====================================================
// Group Invite Edge Function
// =====================================================
// Sends signup invite emails to group booking members.
// Triggered after entity completes group booking payment
// and submits the member email list.

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
    const { group_booking_id } = body

    if (!group_booking_id) {
      return new Response(
        JSON.stringify({ error: 'group_booking_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch group booking with course name via join
    const { data: booking, error: bookingError } = await supabase
      .from('group_bookings')
      .select(`
        *,
        course:courses_v2(course_name, course_code)
      `)
      .eq('id', group_booking_id)
      .single()

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Group booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Resolve course name (from joined course, fallback to graceful default)
    const courseName =
      (booking.course as { course_name?: string } | null)?.course_name ||
      'AI Course with Arijit'

    // Fetch members who haven't received invites yet
    const { data: members, error: membersError } = await supabase
      .from('group_booking_members')
      .select('*')
      .eq('group_booking_id', group_booking_id)
      .eq('invite_sent', false)

    if (membersError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch members' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!members || members.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending invites to send' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const siteUrl = Deno.env.get('SITE_URL') || 'https://www.AIwithArijit.com'
    const invitesSent: string[] = []
    const invitesFailed: string[] = []

    for (const member of members) {
      try {
        const signupUrl = `${siteUrl}/group-booking/signup/${booking.invite_token}`

        // Send invite email via send-email function
        const { error: emailError } = await supabase.functions.invoke('send-email', {
          body: {
            template_code: 'GROUP_INVITE',
            recipient_email: member.member_email,
            recipient_name: member.member_name || member.member_email.split('@')[0],
            variables: {
              entity_name: booking.entity_name,
              organization: booking.entity_organization || booking.entity_name,
              signup_url: signupUrl,
              course_name: courseName,
              seat_count: booking.total_seats,
            },
            triggered_by: 'group-invite',
            related_entity_type: 'group_booking',
            related_entity_id: group_booking_id,
          },
        })

        if (emailError) {
          console.error(`Email error for ${member.member_email}:`, emailError)
          invitesFailed.push(member.member_email)
          continue
        }

        // Mark member as invite sent
        await supabase
          .from('group_booking_members')
          .update({
            invite_sent: true,
            invite_sent_at: new Date().toISOString(),
          })
          .eq('id', member.id)

        invitesSent.push(member.member_email)
      } catch (err) {
        console.error(`Failed to send invite to ${member.member_email}:`, err)
        invitesFailed.push(member.member_email)
      }
    }

    // Update booking status to 'invites_sent' if all invites were dispatched
    if (invitesFailed.length === 0) {
      await supabase
        .from('group_bookings')
        .update({ booking_status: 'invites_sent' })
        .eq('id', group_booking_id)
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_members: members.length,
        invites_sent: invitesSent.length,
        invites_failed: invitesFailed.length,
        sent_to: invitesSent,
        failed_for: invitesFailed,
        course_name: courseName,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Group invite error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
