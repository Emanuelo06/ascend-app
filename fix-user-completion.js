#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing user completion status...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local not found. Please run setup-env.js first.');
  process.exit(1);
}

// Read environment variables
require('dotenv').config({ path: envPath });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('❌ Supabase environment variables not found in .env.local');
  process.exit(1);
}

console.log('✅ Supabase configuration found');
console.log('🔗 URL:', SUPABASE_URL);

// Create a simple script to update user completion status
const fixScript = `
// Run this in your browser console on the ASCEND app to fix your completion status

console.log('🔧 Fixing user completion status...');

// Get current user data
const userData = localStorage.getItem('ascend_user_data');
if (!userData) {
  console.log('❌ No user data found in localStorage');
  console.log('💡 Please log in first, then run this script');
} else {
  const user = JSON.parse(userData);
  console.log('👤 Current user:', user.email);
  console.log('📊 Current status:', {
    onboarding_completed: user.onboarding_completed,
    assessment_completed: user.assessment_completed,
    totalScore: user.totalScore
  });
  
  // Update completion status
  const updatedUser = {
    ...user,
    onboarding_completed: true,
    assessment_completed: true,
    totalScore: user.totalScore || 75, // Set a default score if none exists
    updated_at: new Date().toISOString()
  };
  
  // Save updated user data
  localStorage.setItem('ascend_user_data', JSON.stringify(updatedUser));
  
  // Update in users list if it exists
  const storedUsers = localStorage.getItem('ascend_users');
  if (storedUsers) {
    const users = JSON.parse(storedUsers);
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      localStorage.setItem('ascend_users', JSON.stringify(users));
    }
  }
  
  console.log('✅ User completion status updated!');
  console.log('📊 New status:', {
    onboarding_completed: updatedUser.onboarding_completed,
    assessment_completed: updatedUser.assessment_completed,
    totalScore: updatedUser.totalScore
  });
  
  console.log('🔄 Please refresh the page to see the changes');
}
`;

// Write the fix script to a file
const fixScriptPath = path.join(__dirname, 'browser-fix-script.js');
fs.writeFileSync(fixScriptPath, fixScript);

console.log('📝 Browser fix script created: browser-fix-script.js');
console.log('\n🔧 To fix your completion status:');
console.log('1. Open your ASCEND app in the browser');
console.log('2. Log in to your account');
console.log('3. Open browser developer tools (F12)');
console.log('4. Go to the Console tab');
console.log('5. Copy and paste the contents of browser-fix-script.js');
console.log('6. Press Enter to run the script');
console.log('7. Refresh the page');
console.log('\n📋 Alternative: Manual localStorage update');
console.log('1. Open browser developer tools (F12)');
console.log('2. Go to Application/Storage tab');
console.log('3. Find Local Storage for your domain');
console.log('4. Look for "ascend_user_data" key');
console.log('5. Edit the JSON and set:');
console.log('   - "onboarding_completed": true');
console.log('   - "assessment_completed": true');
console.log('   - "totalScore": 75 (or any number > 0)');
console.log('6. Save and refresh the page');

console.log('\n🎯 This will mark you as having completed both onboarding and assessment!');
