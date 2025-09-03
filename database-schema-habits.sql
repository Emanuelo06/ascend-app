-- Habit Tracking System Database Schema
-- This schema supports the complete habit tracking functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends existing auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    notification_preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habits table
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    purpose TEXT,
    moment TEXT NOT NULL CHECK (moment IN ('morning', 'midday', 'evening')),
    cadence JSONB NOT NULL, -- { type: 'daily'|'weekdays'|'custom', days: [1,2,3,4,5,6,7] }
    dose JSONB, -- { unit: 'minutes'|'liters'|'count', target: number }
    window JSONB, -- { start: 'HH:MM', end: 'HH:MM' }
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habit checkins table
CREATE TABLE IF NOT EXISTS public.habit_checkins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('done', 'partial', 'skipped')),
    effort INTEGER CHECK (effort >= 0 AND effort <= 3),
    dose_actual JSONB, -- { unit: string, value: number }
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one checkin per habit per day per user
    UNIQUE(user_id, habit_id, date)
);

-- Habit metrics table (for tracking progress over time)
CREATE TABLE IF NOT EXISTS public.habit_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
    ema30 DECIMAL(5,4) DEFAULT 0.5, -- Exponential Moving Average (30-day)
    streak JSONB DEFAULT '{"current": 0, "best": 0, "lastDate": null, "graceTokens": 3}',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    last_updated DATE DEFAULT CURRENT_DATE,
    
    UNIQUE(user_id, habit_id)
);

-- Habit templates table (for pre-built habit packs)
CREATE TABLE IF NOT EXISTS public.habit_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    moment TEXT NOT NULL,
    cadence JSONB NOT NULL,
    dose JSONB,
    window JSONB,
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User habit templates (for customizing templates)
CREATE TABLE IF NOT EXISTS public.user_habit_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES public.habit_templates(id) ON DELETE CASCADE NOT NULL,
    customizations JSONB DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, template_id)
);

-- Weekly reviews table
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    top_wins JSONB DEFAULT '[]',
    opportunities JSONB DEFAULT '[]',
    ai_insights JSONB DEFAULT '[]',
    action_plan JSONB DEFAULT '[]',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, week_start)
);

-- AI insights table
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('weekly', 'habit', 'onboarding')),
    content TEXT NOT NULL,
    action TEXT,
    micro_challenge TEXT,
    applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habit streaks and achievements
CREATE TABLE IF NOT EXISTS public.habit_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('streak', 'milestone', 'consistency')),
    title TEXT NOT NULL,
    description TEXT,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('reminder', 'achievement', 'insight', 'weekly_review')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_moment ON public.habits(moment);
CREATE INDEX IF NOT EXISTS idx_habits_archived ON public.habits(archived);

CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON public.habit_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_habit_id ON public.habit_checkins(habit_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON public.habit_checkins(date);
CREATE INDEX IF NOT EXISTS idx_checkins_status ON public.habit_checkins(status);

CREATE INDEX IF NOT EXISTS idx_metrics_user_id ON public.habit_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_metrics_habit_id ON public.habit_metrics(habit_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.weekly_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_week_start ON public.weekly_reviews(week_start);

CREATE INDEX IF NOT EXISTS idx_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_type ON public.ai_insights(type);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_reviews_updated_at BEFORE UPDATE ON public.weekly_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate habit streak
CREATE OR REPLACE FUNCTION calculate_habit_streak(p_habit_id UUID, p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    streak_count INTEGER := 0;
    current_date DATE := CURRENT_DATE;
    checkin_date DATE;
BEGIN
    -- Get the most recent checkin for this habit
    SELECT date INTO checkin_date
    FROM public.habit_checkins
    WHERE habit_id = p_habit_id 
      AND user_id = p_user_id 
      AND status = 'done'
    ORDER BY date DESC
    LIMIT 1;
    
    IF checkin_date IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Calculate consecutive days
    WHILE checkin_date <= current_date LOOP
        -- Check if there's a 'done' checkin for this date
        IF EXISTS (
            SELECT 1 FROM public.habit_checkins 
            WHERE habit_id = p_habit_id 
              AND user_id = p_user_id 
              AND date = checkin_date 
              AND status = 'done'
        ) THEN
            streak_count := streak_count + 1;
            checkin_date := checkin_date + INTERVAL '1 day';
        ELSE
            EXIT;
        END IF;
    END LOOP;
    
    RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get weekly progress
CREATE OR REPLACE FUNCTION get_weekly_progress(p_user_id UUID, p_week_start DATE)
RETURNS TABLE(
    total_habits BIGINT,
    completed_habits BIGINT,
    progress_percentage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH week_checkins AS (
        SELECT DISTINCT habit_id
        FROM public.habit_checkins
        WHERE user_id = p_user_id
          AND date BETWEEN p_week_start AND (p_week_start + INTERVAL '6 days')
          AND status = 'done'
    )
    SELECT 
        COUNT(h.id)::BIGINT as total_habits,
        COUNT(wc.habit_id)::BIGINT as completed_habits,
        CASE 
            WHEN COUNT(h.id) > 0 THEN 
                ROUND((COUNT(wc.habit_id)::DECIMAL / COUNT(h.id)::DECIMAL) * 100)
            ELSE 0 
        END::INTEGER as progress_percentage
    FROM public.habits h
    LEFT JOIN week_checkins wc ON h.id = wc.habit_id
    WHERE h.user_id = p_user_id AND h.archived = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Insert sample habit templates
INSERT INTO public.habit_templates (name, description, category, moment, cadence, dose, window, difficulty) VALUES
('Morning Prayer', 'Start the day with gratitude and spiritual connection', 'faith', 'morning', '{"type": "daily"}', '{"unit": "minutes", "target": 10}', '{"start": "07:00", "end": "11:00"}', 2),
('Hydration', 'Stay hydrated throughout the day', 'health', 'morning', '{"type": "daily"}', '{"unit": "liters", "target": 2}', '{"start": "06:00", "end": "22:00"}', 1),
('Deep Work', 'Uninterrupted focused work sessions', 'productivity', 'morning', '{"type": "weekdays"}', '{"unit": "minutes", "target": 90}', '{"start": "08:00", "end": "12:00"}', 3),
('Mindful Breaks', 'Take intentional breaks to maintain focus', 'wellness', 'midday', '{"type": "daily"}', '{"unit": "minutes", "target": 5}', '{"start": "12:00", "end": "14:00"}', 1),
('Evening Reflection', 'End the day with gratitude and prayer', 'faith', 'evening', '{"type": "daily"}', '{"unit": "minutes", "target": 5}', '{"start": "20:00", "end": "22:00"}', 1)
ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for habits
CREATE POLICY "Users can view own habits" ON public.habits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits" ON public.habits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits" ON public.habits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits" ON public.habits
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for habit_checkins
CREATE POLICY "Users can view own checkins" ON public.habit_checkins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins" ON public.habit_checkins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkins" ON public.habit_checkins
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for habit_metrics
CREATE POLICY "Users can view own metrics" ON public.habit_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics" ON public.habit_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics" ON public.habit_metrics
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for weekly_reviews
CREATE POLICY "Users can view own reviews" ON public.weekly_reviews
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews" ON public.weekly_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.weekly_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_insights
CREATE POLICY "Users can view own insights" ON public.ai_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights" ON public.ai_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON public.ai_insights
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
