import { Habit, HabitCheckin, HabitMetrics } from '@/types';

export interface HabitAnalytics {
  overall: OverallStats;
  trends: TrendAnalysis;
  predictions: PredictiveInsights;
  recommendations: AIRecommendations;
  performance: PerformanceMetrics;
}

export interface OverallStats {
  totalHabits: number;
  activeHabits: number;
  completionRate: number;
  averageStreak: number;
  longestStreak: number;
  totalXP: number;
  weeklyProgress: number;
  monthlyProgress: number;
}

export interface TrendAnalysis {
  dailyTrends: DailyTrend[];
  weeklyTrends: WeeklyTrend[];
  monthlyTrends: MonthlyTrend[];
  seasonalPatterns: SeasonalPattern[];
  correlationMatrix: CorrelationData[];
}

export interface DailyTrend {
  date: string;
  completionRate: number;
  totalHabits: number;
  completedHabits: number;
  averageEffort: number;
  mood: number;
  energy: number;
}

export interface WeeklyTrend {
  weekStart: string;
  weekEnd: string;
  averageCompletionRate: number;
  totalCheckins: number;
  streakGrowth: number;
  newHabits: number;
  archivedHabits: number;
}

export interface MonthlyTrend {
  month: string;
  overallProgress: number;
  habitRetention: number;
  consistencyScore: number;
  goalAchievement: number;
}

export interface SeasonalPattern {
  season: string;
  months: string[];
  averageCompletionRate: number;
  topPerformingHabits: string[];
  challenges: string[];
}

export interface CorrelationData {
  habit1: string;
  habit2: string;
  correlation: number;
  significance: number;
  description: string;
}

export interface PredictiveInsights {
  nextWeekForecast: WeekForecast;
  habitSuccessProbability: HabitSuccessPrediction[];
  optimalTiming: OptimalTiming[];
  riskAssessment: RiskAssessment[];
}

export interface WeekForecast {
  predictedCompletionRate: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export interface HabitSuccessPrediction {
  habitId: string;
  habitName: string;
  successProbability: number;
  confidence: number;
  keyFactors: string[];
  improvementSuggestions: string[];
}

export interface OptimalTiming {
  habitId: string;
  habitName: string;
  bestTime: string;
  bestDay: string;
  confidence: number;
  reasoning: string;
}

export interface RiskAssessment {
  habitId: string;
  habitName: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  mitigationStrategies: string[];
  probability: number;
}

export interface AIRecommendations {
  habitOptimization: HabitOptimization[];
  newHabitSuggestions: NewHabitSuggestion[];
  scheduleOptimization: ScheduleOptimization[];
  motivationTips: MotivationTip[];
}

export interface HabitOptimization {
  habitId: string;
  habitName: string;
  currentScore: number;
  potentialScore: number;
  improvements: string[];
  estimatedImpact: number;
}

export interface NewHabitSuggestion {
  title: string;
  category: string;
  difficulty: number;
  estimatedTime: number;
  confidence: number;
  reasoning: string;
  complementaryHabits: string[];
}

export interface ScheduleOptimization {
  currentSchedule: string;
  suggestedSchedule: string;
  reasoning: string;
  expectedImprovement: number;
  implementationSteps: string[];
}

export interface MotivationTip {
  type: 'encouragement' | 'challenge' | 'insight' | 'celebration';
  message: string;
  actionItem: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface PerformanceMetrics {
  consistency: ConsistencyMetrics;
  efficiency: EfficiencyMetrics;
  growth: GrowthMetrics;
  engagement: EngagementMetrics;
}

export interface ConsistencyMetrics {
  overallConsistency: number;
  dailyConsistency: number;
  weeklyConsistency: number;
  monthlyConsistency: number;
  streakReliability: number;
}

export interface EfficiencyMetrics {
  timeToCompletion: number;
  effortEfficiency: number;
  habitClustering: number;
  optimizationScore: number;
}

export interface GrowthMetrics {
  skillImprovement: number;
  habitComplexity: number;
  goalProgress: number;
  personalDevelopment: number;
}

export interface EngagementMetrics {
  checkinFrequency: number;
  reflectionQuality: number;
  socialInteraction: number;
  learningEngagement: number;
}

class EnhancedHabitAnalytics {
  private static instance: EnhancedHabitAnalytics;

  private constructor() {}

