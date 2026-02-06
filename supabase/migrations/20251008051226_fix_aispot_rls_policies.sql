/*
  # Fix AI Spot RLS Policies

  1. Changes
    - Drop existing RLS policies that reference uppercase column names
    - Create new RLS policies using correct lowercase column names
    - Ensure public can insert AI Spot applications
    - Ensure public can view approved spots
    - Ensure authenticated users (admins) can manage all spots

  2. Security
    - Maintains strict RLS for data protection
    - Allows anonymous users to submit applications
    - Restricts public view to approved spots only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view approved AI Spots" ON public.aispot_master;
DROP POLICY IF EXISTS "Anyone can submit AI Spot applications" ON public.aispot_master;
DROP POLICY IF EXISTS "Admins can manage all AI Spots" ON public.aispot_master;

-- Create new policies with correct lowercase column references

-- Policy for public to view approved AI Spots
CREATE POLICY "Public can view approved AI Spots"
  ON public.aispot_master
  FOR SELECT
  TO public
  USING (is_approved = true);

-- Policy for anyone (including anonymous) to submit applications
CREATE POLICY "Anyone can submit AI Spot applications"
  ON public.aispot_master
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy for authenticated users (admins) to manage all AI Spots
CREATE POLICY "Admins can manage all AI Spots"
  ON public.aispot_master
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);