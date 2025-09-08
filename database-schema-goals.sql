-- Goals & Challenges System Database Schema
-- This schema implements the comprehensive goals-first system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enhanced Goals Table (replaces basic user_goals)
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    purpose TEXT, -- one-line why
    target_type TEXT NOT NULL CHECK (target_type IN ('numeric', 'duration', 'frequency', 'binary', 'milestone')),
    target_value JSONB NOT NULL, -- e.g., { type:"times", value:12 } or { type:"minutes", value:600 }
    start_date DATE DEFAULT CURRENT_DATE,
    target_date DATE,
    progress_pct DECIMAL(5,2) DEFAULT 0.0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
    priority INTEGER DEFAULT 0, -- user-order for drag & drop
    state TEXT DEFAULT 'active' CHECK (state IN ('active', 'paused', 'archived', 'completed')),
    health TEXT DEFAULT 'green' CHECK (health IN ('green', 'yellow', 'red')),
    metadata JSONB DEFAULT '{}', -- tags, source (onboarding/template/ai)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goal Milestones Table
CREATE TABLE IF NOT EXISTS public.goal_milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    achieved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goal-Habit Mapping Table (many-to-many with weights)
CREATE TABLE IF NOT EXISTS public.goal_habits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
    weight DECIMAL(3,2) DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1), -- relative contribution
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(goal_id, habit_id)
);

-- Challenges Table (micro-programs 3-21 days)
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE, -- optional
    title TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL CHECK (duration_days >= 1 AND duration_days <= 21),
    reward_xp INTEGER DEFAULT 0,
    reward_badge TEXT,
    cadence JSONB DEFAULT '{"type": "daily"}', -- challenge frequency
    challenge_state TEXT DEFAULT 'planned' CHECK (challenge_state IN ('planned', 'running', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge Tasks (habits/rules within a challenge)
CREATE TABLE IF NOT EXISTS public.challenge_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE, -- optional
    task_type TEXT NOT NULL CHECK (task_type IN ('habit', 'rule', 'custom')),
    title TEXT NOT NULL,
    description TEXT,
    daily_requirement JSONB, -- e.g., { unit: "minutes", target: 5 }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goal Snapshots (weekly progress tracking)
CREATE TABLE IF NOT EXISTS public.goal_snapshots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    iso_week TEXT NOT NULL, -- YYYY-WW format
    progress_pct DECIMAL(5,2) DEFAULT 0.0,
    momentum DECIMAL(5,2) DEFAULT 0.0, -- vs previous week
    avg_effort DECIMAL(3,2) DEFAULT 0.0,
    ai_summary JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(goal_id, iso_week)
);

-- AI Suggestions for Goals
CREATE TABLE IF NOT EXISTS public.goal_ai_suggestions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('move_time', 'change_dose', 'micro_challenge', 'new_habit', 'accountability')),
    short_text TEXT NOT NULL, -- <=10 words
    rationale TEXT NOT NULL, -- <=30 words with evidence
    estimated_effort TEXT NOT NULL CHECK (estimated_effort IN ('low', 'medium', 'high')),
    projected_impact TEXT CHECK (projected_impact IN ('low', 'medium', 'high')),
    payload JSONB DEFAULT '{}', -- specific implementation data
    evidence TEXT NOT NULL, -- data snippet supporting the suggestion
    confidence_score DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
    applied_at TIMESTAMP WITH TIME ZONE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accountability Partners
CREATE TABLE IF NOT EXISTS public.goal_accountability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    partner_user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    partner_email TEXT, -- for pending invites
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'removed')),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User XP and Badges System
CREATE TABLE IF NOT EXISTS public.user_xp (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges JSONB DEFAULT '[]',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- XP Transactions (for tracking XP sources)
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('habit_completion', 'challenge_completion', 'streak_milestone', 'goal_milestone', 'bonus')),
    source_id UUID, -- reference to the source (habit_id, challenge_id, etc.)
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goal Templates (for onboarding and suggestions)
CREATE TABLE IF NOT EXISTS public.goal_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    purpose TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('physical', 'mental', 'spiritual', 'relational', 'financial')),
    target_type TEXT NOT NULL,
    target_value JSONB NOT NULL,
    suggested_duration_days INTEGER DEFAULT 30,
    starter_habits JSONB DEFAULT '[]', -- array of habit templates
    difficulty_level INTEGER DEFAULT 2 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_state ON public.goals(state);
CREATE INDEX IF NOT EXISTS idx_goals_priority ON public.goals(priority);
CREATE INDEX IF NOT EXISTS idx_goals_health ON public.goals(health);

CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON public.goal_milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_due_date ON public.goal_milestones(due_date);