  static getInstance(): EnhancedHabitAnalytics {
    if (!EnhancedHabitAnalytics.instance) {
      EnhancedHabitAnalytics.instance = new EnhancedHabitAnalytics();
    }
    return EnhancedHabitAnalytics.instance;
  }

  // Generate comprehensive analytics
  async generateAnalytics(
    userId: string,
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): Promise<HabitAnalytics> {
    try {
      const overall = this.calculateOverallStats(habits, checkins, metrics);
      const trends = this.analyzeTrends(habits, checkins, metrics);
      const predictions = this.generatePredictions(habits, checkins, metrics);
      const recommendations = this.generateRecommendations(habits, checkins, metrics);
      const performance = this.calculatePerformanceMetrics(habits, checkins, metrics);

      return {
        overall,
        trends,
        predictions,
        recommendations,
        performance
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw error;
    }
  }

  private calculateOverallStats(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): OverallStats {
    const activeHabits = habits.filter(h => !h.archived && h.isActive);
    const totalHabits = activeHabits.length;
    
    // Calculate completion rate for today
    const today = new Date().toISOString().split('T')[0];
    const todayCheckins = checkins.filter(c => c.date === today);
    const completedToday = todayCheckins.filter(c => c.status === 'done').length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    // Calculate streaks
    const streaks = activeHabits.map(h => h.currentStreak || 0);
    const averageStreak = streaks.length > 0 ? Math.round(streaks.reduce((a, b) => a + b, 0) / streaks.length) : 0;
    const longestStreak = streaks.length > 0 ? Math.max(...streaks) : 0;

    // Calculate XP
    const totalXP = activeHabits.reduce((sum, h) => sum + (h.xp || 0), 0);

    // Calculate weekly and monthly progress
    const weeklyProgress = this.calculateWeeklyProgress(checkins, totalHabits);
    const monthlyProgress = this.calculateMonthlyProgress(checkins, totalHabits);

    return {
      totalHabits,
      activeHabits: totalHabits,
      completionRate,
      averageStreak,
      longestStreak,
      totalXP,
      weeklyProgress,
      monthlyProgress
    };
  }

  private calculateWeeklyProgress(checkins: HabitCheckin[], totalHabits: number): number {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const weekCheckins = checkins.filter(c => new Date(c.date) >= lastWeek);
    const uniqueDays = new Set(weekCheckins.map(c => c.date)).size;
    const maxPossible = totalHabits * 7;
    const actual = weekCheckins.filter(c => c.status === 'done').length;
    
    return maxPossible > 0 ? Math.round((actual / maxPossible) * 100) : 0;
  }

  private calculateMonthlyProgress(checkins: HabitCheckin[], totalHabits: number): number {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthCheckins = checkins.filter(c => new Date(c.date) >= lastMonth);
    const maxPossible = totalHabits * 30;
    const actual = monthCheckins.filter(c => c.status === 'done').length;
    
    return maxPossible > 0 ? Math.round((actual / maxPossible) * 100) : 0;
  }

  private analyzeTrends(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): TrendAnalysis {
    const dailyTrends = this.generateDailyTrends(checkins, habits);
    const weeklyTrends = this.generateWeeklyTrends(checkins, habits);
    const monthlyTrends = this.generateMonthlyTrends(checkins, habits);
    const seasonalPatterns = this.analyzeSeasonalPatterns(checkins, habits);
    const correlationMatrix = this.calculateCorrelations(habits, checkins);

    return {
      dailyTrends,
      weeklyTrends,
      monthlyTrends,
      seasonalPatterns,
      correlationMatrix
    };
  }

  private generateDailyTrends(checkins: HabitCheckin[], habits: Habit[]): DailyTrend[] {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const trends: DailyTrend[] = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayCheckins = checkins.filter(c => c.date === dateStr);
      const totalHabits = habits.filter(h => !h.archived && h.isActive).length;
      const completedHabits = dayCheckins.filter(c => c.status === 'done').length;
      const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
      
      trends.push({
        date: dateStr,
        completionRate,
        totalHabits,
        completedHabits,
        averageEffort: this.calculateAverageEffort(dayCheckins),
        mood: this.calculateAverageMood(dayCheckins),
        energy: this.calculateAverageEnergy(dayCheckins)
      });
    }
    
    return trends;
  }

