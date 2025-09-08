import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const weekStart = searchParams.get('weekStart');

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

    // Get weekly focus
    const { data: weeklyFocus, error: focusError } = await supabase
      .from('weekly_focus')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start', weekStartStr)
      .single();

    if (focusError && focusError.code !== 'PGRST116') {
      console.error('Error fetching weekly focus:', focusError);
      return NextResponse.json({ error: 'Failed to fetch weekly focus' }, { status: 500 });
    }

    // If no focus exists, generate one
    if (!weeklyFocus) {
      const generatedFocus = await generateWeeklyFocus(userId, weekStartStr);
      return NextResponse.json({ data: generatedFocus });
    }

    return NextResponse.json({ data: weeklyFocus });

  } catch (error) {
    console.error('Weekly focus API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, weekStart, focusTitle, focusDescription, focusType, targetHabits, targetCompletionRate, targetStreak } = body;

    if (!userId || !focusTitle) {
      return NextResponse.json({ error: 'User ID and focus title are required' }, { status: 400 });
    }

    // Calculate week start
    const currentWeekStart = weekStart ? new Date(weekStart) : new Date();
    const dayOfWeek = currentWeekStart.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStartDate = new Date(currentWeekStart);
    weekStartDate.setDate(currentWeekStart.getDate() + mondayOffset);
    weekStartDate.setHours(0, 0, 0, 0);

    const weekStartStr = weekStartDate.toISOString().split('T')[0];

    const focusData = {
      user_id: userId,
      week_start: weekStartStr,
      focus_title: focusTitle,
      focus_description: focusDescription || null,
      focus_type: focusType || 'habit_improvement',
      target_habits: targetHabits || [],
      target_completion_rate: targetCompletionRate || null,
      target_streak: targetStreak || 0,
      current_progress: 0,
      is_achieved: false,
      is_ai_generated: false
    };

    // Upsert weekly focus
    const { data: savedFocus, error: saveError } = await supabase
      .from('weekly_focus')
      .upsert(focusData, { 
        onConflict: 'user_id,week_start',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving weekly focus:', saveError);
      return NextResponse.json({ error: 'Failed to save weekly focus' }, { status: 500 });
    }

    return NextResponse.json({ data: savedFocus });

  } catch (error) {
    console.error('Weekly focus creation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { focusId, userId, currentProgress, isAchieved } = body;

    if (!focusId || !userId) {
      return NextResponse.json({ error: 'Focus ID and user ID are required' }, { status: 400 });
    }

    const updateData: any = {};
    
    if (currentProgress !== undefined) {
      updateData.current_progress = currentProgress;
    }
    
    if (isAchieved !== undefined) {
      updateData.is_achieved = isAchieved;
      if (isAchieved) {
        updateData.achieved_at = new Date().toISOString();
      }
    }

    const { data: updatedFocus, error: updateError } = await supabase
      .from('weekly_focus')
      .update(updateData)
      .eq('id', focusId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating weekly focus:', updateError);
      return NextResponse.json({ error: 'Failed to update weekly focus' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedFocus });

  } catch (error) {
    console.error('Weekly focus update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to generate weekly focus
async function generateWeeklyFocus(userId: string, weekStart: string) {
  try {
    // Get weekly snapshot data
    const { data: snapshotData, error: snapshotError } = await supabase
      .rpc('calculate_weekly_snapshot', {
        p_user_id: userId,
        p_week_start: weekStart
      });

    if (snapshotError || !snapshotData || snapshotData.length === 0) {
      console.error('Error getting snapshot data for focus:', snapshotError);
      return null;
    }

    const snapshot = snapshotData[0];

    // Generate focus based on current performance
    let focusTitle = '';
    let focusDescription = '';
    let focusType = 'habit_improvement';
    let targetCompletionRate = 70;
    let targetHabits: string[] = [];

    if (snapshot.completion_percentage < 50) {
      focusTitle = 'Build Consistency';
      focusDescription = 'Focus on completing at least 70% of your habits this week. Start with your easiest habits and build momentum.';
      focusType = 'consistency';
      targetCompletionRate = 70;
    } else if (snapshot.completion_percentage < 80) {
      focusTitle = 'Optimize Your Routine';
      focusDescription = 'You\'re doing well! Focus on optimizing your weakest moment and maintaining your current momentum.';
      focusType = 'habit_improvement';
      targetCompletionRate = Math.min(90, snapshot.completion_percentage + 10);
    } else {
      focusTitle = 'Add New Challenge';
      focusDescription = 'Excellent consistency! Consider adding a new habit or increasing the difficulty of existing ones.';
      focusType = 'new_habit';
      targetCompletionRate = 85;
    }

    // Get struggling habits for targeting
    if (snapshot.struggling_habits && snapshot.struggling_habits.length > 0) {
      targetHabits = snapshot.struggling_habits.slice(0, 2); // Focus on top 2 struggling habits
    }

    const focusData = {
      user_id: userId,
      week_start: weekStart,
      focus_title: focusTitle,
      focus_description: focusDescription,
      focus_type: focusType,
      target_habits: targetHabits,
      target_completion_rate: targetCompletionRate,
      target_streak: Math.max(7, snapshot.current_streak + 3),
      current_progress: 0,
      is_achieved: false,
      is_ai_generated: true
    };

    // Save to database
    const { data: savedFocus, error: saveError } = await supabase
      .from('weekly_focus')
      .insert(focusData)
      .select()
      .single();

    if (saveError) {
      console.error('Error saving generated weekly focus:', saveError);
      return focusData; // Return generated focus even if save fails
    }

    return savedFocus;

  } catch (error) {
    console.error('Error generating weekly focus:', error);
    return null;
  }
}
