# Supabase Migration Guide

Complete guide to set up your MoneyFeast database with all CMS features.

## 📋 What This Migration Includes

### **Tables Created:**
1. **categories** - Blog categories with post counts
2. **profiles** - Writer/admin profiles with avatars and bios
3. **posts** - Blog posts with full metadata
4. **newsletter_subscribers** - Email subscribers
5. **comments** - Post comments (for future use)
6. **media** - Media library for images
7. **post_revisions** - Version history
8. **activity_log** - User activity tracking

### **Features:**
✅ **User Roles** - Admin, Editor, Writer
✅ **Writer Profiles** - Full name, display name, avatar, bio
✅ **Post Management** - Create, edit, delete, publish
✅ **Category System** - Organize content
✅ **Media Library** - Upload and manage images
✅ **Version History** - Track post changes
✅ **Activity Logging** - Monitor user actions
✅ **Auto Counters** - Post counts, view counts
✅ **SEO Fields** - Meta title, description, tags
✅ **Social Links** - Store writer social profiles

## 🚀 How to Run the Migration

### **Method 1: Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of:
   ```
   supabase/migrations/20251123_complete_cms_schema.sql
   ```
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for completion message ✅

### **Method 2: Supabase CLI**

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

## 👤 Create Your First Admin User

### **Step 1: Create User in Supabase**

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - Email: `your-email@example.com`
   - Password: `your-secure-password`
   - Auto Confirm User: ✅ (check this)
4. Click **Create User**

### **Step 2: Update User Role to Admin**

Run this SQL in SQL Editor:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles
SET role = 'admin',
    full_name = 'Your Full Name',
    display_name = 'Your Display Name'
WHERE email = 'your-email@example.com';
```

### **Step 3: Verify Admin Access**

```sql
-- Check your profile
SELECT * FROM profiles WHERE email = 'your-email@example.com';
```

You should see `role = 'admin'`

## 👥 Add More Writers

### **Create a Writer Account:**

```sql
-- First, create user in Authentication → Users
-- Then update their profile:

UPDATE profiles
SET role = 'writer',
    full_name = 'Writer Full Name',
    display_name = 'Writer Display Name',
    bio = 'Short bio about the writer'
WHERE email = 'writer@example.com';
```

### **Create an Editor Account:**

```sql
UPDATE profiles
SET role = 'editor',
    full_name = 'Editor Full Name',
    display_name = 'Editor Display Name'
