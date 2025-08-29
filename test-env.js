// Test Environment Variables with dotenv
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Environment Variables with dotenv');
console.log('==========================================\n');

console.log('📋 Environment Variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('   URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('   Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...');
}

console.log('\n🔧 Testing Supabase Client Creation:');
try {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  console.log('✅ Supabase client created successfully!');
  
  // Test a simple query
  console.log('🧪 Testing connection...');
  supabase.from('test').select('*').limit(1).then(({ data, error }) => {
    if (error && error.code === 'PGRST116') {
      console.log('✅ Connection successful (table "test" doesn\'t exist, but connection works)');
    } else if (error) {
      console.log('⚠️  Connection test result:', error.message);
    } else {
      console.log('✅ Connection and query successful');
    }
  }).catch(err => {
    console.log('⚠️  Connection test error:', err.message);
  });
  
} catch (error) {
  console.log('❌ Error creating Supabase client:', error.message);
}

console.log('\n✨ Environment test complete!');
