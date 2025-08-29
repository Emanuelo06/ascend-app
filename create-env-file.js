// Create Environment File Script
// This script will help you create the .env.local file

const fs = require('fs');
const path = require('path');

console.log('🔧 ASCEND App Environment Setup');
console.log('================================\n');

// Supabase configuration values
const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lhtlhgaoukfrkkxmcbhy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGxoZ2FvdWtmcmtreG1jYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMzNzQsImV4cCI6MjA3MjA0OTM3NH0.4VtXPwpVsScHq2aHONfiOCsY1SFU4YX4fSBPHIjHlvU

# Supabase JWT Secret (for server-side operations)
SUPABASE_JWT_SECRET=5WmZ4N1GqSwEmTPSVSBVt+E+YcAS0lcCX9jksOTguFTc/EawywHQR00rwnT4rEuibLnALMc0UiYajyeHQ+cqrw==

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env.local');

console.log('📝 Creating .env.local file...');

try {
  // Check if file already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local file already exists!');
    console.log('📁 Location:', envPath);
    
    // Ask if user wants to overwrite
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        createEnvFile();
      } else {
        console.log('✅ Keeping existing .env.local file');
        console.log('📝 If you need to update it, edit it manually with the content below:');
        console.log('\n' + envContent);
      }
      rl.close();
    });
  } else {
    createEnvFile();
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}

function createEnvFile() {
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local file created successfully!');
    console.log('📁 Location:', envPath);
    console.log('🔑 Supabase configuration added');
    
    console.log('\n📋 File contents:');
    console.log('─'.repeat(50));
    console.log(envContent);
    console.log('─'.repeat(50));
    
    console.log('\n🚀 Next steps:');
    console.log('1. Restart your Next.js development server');
    console.log('2. Check the browser console for configuration logs');
    console.log('3. Try accessing your app at http://localhost:3000');
    
    console.log('\n✨ Environment setup complete!');
  } catch (error) {
    console.error('❌ Failed to create .env.local file:', error.message);
    console.log('\n📝 Please create the file manually with this content:');
    console.log('\n' + envContent);
  }
}
