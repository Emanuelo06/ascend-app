import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config, getSafeConfig, logConfig } from './config';

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
