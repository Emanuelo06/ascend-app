import { 
  LifeAuditAssessment, 
  DimensionScore, 
  DimensionType, 
  AssessmentQuestion, 
  DimensionLevel,
  LIFE_AUDIT_QUESTIONS
} from '@/types/onboarding';

// Enhanced AI Assessment Engine - 7 Dimensions Life Audit
// Fully Automated Personalization Without Human Intervention

export interface AssessmentAnalysis {
  ascensionScore: number;
  dimensionScores: Record<DimensionType, DimensionScore>;
  strongestDimension: DimensionType;
  biggestOpportunity: DimensionType;
  quickWins: DimensionType[];
  longTermFocus: DimensionType[];
  overallInsights: string[];
  personalizedRecommendations: string[];
  transformationPotential: TransformationPotential;
}

export interface TransformationPotential {
  currentState: string;
  potentialState: string;
  timeToTransform: string;
  keyActions: string[];
  expectedOutcomes: string[];
}

export class AIAssessmentEngine {
  private static instance: AIAssessmentEngine;

  private constructor() {
    this.initializeEngine();
  }

  public static getInstance(): AIAssessmentEngine {
    if (!AIAssessmentEngine.instance) {
      AIAssessmentEngine.instance = new AIAssessmentEngine();
    }
    return AIAssessmentEngine.instance;
  }

  private initializeEngine(): void {
    console.log('🧠 Enhanced AI Assessment Engine initialized - 7 Dimensions Life Audit Ready');
  }

  public async analyzeAssessment(questions: AssessmentQuestion[]): Promise<AssessmentAnalysis> {
    try {
      console.log('🔍 Analyzing 7 Dimensions Life Audit...');
      
      // Calculate dimension scores
      const dimensionScores = this.calculateDimensionScores(questions);
      
      // Calculate overall ascension score
      const ascensionScore = this.calculateAscensionScore(dimensionScores);
      
      // Identify key insights
      const strongestDimension = this.identifyStrongestDimension(dimensionScores);
      const biggestOpportunity = this.identifyBiggestOpportunity(dimensionScores);
      const quickWins = this.identifyQuickWins(dimensionScores);
      const longTermFocus = this.identifyLongTermFocus(dimensionScores);
      
      // Generate insights and recommendations
      const overallInsights = this.generateOverallInsights(dimensionScores, ascensionScore);
      const personalizedRecommendations = this.generatePersonalizedRecommendations(
        dimensionScores, 
        strongestDimension, 
        biggestOpportunity
      );
      
      // Calculate transformation potential
      const transformationPotential = this.calculateTransformationPotential(
        dimensionScores, 
        ascensionScore
      );

      const analysis: AssessmentAnalysis = {
        ascensionScore,
        dimensionScores,
        strongestDimension,
        biggestOpportunity,
        quickWins,
        longTermFocus,
        overallInsights,
        personalizedRecommendations,
        transformationPotential
      };

      console.log('✅ 7 Dimensions Analysis Complete - Ascension Score:', ascensionScore);
      return analysis;

    } catch (error) {
      console.error('Error analyzing assessment:', error);
      throw new Error('Failed to analyze 7 Dimensions Life Audit');
    }
  }

  public async createPersonalizedPlan(analysis: AssessmentAnalysis): Promise<any> {
    try {
      console.log('🎯 Creating personalized transformation plan...');
      
      const plan = {
        id: `plan_${Date.now()}`,
        createdAt: new Date().toISOString(),
        ascensionScore: analysis.ascensionScore,
        focusAreas: analysis.longTermFocus,
        quickWins: analysis.quickWins,
        recommendations: analysis.personalizedRecommendations,
        transformationPotential: analysis.transformationPotential,
        dailyProtocol: this.createDailyProtocol(analysis),
        weeklySchedule: this.createWeeklySchedule(analysis),
        monthlyGoals: this.createMonthlyGoals(analysis),
        accountabilityCheckpoints: this.createAccountabilityCheckpoints(analysis)
      };

      console.log('✅ Personalized plan created successfully');
      return plan;

    } catch (error) {
      console.error('Error creating personalized plan:', error);
      throw new Error('Failed to create personalized plan');
    }
  }

  private createDailyProtocol(analysis: AssessmentAnalysis): any {
    return {
      morning: {
        spiritual: '5-10 minutes of prayer and reflection',
        physical: '15-20 minutes of movement or exercise',
        mental: '5 minutes of goal setting and intention'
      },
      midday: {
        checkIn: 'Quick assessment of progress on daily goals',
        adjustment: 'Make necessary adjustments to stay on track'
      },
      evening: {
        reflection: 'Review daily progress and plan tomorrow',
        preparation: 'Prepare for next day\'s activities'
      }
    };
  }

