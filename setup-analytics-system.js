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

async function setupAnalyticsSystem() {
  console.log('🚀 ASCEND Analytics & Weekly Review System Setup');
  console.log('================================================\n');
  
  console.log('This script will help you set up the complete analytics system for ASCEND.');
  console.log('The system includes:\n');
  
  console.log('✅ Enhanced database schema for analytics');
  console.log('✅ Weekly snapshots and progress tracking');
  console.log('✅ AI-powered insights and recommendations');
  console.log('✅ Unified Weekly Review & Analytics page');
  console.log('✅ Background jobs for data processing');
  console.log('✅ Complete API routes using Next.js App Router\n');

  const proceed = await question('Do you want to proceed with the setup? (y/n): ');
  
  if (proceed.toLowerCase() !== 'y') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }

  console.log('\n📋 Setup Steps:');
  console.log('================\n');

  console.log('1. 📊 Database Schema Setup');
  console.log('   - Run the enhanced analytics schema in your Supabase SQL editor');
  console.log('   - File: database-schema-analytics.sql');
  console.log('   - This adds tables for weekly snapshots, heatmaps, insights, and focus areas\n');

  console.log('2. 🔧 Environment Variables');
  console.log('   - Add ADMIN_SECRET to your .env.local file');
  console.log('   - This is used for background job authentication\n');

  console.log('3. 🚀 API Routes');
  console.log('   - All API routes are already created in src/app/api/');
  console.log('   - Routes include: weekly-snapshot, progress-heatmap, insights, weekly-focus\n');

  console.log('4. 🎨 Frontend Page');
  console.log('   - Analytics page is created at src/app/(dashboard)/analytics/page.tsx');
  console.log('   - Unified Weekly Review & Analytics interface\n');

  console.log('5. ⚙️ Background Jobs');
  console.log('   - Daily rollup job for data processing');
  console.log('   - Cron scheduler for automated tasks\n');

  const addAdminSecret = await question('\nDo you want to add ADMIN_SECRET to your .env.local file? (y/n): ');
  
  if (addAdminSecret.toLowerCase() === 'y') {
    const adminSecret = await question('Enter your admin secret (or press Enter for auto-generated): ');
    
    const secret = adminSecret || generateRandomSecret();
    
    // Read existing .env.local or create new one
    const envPath = path.join(__dirname, '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    } else {
      // Create from env.example
      const envExamplePath = path.join(__dirname, 'env.example');
      if (fs.existsSync(envExamplePath)) {
        envContent = fs.readFileSync(envExamplePath, 'utf8');
      }
    }
    
    // Add or update ADMIN_SECRET
    if (envContent.includes('ADMIN_SECRET=')) {
      envContent = envContent.replace(/ADMIN_SECRET=.*/, `ADMIN_SECRET=${secret}`);
    } else {
      envContent += `\n# Admin secret for background jobs\nADMIN_SECRET=${secret}\n`;
    }
    
    try {
      fs.writeFileSync(envPath, envContent);
      console.log('✅ ADMIN_SECRET added to .env.local');
    } catch (error) {
      console.log('❌ Error writing to .env.local:', error.message);
      console.log('Please manually add ADMIN_SECRET to your .env.local file');
    }
  }

  console.log('\n📝 Manual Steps Required:');
  console.log('==========================\n');

  console.log('1. 🗄️ Database Setup:');
  console.log('   - Go to your Supabase project dashboard');
  console.log('   - Navigate to SQL Editor');
  console.log('   - Run the contents of database-schema-analytics.sql');
  console.log('   - This will create all necessary tables and functions\n');

  console.log('2. 🔄 Start Background Jobs:');
  console.log('   - Add this to your app initialization (e.g., in layout.tsx or _app.tsx):');
  console.log('   ```typescript');
  console.log('   import { cronScheduler } from "@/lib/cron-scheduler";');
  console.log('   ');
  console.log('   // Start background jobs (only in production or when needed)');
  console.log('   if (process.env.NODE_ENV === "production") {');
  console.log('     cronScheduler.startAllJobs();');
  console.log('   }');
  console.log('   ```\n');

  console.log('3. 🧪 Test the System:');
  console.log('   - Start your development server: npm run dev');
  console.log('   - Navigate to /analytics in your app');
  console.log('   - Create some habits and check-ins');
  console.log('   - Test the weekly snapshot generation\n');

  console.log('4. 📊 API Endpoints:');
  console.log('   - GET /api/analytics/weekly-snapshot?userId={id}');
  console.log('   - GET /api/analytics/progress-heatmap?userId={id}&period=30');
  console.log('   - GET /api/analytics/insights?userId={id}&type=weekly');
  console.log('   - GET /api/analytics/weekly-focus?userId={id}');
  console.log('   - POST /api/admin/daily-rollup (with ADMIN_SECRET)\n');

  console.log('🎯 Features Included:');
  console.log('=====================\n');

  console.log('✅ Weekly Snapshot Card:');
  console.log('   - Completion percentage, streaks, mood tracking');
  console.log('   - AI-generated weekly summary');
  console.log('   - Best/worst moments analysis\n');

  console.log('✅ Progress Tracking:');
  console.log('   - Daily heatmap (last 30 days)');
  console.log('   - Weekly trends (Mon-Sun)');
  console.log('   - Monthly overview (coming soon)\n');

  console.log('✅ AI Insights:');
  console.log('   - Personalized recommendations');
  console.log('   - Action buttons (apply/dismiss)');
  console.log('   - Priority-based insights\n');

  console.log('✅ Wins & Challenges:');
  console.log('   - Positive framing of achievements');
  console.log('   - Opportunity-focused challenges\n');

  console.log('✅ Forward Focus:');
  console.log('   - Weekly goal setting');
  console.log('   - AI-generated focus areas');
  console.log('   - Progress tracking\n');

  console.log('🔧 Troubleshooting:');
  console.log('===================\n');

  console.log('If you encounter issues:');
  console.log('1. Check that all database tables are created');
  console.log('2. Verify environment variables are set');
  console.log('3. Check browser console for errors');
  console.log('4. Verify API routes are accessible');
  console.log('5. Check Supabase logs for database errors\n');

  console.log('📚 Documentation:');
  console.log('=================\n');

  console.log('All files include comprehensive comments and documentation.');
  console.log('Key files to review:');
  console.log('- database-schema-analytics.sql (database structure)');
  console.log('- src/app/api/analytics/* (API routes)');
  console.log('- src/app/(dashboard)/analytics/page.tsx (frontend)');
  console.log('- src/lib/cron-scheduler.ts (background jobs)\n');

  console.log('🎉 Setup Complete!');
  console.log('==================\n');

  console.log('Your ASCEND analytics system is ready!');
  console.log('Follow the manual steps above to complete the setup.');
  console.log('The system will provide users with comprehensive insights');
  console.log('into their habit progress and weekly performance.\n');

  rl.close();
}

function generateRandomSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

setupAnalyticsSystem().catch(console.error);
