-- =====================================================
-- MoneyFeast Complete CMS Schema Migration
-- =====================================================
-- This migration creates all tables, policies, and functions
-- for a complete content management system
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  icon text DEFAULT 'briefcase',
  color text DEFAULT '#10b981',
  post_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. USER PROFILES TABLE (Writer/Admin Profiles)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  display_name text,
  avatar_url text,
  bio text,
  role text DEFAULT 'writer' CHECK (role IN ('admin', 'editor', 'writer')),
  is_active boolean DEFAULT true,
  post_count integer DEFAULT 0,
  social_links jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  author_name text DEFAULT 'MoneyFeast Team',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  featured_image_url text,
  meta_title text,
  meta_description text,
  tags text[] DEFAULT '{}',
  read_time integer DEFAULT 5,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- =====================================================
-- 4. NEWSLETTER SUBSCRIBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  subscribed_at timestamptz DEFAULT now(),
  active boolean DEFAULT true,
  confirmed boolean DEFAULT false,
  confirmation_token text,
  unsubscribe_token text DEFAULT gen_random_uuid()::text,
  metadata jsonb DEFAULT '{}'
);

-- =====================================================
-- 5. COMMENTS TABLE (Optional - for future use)
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 6. MEDIA LIBRARY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_path text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  mime_type text,
  width integer,
  height integer,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  alt_text text,
  caption text,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 7. POST REVISIONS TABLE (Version History)
-- =====================================================
CREATE TABLE IF NOT EXISTS post_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  excerpt text,
  revised_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 8. ACTIVITY LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Newsletter indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(active);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);

-- Media indexes
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);

-- Activity log indexes
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_log(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CATEGORIES POLICIES
-- =====================================================

-- Public read access
CREATE POLICY "Public can read categories"
ON categories FOR SELECT
USING (true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can insert categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
ON categories FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete categories"
ON categories FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Public can read active profiles
CREATE POLICY "Public can read active profiles"
ON profiles FOR SELECT
USING (is_active = true);

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage profiles"
ON profiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- POSTS POLICIES
-- =====================================================

-- Public can read published posts
CREATE POLICY "Public can read published posts"
ON posts FOR SELECT
USING (published = true);

-- Authenticated users can read all posts
CREATE POLICY "Authenticated users can read all posts"
ON posts FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can insert posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
ON posts FOR UPDATE
TO authenticated
USING (author_id = auth.uid());

-- Admins and editors can update all posts
CREATE POLICY "Admins and editors can update all posts"
ON posts FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- Authors can delete their own posts
CREATE POLICY "Authors can delete own posts"
ON posts FOR DELETE
TO authenticated
USING (author_id = auth.uid());

-- Admins can delete all posts
CREATE POLICY "Admins can delete all posts"
ON posts FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- NEWSLETTER POLICIES
-- =====================================================

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
ON newsletter_subscribers FOR INSERT
WITH CHECK (true);

-- Authenticated users can read subscribers
CREATE POLICY "Authenticated users can read subscribers"
ON newsletter_subscribers FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can update subscribers
CREATE POLICY "Authenticated users can update subscribers"
ON newsletter_subscribers FOR UPDATE
TO authenticated
USING (true);

-- =====================================================
-- COMMENTS POLICIES
-- =====================================================

-- Public can read approved comments
CREATE POLICY "Public can read approved comments"
ON comments FOR SELECT
USING (approved = true);

-- Anyone can insert comments
CREATE POLICY "Anyone can insert comments"
ON comments FOR INSERT
WITH CHECK (true);

-- Authenticated users can approve/manage comments
CREATE POLICY "Authenticated users can manage comments"
ON comments FOR ALL
TO authenticated
USING (true);

-- =====================================================
-- MEDIA POLICIES
-- =====================================================

-- Public can read media
CREATE POLICY "Public can read media"
ON media FOR SELECT
USING (true);

-- Authenticated users can upload media
CREATE POLICY "Authenticated users can upload media"
ON media FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can update their own uploads
CREATE POLICY "Users can update own media"
ON media FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid());

-- Admins can delete media
CREATE POLICY "Admins can delete media"
ON media FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- POST REVISIONS POLICIES
-- =====================================================

-- Authenticated users can read revisions
CREATE POLICY "Authenticated users can read revisions"
ON post_revisions FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can create revisions
CREATE POLICY "Authenticated users can create revisions"
ON post_revisions FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- ACTIVITY LOG POLICIES
-- =====================================================

-- Authenticated users can read activity log
CREATE POLICY "Authenticated users can read activity log"
ON activity_log FOR SELECT
TO authenticated
USING (true);

-- System can insert activity log
CREATE POLICY "System can insert activity log"
ON activity_log FOR INSERT
WITH CHECK (true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update category post count
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.published = true THEN
    UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.published = false AND NEW.published = true THEN
      UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
    ELSIF OLD.published = true AND NEW.published = false THEN
      UPDATE categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
    END IF;
    IF OLD.category_id != NEW.category_id AND NEW.published = true THEN
      UPDATE categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
      UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.published = true THEN
    UPDATE categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for category post count
CREATE TRIGGER update_category_count
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_category_post_count();

-- Function to update profile post count
CREATE OR REPLACE FUNCTION update_profile_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.published = true THEN
    UPDATE profiles SET post_count = post_count + 1 WHERE id = NEW.author_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.published = false AND NEW.published = true THEN
      UPDATE profiles SET post_count = post_count + 1 WHERE id = NEW.author_id;
    ELSIF OLD.published = true AND NEW.published = false THEN
      UPDATE profiles SET post_count = post_count - 1 WHERE id = OLD.author_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.published = true THEN
    UPDATE profiles SET post_count = post_count - 1 WHERE id = OLD.author_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profile post count
CREATE TRIGGER update_author_post_count
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_post_count();

-- Function to set published_at timestamp
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set published_at
CREATE TRIGGER set_post_published_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
  ('Freelancing', 'freelancing', 'Start your freelance career and work independently', 'briefcase', '#3b82f6'),
  ('Side Hustles', 'side-hustles', 'Extra income ideas and opportunities', 'rocket', '#8b5cf6'),
  ('Passive Income', 'passive-income', 'Earn money while you sleep', 'trending-up', '#10b981'),
  ('Investing', 'investing', 'Grow your wealth through smart investments', 'bar-chart', '#f59e0b')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- STORAGE BUCKETS (Run separately in Supabase Dashboard)
-- =====================================================

-- Create storage bucket for avatars
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage bucket for post images
-- INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Storage policies for avatars
-- CREATE POLICY "Avatar images are publicly accessible"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'avatars');

-- CREATE POLICY "Authenticated users can upload avatars"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'avatars');

