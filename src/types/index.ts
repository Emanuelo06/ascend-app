import { ComponentType } from 'react';

// ASCEND Platform Type Definitions

// User Profile Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  subscription_tier: 'free' | 'premium' | 'premium_plus';
  onboarding_completed: boolean;
}

export interface UserProfile extends User {
  age_range?: '18-25' | '26-35' | '36-45' | '46-55' | '55+';
  gender?: 'male' | 'female' | 'prefer_not_to_say';
  timezone: string;
  primary_goals: string[];
  biggest_challenge?: string;
  faith_description?: 'strong_growing' | 'committed_inconsistent' | 'searching_exploring' | 'open_uncertain' | 'prefer_not_share';
  christian_content_comfort?: 'yes_want' | 'yes_not_exclusively' | 'sometimes_depends' | 'prefer_minimal';
}

// Life Audit Types
export interface LifeAuditQuestion {
  id: string;
  category: LifeDimension;
  question: string;
  response_scale: 0 | 1 | 2 | 3;
}

export type LifeDimension = 'physical' | 'mental' | 'spiritual' | 'relational' | 'financial' | 'creative' | 'legacy';

export interface LifeAuditResponse {
  question_id: string;
  response: 0 | 1 | 2 | 3;
}

export interface LifeAuditResults {
  id: string;
  user_id: string;
  physical_score: number;
  mental_score: number;
  spiritual_score: number;
  relational_score: number;
  financial_score: number;
  creative_score: number;
  legacy_score: number;
  total_score: number;
  responses: LifeAuditResponse[];
  created_at: string;
}

export interface LifeAuditInsights {
  strongest_area: LifeDimension;
  biggest_opportunity: LifeDimension;
  keystone_habit_focus: string;
  accountability_need: string;
  improvement_potential: number;
  recommended_next_steps: string[];
}

// Daily Check-in Types
export interface DailyCheckin {
  id: string;
  user_id: string;
  date: string;
  morning_completed: boolean;
  evening_completed: boolean;
  physical_activity?: string;
  spiritual_reading: boolean;
  prayer_time: number; // minutes
  gratitude_entries: string[];
  energy_level: number; // 1-10
  mood_rating: number; // 1-10
  daily_wins: string[];
  growth_areas: string[];
  tomorrow_intentions: string[];
  streak_count: number;
  created_at: string;
}

export interface DailyAscensionProtocol {
  morning_routine: MorningRoutineItem[];
  evening_reflection: EveningReflectionItem[];
  adaptive_suggestions: string[];
  weather_integration?: WeatherData;
}

export interface MorningRoutineItem {
  id: string;
  name: string;
  duration_minutes: number;
  category: 'wake_worship' | 'physical_activation' | 'mental_priming' | 'mission_alignment';
  completed: boolean;
  completed_at?: string;
  optional: boolean;
  demo_video_url?: string;
  intensity_options?: string[];
}

export interface EveningReflectionItem {
  id: string;
  question: string;
  answer?: string;
  completed: boolean;
  completed_at?: string;
  reflection_depth?: 'shallow' | 'moderate' | 'deep';
}

// Progress Tracking Types
export interface ProgressEntry {
  id: string;
  user_id: string;
  category: LifeDimension;
  metric_name: string;
  value: number;
  unit: string;
  photo_url?: string;
  notes?: string;
  recorded_at: string;
}

export interface ProgressMetrics {
  current_streak: number;
  total_checkins: number;
  community_rank: string;
  weekly_wins: number;
  dimension_improvements: Record<LifeDimension, number>;
  overall_improvement_percentage: number;
}

export interface Achievement {
  id: string;
  user_id: string;
  type: 'streak' | 'dimension_improvement' | 'community_impact' | 'challenge_completion' | 'spiritual_growth' | 'physical_achievement' | 'habit_mastery';
  name: string;
  description: string;
  achieved_at: string;
  days_to_achieve: number;
  badge_icon: string;
  celebration_message: string;
  social_sharing_enabled: boolean;
}

