-- Add author column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS author text DEFAULT 'Admin';

-- Update existing posts to have a default author if null
UPDATE posts 
SET author = 'Admin' 
WHERE author IS NULL;
