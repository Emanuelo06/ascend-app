import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/supabase';

// User Progress API - Complete progress tracking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const progress = await databaseService.getUserProgress(userId, date || undefined);
    return NextResponse.json(progress);

  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, date, activitiesCompleted, moodScore, energyLevel, notes } = await request.json();

    if (!userId || !date || !activitiesCompleted || moodScore === undefined || energyLevel === undefined) {
      return NextResponse.json(
        { error: 'User ID, date, activities, mood score, and energy level are required' },
        { status: 400 }
      );
    }

    const progress = await databaseService.saveUserProgress({
      user_id: userId,
      date,
      activities_completed: activitiesCompleted,
      mood_score: moodScore,
      energy_level: energyLevel,
      notes
    });
    
    if (!progress) {
      return NextResponse.json(
        { error: 'Failed to save user progress' },
        { status: 500 }
      );
    }

    return NextResponse.json(progress);

  } catch (error) {
    console.error('Error saving user progress:', error);
    return NextResponse.json(
      { error: 'Failed to save user progress' },
      { status: 500 }
    );
  }
}