// Accountability Partner Types
export interface AccountabilityPartner {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'pending' | 'active' | 'paused' | 'ended';
  matched_at: string;
  last_interaction?: string;
  compatibility_score: number;
  partner_profile: UserProfile;
  shared_goals: string[];
  check_in_frequency: 'daily' | 'weekly' | 'biweekly';
  next_check_in?: string;
}

export interface PartnerMessage {
  id: string;
  partnership_id: string;
  sender_id: string;
  message: string;
  message_type: 'encouragement' | 'accountability' | 'celebration' | 'support';
  created_at: string;
  read: boolean;
}

// Community Types
export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  post_type: 'encouragement' | 'milestone' | 'question' | 'prayer_request';
  likes_count: number;
  comments_count: number;
  is_anonymous: boolean;
  created_at: string;
  user_profile?: UserProfile;
  tags?: string[];
  photo_url?: string;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_profile?: UserProfile;
}

// Spiritual Content Types
export interface SpiritualContent {
  id: string;
  title: string;
  content: string;
  scripture_reference?: string;
  content_type: 'devotional' | 'prayer' | 'reflection' | 'bible_study';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  created_at: string;
  estimated_read_time: number; // minutes
  audio_url?: string;
  discussion_questions?: string[];
}

// AI Coaching Types
export interface CoachingSession {
  id: string;
  user_id: string;
  session_type: 'daily_motivation' | 'crisis_support' | 'goal_setting' | 'habit_analysis' | 'spiritual_guidance';
  user_message: string;
  ai_response: string;
  context_data: CoachingContext;
  satisfaction_rating?: number; // 1-5
  created_at: string;
}

export interface CoachingContext {
  current_streak: number;
  recent_progress_trends: string[];
  stated_goals: string[];
  current_challenges: string[];
  spiritual_maturity_level: 'beginner' | 'growing' | 'mature';
  partner_feedback?: string;
  recent_journal_entries?: string[];
  energy_mood_patterns?: string[];
}

// Challenge Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  challenge_type: 'fitness' | 'spiritual' | 'mental' | 'community' | 'habits';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  participants_count: number;
  is_active: boolean;
  created_at: string;
  start_date: string;
  end_date: string;
  daily_tasks: ChallengeTask[];
  rewards: ChallengeReward[];
  leaderboard?: ChallengeLeaderboardEntry[];
}

export interface ChallengeTask {
  id: string;
  challenge_id: string;
  day_number: number;
  title: string;
  description: string;
  estimated_time: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  optional: boolean;
}

export interface ChallengeReward {
  id: string;
  challenge_id: string;
  type: 'badge' | 'points' | 'unlock' | 'recognition';
  name: string;
  description: string;
  icon_url?: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  joined_at: string;
  completed_at?: string;
  progress_percentage: number;
  daily_progress: Record<string, boolean>;
  current_streak: number;
  total_points: number;
}

export interface ChallengeLeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url?: string;
  progress_percentage: number;
  current_streak: number;
  total_points: number;
  rank: number;
}

// Weather Integration Types
export interface WeatherData {
  temperature: number;
  condition: string;
  is_outdoor_friendly: boolean;
  activity_suggestions: string[];
  indoor_alternatives: string[];
}

