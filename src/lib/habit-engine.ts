import { Habit, HabitOccurrence, HabitCheckin, HabitMetrics, Moment } from '@/types';
import { MOMENTS } from '@/data/habit-templates';

export class HabitEngine {
  private static instance: HabitEngine;

  private constructor() {
    console.log('🧠 Habit Engine initialized - Daily rituals and metrics ready');
  }

  public static getInstance(): HabitEngine {
    if (!HabitEngine.instance) {
      HabitEngine.instance = new HabitEngine();
    }
    return HabitEngine.instance;
  }

  /**
   * Generate occurrences for a habit for the next 14-30 days
   */
  public generateOccurrences(habit: Habit, startDate: Date = new Date(), days: number = 14): HabitOccurrence[] {
    const occurrences: HabitOccurrence[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < days; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);

      // Check if habit should occur on this date
      if (this.shouldOccurOnDate(habit, date)) {
        const occurrence = this.createOccurrence(habit, date);
        occurrences.push(occurrence);
      }
    }

    return occurrences;
  }

  /**
   * Check if a habit should occur on a specific date
   */
  private shouldOccurOnDate(habit: Habit, date: Date): boolean {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

    switch (habit.cadence.type) {
      case 'daily':
        return true;
      case 'weekdays':
        return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      case 'custom':
        // TODO: Implement RRULE parsing for complex recurrence patterns
        return true;
      default:
        return false;
    }
  }

  /**
   * Create an occurrence for a specific date
   */
  private createOccurrence(habit: Habit, date: Date): HabitOccurrence {
    const dateStr = date.toISOString().split('T')[0];
    const moment = MOMENTS.find(m => m.name === habit.moment);
    
    // Parse window times and create ISO strings for the specific date
    const windowStart = this.parseTimeToISO(habit.window.start, date);
    const windowEnd = this.parseTimeToISO(habit.window.end, date);
    
    // Set due time to window start
    const dueAt = windowStart;

    return {
      id: `${habit.userId}-${habit.id}-${dateStr}`,
      userId: habit.userId,
      habitId: habit.id,
      date: dateStr,
      windowStart: windowStart.toISOString(),
      windowEnd: windowEnd.toISOString(),
      dueAt: dueAt.toISOString()
    };
  }

  /**
   * Parse time string (e.g., "07:00") and convert to Date object for a specific date
   */
  private parseTimeToISO(timeStr: string, date: Date): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  /**
   * Calculate EMA (Exponential Moving Average) for consistency
   */
  public calculateEMA(previousEMA: number, currentScore: number, alpha: number = 0.0645): number {
    // α = 2/(N+1) where N = 30 days
    return alpha * currentScore + (1 - alpha) * previousEMA;
  }

  /**
   * Calculate streak with grace tokens
   */
  public calculateStreak(
    previousStreak: { current: number; best: number; lastDate: string; graceTokens: number },
    checkins: HabitCheckin[],
    date: string
  ): { current: number; best: number; lastDate: string; graceTokens: number } {
    const today = new Date(date);
    const lastDate = new Date(previousStreak.lastDate);
    const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    let currentStreak = previousStreak.current;
    let graceTokens = previousStreak.graceTokens;
    let bestStreak = previousStreak.best;

    // Check if we have a checkin for today
    const todayCheckin = checkins.find(c => c.date === date);
    if (todayCheckin && todayCheckin.status !== 'skipped') {
      // Success today - increment streak
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
      
      // Regenerate grace tokens (1 per rolling 7-day window, cap at 2)
      if (currentStreak % 7 === 0) {
        graceTokens = Math.min(2, graceTokens + 1);
      }
    } else if (daysDiff === 1) {
      // Missed yesterday - use grace token if available
      if (graceTokens > 0) {
        graceTokens--;
        // Streak continues with grace
      } else {
        // No grace tokens - streak resets
        currentStreak = 0;
      }
    } else if (daysDiff > 1) {
      // Missed multiple days - streak resets
      currentStreak = 0;
    }

    return {
      current: currentStreak,
      best: bestStreak,
      lastDate: date,
      graceTokens
    };
  }

  /**
   * Calculate score for a day based on checkin status
   */
  public calculateDailyScore(checkin: HabitCheckin | undefined): number {
    if (!checkin) return 0;
    
    switch (checkin.status) {
      case 'done':
        return 1;
      case 'partial':
        return 0.5;
      case 'skipped':
        return 0;
      default:
        return 0;
    }
  }

  /**
   * Check if habit should enter maintenance mode
   */
  public shouldEnterMaintenanceMode(ema30: number, currentStreak: number): boolean {
    return ema30 >= 0.8 && currentStreak >= 42; // 6 weeks = 42 days
  }

  /**
   * Check if habit should exit maintenance mode
   */
  public shouldExitMaintenanceMode(ema30: number): boolean {
    return ema30 < 0.7;
  }

  /**
   * Calculate XP for a habit completion
   */
  public calculateXP(habit: Habit, streak: number, effort: number): number {
    const baseXP = 10;
    const difficultyMultiplier = habit.difficulty;
    const streakBonus = 1 + (streak / 30); // Bonus increases with streak length
    const effortMultiplier = 0.5 + (effort * 0.5); // Effort 0-3 maps to 0.5-2.0
    
    return Math.round(baseXP * difficultyMultiplier * streakBonus * effortMultiplier);
  }

  /**
   * Get current moment based on time
   */
  public getCurrentMoment(): Moment | null {
    const now = new Date();
    const currentHour = now.getHours();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

    for (const moment of MOMENTS) {
      const [startHour, startMin] = moment.startTime.split(':').map(Number);
      const [endHour, endMin] = moment.endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      if (currentTime >= startMinutes && currentTime <= endMinutes) {
        return moment;
      }
    }

    return null;
  }

  /**
   * Check if a habit is due now
   */
  public isHabitDue(habit: Habit, occurrence: HabitOccurrence): boolean {
    const now = new Date();
    const windowStart = new Date(occurrence.windowStart);
    const windowEnd = new Date(occurrence.windowEnd);
    
    return now >= windowStart && now <= windowEnd;
  }

  /**
   * Check if a habit is overdue
   */
  public isHabitOverdue(habit: Habit, occurrence: HabitOccurrence): boolean {
    const now = new Date();
    const windowEnd = new Date(occurrence.windowEnd);
    
    return now > windowEnd;
  }
}

export const habitEngine = HabitEngine.getInstance();

