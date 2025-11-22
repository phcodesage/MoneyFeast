# Environment Variables Setup Guide

Complete guide to configure your MoneyFeast environment variables.

## 🚀 Quick Start

### Step 1: Create Your .env File

```bash
# Copy the example file
cp .env.example .env
```

### Step 2: Fill in Required Values

Open `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Start Development

```bash
npm run dev
```

That's it! Your app is now connected to Supabase.

## 📋 Environment Variables Reference

### ✅ REQUIRED (Must have these)

#### **Supabase Configuration**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Settings → API
4. Copy "Project URL" and "anon public" key

---

### 🎯 RECOMMENDED (For production)

#### **Analytics**
```env
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**How to get:**
1. Go to [Google Analytics](https://analytics.google.com)
2. Create a property
3. Copy the Measurement ID (starts with G-)

#### **Site Configuration**
```env
VITE_SITE_URL=https://yourdomain.com
VITE_DEFAULT_OG_IMAGE=https://yourdomain.com/og-image.png
```

---

### 🔧 OPTIONAL (Add as needed)

#### **Storage Buckets**
```env
VITE_STORAGE_BUCKET_AVATARS=avatars
VITE_STORAGE_BUCKET_POST_IMAGES=post-images
```

Used for image uploads. Default values work if you named your buckets this way.

#### **Social Media**
```env
VITE_SOCIAL_TWITTER=https://twitter.com/yourusername
VITE_SOCIAL_FACEBOOK=https://facebook.com/yourpage
VITE_SOCIAL_INSTAGRAM=https://instagram.com/yourusername
VITE_SOCIAL_LINKEDIN=https://linkedin.com/company/yourcompany
```

#### **Email Services** (for future features)
```env
# SendGrid
VITE_SENDGRID_API_KEY=SG.xxxxx

# Or Mailgun
VITE_MAILGUN_API_KEY=xxxxx
VITE_MAILGUN_DOMAIN=mg.yourdomain.com
```

#### **Monetization**
```env
# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx

# PayPal
VITE_PAYPAL_CLIENT_ID=xxxxx
```

#### **Comments**
```env
VITE_DISQUS_SHORTNAME=your-shortname
```

#### **Spam Protection**
```env
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

#### **Image Optimization**
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_API_KEY=xxxxx
```

---

## 🎛️ Feature Flags

Enable or disable features:

```env
VITE_ENABLE_COMMENTS=false
VITE_ENABLE_NEWSLETTER=true
VITE_ENABLE_SOCIAL_SHARE=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SEARCH=true
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` in `.gitignore` (already done)
- Use different values for development and production
- Store production secrets in your hosting platform
- Rotate keys regularly

### ❌ DON'T:
- Never commit `.env` to Git
- Never share your `.env` file
- Never use production keys in development
- Never expose secret keys in client-side code

---

## 🌍 Environment-Specific Files

### Development
```bash
.env.local          # Local development (gitignored)
.env.development    # Development build
```

### Production
```bash
.env.production     # Production build
```

### Priority Order
Vite loads env files in this order (highest priority first):
1. `.env.local`
2. `.env.[mode].local`
3. `.env.[mode]`
4. `.env`

---

## 📦 Deployment Platforms

### **Netlify**
1. Go to Site Settings → Environment Variables
2. Add each variable
3. Redeploy

### **Vercel**
1. Go to Project Settings → Environment Variables
2. Add each variable
3. Select environment (Production/Preview/Development)
4. Redeploy

### **GitHub Actions**
Add to repository secrets:
1. Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each variable

---

## 🧪 Testing Your Configuration

### Check if Supabase is connected:
```typescript
// In browser console
console.log(import.meta.env.VITE_SUPABASE_URL);
// Should show your Supabase URL
```

### Verify environment variables:
```bash
# Create a test file
echo "console.log(import.meta.env)" > test-env.js

# Run dev server and check browser console
npm run dev
```

---

## 🐛 Troubleshooting

### Variables not loading?
- Restart dev server after changing `.env`
- Check variable names start with `VITE_`
- Verify no syntax errors in `.env`

### Supabase connection failed?
- Check URL format: `https://xxxxx.supabase.co`
- Verify anon key is correct
- Check if project is paused in Supabase

### Build errors?
- Ensure all required variables are set
- Check for typos in variable names
- Verify `.env.production` exists for production builds

---

## 📝 Example Configurations

### Minimal (Development)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Recommended (Production)
```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site
VITE_SITE_URL=https://moneyfeast.com
VITE_DEFAULT_OG_IMAGE=https://moneyfeast.com/og-image.png

# Social
VITE_SOCIAL_TWITTER=https://twitter.com/moneyfeast
```

### Full (All Features)
```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Storage
VITE_STORAGE_BUCKET_AVATARS=avatars
VITE_STORAGE_BUCKET_POST_IMAGES=post-images

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site
VITE_SITE_NAME=MoneyFeast
VITE_SITE_URL=https://moneyfeast.com
VITE_SITE_DESCRIPTION=Master the Art of Earning Online

# Contact
VITE_CONTACT_EMAIL=contact@moneyfeast.com

# Social
VITE_SOCIAL_TWITTER=https://twitter.com/moneyfeast
VITE_SOCIAL_FACEBOOK=https://facebook.com/moneyfeast

# Email
VITE_SENDGRID_API_KEY=SG.xxxxx

# Monetization
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx

# Features
VITE_ENABLE_NEWSLETTER=true
VITE_ENABLE_ANALYTICS=true
```

---

## 🎯 Quick Checklist

Before deploying to production:

- [ ] All required variables set
- [ ] Analytics configured
- [ ] Site URL updated
- [ ] OG image uploaded and URL set
- [ ] Social links updated
- [ ] Email service configured (if using)
- [ ] Production keys (not test keys)
- [ ] Variables added to hosting platform
- [ ] `.env` NOT committed to Git
- [ ] Test deployment works

---

## 💡 Pro Tips

1. **Use descriptive values** - Makes debugging easier
2. **Document custom variables** - Add comments in `.env`
3. **Keep `.env.example` updated** - When adding new variables
4. **Use environment-specific files** - Different configs for dev/prod
5. **Validate on startup** - Check required variables exist

---

## 🆘 Need Help?

- Check [Vite Environment Variables Docs](https://vitejs.dev/guide/env-and-mode.html)
- Check [Supabase Docs](https://supabase.com/docs)
- See `README.md` for more information

---

**Your environment is now configured!** 🎉