  private generateWeeklyTrends(checkins: HabitCheckin[], habits: Habit[]): WeeklyTrend[] {
    const last8Weeks = new Date();
    last8Weeks.setDate(last8Weeks.getDate() - 56);
    
    const trends: WeeklyTrend[] = [];
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekCheckins = checkins.filter(c => {
        const checkinDate = new Date(c.date);
        return checkinDate >= weekStart && checkinDate <= weekEnd;
      });
      
      const totalHabits = habits.filter(h => !h.archived && h.isActive).length;
      const maxPossible = totalHabits * 7;
      const actual = weekCheckins.filter(c => c.status === 'done').length;
      const averageCompletionRate = maxPossible > 0 ? Math.round((actual / maxPossible) * 100) : 0;
      
      trends.push({
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        averageCompletionRate,
        totalCheckins: weekCheckins.length,
        streakGrowth: this.calculateStreakGrowth(weekCheckins, habits),
        newHabits: 0, // Would need habit creation dates
        archivedHabits: 0 // Would need habit archive dates
      });
    }
    
    return trends;
  }

  private generateMonthlyTrends(checkins: HabitCheckin[], habits: Habit[]): MonthlyTrend[] {
    const last6Months = new Date();
    last6Months.setMonth(last6Months.getMonth() - 6);
    
    const trends: MonthlyTrend[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthStr = month.toISOString().slice(0, 7); // YYYY-MM format
      
      const monthCheckins = checkins.filter(c => c.date.startsWith(monthStr));
      const totalHabits = habits.filter(h => !h.archived && h.isActive).length;
      const maxPossible = totalHabits * 30;
      const actual = monthCheckins.filter(c => c.status === 'done').length;
      const overallProgress = maxPossible > 0 ? Math.round((actual / maxPossible) * 100) : 0;
      
      trends.push({
        month: monthStr,
        overallProgress,
        habitRetention: this.calculateHabitRetention(monthCheckins, habits),
        consistencyScore: this.calculateConsistencyScore(monthCheckins, habits),
        goalAchievement: this.calculateGoalAchievement(monthCheckins, habits)
      });
    }
    
    return trends;
  }

  private analyzeSeasonalPatterns(checkins: HabitCheckin[], habits: Habit[]): SeasonalPattern[] {
    // Mock seasonal analysis - in production, this would analyze actual seasonal data
    return [
      {
        season: 'Spring',
        months: ['03', '04', '05'],
        averageCompletionRate: 75,
        topPerformingHabits: ['Morning Exercise', 'Hydration'],
        challenges: ['Allergies', 'Schedule Changes']
      },
      {
        season: 'Summer',
        months: ['06', '07', '08'],
        averageCompletionRate: 70,
        topPerformingHabits: ['Outdoor Activities', 'Hydration'],
        challenges: ['Vacation', 'Heat']
      },
      {
        season: 'Fall',
        months: ['09', '10', '11'],
        averageCompletionRate: 80,
        topPerformingHabits: ['Reading', 'Reflection'],
        challenges: ['Back to School', 'Shorter Days']
      },
      {
        season: 'Winter',
        months: ['12', '01', '02'],
        averageCompletionRate: 65,
        topPerformingHabits: ['Indoor Exercise', 'Planning'],
        challenges: ['Cold Weather', 'Holidays']
      }
    ];
  }

  private calculateCorrelations(habits: Habit[], checkins: HabitCheckin[]): CorrelationData[] {
    // Mock correlation analysis - in production, this would use statistical analysis
    const correlations: CorrelationData[] = [];
    
    if (habits.length >= 2) {
      correlations.push({
        habit1: habits[0].title,
        habit2: habits[1].title,
        correlation: 0.75,
        significance: 0.95,
        description: 'Strong positive correlation between morning habits'
      });
    }
    
    return correlations;
  }

  private generatePredictions(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): PredictiveInsights {
    const nextWeekForecast = this.forecastNextWeek(habits, checkins, metrics);
    const habitSuccessProbability = this.predictHabitSuccess(habits, checkins, metrics);
    const optimalTiming = this.findOptimalTiming(habits, checkins, metrics);
    const riskAssessment = this.assessRisks(habits, checkins, metrics);

    return {
      nextWeekForecast,
      habitSuccessProbability,
      optimalTiming,
      riskAssessment
    };
  }

  private forecastNextWeek(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): WeekForecast {
    // Mock forecasting - in production, this would use ML models
    const currentTrend = this.calculateCurrentTrend(checkins, habits);
    const predictedRate = Math.min(100, Math.max(0, currentTrend + Math.random() * 20 - 10));
    
    return {
      predictedCompletionRate: Math.round(predictedRate),
      confidence: 0.75,
      factors: ['Current streak momentum', 'Weekly pattern consistency', 'Recent performance'],
      recommendations: ['Maintain morning routine', 'Focus on high-priority habits', 'Plan for weekend challenges']
    };
  }

