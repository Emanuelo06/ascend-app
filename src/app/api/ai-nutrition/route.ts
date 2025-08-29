import { NextRequest, NextResponse } from 'next/server';
import { aiNutritionEngine } from '@/lib/ai-nutrition-engine';

// AI Nutrition API - Fully Automated Nutrition Planning Without Human Nutritionists
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planType, profile } = body;

    if (!userId || !planType) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, planType' },
        { status: 400 }
      );
    }

    // Validate plan type
    const validPlanTypes = ['weight_loss', 'muscle_gain', 'maintenance', 'energy_boost', 'recovery'];
    if (!validPlanTypes.includes(planType)) {
      return NextResponse.json(
        { error: `Invalid plan type. Must be one of: ${validPlanTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate AI nutrition plan
    const nutritionPlan = await aiNutritionEngine.generateNutritionPlan(
      userId,
      planType as any,
      profile
    );

    // Log the nutrition plan generation for transparency
    console.log(`🥗 AI Nutrition Plan Generated for User ${userId}:`, {
      planType,
      dailyCalories: nutritionPlan.dailyCalories,
      mealCount: nutritionPlan.meals.length,
      targetMacros: nutritionPlan.macronutrients,
      supplements: nutritionPlan.supplements.length,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      nutritionPlan,
      metadata: {
        generatedBy: 'AI',
        humanIntervention: false,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('Error in AI nutrition API:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI nutrition plan' },
      { status: 500 }
    );
  }
}

// Get nutrition history for a user
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

    // Get nutrition history
    const history = aiNutritionEngine.getNutritionHistory(userId);
    
    // Get user nutrition profile
    const profile = aiNutritionEngine.getUserNutritionProfile(userId);
    
    // Generate insights
    const insights = aiNutritionEngine.generateNutritionInsights(userId);

    return NextResponse.json({
      success: true,
      data: {
        history: history.slice(-10), // Last 10 plans
        profile,
        insights,
        summary: {
          totalPlans: history.length,
          lastPlan: history[history.length - 1]?.createdAt || null,
          mostCommonType: history.length > 0 ? 
            Object.entries(
              history.reduce((acc, plan) => {
                acc[plan.planType] = (acc[plan.planType] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'none' : 'none',
          averageCalories: history.length > 0 ? 
            Math.round(history.reduce((sum, plan) => sum + plan.dailyCalories, 0) / history.length) : 0,
          aiPowered: true,
          humanIntervention: false
        }
      }
    });

  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nutrition data' },
      { status: 500 }
    );
  }
}