  private createWeeklySchedule(analysis: AssessmentAnalysis): any {
    return {
      monday: { focus: 'Energy and motivation', activity: 'High-intensity activities' },
      tuesday: { focus: 'Learning and growth', activity: 'Study and skill development' },
      wednesday: { focus: 'Relationships', activity: 'Connect with accountability partner' },
      thursday: { focus: 'Physical health', activity: 'Workout and nutrition focus' },
      friday: { focus: 'Creative expression', activity: 'Hobbies and passion projects' },
      saturday: { focus: 'Rest and recovery', activity: 'Light activities and reflection' },
      sunday: { focus: 'Spiritual growth', activity: 'Church, meditation, and planning' }
    };
  }

  private createMonthlyGoals(analysis: AssessmentAnalysis): any {
    return {
      primary: `Improve ${analysis.biggestOpportunity.replace(/([A-Z])/g, ' $1')} by 2-3 points`,
      secondary: `Maintain ${analysis.strongestDimension.replace(/([A-Z])/g, ' $1')} excellence`,
      milestones: [
        'Complete daily protocol for 21 consecutive days',
        'Achieve 3 quick wins in priority dimensions',
        'Connect with accountability partner weekly'
      ]
    };
  }

  private createAccountabilityCheckpoints(analysis: AssessmentAnalysis): any {
    return {
      daily: 'Complete daily protocol checklist',
      weekly: 'Review progress and adjust goals',
      monthly: 'Full assessment and plan revision',
      quarterly: 'Major milestone celebration and planning'
    };
  }

  public async createLifeAuditAssessment(
    userId: string, 
    questions: AssessmentQuestion[]
  ): Promise<LifeAuditAssessment> {
    try {
      const analysis = await this.analyzeAssessment(questions);
      
      const assessment: LifeAuditAssessment = {
        userId,
        completedAt: new Date().toISOString(),
        dimensions: analysis.dimensionScores,
        ascensionScore: analysis.ascensionScore,
        totalQuestions: questions.length,
        timeSpent: this.estimateTimeSpent(questions),
        completionRate: 100 // Assuming all questions are answered
      };

      return assessment;
    } catch (error) {
      console.error('Error creating life audit assessment:', error);
      throw new Error('Failed to create life audit assessment');
    }
  }

  private calculateDimensionScores(questions: AssessmentQuestion[]): Record<DimensionType, DimensionScore> {
    const dimensionScores: Record<DimensionType, DimensionScore> = {} as Record<DimensionType, DimensionScore>;
    
    // Initialize all dimensions
    const dimensionTypes: DimensionType[] = [
      'physicalVitality', 'mentalMastery', 'spiritualConnection', 
      'relationalHarmony', 'financialWisdom', 'creativeExpression', 'legacyBuilding'
    ];

    dimensionTypes.forEach(dimension => {
      const dimensionQuestions = questions.filter(q => q.dimension === dimension);
      const currentScore = this.calculateWeightedScore(dimensionQuestions);
      const potentialScore = this.calculatePotentialScore(dimensionQuestions);
      const gap = potentialScore - currentScore;
      const level = this.determineDimensionLevel(currentScore);
      
      dimensionScores[dimension] = {
        dimension,
        currentScore,
        potentialScore,
        gap,
        level,
        questions: dimensionQuestions,
        insights: this.generateDimensionInsights(dimension, currentScore, gap),
        improvementAreas: this.identifyImprovementAreas(dimension, currentScore, gap),
        quickWins: this.identifyQuickWinsForDimension(dimension, currentScore, gap)
      };
    });

    return dimensionScores;
  }

  private calculateWeightedScore(questions: AssessmentQuestion[]): number {
    if (questions.length === 0) return 5;
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    questions.forEach(question => {
      totalWeightedScore += question.response * question.weight;
      totalWeight += question.weight;
    });
    
    return Math.round((totalWeightedScore / totalWeight) * 10) / 10;
  }

  private calculatePotentialScore(questions: AssessmentQuestion[]): number {
    if (questions.length === 0) return 10;
    
    // Calculate potential based on highest responses and weights
    let totalWeightedPotential = 0;
    let totalWeight = 0;
    
    questions.forEach(question => {
      // Assume potential is 2-3 points higher than current response
      const potential = Math.min(10, question.response + 2.5);
      totalWeightedPotential += potential * question.weight;
      totalWeight += question.weight;
    });
    
    return Math.round((totalWeightedPotential / totalWeight) * 10) / 10;
  }

