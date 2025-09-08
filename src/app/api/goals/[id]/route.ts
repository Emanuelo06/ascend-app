import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const goalId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const includeProgress = searchParams.get('includeProgress') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch goal with all related data
    const { data: goal, error } = await supabase
      .from('goals')
      .select(`
        *,
        goal_milestones(*),
        goal_habits(
          weight,
          habits(*)
        ),
        challenges(*),
        goal_ai_suggestions(*),
        goal_accountability(*)
      `)
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching goal:', error);
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Calculate progress if requested
    if (includeProgress) {
      try {
        const { data: progressData } = await supabase
          .rpc('calculate_goal_progress', {
            p_goal_id: goalId
          });
        
        goal.progress_pct = progressData || 0;
        
        // Calculate health
        const { data: healthData } = await supabase
          .rpc('calculate_goal_health', {
            p_goal_id: goalId
          });
        
        goal.health = healthData || 'green';
      } catch (progressError) {
        console.error('Error calculating progress:', progressError);
      }
    }

    return NextResponse.json({ data: goal });

  } catch (error) {
    console.error('Goal detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const goalId = params.id;
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const goalId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
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
