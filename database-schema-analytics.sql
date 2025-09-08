-- Enhanced Analytics & Weekly Review Schema
-- This builds on the existing habit tracking schema to support comprehensive analytics

-- Weekly Snapshots Table (Enhanced)
CREATE TABLE IF NOT EXISTS public.weekly_snapshots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    
    -- Core metrics
    completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    total_habits INTEGER DEFAULT 0,
    completed_habits INTEGER DEFAULT 0,
    
    -- Streak data
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    
    -- Mood and energy (if tracking exists)
    avg_mood DECIMAL(3,1) CHECK (avg_mood >= 1 AND avg_mood <= 10),
    avg_energy DECIMAL(3,1) CHECK (avg_energy >= 1 AND avg_energy <= 10),
    
    -- Time-based insights
    best_moment TEXT CHECK (best_moment IN ('morning', 'midday', 'evening')),
    worst_moment TEXT CHECK (worst_moment IN ('morning', 'midday', 'evening')),
    
    -- Top performing habits (JSON array of habit IDs)
    top_habits JSONB DEFAULT '[]',
    struggling_habits JSONB DEFAULT '[]',
    
    -- AI-generated summary (cached)
    ai_summary TEXT,
    ai_insights JSONB DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, week_start)
);

-- Daily Progress Heatmap Data
CREATE TABLE IF NOT EXISTS public.daily_progress_heatmap (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    
    -- Daily completion data
    total_habits INTEGER DEFAULT 0,
    completed_habits INTEGER DEFAULT 0,
    partial_habits INTEGER DEFAULT 0,
    missed_habits INTEGER DEFAULT 0,
    
    -- Completion percentage for the day
    completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Mood and energy tracking
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    
    -- Notes for the day
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- Habit Performance Analytics
CREATE TABLE IF NOT EXISTS public.habit_performance_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
    
    -- Time period for this analysis
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    period_type TEXT NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'quarterly')),
    
    -- Performance metrics
    completion_rate DECIMAL(5,2) CHECK (completion_rate >= 0 AND completion_rate <= 100),
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    
    -- Consistency metrics
    consistency_score DECIMAL(5,2) CHECK (consistency_score >= 0 AND consistency_score <= 100),
    ema_30 DECIMAL(5,4) DEFAULT 0.5, -- 30-day exponential moving average
    
    -- Trend analysis
    trend_direction TEXT CHECK (trend_direction IN ('improving', 'stable', 'declining')),
    trend_strength DECIMAL(3,2) CHECK (trend_strength >= 0 AND trend_strength <= 1),
    
    -- Best performing days/times
    best_day_of_week INTEGER CHECK (best_day_of_week >= 0 AND best_day_of_week <= 6), -- 0=Sunday
    best_time_of_day TEXT CHECK (best_time_of_day IN ('morning', 'midday', 'evening')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, habit_id, period_start, period_type)
);

