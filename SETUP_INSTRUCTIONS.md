# 🚀 ASCEND App - Complete Backend Setup Instructions

## 📋 **Overview**
This guide will help you set up the complete backend infrastructure for the ASCEND app, ensuring all features work with proper data persistence and no data loss when users close tabs or refresh.

## 🗄️ **Step 1: Database Setup in Supabase**

### 1.1 Access Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your ASCEND project

### 1.2 Create Database Tables
1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the entire content from `database-schema.sql`
4. Click **Run** to execute the schema

### 1.3 Verify Tables Created
Go to **Table Editor** and verify these tables exist:
- ✅ `user_profiles`
- ✅ `life_audit_assessments`
- ✅ `user_progress`
- ✅ `workout_sessions`
- ✅ `coaching_sessions`
- ✅ `nutrition_plans`
- ✅ `daily_routines`
- ✅ `goals`
- ✅ `challenges`
- ✅ `community_posts`

## 🔧 **Step 2: Environment Configuration**

### 2.1 Update .env.local
Ensure your `.env.local` file contains:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lhtlhgaoukfrkkxmcbhy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGxoZ2FvdWtmcmtreG1jYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzMzNzQsImV4cCI6MjA3MjA0OTM3NH0.4VtXPwpVsScHq2aHONfiOCsY1SFU4YX4fSBPHIjHlvU

# Supabase JWT Secret (for server-side operations)
SUPABASE_JWT_SECRET=5WmZ4N1GqSwEmTPSVSBVt+E+YcAS0lcCX9jksOTguFTc/EawywHQR00rwnT4rEuibLnALMc0UiYajyeHQ+cqrw==

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
```

## 🚀 **Step 3: Test the Complete System**

### 3.1 Start the Development Server
```bash
npm run dev
```

### 3.2 Test User Registration
1. Go to `http://localhost:3001/register`
2. Create a new account
3. Verify user profile is created in Supabase

### 3.3 Test Life Audit Assessment
1. Complete the 77-question assessment
2. Verify data is saved to database
3. Check dashboard shows correct scores

### 3.4 Test Data Persistence
1. Complete assessment
2. Close browser tab
3. Reopen and go to dashboard
4. Verify data is still there

## 🔍 **Step 4: Troubleshooting Common Issues**

### 4.1 Assessment Shows 0% Score
**Problem**: Dashboard displays 0% Ascension Score
**Solution**: 
1. Check browser console for errors
2. Verify assessment data in Supabase
3. Check API response in Network tab

### 4.2 Database Connection Errors
**Problem**: "Failed to connect to database"
**Solution**:
1. Verify Supabase URL and keys
2. Check Row Level Security policies
3. Ensure tables exist

### 4.3 Authentication Issues
**Problem**: Users can't log in or stay logged in
**Solution**:
1. Check Supabase auth settings
2. Verify JWT secret configuration
3. Check browser storage permissions

## 📊 **Step 5: Monitor and Debug**

### 5.1 Check Database Logs
1. Go to Supabase Dashboard
2. Navigate to **Logs** section
3. Monitor API calls and database operations

### 5.2 Browser Developer Tools
1. Open Console tab
2. Look for error messages
3. Check Network tab for API responses

### 5.3 API Endpoint Testing
Test each endpoint manually:
- `GET /api/onboarding?userId={id}` - Get assessment status
- `POST /api/onboarding` - Submit assessment
- `GET /api/user/profile?userId={id}` - Get user profile
- `POST /api/user/progress` - Save progress

## 🎯 **Step 6: Verify All Features Work**

### 6.1 Core Features
- ✅ User Registration & Authentication
- ✅ Life Audit Assessment (77 questions)
- ✅ AI Analysis & Scoring
- ✅ Personalized Plans
- ✅ Dashboard with Real Data

### 6.2 AI-Powered Features
- ✅ AI Workout Plans
- ✅ AI Coaching Sessions
- ✅ AI Nutrition Plans
- ✅ Progress Tracking

### 6.3 Data Persistence
- ✅ Assessment results saved to database
- ✅ User progress tracked over time
- ✅ Data survives browser refresh/close
- ✅ Multiple device sync

## 🚀 **Step 7: Production Deployment**

### 7.1 Update Environment Variables
```bash
# Production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### 7.2 Build and Deploy
```bash
npm run build
npm start
```

### 7.3 Database Backup
1. Go to Supabase Dashboard
2. Navigate to **Settings** > **Database**
3. Create regular backups

## 📚 **Additional Resources**

### API Documentation
- **Onboarding**: `/api/onboarding`
- **User Profile**: `/api/user/profile`
- **Progress**: `/api/user/progress`
- **Workouts**: `/api/ai-workout`
- **Coaching**: `/api/ai-coaching`
- **Nutrition**: `/api/ai-nutrition`

### Database Schema
- **Tables**: 10 main tables with proper relationships
- **Security**: Row Level Security enabled
- **Indexes**: Performance optimized queries
- **Triggers**: Automatic timestamp updates

### Error Handling
- **Client-side**: Graceful fallbacks and user feedback
- **Server-side**: Comprehensive error logging
- **Database**: Transaction safety and rollback support

## 🎉 **Success Criteria**

Your ASCEND app is fully functional when:
1. ✅ Users can register and authenticate
2. ✅ Life Audit assessment works and saves data
3. ✅ Dashboard displays real assessment scores
4. ✅ Data persists across browser sessions
5. ✅ All AI features generate personalized content
6. ✅ Progress tracking works over time
7. ✅ No data loss on tab close or refresh

## 🆘 **Need Help?**

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Verify database tables and policies
4. Test API endpoints individually
5. Check Supabase logs for errors

The app is designed to be fully automated with AI-driven features and robust data persistence. Once set up correctly, users will have a seamless experience with their data safely stored and accessible across all devices! 🚀
