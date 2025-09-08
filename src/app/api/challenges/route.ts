import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const state = searchParams.get('state') || 'all';
    const goalId = searchParams.get('goalId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Build query
    let query = supabase
      .from('challenges')
      .select(`
        *,
        challenge_tasks(*),
        goals(title, purpose)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (state !== 'all') {
      query = query.eq('challenge_state', state);
    }

    if (goalId) {
      query = query.eq('goal_id', goalId);
    }

    const { data: challenges, error } = await query;

    if (error) {
      console.error('Error fetching challenges:', error);
      return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
    }

    return NextResponse.json({ data: challenges });

  } catch (error) {
    console.error('Challenges API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      goalId,
      title,
      description,
      durationDays,
      rewardXp = 0,
      rewardBadge,
      cadence = { type: 'daily' },
      tasks = []
    } = body;

    if (!userId || !title || !durationDays) {
      return NextResponse.json({ 
        error: 'User ID, title, and duration are required' 
      }, { status: 400 });
    }

    // Verify goal ownership if goalId is provided
    if (goalId) {
      const { data: goal, error: goalError } = await supabase
        .from('goals')
        .select('id')
        .eq('id', goalId)
        .eq('user_id', userId)
        .single();

      if (goalError || !goal) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
      }
    }

    // Create challenge
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .insert({
        user_id: userId,
        goal_id: goalId,
        title,
        description,
        duration_days: durationDays,
        reward_xp: rewardXp,
        reward_badge: rewardBadge,
        cadence: cadence
      })
      .select()
      .single();

    if (challengeError) {
      console.error('Error creating challenge:', challengeError);
      return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 });
    }

    // Create challenge tasks
    if (tasks.length > 0) {
      const taskInserts = tasks.map(task => ({
        challenge_id: challenge.id,
        habit_id: task.habitId || null,
        task_type: task.type || 'custom',
        title: task.title,
        description: task.description,
        daily_requirement: task.dailyRequirement || null
      }));

      const { error: tasksError } = await supabase
        .from('challenge_tasks')
        .insert(taskInserts);

      if (tasksError) {
        console.error('Error creating challenge tasks:', tasksError);
        // Don't fail the whole request, just log the error
      }
    }

    return NextResponse.json({ data: challenge });

  } catch (error) {
    console.error('Challenge creation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeId, userId, updates } = body;

    if (!challengeId || !userId) {
      return NextResponse.json({ 
        error: 'Challenge ID and user ID are required' 
      }, { status: 400 });
    }

    // Verify ownership
    const { data: existingChallenge, error: fetchError } = await supabase
      .from('challenges')
      .select('id')
      .eq('id', challengeId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingChallenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // Update challenge
    const { data: updatedChallenge, error: updateError } = await supabase
      .from('challenges')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', challengeId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating challenge:', updateError);
      return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedChallenge });

  } catch (error) {
    console.error('Challenge update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
