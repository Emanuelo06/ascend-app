import { pricingEngine } from './pricing-engine';

// Automated Cron Scheduler for Pricing Optimization - No Human Intervention Required
export class AutomatedCronScheduler {
  private static instance: AutomatedCronScheduler;
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;

  private constructor() {
    this.initializeScheduler();
  }

  public static getInstance(): AutomatedCronScheduler {
    if (!AutomatedCronScheduler.instance) {
      AutomatedCronScheduler.instance = new AutomatedCronScheduler();
    }
    return AutomatedCronScheduler.instance;
  }

  private initializeScheduler(): void {
    // Start the automated pricing optimization scheduler
    this.startPricingOptimization();
    
    // Start market monitoring
    this.startMarketMonitoring();
    
    // Start performance monitoring
    this.startPerformanceMonitoring();
    
    // Start seasonal adjustment monitoring
    this.startSeasonalMonitoring();
    
    this.isRunning = true;
    
    console.log('🤖 Automated Cron Scheduler initialized successfully');
    console.log('📊 Pricing optimization will run automatically');
    console.log('🔄 Market and performance monitoring active');
  }

  private startPricingOptimization(): void {
    // Run pricing optimization every 24 hours
    const pricingInterval = setInterval(async () => {
      try {
        console.log('🤖 Automated pricing optimization triggered by cron');
        await pricingEngine.optimizePricing();
        
        // Log successful optimization
        const currentPricing = pricingEngine.getCurrentPricing();
        console.log(`✅ Pricing optimization completed: $${currentPricing.currentPrice.toFixed(2)} (${currentPricing.pricingStrategy})`);
        
      } catch (error) {
        console.error('❌ Automated pricing optimization failed:', error);
        
        // Retry after 1 hour if failed
        setTimeout(async () => {
          try {
            await pricingEngine.optimizePricing();
            console.log('✅ Pricing optimization retry successful');
          } catch (retryError) {
            console.error('❌ Pricing optimization retry failed:', retryError);
          }
        }, 60 * 60 * 1000);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    this.intervals.set('pricing_optimization', pricingInterval);
  }

  private startMarketMonitoring(): void {
    // Monitor market conditions every 6 hours
    const marketInterval = setInterval(async () => {
      try {
        const currentPricing = pricingEngine.getCurrentPricing();
        const insights = pricingEngine.getPricingInsights();
        
        // Check if market conditions require immediate optimization
        if (insights && insights.averageChurnRate > 15) {
          console.log('🚨 High churn rate detected - triggering emergency pricing optimization');
          await pricingEngine.optimizePricing();
        }
        
        if (insights && insights.trend === 'decreasing' && insights.averageConversionRate < 8) {
          console.log('📉 Declining market detected - triggering pricing adjustment');
          await pricingEngine.optimizePricing();
        }
        
      } catch (error) {
        console.error('❌ Market monitoring failed:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    this.intervals.set('market_monitoring', marketInterval);
  }

  private startPerformanceMonitoring(): void {
    // Monitor performance metrics every 12 hours
    const performanceInterval = setInterval(async () => {
      try {
        const insights = pricingEngine.getPricingInsights();
        
        if (insights) {
          // Check conversion rate
          if (insights.averageConversionRate < 10) {
            console.log('📊 Low conversion rate detected - triggering conversion optimization');
            await pricingEngine.optimizePricing();
          }
          
          // Check price volatility
          if (insights.priceVolatility > 5) {
            console.log('📈 High price volatility detected - stabilizing pricing');
            await pricingEngine.optimizePricing();
          }
        }
        
      } catch (error) {
        console.error('❌ Performance monitoring failed:', error);
      }
    }, 12 * 60 * 60 * 1000); // 12 hours

    this.intervals.set('performance_monitoring', performanceInterval);
  }

  private startSeasonalMonitoring(): void {
    // Monitor seasonal changes daily
    const seasonalInterval = setInterval(async () => {
      try {
        const currentDate = new Date();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        
        // Check for seasonal events that might affect pricing
        let seasonalEvent = '';
        
        if (month === 0 && day <= 15) {
          seasonalEvent = 'New Year resolutions';
        } else if (month === 5 && day >= 15) {
          seasonalEvent = 'Summer fitness season';
        } else if (month === 8 && day >= 1) {
          seasonalEvent = 'Back to school/work';
        } else if (month === 11 && day >= 15) {
          seasonalEvent = 'Holiday season';
        }
        
        if (seasonalEvent) {
          console.log(`🎯 Seasonal event detected: ${seasonalEvent} - adjusting pricing strategy`);
          await pricingEngine.optimizePricing();
        }
        
      } catch (error) {
        console.error('❌ Seasonal monitoring failed:', error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    this.intervals.set('seasonal_monitoring', seasonalInterval);
  }

  // Manual trigger for immediate optimization (for testing or emergency situations)
  public async triggerImmediateOptimization(reason: string = 'manual'): Promise<void> {
    try {
      console.log(`🚀 Manual pricing optimization triggered: ${reason}`);
      await pricingEngine.optimizePricing();
      console.log('✅ Manual pricing optimization completed');
    } catch (error) {
      console.error('❌ Manual pricing optimization failed:', error);
      throw error;
    }
  }

  // Get scheduler status
  public getStatus(): any {
    return {
      isRunning: this.isRunning,
      activeIntervals: Array.from(this.intervals.keys()),
      nextPricingOptimization: pricingEngine.getCurrentPricing().nextAdjustmentDate,
      totalOptimizations: pricingEngine.getPricingHistory().length,
      lastOptimization: pricingEngine.getPricingHistory().length > 0 
        ? pricingEngine.getPricingHistory()[pricingEngine.getPricingHistory().length - 1].date 
        : null
    };
  }

  // Stop all scheduled tasks
  public stop(): void {
    this.intervals.forEach((interval, name) => {
      clearInterval(interval);
      console.log(`🛑 Stopped interval: ${name}`);
    });
    
    this.intervals.clear();
    this.isRunning = false;
    console.log('🛑 Automated Cron Scheduler stopped');
  }

  // Restart the scheduler
  public restart(): void {
    this.stop();
    setTimeout(() => {
      this.initializeScheduler();
    }, 1000);
  }

  // Emergency pricing adjustment
  public async emergencyPricingAdjustment(adjustment: 'increase' | 'decrease', reason: string): Promise<void> {
    try {
      console.log(`🚨 Emergency pricing adjustment: ${adjustment} - ${reason}`);
      
      // Force immediate optimization with emergency strategy
      await pricingEngine.optimizePricing();
      
      console.log('✅ Emergency pricing adjustment completed');
    } catch (error) {
      console.error('❌ Emergency pricing adjustment failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const cronScheduler = AutomatedCronScheduler.getInstance();

// Auto-start the scheduler when this module is imported
if (typeof window === 'undefined') { // Only run on server side
  // Start the automated scheduler
  cronScheduler;
}
