# 🔧 Vercel Environment Variables Setup

## Required Environment Variables

Set these in your Vercel project settings under **Settings > Environment Variables**:

### Core Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://lhtlhgaoukfrkkxmcbhy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGxoZ2FvdWtmcmtreG1jYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMzNzQsImV4cCI6MjA3MjA0OTM3NH0.4VtXPwpVsScHq2aHONfiOCsY1SFU4YX4fSBPHIjHlvU
SUPABASE_JWT_SECRET=5WmZ4N1GqSwEmTPSVSBVt+E+YcAS0lcCX9jksOTguFTc/EawywHQR00rwnT4rEuibLnALMc0UiYajyeHQ+cqrw==
```

### App Configuration
```bash
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### Optional: Google OAuth (if using Google authentication)
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret_here
```

### Optional: Stripe (if using payments)
```bash
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the sidebar
4. Add each variable with:
   - **Name**: The variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: The variable value
   - **Environment**: Select all environments (Production, Preview, Development)

## Important Notes

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Variables without `NEXT_PUBLIC_` are only available on the server
- After adding environment variables, you need to redeploy your project
- Never commit sensitive environment variables to your repository

## Verification

After deployment, verify your environment variables are working by:
1. Checking the browser console for any missing environment variable errors
2. Testing the Supabase connection
3. Verifying authentication works correctly
