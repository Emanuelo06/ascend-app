import { supabase } from './supabase';

// Cron job scheduler for background tasks
export class CronScheduler {
  private static instance: CronScheduler;
  private jobs: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  public static getInstance(): CronScheduler {
    if (!CronScheduler.instance) {
      CronScheduler.instance = new CronScheduler();
    }
    return CronScheduler.instance;
  }

  // Schedule daily rollup job
  public scheduleDailyRollup(): void {
    const jobId = 'daily-rollup';
    
    // Clear existing job if any
    if (this.jobs.has(jobId)) {
      clearInterval(this.jobs.get(jobId)!);
    }

    // Calculate time until next midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();

    // Schedule first run at midnight
    setTimeout(() => {
      this.runDailyRollup();
      
      // Then run every 24 hours
      const interval = setInterval(() => {
        this.runDailyRollup();
      }, 24 * 60 * 60 * 1000);
      
      this.jobs.set(jobId, interval);
    }, timeUntilMidnight);

    console.log(`Daily rollup scheduled to run at midnight and every 24 hours`);
  }

  // Run daily rollup for all users
  private async runDailyRollup(): Promise<void> {
    try {
      console.log('Starting daily rollup job...');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/daily-rollup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ADMIN_SECRET}`
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Daily rollup completed:', result);
      } else {
        console.error('Daily rollup failed:', await response.text());
      }
    } catch (error) {
      console.error('Error running daily rollup:', error);
    }
  }

  // Start all scheduled jobs
  public startAllJobs(): void {
    this.scheduleDailyRollup();
    console.log('All cron jobs started');
  }

  // Stop all scheduled jobs
  public stopAllJobs(): void {
    this.jobs.forEach((interval, jobId) => {
      clearInterval(interval);
      console.log(`Stopped job: ${jobId}`);
    });
    this.jobs.clear();
  }
}

// Export singleton instance
export const cronScheduler = CronScheduler.getInstance();