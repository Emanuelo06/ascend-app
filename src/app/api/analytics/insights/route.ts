import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'weekly';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get insights from database
    const { data: insights, error: insightsError } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('dismissed', false)
      .gte('expires_at', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (insightsError) {
      console.error('Error fetching insights:', insightsError);
      return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
    }

    // If no insights exist, generate them
    if (!insights || insights.length === 0) {
      const generatedInsights = await generateInsights(userId, type);
      return NextResponse.json({ data: generatedInsights });
    }

    return NextResponse.json({ data: insights });

  } catch (error) {
    console.error('Insights API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, weekStart, forceRegenerate = false } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Calculate week start
    const currentWeekStart = weekStart ? new Date(weekStart) : new Date();
    const dayOfWeek = currentWeekStart.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStartDate = new Date(currentWeekStart);
    weekStartDate.setDate(currentWeekStart.getDate() + mondayOffset);
    weekStartDate.setHours(0, 0, 0, 0);

    const weekStartStr = weekStartDate.toISOString().split('T')[0];

    // Clear existing insights if force regenerate
    if (forceRegenerate) {
      await supabase
        .from('user_insights')
        .delete()
        .eq('user_id', userId)
        .eq('related_week_start', weekStartStr);
    }

    // Generate new insights
    const insights = await generateInsights(userId, 'weekly', weekStartStr);

    return NextResponse.json({ data: insights });

  } catch (error) {
    console.error('Insights generation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { insightId, action, userId } = body;

    if (!insightId || !action || !userId) {
      return NextResponse.json({ error: 'Insight ID, action, and user ID are required' }, { status: 400 });
    }

    let updateData: any = {};

    switch (action) {
      case 'apply':
        updateData = {
          is_applied: true,
          applied_at: new Date().toISOString()
        };
        break;
      case 'dismiss':
        updateData = {
          dismissed: true,
          dismissed_at: new Date().toISOString()
        };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { data: updatedInsight, error: updateError } = await supabase
      .from('user_insights')
      .update(updateData)
      .eq('id', insightId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating insight:', updateError);
      return NextResponse.json({ error: 'Failed to update insight' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedInsight });

  } catch (error) {
    console.error('Insight update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to generate insights
async function generateInsights(userId: string, type: string, weekStart?: string) {
  try {
    // Get weekly snapshot data
    const weekStartStr = weekStart || getCurrentWeekStart();
    
    const { data: snapshotData, error: snapshotError } = await supabase
      .rpc('calculate_weekly_snapshot', {
        p_user_id: userId,
        p_week_start: weekStartStr
      });

    if (snapshotError || !snapshotData || snapshotData.length === 0) {
      console.error('Error getting snapshot data for insights:', snapshotError);
      return [];
    }

    const snapshot = snapshotData[0];

    // Generate insights based on data
    const insights = [];

    // Insight 1: Completion rate analysis
    if (snapshot.completion_percentage < 50) {
      insights.push({
        user_id: userId,
        insight_type: 'weekly',
        priority: 'high',
        title: 'Evenings need attention',
        description: 'Your evening habits are struggling. Consider moving them earlier or reducing difficulty.',
        evidence: `Only ${snapshot.completion_percentage}% completion this week`,
        suggested_action: 'Move evening habits to afternoon',
        action_type: 'move_habit',
        action_data: { from: 'evening', to: 'afternoon' },
        related_week_start: weekStartStr
      });
    } else if (snapshot.completion_percentage > 80) {
      insights.push({
        user_id: userId,
        insight_type: 'weekly',
        priority: 'medium',
        title: 'Great consistency!',
        description: 'Excellent week! Your habits are becoming automatic. Consider adding a new challenge.',
        evidence: `${snapshot.completion_percentage}% completion rate achieved`,
        suggested_action: 'Add a new habit to your routine',
        action_type: 'create_challenge',
        action_data: { difficulty: 'medium', category: 'wellness' },
        related_week_start: weekStartStr
      });
    }

    // Insight 2: Streak analysis
    if (snapshot.current_streak > 0 && snapshot.current_streak < snapshot.best_streak) {
      insights.push({
        user_id: userId,
        insight_type: 'pattern',
        priority: 'medium',
        title: 'Streak recovery opportunity',
        description: 'You\'re rebuilding your streak. Focus on consistency over perfection.',
        evidence: `Current streak: ${snapshot.current_streak}, Best: ${snapshot.best_streak}`,
        suggested_action: 'Set a micro-goal for this week',
        action_type: 'create_challenge',
        action_data: { type: 'streak_recovery', target: snapshot.best_streak },
        related_week_start: weekStartStr
      });
    }

    // Insight 3: Moment-based analysis
    if (snapshot.best_moment && snapshot.worst_moment && snapshot.best_moment !== snapshot.worst_moment) {
      insights.push({
        user_id: userId,
        insight_type: 'pattern',
        priority: 'medium',
        title: `${snapshot.best_moment} is your strength`,
        description: `You perform best in the ${snapshot.best_moment}. Consider optimizing your ${snapshot.worst_moment} habits.`,
        evidence: `Best: ${snapshot.best_moment}, Challenging: ${snapshot.worst_moment}`,
        suggested_action: `Optimize ${snapshot.worst_moment} routine`,
        action_type: 'adjust_difficulty',
        action_data: { focus_moment: snapshot.worst_moment },
        related_week_start: weekStartStr
      });
    }

    // Insight 4: Habit-specific insights
    if (snapshot.struggling_habits && snapshot.struggling_habits.length > 0) {
      // Get habit details
      const { data: strugglingHabits } = await supabase
        .from('habits')
        .select('id, title, moment, difficulty')
        .in('id', snapshot.struggling_habits);

      if (strugglingHabits && strugglingHabits.length > 0) {
        const habit = strugglingHabits[0];
        insights.push({
          user_id: userId,
          insight_type: 'habit',
          priority: 'high',
          title: `${habit.title} needs attention`,
          description: `This habit is consistently challenging. Consider adjusting the difficulty or timing.`,
          evidence: 'Low completion rate this week',
          suggested_action: `Adjust ${habit.title} difficulty`,
          action_type: 'adjust_difficulty',
          action_data: { habit_id: habit.id, current_difficulty: habit.difficulty },
          related_habit_id: habit.id,
          related_week_start: weekStartStr
        });
      }
    }

    // Save insights to database
    if (insights.length > 0) {
      const { data: savedInsights, error: saveError } = await supabase
        .from('user_insights')
        .insert(insights)
        .select();

      if (saveError) {
        console.error('Error saving insights:', saveError);
        return insights; // Return generated insights even if save fails
      }

      return savedInsights;
    }

    return [];

  } catch (error) {
    console.error('Error generating insights:', error);
    return [];
  }
}

// Helper function to get current week start
function getCurrentWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}