CREATE INDEX IF NOT EXISTS idx_goal_habits_goal_id ON public.goal_habits(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_habits_habit_id ON public.goal_habits(habit_id);

CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON public.challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_goal_id ON public.challenges(goal_id);
CREATE INDEX IF NOT EXISTS idx_challenges_state ON public.challenges(challenge_state);

CREATE INDEX IF NOT EXISTS idx_challenge_tasks_challenge_id ON public.challenge_tasks(challenge_id);

CREATE INDEX IF NOT EXISTS idx_goal_snapshots_goal_id ON public.goal_snapshots(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_snapshots_iso_week ON public.goal_snapshots(iso_week);

CREATE INDEX IF NOT EXISTS idx_goal_ai_suggestions_goal_id ON public.goal_ai_suggestions(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_ai_suggestions_applied ON public.goal_ai_suggestions(applied_at);

CREATE INDEX IF NOT EXISTS idx_goal_accountability_goal_id ON public.goal_accountability(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_accountability_status ON public.goal_accountability(status);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate goal progress
CREATE OR REPLACE FUNCTION calculate_goal_progress(p_goal_id UUID, p_start_date DATE DEFAULT NULL, p_end_date DATE DEFAULT NULL)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    goal_record RECORD;
    habit_record RECORD;
    total_weight DECIMAL(5,2) := 0;
    weighted_score DECIMAL(5,2) := 0;
    habit_score DECIMAL(5,2);
    expected_occurrences INTEGER;
    actual_occurrences DECIMAL(5,2);
    period_start DATE;
    period_end DATE;
BEGIN
    -- Get goal details
    SELECT * INTO goal_record FROM public.goals WHERE id = p_goal_id;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Set period dates
    period_start := COALESCE(p_start_date, goal_record.start_date);
    period_end := COALESCE(p_end_date, CURRENT_DATE);
    
    -- Calculate weighted progress from mapped habits
    FOR habit_record IN 
        SELECT h.*, gh.weight
        FROM public.goal_habits gh
        JOIN public.habits h ON gh.habit_id = h.id
        WHERE gh.goal_id = p_goal_id AND h.archived = FALSE
    LOOP
        -- Calculate expected occurrences based on cadence
        expected_occurrences := calculate_expected_occurrences(
            habit_record.cadence, 
            period_start, 
            period_end
        );
        
        -- Calculate actual occurrences from checkins
        SELECT COALESCE(
            SUM(CASE 
                WHEN status = 'done' THEN 1.0
                WHEN status = 'partial' THEN 0.5
                ELSE 0.0
            END), 0
        ) INTO actual_occurrences
        FROM public.habit_checkins
        WHERE habit_id = habit_record.id
          AND date BETWEEN period_start AND period_end;
        
        -- Calculate habit score
        IF expected_occurrences > 0 THEN
            habit_score := (actual_occurrences / expected_occurrences) * 100;
        ELSE
            habit_score := 0;
        END IF;
        
        -- Add to weighted total
        weighted_score := weighted_score + (habit_score * habit_record.weight);
        total_weight := total_weight + habit_record.weight;
    END LOOP;
    
    -- Return final progress percentage
    IF total_weight > 0 THEN
        RETURN LEAST(100.0, GREATEST(0.0, weighted_score / total_weight));
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate expected occurrences based on cadence
CREATE OR REPLACE FUNCTION calculate_expected_occurrences(p_cadence JSONB, p_start_date DATE, p_end_date DATE)
RETURNS INTEGER AS $$
DECLARE
    cadence_type TEXT;
    days_array INTEGER[];
    total_days INTEGER;
    expected_count INTEGER := 0;
    current_date DATE;
    day_of_week INTEGER;
BEGIN
    cadence_type := p_cadence->>'type';
    total_days := p_end_date - p_start_date + 1;
    
    CASE cadence_type
        WHEN 'daily' THEN
            expected_count := total_days;
        WHEN 'weekdays' THEN
            -- Count weekdays (Monday=1 to Friday=5)
            current_date := p_start_date;
            WHILE current_date <= p_end_date LOOP
                day_of_week := EXTRACT(DOW FROM current_date);
                IF day_of_week BETWEEN 1 AND 5 THEN
                    expected_count := expected_count + 1;
                END IF;
                current_date := current_date + INTERVAL '1 day';
            END LOOP;
        WHEN 'custom' THEN
            -- Use days array from cadence
            days_array := ARRAY(SELECT jsonb_array_elements_text(p_cadence->'days')::INTEGER);
            current_date := p_start_date;
            WHILE current_date <= p_end_date LOOP
                day_of_week := EXTRACT(DOW FROM current_date);
                IF day_of_week = ANY(days_array) THEN
                    expected_count := expected_count + 1;
                END IF;
                current_date := current_date + INTERVAL '1 day';
            END LOOP;
        ELSE
            expected_count := 0;
    END CASE;
    
    RETURN expected_count;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate goal health
CREATE OR REPLACE FUNCTION calculate_goal_health(p_goal_id UUID)
RETURNS TEXT AS $$
DECLARE
    goal_record RECORD;
    recent_snapshots RECORD;
    momentum DECIMAL(5,2);
    avg_consistency DECIMAL(5,2);
BEGIN
    -- Get goal details
    SELECT * INTO goal_record FROM public.goals WHERE id = p_goal_id;
    
    IF NOT FOUND THEN
        RETURN 'green';
    END IF;
    
    -- Get recent momentum (last 2 weeks)
    SELECT momentum INTO recent_snapshots
    FROM public.goal_snapshots
    WHERE goal_id = p_goal_id
    ORDER BY iso_week DESC
    LIMIT 1;
    
    momentum := COALESCE(recent_snapshots.momentum, 0);
    
    -- Calculate average consistency from habit metrics
    SELECT COALESCE(AVG(ema30), 0.5) INTO avg_consistency
    FROM public.goal_habits gh
    JOIN public.habit_metrics hm ON gh.habit_id = hm.habit_id
    WHERE gh.goal_id = p_goal_id;
    
    -- Determine health based on rules
    IF avg_consistency >= 0.8 AND momentum >= -5 THEN
        RETURN 'green';
    ELSIF avg_consistency >= 0.6 AND momentum >= -20 THEN
        RETURN 'yellow';
    ELSE
        RETURN 'red';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_accountability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goals
CREATE POLICY "Users can view own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.goals
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for goal_milestones
CREATE POLICY "Users can view own goal milestones" ON public.goal_milestones
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id));

CREATE POLICY "Users can insert own goal milestones" ON public.goal_milestones
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id));