  private determineDimensionLevel(score: number): DimensionLevel {
    if (score >= 9) return 'master';
    if (score >= 7) return 'expert';
    if (score >= 5) return 'advanced';
    if (score >= 3) return 'developing';
    return 'novice';
  }

  private calculateAscensionScore(dimensionScores: Record<DimensionType, DimensionScore>): number {
    const scores = Object.values(dimensionScores).map(d => d.currentScore);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // Ensure the score is between 0 and 100
    const ascensionScore = Math.round(averageScore * 10);
    console.log('📊 Ascension Score Calculation:', {
      scores,
      averageScore,
      ascensionScore
    });
    
    return Math.max(0, Math.min(100, ascensionScore));
  }

  private identifyStrongestDimension(dimensionScores: Record<DimensionType, DimensionScore>): DimensionType {
    const strongest = Object.entries(dimensionScores).reduce((strongest, [dimension, score]) => {
      return score.currentScore > dimensionScores[strongest as DimensionType].currentScore 
        ? dimension as DimensionType 
        : strongest as DimensionType;
    }, 'physicalVitality' as DimensionType);
    
    console.log('💪 Strongest Dimension:', strongest, 'Score:', dimensionScores[strongest].currentScore);
    return strongest;
  }

  private identifyBiggestOpportunity(dimensionScores: Record<DimensionType, DimensionScore>): DimensionType {
    const biggest = Object.entries(dimensionScores).reduce((biggest, [dimension, score]) => {
      return score.gap > dimensionScores[biggest as DimensionType].gap 
        ? dimension as DimensionType 
        : biggest as DimensionType;
    }, 'physicalVitality' as DimensionType);
    
    console.log('🚀 Biggest Opportunity:', biggest, 'Gap:', dimensionScores[biggest].gap);
    return biggest;
  }

  private identifyQuickWins(dimensionScores: Record<DimensionType, DimensionScore>): DimensionType[] {
    // Find dimensions that are close to the next level (within 1 point)
    const quickWins: DimensionType[] = [];
    
    Object.entries(dimensionScores).forEach(([dimension, score]) => {
      const nextLevelThreshold = this.getNextLevelThreshold(score.currentScore);
      if (nextLevelThreshold - score.currentScore <= 1) {
        quickWins.push(dimension as DimensionType);
      }
    });
    
    return quickWins.slice(0, 3); // Return top 3 quick wins
  }

  private identifyLongTermFocus(dimensionScores: Record<DimensionType, DimensionScore>): DimensionType[] {
    // Find dimensions with the biggest gaps (longest journey to improvement)
    return Object.entries(dimensionScores)
      .sort(([, a], [, b]) => b.gap - a.gap)
      .slice(0, 3)
      .map(([dimension]) => dimension as DimensionType);
  }

  private getNextLevelThreshold(currentScore: number): number {
    if (currentScore < 3) return 3;
    if (currentScore < 5) return 5;
    if (currentScore < 7) return 7;
    if (currentScore < 9) return 9;
    return 10;
  }

  private generateDimensionInsights(dimension: DimensionType, score: number, gap: number): string[] {
    const insights: string[] = [];
    
    // Score-based insights
    if (score >= 8) {
      insights.push(`Your ${this.formatDimensionName(dimension)} is exceptional - you're setting an example for others.`);
    } else if (score >= 6) {
      insights.push(`Your ${this.formatDimensionName(dimension)} shows solid foundation with room for growth.`);
    } else if (score >= 4) {
      insights.push(`Your ${this.formatDimensionName(dimension)} has potential but needs focused attention.`);
    } else {
      insights.push(`Your ${this.formatDimensionName(dimension)} represents a significant growth opportunity.`);
    }
    
    // Gap-based insights
    if (gap >= 3) {
      insights.push(`There's substantial untapped potential in ${this.formatDimensionName(dimension)}.`);
    } else if (gap >= 2) {
      insights.push(`Moderate improvements could significantly enhance your ${this.formatDimensionName(dimension)}.`);
    } else {
      insights.push(`Your ${this.formatDimensionName(dimension)} is well-aligned with your potential.`);
    }
    
    // Dimension-specific insights
    const specificInsights = this.getDimensionSpecificInsights(dimension, score);
    insights.push(...specificInsights);
    
    return insights;
  }