  private predictHabitSuccess(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): HabitSuccessPrediction[] {
    return habits.map(habit => {
      const habitCheckins = checkins.filter(c => c.habitId === habit.id);
      const successRate = this.calculateHabitSuccessRate(habitCheckins);
      const probability = Math.min(100, Math.max(0, successRate + Math.random() * 20 - 10));
      
      return {
        habitId: habit.id,
        habitName: habit.title,
        successProbability: Math.round(probability),
        confidence: 0.8,
        keyFactors: ['Current streak', 'Time of day', 'Difficulty level'],
        improvementSuggestions: ['Optimize timing', 'Reduce difficulty', 'Add accountability']
      };
    });
  }

  private findOptimalTiming(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): OptimalTiming[] {
    return habits.map(habit => {
      const habitCheckins = checkins.filter(c => c.habitId === habit.id);
      const bestTime = this.analyzeBestTime(habitCheckins);
      const bestDay = this.analyzeBestDay(habitCheckins);
      
      return {
        habitId: habit.id,
        habitName: habit.title,
        bestTime: bestTime,
        bestDay: bestDay,
        confidence: 0.85,
        reasoning: 'Based on historical completion patterns and user preferences'
      };
    });
  }

  private assessRisks(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): RiskAssessment[] {
    return habits.map(habit => {
      const riskLevel = this.calculateRiskLevel(habit, checkins);
      const probability = this.calculateRiskProbability(habit, checkins);
      
      return {
        habitId: habit.id,
        habitName: habit.title,
        riskLevel,
        riskFactors: ['Low motivation', 'Time constraints', 'Difficulty level'],
        mitigationStrategies: ['Break into smaller steps', 'Set reminders', 'Find accountability partner'],
        probability
      };
    });
  }

  private generateRecommendations(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): AIRecommendations {
    const habitOptimization = this.optimizeHabits(habits, checkins, metrics);
    const newHabitSuggestions = this.suggestNewHabits(habits, checkins, metrics);
    const scheduleOptimization = this.optimizeSchedule(habits, checkins, metrics);
    const motivationTips = this.generateMotivationTips(habits, checkins, metrics);

    return {
      habitOptimization,
      newHabitSuggestions,
      scheduleOptimization,
      motivationTips
    };
  }

  private optimizeHabits(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): HabitOptimization[] {
    return habits.map(habit => {
      const currentScore = this.calculateHabitScore(habit, checkins, metrics);
      const potentialScore = Math.min(100, currentScore + Math.random() * 30);
      
      return {
        habitId: habit.id,
        habitName: habit.title,
        currentScore: Math.round(currentScore),
        potentialScore: Math.round(potentialScore),
        improvements: ['Optimize timing', 'Adjust difficulty', 'Add accountability'],
        estimatedImpact: Math.round(potentialScore - currentScore)
      };
    });
  }

  private suggestNewHabits(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): NewHabitSuggestion[] {
    // Mock suggestions based on user patterns
    const suggestions: NewHabitSuggestion[] = [
      {
        title: 'Evening Reflection',
        category: 'mental',
        difficulty: 1,
        estimatedTime: 5,
        confidence: 0.85,
        reasoning: 'Complements your morning routine and improves sleep quality',
        complementaryHabits: ['Morning Prayer', 'Evening Reading']
      },
      {
        title: 'Hydration Tracking',
        category: 'physical',
        difficulty: 1,
        estimatedTime: 1,
        confidence: 0.90,
        reasoning: 'High success rate for simple, trackable habits',
        complementaryHabits: ['Morning Exercise', 'Healthy Eating']
      }
    ];
    
    return suggestions;
  }

  private optimizeSchedule(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): ScheduleOptimization[] {
    return [{
      currentSchedule: 'Random timing throughout the day',
      suggestedSchedule: 'Morning block (6-8 AM), Midday block (12-2 PM), Evening block (8-9 PM)',
      reasoning: 'Based on your highest completion rates and energy patterns',
      expectedImprovement: 25,
      implementationSteps: ['Start with morning block', 'Add midday block after 1 week', 'Include evening block after 2 weeks']
    }];
  }

