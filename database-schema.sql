-- ASCEND App Enhanced Database Schema
-- Run this in your Supabase SQL editor to create all necessary tables

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- User Profiles Table (Enhanced)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'premium_plus')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Life Assessment Questions Table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('physical', 'mental', 'spiritual', 'relational', 'financial')),
  question_number INTEGER NOT NULL,
  response_scale INTEGER NOT NULL CHECK (response_scale IN (1, 2, 3, 4, 5)),
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Life Assessment Responses Table
CREATE TABLE IF NOT EXISTS assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  question_id UUID NOT NULL REFERENCES assessment_questions(id),
  response INTEGER NOT NULL CHECK (response >= 1 AND response <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Results Table
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  physical_score INTEGER NOT NULL CHECK (physical_score >= 0 AND physical_score <= 100),
  mental_score INTEGER NOT NULL CHECK (mental_score >= 0 AND mental_score <= 100),
  spiritual_score INTEGER NOT NULL CHECK (spiritual_score >= 0 AND spiritual_score <= 100),
  relational_score INTEGER NOT NULL CHECK (relational_score >= 0 AND relational_score <= 100),
  financial_score INTEGER NOT NULL CHECK (financial_score >= 0 AND financial_score <= 100),
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  strongest_area TEXT NOT NULL,
  biggest_opportunity TEXT NOT NULL,
  improvement_urgency TEXT NOT NULL CHECK (improvement_urgency IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Goals Table (Enhanced)
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('physical', 'mental', 'spiritual', 'relational', 'financial')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  target_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Progress Tracking Table
CREATE TABLE IF NOT EXISTS daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  spiritual_time INTEGER DEFAULT 0 CHECK (spiritual_time >= 0), -- minutes
  physical_activity INTEGER DEFAULT 0 CHECK (physical_activity >= 0), -- minutes
  mental_stimulation INTEGER DEFAULT 0 CHECK (mental_stimulation >= 0), -- minutes
  relational_quality INTEGER DEFAULT 0 CHECK (relational_quality >= 1 AND relational_quality <= 10),
  financial_actions INTEGER DEFAULT 0 CHECK (financial_actions >= 0), -- number of actions
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Bible Verses Table
CREATE TABLE IF NOT EXISTS bible_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_text TEXT NOT NULL,
  reference TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('motivation', 'consistency', 'faith', 'perseverance', 'growth', 'comfort', 'guidance')),
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Quotes Table
CREATE TABLE IF NOT EXISTS daily_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_text TEXT NOT NULL,
  author TEXT,
  category TEXT NOT NULL CHECK (category IN ('motivation', 'success', 'leadership', 'growth', 'wisdom', 'inspiration')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Daily Content Table (for tracking what content user has seen)
CREATE TABLE IF NOT EXISTS user_daily_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  verse_id UUID REFERENCES bible_verses(id),
  quote_id UUID REFERENCES daily_quotes(id),
  content_type TEXT NOT NULL CHECK (content_type IN ('verse', 'quote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date, content_type)
);

-- AI Recommendations Table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  recommendation_text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('goal', 'habit', 'spiritual', 'physical', 'mental', 'relational', 'financial')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  based_on TEXT NOT NULL, -- what data this recommendation is based on
  action_items JSONB, -- specific actions the user can take
  expires_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Habits Table
CREATE TABLE IF NOT EXISTS user_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  habit_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('physical', 'mental', 'spiritual', 'relational', 'financial')),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  target_count INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Reflections Table
CREATE TABLE IF NOT EXISTS daily_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  energy INTEGER CHECK (energy >= 1 AND energy <= 10),
  gratitude TEXT,
  challenges TEXT,
  wins TEXT,
  tomorrow_focus TEXT,
  sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  productivity INTEGER CHECK (productivity >= 1 AND productivity <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Habit Tracking Table
CREATE TABLE IF NOT EXISTS habit_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES user_habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, habit_id, date)
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_assessment_questions_category ON assessment_questions(category);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_user_date ON assessment_responses(user_id, assessment_date);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_date ON assessment_results(user_id, assessment_date);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_status ON user_goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON daily_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_bible_verses_category ON bible_verses(category);
CREATE INDEX IF NOT EXISTS idx_daily_quotes_category ON daily_quotes(category);
CREATE INDEX IF NOT EXISTS idx_user_daily_content_user_date ON user_daily_content(user_id, date);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_priority ON ai_recommendations(user_id, priority);
CREATE INDEX IF NOT EXISTS idx_user_habits_user_active ON user_habits(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_habit_tracking_user_habit_date ON habit_tracking(user_id, habit_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_date ON daily_reflections(user_id, date);

-- Create Updated At Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON user_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_habits_updated_at BEFORE UPDATE ON user_habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_reflections_updated_at BEFORE UPDATE ON daily_reflections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Everyone can view assessment questions" ON assessment_questions FOR SELECT USING (true);

CREATE POLICY "Users can view own assessment responses" ON assessment_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessment responses" ON assessment_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own assessment results" ON assessment_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessment results" ON assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON user_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON user_goals FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own daily progress" ON daily_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily progress" ON daily_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily progress" ON daily_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view bible verses" ON bible_verses FOR SELECT USING (true);

CREATE POLICY "Everyone can view daily quotes" ON daily_quotes FOR SELECT USING (true);

CREATE POLICY "Users can view own daily content" ON user_daily_content FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily content" ON user_daily_content FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own AI recommendations" ON ai_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI recommendations" ON ai_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own AI recommendations" ON ai_recommendations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own habits" ON user_habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON user_habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON user_habits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own habit tracking" ON habit_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit tracking" ON habit_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit tracking" ON habit_tracking FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own daily reflections" ON daily_reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily reflections" ON daily_reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily reflections" ON daily_reflections FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample data for testing
INSERT INTO user_profiles (id, email, full_name, subscription_tier) VALUES 
  ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User', 'free')
ON CONFLICT (id) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
