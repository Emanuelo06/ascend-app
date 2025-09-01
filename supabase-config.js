



// Supabase Configuration
// This file provides default values and should be overridden by environment variables

const supabaseConfig = {
  // Supabase URL - Set via environment variable
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lhtlhgaoukfrkkxmcbhy.supabase.co",
  
  // Supabase Anonymous Key - Set via environment variable
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGxoZ2FvdWtmcmtreG1jYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMzNzQsImV4cCI6MjA3MjA0OTM3NH0.4VtXPwpVsScHq2aHONfiOCsY1SFU4YX4fSBPHIjHlvU",
  
  // Supabase JWT Secret - Set via environment variable
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || "5WmZ4N1GqSwEmTPSVSBVt+E+YcAS0lcCX9jksOTguFTc/EawywHQR00rwnT4rEuibLnALMc0UiYajyeHQ+cqrw==",
  
  // App Configuration - Set via environment variable
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  // Environment - Automatically detected
  NODE_ENV: process.env.NODE_ENV || "development"
};

// Instructions for Vercel deployment:
// 1. Set these environment variables in your Vercel project settings:
//    - NEXT_PUBLIC_SUPABASE_URL
//    - NEXT_PUBLIC_SUPABASE_ANON_KEY
//    - SUPABASE_JWT_SECRET (optional, for server-side operations)
//    - NEXT_PUBLIC_APP_URL (set to your Vercel domain)
//
// 2. NODE_ENV will automatically be set to "production" by Vercel

export default supabaseConfig;