// Form Types
export interface RegistrationForm {
  step: number;
  basic_info: {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
  };
  personal_details: {
    age_range: string;
    gender: string;
    timezone: string;
  };
  goals_motivation: {
    primary_goals: string[];
    biggest_challenge: string;
  };
  spiritual_foundation: {
    faith_description: string;
    christian_content_comfort: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  current: boolean;
  badge?: string;
}

// Analytics Types
export interface UserAnalytics {
  total_days_active: number;
  current_streak: number;
  longest_streak: number;
  average_energy_level: number;
  average_mood_rating: number;
  most_consistent_day: string;
  most_productive_time: string;
  dimension_growth: Record<LifeDimension, number>;
  habit_completion_rate: number;
  community_engagement_score: number;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: 'reminder' | 'achievement' | 'partner_message' | 'challenge_update' | 'community_activity';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
  priority: 'low' | 'medium' | 'high';
}

// Export all types
export type {
  User,
  UserProfile,
  LifeAuditQuestion,
  LifeDimension,
  LifeAuditResponse,
  LifeAuditResults,
  LifeAuditInsights,
  DailyCheckin,
  DailyAscensionProtocol,
  MorningRoutineItem,
  EveningReflectionItem,
  ProgressEntry,
  ProgressMetrics,
  Achievement,
  AccountabilityPartner,
  PartnerMessage,
  CommunityPost,
  CommunityComment,
  SpiritualContent,
  CoachingSession,
  CoachingContext,
  Challenge,
  ChallengeTask,
  ChallengeReward,
  UserChallenge,
  ChallengeLeaderboardEntry,
  WeatherData,
  RegistrationForm,
  ApiResponse,
  PaginatedResponse,
  NavigationItem,
  UserAnalytics,
  Notification,
};

// New Habit Tracking System Types
export interface Habit {
  id: string;
  userId: string;
  title: string;
  purpose?: string;
  moment: 'morning' | 'midday' | 'evening' | 'custom';
  category?: 'spiritual' | 'physical' | 'mental' | 'relational' | 'financial';
  priority?: 'low' | 'medium' | 'high';
  cadence: {
    type: 'daily' | 'weekdays' | 'custom';
    rrule?: string;
  };
  dose?: {
    unit: string;
    target: number;
  };
  window: {
    start: string; // "07:00"
    end: string;   // "11:00"
  };
  difficulty: 1 | 2 | 3;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitOccurrence {
  id: string;
  userId: string;
  habitId: string;
  date: string; // "2025-01-15"
  windowStart: string; // ISO string
  windowEnd: string;   // ISO string
  dueAt: string;       // ISO string
}

export interface HabitCheckin {
  id: string;
  userId: string;
  habitId: string;
  date: string; // "2025-01-15"
  status: 'done' | 'partial' | 'skipped';
  effort: 0 | 1 | 2 | 3;
  doseActual?: number;
  note?: string;
  createdAt: string;
  editedAt?: string;
}

export interface HabitMetrics {
  id: string;
  userId: string;
  habitId: string;
  ema30: number; // 0-1 decimal
  streak: {
    current: number;
    best: number;
    lastDate: string;
    graceTokens: number;
  };
  maintenanceMode: boolean;
  lastUpdated: string;
}

export interface UserPreferences {
  quietHours: {
    start: string; // "22:00"
    end: string;   // "07:00"
  };
  pushEnabled: boolean;
  batchByMoment: boolean;
  preCueMinutes: 0 | 10 | 15 | 30;
}

export interface HabitTemplate {
  id: string;
  title: string;
  purpose: string;
  moment: 'morning' | 'midday' | 'evening';
  cadence: {
    type: 'daily' | 'weekdays' | 'custom';
    rrule?: string;
  };
  dose?: {
    unit: string;
    target: number;
  };
  window: {
    start: string;
    end: string;
  };
  difficulty: 1 | 2 | 3;
  category: 'faith' | 'focus' | 'health' | 'micro';
  description: string;
}

export interface Moment {
  id: string;
  name: 'morning' | 'midday' | 'evening';
  displayName: string;
  startTime: string;
  endTime: string;
  color: string;
  icon: ComponentType<{ className?: string }>;
}

export interface AIInsight {
  id: string;
  userId: string;
  habitId?: string;
  type: 'weekly' | 'habit' | 'onCreate' | 'streak_drop';
  content: string;
  action?: string;
  microChallenge?: string;
  createdAt: string;
  expiresAt: string;
}

export interface WeeklyReview {
  id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  progress: number;
  topWins: string[];
  opportunities: string[];
  aiInsights: AIInsight[];
  actionPlan: string[];
  createdAt: string;
}