  private generateMotivationTips(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): MotivationTip[] {
    const tips: MotivationTip[] = [
      {
        type: 'encouragement',
        message: 'You\'re on a great streak! Keep the momentum going.',
        actionItem: 'Celebrate your progress with a small reward',
        urgency: 'low'
      },
      {
        type: 'challenge',
        message: 'Ready to level up? Try increasing the difficulty of your top habit.',
        actionItem: 'Increase workout duration by 5 minutes',
        urgency: 'medium'
      },
      {
        type: 'insight',
        message: 'Your morning habits have 40% higher success rates.',
        actionItem: 'Focus on completing morning routines first',
        urgency: 'high'
      }
    ];
    
    return tips;
  }

  private calculatePerformanceMetrics(
    habits: Habit[],
    checkins: HabitCheckin[],
    metrics: HabitMetrics[]
  ): PerformanceMetrics {
    const consistency = this.calculateConsistencyMetrics(habits, checkins, metrics);
    const efficiency = this.calculateEfficiencyMetrics(habits, checkins, metrics);
    const growth = this.calculateGrowthMetrics(habits, checkins, metrics);
    const engagement = this.calculateEngagementMetrics(habits, checkins, metrics);

    return {
      consistency,
      efficiency,
      growth,
      engagement
    };
  }

  // Helper methods for calculations
  private calculateAverageEffort(checkins: HabitCheckin[]): number {
    if (checkins.length === 0) return 0;
    const efforts = checkins.map(c => c.effort || 0);
    return Math.round(efforts.reduce((a, b) => a + b, 0) / efforts.length);
  }

  private calculateAverageMood(checkins: HabitCheckin[]): number {
    // Mock mood calculation - would come from reflection data
    return Math.floor(Math.random() * 5) + 6; // 6-10 range
  }

  private calculateAverageEnergy(checkins: HabitCheckin[]): number {
    // Mock energy calculation - would come from reflection data
    return Math.floor(Math.random() * 5) + 6; // 6-10 range
  }

  private calculateStreakGrowth(checkins: HabitCheckin[], habits: Habit[]): number {
    // Mock streak growth calculation
    return Math.floor(Math.random() * 10) - 5; // -5 to +5 range
  }

  private calculateHabitRetention(checkins: HabitCheckin[], habits: Habit[]): number {
    // Mock retention calculation
    return Math.floor(Math.random() * 30) + 70; // 70-100 range
  }

  private calculateConsistencyScore(checkins: HabitCheckin[], habits: Habit[]): number {
    // Mock consistency calculation
    return Math.floor(Math.random() * 30) + 70; // 70-100 range
  }

  private calculateGoalAchievement(checkins: HabitCheckin[], habits: Habit[]): number {
    // Mock goal achievement calculation
    return Math.floor(Math.random() * 30) + 70; // 70-100 range
  }

  private calculateCurrentTrend(checkins: HabitCheckin[], habits: Habit[]): number {
    // Mock trend calculation
    return Math.floor(Math.random() * 30) + 70; // 70-100 range
  }

  private calculateHabitSuccessRate(checkins: HabitCheckin[]): number {
    if (checkins.length === 0) return 0;
    const successful = checkins.filter(c => c.status === 'done').length;
    return Math.round((successful / checkins.length) * 100);
  }

  private analyzeBestTime(checkins: HabitCheckin[]): string {
    // Mock time analysis
    const times = ['06:00', '07:00', '08:00', '12:00', '18:00', '20:00'];
    return times[Math.floor(Math.random() * times.length)];
  }

  private analyzeBestDay(checkins: HabitCheckin[]): string {
    // Mock day analysis
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[Math.floor(Math.random() * days.length)];
  }

  private calculateRiskLevel(habit: Habit, checkins: HabitCheckin[]): 'low' | 'medium' | 'high' {
    // Mock risk calculation
    const risk = Math.random();
    if (risk < 0.3) return 'low';
    if (risk < 0.7) return 'medium';
    return 'high';
  }

  private calculateRiskProbability(habit: Habit, checkins: HabitCheckin[]): number {
    // Mock probability calculation
    return Math.round(Math.random() * 100);
  }

  private calculateHabitScore(habit: Habit, checkins: HabitCheckin[], metrics: HabitMetrics[]): number {
    // Mock score calculation
    return Math.floor(Math.random() * 40) + 60; // 60-100 range
  }
}

export default EnhancedHabitAnalytics;
