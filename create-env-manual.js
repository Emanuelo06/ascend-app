// Manual Environment File Creation
const fs = require('fs');
const path = require('path');

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

console.log('🔧 Creating .env.local file manually...');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .env.local file created successfully!');
  console.log('📁 Location:', envPath);
  
  // Verify the file was created correctly
  const fileContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n📋 File content verification:');
  console.log('File size:', fileContent.length, 'characters');
  console.log('Contains NEXT_PUBLIC_SUPABASE_URL:', fileContent.includes('NEXT_PUBLIC_SUPABASE_URL'));
  console.log('Contains NEXT_PUBLIC_SUPABASE_ANON_KEY:', fileContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'));
  console.log('Contains full API key:', fileContent.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGxoZ2FvdWtmcmtreG1jYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMzNzQsImV4cCI6MjA3MjA0OTM3NH0.4VtXPwpVsScHq2aHONfiOCsY1SFU4YX4fSBPHIjHlvU'));
  
  console.log('\n🚀 Next steps:');
  console.log('1. Restart your Next.js development server');
  console.log('2. Test with: node test-env.js');
  
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
}
