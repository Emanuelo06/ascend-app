import { NextRequest, NextResponse } from 'next/server';
import { aiCoachingEngine } from '@/lib/ai-coaching-engine';

// AI Coaching API - Fully Automated Coaching Without Human Intervention
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, message, sessionType, context } = body;

    if (!userId || !message || !sessionType) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, message, sessionType' },
        { status: 400 }
      );
    }

    // Validate session type
    const validSessionTypes = [
      'daily_motivation',
      'crisis_support', 
      'goal_setting',
      'habit_analysis',
      'spiritual_guidance',
      'workout_planning',
      'nutrition_advice'
    ];

    if (!validSessionTypes.includes(sessionType)) {
      return NextResponse.json(
        { error: `Invalid session type. Must be one of: ${validSessionTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate AI coaching response
    const coachingResponse = await aiCoachingEngine.generateCoachingResponse(
      userId,
      message,
      sessionType as any,
      context
    );

    // Log the coaching session for transparency
    console.log(`🤖 AI Coaching Session for User ${userId}:`, {
      sessionType,
      messageLength: message.length,
      responseLength: coachingResponse.message.length,
      actionItems: coachingResponse.actionItems.length,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      coaching: coachingResponse,
      session: {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        sessionType,
        timestamp: new Date().toISOString(),
        aiPowered: true,
        humanIntervention: false
      }
    });

  } catch (error) {
    console.error('Error in AI coaching API:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI coaching response' },
      { status: 500 }
    );
  }
}

// Get coaching history for a user
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

    // Get coaching history
    const history = aiCoachingEngine.getCoachingHistory(userId);
    
    // Get user progress
    const progress = aiCoachingEngine.getUserProgress(userId);
    
    // Generate insights
    const insights = aiCoachingEngine.generateInsights(userId);

    return NextResponse.json({
      success: true,
      data: {
        history: history.slice(-20), // Last 20 sessions
        progress,
        insights,
        summary: {
          totalSessions: progress.totalSessions,
          lastSession: progress.lastSessionDate,
          mostCommonType: Object.entries(progress.sessionTypes)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none',
          aiPowered: true,
          humanIntervention: false
        }
      }
    });

  } catch (error) {
    console.error('Error fetching coaching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coaching data' },
      { status: 500 }
    );
  }
}
