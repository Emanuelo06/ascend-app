import { NextRequest, NextResponse } from 'next/server';
import { pricingEngine } from '@/lib/pricing-engine';

// Automated Stripe Subscription Creation - No Human Intervention Required
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planType, userMetrics } = body;

    if (!userId || !planType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get AI-optimized pricing for this specific user
    const personalizedPrice = pricingEngine.getPersonalizedPricing(userId, userMetrics || {});
    const currentPricing = pricingEngine.getCurrentPricing();

    // Determine the actual price to charge (considering discounts, surge pricing, etc.)
    let finalPrice = personalizedPrice;
    
    if (currentPricing.discountPercentage > 0) {
      finalPrice = personalizedPrice * (1 - currentPricing.discountPercentage / 100);
    }
    
    if (currentPricing.surgePricing > 0) {
      finalPrice += currentPricing.surgePricing;
    }

    // Create subscription data with AI-optimized pricing
    const subscriptionData = {
      userId,
      planType,
      originalPrice: personalizedPrice,
      finalPrice: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
      discountPercentage: currentPricing.discountPercentage,
      surgePricing: currentPricing.surgePricing,
      pricingStrategy: currentPricing.pricingStrategy,
      aiConfidence: currentPricing.confidence,
      nextAdjustmentDate: currentPricing.nextAdjustmentDate,
      createdAt: new Date().toISOString()
    };

    // In production, this would create the actual Stripe subscription
    // For now, we'll simulate the subscription creation
    const mockStripeSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      ...subscriptionData
    };

    // Log the AI pricing decision for transparency
    console.log(`AI Pricing Decision for User ${userId}:`, {
      planType,
      originalPrice: `$${personalizedPrice.toFixed(2)}`,
      finalPrice: `$${subscriptionData.finalPrice.toFixed(2)}`,
      discount: currentPricing.discountPercentage > 0 ? `${currentPricing.discountPercentage}%` : 'None',
      surge: currentPricing.surgePricing > 0 ? `$${currentPricing.surgePricing.toFixed(2)}` : 'None',
      strategy: currentPricing.pricingStrategy,
      confidence: `${(currentPricing.confidence * 100).toFixed(1)}%`
    });

    return NextResponse.json({
      success: true,
      subscription: mockStripeSubscription,
      pricing: {
        originalPrice: personalizedPrice,
        finalPrice: subscriptionData.finalPrice,
        discountPercentage: currentPricing.discountPercentage,
        surgePricing: currentPricing.surgePricing,
        nextAdjustmentDate: currentPricing.nextAdjustmentDate
      }
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
