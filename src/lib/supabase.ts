import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

// Enhanced Supabase Client with proper error handling
export const supabase = createClient(
  config.supabase.url!,
  config.supabase.anonKey!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Database Types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface LifeAuditAssessment {
  id: string;
  user_id: string;
  completed_at: string;
  questions: any[];
  analysis: any;
  plan: any;
  ascension_score: number;
  strongest_dimension: string;
  biggest_opportunity: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  date: string;
  activities_completed: string[];
  mood_score: number;
  energy_level: number;
  notes?: string;
  created_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_type: string;
  duration: number;
  exercises: any[];
  completed_at: string;
  created_at: string;
}

export interface CoachingSession {
  id: string;
  user_id: string;
  session_type: string;
  message: string;
  ai_response: string;
  rating?: number;
  created_at: string;
}

export interface NutritionPlan {
  id: string;
  user_id: string;
  plan_type: string;
  daily_calories: number;
  macronutrients: any;
  meal_plan: any;
  created_at: string;
  updated_at: string;
}

// Database Operations
export class DatabaseService {
  private static instance: DatabaseService;
  private supabase: SupabaseClient;

  private constructor() {
    this.supabase = supabase;
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // User Profile Operations
  async createUserProfile(userId: string, email: string, fullName?: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email,
          full_name: fullName
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  // Life Audit Assessment Operations
  async saveLifeAuditAssessment(assessment: Omit<LifeAuditAssessment, 'id' | 'created_at' | 'updated_at'>): Promise<LifeAuditAssessment | null> {
    try {
      const { data, error } = await this.supabase
        .from('life_audit_assessments')
        .insert(assessment)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving life audit assessment:', error);
      return null;
    }
  }

  async getLifeAuditAssessment(userId: string): Promise<LifeAuditAssessment | null> {
    try {
      const { data, error } = await this.supabase
        .from('life_audit_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching life audit assessment:', error);
      return null;
    }
  }

  // User Progress Operations
  async saveUserProgress(progress: Omit<UserProgress, 'id' | 'created_at'>): Promise<UserProgress | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_progress')
        .insert(progress)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving user progress:', error);
      return null;
    }
  }

  async getUserProgress(userId: string, date?: string): Promise<UserProgress[]> {
    try {
      let query = this.supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }

  // Workout Operations
  async saveWorkoutSession(workout: Omit<WorkoutSession, 'id' | 'created_at'>): Promise<WorkoutSession | null> {
    try {
      const { data, error } = await this.supabase
        .from('workout_sessions')
        .insert(workout)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving workout session:', error);
      return null;
    }
  }

  async getWorkoutHistory(userId: string): Promise<WorkoutSession[]> {
    try {
      const { data, error } = await this.supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching workout history:', error);
      return [];
    }
  }

  // Coaching Operations
  async saveCoachingSession(session: Omit<CoachingSession, 'id' | 'created_at'>): Promise<CoachingSession | null> {
    try {
      const { data, error } = await this.supabase
        .from('coaching_sessions')
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving coaching session:', error);
      return null;
    }
  }

  async getCoachingHistory(userId: string): Promise<CoachingSession[]> {
    try {
      const { data, error } = await this.supabase
        .from('coaching_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching coaching history:', error);
      return [];
    }
  }

  // Nutrition Operations
  async saveNutritionPlan(nutrition: Omit<NutritionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<NutritionPlan | null> {
    try {
      const { data, error } = await this.supabase
        .from('nutrition_plans')
        .insert(nutrition)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving nutrition plan:', error);
      return null;
    }
  }

  async getNutritionPlan(userId: string): Promise<NutritionPlan | null> {
    try {
      const { data, error } = await this.supabase
        .from('nutrition_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching nutrition plan:', error);
      return null;
    }
  }
}

export const databaseService = DatabaseService.getInstance();