-- User Insights and Recommendations
CREATE TABLE IF NOT EXISTS public.user_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Insight metadata
    insight_type TEXT NOT NULL CHECK (insight_type IN ('weekly', 'habit', 'pattern', 'opportunity', 'achievement')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    
    -- Insight content
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence TEXT, -- Supporting data/evidence
    
    -- Action items
    suggested_action TEXT,
    action_type TEXT CHECK (action_type IN ('move_habit', 'add_reminder', 'create_challenge', 'adjust_difficulty', 'change_time')),
    action_data JSONB DEFAULT '{}', -- Specific data for the action
    
    -- Status tracking
    is_applied BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMP WITH TIME ZONE,
    dismissed BOOLEAN DEFAULT FALSE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    
    -- Related data
    related_habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
    related_week_start DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Weekly Goals and Focus Areas
CREATE TABLE IF NOT EXISTS public.weekly_focus (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    week_start DATE NOT NULL,
    
    -- Focus area
    focus_title TEXT NOT NULL,
    focus_description TEXT,
    focus_type TEXT NOT NULL CHECK (focus_type IN ('habit_improvement', 'new_habit', 'consistency', 'streak_recovery')),
    
    -- Target metrics
    target_habits JSONB DEFAULT '[]', -- Array of habit IDs
    target_completion_rate INTEGER CHECK (target_completion_rate >= 0 AND target_completion_rate <= 100),
    target_streak INTEGER DEFAULT 0,
    
    -- Progress tracking
    current_progress INTEGER DEFAULT 0,
    is_achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP WITH TIME ZONE,
    
    -- AI-generated or user-set
    is_ai_generated BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, week_start)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_weekly_snapshots_user_week ON public.weekly_snapshots(user_id, week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_snapshots_created_at ON public.weekly_snapshots(created_at);

CREATE INDEX IF NOT EXISTS idx_daily_heatmap_user_date ON public.daily_progress_heatmap(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_heatmap_date ON public.daily_progress_heatmap(date);

CREATE INDEX IF NOT EXISTS idx_habit_performance_user_habit ON public.habit_performance_analytics(user_id, habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_performance_period ON public.habit_performance_analytics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_habit_performance_type ON public.habit_performance_analytics(period_type);

CREATE INDEX IF NOT EXISTS idx_user_insights_user_type ON public.user_insights(user_id, insight_type);
CREATE INDEX IF NOT EXISTS idx_user_insights_priority ON public.user_insights(priority);
CREATE INDEX IF NOT EXISTS idx_user_insights_created_at ON public.user_insights(created_at);
CREATE INDEX IF NOT EXISTS idx_user_insights_applied ON public.user_insights(is_applied);

CREATE INDEX IF NOT EXISTS idx_weekly_focus_user_week ON public.weekly_focus(user_id, week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_focus_achieved ON public.weekly_focus(is_achieved);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_weekly_snapshots_updated_at BEFORE UPDATE ON public.weekly_snapshots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_heatmap_updated_at BEFORE UPDATE ON public.daily_progress_heatmap
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habit_performance_updated_at BEFORE UPDATE ON public.habit_performance_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_focus_updated_at BEFORE UPDATE ON public.weekly_focus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enhanced function to calculate weekly snapshot
CREATE OR REPLACE FUNCTION calculate_weekly_snapshot(p_user_id UUID, p_week_start DATE)
RETURNS TABLE(
    total_habits BIGINT,
    completed_habits BIGINT,
    completion_percentage INTEGER,
    current_streak INTEGER,
    best_streak INTEGER,
    avg_mood DECIMAL,
    avg_energy DECIMAL,
    best_moment TEXT,
    worst_moment TEXT,
    top_habits JSONB,
    struggling_habits JSONB
) AS $$
DECLARE
    week_end DATE := p_week_start + INTERVAL '6 days';
BEGIN
    RETURN QUERY
    WITH week_data AS (
        -- Get all habits for the user
        SELECT h.id as habit_id, h.title, h.moment
        FROM public.habits h
        WHERE h.user_id = p_user_id AND h.archived = FALSE
    ),
    week_checkins AS (
        -- Get checkins for the week
        SELECT 
            hc.habit_id,
            hc.date,
            hc.status,
            h.moment
        FROM public.habit_checkins hc
        JOIN public.habits h ON hc.habit_id = h.id
        WHERE hc.user_id = p_user_id
          AND hc.date BETWEEN p_week_start AND week_end
    ),
    habit_performance AS (
        -- Calculate performance per habit
        SELECT 
            wd.habit_id,
            wd.title,
            wd.moment,
            COUNT(wc.habit_id) as total_attempts,
            COUNT(CASE WHEN wc.status = 'done' THEN 1 END) as completions,
            CASE 
                WHEN COUNT(wc.habit_id) > 0 THEN 
                    ROUND((COUNT(CASE WHEN wc.status = 'done' THEN 1 END)::DECIMAL / COUNT(wc.habit_id)::DECIMAL) * 100)
                ELSE 0 
            END as completion_rate
        FROM week_data wd
        LEFT JOIN week_checkins wc ON wd.habit_id = wc.habit_id
        GROUP BY wd.habit_id, wd.title, wd.moment
    ),
    moment_performance AS (
        -- Calculate performance by moment
        SELECT 
            moment,
            AVG(completion_rate) as avg_completion
        FROM habit_performance
        GROUP BY moment
    ),
    mood_energy_data AS (
        -- Get mood and energy data if available
        SELECT 
            AVG(mood_score) as avg_mood,
            AVG(energy_level) as avg_energy
        FROM public.daily_progress_heatmap
        WHERE user_id = p_user_id
          AND date BETWEEN p_week_start AND week_end
    ),
    streak_data AS (
        -- Get current and best streaks
        SELECT 
            MAX(hm.streak->>'current')::INTEGER as current_streak,
            MAX(hm.streak->>'best')::INTEGER as best_streak
        FROM public.habit_metrics hm
        WHERE hm.user_id = p_user_id
    )
    SELECT 
        COUNT(hp.habit_id)::BIGINT as total_habits,
        COUNT(CASE WHEN hp.completion_rate >= 80 THEN 1 END)::BIGINT as completed_habits,
        CASE 
            WHEN COUNT(hp.habit_id) > 0 THEN 
                ROUND(AVG(hp.completion_rate))
            ELSE 0 
        END::INTEGER as completion_percentage,
        COALESCE(sd.current_streak, 0) as current_streak,
        COALESCE(sd.best_streak, 0) as best_streak,
        COALESCE(med.avg_mood, 0) as avg_mood,
        COALESCE(med.avg_energy, 0) as avg_energy,
        (SELECT moment FROM moment_performance ORDER BY avg_completion DESC LIMIT 1) as best_moment,
        (SELECT moment FROM moment_performance ORDER BY avg_completion ASC LIMIT 1) as worst_moment,
        COALESCE(
            (SELECT jsonb_agg(habit_id) FROM habit_performance WHERE completion_rate >= 80),
            '[]'::jsonb
        ) as top_habits,
        COALESCE(
            (SELECT jsonb_agg(habit_id) FROM habit_performance WHERE completion_rate < 50),
            '[]'::jsonb
        ) as struggling_habits
    FROM habit_performance hp
    CROSS JOIN streak_data sd
    CROSS JOIN mood_energy_data med;
END;
$$ LANGUAGE plpgsql;

-- Function to generate AI insights
CREATE OR REPLACE FUNCTION generate_weekly_insights(p_user_id UUID, p_week_start DATE)
RETURNS TABLE(
    insight_type TEXT,
    title TEXT,
    description TEXT,
    evidence TEXT,
    suggested_action TEXT,
    action_type TEXT,
    action_data JSONB
) AS $$
DECLARE
    week_end DATE := p_week_start + INTERVAL '6 days';
BEGIN
    RETURN QUERY
    WITH week_snapshot AS (
        SELECT * FROM calculate_weekly_snapshot(p_user_id, p_week_start)
    ),
    habit_insights AS (
        SELECT 
            'habit'::TEXT as insight_type,
            CASE 
                WHEN completion_percentage < 50 THEN 'Evenings need attention'
                WHEN completion_percentage > 80 THEN 'Great consistency!'
                ELSE 'Room for improvement'
            END as title,
            CASE 
                WHEN completion_percentage < 50 THEN 'Your evening habits are struggling. Consider moving them earlier or reducing difficulty.'
                WHEN completion_percentage > 80 THEN 'Excellent week! Your habits are becoming automatic.'
                ELSE 'Good progress, but there''s room to optimize your routine.'
            END as description,
            CASE 
                WHEN completion_percentage < 50 THEN 'Only ' || completion_percentage || '% completion this week'
                WHEN completion_percentage > 80 THEN completion_percentage || '% completion rate achieved'
                ELSE completion_percentage || '% completion rate'
            END as evidence,
            CASE 
                WHEN completion_percentage < 50 THEN 'Move evening habits to afternoon'
                WHEN completion_percentage > 80 THEN 'Add a new habit to your routine'
                ELSE 'Optimize your weakest moment'
            END as suggested_action,
            CASE 
                WHEN completion_percentage < 50 THEN 'move_habit'::TEXT
                WHEN completion_percentage > 80 THEN 'create_challenge'::TEXT
                ELSE 'adjust_difficulty'::TEXT
            END as action_type,
            CASE 
                WHEN completion_percentage < 50 THEN '{"from": "evening", "to": "afternoon"}'::jsonb
                WHEN completion_percentage > 80 THEN '{"difficulty": "medium", "category": "wellness"}'::jsonb
                ELSE '{"focus_moment": "evening"}'::jsonb
            END as action_data
        FROM week_snapshot
    )
    SELECT * FROM habit_insights;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE public.weekly_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress_heatmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_focus ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weekly_snapshots
CREATE POLICY "Users can view own weekly snapshots" ON public.weekly_snapshots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly snapshots" ON public.weekly_snapshots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly snapshots" ON public.weekly_snapshots
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for daily_progress_heatmap
CREATE POLICY "Users can view own daily heatmap" ON public.daily_progress_heatmap
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily heatmap" ON public.daily_progress_heatmap
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily heatmap" ON public.daily_progress_heatmap
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for habit_performance_analytics
CREATE POLICY "Users can view own habit performance" ON public.habit_performance_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit performance" ON public.habit_performance_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit performance" ON public.habit_performance_analytics
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_insights
CREATE POLICY "Users can view own insights" ON public.user_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights" ON public.user_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON public.user_insights
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for weekly_focus
CREATE POLICY "Users can view own weekly focus" ON public.weekly_focus
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly focus" ON public.weekly_focus
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly focus" ON public.weekly_focus
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
