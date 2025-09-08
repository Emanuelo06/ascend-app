import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access (you might want to add proper authentication here)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, userId } = body;

    const targetDate = date ? new Date(date) : new Date();
    const dateStr = targetDate.toISOString().split('T')[0];

    // If userId is provided, process only that user, otherwise process all users
    const users = userId ? [{ id: userId }] : await getAllActiveUsers();

    const results = [];

    for (const user of users) {
      try {
        const result = await processDailyRollup(user.id, dateStr);
        results.push({ userId: user.id, success: true, result });
      } catch (error) {
        console.error(`Error processing daily rollup for user ${user.id}:`, error);
        results.push({ userId: user.id, success: false, error: error.message });
      }
    }

    return NextResponse.json({ 
      message: 'Daily rollup completed',
      processed: results.length,
      results 
    });

  } catch (error) {
    console.error('Daily rollup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to get all active users
async function getAllActiveUsers() {
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('id')
    .not('id', 'is', null);

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return users || [];
}

// Main daily rollup processing function
async function processDailyRollup(userId: string, date: string) {
  console.log(`Processing daily rollup for user ${userId} on ${date}`);

  // 1. Update daily progress heatmap
  await updateDailyProgressHeatmap(userId, date);

  // 2. Update habit metrics (streaks, EMA)
  await updateHabitMetrics(userId, date);

  // 3. Check if it's the end of the week and generate weekly snapshot
  const isEndOfWeek = await checkIfEndOfWeek(date);
  if (isEndOfWeek) {
    await generateWeeklySnapshot(userId, date);
  }

  // 4. Generate insights if needed
  await generateInsightsIfNeeded(userId, date);

  return { date, userId, completed: true };
}

// Update daily progress heatmap
async function updateDailyProgressHeatmap(userId: string, date: string) {
  // Get all habits for the user
  const { data: habits } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', userId)
    .eq('archived', false);

  const totalHabits = habits?.length || 0;

  // Get checkins for the day
  const { data: checkins } = await supabase
    .from('habit_checkins')
    .select('status')
    .eq('user_id', userId)
    .eq('date', date);

  const completedHabits = checkins?.filter(c => c.status === 'done').length || 0;
  const partialHabits = checkins?.filter(c => c.status === 'partial').length || 0;
  const missedHabits = Math.max(0, totalHabits - completedHabits - partialHabits);
  const completionPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // Upsert daily progress record
  const { error } = await supabase
    .from('daily_progress_heatmap')
    .upsert({
      user_id: userId,
      date,
      total_habits: totalHabits,
      completed_habits: completedHabits,
      partial_habits: partialHabits,
      missed_habits: missedHabits,
      completion_percentage: completionPercentage
    }, { 
      onConflict: 'user_id,date',
      ignoreDuplicates: false 
    });

  if (error) {
    console.error('Error updating daily progress heatmap:', error);
    throw error;
  }
}

// Update habit metrics (streaks, EMA)
async function updateHabitMetrics(userId: string, date: string) {
  // Get all habits for the user
  const { data: habits } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', userId)
    .eq('archived', false);

  if (!habits) return;

  for (const habit of habits) {
    await updateHabitMetric(userId, habit.id, date);
  }
}

// Update individual habit metric
async function updateHabitMetric(userId: string, habitId: string, date: string) {
  // Get current metric record
  const { data: existingMetric } = await supabase
    .from('habit_metrics')
    .select('*')
    .eq('user_id', userId)
    .eq('habit_id', habitId)
    .single();

  // Calculate current streak
  const currentStreak = await calculateCurrentStreak(userId, habitId, date);
  
  // Calculate best streak
  const bestStreak = Math.max(
    currentStreak,
    existingMetric?.streak?.best || 0
  );

  // Calculate EMA (30-day exponential moving average)
  const ema30 = await calculateEMA30(userId, habitId, date, existingMetric?.ema30 || 0.5);

  // Update or create metric record
  const { error } = await supabase
    .from('habit_metrics')
    .upsert({
      user_id: userId,
      habit_id: habitId,
      ema30,
      streak: {
        current: currentStreak,
        best: bestStreak,
        lastDate: date,
        graceTokens: 3
      },
      last_updated: date
    }, { 
      onConflict: 'user_id,habit_id',
      ignoreDuplicates: false 
    });

  if (error) {
    console.error('Error updating habit metric:', error);
    throw error;
  }
}

// Calculate current streak for a habit
async function calculateCurrentStreak(userId: string, habitId: string, currentDate: string): Promise<number> {
  const { data: checkins } = await supabase
    .from('habit_checkins')
    .select('date, status')
    .eq('user_id', userId)
    .eq('habit_id', habitId)
    .eq('status', 'done')
    .order('date', { ascending: false });

  if (!checkins || checkins.length === 0) return 0;

  let streak = 0;
  const currentDateObj = new Date(currentDate);
  
  for (const checkin of checkins) {
    const checkinDate = new Date(checkin.date);
    const daysDiff = Math.floor((currentDateObj.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Calculate 30-day exponential moving average
async function calculateEMA30(userId: string, habitId: string, currentDate: string, previousEMA: number): Promise<number> {
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentCheckins } = await supabase
    .from('habit_checkins')
    .select('date, status')
    .eq('user_id', userId)
    .eq('habit_id', habitId)
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
    .lte('date', currentDate)
    .order('date', { ascending: true });

  if (!recentCheckins || recentCheckins.length === 0) return previousEMA;

  // Calculate completion rate for the period
  const totalDays = 30;
  const completedDays = recentCheckins.filter(c => c.status === 'done').length;
  const completionRate = completedDays / totalDays;

  // EMA calculation: EMA = α * current_value + (1 - α) * previous_EMA
  // α = 2 / (n + 1) where n = 30, so α = 2/31 ≈ 0.065
  const alpha = 2 / (30 + 1);
  const newEMA = alpha * completionRate + (1 - alpha) * previousEMA;

  return Math.round(newEMA * 10000) / 10000; // Round to 4 decimal places
}

// Check if it's the end of the week (Sunday)
async function checkIfEndOfWeek(date: string): Promise<boolean> {
  const dateObj = new Date(date);
  return dateObj.getDay() === 0; // Sunday
}

// Generate weekly snapshot
async function generateWeeklySnapshot(userId: string, date: string) {
  // Calculate week start (Monday)
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(dateObj);
  weekStart.setDate(dateObj.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  const weekStartStr = weekStart.toISOString().split('T')[0];

  // Use the existing function to calculate weekly snapshot
  const { data: snapshotData, error: calcError } = await supabase
    .rpc('calculate_weekly_snapshot', {
      p_user_id: userId,
      p_week_start: weekStartStr
    });

  if (calcError || !snapshotData || snapshotData.length === 0) {
    console.error('Error calculating weekly snapshot:', calcError);
    return;
  }

  const snapshot = snapshotData[0];
  const weekEndDate = new Date(weekStart);
  weekEndDate.setDate(weekStart.getDate() + 6);

  // Generate AI summary
  let aiSummary = null;
  let aiInsights = [];

  try {
    const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/weekly-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        weekStart: weekStartStr,
        snapshotData: snapshot
      })
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      aiSummary = aiData.summary;
      aiInsights = aiData.insights || [];
    }
  } catch (aiError) {
    console.error('AI summary generation failed:', aiError);
  }

  // Save weekly snapshot
  const snapshotRecord = {
    user_id: userId,
    week_start: weekStartStr,
    week_end: weekEndDate.toISOString().split('T')[0],
    completion_percentage: snapshot.completion_percentage,
    total_habits: snapshot.total_habits,
    completed_habits: snapshot.completed_habits,
    current_streak: snapshot.current_streak,
    best_streak: snapshot.best_streak,
    avg_mood: snapshot.avg_mood,
    avg_energy: snapshot.avg_energy,
    best_moment: snapshot.best_moment,
    worst_moment: snapshot.worst_moment,
    top_habits: snapshot.top_habits,
    struggling_habits: snapshot.struggling_habits,
    ai_summary: aiSummary,
    ai_insights: aiInsights
  };

  const { error: saveError } = await supabase
    .from('weekly_snapshots')
    .upsert(snapshotRecord, { 
      onConflict: 'user_id,week_start',
      ignoreDuplicates: false 
    });

  if (saveError) {
    console.error('Error saving weekly snapshot:', saveError);
    throw saveError;
  }
}

// Generate insights if needed
async function generateInsightsIfNeeded(userId: string, date: string) {
  // Check if it's been a week since last insights were generated
  const { data: lastInsight } = await supabase
    .from('user_insights')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const shouldGenerateInsights = !lastInsight || 
    (new Date(date).getTime() - new Date(lastInsight.created_at).getTime()) > (7 * 24 * 60 * 60 * 1000);

  if (shouldGenerateInsights) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/analytics/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          forceRegenerate: false
        })
      });

      if (!response.ok) {
        console.error('Failed to generate insights');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    }
  }
}