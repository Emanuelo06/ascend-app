import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

// Lazy-loaded Supabase Client to avoid build-time errors
let supabaseInstance: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side: check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // During build time, return a mock client to prevent build failures
      return createClient('https://placeholder.supabase.co', 'placeholder-key');
    }
  }

  const url = config.supabase.url;
  const anonKey = config.supabase.anonKey;

  if (!url || !anonKey) {
    throw new Error('Supabase URL and anon key are required. Please check your environment variables.');
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
}

// Export the client getter for backward compatibility
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    return client[prop as keyof SupabaseClient];
  }
});

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

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  purpose?: string;
  target_type: 'numeric' | 'boolean' | 'milestone';
  target_value: any;
  category: string;
  priority: number;
  state: 'active' | 'paused' | 'completed' | 'cancelled';
  health: 'green' | 'yellow' | 'red';
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  purpose?: string;
  moment: 'morning' | 'afternoon' | 'evening' | 'anytime';
  cadence: any;
  dose: any;
  window?: any;
  difficulty: number;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface HabitCheckin {
  id: string;
  user_id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  value?: number;
  notes?: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  user_id: string;
  goal_id?: string;
  title: string;
  description?: string;
  type: 'micro' | 'macro' | 'social' | 'ai_generated';
  duration_days: number;
  xp_reward: number;
  state: 'active' | 'completed' | 'failed' | 'paused';
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface UserXP {
  id: string;
  user_id: string;
  total_xp: number;
  level: number;
  badges: any[];
  created_at: string;
  updated_at: string;
}

// Database Operations
export class DatabaseService {
  private static instance: DatabaseService;
  private supabase: SupabaseClient;

  private constructor() {
    this.supabase = getSupabaseClient();
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
      console.log('🔄 DatabaseService: Starting saveLifeAuditAssessment...');
      console.log('📊 DatabaseService: Assessment data:', JSON.stringify(assessment, null, 2));
      
      // Test basic connection first
      console.log('🔍 DatabaseService: Testing basic connection...');
      const { data: testData, error: testError } = await this.supabase
        .from('life_audit_assessments')
        .select('id')
        .limit(1);
      
      console.log('🔍 DatabaseService: Connection test result:', { testData, testError });
      
      if (testError && testError.code !== 'PGRST116') {
        console.error('❌ DatabaseService: Connection test failed:', testError);
        throw testError;
      }
      
      console.log('✅ DatabaseService: Connection test passed, proceeding with insert...');
      
      const { data, error } = await this.supabase
        .from('life_audit_assessments')
        .insert(assessment)
        .select()
        .single();

      console.log('🔄 DatabaseService: Supabase response - data:', data);
      console.log('🔄 DatabaseService: Supabase response - error:', error);

      if (error) {
        console.error('❌ DatabaseService: Supabase error:', error);
        throw error;
      }
      
      console.log('✅ DatabaseService: Assessment saved successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ DatabaseService: Error saving life audit assessment:', error);
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

      if (error) {
        // If table doesn't exist or no data found, return null gracefully
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message?.includes('relation') || error.message?.includes('does not exist') || error.message?.includes('404') || error.message?.includes('Could not find the table')) {
          console.log('📊 No assessment data found for user (table may not exist yet)');
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      // Only log error if it's not a missing table/relation error
      if (!error.code || (error.code !== 'PGRST116' && error.code !== 'PGRST205' && !error.message?.includes('relation') && !error.message?.includes('does not exist') && !error.message?.includes('404') && !error.message?.includes('Could not find the table'))) {
        console.error('Error fetching life audit assessment:', error);
      } else {
        console.log('📊 No assessment data found for user (table may not exist yet)');
      }
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

  // Goals Operations
  async createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal | null> {
    try {
      const { data, error } = await this.supabase
        .from('goals')
        .insert(goal)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
      return null;
    }
  }

  async getGoals(userId: string): Promise<Goal[]> {
    try {
      const { data, error } = await this.supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist or no data found, return empty array gracefully
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message?.includes('relation') || error.message?.includes('does not exist') || error.message?.includes('Could not find the table')) {
          console.log('🎯 No goals found for user (table may not exist yet)');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
    try {
      const { data, error } = await this.supabase
        .from('goals')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating goal:', error);
      return null;
    }
  }

  async deleteGoal(goalId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  }

  // Habits Operations
  async createHabit(habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>): Promise<Habit | null> {
    try {
      const { data, error } = await this.supabase
        .from('habits')
        .insert(habit)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating habit:', error);
      return null;
    }
  }

  async getHabits(userId: string): Promise<Habit[]> {
    try {
      const { data, error } = await this.supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist or no data found, return empty array gracefully
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message?.includes('relation') || error.message?.includes('does not exist') || error.message?.includes('Could not find the table')) {
          console.log('🔄 No habits found for user (table may not exist yet)');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching habits:', error);
      return [];
    }
  }

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit | null> {
    try {
      const { data, error } = await this.supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating habit:', error);
      return null;
    }
  }

  async deleteHabit(habitId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      return false;
    }
  }

  // Habit Check-ins Operations
  async createHabitCheckin(checkin: Omit<HabitCheckin, 'id' | 'created_at'>): Promise<HabitCheckin | null> {
    try {
      const { data, error } = await this.supabase
        .from('habit_checkins')
        .insert(checkin)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating habit checkin:', error);
      return null;
    }
  }

  async getHabitCheckins(userId: string, habitId?: string, date?: string): Promise<HabitCheckin[]> {
    try {
      let query = this.supabase
        .from('habit_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (habitId) {
        query = query.eq('habit_id', habitId);
      }

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) {
        // If table doesn't exist or no data found, return empty array gracefully
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message?.includes('relation') || error.message?.includes('does not exist') || error.message?.includes('Could not find the table')) {
          console.log('✅ No habit checkins found for user (table may not exist yet)');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching habit checkins:', error);
      return [];
    }
  }

  async updateHabitCheckin(checkinId: string, updates: Partial<HabitCheckin>): Promise<HabitCheckin | null> {
    try {
      const { data, error } = await this.supabase
        .from('habit_checkins')
        .update(updates)
        .eq('id', checkinId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating habit checkin:', error);
      return null;
    }
  }

  // Challenges Operations
  async createChallenge(challenge: Omit<Challenge, 'id' | 'created_at' | 'updated_at'>): Promise<Challenge | null> {
    try {
      const { data, error } = await this.supabase
        .from('challenges')
        .insert(challenge)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating challenge:', error);
      return null;
    }
  }

  async getChallenges(userId: string): Promise<Challenge[]> {
    try {
      const { data, error } = await this.supabase
        .from('challenges')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist or no data found, return empty array gracefully
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message?.includes('relation') || error.message?.includes('does not exist') || error.message?.includes('Could not find the table')) {
          console.log('🏆 No challenges found for user (table may not exist yet)');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }
  }

  async updateChallenge(challengeId: string, updates: Partial<Challenge>): Promise<Challenge | null> {
    try {
      const { data, error } = await this.supabase
        .from('challenges')
        .update(updates)
        .eq('id', challengeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating challenge:', error);
      return null;
    }
  }

  // User XP Operations
  async getUserXP(userId: string): Promise<UserXP | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_xp')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If table doesn't exist or no data found, return null gracefully
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message?.includes('relation') || error.message?.includes('does not exist') || error.message?.includes('404') || error.message?.includes('Could not find the table')) {
          console.log('💰 No XP data found for user (table may not exist yet)');
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      // Only log error if it's not a missing table/relation error
      if (!error.code || (error.code !== 'PGRST116' && error.code !== 'PGRST205' && !error.message?.includes('relation') && !error.message?.includes('does not exist') && !error.message?.includes('404') && !error.message?.includes('Could not find the table'))) {
        console.error('Error fetching user XP:', error);
      } else {
        console.log('💰 No XP data found for user (table may not exist yet)');
      }
      return null;
    }
  }

  async updateUserXP(userId: string, updates: Partial<UserXP>): Promise<UserXP | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_xp')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user XP:', error);
      return null;
    }
  }

  async addXP(userId: string, xpAmount: number): Promise<UserXP | null> {
    try {
      // Get current XP
      const currentXP = await this.getUserXP(userId);
      if (!currentXP) {
        // Create new XP record if it doesn't exist
        const newXP = await this.supabase
          .from('user_xp')
          .insert({
            user_id: userId,
            total_xp: xpAmount,
            level: Math.floor(xpAmount / 100) + 1
          })
          .select()
          .single();
        
        if (newXP.error) throw newXP.error;
        return newXP.data;
      }

      // Update existing XP
      const newTotalXP = currentXP.total_xp + xpAmount;
      const newLevel = Math.floor(newTotalXP / 100) + 1;

      const { data, error } = await this.supabase
        .from('user_xp')
        .update({
          total_xp: newTotalXP,
          level: newLevel
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding XP:', error);
      return null;
    }
  }
}

export const databaseService = DatabaseService.getInstance();
