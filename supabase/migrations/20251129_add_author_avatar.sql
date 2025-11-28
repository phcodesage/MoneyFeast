-- Add author_avatar column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS author_avatar text;

-- Update existing posts with some default avatars based on author name (optional, but good for immediate visual)
UPDATE posts 
SET author_avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
WHERE author = 'Alexander Rich';

UPDATE posts 
SET author_avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
WHERE author = 'Isabella Voyage';

UPDATE posts 
SET author_avatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
WHERE author = 'Marcus Sterling';

UPDATE posts 
SET author_avatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
WHERE author = 'Satoshi Nakamoto (Fan)';

UPDATE posts 
SET author_avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
WHERE author = 'Sarah Remote';
