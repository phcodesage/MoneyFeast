-- Add missing columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS author text DEFAULT 'Admin',
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS read_time integer DEFAULT 5;

-- Update existing posts to have default values if null
UPDATE posts 
SET author = 'Admin' 
WHERE author IS NULL;

UPDATE posts 
SET read_time = 5 
WHERE read_time IS NULL;
