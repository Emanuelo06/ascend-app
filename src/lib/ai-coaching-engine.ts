import { Habit, HabitCheckin, HabitMetrics, AIInsight } from '@/types';

export interface CoachingContext {
  userId: string;
  habits: Habit[];
  checkins: HabitCheckin[];
  metrics: HabitMetrics[];
  goals: string[];
  timezone: string;
  currentStreak: number;
  recentProgress: string[];
}

export class AICoachingEngine {
  private static instance: AICoachingEngine;
  private insightsCache: Map<string, { insight: AIInsight; expiresAt: Date }> = new Map();

  private constructor() {
    console.log('🤖 AI Coaching Engine initialized - Ready to provide insights');
  }

  public static getInstance(): AICoachingEngine {
    if (!AICoachingEngine.instance) {
      AICoachingEngine.instance = new AICoachingEngine();
    }
    return AICoachingEngine.instance;
  }

  /**
   * Generate weekly insights based on user data
   */
  public async generateWeeklyInsights(context: CoachingContext): Promise<AIInsight[]> {
    const cacheKey = `weekly-${context.userId}-${this.getWeekStart()}`;
    
    // Check cache first
    const cached = this.insightsCache.get(cacheKey);
    if (cached && cached.expiresAt > new Date()) {
      return [cached.insight];
    }

    try {
      const insights = await this.analyzeWeeklyData(context);
      
      // Cache the insight for 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      this.insightsCache.set(cacheKey, {
        insight: insights[0],
        expiresAt
      });

