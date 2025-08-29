// Environment Configuration Utility
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    jwtSecret: process.env.SUPABASE_JWT_SECRET
  },
  app: {
    // Dynamically detect the port from the current environment
    url: typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
    environment: process.env.NODE_ENV || 'development'
  }
};

export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.supabase.url) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is not set');
  }
  
  if (!config.supabase.anonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  }
  
  // JWT Secret is only required for server-side operations
  // if (!config.supabase.jwtSecret) {
  //   errors.push('SUPABASE_JWT_SECRET is not set');
  // }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function logConfig(): void {
  console.log('🔧 Environment Configuration:');
  console.log('  Supabase URL:', config.supabase.url ? '✅ Set' : '❌ Missing');
  console.log('  Supabase Anon Key:', config.supabase.anonKey ? '✅ Set' : '❌ Missing');
  console.log('  Supabase JWT Secret:', config.supabase.jwtSecret ? '✅ Set' : '⚠️  Optional (server-side only)');
  console.log('  App URL:', config.app.url);
  console.log('  Environment:', config.app.environment);
}

export function getSafeConfig() {
  const validation = validateConfig();
  
  if (!validation.isValid) {
    console.error('❌ Configuration errors:', validation.errors);
    throw new Error(`Configuration errors:\n${validation.errors.join('\n')}`);
  }
  
  return config;
}