  private getDimensionSpecificInsights(dimension: DimensionType, score: number): string[] {
    const insights: string[] = [];
    
    switch (dimension) {
      case 'spiritualConnection':
        if (score < 6) {
          insights.push('Strengthening your spiritual foundation can provide stability for growth in other areas.');
        }
        break;
      case 'physicalVitality':
        if (score < 6) {
          insights.push('Physical energy often limits effectiveness in other dimensions - this could be your foundation builder.');
        }
        break;
      case 'mentalMastery':
        if (score < 6) {
          insights.push('Mental clarity and focus are multipliers for all other areas of life.');
        }
        break;
      case 'relationalHarmony':
        if (score < 6) {
          insights.push('Strong relationships provide support and accountability for personal growth.');
        }
        break;
      case 'financialWisdom':
        if (score < 6) {
          insights.push('Financial peace removes stress and creates space for growth in other areas.');
        }
        break;
      case 'creativeExpression':
        if (score < 6) {
          insights.push('Creative expression can unlock new ways to serve God and others.');
        }
        break;
      case 'legacyBuilding':
        if (score < 6) {
          insights.push('Focusing on legacy can provide deeper motivation for daily growth.');
        }
        break;
    }
    
    return insights;
  }

  private identifyImprovementAreas(dimension: DimensionType, score: number, gap: number): string[] {
    const areas: string[] = [];
    
    // Get questions for this dimension to identify specific areas
    const questions = LIFE_AUDIT_QUESTIONS[dimension];
    const lowScoringQuestions = questions.filter(q => q.response <= 5);
    
    lowScoringQuestions.forEach(question => {
      areas.push(this.formatImprovementArea(question.category, question.question));
    });
    
    // Add general improvement areas based on score
    if (score < 6) {
      areas.push(`Build consistent daily habits in ${this.formatDimensionName(dimension)}`);
      areas.push(`Seek guidance and resources for ${this.formatDimensionName(dimension)}`);
    }
    
    return areas.slice(0, 5); // Limit to top 5 areas
  }

  private identifyQuickWinsForDimension(dimension: DimensionType, score: number, gap: number): string[] {
    const quickWins: string[] = [];
    
    // Identify questions that are close to improvement
    const questions = LIFE_AUDIT_QUESTIONS[dimension];
    const nearImprovement = questions.filter(q => q.response >= 6 && q.response < 8);
    
    nearImprovement.forEach(question => {
      quickWins.push(`Improve ${question.category} by focusing on ${question.question.toLowerCase()}`);
    });
    
    // Add general quick wins
    if (score < 7) {
      quickWins.push(`Set specific, measurable goals for ${this.formatDimensionName(dimension)}`);
      quickWins.push(`Find an accountability partner for ${this.formatDimensionName(dimension)}`);
    }
    
    return quickWins.slice(0, 3); // Limit to top 3 quick wins
  }

  private generateOverallInsights(
    dimensionScores: Record<DimensionType, DimensionScore>, 
    ascensionScore: number
  ): string[] {
    const insights: string[] = [];
    
    // Overall score insights
    if (ascensionScore >= 80) {
      insights.push('You\'re operating at an exceptional level across all dimensions of life.');
      insights.push('Focus on mentoring others and building legacy - you have much to give.');
    } else if (ascensionScore >= 60) {
      insights.push('You have a solid foundation with clear opportunities for breakthrough growth.');
      insights.push('Targeted improvements in 2-3 dimensions could create exponential results.');
    } else if (ascensionScore >= 40) {
      insights.push('You\'re in the growth zone - this is where transformation happens.');
      insights.push('Focus on building consistency in your strongest areas first.');
    } else {
      insights.push('You\'re at the beginning of an incredible transformation journey.');
      insights.push('Small, consistent improvements will create massive change over time.');
    }
    
    // Dimension balance insights
    const scores = Object.values(dimensionScores).map(d => d.currentScore);
    const scoreRange = Math.max(...scores) - Math.min(...scores);
    
    if (scoreRange > 4) {
      insights.push('Your dimensions are imbalanced - focus on your weakest areas to create stability.');
    } else if (scoreRange > 2) {
      insights.push('Your dimensions show moderate balance - targeted improvements can create harmony.');
    } else {
      insights.push('Your dimensions are well-balanced - focus on elevating everything together.');
    }
    
    return insights;
  }

  private generatePersonalizedRecommendations(
    dimensionScores: Record<DimensionType, DimensionScore>,
    strongestDimension: DimensionType,
    biggestOpportunity: DimensionType
  ): string[] {
    const recommendations: string[] = [];
    
    // Build on strengths
    recommendations.push(`Leverage your strength in ${this.formatDimensionName(strongestDimension)} to support growth in other areas.`);
    
    // Address biggest opportunity
    recommendations.push(`Focus your primary energy on ${this.formatDimensionName(biggestOpportunity)} - this represents your highest growth potential.`);
    
    // General recommendations
    recommendations.push('Start with 2-3 dimensions to avoid overwhelm and build momentum.');
    recommendations.push('Create daily rituals that touch multiple dimensions simultaneously.');
    recommendations.push('Find an accountability partner who complements your strengths and weaknesses.');
    
    // Spiritual foundation recommendation
    if (dimensionScores.spiritualConnection.currentScore < 7) {
      recommendations.push('Strengthen your spiritual foundation first - this provides purpose and motivation for all other growth.');
    }
    
    return recommendations;
  }

