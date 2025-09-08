-- Essential Tables for ASCEND App
-- Run this in your Supabase SQL editor

-- User XP Table
CREATE TABLE IF NOT EXISTS user_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Life Audit Assessments Table
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

-- Goals Table
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

-- Habits Table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  purpose TEXT,
  moment TEXT NOT NULL CHECK (moment IN ('morning', 'afternoon', 'evening', 'anytime')),
  cadence JSONB NOT NULL,
  dose JSONB NOT NULL,
  window JSONB,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habit Check-ins Table
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

-- Challenges Table
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

-- Enable Row Level Security
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_audit_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own XP" ON user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own XP" ON user_xp FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own XP" ON user_xp FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessments" ON life_audit_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own assessments" ON life_audit_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assessments" ON life_audit_assessments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own habit checkins" ON habit_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habit checkins" ON habit_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habit checkins" ON habit_checkins FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own challenges" ON challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own challenges" ON challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own challenges" ON challenges FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON user_xp(user_id);
CREATE INDEX IF NOT EXISTS idx_life_audit_assessments_user_id ON life_audit_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_checkins_user_id ON habit_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_checkins_habit_id ON habit_checkins(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_checkins_date ON habit_checkins(date);
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