      return insights;
    } catch (error) {
      console.error('Error generating weekly insights:', error);
      return this.getFallbackInsights(context);
    }
  }

  /**
   * Generate habit-specific insights
   */
  public async generateHabitInsights(
    habitId: string, 
    context: CoachingContext
  ): Promise<AIInsight | null> {
    const cacheKey = `habit-${context.userId}-${habitId}`;
    
    // Check cache first
    const cached = this.insightsCache.get(cacheKey);
    if (cached && cached.expiresAt > new Date()) {
      return cached.insight;
    }

    try {
      const habit = context.habits.find(h => h.id === habitId);
      if (!habit) return null;

      const habitCheckins = context.checkins.filter(c => c.habitId === habitId);
      const habitMetrics = context.metrics.find(m => m.habitId === habitId);

      const insight = await this.analyzeHabitData(habit, habitCheckins, habitMetrics, context);
      
      // Cache the insight for 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      this.insightsCache.set(cacheKey, {
        insight,
        expiresAt
      });

      return insight;
    } catch (error) {
      console.error('Error generating habit insights:', error);
      return this.getFallbackHabitInsight(context);
    }
  }

  /**
   * Generate insights for new habit creation
   */
  public async generateOnCreateInsights(
    habit: Habit, 
    context: CoachingContext
  ): Promise<AIInsight> {
    const cacheKey = `oncreate-${context.userId}-${habit.id}`;
    
    // Check cache first
    const cached = this.insightsCache.get(cacheKey);
    if (cached && cached.expiresAt > new Date()) {
      return cached.insight;
    }

    try {
      const insight = await this.analyzeNewHabit(habit, context);
      
      // Cache the insight for 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      this.insightsCache.set(cacheKey, {
        insight,
        expiresAt
      });

      return insight;
    } catch (error) {
      console.error('Error generating onCreate insights:', error);
      return this.getFallbackOnCreateInsight(habit, context);
    }
  }

  /**
   * Analyze weekly data to generate insights
   */
  private async analyzeWeeklyData(context: CoachingContext): Promise<AIInsight[]> {
    const weekStart = this.getWeekStart();
    const weekEnd = this.getWeekEnd();
    
    // Calculate weekly progress
    const weeklyCheckins = context.checkins.filter(c => {
      const checkinDate = new Date(c.date);
      return checkinDate >= weekStart && checkinDate <= weekEnd;
    });

    const totalHabits = context.habits.length;
    const completedHabits = weeklyCheckins.filter(c => c.status !== 'skipped').length;
    const weeklyProgress = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

    // Find top performing habits
    const habitPerformance = context.habits.map(habit => {
      const habitCheckins = weeklyCheckins.filter(c => c.habitId === habit.id);
      const completed = habitCheckins.filter(c => c.status !== 'skipped').length;
      const total = habitCheckins.length;
      return { habit, completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
    });

    const topHabits = habitPerformance
      .filter(p => p.percentage >= 80)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);

    const strugglingHabits = habitPerformance
      .filter(p => p.percentage < 50)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3);

    // Generate insights based on patterns
    const insights: AIInsight[] = [];

    if (topHabits.length > 0) {
      const topHabit = topHabits[0];
      insights.push({
        id: `weekly-${context.userId}-${Date.now()}`,
        userId: context.userId,
        type: 'weekly',
        content: `Great work on ${topHabit.habit.title}! You're maintaining excellent consistency.`,
        action: `Keep up the momentum with ${topHabit.habit.title}`,
        microChallenge: `Maintain this habit for 3 more days`,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    if (strugglingHabits.length > 0) {
      const strugglingHabit = strugglingHabits[0];
      insights.push({
        id: `weekly-${context.userId}-${Date.now() + 1}`,
        userId: context.userId,
        type: 'weekly',
        content: `${strugglingHabit.habit.title} could use some attention. Consider adjusting the timing or difficulty.`,
        action: `Move ${strugglingHabit.habit.title} to a different moment`,
        microChallenge: `Try this habit 3 times this week`,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return insights;
  }

  /**
   * Analyze specific habit data
   */
  private async analyzeHabitData(
    habit: Habit,
    checkins: HabitCheckin[],
    metrics: HabitMetrics | undefined,
    context: CoachingContext
  ): Promise<AIInsight> {
    const recentCheckins = checkins.slice(-7); // Last 7 days
    const completionRate = recentCheckins.length > 0 
      ? (recentCheckins.filter(c => c.status !== 'skipped').length / recentCheckins.length) * 100
      : 0;

    let content = '';
    let action = '';
    let microChallenge = '';

    if (completionRate >= 80) {
      content = `Excellent consistency with ${habit.title}! You're building a strong foundation.`;
      action = `Consider increasing the difficulty or adding a related habit`;
      microChallenge = `Maintain this streak for 5 more days`;
    } else if (completionRate >= 50) {
      content = `Good progress with ${habit.title}. There's room for improvement.`;
      action = `Try setting a reminder 15 minutes before the habit window`;
      microChallenge = `Complete this habit 4 times this week`;
    } else {
      content = `${habit.title} needs attention. Let's make it easier to succeed.`;
      action = `Reduce the dose or move to a different time`;
      microChallenge = `Try this habit just 2 times this week`;
    }

    return {
      id: `habit-${context.userId}-${habit.id}`,
      userId: context.userId,
      habitId: habit.id,
      type: 'habit',
      content,
      action,
      microChallenge,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * Analyze new habit for guidance
   */
  private async analyzeNewHabit(habit: Habit, context: CoachingContext): Promise<AIInsight> {
    const similarHabits = context.habits.filter(h => h.moment === habit.moment);
    const momentHabits = similarHabits.length;

    let content = '';
    let action = '';
    let microChallenge = '';

    if (momentHabits === 0) {
      content = `Great choice! ${habit.title} will be your first ${habit.moment} habit.`;
      action = `Set a reminder for ${habit.window.start}`;
      microChallenge = `Complete this habit 3 times this week`;
    } else if (momentHabits < 3) {
      content = `Adding ${habit.title} to your ${habit.moment} routine. You're building a balanced schedule.`;
      action = `Space this habit 30 minutes apart from others`;
      microChallenge = `Complete this habit 4 times this week`;
    } else {
      content = `Your ${habit.moment} moment is getting busy. Consider if you can handle another habit.`;
      action = `Review your ${habit.moment} habits and prioritize`;
      microChallenge = `Complete this habit 2 times this week`;
    }

    return {
      id: `oncreate-${context.userId}-${habit.id}`,
      userId: context.userId,
      habitId: habit.id,
      type: 'onCreate',
      content,
      action,
      microChallenge,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * Get fallback insights when AI analysis fails
   */
  private getFallbackInsights(context: CoachingContext): AIInsight[] {
    return [{
      id: `fallback-${context.userId}-${Date.now()}`,
      userId: context.userId,
      type: 'weekly',
      content: 'Keep up the great work! Consistency is key to building lasting habits.',
      action: 'Review your progress and celebrate small wins',
      microChallenge: 'Complete one habit from each moment today',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }];
  }

  private getFallbackHabitInsight(context: CoachingContext): AIInsight {
    return {
      id: `fallback-habit-${context.userId}-${Date.now()}`,
      userId: context.userId,
      type: 'habit',
      content: 'Every habit counts, no matter how small. Keep moving forward!',
      action: 'Try to complete this habit at least once today',
      microChallenge: 'Complete this habit 2 times this week',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private getFallbackOnCreateInsight(habit: Habit, context: CoachingContext): AIInsight {
    return {
      id: `fallback-oncreate-${context.userId}-${habit.id}`,
      userId: context.userId,
      habitId: habit.id,
      type: 'onCreate',
      content: `Welcome to your new habit: ${habit.title}! Start small and build consistency.`,
      action: `Set a reminder and start with the first step`,
      microChallenge: `Complete this habit 3 times this week`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * Clear expired cache entries
   */
  public clearExpiredCache(): void {
    const now = new Date();
    for (const [key, value] of this.insightsCache.entries()) {
      if (value.expiresAt <= now) {
        this.insightsCache.delete(key);
      }
    }
  }

  /**
   * Get week start date (Monday)
   */
  private getWeekStart(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(now.setDate(diff));
  }

  /**
   * Get week end date (Sunday)
   */
  private getWeekEnd(): Date {
    const weekStart = this.getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  }
}

export const aiCoachingEngine = AICoachingEngine.getInstance();
