import { NextRequest, NextResponse } from 'next/server';
import { HabitDatabaseService } from '@/lib/habit-database-service';
import { AICoachingEngine } from '@/lib/ai-coaching-engine';

const habitService = HabitDatabaseService.getInstance();
const aiEngine = new AICoachingEngine();

// GET /api/ai/recommendations - Get AI recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'general'; // general, weekly, habit-specific

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's habits and recent activity
    const habits = await habitService.getHabitsByUser(userId);
    const activeHabits = habits.filter(habit => !habit.archived && habit.isActive);
    
    // Get recent checkins for context
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const today = new Date().toISOString().split('T')[0];
    const recentCheckins = await habitService.getCheckinsByUserInRange(
      userId, 
      lastWeek.toISOString().split('T')[0], 
      today
    );

    let recommendations;

    switch (type) {
      case 'weekly':
        recommendations = await aiEngine.generateWeeklyInsights(userId, activeHabits, recentCheckins);
        break;
      
      case 'habit-specific':
        const habitId = searchParams.get('habitId');
        if (!habitId) {
          return NextResponse.json(
            { error: 'Habit ID required for habit-specific recommendations' },
            { status: 400 }
          );
        }
        const habit = activeHabits.find(h => h.id === habitId);
        if (!habit) {
          return NextResponse.json(
            { error: 'Habit not found' },
            { status: 404 }
          );
        }
        recommendations = await aiEngine.generateHabitSpecificInsights(userId, habit, recentCheckins);
        break;
      
      case 'general':
      default:
        recommendations = await aiEngine.generateGeneralInsights(userId, activeHabits, recentCheckins);
        break;
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
      type,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate AI recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/ai/recommendations - Generate custom AI recommendation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, prompt, context } = body;

    if (!userId || !prompt) {
      return NextResponse.json(
        { error: 'User ID and prompt are required' },
        { status: 400 }
      );
    }

    // Get user context for personalized response
    const habits = await habitService.getHabitsByUser(userId);
    const activeHabits = habits.filter(habit => !habit.archived && habit.isActive);
    
    const customRecommendation = await aiEngine.generateCustomInsight(
      userId, 
      prompt, 
      activeHabits, 
      context
    );

    return NextResponse.json({
      success: true,
      data: customRecommendation,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating custom AI recommendation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate custom AI recommendation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
