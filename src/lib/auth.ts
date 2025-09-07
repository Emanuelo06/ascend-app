import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config, getSafeConfig, logConfig } from './config';

// Google OAuth configuration
const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  redirectUri: typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/callback`
    : 'http://localhost:3000',
  scope: 'openid email profile',
  responseType: 'code'
};

// Debug function to log OAuth config
const debugOAuthConfig = () => {
  console.log('🔧 OAuth Config Debug:');
  console.log('  Client ID:', GOOGLE_OAUTH_CONFIG.clientId);
  console.log('  Redirect URI:', GOOGLE_OAUTH_CONFIG.redirectUri);
  console.log('  Scope:', GOOGLE_OAUTH_CONFIG.scope);
  console.log('  Response Type:', GOOGLE_OAUTH_CONFIG.responseType);
  console.log('  Environment:', process.env.NODE_ENV);
};

// Function to get the current redirect URI dynamically
const getCurrentRedirectUri = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  // Fallback to common ports
  return 'http://localhost:3000/auth/callback';
};

// Log configuration for debugging
logConfig();

// Try to get safe configuration, but don't fail immediately
let supabase: SupabaseClient;
let configError: string | null = null;

try {
  const safeConfig = getSafeConfig();
  supabase = createClient(safeConfig.supabase.url!, safeConfig.supabase.anonKey!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
} catch (error) {
  configError = (error as Error).message;
  console.error('❌ Failed to initialize Supabase client:', configError);
  
  // Create a mock client that will show helpful errors
  supabase = {
    auth: {
      signUp: async () => ({ data: null, error: new Error('Supabase not configured. Please check your .env.local file.') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured. Please check your .env.local file.') }),
      signOut: async () => ({ error: new Error('Supabase not configured. Please check your .env.local file.') }),
      resetPasswordForEmail: async () => ({ error: new Error('Supabase not configured. Please check your .env.local file.') }),
      updateUser: async () => ({ error: new Error('Supabase not configured. Please check your .env.local file.') }),
      getSession: async () => ({ data: { session: null }, error: new Error('Supabase not configured. Please check your .env.local file.') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  } as unknown as SupabaseClient;
}

export { supabase };

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Types for authentication state
export interface AuthState {
  user: import('@supabase/supabase-js').User | null;
  session: import('@supabase/supabase-js').Session | null;
  loading: boolean;
  error: string | null;
}

export const signUp = async (email: string, password: string, fullName: string) => {
  if (configError) {
    return { data: null, error: new Error(configError) };
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const signIn = async (email: string, password: string) => {
  if (configError) {
    return { data: null, error: new Error(configError) };
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const signOut = async () => {
  if (configError) {
    return { error: new Error(configError) };
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const resetPassword = async (email: string) => {
  if (configError) {
    return { error: new Error(configError) };
  }
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const updatePassword = async (password: string) => {
  if (configError) {
    return { error: new Error(configError) };
  }
  
  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

// Google OAuth functions
export const signInWithGoogle = async () => {
  if (!GOOGLE_OAUTH_CONFIG.clientId) {
    return { error: new Error('Google OAuth is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID.') };
  }
  
  try {
    const currentRedirectUri = getCurrentRedirectUri();
    
    // Debug the OAuth configuration
    debugOAuthConfig();
    console.log('🌐 Current origin:', window.location.origin);
    console.log('🎯 Using redirect URI:', currentRedirectUri);
    
    // Build Google OAuth URL with all required parameters
    const googleAuthUrl = new URL('https://accounts.google.com/oauth/authorize');
    googleAuthUrl.searchParams.append('client_id', GOOGLE_OAUTH_CONFIG.clientId);
    googleAuthUrl.searchParams.append('redirect_uri', currentRedirectUri);
    googleAuthUrl.searchParams.append('scope', GOOGLE_OAUTH_CONFIG.scope);
    googleAuthUrl.searchParams.append('response_type', GOOGLE_OAUTH_CONFIG.responseType);
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');
    googleAuthUrl.searchParams.append('state', 'google-oauth'); // Add state parameter
    
    const finalUrl = googleAuthUrl.toString();
    console.log('🔗 Final Google OAuth URL:', finalUrl);
    
    // Validate the URL before redirecting
    if (!finalUrl.includes('client_id=') || !finalUrl.includes('redirect_uri=')) {
      throw new Error('Invalid Google OAuth URL generated');
    }
    
    // Redirect to Google OAuth
    window.location.href = finalUrl;
    
    return { error: null };
  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    return { error: error as Error };
  }
};

export const handleGoogleCallback = async (code: string) => {
  if (!GOOGLE_OAUTH_CONFIG.clientId) {
    return { error: new Error('Google OAuth is not configured.') };
  }
  
  try {
    const currentRedirectUri = getCurrentRedirectUri();
    
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_OAUTH_CONFIG.clientId,
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: currentRedirectUri,
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange authorization code for token');
    }
    
    const tokenData = await tokenResponse.json();
    
    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }
    
    const userInfo = await userInfoResponse.json();
    
    // Create or sign in user with Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_token: tokenData.access_token,
          id_token: tokenData.id_token,
        },
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};
