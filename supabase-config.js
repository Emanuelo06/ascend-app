



// Supabase Configuration
// Copy these values to your .env.local file

const supabaseConfig = {
  // Supabase URL
  NEXT_PUBLIC_SUPABASE_URL: "https://lhtlhgaoukfrkkxmcbhy.supabase.co",
  
  // Supabase Anonymous Key (Public)
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGxoZ2FvdWtmcmtreG1jYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMzNzQsImV4cCI6MjA3MjA0OTM3NH0.4VtXPwpVsScHq2aHONfiOCsY1SFU4YX4fSBPHIjHlvU",
  
  // Supabase JWT Secret (for server-side operations)
  SUPABASE_JWT_SECRET: "5WmZ4N1GqSwEmTPSVSBVt+E+YcAS0lcCX9jksOTguFTc/EawywHQR00rwnT4rEuibLnALMc0UiYajyeHQ+cqrw==",
  
  // App Configuration
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NODE_ENV: "development"
};

// Instructions:
// 1. Create a file called .env.local in your project root
// 2. Copy the key-value pairs below into that file
// 3. Remove the quotes around the values
// 4. Restart your development server

console.log("Copy these to your .env.local file:");
console.log("");
console.log("NEXT_PUBLIC_SUPABASE_URL=https://lhtlhgaoukfrkkxmcbhy.supabase.co");
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGxoZ2FvdWtmcmtreG1jYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMzNzQsImV4cCI6MjA3MjA0OTM3NH0.4VtXPwpVsScHq2aHONfiOCsY1SFU4YX4fSBPHIjHlvU");
console.log("SUPABASE_JWT_SECRET=5WmZ4N1GqSwEmTPSVSBVt+E+YcAS0lcCX9jksOTguFTc/EawywHQR00rwnT4rEuibLnALMc0UiYajyeHQ+cqrw==");
console.log("NEXT_PUBLIC_APP_URL=http://localhost:3000");
console.log("NODE_ENV=development");

export default supabaseConfig;
