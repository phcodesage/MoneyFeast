-- 1. Create secure admin check function to break recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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

-- 2. Drop potentially problematic policies on profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON profiles;

-- 3. Re-create safe policies
-- Allow everyone to view profiles (needed for author info on posts)
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING ( true );

-- Allow users to insert their own profile (for signup)
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK ( auth.uid() = id );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING ( auth.uid() = id );

-- Allow admins to update any profile (using the secure function)
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING ( is_admin() );

-- Allow admins to delete any profile
CREATE POLICY "Admins can delete all profiles"
ON profiles FOR DELETE
USING ( is_admin() );

-- 4. Ensure posts policies are also safe (optional but good practice)
-- If there are policies on posts checking profiles, they should also use is_admin()
-- We won't drop them blindly, but we can add a policy for admins if it's missing
DROP POLICY IF EXISTS "Admins can do everything on posts" ON posts;
CREATE POLICY "Admins can do everything on posts"
ON posts
USING ( is_admin() )
WITH CHECK ( is_admin() );