  private calculateTransformationPotential(
    dimensionScores: Record<DimensionType, DimensionScore>,
    ascensionScore: number
  ): TransformationPotential {
    const currentState = this.describeCurrentState(ascensionScore);
    const potentialState = this.describePotentialState(ascensionScore);
    const timeToTransform = this.estimateTransformationTime(ascensionScore);
    const keyActions = this.identifyKeyActions(dimensionScores);
    const expectedOutcomes = this.predictExpectedOutcomes(ascensionScore);
    
    return {
      currentState,
      potentialState,
      timeToTransform,
      keyActions,
      expectedOutcomes
    };
  }

  private describeCurrentState(ascensionScore: number): string {
    if (ascensionScore >= 80) return 'Operating at exceptional levels with mastery in multiple dimensions';
    if (ascensionScore >= 60) return 'Solid foundation with clear opportunities for breakthrough growth';
    if (ascensionScore >= 40) return 'Growth zone with potential for significant transformation';
    return 'Beginning of transformation journey with massive growth potential';
  }

  private describePotentialState(ascensionScore: number): string {
    if (ascensionScore >= 80) return 'Master level across all dimensions, mentoring and leading others';
    if (ascensionScore >= 60) return 'Expert level in most dimensions with advanced capabilities';
    if (ascensionScore >= 40) return 'Advanced level with strong foundation in all areas';
    return 'Developing level with consistent growth and improvement';
  }

  private estimateTransformationTime(ascensionScore: number): string {
    if (ascensionScore >= 80) return '6-12 months to reach master level';
    if (ascensionScore >= 60) return '3-6 months to reach expert level';
    if (ascensionScore >= 40) return '6-12 months to reach advanced level';
    return '12-18 months to reach developing level';
  }

  private identifyKeyActions(dimensionScores: Record<DimensionType, DimensionScore>): string[] {
    const actions: string[] = [];
    
    // Identify top 3 priority actions
    const sortedDimensions = Object.entries(dimensionScores)
      .sort(([, a], [, b]) => b.gap - a.gap)
      .slice(0, 3);
    
    sortedDimensions.forEach(([dimension, score]) => {
      actions.push(`Focus on ${this.formatDimensionName(dimension)}: ${this.getSpecificAction(dimension, score.currentScore)}`);
    });
    
    return actions;
  }

  private getSpecificAction(dimension: DimensionType, score: number): string {
    if (score < 4) return 'Build foundational habits and consistency';
    if (score < 6) return 'Develop intermediate skills and knowledge';
    if (score < 8) return 'Master advanced techniques and principles';
    return 'Refine and optimize existing capabilities';
  }

  private predictExpectedOutcomes(ascensionScore: number): string[] {
    const outcomes: string[] = [];
    
    if (ascensionScore < 60) {
      outcomes.push('Increased energy and motivation for daily activities');
      outcomes.push('Better decision-making and problem-solving abilities');
      outcomes.push('Improved relationships and communication skills');
      outcomes.push('Greater sense of purpose and direction');
    } else if (ascensionScore < 80) {
      outcomes.push('Mastery in key areas of life');
      outcomes.push('Enhanced leadership and influence capabilities');
      outcomes.push('Greater impact on others and community');
      outcomes.push('Deeper spiritual connection and understanding');
    } else {
      outcomes.push('Legendary status in multiple dimensions');
      outcomes.push('Ability to mentor and transform others');
      outcomes.push('Creation of lasting legacy and impact');
      outcomes.push('Complete alignment with God\'s purpose');
    }
    
    return outcomes;
  }

  private formatDimensionName(dimension: DimensionType): string {
    return dimension
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  private formatImprovementArea(category: string, question: string): string {
    return `${category.charAt(0).toUpperCase() + category.slice(1)}: ${question.toLowerCase()}`;
  }

  private estimateTimeSpent(questions: AssessmentQuestion[]): number {
    // Estimate 1-2 minutes per question including thinking time
    return Math.round(questions.length * 1.5);
  }
}

export const aiAssessmentEngine = AIAssessmentEngine.getInstance();
