import { NextRequest, NextResponse } from 'next/server';
import { pricingEngine } from '@/lib/pricing-engine';
import { cronScheduler } from '@/lib/cron-scheduler';

// Automated Stripe Webhook Handler - No Human Intervention Required
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    // In production, verify the webhook signature with Stripe
    // For now, we'll process the webhook directly
    
    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      console.error('Failed to parse webhook body:', err);
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // Process different webhook events automatically
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'customer.created':
        await handleCustomerCreated(event.data.object);
        break;
      
      case 'customer.updated':
        await handleCustomerUpdated(event.data.object);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }

    // Trigger AI pricing optimization if needed
    await triggerPricingOptimizationIfNeeded(event);

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: any) {
  console.log(`🤖 Automated webhook: Subscription created for ${subscription.customer}`);
  
  // Update user metrics for AI pricing optimization
  const userMetrics = {
    subscriptionId: subscription.id,
    planType: subscription.items.data[0]?.price.lookup_key || 'premium',
    amount: subscription.items.data[0]?.price.unit_amount / 100,
    status: subscription.status,
    createdAt: new Date(subscription.created * 1000)
  };

  // Log for AI analysis
  console.log('📊 New subscription metrics for AI pricing:', userMetrics);
  
  // In production, this would update the database
  // For now, we'll just log the event
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: any) {
  console.log(`🤖 Automated webhook: Subscription updated for ${subscription.customer}`);
  
  const changes = {
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    priceChange: subscription.items.data[0]?.price.unit_amount / 100
  };

  console.log('📊 Subscription update for AI pricing analysis:', changes);
  
  // Check if this is a price change that requires AI optimization
  if (subscription.status === 'active' && !subscription.cancel_at_period_end) {
    console.log('🔄 Price change detected - triggering AI pricing review');
    // The main optimization will be triggered by triggerPricingOptimizationIfNeeded
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: any) {
  console.log(`🤖 Automated webhook: Subscription deleted for ${subscription.customer}`);
  
  // This could trigger churn analysis and pricing adjustments
  const churnData = {
    customerId: subscription.customer,
    subscriptionId: subscription.id,
    canceledAt: new Date(subscription.canceled_at * 1000),
    reason: subscription.cancellation_reason || 'unknown'
  };

  console.log('📉 Churn detected - may trigger AI pricing optimization:', churnData);
}

// Handle successful payments
async function handlePaymentSucceeded(invoice: any) {
  console.log(`🤖 Automated webhook: Payment succeeded for ${invoice.customer}`);
  
  const paymentData = {
    customerId: invoice.customer,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency,
    status: invoice.status,
    paidAt: new Date(invoice.created * 1000)
  };

  console.log('💰 Payment success - updating AI pricing metrics:', paymentData);
  
  // In production, this would update payment analytics
  // and potentially trigger pricing optimizations for high-value customers
}

// Handle failed payments
async function handlePaymentFailed(invoice: any) {
  console.log(`🤖 Automated webhook: Payment failed for ${invoice.customer}`);
  
  const failureData = {
    customerId: invoice.customer,
    amount: invoice.amount_due / 100,
    currency: invoice.currency,
    failureReason: invoice.last_finalization_error?.message || 'unknown',
    failedAt: new Date(invoice.created * 1000)
  };

  console.log('❌ Payment failure - may trigger retention pricing:', failureData);
  
  // Failed payments could trigger AI pricing adjustments for retention
  if (invoice.attempt_count > 2) {
    console.log('🚨 Multiple payment failures - triggering emergency pricing review');
  }
}

// Handle customer creation
async function handleCustomerCreated(customer: any) {
  console.log(`🤖 Automated webhook: Customer created: ${customer.id}`);
  
  const customerData = {
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
    created: new Date(customer.created * 1000),
    metadata: customer.metadata
  };

  console.log('👤 New customer for AI pricing analysis:', customerData);
}

// Handle customer updates
async function handleCustomerUpdated(customer: any) {
  console.log(`🤖 Automated webhook: Customer updated: ${customer.id}`);
  
  // Check for significant changes that might affect pricing
  if (customer.metadata?.pricing_tier_changed) {
    console.log('🔄 Customer pricing tier changed - triggering AI review');
  }
}

// Trigger AI pricing optimization based on webhook events
async function triggerPricingOptimizationIfNeeded(event: any) {
  try {
    let shouldOptimize = false;
    let reason = '';

    // Check for events that should trigger pricing optimization
    switch (event.type) {
      case 'customer.subscription.deleted':
        shouldOptimize = true;
        reason = 'churn_detected';
        break;
      
      case 'invoice.payment_failed':
        if (event.data.object.attempt_count > 2) {
          shouldOptimize = true;
          reason = 'payment_failure_pattern';
        }
        break;
      
      case 'customer.subscription.updated':
        if (event.data.object.status === 'past_due') {
          shouldOptimize = true;
          reason = 'subscription_past_due';
        }
        break;
    }

    if (shouldOptimize) {
      console.log(`🚀 Webhook-triggered pricing optimization: ${reason}`);
      
      // Use the cron scheduler to trigger optimization
      await cronScheduler.triggerImmediateOptimization(`webhook_${reason}`);
      
      console.log('✅ Webhook-triggered pricing optimization completed');
    }

  } catch (error) {
    console.error('❌ Failed to trigger webhook-based pricing optimization:', error);
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'Automated Stripe webhook handler is running',
    timestamp: new Date().toISOString(),
    automation: {
      webhookProcessing: 'enabled',
      aiPricingOptimization: 'enabled',
      humanIntervention: 'not_required'
    }
  });
}
