-- Add avatar_url to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Set a default avatar for the admin (optional, replace with actual admin ID if known, or user can update later)
-- For now, we can't easily target the specific admin without their ID, but we can set a default for all admins
UPDATE profiles 
SET avatar_url = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
WHERE role = 'admin' AND avatar_url IS NULL;
