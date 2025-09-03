import { createClient } from '@supabase/supabase-js';
import { Habit, HabitCheckin, HabitMetrics, HabitOccurrence } from '@/types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export class HabitDatabaseService {
  private static instance: HabitDatabaseService;

  private constructor() {}

  public static getInstance(): HabitDatabaseService {
    if (!HabitDatabaseService.instance) {
      HabitDatabaseService.instance = new HabitDatabaseService();
    }
    return HabitDatabaseService.instance;
  }

  // Habit Management
  async createHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits')
      .insert({
        ...habit,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create habit: ${error.message}`);
    return this.mapHabitFromDB(data);
  }

  async getHabitsByUser(userId: string): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch habits: ${error.message}`);
    return data.map(this.mapHabitFromDB);
  }

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', habitId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update habit: ${error.message}`);
    return this.mapHabitFromDB(data);
  }

  async archiveHabit(habitId: string): Promise<void> {
    const { error } = await supabase
      .from('habits')
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq('id', habitId);

    if (error) throw new Error(`Failed to archive habit: ${error.message}`);
  }

  // Habit Checkins
  async createCheckin(checkin: Omit<HabitCheckin, 'id' | 'createdAt'>): Promise<HabitCheckin> {
    const { data, error } = await supabase
      .from('habit_checkins')
      .insert({
        ...checkin,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create checkin: ${error.message}`);
    return this.mapCheckinFromDB(data);
  }

  async updateCheckin(checkinId: string, updates: Partial<HabitCheckin>): Promise<HabitCheckin> {
    const { data, error } = await supabase
      .from('habit_checkins')
      .update({
        ...updates,
        edited_at: new Date().toISOString()
      })
      .eq('id', checkinId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update checkin: ${error.message}`);
    return this.mapCheckinFromDB(data);
  }

  async getCheckinsByHabit(habitId: string, startDate?: string, endDate?: string): Promise<HabitCheckin[]> {
    let query = supabase
      .from('habit_checkins')
      .select('*')
      .eq('habit_id', habitId);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw new Error(`Failed to fetch checkins: ${error.message}`);
    return data.map(this.mapCheckinFromDB);
  }

  async getCheckinsByUser(userId: string, date?: string): Promise<HabitCheckin[]> {
    let query = supabase
      .from('habit_checkins')
      .select('*')
      .eq('user_id', userId);

    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw new Error(`Failed to fetch checkins: ${error.message}`);
    return data.map(this.mapCheckinFromDB);
  }

  // Habit Metrics
  async getHabitMetrics(habitId: string): Promise<HabitMetrics | null> {
    const { data, error } = await supabase
      .from('habit_metrics')
      .select('*')
      .eq('habit_id', habitId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to fetch habit metrics: ${error.message}`);
    }

    return data ? this.mapMetricsFromDB(data) : null;
  }

  async updateHabitMetrics(metrics: Omit<HabitMetrics, 'id' | 'lastUpdated'>): Promise<HabitMetrics> {
    const { data, error } = await supabase
      .from('habit_metrics')
      .upsert({
        ...metrics,
        last_updated: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to update habit metrics: ${error.message}`);
    return this.mapMetricsFromDB(data);
  }

  // Habit Occurrences
  async generateHabitOccurrences(habitId: string, startDate: string, days: number = 14): Promise<HabitOccurrence[]> {
    // This would typically be handled by a background job
    // For now, we'll generate them on-demand
    const occurrences: HabitOccurrence[] = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      
      occurrences.push({
        id: `${habitId}-${date.toISOString().split('T')[0]}`,
        userId: '', // Will be filled by the calling function
        habitId,
        date: date.toISOString().split('T')[0],
        windowStart: new Date(date.setHours(6, 0, 0, 0)).toISOString(),
        windowEnd: new Date(date.setHours(22, 0, 0, 0)).toISOString(),
        dueAt: new Date(date.setHours(9, 0, 0, 0)).toISOString()
      });
    }

    return occurrences;
  }

  // Analytics and Reporting
  async getHabitStreak(habitId: string): Promise<number> {
    const { data, error } = await supabase
      .from('habit_checkins')
      .select('date, status')
      .eq('habit_id', habitId)
      .eq('status', 'done')
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw new Error(`Failed to fetch streak data: ${error.message}`);

    let streak = 0;
    const today = new Date();
    
    for (const checkin of data) {
      const checkinDate = new Date(checkin.date);
      const daysDiff = Math.floor((today.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async getWeeklyProgress(userId: string, weekStart: string): Promise<{
    totalHabits: number;
    completedHabits: number;
    progress: number;
  }> {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const [habits, checkins] = await Promise.all([
      this.getHabitsByUser(userId),
      this.getCheckinsByUser(userId)
    ]);

    const weekCheckins = checkins.filter(c => {
      const checkinDate = new Date(c.date);
      return checkinDate >= new Date(weekStart) && checkinDate <= weekEnd;
    });

    const totalHabits = habits.length;
    const completedHabits = weekCheckins.filter(c => c.status === 'done').length;
    const progress = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    return { totalHabits, completedHabits, progress };
  }

  // Database mapping helpers
  private mapHabitFromDB(dbHabit: any): Habit {
    return {
      id: dbHabit.id,
      userId: dbHabit.user_id,
      title: dbHabit.title,
      purpose: dbHabit.purpose,
      moment: dbHabit.moment,
      cadence: dbHabit.cadence,
      dose: dbHabit.dose,
      window: dbHabit.window,
      difficulty: dbHabit.difficulty,
      archived: dbHabit.archived,
      createdAt: dbHabit.created_at,
      updatedAt: dbHabit.updated_at
    };
  }

  private mapCheckinFromDB(dbCheckin: any): HabitCheckin {
    return {
      id: dbCheckin.id,
      userId: dbCheckin.user_id,
      habitId: dbCheckin.habit_id,
      date: dbCheckin.date,
      status: dbCheckin.status,
      effort: dbCheckin.effort,
      doseActual: dbCheckin.dose_actual,
      note: dbCheckin.note,
      createdAt: dbCheckin.created_at,
      editedAt: dbCheckin.edited_at
    };
  }

  private mapMetricsFromDB(dbMetrics: any): HabitMetrics {
    return {
      id: dbMetrics.id,
      userId: dbMetrics.user_id,
      habitId: dbMetrics.habit_id,
      ema30: dbMetrics.ema30,
      streak: dbMetrics.streak,
      maintenanceMode: dbMetrics.maintenance_mode,
      lastUpdated: dbMetrics.last_updated
    };
  }
}

export const habitDatabaseService = HabitDatabaseService.getInstance();
