// =====================================================
// AI Chat Edge Function - oStaran
// =====================================================
// Handles chat messages for the oStaran AI assistant.
// Authenticates user, checks enrollment type, enforces rate limits,
// calls OpenAI API, saves conversation history.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

const SYSTEM_PROMPT = `You are oStaran, the AI Teaching Assistant for AIwithArijit.com — a premier AI education platform run by Arijit Chowdhury.

Your role:
- Help students understand AI concepts (machine learning, deep learning, NLP, computer vision, etc.)
- Assist with course-related questions about Agentic AI, Vibe Coding, Python for ML, certifications
- Provide career guidance in AI/tech
- Explain code concepts and help debug learning exercises
- Be encouraging, patient, and thorough in explanations

Guidelines:
- Always be professional, friendly, and supportive
- If asked about pricing or enrollment, direct them to the courses page or payment portal
- If asked something outside your scope, politely redirect
- Keep responses concise but informative (under 500 words unless a detailed explanation is needed)
- Use simple language accessible to beginners while being technically accurate
- When giving code examples, use proper formatting
- Never share personal information about instructors or students`

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openaiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with user's auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body = await req.json()
    const { message, session_id, history = [] } = body

    if (!message || typeof message !== 'string' || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Invalid message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role client for DB operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check enrollment type for rate limits and model selection
    const { data: enrollment } = await supabaseAdmin
      .from('student_enrollments_v2')
      .select('enrollment_type, enrollment_status')
      .eq('student_email', user.email)
      .eq('enrollment_status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const enrollmentType = enrollment?.enrollment_type || 'free'
    const isPaid = enrollmentType === 'paid' || enrollmentType === 'group'

    // Check rate limits
    const { data: chatLimit } = await supabaseAdmin
      .from('ai_chat_limits')
      .select('daily_message_limit, monthly_message_limit')
      .eq('user_type', isPaid ? 'paid' : 'free')
      .eq('is_active', true)
      .single()

    // Count today's messages
    const today = new Date().toISOString().split('T')[0]
    const { count: todayCount } = await supabaseAdmin
      .from('ai_chat_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_email', user.email)
      .eq('role', 'user')
      .gte('created_at', `${today}T00:00:00.000Z`)

    const dailyLimit = chatLimit?.daily_message_limit || (isPaid ? 50 : 10)
    const currentCount = todayCount || 0

    if (currentCount >= dailyLimit) {
      return new Response(
        JSON.stringify({
          error: 'Daily message limit reached',
          message: `You've reached your daily limit of ${dailyLimit} messages. ${
            isPaid
              ? 'Limits will reset at midnight.'
              : 'Upgrade to a paid course for higher limits.'
          }`,
          remaining_messages: 0,
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Select model based on enrollment type
    const model = isPaid ? 'gpt-4o' : 'gpt-4o-mini'

    // Build messages for OpenAI
    const openaiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-8).map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: message },
    ]

    // Call OpenAI
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: openaiMessages,
        max_tokens: isPaid ? 1000 : 500,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiData = await openaiResponse.json()
    const assistantMessage = openaiData.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'
    const tokensUsed = openaiData.usage?.total_tokens || 0

    // Save conversation to history
    const chatSessionId = session_id || `session_${crypto.randomUUID()}`

    await supabaseAdmin.from('ai_chat_history').insert([
      {
        user_email: user.email,
        session_id: chatSessionId,
        role: 'user',
        message: message,
        openai_model: model,
        tokens_used: null,
        enrollment_type: enrollmentType,
      },
      {
        user_email: user.email,
        session_id: chatSessionId,
        role: 'assistant',
        message: assistantMessage,
        openai_model: model,
        tokens_used: tokensUsed,
        enrollment_type: enrollmentType,
      },
    ])

    const remainingMessages = Math.max(dailyLimit - currentCount - 1, 0)

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        model,
        tokens_used: tokensUsed,
        remaining_messages: remainingMessages,
        session_id: chatSessionId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('AI Chat error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
