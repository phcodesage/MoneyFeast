-- ROBUST FIX FOR INFINITE RECURSION
-- This script dynamically drops ALL policies on 'profiles' and 'posts' to ensure no recursive policies remain.

-- 1. Drop all policies on 'profiles'
DO $$ 
DECLARE 
    pol record; 
BEGIN 
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname); 
    END LOOP; 
END $$;

-- 2. Drop all policies on 'posts'
DO $$ 
DECLARE 
    pol record; 
BEGIN 
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'posts' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON posts', pol.policyname); 
    END LOOP; 
END $$;

-- 3. Create (or update) the secure admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Critical: Bypasses RLS
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 4. Re-create Policies for Profiles
-- Everyone can view profiles (needed for author info)
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING ( true );

-- Users can insert/update their own profile
CREATE POLICY "Users can manage own profile" 
ON profiles FOR ALL 
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON profiles FOR ALL 
USING ( is_admin() );

-- 5. Re-create Policies for Posts
-- Public can view published posts
CREATE POLICY "Public can view published posts" 
ON posts FOR SELECT 
USING ( published = true );

-- Admins can do everything on posts
CREATE POLICY "Admins can manage all posts" 
ON posts FOR ALL 
USING ( is_admin() )
WITH CHECK ( is_admin() );

-- Writers can manage their own posts (optional, adding for completeness)
CREATE POLICY "Writers can manage own posts" 
ON posts FOR ALL 
USING ( auth.uid() = author_id )
WITH CHECK ( auth.uid() = author_id );
