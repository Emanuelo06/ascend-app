import { NextRequest, NextResponse } from 'next/server';
import { aiAssessmentEngine } from '@/lib/ai-assessment-engine';
import { getSupabaseClient } from '@/lib/supabase';
import { AssessmentQuestion } from '@/types/onboarding';

// Lazy load database service to prevent build-time issues
let databaseService: any = null;

async function getDatabaseService() {
  if (!databaseService) {
    const { DatabaseService } = await import('@/lib/supabase');
    databaseService = DatabaseService.getInstance();
  }
  return databaseService;
}

// Onboarding API - Fully Automated Assessment and Plan Creation Without Human Intervention
export async function POST(request: NextRequest) {
  try {
    const { userId, questions } = await request.json();

    if (!userId || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Invalid request data. userId and questions array are required.' },
        { status: 400 }
      );
    }

    // Validate the assessment data
    if (!isValidAssessment(questions)) {
      return NextResponse.json(
        { error: 'Invalid assessment data format.' },
        { status: 400 }
      );
    }

    console.log('🔍 Processing 7 Dimensions Life Audit for user:', userId);
    console.log('📊 Questions received:', questions.length);

    // Use the enhanced AI assessment engine to analyze the 7 dimensions
    const analysis = await aiAssessmentEngine.analyzeAssessment(questions);
    
    // Create a personalized plan based on the analysis
    const plan = await aiAssessmentEngine.createPersonalizedPlan(analysis);

    // Prepare the response
    const result = {
      assessment: {
        userId,
        completedAt: new Date().toISOString(),
        questions,
        totalQuestions: questions.length,
        timeSpent: Math.ceil(questions.length * 0.5), // Estimate 30 seconds per question
        completionRate: 100
      },
      analysis,
      plan
    };

    console.log('✅ 7 Dimensions Life Audit completed successfully');
    console.log('🎯 Ascension Score:', analysis.ascensionScore);
    console.log('💪 Strongest Dimension:', analysis.strongestDimension);
    console.log('🚀 Biggest Opportunity:', analysis.biggestOpportunity);

    // Save to database for persistence
    try {
      const savedAssessment = await getDatabaseService().saveLifeAuditAssessment({
        user_id: userId,
        completed_at: new Date().toISOString(),
        questions,
        analysis,
        plan,
        ascension_score: analysis.ascensionScore,
        strongest_dimension: analysis.strongestDimension,
        biggest_opportunity: analysis.biggestOpportunity
      });

      if (savedAssessment) {
        console.log('💾 Assessment saved to database successfully');
      } else {
        console.log('⚠️ Failed to save assessment to database, but continuing with response');
      }
    } catch (dbError) {
      console.error('❌ Database save error:', dbError);
      // Continue with the response even if database save fails
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error in onboarding API:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process assessment. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Get user's assessment from database
      const assessment = await getDatabaseService().getLifeAuditAssessment(userId);
      
      if (assessment) {
        return NextResponse.json({
          status: 'completed',
          progress: 100,
          assessment,
          steps: [
            'welcome',
            'motivation', 
            'life-audit',
            'results',
            'commitment'
          ]
        });
      }
    }

    // Return default status if no assessment found
    return NextResponse.json({
      status: 'not_started',
      progress: 0,
      steps: [
        'welcome',
        'motivation', 
        'life-audit',
        'results',
        'commitment'
      ]
    });
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch onboarding status' },
      { status: 500 }
    );
  }
}

function isValidAssessment(questions: any[]): questions is AssessmentQuestion[] {
  if (!Array.isArray(questions) || questions.length === 0) {
    return false;
  }

  return questions.every(question => 
    question &&
    typeof question.id === 'string' &&
    typeof question.dimension === 'string' &&
    typeof question.question === 'string' &&
    typeof question.response === 'number' &&
    question.response >= 1 &&
    question.response <= 10 &&
    typeof question.category === 'string' &&
    typeof question.weight === 'number'
  );
}
