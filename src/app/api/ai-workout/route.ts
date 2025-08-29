import { NextRequest, NextResponse } from 'next/server';
import { aiWorkoutEngine } from '@/lib/ai-workout-engine';

// AI Workout API - Fully Automated Workout Planning Without Human Trainers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planType, duration, profile } = body;

    if (!userId || !planType || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, planType, duration' },
        { status: 400 }
      );
    }

    // Validate plan type
    const validPlanTypes = ['strength', 'cardio', 'flexibility', 'mixed', 'recovery'];
    if (!validPlanTypes.includes(planType)) {
      return NextResponse.json(
        { error: `Invalid plan type. Must be one of: ${validPlanTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate duration (5 minutes to 120 minutes)
    if (duration < 5 || duration > 120) {
      return NextResponse.json(
        { error: 'Duration must be between 5 and 120 minutes' },
        { status: 400 }
      );
    }

    // Generate AI workout plan
    const workoutPlan = await aiWorkoutEngine.generateWorkoutPlan(
      userId,
      planType as any,
      duration,
      profile
    );

    // Log the workout plan generation for transparency
    console.log(`💪 AI Workout Plan Generated for User ${userId}:`, {
      planType,
      duration,
      exerciseCount: workoutPlan.exercises.length,
      targetMuscleGroups: workoutPlan.targetMuscleGroups,
      caloriesBurn: workoutPlan.caloriesBurn,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      workoutPlan,
      metadata: {
        generatedBy: 'AI',
        humanIntervention: false,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('Error in AI workout API:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI workout plan' },
      { status: 500 }
    );
  }
}

// Get workout history for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Get workout history
    const history = aiWorkoutEngine.getWorkoutHistory(userId);
    
    // Get user fitness profile
    const profile = aiWorkoutEngine.getUserFitnessProfile(userId);
    
    // Generate insights
    const insights = aiWorkoutEngine.generateWorkoutInsights(userId);

    return NextResponse.json({
      success: true,
      data: {
        history: history.slice(-20), // Last 20 workouts
        profile,
        insights,
        summary: {
          totalWorkouts: history.length,
          lastWorkout: history[history.length - 1]?.createdAt || null,
          mostCommonType: history.length > 0 ? 
            Object.entries(
              history.reduce((acc, workout) => {
                acc[workout.planType] = (acc[workout.planType] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'none' : 'none',
          totalDuration: history.reduce((sum, workout) => sum + workout.duration, 0),
          averageDuration: history.length > 0 ? 
            Math.round(history.reduce((sum, workout) => sum + workout.duration, 0) / history.length) : 0,
          aiPowered: true,
          humanIntervention: false
        }
      }
    });

  } catch (error) {
    console.error('Error fetching workout data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout data' },
      { status: 500 }
    );
  }
}
