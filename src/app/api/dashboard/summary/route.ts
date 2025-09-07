import { NextRequest, NextResponse } from 'next/server';
import { HabitDatabaseService } from '@/lib/habit-database-service';

const habitService = HabitDatabaseService.getInstance();

// GET /api/dashboard/summary - Get dashboard summary data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's habits
    const habits = await habitService.getHabitsByUser(userId);
    const activeHabits = habits.filter(habit => !habit.archived && habit.isActive);
    
    // Get today's checkins
    const today = new Date().toISOString().split('T')[0];
    const todayCheckins = await habitService.getCheckinsByUser(userId, today);
    
    // Calculate dashboard metrics
    const totalHabits = activeHabits.length;
    const completedToday = todayCheckins.filter(checkin => checkin.status === 'done').length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    
    // Calculate streaks
    const currentStreaks = activeHabits.map(habit => habit.currentStreak || 0);
    const longestStreaks = activeHabits.map(habit => habit.longestStreak || 0);
    
    const currentStreak = currentStreaks.length > 0 ? Math.max(...currentStreaks) : 0;
    const longestStreak = longestStreaks.length > 0 ? Math.max(...longestStreaks) : 0;
    
    // Calculate XP
    const totalXP = activeHabits.reduce((sum, habit) => sum + (habit.xp || 0), 0);
    
    // Get category breakdown
    const categoryBreakdown = activeHabits.reduce((acc, habit) => {
      const category = habit.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get recent activity (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekCheckins = await habitService.getCheckinsByUserInRange(
      userId, 
      lastWeek.toISOString().split('T')[0], 
      today
    );
    
    const weeklyActivity = lastWeekCheckins.reduce((acc, checkin) => {
      const date = checkin.date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get keystone habit (highest priority or most consistent)
    const keystoneHabit = activeHabits
      .filter(habit => habit.priority === 'high')
      .sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0))[0] || 
      activeHabits.sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0))[0];

    const summary = {
      totalHabits,
      activeHabits: activeHabits.length,
      completedToday,
      completionRate,
      currentStreak,
      longestStreak,
      totalXP,
      categoryBreakdown,
      weeklyActivity,
      keystoneHabit: keystoneHabit ? {
        id: keystoneHabit.id,
        name: keystoneHabit.habitName,
        category: keystoneHabit.category,
        currentStreak: keystoneHabit.currentStreak || 0,
        priority: keystoneHabit.priority
      } : null,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
