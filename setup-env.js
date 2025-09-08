#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for ASCEND app...\n');

// Check if .env.local already exists
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Backing up to .env.local.backup');
  fs.copyFileSync(envPath, path.join(__dirname, '.env.local.backup'));
}

// Create .env.local with the required variables
const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lhtlhgaoukfrkkxmcbhy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGxoZ2FvdWtmcmtreG1jYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMzNzQsImV4cCI6MjA3MjA0OTM3NH0.4VtXPwpVsScHq2aHONfiOCsY1SFU4YX4fSBPHIjHlvU

# Supabase JWT Secret (for server-side operations)
SUPABASE_JWT_SECRET=5WmZ4N1GqSwEmTPSVSBVt+E+YcAS0lcCX9jksOTguFTc/EawywHQR00rwnT4rEuibLnALMc0UiYajyeHQ+cqrw==

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Custom Key for additional security
CUSTOM_KEY=your_custom_key_here

# Enable PWA copy during build
ENABLE_PWA_COPY=true
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully!');
  console.log('\n📋 Environment variables set:');
  console.log('   • NEXT_PUBLIC_SUPABASE_URL');
  console.log('   • NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('   • SUPABASE_JWT_SECRET');
  console.log('   • NEXT_PUBLIC_APP_URL');
  console.log('   • NODE_ENV');
  console.log('   • CUSTOM_KEY');
  console.log('   • ENABLE_PWA_COPY');
  
  console.log('\n🚀 Your app should now work! Restart your development server if it\'s running.');
  console.log('\n📝 Note: Update Google OAuth credentials when ready for production.');
  
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  console.log('\n🔧 Manual setup:');
  console.log('1. Create a file named .env.local in your project root');
  console.log('2. Copy the content from env.example');
  console.log('3. Restart your development server');
}
