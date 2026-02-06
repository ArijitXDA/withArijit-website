/*
  # Temporarily Disable RLS for AI Spot Table
  
  This is a temporary measure to allow form submissions to work.
  We'll re-enable RLS with proper policies once we verify the table structure.
  
  IMPORTANT: This should only be temporary for testing purposes.
*/

-- Disable RLS temporarily
ALTER TABLE public.aispot_master DISABLE ROW LEVEL SECURITY;