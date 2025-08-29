import { pricingEngine } from './pricing-engine';

// AI Coaching Engine - Fully Automated Coaching Without Human Intervention
export interface CoachingSession {
  id: string;
  userId: string;
  sessionType: 'daily_motivation' | 'crisis_support' | 'goal_setting' | 'habit_analysis' | 'spiritual_guidance' | 'workout_planning' | 'nutrition_advice';
  userMessage: string;
  aiResponse: string;
  contextData: CoachingContext;
  satisfactionRating?: number;
  followUpActions: string[];
  nextSessionDate: Date;
  createdAt: Date;
}

export interface CoachingContext {
  currentStreak: number;
  recentProgress: any[];
  userGoals: string[];
  currentChallenges: string[];
  moodTrend: 'improving' | 'declining' | 'stable';
  engagementLevel: number; // 0-100
  lastSessionDate?: Date;
}

export interface AICoachingResponse {
  message: string;
  actionItems: string[];
  motivationalQuote: string;
  nextSteps: string[];
  resources: string[];
  followUpDate: Date;
}

export class AICoachingEngine {
  private static instance: AICoachingEngine;
  private coachingHistory: Map<string, CoachingSession[]> = new Map();
  private userProgress: Map<string, any> = new Map();

  private constructor() {
    this.initializeCoaching();
  }

  public static getInstance(): AICoachingEngine {
    if (!AICoachingEngine.instance) {
      AICoachingEngine.instance = new AICoachingEngine();
    }
    return AICoachingEngine.instance;
  }

  private initializeCoaching(): void {
    console.log('🤖 AI Coaching Engine initialized - No human coaches required');
    console.log('📚 AI will provide personalized coaching sessions automatically');
  }

  // Generate AI coaching response based on user input and context
  public async generateCoachingResponse(
    userId: string,
    userMessage: string,
    sessionType: CoachingSession['sessionType'],
    context?: CoachingContext
  ): Promise<AICoachingResponse> {
    try {
      // Get or create user context
      const userContext = context || await this.getUserContext(userId);
      
      // Analyze user message and context
      const analysis = this.analyzeUserInput(userMessage, userContext);
      
      // Generate personalized AI response
      const aiResponse = await this.generatePersonalizedResponse(analysis, sessionType, userContext);
      
      // Create follow-up actions
      const followUpActions = this.generateFollowUpActions(analysis, sessionType);
      
      // Store coaching session
      await this.storeCoachingSession(userId, userMessage, aiResponse.message, sessionType, userContext, followUpActions);
      
      // Update user progress
      this.updateUserProgress(userId, sessionType, analysis);
      
      return aiResponse;
      
    } catch (error) {
      console.error('Error generating AI coaching response:', error);
      return this.getFallbackResponse(sessionType);
    }
  }

  private async getUserContext(userId: string): Promise<CoachingContext> {
    // In production, this would fetch from database
    // For now, return mock context
    return {
      currentStreak: Math.floor(Math.random() * 30) + 1,
      recentProgress: [
        { date: new Date(), activity: 'morning_routine', completed: true },
        { date: new Date(), activity: 'workout', completed: true },
        { date: new Date(), activity: 'meditation', completed: false }
      ],
      userGoals: ['Build morning routine', 'Improve fitness', 'Reduce stress'],
      currentChallenges: ['Time management', 'Consistency'],
      moodTrend: 'improving',
      engagementLevel: Math.floor(Math.random() * 40) + 60
    };
  }

  private analyzeUserInput(userMessage: string, context: CoachingContext): any {
    // AI analysis of user input
    const analysis = {
      sentiment: this.analyzeSentiment(userMessage),
      urgency: this.analyzeUrgency(userMessage),
      topic: this.extractTopic(userMessage),
      needs: this.identifyNeeds(userMessage, context),
      motivation: this.assessMotivation(context)
    };

    return analysis;
  }

  private analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['great', 'good', 'happy', 'excited', 'motivated', 'progress', 'success'];
    const negativeWords = ['bad', 'terrible', 'struggling', 'failing', 'depressed', 'anxious', 'stuck'];
    
    const lowerMessage = message.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private analyzeUrgency(message: string): 'low' | 'medium' | 'high' {
    const urgentWords = ['help', 'urgent', 'emergency', 'crisis', 'now', 'immediately'];
    const lowerMessage = message.toLowerCase();
    
    const urgentCount = urgentWords.filter(word => lowerMessage.includes(word)).length;
    
    if (urgentCount >= 2) return 'high';
    if (urgentCount >= 1) return 'medium';
    return 'low';
  }

  private extractTopic(message: string): string {
    const topics = {
      'workout': ['exercise', 'fitness', 'gym', 'workout', 'training'],
      'nutrition': ['food', 'diet', 'nutrition', 'eating', 'meal'],
      'mental_health': ['stress', 'anxiety', 'depression', 'mental', 'mind'],
      'spiritual': ['prayer', 'meditation', 'spiritual', 'faith', 'god'],
      'habits': ['routine', 'habit', 'consistency', 'discipline'],
      'goals': ['goal', 'target', 'objective', 'plan', 'vision']
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return topic;
      }
    }
    
