import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const state = searchParams.get('state') || 'active';
    const includeProgress = searchParams.get('includeProgress') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Build query
    let query = supabase
      .from('goals')
      .select(`
        *,
        goal_milestones(*),
        goal_habits(
          weight,
          habits(*)
        )
      `)
      .eq('user_id', userId)
      .order('priority', { ascending: true });

    if (state !== 'all') {
      query = query.eq('state', state);
    }

    const { data: goals, error } = await query;

    if (error) {
      console.error('Error fetching goals:', error);
      return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
    }

    // Calculate progress for each goal if requested
    if (includeProgress && goals) {
      for (const goal of goals) {
        try {
          const { data: progressData } = await supabase
            .rpc('calculate_goal_progress', {
              p_goal_id: goal.id
            });
          
          goal.progress_pct = progressData || 0;
          
          // Calculate health
          const { data: healthData } = await supabase
            .rpc('calculate_goal_health', {
              p_goal_id: goal.id
            });
          
          goal.health = healthData || 'green';
        } catch (progressError) {
          console.error('Error calculating progress for goal:', goal.id, progressError);
        }
      }
    }

    return NextResponse.json({ data: goals });

  } catch (error) {
    console.error('Goals API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      title,
      purpose,
      targetType,
      targetValue,
      targetDate,
      priority,
      category,
      metadata = {}
    } = body;

    if (!userId || !title || !targetType || !targetValue) {
      return NextResponse.json({ 
        error: 'User ID, title, target type, and target value are required' 
      }, { status: 400 });
    }

    // Create goal
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        title,
        purpose,
        target_type: targetType,
        target_value: targetValue,
        target_date: targetDate,
        priority: priority || 0,
        metadata: {
          ...metadata,
          source: metadata.source || 'manual'
        }
      })
      .select()
      .single();

    if (goalError) {
      console.error('Error creating goal:', goalError);
      return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
    }

    // Create initial milestone if target date is provided
    if (targetDate) {
      const { error: milestoneError } = await supabase
        .from('goal_milestones')
        .insert({
          goal_id: goal.id,
          title: 'Target Completion',
          description: `Complete ${title} by target date`,
          due_date: targetDate
        });

      if (milestoneError) {
        console.error('Error creating initial milestone:', milestoneError);
      }
    }

    return NextResponse.json({ data: goal });

  } catch (error) {
    console.error('Goal creation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, userId, updates } = body;

    if (!goalId || !userId) {
      return NextResponse.json({ 
        error: 'Goal ID and user ID are required' 
      }, { status: 400 });
    }

    // Verify ownership
    const { data: existingGoal, error: fetchError } = await supabase
      .from('goals')
      .select('id')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Update goal
    const { data: updatedGoal, error: updateError } = await supabase
      .from('goals')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating goal:', updateError);
      return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedGoal });

  } catch (error) {
    console.error('Goal update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goalId');
    const userId = searchParams.get('userId');

    if (!goalId || !userId) {
      return NextResponse.json({ 
        error: 'Goal ID and user ID are required' 
      }, { status: 400 });
    }

    // Verify ownership
    const { data: existingGoal, error: fetchError } = await supabase
      .from('goals')
      .select('id')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Delete goal (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting goal:', deleteError);
      return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Goal deleted successfully' });

  } catch (error) {
    console.error('Goal deletion API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
