# AIwithArijit Portal Revamp - Implementation Guide
**Date:** February 13, 2026
**Estimated Timeline:** 3-4 weeks

---

## 📋 **Phase 1: Database Setup (Week 1 - Days 1-2)**

### Step 1: Apply Database Migrations

**⚠️ CRITICAL: Backup your database before proceeding!**

1. **Go to Supabase SQL Editor:**
   - Navigate to: https://supabase.com/dashboard/project/enszifyeqnwcnxaqrmrq/sql/new

2. **Run Schema Migration:**
   - Open file: `supabase/migrations/20260213_revamp_v2_schema.sql`
   - Copy entire content
   - Paste into SQL Editor
   - Click **"Run"**
   - ✅ Verify: Should see "Success" message

3. **Run Seed Data:**
   - Open file: `supabase/migrations/20260213_seed_initial_data.sql`
   - Copy entire content
   - Paste into SQL Editor
   - Click **"Run"**
   - ✅ Verify: Should see summary with counts

4. **Verify Tables Created:**
   ```sql
   -- Run this query to verify
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name LIKE '%_v2' OR table_name IN ('discount_coupons', 'coupon_usage_log', 'ai_chat_history', 'ai_chat_limits', 'parent_student_relationship', 'study_materials_v2')
   ORDER BY table_name;
   ```

   ✅ **Expected Result:** Should show 11 new tables:
   - ai_chat_history
   - ai_chat_limits
   - batches_v2
   - coupon_usage_log
   - courses_v2
   - discount_coupons
   - parent_student_relationship
   - payments_v2
   - pricing_rules_v2
   - student_enrollments_v2
   - study_materials_v2

5. **Verify Seed Data:**
   ```sql
   -- Check courses created
   SELECT course_code, course_name, monthly_price FROM courses_v2;

   -- Check Batch #101 created
   SELECT batch_code, batch_name FROM batches_v2 WHERE batch_code = 'BATCH101';

   -- Check AI chat limits
   SELECT user_type, daily_message_limit FROM ai_chat_limits;

   -- Check discount coupons
   SELECT coupon_code, coupon_name FROM discount_coupons;
   ```

---

## 📋 **Phase 2: OAuth Configuration (Week 1 - Days 3-4)**

### Step 2: Enable OAuth Providers in Supabase

1. **Go to Supabase Authentication Settings:**
   - Navigate to: https://supabase.com/dashboard/project/enszifyeqnwcnxaqrmrq/auth/providers

2. **Enable Google OAuth:**
   - Click on "Google"
   - Enable toggle
   - You'll need to create a Google OAuth app:
     - Go to: https://console.cloud.google.com/apis/credentials
     - Create OAuth 2.0 Client ID
     - Add redirect URL: `https://enszifyeqnwcnxaqrmrq.supabase.co/auth/v1/callback`
     - Copy Client ID and Client Secret
     - Paste in Supabase

3. **Enable GitHub OAuth:**
   - Click on "GitHub"
   - Create GitHub OAuth app:
     - Go to: https://github.com/settings/developers
     - New OAuth App
     - Callback URL: `https://enszifyeqnwcnxaqrmrq.supabase.co/auth/v1/callback`
     - Copy Client ID and Client Secret

4. **Enable Microsoft OAuth:**
   - Click on "Microsoft" (Azure)
   - Create app in Azure Portal
   - Add redirect URI
   - Copy Application ID and Client Secret

5. **Enable Apple OAuth:**
   - Click on "Apple"
   - Create Service ID in Apple Developer Portal
   - Configure Sign in with Apple
   - Add return URL

6. **Enable Meta (Facebook) OAuth:**
   - Click on "Facebook"
   - Create app in Facebook Developers
   - Add redirect URL
   - Copy App ID and App Secret

### Step 3: Update Frontend Auth Config

**File:** `src/lib/supabase.ts`

Add after the existing client initialization:

```typescript
// OAuth configuration
export const oauthProviders = [
  { name: 'Google', provider: 'google' as const },
  { name: 'GitHub', provider: 'github' as const },
  { name: 'Microsoft', provider: 'azure' as const },
  { name: 'Apple', provider: 'apple' as const },
  { name: 'Facebook', provider: 'facebook' as const },
];

// Sign in with OAuth
export async function signInWithOAuth(provider: 'google' | 'github' | 'azure' | 'apple' | 'facebook') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}
```

---

## 📋 **Phase 3: Frontend Development (Week 1-2)**

### Step 4: Create New Course Listing Page

**File:** `src/pages/CoursesV2.tsx`

```tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  target_audience: string;
  monthly_price: number;
  full_course_price: number;
  upfront_final_price: number;
  upfront_discount_percent: number;
  description: string;
}

export default function CoursesV2() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const { data, error } = await supabase
      .from('courses_v2')
      .select('*')
      .eq('is_active', true)
      .eq('is_visible', true)
      .order('display_order');

    if (error) {
      console.error('Error loading courses:', error);
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Courses</h1>

      {loading ? (
        <div>Loading courses...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition">
      <div className="mb-4">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {course.target_audience}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2">{course.course_name}</h3>
      <p className="text-gray-600 mb-4">{course.description}</p>

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">Monthly Payment</div>
        <div className="text-2xl font-bold">₹{course.monthly_price.toLocaleString()}/mo</div>
        <div className="text-sm text-gray-500">for 6 months</div>
      </div>

      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <div className="text-sm text-gray-500 mb-1">Upfront Payment</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-green-600">
            ₹{course.upfront_final_price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ₹{course.full_course_price.toLocaleString()}
          </span>
        </div>
        <div className="text-sm text-green-600 font-semibold">
          Save {course.upfront_discount_percent}%
        </div>
      </div>

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
        Enroll Now
      </button>
    </div>
  );
}
```

### Step 5: Create AI Chat Component

**File:** `src/components/AIChat.tsx`

```tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  message: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', message: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Save user message to database
      const user = (await supabase.auth.getUser()).data.user;
      await supabase.from('ai_chat_history').insert({
        user_email: user?.email,
        session_id: sessionId,
        role: 'user',
        message: input,
        enrollment_type: 'free' // TODO: Get from user's enrollment
      });

      // Call OpenAI via Supabase Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            message: input,
            session_id: sessionId
          })
        }
      );

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', message: data.response };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-[600px] border rounded-lg">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold">AI Learning Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything about AI..."
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 6: Create Admin Module Panel

**File:** `src/pages/admin/AdminDashboard.tsx`

```tsx
import { Link, Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  const adminModules = [
    { name: 'Courses', path: '/admin/courses', icon: '📚' },
    { name: 'Batches', path: '/admin/batches', icon: '👥' },
    { name: 'Discount Coupons', path: '/admin/coupons', icon: '🎟️' },
    { name: 'Students', path: '/admin/students', icon: '🎓' },
    { name: 'Payments', path: '/admin/payments', icon: '💳' },
    { name: 'AI Chat Limits', path: '/admin/ai-limits', icon: '🤖' },
    { name: 'Study Materials', path: '/admin/materials', icon: '📖' },
    { name: 'Analytics', path: '/admin/analytics', icon: '📊' },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-2">
          {adminModules.map((module) => (
            <Link
              key={module.path}
              to={module.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              <span className="text-2xl">{module.icon}</span>
              <span>{module.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <Outlet />
      </div>
    </div>
  );
}
```

---

## 📋 **Phase 4: Backend Edge Functions (Week 2)**

### Step 7: Create AI Chat Edge Function

**File:** `supabase/functions/ai-chat/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, session_id } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Check rate limits
    const { data: enrollment } = await supabase
      .from("student_enrollments_v2")
      .select("enrollment_type")
      .eq("student_email", user.email)
      .single();

    const userType = enrollment?.enrollment_type || 'free';

    // Call OpenAI API
    const openaiKey = Deno.env.get("OPENAI_API_KEY")!;
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI learning assistant for AIwithArijit portal. Help students with AI, Python, and Data Science questions."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500
      })
    });

    const openaiData = await openaiResponse.json();
    const assistantMessage = openaiData.choices[0].message.content;

    // Save assistant response to database
    await supabase.from("ai_chat_history").insert({
      user_email: user.email,
      session_id,
      role: "assistant",
      message: assistantMessage,
      openai_model: "gpt-4",
      tokens_used: openaiData.usage.total_tokens,
      enrollment_type: userType
    });

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

**Deploy:**
```bash
supabase functions deploy ai-chat
```

---

## 📋 **Phase 5: Testing & Deployment (Week 3-4)**

### Step 8: Test Complete User Flow

1. **Test Free User Flow:**
   - Sign up with email/OAuth
   - Auto-assigned to Batch #101
   - Access free study materials
   - Use AI chat (within limits)

2. **Test Payment Flow:**
   - Select course
   - Apply discount coupon
   - Pay upfront (7% discount) or monthly
   - Select batch after payment
   - Access paid content

3. **Test Admin Flow:**
   - Create discount coupon
   - Manage courses
   - View student enrollments
   - Adjust AI chat limits
   - Upload study materials

### Step 9: Deploy to Production

1. **Commit all changes to git**
2. **Push to GitHub**
3. **Netlify auto-deploy**
4. **Monitor deployment logs**
5. **Test on production URL**

---

## 🎯 **Success Criteria**

- ✅ All 11 new tables created successfully
- ✅ 4 new courses visible on website
- ✅ Batch #101 auto-assignment working
- ✅ OAuth providers functional
- ✅ AI chat working with rate limits
- ✅ Discount coupons applying correctly
- ✅ Multi-currency pricing displaying
- ✅ Admin panel accessible
- ✅ Existing students unaffected

---

## 📞 **Next Steps**

**Please proceed with:**
1. Apply database migrations (Phase 1)
2. Report back with results
3. We'll continue with OAuth setup (Phase 2)
