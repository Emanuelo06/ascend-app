#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 OAuth Configuration Diagnostic');
console.log('==================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
  
  // Read and check the content
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check for Google OAuth variables
  const hasClientId = envContent.includes('NEXT_PUBLIC_GOOGLE_CLIENT_ID=') && 
                     !envContent.includes('your_google_oauth_client_id_here');
  const hasClientSecret = envContent.includes('GOOGLE_CLIENT_SECRET=') && 
                         !envContent.includes('your_google_oauth_client_secret_here');
  
  console.log(`Google Client ID configured: ${hasClientId ? '✅' : '❌'}`);
  console.log(`Google Client Secret configured: ${hasClientSecret ? '✅' : '❌'}`);
  
  if (!hasClientId || !hasClientSecret) {
    console.log('\n❌ ISSUE FOUND: Google OAuth credentials are not properly configured!');
    console.log('\nTo fix this:');
    console.log('1. Run: node setup-google-oauth.js');
    console.log('2. Or manually edit .env.local with your Google OAuth credentials');
    console.log('3. Get credentials from: https://console.cloud.google.com/');
  }
} else {
  console.log('❌ .env.local file does not exist');
  console.log('\nTo fix this:');
  console.log('1. Run: node setup-google-oauth.js');
  console.log('2. Or copy env.example to .env.local and update the values');
}

// Check package.json for required dependencies
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const hasSupabase = packageJson.dependencies && packageJson.dependencies['@supabase/supabase-js'];
  console.log(`\nSupabase dependency: ${hasSupabase ? '✅' : '❌'}`);
}

console.log('\n📋 Current OAuth Redirect URIs in your Google Console should include:');
console.log('- http://localhost:3000/auth/callback');
console.log('- http://localhost:3001/auth/callback');
console.log('- http://localhost:3002/auth/callback');
console.log('- http://localhost:3003/auth/callback');
console.log('- https://lhtlhgaoukfrkkxmcbhy.supabase.co/auth/v1/callback');

console.log('\n🔗 Google Cloud Console: https://console.cloud.google.com/');
console.log('📖 Setup Guide: Check GOOGLE_OAUTH_SETUP.md for detailed instructions');
