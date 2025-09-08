# 🔧 Vercel Environment Variables Setup Guide

## ❌ Current Issue
```
Uncaught Error: Supabase URL and anon key are required. Please check your environment variables.
```

## ✅ Solution: Set Up Environment Variables in Vercel

### 1. **Local Development (Fixed)**
✅ Created `.env.local` with all required variables
✅ App should now work locally

### 2. **Vercel Deployment Setup**

You need to add these environment variables to your Vercel project:

#### **Required Environment Variables:**

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lhtlhgaoukfrkkxmcbhy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGxoZ2FvdWtmcmtreG1jYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMzNzQsImV4cCI6MjA3MjA0OTM3NH0.4VtXPwpVsScHq2aHONfiOCsY1SFU4YX4fSBPHIjHlvU

# Supabase JWT Secret (for server-side operations)
SUPABASE_JWT_SECRET=5WmZ4N1GqSwEmTPSVSBVt+E+YcAS0lcCX9jksOTguFTc/EawywHQR00rwnT4rEuibLnALMc0UiYajyeHQ+cqrw==

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production

# Custom Key for additional security
CUSTOM_KEY=your_custom_key_here

# Enable PWA copy during build
ENABLE_PWA_COPY=true
```

#### **Optional Environment Variables:**
```bash
# Google OAuth Configuration (when ready)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret_here
```

### 3. **How to Add Environment Variables in Vercel:**

#### **Method 1: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://lhtlhgaoukfrkkxmcbhy.supabase.co`
   - **Environment**: Production, Preview, Development
5. Repeat for all variables
6. Click **Save**

#### **Method 2: Vercel CLI**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_JWT_SECRET
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NODE_ENV
vercel env add CUSTOM_KEY
vercel env add ENABLE_PWA_COPY

# Deploy with new environment variables
vercel --prod
```

### 4. **Environment Variable Details:**

| Variable | Purpose | Required | Environment |
|----------|---------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Yes | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Yes | All |
| `SUPABASE_JWT_SECRET` | JWT secret for server operations | ✅ Yes | All |
| `NEXT_PUBLIC_APP_URL` | Your app's URL | ✅ Yes | Production |
| `NODE_ENV` | Environment mode | ✅ Yes | All |
| `CUSTOM_KEY` | Additional security key | ✅ Yes | All |
| `ENABLE_PWA_COPY` | Enable PWA features | ✅ Yes | All |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | ⚠️ Optional | All |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | ⚠️ Optional | All |

### 5. **Important Notes:**

#### **NEXT_PUBLIC_ Variables**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- These are safe to use in client-side code
- Make sure these are set in Vercel

#### **Server-Only Variables**
- Variables without `NEXT_PUBLIC_` are only available on the server
- These are used in API routes and server-side code
- Keep these secure and don't expose them

#### **App URL Configuration**
- For production: `https://your-app-name.vercel.app`
- For preview: `https://your-app-name-git-branch.vercel.app`
- Update this when you know your Vercel domain

### 6. **Verification Steps:**

1. **Add all environment variables to Vercel**
2. **Redeploy your app**: `vercel --prod`
3. **Check the app**: Visit your Vercel URL
4. **Verify Supabase connection**: Try logging in or using features
5. **Check browser console**: Should see no Supabase errors

### 7. **Troubleshooting:**

#### **Still getting Supabase errors?**
- ✅ Check all `NEXT_PUBLIC_` variables are set in Vercel
- ✅ Verify the Supabase URL and key are correct
- ✅ Make sure you redeployed after adding variables
- ✅ Check Vercel deployment logs for any errors

#### **Google OAuth not working?**
- ⚠️ This is optional and can be set up later
- ⚠️ App will work without Google OAuth
- ⚠️ Set up Google OAuth when ready for production

### 8. **Next Steps:**

1. **Add environment variables to Vercel** (use the values above)
2. **Redeploy your app**
3. **Test the app** - Supabase errors should be gone
4. **Set up Google OAuth** when ready (optional)

## 🎯 **Quick Fix Summary:**

**The issue**: Missing environment variables in Vercel deployment
**The solution**: Add all required environment variables to Vercel project settings
**The result**: App will work perfectly with Supabase integration

Your ASCEND app is now ready for successful Vercel deployment! 🚀
