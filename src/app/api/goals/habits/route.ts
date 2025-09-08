import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, habitId, weight = 1.0, userId } = body;

    if (!goalId || !habitId || !userId) {
      return NextResponse.json({ 
        error: 'Goal ID, habit ID, and user ID are required' 
      }, { status: 400 });
    }

    // Verify ownership of both goal and habit
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('id')
      .eq('id', habitId)
      .eq('user_id', userId)
      .single();

    if (habitError || !habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Create goal-habit mapping
    const { data: mapping, error: mappingError } = await supabase
      .from('goal_habits')
      .insert({
        goal_id: goalId,
        habit_id: habitId,
        weight: weight
      })
      .select()
      .single();

    if (mappingError) {
      console.error('Error creating goal-habit mapping:', mappingError);
      return NextResponse.json({ error: 'Failed to link habit to goal' }, { status: 500 });
    }

    return NextResponse.json({ data: mapping });

  } catch (error) {
    console.error('Goal-habit mapping API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, habitId, weight, userId } = body;

    if (!goalId || !habitId || !userId) {
      return NextResponse.json({ 
        error: 'Goal ID, habit ID, and user ID are required' 
      }, { status: 400 });
    }

    // Verify ownership
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Update mapping
    const { data: updatedMapping, error: updateError } = await supabase
      .from('goal_habits')
      .update({ weight })
      .eq('goal_id', goalId)
      .eq('habit_id', habitId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating goal-habit mapping:', updateError);
      return NextResponse.json({ error: 'Failed to update habit weight' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedMapping });

  } catch (error) {
    console.error('Goal-habit mapping update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goalId');
    const habitId = searchParams.get('habitId');
    const userId = searchParams.get('userId');

    if (!goalId || !habitId || !userId) {
      return NextResponse.json({ 
        error: 'Goal ID, habit ID, and user ID are required' 
      }, { status: 400 });
    }

    // Verify ownership
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Remove mapping
    const { error: deleteError } = await supabase
      .from('goal_habits')
      .delete()
      .eq('goal_id', goalId)
      .eq('habit_id', habitId);

    if (deleteError) {
      console.error('Error removing goal-habit mapping:', deleteError);
      return NextResponse.json({ error: 'Failed to unlink habit from goal' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Habit unlinked from goal successfully' });

  } catch (error) {
    console.error('Goal-habit mapping deletion API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
