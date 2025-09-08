#!/usr/bin/env node

/**
 * User Database Setup Script
 * 
 * This script sets up the complete user database architecture for ASCEND
 * It creates all necessary tables, functions, and relationships
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration. Please check your environment variables.');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up ASCEND User Database...\n');

  try {
    // 1. Create user profiles table
    console.log('📋 Creating user_profiles table...');
    await createUserProfilesTable();
    
    // 2. Create user XP table
    console.log('💰 Creating user_xp table...');
    await createUserXPTable();
    
    // 3. Create goals table
    console.log('🎯 Creating goals table...');
    await createGoalsTable();
    
    // 4. Create habits table
    console.log('🔄 Creating habits table...');
    await createHabitsTable();
    
    // 5. Create habit check-ins table
    console.log('✅ Creating habit_checkins table...');
    await createHabitCheckinsTable();
    
    // 6. Create challenges table
    console.log('🏆 Creating challenges table...');
    await createChallengesTable();
    
    // 7. Create user progress table
    console.log('📊 Creating user_progress table...');
    await createUserProgressTable();
    
    // 8. Create assessment results table
    console.log('📝 Creating life_audit_assessments table...');
    await createAssessmentTable();
    
    // 9. Create RLS policies
    console.log('🔒 Setting up Row Level Security policies...');
    await setupRLSPolicies();
    
    // 10. Create database functions
    console.log('⚙️ Creating database functions...');
    await createDatabaseFunctions();
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   • User profiles and authentication');
    console.log('   • Goals and challenges system');
    console.log('   • Habits and tracking');
    console.log('   • XP and gamification');
    console.log('   • Assessment results');
    console.log('   • Progress tracking');
    console.log('   • Row Level Security');
    console.log('   • Database functions');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

async function createUserProfilesTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'premium_plus')),
        onboarding_completed BOOLEAN DEFAULT FALSE,
        assessment_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create updated_at trigger
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
      
      CREATE TRIGGER update_user_profiles_updated_at 
        BEFORE UPDATE ON user_profiles 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `
  });
  
  if (error) throw error;
  console.log('   ✅ user_profiles table created');
}

async function createUserXPTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS user_xp (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        total_xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        badges JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id)
      );
      
      CREATE TRIGGER update_user_xp_updated_at 
        BEFORE UPDATE ON user_xp 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `
  });
  
  if (error) throw error;
  console.log('   ✅ user_xp table created');
}

async function createGoalsTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS goals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        purpose TEXT,
        target_type TEXT NOT NULL CHECK (target_type IN ('numeric', 'boolean', 'milestone')),
        target_value JSONB NOT NULL,
        category TEXT NOT NULL,
        priority INTEGER DEFAULT 1,
        state TEXT DEFAULT 'active' CHECK (state IN ('active', 'paused', 'completed', 'cancelled')),
        health TEXT DEFAULT 'green' CHECK (health IN ('green', 'yellow', 'red')),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TRIGGER update_goals_updated_at 
        BEFORE UPDATE ON goals 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `
  });
  
  if (error) throw error;
  console.log('   ✅ goals table created');
}

async function createHabitsTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS habits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        purpose TEXT,
        moment TEXT NOT NULL CHECK (moment IN ('morning', 'afternoon', 'evening', 'anytime')),
        cadence JSONB NOT NULL,
        dose JSONB NOT NULL,
        window JSONB,
        difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TRIGGER update_habits_updated_at 
        BEFORE UPDATE ON habits 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `
  });
  
  if (error) throw error;
  console.log('   ✅ habits table created');
}

async function createHabitCheckinsTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS habit_checkins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        value NUMERIC,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, habit_id, date)
      );
    `
  });
  
  if (error) throw error;
  console.log('   ✅ habit_checkins table created');
}

async function createChallengesTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS challenges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL CHECK (type IN ('micro', 'macro', 'social', 'ai_generated')),
        duration_days INTEGER NOT NULL,
        xp_reward INTEGER DEFAULT 0,
        state TEXT DEFAULT 'active' CHECK (state IN ('active', 'completed', 'failed', 'paused')),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TRIGGER update_challenges_updated_at 
        BEFORE UPDATE ON challenges 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `
  });
  
  if (error) throw error;
  console.log('   ✅ challenges table created');
}

async function createUserProgressTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS user_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        activities_completed TEXT[] DEFAULT '{}',
        mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
        energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, date)
      );
    `
  });
  
  if (error) throw error;
  console.log('   ✅ user_progress table created');
}

async function createAssessmentTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS life_audit_assessments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        questions JSONB NOT NULL,
        analysis JSONB NOT NULL,
        plan JSONB NOT NULL,
        ascension_score INTEGER NOT NULL,
        strongest_dimension TEXT NOT NULL,
        biggest_opportunity TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TRIGGER update_life_audit_assessments_updated_at 
        BEFORE UPDATE ON life_audit_assessments 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `
  });
  
  if (error) throw error;
  console.log('   ✅ life_audit_assessments table created');
}

async function setupRLSPolicies() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      -- Enable RLS on all tables
      ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
      ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
      ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
      ALTER TABLE habit_checkins ENABLE ROW LEVEL SECURITY;
      ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
      ALTER TABLE life_audit_assessments ENABLE ROW LEVEL SECURITY;
      
      -- User profiles policies
      CREATE POLICY "Users can view own profile" ON user_profiles
        FOR SELECT USING (auth.uid() = id);
      
      CREATE POLICY "Users can update own profile" ON user_profiles
        FOR UPDATE USING (auth.uid() = id);
      
      -- User XP policies
      CREATE POLICY "Users can view own XP" ON user_xp
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can update own XP" ON user_xp
        FOR ALL USING (auth.uid() = user_id);
      
      -- Goals policies
      CREATE POLICY "Users can manage own goals" ON goals
        FOR ALL USING (auth.uid() = user_id);
      
      -- Habits policies
      CREATE POLICY "Users can manage own habits" ON habits
        FOR ALL USING (auth.uid() = user_id);
      
      -- Habit check-ins policies
      CREATE POLICY "Users can manage own habit check-ins" ON habit_checkins
        FOR ALL USING (auth.uid() = user_id);
      
      -- Challenges policies
      CREATE POLICY "Users can manage own challenges" ON challenges
        FOR ALL USING (auth.uid() = user_id);
      
      -- User progress policies
      CREATE POLICY "Users can manage own progress" ON user_progress
        FOR ALL USING (auth.uid() = user_id);
      
      -- Assessment policies
      CREATE POLICY "Users can manage own assessments" ON life_audit_assessments
        FOR ALL USING (auth.uid() = user_id);
    `
  });
  
  if (error) throw error;
  console.log('   ✅ RLS policies created');
}

async function createDatabaseFunctions() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      -- Function to calculate user level from XP
      CREATE OR REPLACE FUNCTION calculate_user_level(total_xp INTEGER)
      RETURNS INTEGER AS $$
      BEGIN
        RETURN GREATEST(1, FLOOR(total_xp / 100) + 1);
      END;
      $$ LANGUAGE plpgsql;
      
      -- Function to get user streak
      CREATE OR REPLACE FUNCTION get_user_streak(user_uuid UUID)
      RETURNS INTEGER AS $$
      DECLARE
        streak_count INTEGER := 0;
        current_date DATE := CURRENT_DATE;
      BEGIN
        -- Count consecutive days with at least one completed habit
        WHILE EXISTS (
          SELECT 1 FROM habit_checkins hc
          JOIN habits h ON hc.habit_id = h.id
          WHERE h.user_id = user_uuid 
          AND hc.date = current_date 
          AND hc.completed = true
        ) LOOP
          streak_count := streak_count + 1;
          current_date := current_date - INTERVAL '1 day';
        END LOOP;
        
        RETURN streak_count;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Function to initialize new user
      CREATE OR REPLACE FUNCTION initialize_new_user(user_uuid UUID, user_email TEXT, user_name TEXT)
      RETURNS VOID AS $$
      BEGIN
        -- Create user profile
        INSERT INTO user_profiles (id, email, full_name)
        VALUES (user_uuid, user_email, user_name)
        ON CONFLICT (id) DO NOTHING;
        
        -- Create user XP record
        INSERT INTO user_xp (user_id, total_xp, level)
        VALUES (user_uuid, 0, 1)
        ON CONFLICT (user_id) DO NOTHING;
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  if (error) throw error;
  console.log('   ✅ Database functions created');
}

// Run the setup
setupDatabase().catch(console.error);
