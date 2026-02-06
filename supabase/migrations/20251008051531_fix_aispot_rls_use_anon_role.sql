/*
  # Fix AI Spot RLS Policies - Use Anon Role

  1. Changes
    - Drop existing RLS policies that use 'public' role
    - Create new RLS policies using 'anon' role for unauthenticated users
    - Ensure anon users can insert AI Spot applications
    - Ensure anon users can view approved spots
    - Ensure authenticated users (admins) can manage all spots

  2. Security
    - Anon role = unauthenticated users with anon key
    - Authenticated role = logged-in users
    - Maintains strict RLS for data protection
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view approved AI Spots" ON public.aispot_master;
DROP POLICY IF EXISTS "Anyone can submit AI Spot applications" ON public.aispot_master;
DROP POLICY IF EXISTS "Admins can manage all AI Spots" ON public.aispot_master;

-- Create new policies with correct anon role

-- Policy for anon users to view approved AI Spots
CREATE POLICY "Anon can view approved AI Spots"
  ON public.aispot_master
  FOR SELECT
  TO anon
  USING (is_approved = true);

-- Policy for anon users to submit applications
CREATE POLICY "Anon can submit AI Spot applications"
  ON public.aispot_master
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for authenticated users to view approved AI Spots
CREATE POLICY "Authenticated can view approved AI Spots"
  ON public.aispot_master
  FOR SELECT
  TO authenticated
  USING (is_approved = true);

-- Policy for authenticated users (admins) to manage all AI Spots
CREATE POLICY "Admins can manage all AI Spots"
  ON public.aispot_master
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);