WHERE email = 'editor@example.com';
```

## 🎨 Set Up Storage for Images

### **Create Storage Buckets:**

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**

**Create Avatars Bucket:**
- Name: `avatars`
- Public: ✅ (checked)
- Click **Create**

**Create Post Images Bucket:**
- Name: `post-images`
- Public: ✅ (checked)
- Click **Create**

### **Set Storage Policies:**

Run this SQL:

```sql
-- Avatars bucket policies
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- Post images bucket policies
CREATE POLICY "Post images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can delete post images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images');
```

## 📊 Database Schema Overview

### **Profiles Table**
```sql
- id (uuid, primary key)
- email (text, unique)
- full_name (text)
- display_name (text)
- avatar_url (text)
- bio (text)
- role (admin | editor | writer)
- is_active (boolean)
- post_count (integer, auto-updated)
- social_links (jsonb) - Twitter, LinkedIn, etc.
- created_at, updated_at
```

### **Posts Table**
```sql
- id (uuid, primary key)
- title (text)
- slug (text, unique)
- excerpt (text)
- content (text, markdown)
- author_id (uuid, references profiles)
- author_name (text)
- category_id (uuid, references categories)
- featured (boolean)
- published (boolean)
- featured_image_url (text)
- meta_title (text)
- meta_description (text)
- tags (text array)
- read_time (integer)
- view_count (integer)
- like_count (integer)
- created_at, updated_at, published_at
```

### **Categories Table**
```sql
- id (uuid, primary key)
- name (text, unique)
- slug (text, unique)
- description (text)
- icon (text)
- color (text, hex code)
- post_count (integer, auto-updated)
- created_at, updated_at
```

## 🔐 User Roles & Permissions

### **Admin**
- ✅ Full access to everything
- ✅ Manage all posts (create, edit, delete)
- ✅ Manage all users
- ✅ Manage categories
- ✅ View analytics
- ✅ Access activity log

### **Editor**
- ✅ Manage all posts (create, edit)
- ✅ Publish any post
- ✅ Moderate comments
- ✅ Upload media
- ❌ Cannot delete posts
- ❌ Cannot manage users

### **Writer**
- ✅ Create posts
- ✅ Edit own posts
- ✅ Delete own posts
- ✅ Upload media
- ❌ Cannot edit others' posts
- ❌ Cannot manage users

## 🔄 Auto-Update Features

### **Automatic Counters:**
- Category post counts update when posts are published/unpublished
- Profile post counts update automatically
- View counts can be incremented

### **Automatic Timestamps:**
- `updated_at` updates on every record change
- `published_at` sets when post is first published

### **Auto Profile Creation:**
- When a user signs up, a profile is automatically created
- Display name defaults to email username
- Role defaults to 'writer'

## 📈 Analytics Views

### **Post Statistics:**
```sql
SELECT * FROM post_stats;
-- Shows: views, likes, comments, category, author
```

### **Author Statistics:**
```sql
SELECT * FROM author_stats;
-- Shows: published posts, drafts, total views per author
```

## 🧪 Test Your Setup

### **1. Check Tables Exist:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### **2. Check Your Admin Profile:**
```sql
SELECT id, email, display_name, role, is_active
FROM profiles
WHERE role = 'admin';
```

### **3. Check Categories:**
```sql
SELECT name, slug, post_count FROM categories;
```

### **4. Test Creating a Post:**
```sql
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  author_id,
  category_id,
  published
)
SELECT
  'Test Post',
  'test-post',
  'This is a test post',
  'Full content here...',
  p.id,
  c.id,
  true
FROM profiles p, categories c
WHERE p.role = 'admin'
  AND c.slug = 'freelancing'
LIMIT 1;
```

### **5. Verify Post Count Updated:**
```sql
SELECT name, post_count FROM categories WHERE slug = 'freelancing';
-- Should show post_count = 1
```

## 🛠️ Useful SQL Queries

### **Add Social Links to Profile:**
```sql
UPDATE profiles
SET social_links = jsonb_build_object(
  'twitter', 'https://twitter.com/username',
  'linkedin', 'https://linkedin.com/in/username',
  'website', 'https://yourwebsite.com'
)
WHERE email = 'your-email@example.com';
```

### **Bulk Publish Posts:**
```sql
UPDATE posts
SET published = true
WHERE author_id = (SELECT id FROM profiles WHERE email = 'your-email@example.com');
```

### **Get Top Posts by Views:**
```sql
SELECT title, view_count, published_at
FROM posts
WHERE published = true
ORDER BY view_count DESC
LIMIT 10;
```

### **Get Recent Activity:**
```sql
SELECT
  a.action,
  a.entity_type,
  a.created_at,
  p.display_name as user_name
FROM activity_log a
LEFT JOIN profiles p ON a.user_id = p.id
ORDER BY a.created_at DESC
LIMIT 20;
```

## 🐛 Troubleshooting

### **Migration Failed?**
- Check for syntax errors in SQL editor
- Ensure you have proper permissions
- Try running sections separately

### **RLS Policies Not Working?**
- Verify RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Check policy conditions
- Test with authenticated user

### **Counters Not Updating?**
- Check triggers are created
- Verify trigger functions exist
- Test manually with INSERT/UPDATE

### **Profile Not Created on Signup?**
- Check trigger `on_auth_user_created` exists
- Verify function `handle_new_user()` exists
- Check auth.users table

## 📝 Next Steps

1. ✅ Run the migration
2. ✅ Create admin user
3. ✅ Set up storage buckets
4. ✅ Test creating a post
5. ✅ Add more writers
6. ✅ Configure storage policies
7. ✅ Start writing content!

## 🎉 You're Done!

Your database is now fully set up with:
- ✅ Complete CMS schema
- ✅ User roles and permissions
- ✅ Auto-updating counters
- ✅ Media management
- ✅ Version history
- ✅ Activity logging
- ✅ Analytics views

**Ready to start managing content!** 🚀
