import { NextRequest, NextResponse } from 'next/server';
import { habitEngine } from '@/lib/habit-engine';
import { Habit, HabitCheckin, HabitMetrics } from '@/types';

// Mock database for demo - replace with real database calls
let habits: Habit[] = [];
let checkins: HabitCheckin[] = [];
let metrics: HabitMetrics[] = [];

export async function POST(request: NextRequest) {
  try {
    // In production, this would be protected by admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting daily rollup job...');
    const startTime = Date.now();

    // Get all active habits
    const activeHabits = habits.filter(habit => !habit.archived);
    
    if (activeHabits.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active habits found for rollup',
        processed: 0
      });
    }

    let processedCount = 0;
    let errorCount = 0;
    const today = new Date().toISOString().split('T')[0];

    // Process each active habit
    for (const habit of activeHabits) {
      try {
        await processHabitRollup(habit, today);
        processedCount++;
      } catch (error) {
        console.error(`Error processing habit ${habit.id}:`, error);
        errorCount++;
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ Daily rollup completed in ${duration}ms`);
    console.log(`📊 Processed: ${processedCount}, Errors: ${errorCount}`);

    return NextResponse.json({
      success: true,
      message: 'Daily rollup completed successfully',
      processed: processedCount,
      errors: errorCount,
      duration: `${duration}ms`
    });

  } catch (error) {
    console.error('Error in daily rollup:', error);
    return NextResponse.json(
      { error: 'Internal server error during rollup' },
      { status: 500 }
    );
  }
}

/**
 * Process rollup for a single habit
 */
async function processHabitRollup(habit: Habit, date: string): Promise<void> {
  // Get checkins for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentCheckins = checkins.filter(checkin => {
    const checkinDate = new Date(checkin.date);
    return checkinDate >= thirtyDaysAgo && checkin.userId === habit.userId;
  });

  // Get or create metrics for this habit
  let habitMetrics = metrics.find(m => m.habitId === habit.id);
  
  if (!habitMetrics) {
    // Create new metrics
    habitMetrics = {
      id: `metrics-${habit.id}`,
      userId: habit.userId,
      habitId: habit.id,
      ema30: 0.5, // Default starting value
      streak: {
        current: 0,
        best: 0,
        lastDate: date,
        graceTokens: 0
      },
      maintenanceMode: false,
      lastUpdated: date
    };
    metrics.push(habitMetrics);
  }

  // Calculate daily scores for the last 30 days
  const dailyScores: number[] = [];
  const currentDate = new Date(thirtyDaysAgo);
  
  for (let i = 0; i < 30; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const checkin = recentCheckins.find(c => c.date === dateStr);
    
    const score = habitEngine.calculateDailyScore(checkin);
    dailyScores.push(score);
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Calculate EMA30
  let ema30 = habitMetrics.ema30;
  for (const score of dailyScores) {
    ema30 = habitEngine.calculateEMA(ema30, score);
  }

  // Calculate streak
  const streak = habitEngine.calculateStreak(
    habitMetrics.streak,
    recentCheckins,
    date
  );

  // Check maintenance mode
  const shouldEnterMaintenance = habitEngine.shouldEnterMaintenanceMode(ema30, streak.current);
  const shouldExitMaintenance = habitEngine.shouldExitMaintenanceMode(ema30);
  
  let maintenanceMode = habitMetrics.maintenanceMode;
  if (shouldEnterMaintenance) {
    maintenanceMode = true;
  } else if (shouldExitMaintenance) {
    maintenanceMode = false;
  }

  // Update metrics
  habitMetrics.ema30 = ema30;
  habitMetrics.streak = streak;
  habitMetrics.maintenanceMode = maintenanceMode;
  habitMetrics.lastUpdated = date;

  // Check if we should trigger AI intervention
  if (shouldTriggerAIIntervention(habitMetrics, ema30)) {
    await triggerAIIntervention(habit, habitMetrics);
  }

  console.log(`📈 Habit ${habit.title}: EMA30=${ema30.toFixed(3)}, Streak=${streak.current}, Maintenance=${maintenanceMode}`);
}

/**
 * Check if AI intervention should be triggered
 */
function shouldTriggerAIIntervention(previousMetrics: HabitMetrics, currentEMA: number): boolean {
  // Trigger if consistency drops more than 15% compared to previous week
  const dropThreshold = 0.15;
  const previousEMA = previousMetrics.ema30;
  
  if (previousEMA > 0) {
    const dropPercentage = (previousEMA - currentEMA) / previousEMA;
    return dropPercentage > dropThreshold;
  }
  
  return false;
}

/**
 * Trigger AI intervention for a habit
 */
async function triggerAIIntervention(habit: Habit, metrics: HabitMetrics): Promise<void> {
  try {
    console.log(`🤖 Triggering AI intervention for habit: ${habit.title}`);
    
    // In production, this would:
    // 1. Generate AI insights using the coaching engine
    // 2. Send notifications to the user
    // 3. Update the habit's coaching status
    
    // For demo purposes, just log the intervention
    console.log(`📱 Would send AI coaching notification to user ${habit.userId} for habit ${habit.title}`);
    console.log(`📊 Current metrics: EMA30=${metrics.ema30.toFixed(3)}, Streak=${metrics.streak.current}`);
    
  } catch (error) {
    console.error('Error triggering AI intervention:', error);
  }
}

/**
 * GET endpoint to view rollup status (for monitoring)
 */
export async function GET(request: NextRequest) {
  try {
    const activeHabits = habits.filter(habit => !habit.archived);
    const lastRollup = metrics.length > 0 
      ? Math.max(...metrics.map(m => new Date(m.lastUpdated).getTime()))
      : null;

    return NextResponse.json({
      success: true,
      data: {
        activeHabits: activeHabits.length,
        totalMetrics: metrics.length,
        lastRollup: lastRollup ? new Date(lastRollup).toISOString() : null,
        rollupStatus: 'ready'
      }
    });
  } catch (error) {
    console.error('Error getting rollup status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
