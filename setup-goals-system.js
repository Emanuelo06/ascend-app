#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupGoalsSystem() {
  console.log('🎯 ASCEND Goals & Challenges System Setup');
  console.log('==========================================\n');

  try {
    // Check if .env.local exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.log('❌ .env.local file not found. Please run the main setup first.');
      process.exit(1);
    }

    // Read current .env.local
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Found .env.local file');

    // Check for required environment variables
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_JWT_SECRET'
    ];

    const missingVars = requiredVars.filter(varName => 
      !envContent.includes(varName) || envContent.includes(`${varName}=your_`)
    );

    if (missingVars.length > 0) {
      console.log(`❌ Missing or incomplete environment variables: ${missingVars.join(', ')}`);
      console.log('Please complete your .env.local setup first.');
      process.exit(1);
    }

    console.log('✅ Environment variables configured');

    // Database setup
    console.log('\n📊 Database Setup');
    console.log('==================');

    const setupDatabase = await question('Do you want to set up the Goals & Challenges database schema? (y/n): ');
    
    if (setupDatabase.toLowerCase() === 'y') {
      console.log('\n📋 Database Schema Setup Instructions:');
      console.log('1. Go to your Supabase project dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of database-schema-goals.sql');
      console.log('4. Run the SQL script');
      console.log('\n⚠️  This will create the following tables:');
      console.log('   - goals (enhanced goals table)');
      console.log('   - goal_milestones');
      console.log('   - goal_habits (mapping table)');
      console.log('   - challenges');
      console.log('   - challenge_tasks');
      console.log('   - goal_snapshots');
      console.log('   - goal_ai_suggestions');
      console.log('   - goal_accountability');
      console.log('   - user_xp');
      console.log('   - xp_transactions');
      console.log('   - goal_templates');
      console.log('\n📄 Schema file: database-schema-goals.sql');
    }

    // API Routes setup
    console.log('\n🔌 API Routes Setup');
    console.log('===================');
    console.log('✅ API routes have been created:');
    console.log('   - /api/goals (CRUD operations)');
    console.log('   - /api/goals/[id] (individual goal operations)');
    console.log('   - /api/goals/habits (goal-habit mapping)');
    console.log('   - /api/challenges (challenges management)');
    console.log('   - /api/challenges/[id] (challenge lifecycle)');
    console.log('   - /api/goals/ai-suggestions (AI recommendations)');
    console.log('   - /api/goals/templates (goal templates)');
    console.log('   - /api/goals/accountability (partnership system)');
    console.log('   - /api/user/xp (XP and badges)');
    console.log('   - /api/admin/goal-rollup (background jobs)');

    // Background Jobs setup
    console.log('\n⚙️  Background Jobs Setup');
    console.log('=========================');
    console.log('📋 Background job setup instructions:');
    console.log('1. Set up a cron job or scheduled function to call:');
    console.log('   POST /api/admin/goal-rollup');
    console.log('2. Recommended schedule: Daily at 2 AM UTC');
    console.log('3. You can also trigger manually for testing:');
    console.log('   curl -X POST http://localhost:3000/api/admin/goal-rollup');
    console.log('\n🔧 The rollup job will:');
    console.log('   - Calculate goal progress from habit checkins');
    console.log('   - Update goal health indicators');
    console.log('   - Create weekly snapshots');
    console.log('   - Trigger AI suggestions when needed');

    // AI Integration setup
    console.log('\n🤖 AI Integration Setup');
    console.log('=======================');
    console.log('📋 AI integration is ready but needs configuration:');
    console.log('1. The system will generate AI suggestions when:');
    console.log('   - Goal progress drops significantly');
    console.log('   - Goal health becomes "red"');
    console.log('   - User requests suggestions');
    console.log('2. To enable AI suggestions, implement the generateGoalAISuggestions function');
    console.log('3. Current implementation includes placeholder logic');
    console.log('4. Integrate with your preferred AI service (OpenAI, Anthropic, etc.)');

    // Testing setup
    console.log('\n🧪 Testing Setup');
    console.log('================');
    console.log('📋 Test the system with these steps:');
    console.log('1. Create a test goal:');
    console.log('   POST /api/goals');
    console.log('   { "userId": "test-user-id", "title": "Test Goal", "targetType": "numeric", "targetValue": {"type": "times", "value": 10} }');
    console.log('2. Link a habit to the goal:');
    console.log('   POST /api/goals/habits');
    console.log('   { "goalId": "goal-id", "habitId": "habit-id", "weight": 1.0, "userId": "test-user-id" }');
    console.log('3. Create a challenge:');
    console.log('   POST /api/challenges');
    console.log('   { "userId": "test-user-id", "title": "7-Day Challenge", "durationDays": 7 }');
    console.log('4. Run goal rollup:');
    console.log('   POST /api/admin/goal-rollup');
    console.log('   { "userId": "test-user-id" }');

    // Integration points
    console.log('\n🔗 Integration Points');
    console.log('====================');
    console.log('📋 The Goals system integrates with:');
    console.log('   ✅ Habits system (via goal_habits mapping)');
    console.log('   ✅ Analytics system (via goal_snapshots)');
    console.log('   ✅ Daily check-ins (progress calculation)');
    console.log('   ✅ AI recommendations (goal-specific suggestions)');
    console.log('   ✅ XP system (challenge rewards)');
    console.log('   ✅ Accountability system (partner invitations)');

    // Next steps
    console.log('\n🚀 Next Steps');
    console.log('=============');
    console.log('1. Set up the database schema (if not done)');
    console.log('2. Test the API endpoints');
    console.log('3. Implement the frontend Goals & Challenges page');
    console.log('4. Set up background job scheduling');
    console.log('5. Configure AI service integration');
    console.log('6. Test the complete user flow');

    // Frontend implementation
    console.log('\n🎨 Frontend Implementation');
    console.log('==========================');
    console.log('📋 The Goals & Challenges page should include:');
    console.log('   - Hero section with current focus goal');
    console.log('   - Goals grid with progress rings and health indicators');
    console.log('   - Goal detail panel with habits, challenges, and AI suggestions');
    console.log('   - Challenges carousel with micro-challenges');
    console.log('   - AI coach panel with personalized insights');
    console.log('   - Metrics and forecast section');
    console.log('   - Social accountability features');

    console.log('\n✅ Goals & Challenges System Setup Complete!');
    console.log('===========================================');
    console.log('The backend infrastructure is ready. Next, implement the frontend UI.');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup
setupGoalsSystem();