-- CREATE POLICY "Users can update own avatar"
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for post images
-- CREATE POLICY "Post images are publicly accessible"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'post-images');

-- CREATE POLICY "Authenticated users can upload post images"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'post-images');

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- View for post statistics
CREATE OR REPLACE VIEW post_stats AS
SELECT
  p.id,
  p.title,
  p.slug,
  p.view_count,
  p.like_count,
  p.published_at,
  c.name as category_name,
  pr.display_name as author_name,
  (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND approved = true) as comment_count
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN profiles pr ON p.author_id = pr.id
WHERE p.published = true;

-- View for author statistics
CREATE OR REPLACE VIEW author_stats AS
SELECT
  pr.id,
  pr.display_name,
  pr.email,
  pr.role,
  pr.post_count,
  COUNT(DISTINCT p.id) FILTER (WHERE p.published = true) as published_posts,
  COUNT(DISTINCT p.id) FILTER (WHERE p.published = false) as draft_posts,
  SUM(p.view_count) as total_views
FROM profiles pr
LEFT JOIN posts p ON pr.id = p.author_id
GROUP BY pr.id, pr.display_name, pr.email, pr.role, pr.post_count;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ MoneyFeast CMS Schema Migration Completed Successfully!';
  RAISE NOTICE '📊 Tables Created: categories, profiles, posts, newsletter_subscribers, comments, media, post_revisions, activity_log';
  RAISE NOTICE '🔒 RLS Policies: Enabled and configured';
  RAISE NOTICE '⚡ Triggers: Auto-update timestamps, post counts, published dates';
  RAISE NOTICE '👤 Next Steps: Create your first admin user in Supabase Auth';
END $$;
