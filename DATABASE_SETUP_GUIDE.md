# 🚀 ASCEND Database Setup Guide

## 📋 Quick Setup Instructions

### Step 1: Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/lhtlhgaoukfrkkxmcbhy/editor
2. Sign in to your Supabase account
3. Navigate to the **SQL Editor** tab

### Step 2: Run the Database Setup Script
1. Click **"New Query"** in the SQL Editor
2. Copy the entire contents of `complete-database-setup.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** to execute the script

### Step 3: Verify Setup
After running the script, you should see:
- ✅ All tables created successfully
- 🔒 Row Level Security enabled
- 📊 Indexes created for performance
- ⚡ Triggers set up for auto-updating timestamps

## 📊 Tables Created

The script creates the following tables:

### Core User Tables
- **`user_profiles`** - User account information
- **`user_xp`** - Experience points and leveling system
- **`life_audit_assessments`** - Assessment results and analysis

### Goals & Habits System
- **`goals`** - User goals and objectives
- **`habits`** - Habit definitions and settings
- **`habit_checkins`** - Daily habit completion tracking
- **`challenges`** - Gamification challenges

### Progress & Analytics
- **`user_progress`** - Daily mood, energy, and notes
- **`coaching_sessions`** - AI coaching interactions
- **`nutrition_plans`** - Nutrition planning data
- **`workout_sessions`** - Workout tracking

## 🔒 Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Policies prevent cross-user data access

### Data Protection
- Foreign key constraints ensure data integrity
- Check constraints validate data ranges
- Cascade deletes maintain referential integrity

## ⚡ Performance Features

### Indexes
- Optimized indexes on frequently queried columns
- Composite indexes for complex queries
- Date-based indexes for time-series data

### Auto-Updates
- Triggers automatically update `updated_at` timestamps
- Ensures data freshness tracking

## 🧪 Testing the Setup

After running the script, test your app:

1. **Login** - Should work without 404 errors
2. **User Profile** - Should load successfully
3. **Assessment** - Should save results to database
4. **Goals/Habits** - Should create and track data
5. **Analytics** - Should display real progress data

## 🔧 Troubleshooting

### If you get permission errors:
- Make sure you're signed in to Supabase
- Check that you have admin access to the project
- Try running the script in smaller chunks

### If tables already exist:
- The script uses `CREATE TABLE IF NOT EXISTS`
- It will skip existing tables safely
- You can run it multiple times

### If you need to start over:
- Go to the **Table Editor** in Supabase
- Delete existing tables manually
- Re-run the setup script

## 📞 Support

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Verify your environment variables
3. Test individual table creation
4. Check the browser console for errors

---

**🎉 Once complete, your ASCEND app will have full database functionality!**
