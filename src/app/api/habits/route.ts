import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { HabitDatabaseService } from '@/lib/habit-database-service';

const habitService = HabitDatabaseService.getInstance();

// GET /api/habits - Get user's habits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let habits = await habitService.getHabitsByUser(userId);

    // Apply filters if provided
    if (category) {
      habits = habits.filter(habit => habit.category === category);
    }

    if (status) {
      if (status === 'active') {
        habits = habits.filter(habit => !habit.archived);
      } else if (status === 'archived') {
        habits = habits.filter(habit => habit.archived);
      }
    }

    return NextResponse.json({
      success: true,
      data: habits,
      count: habits.length
    });

  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch habits',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/habits - Create new habit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      habitName, 
      category, 
      frequency, 
      targetCount = 1,
      description,
      reminderTime,
      priority = 'medium'
    } = body;

    // Validate required fields
    if (!userId || !habitName || !category || !frequency) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['userId', 'habitName', 'category', 'frequency']
        },
        { status: 400 }
      );
    }

    // Validate category
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

    // Validate frequency
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

    const newHabit = await habitService.createHabit({
      userId,
      habitName,
      category,
      frequency,
      targetCount,
      description,
      reminderTime,
      priority,
      currentStreak: 0,
      longestStreak: 0,
      isActive: true
    });

    return NextResponse.json({
      success: true,
      data: newHabit,
      message: 'Habit created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create habit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

