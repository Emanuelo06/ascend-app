    -- ASCEND App Complete Database Setup
    -- Run this in your Supabase SQL Editor to create all necessary tables
    -- URL: https://supabase.com/dashboard/project/lhtlhgaoukfrkkxmcbhy/editor

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
    -- 4. GOALS TABLE
    -- ==============================================
    CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    purpose TEXT,
    target_type TEXT NOT NULL CHECK (target_type IN ('numeric', 'boolean', 'milestone')),
    target_value JSONB NOT NULL,
    category TEXT NOT NULL,
    priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 3),
    state TEXT NOT NULL CHECK (state IN ('active', 'paused', 'completed', 'cancelled')),
    health TEXT NOT NULL CHECK (health IN ('green', 'yellow', 'red')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- ==============================================
    -- 5. HABITS TABLE
    -- ==============================================
    CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    purpose TEXT,
    moment TEXT NOT NULL CHECK (moment IN ('morning', 'afternoon', 'evening', 'anytime')),
    cadence JSONB NOT NULL,
    dose JSONB NOT NULL,
    "window" JSONB,
    difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- ==============================================
    -- 6. HABIT CHECK-INS TABLE
    -- ==============================================
    CREATE TABLE IF NOT EXISTS habit_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    value INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- ==============================================
    -- 7. CHALLENGES TABLE
    -- ==============================================
    CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('micro', 'macro', 'social', 'ai_generated')),
    duration_days INTEGER NOT NULL,
    xp_reward INTEGER NOT NULL,
    state TEXT NOT NULL CHECK (state IN ('active', 'completed', 'failed', 'paused')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- ==============================================
    -- 8. USER PROGRESS TABLE
    -- ==============================================
    CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood INTEGER CHECK (mood >= 1 AND mood <= 5),
    energy INTEGER CHECK (energy >= 1 AND energy <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- ==============================================
    -- 9. COACHING SESSIONS TABLE
    -- ==============================================
    CREATE TABLE IF NOT EXISTS coaching_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- ==============================================
    -- 10. NUTRITION PLANS TABLE
    -- ==============================================
    CREATE TABLE IF NOT EXISTS nutrition_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL,
    daily_calories INTEGER NOT NULL,
    macronutrients JSONB NOT NULL,
    meal_plan JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- ==============================================
    -- 11. WORKOUT SESSIONS TABLE
    -- ==============================================
    CREATE TABLE IF NOT EXISTS workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_type TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    exercises JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- ==============================================
    -- ENABLE ROW LEVEL SECURITY
    -- ==============================================
    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
    ALTER TABLE life_audit_assessments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
    ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
    ALTER TABLE habit_checkins ENABLE ROW LEVEL SECURITY;
    ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
    ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
    ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

    -- ==============================================
    -- CREATE RLS POLICIES
    -- ==============================================

    -- User Profiles Policies
    CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
    CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

    -- User XP Policies
    CREATE POLICY "Users can view their own XP" ON user_xp FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can update their own XP" ON user_xp FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own XP" ON user_xp FOR INSERT WITH CHECK (auth.uid() = user_id);

    -- Life Audit Assessments Policies
    CREATE POLICY "Users can view their own assessments" ON life_audit_assessments FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own assessments" ON life_audit_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own assessments" ON life_audit_assessments FOR UPDATE USING (auth.uid() = user_id);

    -- Goals Policies
    CREATE POLICY "Users can view their own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

    -- Habits Policies
    CREATE POLICY "Users can view their own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

    -- Habit Check-ins Policies
    CREATE POLICY "Users can view their own habit checkins" ON habit_checkins FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own habit checkins" ON habit_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own habit checkins" ON habit_checkins FOR UPDATE USING (auth.uid() = user_id);

    -- Challenges Policies
    CREATE POLICY "Users can view their own challenges" ON challenges FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own challenges" ON challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own challenges" ON challenges FOR UPDATE USING (auth.uid() = user_id);

    -- User Progress Policies
    CREATE POLICY "Users can view their own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

    -- Coaching Sessions Policies
    CREATE POLICY "Users can view their own coaching sessions" ON coaching_sessions FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own coaching sessions" ON coaching_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

    -- Nutrition Plans Policies
    CREATE POLICY "Users can view their own nutrition plans" ON nutrition_plans FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own nutrition plans" ON nutrition_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own nutrition plans" ON nutrition_plans FOR UPDATE USING (auth.uid() = user_id);

    -- Workout Sessions Policies
    CREATE POLICY "Users can view their own workout sessions" ON workout_sessions FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own workout sessions" ON workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

    -- ==============================================
    -- CREATE INDEXES FOR PERFORMANCE
    -- ==============================================

    -- User XP Indexes
    CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON user_xp(user_id);

    -- Life Audit Assessments Indexes
    CREATE INDEX IF NOT EXISTS idx_life_audit_assessments_user_id ON life_audit_assessments(user_id);
    CREATE INDEX IF NOT EXISTS idx_life_audit_assessments_created_at ON life_audit_assessments(created_at);

    -- Goals Indexes
    CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
    CREATE INDEX IF NOT EXISTS idx_goals_state ON goals(state);
    CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);

    -- Habits Indexes
    CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
    CREATE INDEX IF NOT EXISTS idx_habits_moment ON habits(moment);

    -- Habit Check-ins Indexes
    CREATE INDEX IF NOT EXISTS idx_habit_checkins_user_id ON habit_checkins(user_id);
    CREATE INDEX IF NOT EXISTS idx_habit_checkins_habit_id ON habit_checkins(habit_id);
    CREATE INDEX IF NOT EXISTS idx_habit_checkins_date ON habit_checkins(date);
    CREATE INDEX IF NOT EXISTS idx_habit_checkins_user_date ON habit_checkins(user_id, date);

    -- Challenges Indexes
    CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
    CREATE INDEX IF NOT EXISTS idx_challenges_state ON challenges(state);
    CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(type);

    -- User Progress Indexes
    CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(date);

    -- Coaching Sessions Indexes
    CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_coaching_sessions_created_at ON coaching_sessions(created_at);

    -- Nutrition Plans Indexes
    CREATE INDEX IF NOT EXISTS idx_nutrition_plans_user_id ON nutrition_plans(user_id);

    -- Workout Sessions Indexes
    CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_workout_sessions_created_at ON workout_sessions(created_at);

    -- ==============================================
    -- CREATE FUNCTIONS
    -- ==============================================

    -- Function to update updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Create triggers for updated_at (drop existing ones first)
    DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
    DROP TRIGGER IF EXISTS update_user_xp_updated_at ON user_xp;
    DROP TRIGGER IF EXISTS update_life_audit_assessments_updated_at ON life_audit_assessments;
    DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
    DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
    DROP TRIGGER IF EXISTS update_challenges_updated_at ON challenges;
    DROP TRIGGER IF EXISTS update_nutrition_plans_updated_at ON nutrition_plans;

    CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_user_xp_updated_at BEFORE UPDATE ON user_xp FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_life_audit_assessments_updated_at BEFORE UPDATE ON life_audit_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_nutrition_plans_updated_at BEFORE UPDATE ON nutrition_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    -- ==============================================
    -- COMPLETION MESSAGE
    -- ==============================================
    DO $$
    BEGIN
        RAISE NOTICE '🎉 ASCEND Database Setup Complete!';
        RAISE NOTICE '✅ All tables created successfully';
        RAISE NOTICE '🔒 Row Level Security enabled';
        RAISE NOTICE '📊 Indexes created for performance';
        RAISE NOTICE '⚡ Triggers set up for auto-updating timestamps';
        RAISE NOTICE '';
        RAISE NOTICE 'Your ASCEND app is now ready to use!';
    END $$;
