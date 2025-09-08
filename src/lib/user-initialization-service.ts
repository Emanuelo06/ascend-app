import { databaseService } from './supabase';

export interface UserInitializationData {
  userId: string;
  email: string;
  fullName: string;
  assessmentResults?: {
    totalScore: number;
    physicalScore: number;
    mentalScore: number;
    spiritualScore: number;
    relationalScore: number;
    financialScore: number;
    strongestDimension: string;
    biggestOpportunity: string;
  };
  onboardingData?: {
    selectedGoals: any[];
    preferences: any;
  };
}

export class UserInitializationService {
  private static instance: UserInitializationService;

  private constructor() {
    console.log('🚀 User Initialization Service initialized');
  }

  public static getInstance(): UserInitializationService {
    if (!UserInitializationService.instance) {
      UserInitializationService.instance = new UserInitializationService();
    }
    return UserInitializationService.instance;
  }

  /**
   * Initialize a new user with default data
   */
  async initializeNewUser(userData: UserInitializationData): Promise<boolean> {
    try {
      console.log('🆕 Initializing new user:', userData.email);
      
      // 1. Create user profile in database
      const profile = await databaseService.createUserProfile(
        userData.userId,
        userData.email,
        userData.fullName
      );

      if (!profile) {
        console.error('❌ Failed to create user profile');
        return false;
      }

      console.log('✅ User profile created:', profile);

      // 2. Initialize user with zero data
      await this.initializeUserWithZeroData(userData.userId);

      // 3. If assessment results are provided, create goals and habits
      if (userData.assessmentResults) {
        await this.createGoalsFromAssessment(userData.userId, userData.assessmentResults);
        await this.createHabitsFromAssessment(userData.userId, userData.assessmentResults);
      }

      // 4. If onboarding data is provided, process it
      if (userData.onboardingData) {
        await this.processOnboardingData(userData.userId, userData.onboardingData);
      }

      console.log('✅ User initialization completed successfully');
      return true;

    } catch (error) {
      console.error('❌ Error initializing user:', error);
      return false;
    }
  }

  /**
   * Initialize user with zero data (no streaks, analytics, etc.)
   */
  private async initializeUserWithZeroData(userId: string): Promise<void> {
    try {
      console.log('🔢 Initializing user with zero data for:', userId);

      // Create initial XP record
      await this.createInitialXPRecord(userId);

      // Create initial habit metrics (empty)
      await this.createInitialHabitMetrics(userId);

      // Create initial goal snapshots (empty)
      await this.createInitialGoalSnapshots(userId);

      console.log('✅ Zero data initialization completed');

    } catch (error) {
      console.error('❌ Error initializing zero data:', error);
    }
  }

  /**
   * Create goals based on assessment results
   */
  private async createGoalsFromAssessment(userId: string, assessmentResults: any): Promise<void> {
    try {
      console.log('🎯 Creating goals from assessment for:', userId);

      const goals = this.generateGoalsFromAssessment(assessmentResults);
      
      for (const goal of goals) {
        await this.createGoalInDatabase(userId, goal);
      }

      console.log(`✅ Created ${goals.length} goals from assessment`);

    } catch (error) {
      console.error('❌ Error creating goals from assessment:', error);
    }
  }

  /**
   * Create habits based on assessment results
   */
  private async createHabitsFromAssessment(userId: string, assessmentResults: any): Promise<void> {
    try {
      console.log('🔄 Creating habits from assessment for:', userId);

      const habits = this.generateHabitsFromAssessment(assessmentResults);
      
      for (const habit of habits) {
        await this.createHabitInDatabase(userId, habit);
      }

      console.log(`✅ Created ${habits.length} habits from assessment`);

    } catch (error) {
      console.error('❌ Error creating habits from assessment:', error);
    }
  }

  /**
   * Process onboarding data
   */
  private async processOnboardingData(userId: string, onboardingData: any): Promise<void> {
    try {
      console.log('📋 Processing onboarding data for:', userId);

      // Mark onboarding as completed
      await databaseService.updateUserProfile(userId, {
        onboarding_completed: true
      });

      // Process selected goals
      if (onboardingData.selectedGoals) {
        for (const goal of onboardingData.selectedGoals) {
          await this.createGoalInDatabase(userId, goal);
        }
      }

      console.log('✅ Onboarding data processed');

    } catch (error) {
      console.error('❌ Error processing onboarding data:', error);
    }
  }

