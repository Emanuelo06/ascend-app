-- ASCEND App Robust Database Setup
-- This script handles existing tables with different schemas gracefully
-- Run this in your Supabase SQL Editor

-- ==============================================
-- 1. USER PROFILES TABLE (Enhanced)
-- ==============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'premium_plus')),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    assessment_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add onboarding_completed if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'onboarding_completed') THEN
        ALTER TABLE user_profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add assessment_completed if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'assessment_completed') THEN
        ALTER TABLE user_profiles ADD COLUMN assessment_completed BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add subscription_tier if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'subscription_tier') THEN
        ALTER TABLE user_profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free';
    END IF;
    
    -- Add subscription_expires_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'subscription_expires_at') THEN
        ALTER TABLE user_profiles ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- ==============================================
-- 2. USER XP TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS user_xp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 3. LIFE AUDIT ASSESSMENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS life_audit_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    questions JSONB NOT NULL,
    analysis JSONB NOT NULL,
    plan JSONB NOT NULL,
    ascension_score INTEGER NOT NULL,
    strongest_dimension TEXT NOT NULL,
    biggest_opportunity TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 4. USER GOALS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS user_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 5. HABITS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    target_count INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 6. HABIT CHECKINS TABLE (Handle existing table)
-- ==============================================
-- Drop and recreate the table to ensure correct schema
DROP TABLE IF EXISTS habit_checkins CASCADE;

CREATE TABLE habit_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 7. CHALLENGES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    xp_reward INTEGER DEFAULT 100,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 8. USER ACHIEVEMENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    xp_reward INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON user_xp(user_id);
CREATE INDEX IF NOT EXISTS idx_life_audit_assessments_user_id ON life_audit_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_checkins_habit_id ON habit_checkins(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_checkins_user_id ON habit_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_checkins_date ON habit_checkins(checkin_date);
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- ==============================================
-- ENABLE ROW LEVEL SECURITY
-- ==============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_audit_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- DROP EXISTING POLICIES (IF ANY) AND CREATE NEW ONES
-- ==============================================

-- User Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User XP Policies
DROP POLICY IF EXISTS "Users can view their own XP" ON user_xp;
DROP POLICY IF EXISTS "Users can update their own XP" ON user_xp;
DROP POLICY IF EXISTS "Users can insert their own XP" ON user_xp;

CREATE POLICY "Users can view their own XP" ON user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own XP" ON user_xp FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own XP" ON user_xp FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Life Audit Assessments Policies
DROP POLICY IF EXISTS "Users can view their own assessments" ON life_audit_assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON life_audit_assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON life_audit_assessments;

CREATE POLICY "Users can view their own assessments" ON life_audit_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own assessments" ON life_audit_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assessments" ON life_audit_assessments FOR UPDATE USING (auth.uid() = user_id);

-- User Goals Policies
DROP POLICY IF EXISTS "Users can view their own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can insert their own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON user_goals;

CREATE POLICY "Users can view their own goals" ON user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goals" ON user_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON user_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON user_goals FOR DELETE USING (auth.uid() = user_id);

-- Habits Policies
DROP POLICY IF EXISTS "Users can view their own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON habits;

CREATE POLICY "Users can view their own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- Habit Checkins Policies
DROP POLICY IF EXISTS "Users can view their own habit checkins" ON habit_checkins;
DROP POLICY IF EXISTS "Users can insert their own habit checkins" ON habit_checkins;
DROP POLICY IF EXISTS "Users can update their own habit checkins" ON habit_checkins;
DROP POLICY IF EXISTS "Users can delete their own habit checkins" ON habit_checkins;

CREATE POLICY "Users can view their own habit checkins" ON habit_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habit checkins" ON habit_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habit checkins" ON habit_checkins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habit checkins" ON habit_checkins FOR DELETE USING (auth.uid() = user_id);

-- Challenges Policies
DROP POLICY IF EXISTS "Users can view their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can insert their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can update their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can delete their own challenges" ON challenges;

CREATE POLICY "Users can view their own challenges" ON challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own challenges" ON challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own challenges" ON challenges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own challenges" ON challenges FOR DELETE USING (auth.uid() = user_id);

-- User Achievements Policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON user_achievements;

CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- CREATE TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ==============================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_user_xp_updated_at ON user_xp;
DROP TRIGGER IF EXISTS update_life_audit_assessments_updated_at ON life_audit_assessments;
DROP TRIGGER IF EXISTS update_user_goals_updated_at ON user_goals;
DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
DROP TRIGGER IF EXISTS update_challenges_updated_at ON challenges;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_xp_updated_at
    BEFORE UPDATE ON user_xp
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_life_audit_assessments_updated_at
    BEFORE UPDATE ON life_audit_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
    BEFORE UPDATE ON user_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================
DO $$
BEGIN
    RAISE NOTICE '✅ ASCEND Database setup completed successfully!';
    RAISE NOTICE '📊 Created/Updated tables: user_profiles, user_xp, life_audit_assessments, user_goals, habits, habit_checkins, challenges, user_achievements';
    RAISE NOTICE '🔒 Enabled Row Level Security with proper policies';
    RAISE NOTICE '⚡ Created indexes for performance';
    RAISE NOTICE '🔄 Created triggers for automatic timestamp updates';
    RAISE NOTICE '🚀 Your assessment should now work perfectly!';
END $$;
