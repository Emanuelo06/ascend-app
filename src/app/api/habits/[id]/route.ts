import { NextRequest, NextResponse } from 'next/server';
import { HabitDatabaseService } from '@/lib/habit-database-service';

const habitService = HabitDatabaseService.getInstance();

// GET /api/habits/[id] - Get single habit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const habitId = params.id;
    
    if (!habitId) {
      return NextResponse.json(
        { error: 'Habit ID is required' },
        { status: 400 }
      );
    }

    const habit = await habitService.getHabitById(habitId);
    
    if (!habit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: habit
    });

  } catch (error) {
    console.error('Error fetching habit:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch habit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/habits/[id] - Update habit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const habitId = params.id;
    const body = await request.json();
    
    if (!habitId) {
      return NextResponse.json(
        { error: 'Habit ID is required' },
        { status: 400 }
      );
    }

    // Validate update data
    const { 
      habitName, 
      category, 
      frequency, 
      targetCount,
      description,
      reminderTime,
      priority,
      isActive,
      archived
    } = body;

    // Check if habit exists
    const existingHabit = await habitService.getHabitById(habitId);
    if (!existingHabit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      );
    }

    // Validate category if provided
    if (category) {
      const validCategories = ['physical', 'mental', 'spiritual', 'relational', 'financial'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { 
            error: 'Invalid category',
            validCategories 
          },
          { status: 400 }
        );
      }
    }

    // Validate frequency if provided
    if (frequency) {
      const validFrequencies = ['daily', 'weekly', 'monthly'];
      if (!validFrequencies.includes(frequency)) {
        return NextResponse.json(
          { 
            error: 'Invalid frequency',
            validFrequencies 
          },
          { status: 400 }
        );
      }
    }

    const updatedHabit = await habitService.updateHabit(habitId, {
      habitName,
      category,
      frequency,
      targetCount,
      description,
      reminderTime,
      priority,
      isActive,
      archived
    });

    return NextResponse.json({
      success: true,
      data: updatedHabit,
      message: 'Habit updated successfully'
    });

  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update habit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/habits/[id] - Delete habit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const habitId = params.id;
    
    if (!habitId) {
      return NextResponse.json(
        { error: 'Habit ID is required' },
        { status: 400 }
      );
    }

    // Check if habit exists
    const existingHabit = await habitService.getHabitById(habitId);
    if (!existingHabit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      );
    }

    await habitService.deleteHabit(habitId);

    return NextResponse.json({
      success: true,
      message: 'Habit deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete habit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
