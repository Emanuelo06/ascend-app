# OAuth Provider Setup Guide

This guide will help you set up Google and Facebook OAuth providers for your Ascend application using Supabase Auth.

## Prerequisites

- Supabase project set up
- Google Cloud Console account
- Facebook Developer account
- Domain name (for production)

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

### Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Ascend"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Add test users (your email for development)
6. Save and continue

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
5. Copy the Client ID and Client Secret
   - Client Secret: [Your Google Client Secret]
   - Client ID: [Your Google Client ID]

### Step 4: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Enable Google provider
4. Enter your Google Client ID and Client Secret
5. Save the configuration

## 2. Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" app type
4. Fill in app details:
   - App name: "Ascend"
   - Contact email: Your email
5. Complete the app creation

### Step 2: Configure Facebook Login

1. In your Facebook app dashboard, go to "Add Product"
2. Add "Facebook Login"
3. Choose "Web" platform
4. Enter your site URL:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
5. Save and continue

### Step 3: Configure OAuth Settings

1. Go to "Facebook Login" > "Settings"
2. Add Valid OAuth Redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
3. Save changes

### Step 4: Get App Credentials

1. Go to "Settings" > "Basic"
2. Copy your App ID and App Secret
3. Note: Keep your App Secret secure

### Step 5: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Enable Facebook provider
4. Enter your Facebook App ID and App Secret
5. Save the configuration

## 3. Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Supabase Anon Key]

# OAuth Redirect URLs (for development)
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback

# Production OAuth Redirect URLs (update when deploying)
# NEXT_PUBLIC_AUTH_REDIRECT_URL=https://yourdomain.com/auth/callback
```

## 4. Database Schema Updates

Make sure your `user_profiles` table includes these fields for OAuth users:

```sql
-- Add these columns if they don't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS provider TEXT,
ADD COLUMN IF NOT EXISTS provider_id TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Create index for provider lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_provider 
ON user_profiles(provider, provider_id);
```

## 5. Testing OAuth

### Development Testing

1. Start your development server: `npm run dev`
2. Go to `/auth/login` or `/auth/register`
3. Click on "Continue with Google" or "Continue with Facebook"
4. Complete the OAuth flow
5. Verify you're redirected to `/auth/callback` and then to `/dashboard`

### Common Issues and Solutions

#### Issue: "Invalid redirect URI"
- **Solution**: Make sure the redirect URI in your OAuth provider matches exactly with what's configured in Supabase
- **Check**: No trailing slashes, correct protocol (http vs https), correct port

#### Issue: "App not configured for OAuth"
- **Solution**: Ensure you've enabled the OAuth provider in Supabase dashboard
- **Check**: Go to Authentication > Providers and verify Google/Facebook are enabled

#### Issue: "Client ID mismatch"
- **Solution**: Verify you're using the correct Client ID/App ID
- **Check**: Compare the values in your OAuth provider dashboard with Supabase

#### Issue: "Scope not allowed"
- **Solution**: Ensure you've requested the correct scopes in your OAuth consent screen
- **Check**: Google OAuth consent screen should include email and profile scopes

## 6. Production Deployment

### Update OAuth Settings

1. **Google Cloud Console**:
   - Add your production domain to authorized redirect URIs
   - Update OAuth consent screen with production information
   - Remove development URLs if not needed

2. **Facebook Developers**:
   - Add your production domain to Valid OAuth Redirect URIs
   - Update app settings for production

3. **Supabase**:
   - Verify OAuth provider settings are correct
   - Test OAuth flow in production environment

### Security Considerations

1. **HTTPS Only**: Ensure all OAuth redirects use HTTPS in production
2. **Domain Verification**: Verify your domain ownership with OAuth providers
3. **Secret Management**: Store OAuth secrets securely (use environment variables)
4. **Rate Limiting**: Implement rate limiting for OAuth endpoints
5. **Error Handling**: Provide user-friendly error messages for OAuth failures

## 7. Advanced Configuration

### Custom OAuth Scopes

You can request additional scopes by modifying the OAuth provider configuration:

```typescript
// In your auth service
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'email profile openid',
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
};
```

### Custom OAuth Callback Handling

You can customize the OAuth callback behavior:

```typescript
// In your callback page
useEffect(() => {
  const handleOAuthCallback = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Handle successful OAuth login
      const profile = await createOrUpdateProfile(session.user);
      router.push('/dashboard');
    } else if (error) {
      // Handle OAuth errors
      console.error('OAuth error:', error);
      setError(error.message);
    }
  };

  handleOAuthCallback();
}, []);
```

## 8. Monitoring and Analytics

### OAuth Success Rates

Monitor your OAuth success rates in Supabase dashboard:
- Go to Authentication > Users
- Check the "Sign-ins" tab for OAuth vs email statistics

### Error Tracking

Implement error tracking for OAuth failures:
```typescript
// Track OAuth errors
const handleOAuthError = (error: AuthError) => {
  // Log to your analytics service
  analytics.track('oauth_error', {
    provider: 'google', // or 'facebook'
    error: error.message,
    code: error.status
  });
};
```

## 9. Troubleshooting

### Debug OAuth Flow

1. **Check Browser Console**: Look for JavaScript errors during OAuth
2. **Network Tab**: Monitor network requests to identify failed calls
3. **Supabase Logs**: Check Supabase dashboard for authentication errors
4. **OAuth Provider Logs**: Check Google/Facebook developer dashboards

### Common Error Messages

- `"redirect_uri_mismatch"`: Redirect URI configuration issue
- `"invalid_client"`: Client ID/Secret mismatch
- `"access_denied"`: User denied OAuth permissions
- `"invalid_grant"`: OAuth token expired or invalid

## 10. Support and Resources

### Official Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/)

### Community Support

- [Supabase Discord](https://discord.supabase.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

## Quick Setup Checklist

- [ ] Google Cloud project created
- [ ] Google OAuth consent screen configured
- [ ] Google OAuth credentials created
- [ ] Facebook app created
- [ ] Facebook Login product added
- [ ] Facebook OAuth redirect URIs configured
- [ ] Supabase Google provider enabled
- [ ] Supabase Facebook provider enabled
- [ ] Environment variables configured
- [ ] Database schema updated
- [ ] OAuth flow tested in development
- [ ] Production OAuth settings updated
- [ ] HTTPS configured for production
- [ ] Error handling implemented
- [ ] Monitoring and analytics set up

Follow this checklist to ensure your OAuth setup is complete and secure!