    return 'general';
  }

  private identifyNeeds(message: string, context: CoachingContext): string[] {
    const needs = [];
    
    if (context.engagementLevel < 70) {
      needs.push('motivation');
    }
    
    if (context.currentStreak < 7) {
      needs.push('consistency');
    }
    
    if (context.moodTrend === 'declining') {
      needs.push('emotional_support');
    }
    
    if (context.currentChallenges.length > 0) {
      needs.push('problem_solving');
    }
    
    return needs;
  }

  private assessMotivation(context: CoachingContext): number {
    let motivation = 50; // Base motivation
    
    // Adjust based on streak
    motivation += Math.min(context.currentStreak * 2, 30);
    
    // Adjust based on engagement
    motivation += (context.engagementLevel - 50) * 0.3;
    
    // Adjust based on mood
    if (context.moodTrend === 'improving') motivation += 10;
    if (context.moodTrend === 'declining') motivation -= 15;
    
    return Math.max(0, Math.min(100, motivation));
  }

  private async generatePersonalizedResponse(
    analysis: any,
    sessionType: CoachingSession['sessionType'],
    context: CoachingContext
  ): Promise<AICoachingResponse> {
    // Generate context-aware AI response
    const response = this.buildResponseTemplate(analysis, sessionType, context);
    
    // Personalize based on user context
    const personalizedResponse = this.personalizeResponse(response, context);
    
    return personalizedResponse;
  }

  private buildResponseTemplate(analysis: any, sessionType: string, context: CoachingContext): AICoachingResponse {
    const templates = {
      daily_motivation: {
        message: `I can see you're making great progress with your ${context.currentStreak}-day streak! ${this.getMotivationalMessage(analysis.sentiment)}`,
        actionItems: ['Complete your morning routine', 'Take one step toward your biggest goal', 'Celebrate your progress'],
        motivationalQuote: this.getMotivationalQuote(analysis.sentiment),
        nextSteps: ['Review your goals for today', 'Plan tomorrow\'s priorities', 'Check in with your accountability partner'],
        resources: ['Daily motivation playlist', 'Progress tracking tools', 'Community support'],
        followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      crisis_support: {
        message: `I understand you're going through a challenging time. ${this.getCrisisSupportMessage(analysis.urgency)}`,
        actionItems: ['Take 3 deep breaths', 'Identify one small step you can take', 'Reach out to your support network'],
        motivationalQuote: this.getCrisisQuote(),
        nextSteps: ['Practice self-compassion', 'Break down challenges into smaller steps', 'Focus on what you can control'],
        resources: ['Crisis support resources', 'Breathing exercises', 'Emergency contacts'],
        followUpDate: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours for crisis
      },
      goal_setting: {
        message: `Let's work on setting clear, achievable goals that align with your vision. ${this.getGoalSettingMessage(context)}`,
        actionItems: ['Write down your top 3 priorities', 'Break down one goal into actionable steps', 'Set a timeline for achievement'],
        motivationalQuote: this.getGoalQuote(),
        nextSteps: ['Review goals weekly', 'Track progress daily', 'Adjust goals as needed'],
        resources: ['Goal setting templates', 'Progress tracking tools', 'SMART goal guide'],
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
      }
    };

    return templates[sessionType as keyof typeof templates] || templates.daily_motivation;
  }

  private getMotivationalMessage(sentiment: string): string {
    const messages = {
      positive: "Your positive energy is contagious! Keep building on this momentum.",
      neutral: "You're showing great consistency. Every day builds your foundation for success.",
      negative: "It's okay to have challenging days. Your resilience is growing stronger with each challenge."
    };
    
    return messages[sentiment] || messages.neutral;
  }

  private getCrisisSupportMessage(urgency: string): string {
    const messages = {
      high: "Let's focus on getting you through this moment safely. You're not alone.",
      medium: "This is a difficult situation, but you have the strength to navigate it.",
      low: "While this feels challenging, you have the tools and support to work through it."
    };
    
    return messages[urgency] || messages.medium;
  }

  private getGoalSettingMessage(context: CoachingContext): string {
    if (context.engagementLevel > 80) {
      return "Your high engagement shows you're ready for more challenging goals.";
    } else if (context.engagementLevel > 60) {
      return "You're building momentum. Let's set goals that stretch you without overwhelming you.";
    } else {
      return "Let's start with smaller, achievable goals to rebuild your confidence and momentum.";
    }
  }

  private getMotivationalQuote(sentiment: string): string {
    const quotes = {
      positive: "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
      neutral: "The only way to do great work is to love what you do. - Steve Jobs",
      negative: "When we are no longer able to change a situation, we are challenged to change ourselves. - Viktor Frankl"
    };
    
    return quotes[sentiment] || quotes.neutral;
  }

  private getCrisisQuote(): string {
    return "The human spirit is stronger than anything that can happen to it. - C.C. Scott";
  }

  private getGoalQuote(): string {
    return "A goal without a plan is just a wish. - Antoine de Saint-Exupéry";
  }

  private personalizeResponse(response: AICoachingResponse, context: CoachingContext): AICoachingResponse {
    // Personalize based on user's current streak and engagement
    if (context.currentStreak > 21) {
      response.message += " You're building an incredible habit foundation!";
    } else if (context.currentStreak > 7) {
      response.message += " You're past the initial challenge phase - keep going!";
    } else {
      response.message += " Every day counts toward building your new habits.";
    }

    // Add personalized action items based on current challenges
    if (context.currentChallenges.includes('Time management')) {
      response.actionItems.push('Block 15 minutes for your most important task');
    }
    
    if (context.currentChallenges.includes('Consistency')) {
      response.actionItems.push('Set a reminder for your daily routine');
    }

    return response;
  }

  private generateFollowUpActions(analysis: any, sessionType: string): string[] {
    const actions = [];
    
    if (analysis.urgency === 'high') {
      actions.push('Schedule immediate follow-up session');
      actions.push('Activate crisis support protocols');
    }
    
    if (analysis.needs.includes('motivation')) {
      actions.push('Send daily motivation messages');
      actions.push('Create personalized motivation playlist');
    }
    
    if (analysis.needs.includes('consistency')) {
      actions.push('Set up habit tracking reminders');
      actions.push('Create accountability check-ins');
    }
    
    return actions;
  }

  private async storeCoachingSession(
    userId: string,
    userMessage: string,
    aiResponse: string,
    sessionType: string,
    context: CoachingContext,
    followUpActions: string[]
  ): Promise<void> {
    const session: CoachingSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionType: sessionType as CoachingSession['sessionType'],
      userMessage,
      aiResponse,
      contextData: context,
      followUpActions,
      nextSessionDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24 hours
      createdAt: new Date()
    };

    // Store in memory (in production, this would go to database)
    if (!this.coachingHistory.has(userId)) {
      this.coachingHistory.set(userId, []);
    }
    this.coachingHistory.get(userId)!.push(session);

    console.log(`🤖 AI Coaching Session stored for user ${userId}: ${sessionType}`);
  }

  private updateUserProgress(userId: string, sessionType: string, analysis: any): void {
    // Update user progress metrics
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, {
        totalSessions: 0,
        sessionTypes: {},
        averageSatisfaction: 0,
        lastSessionDate: null
      });
    }

    const progress = this.userProgress.get(userId)!;
    progress.totalSessions++;
    progress.sessionTypes[sessionType] = (progress.sessionTypes[sessionType] || 0) + 1;
    progress.lastSessionDate = new Date();

    console.log(`📊 User progress updated for ${userId}: ${sessionType} session`);
  }

  private getFallbackResponse(sessionType: string): AICoachingResponse {
    return {
      message: "I'm here to support you on your journey. Let's work together to overcome any challenges you're facing.",
      actionItems: ['Take a moment to breathe', 'Identify one small step forward', 'Remember your progress so far'],
      motivationalQuote: "The journey of a thousand miles begins with one step. - Lao Tzu",
      nextSteps: ['Reflect on your current situation', 'Set one small goal for today', 'Check in again soon'],
      resources: ['Support resources', 'Community forums', 'Progress tracking tools'],
      followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  }

  // Get coaching history for a user
  public getCoachingHistory(userId: string): CoachingSession[] {
    return this.coachingHistory.get(userId) || [];
  }

  // Get user progress summary
  public getUserProgress(userId: string): any {
    return this.userProgress.get(userId) || {
      totalSessions: 0,
      sessionTypes: {},
      averageSatisfaction: 0,
      lastSessionDate: null
    };
  }

  // Schedule next coaching session
  public scheduleNextSession(userId: string, sessionType: string, urgency: string): Date {
    const baseInterval = 24 * 60 * 60 * 1000; // 24 hours
    
    let interval = baseInterval;
    
    if (urgency === 'high') {
      interval = 2 * 60 * 60 * 1000; // 2 hours
    } else if (urgency === 'medium') {
      interval = 12 * 60 * 60 * 1000; // 12 hours
    }
    
    // Adjust based on session type
    if (sessionType === 'crisis_support') {
      interval = Math.min(interval, 4 * 60 * 60 * 1000); // Max 4 hours
    }
    
    return new Date(Date.now() + interval);
  }

  // Generate automated coaching insights
  public generateInsights(userId: string): string[] {
    const history = this.getCoachingHistory(userId);
    const progress = this.getUserProgress(userId);
    
    const insights = [];
    
    if (progress.totalSessions > 10) {
      insights.push('You\'ve completed 10+ coaching sessions - consistency is building!');
    }
    
    if (progress.sessionTypes['crisis_support']) {
      insights.push('You\'ve shown resilience by seeking support during challenging times.');
    }
    
    if (progress.sessionTypes['goal_setting']) {
      insights.push('Your goal-setting sessions show you\'re focused on growth and improvement.');
    }
    
    return insights;
  }
}

// Export singleton instance
export const aiCoachingEngine = AICoachingEngine.getInstance();
