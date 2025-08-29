import { NextRequest, NextResponse } from 'next/server';
import { pricingEngine } from '@/lib/pricing-engine';

// Automated Pricing Optimization - No Human Intervention Required
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trigger, forceOptimization } = body;

    // Validate trigger (optional security measure)
    if (trigger && !['scheduled', 'market_change', 'performance_drop', 'manual'].includes(trigger)) {
      return NextResponse.json(
        { error: 'Invalid trigger type' },
        { status: 400 }
      );
    }

    // Get current pricing state
    const currentPricing = pricingEngine.getCurrentPricing();
    const currentInsights = pricingEngine.getPricingInsights();

    // Check if optimization is needed or forced
    const shouldOptimize = forceOptimization || 
      (trigger === 'scheduled' && new Date() >= currentPricing.nextAdjustmentDate) ||
      (trigger === 'performance_drop' && currentInsights?.averageChurnRate > 15) ||
      (trigger === 'market_change' && currentInsights?.trend === 'decreasing');

    if (!shouldOptimize) {
      return NextResponse.json({
        success: true,
        message: 'No optimization needed at this time',
        currentPricing,
        insights: currentInsights,
        nextOptimization: currentPricing.nextAdjustmentDate
      });
    }

    // Run AI pricing optimization
    await pricingEngine.optimizePricing();
    
    // Get updated pricing and insights
    const newPricing = pricingEngine.getCurrentPricing();
    const newInsights = pricingEngine.getPricingInsights();

    // Log the optimization for audit trail
    console.log(`AI Pricing Optimization triggered by: ${trigger || 'automatic'}`, {
      timestamp: new Date().toISOString(),
      previousPrice: currentPricing.currentPrice,
      newPrice: newPricing.currentPrice,
      priceChange: newPricing.currentPrice - currentPricing.currentPrice,
      strategy: newPricing.pricingStrategy,
      confidence: newPricing.confidence,
      nextAdjustment: newPricing.nextAdjustmentDate
    });

    // Return optimization results
    return NextResponse.json({
      success: true,
      message: 'Pricing optimization completed successfully',
      optimization: {
        trigger: trigger || 'automatic',
        timestamp: new Date().toISOString(),
        previousPricing: currentPricing,
        newPricing: newPricing,
        priceChange: newPricing.currentPrice - currentPricing.currentPrice,
        percentageChange: ((newPricing.currentPrice - currentPricing.currentPrice) / currentPricing.currentPrice * 100).toFixed(2) + '%'
      },
      insights: newInsights,
      nextOptimization: newPricing.nextAdjustmentDate
    });

  } catch (error) {
    console.error('Error during pricing optimization:', error);
    return NextResponse.json(
      { error: 'Failed to optimize pricing' },
      { status: 500 }
    );
  }
}

// GET endpoint to view current pricing state and insights
export async function GET() {
  try {
    const currentPricing = pricingEngine.getCurrentPricing();
    const insights = pricingEngine.getPricingInsights();
    const history = pricingEngine.getPricingHistory();

    return NextResponse.json({
      success: true,
      currentPricing,
      insights,
      history: history.slice(-20), // Last 20 pricing changes
      systemStatus: {
        lastOptimization: history.length > 0 ? history[history.length - 1].date : null,
        totalOptimizations: history.length,
        nextScheduledOptimization: currentPricing.nextAdjustmentDate,
        isAutomated: true
      }
    });

  } catch (error) {
    console.error('Error fetching pricing state:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing state' },
      { status: 500 }
    );
  }
}
