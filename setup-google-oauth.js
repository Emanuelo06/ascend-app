#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupGoogleOAuth() {
  console.log('🔧 Google OAuth Setup for ASCEND');
  console.log('=====================================\n');
  
  console.log('To fix the 404 error, you need to set up Google OAuth credentials.');
  console.log('Follow these steps:\n');
  
  console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
  console.log('2. Create a new project or select an existing one');
  console.log('3. Enable the Google+ API and Google OAuth2 API');
  console.log('4. Go to "APIs & Services" > "OAuth consent screen"');
  console.log('5. Configure the OAuth consent screen with your app details');
  console.log('6. Go to "APIs & Services" > "Credentials"');
  console.log('7. Create OAuth 2.0 Client ID credentials');
  console.log('8. Add these authorized redirect URIs:');
  console.log('   - http://localhost:3000/auth/callback');
  console.log('   - http://localhost:3001/auth/callback');
  console.log('   - http://localhost:3002/auth/callback');
  console.log('   - http://localhost:3003/auth/callback');
  console.log('   - https://lhtlhgaoukfrkkxmcbhy.supabase.co/auth/v1/callback\n');
  
  const clientId = await question('Enter your Google OAuth Client ID: ');
  const clientSecret = await question('Enter your Google OAuth Client Secret: ');
  
  if (!clientId || !clientSecret) {
    console.log('❌ Both Client ID and Client Secret are required!');
    rl.close();
    return;
  }
  
  // Create .env.local file
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lhtlhgaoukfrkkxmcbhy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGxoZ2FvdWtmcmtreG1jYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMzNzQsImV4cCI6MjA3MjA0OTM3NH0.4VtXPwpVsScHq2aHONfiOCsY1SFU4YX4fSBPHIjHlvU

# Supabase JWT Secret (for server-side operations)
SUPABASE_JWT_SECRET=5WmZ4N1GqSwEmTPSVSBVt+E+YcAS0lcCX9jksOTguFTc/EawywHQR00rwnT4rEuibLnALMc0UiYajyeHQ+cqrw==

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=${clientId}
GOOGLE_CLIENT_SECRET=${clientSecret}

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
`;

  try {
    fs.writeFileSync('.env.local', envContent);
    console.log('\n✅ .env.local file created successfully!');
    console.log('\n🚀 Next steps:');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Try logging in with Google again');
    console.log('3. The 404 error should be resolved\n');
  } catch (error) {
    console.log('❌ Error creating .env.local file:', error.message);
    console.log('\nPlease create the file manually with the following content:');
    console.log('=====================================');
    console.log(envContent);
  }
  
  rl.close();
}

setupGoogleOAuth().catch(console.error);
