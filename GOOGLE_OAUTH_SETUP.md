
# Google OAuth Setup Guide for ASCEND

This guide will help you set up Google OAuth authentication for your ASCEND application.

## Prerequisites

- Google Cloud Console account
- Your ASCEND app running locally or deployed

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: ASCEND
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - **App domain**: Your domain (e.g., `ascend.app`)
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users if needed
6. Save and continue

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Configure the OAuth client:
   - **Name**: ASCEND Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for local development)
     - `http://localhost:3001` (for local development)
     - `http://localhost:3002` (for local development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/callback` (for local development)
     - `http://localhost:3001/auth/callback` (for local development)
     - `http://localhost:3002/auth/callback` (for local development)
     - `https://yourdomain.com/auth/callback` (for production)
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

## Step 4: Configure Environment Variables

Create or update your `.env.local` file:

```bash
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Existing Supabase config
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

## Step 5: Update Supabase Configuration (Optional)

If you want to use Supabase's built-in Google OAuth:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Google** provider
4. Add your Google Client ID and Client Secret
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `/login` or `/register`
3. Click the "Continue with Google" button
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to `/auth/callback`
6. The callback page will complete the authentication and redirect you appropriately

## Current Implementation Status

### ✅ What's Implemented

- Google OAuth configuration in `src/lib/config.ts`
- Google sign-in functions in `src/lib/auth.ts`
- Google sign-in integration in `AuthContext`
- Google sign-in buttons on login and register pages
- OAuth callback page at `/auth/callback`
- Proper redirect handling based on user completion status

### 🔄 What's Currently Simulated

- OAuth token exchange (currently mocked for development)
- User creation from OAuth data (currently creates mock user)
- Integration with Supabase OAuth (currently uses local storage)

### 🚀 Next Steps for Production

1. **Implement Real OAuth Flow**:
   - Exchange authorization code for access token
   - Fetch user profile from Google
   - Create/update user in your database
   - Generate proper JWT tokens

2. **Database Integration**:
   - Store OAuth user data in your database
   - Link OAuth accounts with existing users
   - Handle OAuth account linking/unlinking

3. **Security Enhancements**:
   - Validate OAuth tokens
   - Implement CSRF protection
   - Add rate limiting for OAuth endpoints

4. **Error Handling**:
   - Handle OAuth failures gracefully
   - Provide user-friendly error messages
   - Implement retry mechanisms

## Troubleshooting

### Common Issues

1. **"Google OAuth is not configured" error**:
   - Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in your `.env.local`
   - Restart your development server after adding environment variables

2. **Redirect URI mismatch**:
   - Ensure the redirect URI in Google Cloud Console matches your callback URL
   - Check that your domain/port is correctly configured

3. **CORS issues**:
   - Verify that your domain is added to authorized origins in Google Cloud Console
   - Check that your callback URL is in the authorized redirect URIs

4. **OAuth consent screen not showing**:
   - Ensure the Google+ API and Google OAuth2 API are enabled
   - Check that your OAuth consent screen is properly configured
   - Verify that your app is not in testing mode (or add test users)

### Debug Mode

To enable debug logging, add this to your browser console:

```javascript
localStorage.setItem('debug', 'true');
```

## Security Considerations

1. **Never expose your Client Secret** in client-side code
2. **Use HTTPS** in production for all OAuth flows
3. **Validate OAuth tokens** on the server side
4. **Implement proper session management**
5. **Add rate limiting** to prevent abuse
6. **Log OAuth activities** for security monitoring

## Production Deployment

1. **Update environment variables** with production values
2. **Configure production domains** in Google Cloud Console
3. **Set up proper SSL certificates**
4. **Configure production redirect URIs**
5. **Test the complete OAuth flow** in production environment
6. **Monitor OAuth usage** and errors

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Google Cloud Console configuration
3. Ensure all environment variables are set correctly
4. Check that your callback URL is accessible
5. Review the OAuth consent screen configuration

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity Platform](https://developers.google.com/identity)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/rfc6819)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
