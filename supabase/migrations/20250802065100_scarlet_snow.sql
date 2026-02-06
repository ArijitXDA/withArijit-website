/*
  # Temporarily disable RLS on users table

  This will help identify if there's a trigger or function automatically
  inserting into the users table during Supabase Auth signup.
*/

-- Temporarily disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;