/*
  # Create Staran's eBook Library Table

  1. New Tables
    - `library`
      - `id` (uuid, primary key)
      - `publication_type` (text) - Book/Article/Project/GitHub/Newsletter/Other
      - `category` (text) - Category within publication type
      - `title` (text) - Title of the content
      - `author_team` (text) - Author(s) or team
      - `level` (text) - Beginner/Intermediate/Advanced/Non-tech/Manager
      - `pages` (integer, nullable) - Number of pages for PDFs
      - `file_size_mb` (numeric, nullable) - File size in MB
      - `rating` (numeric, nullable) - Rating/score
      - `url` (text) - Direct link to content
      - `publication_date` (text) - YYYY-MM-DD or YYYY format
      - `license_source` (text) - License/source information
      - `tags` (text array) - Comma-separated tags
      - `contributor` (text) - Arijit/StudentName/External
      - `verified` (boolean) - Content verification status
      - `access` (text) - Access level (Anyone/Signed Up User/Enrolled Student/Private)
      - `thumbnail_url` (text, nullable) - Cover preview image
      - `github_repo` (text, nullable) - GitHub repository link
      - `demo_url` (text, nullable) - Live demo URL
      - `update_date` (timestamp) - Last update date
      - `notes` (text, nullable) - Admin/internal notes
      - `created_at` (timestamp) - Creation timestamp

  2. Security
    - Enable RLS on `library` table
    - Add policies for public read access and admin management
    
  3. Indexes
    - Add indexes for efficient querying by publication_type, category, and update_date
</*/

CREATE TABLE IF NOT EXISTS library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_type text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  author_team text NOT NULL,
  level text NOT NULL,
  pages integer,
  file_size_mb numeric,
  rating numeric,
  url text NOT NULL,
  publication_date text NOT NULL,
  license_source text NOT NULL,
  tags text[] DEFAULT '{}',
  contributor text NOT NULL,
  verified boolean DEFAULT false,
  access text NOT NULL DEFAULT 'Anyone',
  thumbnail_url text,
  github_repo text,
  demo_url text,
  update_date timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE library ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view library content"
  ON library
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage library content"
  ON library
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_library_publication_type ON library(publication_type);
CREATE INDEX IF NOT EXISTS idx_library_category ON library(category);
CREATE INDEX IF NOT EXISTS idx_library_update_date ON library(update_date DESC);
CREATE INDEX IF NOT EXISTS idx_library_access ON library(access);
CREATE INDEX IF NOT EXISTS idx_library_verified ON library(verified);
CREATE INDEX IF NOT EXISTS idx_library_publication_type_category ON library(publication_type, category);

-- Create trigger for updating update_date
CREATE OR REPLACE FUNCTION update_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.update_date = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_library_updated_at
  BEFORE UPDATE ON library
  FOR EACH ROW
  EXECUTE FUNCTION update_library_updated_at();