  /**
   * Generate goals based on assessment results
   */
  private generateGoalsFromAssessment(assessmentResults: any): any[] {
    const goals = [];
    const { strongestDimension, biggestOpportunity, physicalScore, mentalScore, spiritualScore, relationalScore, financialScore } = assessmentResults;

    // Create goal for strongest dimension (maintain excellence)
    goals.push({
      title: `Maintain Excellence in ${this.capitalizeFirst(strongestDimension)}`,
      purpose: `Continue building on your strength in ${strongestDimension} development`,
      target_type: 'milestone',
      target_value: { type: 'maintenance', value: 1 },
      category: strongestDimension,
      priority: 1,
      state: 'active',
      health: 'green',
      metadata: { source: 'assessment', type: 'strength_maintenance' }
    });

    // Create goal for biggest opportunity (growth area)
    goals.push({
      title: `Develop ${this.capitalizeFirst(biggestOpportunity)} Skills`,
      purpose: `Focus on improving your ${biggestOpportunity} dimension for balanced growth`,
      target_type: 'numeric',
      target_value: { type: 'improvement', value: 30 },
      category: biggestOpportunity,
      priority: 2,
      state: 'active',
      health: 'yellow',
      metadata: { source: 'assessment', type: 'growth_opportunity' }
    });

    // Create goals for other dimensions based on scores
    const dimensions = [
      { name: 'physical', score: physicalScore },
      { name: 'mental', score: mentalScore },
      { name: 'spiritual', score: spiritualScore },
      { name: 'relational', score: relationalScore },
      { name: 'financial', score: financialScore }
    ];

    dimensions.forEach(dim => {
      if (dim.name !== strongestDimension && dim.name !== biggestOpportunity) {
        if (dim.score < 60) {
          goals.push({
            title: `Strengthen ${this.capitalizeFirst(dim.name)} Foundation`,
            purpose: `Build a solid foundation in ${dim.name} development`,
            target_type: 'numeric',
            target_value: { type: 'improvement', value: 20 },
            category: dim.name,
            priority: 3,
            state: 'active',
            health: 'red',
            metadata: { source: 'assessment', type: 'foundation_building' }
          });
        }
      }
    });

    return goals;
  }

  /**
   * Generate habits based on assessment results
   */
  private generateHabitsFromAssessment(assessmentResults: any): any[] {
    const habits = [];
    const { strongestDimension, biggestOpportunity } = assessmentResults;

    // Create habits for strongest dimension
    habits.push({
      title: `Daily ${this.capitalizeFirst(strongestDimension)} Practice`,
      purpose: `Maintain your strength in ${strongestDimension}`,
      moment: 'morning',
      cadence: { type: 'daily' },
      dose: { unit: 'minutes', target: 15 },
      window: { start: '07:00', end: '09:00' },
      difficulty: 2,
      metadata: { source: 'assessment', type: 'strength_maintenance' }
    });

    // Create habits for biggest opportunity
    habits.push({
      title: `${this.capitalizeFirst(biggestOpportunity)} Development`,
      purpose: `Focus on improving your ${biggestOpportunity} skills`,
      moment: 'evening',
      cadence: { type: 'daily' },
      dose: { unit: 'minutes', target: 20 },
      window: { start: '19:00', end: '21:00' },
      difficulty: 3,
      metadata: { source: 'assessment', type: 'growth_opportunity' }
    });

    // Create general wellness habits
    habits.push({
      title: 'Daily Reflection',
      purpose: 'Build self-awareness and track progress',
      moment: 'evening',
      cadence: { type: 'daily' },
      dose: { unit: 'minutes', target: 10 },
      window: { start: '20:00', end: '22:00' },
      difficulty: 1,
      metadata: { source: 'assessment', type: 'general_wellness' }
    });

    return habits;
  }

  /**
   * Create initial XP record
   */
  private async createInitialXPRecord(userId: string): Promise<void> {
    try {
      // This would create an initial XP record in the database
      // For now, we'll just log it
      console.log('💰 Creating initial XP record for:', userId);
    } catch (error) {
      console.error('❌ Error creating XP record:', error);
    }
  }

  /**
   * Create initial habit metrics
   */
  private async createInitialHabitMetrics(userId: string): Promise<void> {
    try {
      // This would create initial habit metrics in the database
      console.log('📊 Creating initial habit metrics for:', userId);
    } catch (error) {
      console.error('❌ Error creating habit metrics:', error);
    }
  }

  /**
   * Create initial goal snapshots
   */
  private async createInitialGoalSnapshots(userId: string): Promise<void> {
    try {
      // This would create initial goal snapshots in the database
      console.log('📈 Creating initial goal snapshots for:', userId);
    } catch (error) {
      console.error('❌ Error creating goal snapshots:', error);
    }
  }

  /**
   * Create goal in database
   */
  private async createGoalInDatabase(userId: string, goalData: any): Promise<void> {
    try {
      // This would create the goal in the database
      console.log('🎯 Creating goal in database:', goalData.title);
    } catch (error) {
      console.error('❌ Error creating goal:', error);
    }
  }

  /**
   * Create habit in database
   */
  private async createHabitInDatabase(userId: string, habitData: any): Promise<void> {
    try {
      // This would create the habit in the database
      console.log('🔄 Creating habit in database:', habitData.title);
    } catch (error) {
      console.error('❌ Error creating habit:', error);
    }
  }

  /**
   * Utility function to capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Check if user has completed onboarding and assessment
   */
  async checkUserCompletionStatus(userId: string): Promise<{
    onboardingCompleted: boolean;
    assessmentCompleted: boolean;
    hasGoals: boolean;
    hasHabits: boolean;
  }> {
    try {
      const profile = await databaseService.getUserProfile(userId);
      
      return {
        onboardingCompleted: profile?.onboarding_completed || false,
        assessmentCompleted: profile?.assessment_completed || false,
        hasGoals: false, // This would check if user has goals
        hasHabits: false  // This would check if user has habits
      };
    } catch (error) {
      console.error('❌ Error checking user completion status:', error);
      return {
        onboardingCompleted: false,
        assessmentCompleted: false,
        hasGoals: false,
        hasHabits: false
      };
    }
  }
}

export const userInitializationService = UserInitializationService.getInstance();