CREATE POLICY "Users can update own goal milestones" ON public.goal_milestones
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id));

-- RLS Policies for goal_habits
CREATE POLICY "Users can view own goal habits" ON public.goal_habits
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id));

CREATE POLICY "Users can insert own goal habits" ON public.goal_habits
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id));

CREATE POLICY "Users can update own goal habits" ON public.goal_habits
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id));

CREATE POLICY "Users can delete own goal habits" ON public.goal_habits
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.goals WHERE id = goal_id));

-- RLS Policies for challenges
CREATE POLICY "Users can view own challenges" ON public.challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges" ON public.challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" ON public.challenges
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges" ON public.challenges
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for challenge_tasks
CREATE POLICY "Users can view own challenge tasks" ON public.challenge_tasks
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.challenges WHERE id = challenge_id));

CREATE POLICY "Users can insert own challenge tasks" ON public.challenge_tasks
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.challenges WHERE id = challenge_id));

CREATE POLICY "Users can update own challenge tasks" ON public.challenge_tasks
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.challenges WHERE id = challenge_id));

-- RLS Policies for goal_snapshots
CREATE POLICY "Users can view own goal snapshots" ON public.goal_snapshots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goal snapshots" ON public.goal_snapshots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goal snapshots" ON public.goal_snapshots
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for goal_ai_suggestions
CREATE POLICY "Users can view own goal AI suggestions" ON public.goal_ai_suggestions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goal AI suggestions" ON public.goal_ai_suggestions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goal AI suggestions" ON public.goal_ai_suggestions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for goal_accountability
CREATE POLICY "Users can view own goal accountability" ON public.goal_accountability
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = partner_user_id);

CREATE POLICY "Users can insert own goal accountability" ON public.goal_accountability
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goal accountability" ON public.goal_accountability
    FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = partner_user_id);

-- RLS Policies for user_xp
CREATE POLICY "Users can view own XP" ON public.user_xp
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own XP" ON public.user_xp
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own XP" ON public.user_xp
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for xp_transactions
CREATE POLICY "Users can view own XP transactions" ON public.xp_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own XP transactions" ON public.xp_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Insert sample goal templates
INSERT INTO public.goal_templates (title, purpose, category, target_type, target_value, suggested_duration_days, starter_habits, difficulty_level) VALUES
('Daily Prayer Practice', 'Build consistent spiritual connection', 'spiritual', 'frequency', '{"type": "daily", "value": 1}', 30, '[{"title": "Morning Prayer", "duration": 5, "moment": "morning"}, {"title": "Evening Reflection", "duration": 3, "moment": "evening"}]', 2),
('Read 12 Books This Year', 'Expand knowledge and improve focus', 'mental', 'numeric', '{"type": "books", "value": 12}', 365, '[{"title": "Daily Reading", "duration": 20, "moment": "evening"}]', 3),
('Morning Exercise Routine', 'Build physical strength and energy', 'physical', 'frequency', '{"type": "daily", "value": 1}', 30, '[{"title": "Morning Workout", "duration": 30, "moment": "morning"}]', 3),
('Hydration Goal', 'Improve overall health and energy', 'physical', 'numeric', '{"type": "liters", "value": 2}', 30, '[{"title": "Drink Water", "frequency": "daily", "moment": "midday"}]', 1),
('Deep Work Sessions', 'Improve focus and productivity', 'mental', 'frequency', '{"type": "daily", "value": 1}', 30, '[{"title": "Deep Work", "duration": 90, "moment": "morning"}]', 4)
ON CONFLICT DO NOTHING;
