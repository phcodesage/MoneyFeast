# CMS Setup Guide

Your MoneyFeast blog now has a complete Content Management System (CMS)! Here's how to set it up and use it.

## 🎯 What You Get

✅ **Admin Dashboard** - Manage all your blog posts in one place
✅ **Rich Text Editor** - Write posts with Markdown support
✅ **User Authentication** - Secure login for you and your writers
✅ **Draft/Publish System** - Save drafts and publish when ready
✅ **Category Management** - Organize posts by category
✅ **Featured Posts** - Highlight your best content
✅ **SEO-Friendly** - Auto-generate slugs from titles

## 📋 Setup Steps

### Step 1: Enable Supabase Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Email** provider
4. Configure email templates (optional)

### Step 2: Create Your Admin User

Run this SQL in your Supabase SQL Editor:

```sql
-- This will be done through Supabase Auth UI
-- Or you can create a user programmatically
```

**Easier Method - Use Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. Click **Create User**

### Step 3: Update Row Level Security (RLS) Policies

Run this SQL to allow authenticated users to manage content:

```sql
-- Allow authenticated users to insert posts
CREATE POLICY "Authenticated users can insert posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update posts
CREATE POLICY "Authenticated users can update posts"
ON posts FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete posts
CREATE POLICY "Authenticated users can delete posts"
ON posts FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users to manage categories
CREATE POLICY "Authenticated users can insert categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
ON categories FOR UPDATE
TO authenticated
USING (true);
```

### Step 4: Access the Admin Panel

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/admin/login`

3. Sign in with your Supabase user credentials

4. You'll be redirected to the dashboard!

## 🚀 Using the CMS

### Admin Dashboard (`/admin/dashboard`)

**Features:**
- View all posts (published and drafts)
- See post statistics
- Quick publish/unpublish toggle
- Edit or delete posts
- Create new posts

**Stats Displayed:**
- Total Posts
- Published Posts
- Draft Posts

### Creating a New Post (`/admin/posts/new`)

1. Click **"Create New Post"** button
2. Fill in the form:
   - **Title** (required) - Auto-generates slug
   - **Slug** (required) - URL-friendly identifier
   - **Excerpt** - Short description for previews
   - **Content** - Full post content in Markdown
   - **Author** - Your name or writer's name
   - **Category** - Select from existing categories
   - **Read Time** - Estimated reading time in minutes
   - **Featured** - Check to feature on homepage
   - **Publish** - Check to publish immediately

3. Click **"Save Post"**

### Editing a Post

1. Click the **Edit** icon (pencil) next to any post
2. Make your changes
3. Click **"Save Post"**

### Publishing/Unpublishing

- Click the status badge in the dashboard to toggle
- **Published** = Visible on your website
- **Draft** = Hidden from public

### Deleting a Post

1. Click the **Delete** icon (trash) next to a post
2. Confirm the deletion
3. Post is permanently removed

## ✍️ Writing with Markdown

The editor supports full Markdown syntax:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item

[Link text](https://example.com)

![Image alt text](image-url.jpg)

> Blockquote

`Inline code`
```

**Editor Toolbar:**
- **B** - Bold
- **I** - Italic
- **H** - Heading
- **"** - Quote
- **•** - Bullet list
- **1.** - Numbered list
- **🔗** - Link
- **📷** - Image
- **👁** - Preview
- **?** - Guide

## 👥 Adding More Writers

### Option 1: Create Supabase Users
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter writer's email and password
4. Share credentials with your writer
5. They can log in at `/admin/login`

### Option 2: Email Invitations
1. Use Supabase's invite feature
2. Writer receives email with signup link
3. They create their account
4. Can immediately start writing

## 🔒 Security Features

✅ **Authentication Required** - Only logged-in users can access admin
✅ **Automatic Redirects** - Unauthorized users sent to login
✅ **Session Management** - Secure session handling
✅ **RLS Policies** - Database-level security
✅ **Protected Routes** - Admin routes require authentication

## 📱 Admin Routes

| Route | Purpose |
|-------|---------|
| `/admin/login` | Sign in page |
| `/admin/dashboard` | Main dashboard |
| `/admin/posts/new` | Create new post |
| `/admin/posts/:id` | Edit existing post |

## 🎨 Customization

### Change Admin Colors
Edit the admin pages to use your brand colors:
- `src/pages/admin/Dashboard.tsx`
- `src/pages/admin/PostEditor.tsx`
- `src/pages/admin/Login.tsx`

### Add More Fields
Modify the post editor to include:
- Tags
- Meta descriptions
- Custom fields
- Image uploads

### Custom Categories
Add/edit categories directly in Supabase:
```sql
INSERT INTO categories (name, slug, description, icon)
VALUES ('Your Category', 'your-category', 'Description', 'icon-name');
```

## 🐛 Troubleshooting

### Can't Log In
- Check Supabase user exists
- Verify email/password
- Check browser console for errors
- Ensure RLS policies are set up

### Posts Not Saving
- Check RLS policies
- Verify user is authenticated
- Check browser console
- Ensure all required fields filled

### Markdown Not Rendering
- Content is stored as plain text
- Will be rendered on frontend
- Use preview in editor to check

## 📊 Best Practices

1. **Save Drafts Often** - Don't lose your work
2. **Use Descriptive Slugs** - Good for SEO
3. **Write Good Excerpts** - Helps with previews
4. **Set Accurate Read Times** - Improves UX
5. **Feature Your Best** - Only feature top content
6. **Categorize Properly** - Helps readers find content

## 🚀 Going to Production

### Before Launch:
1. ✅ Create admin users in production Supabase
2. ✅ Set up RLS policies in production
3. ✅ Test login/logout flow
4. ✅ Create a few test posts
5. ✅ Verify posts appear on frontend
6. ✅ Test on mobile devices

### Security Checklist:
- [ ] Strong passwords for all admin users
- [ ] RLS policies enabled
- [ ] Email verification enabled (optional)
- [ ] 2FA enabled for admins (optional)
- [ ] Regular backups of database

## 💡 Tips for Writers

1. **Use the Preview** - Check formatting before saving
2. **Write in Markdown** - It's simple and powerful
3. **Save as Draft First** - Review before publishing
4. **Add Good Excerpts** - This shows in search results
5. **Use Headers** - Break up content for readability
6. **Include Links** - Reference sources and related content

## 🎉 You're Ready!

Your CMS is fully set up and ready to use. Start creating amazing content!

**Quick Start:**
1. Go to `/admin/login`
2. Sign in
3. Click "Create New Post"
4. Write your first post
5. Publish!

---

**Need Help?** Check the Supabase documentation or open an issue on GitHub.
