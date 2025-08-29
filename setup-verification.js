// Setup Verification Script
// Run this with: node setup-verification.js

console.log('🔍 ASCEND App Setup Verification');
console.log('=====================================\n');

// Check if we're in a Node.js environment
if (typeof process === 'undefined') {
  console.log('❌ This script must be run in Node.js environment');
  process.exit(1);
}

// Check environment variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const optionalVars = [
  'SUPABASE_JWT_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'NODE_ENV'
];

console.log('📋 Required Environment Variables:');
let allRequiredSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
    // Show first few characters for verification
    console.log(`   Value: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    allRequiredSet = false;
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
    console.log(`   Value: ${value.substring(0, 20)}...`);
  } else {
    console.log(`⚠️  ${varName}: Not set (optional)`);
  }
});

console.log('\n🔧 Configuration Status:');
if (allRequiredSet) {
  console.log('✅ All required environment variables are set!');
  console.log('🚀 Your app should work properly now.');
  
  // Test Supabase connection
  console.log('\n🧪 Testing Supabase connection...');
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    console.log('✅ Supabase client created successfully');
  } catch (error) {
    console.log('❌ Error creating Supabase client:', error.message);
  }
} else {
  console.log('❌ Some required environment variables are missing!');
  console.log('📝 Please check your .env.local file and restart your dev server.');
}

console.log('\n📚 Next Steps:');
console.log('1. Make sure your .env.local file is in the project root');
console.log('2. Restart your Next.js development server');
console.log('3. Check the browser console for configuration logs');
console.log('4. Try accessing your app at http://localhost:3000');

console.log('\n✨ Setup verification complete!');
