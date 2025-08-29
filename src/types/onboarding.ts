// ASCEND - 7 Dimensions Life Audit Types
// Complete Product Specification Implementation

export interface LifeAuditAssessment {
  userId: string;
  completedAt: string;
  
  // 7 Dimensions Assessment Results
  dimensions: {
    physicalVitality: DimensionScore;
    mentalMastery: DimensionScore;
    spiritualConnection: DimensionScore;
    relationalHarmony: DimensionScore;
    financialWisdom: DimensionScore;
    creativeExpression: DimensionScore;
    legacyBuilding: DimensionScore;
  };
  
  // Overall Ascension Score
  ascensionScore: number; // 0-100%
  
  // Assessment metadata
  totalQuestions: number;
  timeSpent: number; // in minutes
  completionRate: number;
}

export interface DimensionScore {
  dimension: DimensionType;
  currentScore: number; // 1-10
  potentialScore: number; // 1-10 based on highest answers
  gap: number; // potential - current
  level: DimensionLevel;
  questions: AssessmentQuestion[];
  insights: string[];
  improvementAreas: string[];
  quickWins: string[];
}

export type DimensionType = 
  | 'physicalVitality'
  | 'mentalMastery' 
  | 'spiritualConnection'
  | 'relationalHarmony'
  | 'financialWisdom'
  | 'creativeExpression'
  | 'legacyBuilding';

export type DimensionLevel = 'novice' | 'developing' | 'advanced' | 'expert' | 'master';

export interface AssessmentQuestion {
  id: string;
  dimension: DimensionType;
  question: string;
  response: number; // 1-10
  explanation?: string;
  category: string;
  weight: number; // importance weight for scoring
}

// The 77 Questions - 11 per dimension
export const LIFE_AUDIT_QUESTIONS: Record<DimensionType, AssessmentQuestion[]> = {
  physicalVitality: [
    {
      id: 'pv_1',
      dimension: 'physicalVitality',
      question: 'How energetic do you feel when you wake up naturally?',
      response: 5,
      category: 'energy',
      weight: 1.2
    },
    {
      id: 'pv_2',
      dimension: 'physicalVitality',
      question: 'How satisfied are you with your current fitness level?',
      response: 5,
      category: 'fitness',
      weight: 1.0
    },
    {
      id: 'pv_3',
      dimension: 'physicalVitality',
      question: 'How well do you nourish your body with quality food?',
      response: 5,
      category: 'nutrition',
      weight: 1.1
    },
    {
      id: 'pv_4',
      dimension: 'physicalVitality',
      question: 'How consistent is your sleep schedule and quality?',
      response: 5,
      category: 'sleep',
      weight: 1.3
    },
    {
      id: 'pv_5',
      dimension: 'physicalVitality',
      question: 'How often do you engage in physical activity that challenges you?',
      response: 5,
      category: 'activity',
      weight: 1.0
    },
    {
      id: 'pv_6',
      dimension: 'physicalVitality',
      question: 'How comfortable are you with your physical appearance?',
      response: 5,
      category: 'body_image',
      weight: 0.8
    },
    {
      id: 'pv_7',
      dimension: 'physicalVitality',
      question: 'How well do you manage stress physically (tension, headaches, etc.)?',
      response: 5,
      category: 'stress_management',
      weight: 1.1
    },
    {
      id: 'pv_8',
      dimension: 'physicalVitality',
      question: 'How would you rate your overall health and vitality?',
      response: 5,
      category: 'overall_health',
      weight: 1.2
    },
    {
      id: 'pv_9',
      dimension: 'physicalVitality',
      question: 'How disciplined are you with harmful substances (alcohol, processed foods, etc.)?',
      response: 5,
      category: 'discipline',
      weight: 1.0
    },
    {
      id: 'pv_10',
      dimension: 'physicalVitality',
      question: 'How connected do you feel to your physical body as God\'s temple?',
      response: 5,
      category: 'spiritual_connection',
      weight: 1.1
    },
    {
      id: 'pv_11',
      dimension: 'physicalVitality',
      question: 'How confident are you in your physical capabilities and strength?',
      response: 5,
      category: 'confidence',
      weight: 0.9
    }
  ],
  
  mentalMastery: [
    {
      id: 'mm_1',
      dimension: 'mentalMastery',
      question: 'How easily can you focus on important tasks for extended periods?',
      response: 5,
      category: 'focus',
      weight: 1.2
    },
    {
      id: 'mm_2',
      dimension: 'mentalMastery',
      question: 'How quickly do you learn new skills or information?',
      response: 5,
      category: 'learning',
      weight: 1.1
    },
    {
      id: 'mm_3',
      dimension: 'mentalMastery',
      question: 'How well do you manage negative thoughts and emotions?',
      response: 5,
      category: 'emotional_management',
      weight: 1.3
    },
    {
      id: 'mm_4',
      dimension: 'mentalMastery',
      question: 'How often do you engage in deep, meaningful learning?',
      response: 5,
      category: 'deep_learning',
      weight: 1.0
    },
    {
      id: 'mm_5',
      dimension: 'mentalMastery',
      question: 'How effectively do you solve complex problems?',
      response: 5,
      category: 'problem_solving',
      weight: 1.1
    },
    {
      id: 'mm_6',
      dimension: 'mentalMastery',
      question: 'How well do you handle stress and pressure situations?',
      response: 5,
      category: 'stress_handling',
      weight: 1.2
    },
    {
      id: 'mm_7',
      dimension: 'mentalMastery',
      question: 'How satisfied are you with your memory and mental sharpness?',
      response: 5,
      category: 'cognitive_function',
      weight: 1.0
    },
    {
      id: 'mm_8',
      dimension: 'mentalMastery',
      question: 'How often do you experience mental clarity and peace?',
      response: 5,
      category: 'mental_clarity',
      weight: 1.1
    },
    {
      id: 'mm_9',
      dimension: 'mentalMastery',
      question: 'How well do you control your emotional reactions?',
      response: 5,
      category: 'emotional_control',
      weight: 1.2
    },
    {
      id: 'mm_10',
      dimension: 'mentalMastery',
      question: 'How confident are you in your decision-making abilities?',
      response: 5,
      category: 'decision_making',
      weight: 1.1
    },
    {
      id: 'mm_11',
      dimension: 'mentalMastery',
      question: 'How aligned are your thoughts with your values and beliefs?',
      response: 5,
      category: 'values_alignment',
      weight: 1.3
    }
  ],
  
  spiritualConnection: [
    {
      id: 'sc_1',
      dimension: 'spiritualConnection',
      question: 'How strong is your daily relationship with God?',
      response: 5,
      category: 'daily_relationship',
      weight: 1.4
    },
    {
      id: 'sc_2',
      dimension: 'spiritualConnection',
      question: 'How consistently do you engage in prayer and meditation?',
      response: 5,
      category: 'prayer_meditation',
      weight: 1.3
    },
    {
      id: 'sc_3',
      dimension: 'spiritualConnection',
      question: 'How well do you understand your life\'s purpose and calling?',
      response: 5,
      category: 'purpose_calling',
      weight: 1.2
    },
    {
      id: 'sc_4',
      dimension: 'spiritualConnection',
      question: 'How actively do you study and apply Biblical principles?',
      response: 5,
      category: 'bible_study',
      weight: 1.1
    },
    {
      id: 'sc_5',
      dimension: 'spiritualConnection',
      question: 'How connected do you feel to your faith community?',
      response: 5,
      category: 'community_connection',
      weight: 1.0
    },
    {
      id: 'sc_6',
      dimension: 'spiritualConnection',
      question: 'How evident are the fruits of the Spirit in your daily life?',
      response: 5,
      category: 'spiritual_fruits',
      weight: 1.3
    },
    {
      id: 'sc_7',
      dimension: 'spiritualConnection',
      question: 'How well do you handle trials with faith and peace?',
      response: 5,
      category: 'trial_handling',
      weight: 1.2
    },
    {
      id: 'sc_8',
      dimension: 'spiritualConnection',
      question: 'How generously do you serve others and your community?',
      response: 5,
      category: 'service_generosity',
      weight: 1.1
    },
    {
      id: 'sc_9',
      dimension: 'spiritualConnection',
      question: 'How aligned are your actions with your spiritual beliefs?',
      response: 5,
      category: 'belief_action_alignment',
      weight: 1.2
    },
    {
      id: 'sc_10',
      dimension: 'spiritualConnection',
      question: 'How deeply do you experience God\'s presence in daily life?',
      response: 5,
      category: 'divine_presence',
      weight: 1.3
    },
    {
      id: 'sc_11',
      dimension: 'spiritualConnection',
      question: 'How confident are you in your eternal relationship with God?',
      response: 5,
      category: 'eternal_confidence',
      weight: 1.1
    }
  ],
  
  relationalHarmony: [
    {
      id: 'rh_1',
      dimension: 'relationalHarmony',
      question: 'How satisfied are you with your closest relationships?',
      response: 5,
      category: 'relationship_satisfaction',
      weight: 1.2
    },
    {
      id: 'rh_2',
      dimension: 'relationalHarmony',
      question: 'How effectively do you communicate in difficult conversations?',
      response: 5,
      category: 'difficult_communication',
      weight: 1.3
    },
    {
      id: 'rh_3',
      dimension: 'relationalHarmony',
      question: 'How well do you resolve conflicts with others?',
      response: 5,
      category: 'conflict_resolution',
      weight: 1.2
    },
    {
      id: 'rh_4',
      dimension: 'relationalHarmony',
      question: 'How supportive and encouraging are you to those around you?',
      response: 5,
      category: 'support_encouragement',
      weight: 1.1
    },
    {
      id: 'rh_5',
      dimension: 'relationalHarmony',
      question: 'How trustworthy and reliable are you in relationships?',
      response: 5,
      category: 'trust_reliability',
      weight: 1.2
    },
    {
      id: 'rh_6',
      dimension: 'relationalHarmony',
      question: 'How well do you set healthy boundaries with others?',
      response: 5,
      category: 'boundary_setting',
      weight: 1.1
    },
    {
      id: 'rh_7',
      dimension: 'relationalHarmony',
      question: 'How actively do you invest time in meaningful relationships?',
      response: 5,
      category: 'time_investment',
      weight: 1.0
    },
    {
      id: 'rh_8',
      dimension: 'relationalHarmony',
      question: 'How well do you forgive others and seek forgiveness?',
      response: 5,
      category: 'forgiveness',
      weight: 1.3
    },
    {
      id: 'rh_9',
      dimension: 'relationalHarmony',
      question: 'How satisfied are you with your family relationships?',
      response: 5,
      category: 'family_relationships',
      weight: 1.2
    },
    {
      id: 'rh_10',
      dimension: 'relationalHarmony',
      question: 'How effectively do you build new, meaningful connections?',
      response: 5,
      category: 'new_connections',
      weight: 1.0
    },
    {
      id: 'rh_11',
      dimension: 'relationalHarmony',
      question: 'How well do you love others as Christ loves you?',
      response: 5,
      category: 'christlike_love',
      weight: 1.4
    }
  ],
  
  financialWisdom: [
    {
      id: 'fw_1',
      dimension: 'financialWisdom',
      question: 'How well do you manage your monthly budget and expenses?',
      response: 5,
      category: 'budget_management',
      weight: 1.2
    },
    {
      id: 'fw_2',
      dimension: 'financialWisdom',
      question: 'How satisfied are you with your current income level?',
      response: 5,
      category: 'income_satisfaction',
      weight: 1.0
    },
    {
      id: 'fw_3',
      dimension: 'financialWisdom',
      question: 'How consistently do you save and invest for the future?',
      response: 5,
      category: 'saving_investing',
      weight: 1.3
    },
    {
      id: 'fw_4',
      dimension: 'financialWisdom',
      question: 'How generous are you with your resources (tithing, giving)?',
      response: 5,
      category: 'generosity',
      weight: 1.1
    },
    {
      id: 'fw_5',
      dimension: 'financialWisdom',
      question: 'How free are you from financial stress and anxiety?',
      response: 5,
      category: 'financial_peace',
      weight: 1.2
    },
    {
      id: 'fw_6',
      dimension: 'financialWisdom',
      question: 'How well do you make wise purchasing decisions?',
      response: 5,
      category: 'purchasing_decisions',
      weight: 1.0
    },
    {
      id: 'fw_7',
      dimension: 'financialWisdom',
      question: 'How clear are you about your financial goals and plans?',
      response: 5,
      category: 'financial_goals',
      weight: 1.1
    },
    {
      id: 'fw_8',
      dimension: 'financialWisdom',
      question: 'How well do you avoid debt and financial obligations?',
      response: 5,
      category: 'debt_avoidance',
      weight: 1.2
    },
    {
      id: 'fw_9',
      dimension: 'financialWisdom',
      question: 'How satisfied are you with your career and earning potential?',
      response: 5,
      category: 'career_satisfaction',
      weight: 1.0
    },
    {
      id: 'fw_10',
      dimension: 'financialWisdom',
      question: 'How well do you view money as a tool for God\'s purposes?',
      response: 5,
      category: 'spiritual_perspective',
      weight: 1.3
    },
    {
      id: 'fw_11',
      dimension: 'financialWisdom',
      question: 'How confident are you about your financial future?',
      response: 5,
      category: 'financial_confidence',
      weight: 1.1
    }
  ],
  
  creativeExpression: [
    {
      id: 'ce_1',
      dimension: 'creativeExpression',
      question: 'How regularly do you engage in creative activities?',
      response: 5,
      category: 'creative_engagement',
      weight: 1.1
    },
    {
      id: 'ce_2',
      dimension: 'creativeExpression',
      question: 'How satisfied are you with your creative output and projects?',
      response: 5,
      category: 'creative_satisfaction',
      weight: 1.0
    },
    {
      id: 'ce_3',
      dimension: 'creativeExpression',
      question: 'How well do you use your unique talents and gifts?',
      response: 5,
      category: 'talent_utilization',
      weight: 1.2
    },
    {
      id: 'ce_4',
      dimension: 'creativeExpression',
      question: 'How often do you try new creative endeavors or hobbies?',
      response: 5,
      category: 'creative_exploration',
      weight: 1.0
    },
    {
      id: 'ce_5',
      dimension: 'creativeExpression',
      question: 'How confident are you in sharing your creative work?',
      response: 5,
      category: 'creative_confidence',
      weight: 1.1
    },
    {
      id: 'ce_6',
      dimension: 'creativeExpression',
      question: 'How well do you see creativity as part of being made in God\'s image?',
      response: 5,
      category: 'spiritual_creativity',
      weight: 1.3
    },
    {
      id: 'ce_7',
      dimension: 'creativeExpression',
      question: 'How satisfied are you with your work\'s creative aspects?',
      response: 5,
      category: 'work_creativity',
      weight: 1.0
    },
    {
      id: 'ce_8',
      dimension: 'creativeExpression',
      question: 'How well do you inspire creativity in others?',
      response: 5,
      category: 'inspiring_others',
      weight: 1.1
    },
    {
      id: 'ce_9',
      dimension: 'creativeExpression',
      question: 'How often do you create something meaningful for others?',
      response: 5,
      category: 'meaningful_creation',
      weight: 1.2
    },
    {
      id: 'ce_10',
      dimension: 'creativeExpression',
      question: 'How well do you balance structure with creative freedom?',
      response: 5,
      category: 'balance',
      weight: 1.0
    },
    {
      id: 'ce_11',
      dimension: 'creativeExpression',
      question: 'How aligned is your creative expression with your values?',
      response: 5,
      category: 'values_alignment',
      weight: 1.1
    }
  ],
  
  legacyBuilding: [
    {
      id: 'lb_1',
      dimension: 'legacyBuilding',
      question: 'How clear are you about the impact you want to make?',
      response: 5,
      category: 'impact_clarity',
      weight: 1.3
    },
    {
      id: 'lb_2',
      dimension: 'legacyBuilding',
      question: 'How actively are you mentoring or developing others?',
      response: 5,
      category: 'mentoring',
      weight: 1.2
    },
    {
      id: 'lb_3',
      dimension: 'legacyBuilding',
      question: 'How well are you preparing the next generation?',
      response: 5,
      category: 'next_generation',
      weight: 1.3
    },
    {
      id: 'lb_4',
      dimension: 'legacyBuilding',
      question: 'How satisfied are you with your contribution to your community?',
      response: 5,
      category: 'community_contribution',
      weight: 1.1
    },
    {
      id: 'lb_5',
      dimension: 'legacyBuilding',
      question: 'How aligned are your daily actions with your long-term legacy?',
      response: 5,
      category: 'daily_alignment',
      weight: 1.2
    },
    {
      id: 'lb_6',
      dimension: 'legacyBuilding',
      question: 'How well are you stewarding your influence and platform?',
      response: 5,
      category: 'influence_stewardship',
      weight: 1.1
    },
    {
      id: 'lb_7',
      dimension: 'legacyBuilding',
      question: 'How actively are you working on something bigger than yourself?',
      response: 5,
      category: 'bigger_purpose',
      weight: 1.3
    },
    {
      id: 'lb_8',
      dimension: 'legacyBuilding',
      question: 'How satisfied are you with the example you\'re setting?',
      response: 5,
      category: 'example_setting',
      weight: 1.2
    },
    {
      id: 'lb_9',
      dimension: 'legacyBuilding',
      question: 'How well do you document and share your wisdom?',
      response: 5,
      category: 'wisdom_sharing',
      weight: 1.1
    },
    {
      id: 'lb_10',
      dimension: 'legacyBuilding',
      question: 'How confident are you that your life matters eternally?',
      response: 5,
      category: 'eternal_significance',
      weight: 1.4
    },
    {
      id: 'lb_11',
      dimension: 'legacyBuilding',
      question: 'How well are you living for future generations, not just yourself?',
      response: 5,
      category: 'future_focus',
      weight: 1.3
    }
  ]
};

// Daily Ascension Protocol
export interface DailyAscensionProtocol {
  userId: string;
  date: string;
  completed: boolean;
  
  morningBlock: MorningBlock;
  middayCheckin: MiddayCheckin;
  eveningBlock: EveningBlock;
  weeklyDeepDive?: WeeklyDeepDive;
}

export interface MorningBlock {
  spiritual: SpiritualActivity;
  physical: PhysicalActivity;
  mental: MentalActivity;
  completed: boolean;
  timeSpent: number; // in minutes
}

export interface SpiritualActivity {
  type: 'prayer' | 'devotion' | 'bible_reading' | 'worship' | 'meditation';
  duration: number; // in minutes
  content: string; // personalized content
  completed: boolean;
}

export interface PhysicalActivity {
  type: 'yoga' | 'stretching' | 'light_exercise' | 'walking' | 'dancing';
  duration: number; // in minutes
  intensity: 'low' | 'moderate' | 'high';
  completed: boolean;
}

export interface MentalActivity {
  type: 'intention_setting' | 'priority_planning' | 'gratitude' | 'visualization';
  duration: number; // in minutes
  content: string;
  completed: boolean;
}

export interface MiddayCheckin {
  completed: boolean;
  progressPulse: number; // 1-10
  quickWins: string[];
  courseCorrections: string[];
  motivationalMessage: string;
}

export interface EveningBlock {
  reflection: ReflectionActivity;
  gratitude: GratitudeActivity;
  growth: GrowthActivity;
  tomorrow: TomorrowPlanning;
  completed: boolean;
  timeSpent: number;
}

export interface ReflectionActivity {
  question: string;
  response: string;
  completed: boolean;
}

export interface GratitudeActivity {
  items: string[];
  completed: boolean;
}

export interface GrowthActivity {
  lesson: string;
  improvement: string;
  completed: boolean;
}

export interface TomorrowPlanning {
  intention: string;
  focusArea: DimensionType;
  completed: boolean;
}

export interface WeeklyDeepDive {
  completed: boolean;
  progressReview: ProgressReview;
  goalAdjustments: GoalAdjustment[];
  weeklyFocus: WeeklyFocus[];
  timeSpent: number;
}

export interface ProgressReview {
  overallProgress: number; // percentage
  dimensionProgress: Record<DimensionType, number>;
  insights: string[];
  challenges: string[];
}

export interface GoalAdjustment {
  dimension: DimensionType;
  currentGoal: string;
  adjustedGoal: string;
  reason: string;
}

export interface WeeklyFocus {
  dimension: DimensionType;
  priority: number; // 1-3
  specificActions: string[];
  successMetrics: string[];
}

// Accountability System
export interface AccountabilityPartner {
  id: string;
  userId: string;
  partnerId: string;
  matchedAt: string;
  status: 'active' | 'inactive' | 'pending';
  
  // Partnership details
  rhythm: AccountabilityRhythm;
  sharedGoals: SharedGoal[];
  checkins: PartnerCheckin[];
}

export interface AccountabilityRhythm {
  dailyMethod: 'text' | 'app_message' | 'call' | 'video_call';
  weeklyConversation: boolean;
  monthlyReview: boolean;
  sharedChallenges: string[];
}

export interface SharedGoal {
  id: string;
  dimension: DimensionType;
  description: string;
  targetDate: string;
  progress: number; // 0-100
  shared: boolean;
}

export interface PartnerCheckin {
  id: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly';
  content: string;
  response?: string;
  completed: boolean;
}

// Streak and Consistency System
export interface ConsistencyTracker {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  streakShields: number; // remaining emergency shields
  
  dimensionStreaks: Record<DimensionType, number>;
  lastActivity: string;
  emergencyMode: boolean;
}

export interface StreakMilestone {
  type: '7_day' | '30_day' | '90_day' | '365_day';
  achieved: boolean;
  achievedAt?: string;
  reward: string;
}

// Community and Challenges
export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  duration: number; // in days
  startDate: string;
  endDate: string;
  participants: number;
  category: DimensionType | 'overall';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rewards: string[];
  leaderboard: ChallengeParticipant[];
}

export interface ChallengeParticipant {
  userId: string;
  username: string;
  progress: number; // 0-100
  rank: number;
  completed: boolean;
}

// Achievement System
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: DimensionType | 'overall' | 'consistency' | 'community';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number; // for progress-based achievements
}

// Content System
export interface SpiritualContent {
  id: string;
  title: string;
  type: 'devotion' | 'bible_plan' | 'prayer_guide' | 'worship' | 'theology';
  content: string;
  scripture?: string;
  author?: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  relatedDimensions: DimensionType[];
}

export interface EducationalContent {
  id: string;
  title: string;
  type: 'micro_learning' | 'expert_interview' | 'masterclass' | 'book_review' | 'skill_building';
  content: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  relatedDimensions: DimensionType[];
}

// User Profile and Preferences
export interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  primaryMotivation: 'spiritual_growth' | 'physical_transformation' | 'mental_clarity' | 'complete_life_change';
  
  // Personal details
  age?: number;
  location?: string;
  timezone: string;
  preferredLanguage: string;
  
  // Spiritual background
  faithBackground: string;
  spiritualMaturity: 'new_believer' | 'growing' | 'mature' | 'leader';
  churchInvolvement: string;
  
  // Preferences
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
  contentPreferences: ContentPreferences;
}

export interface NotificationPreferences {
  dailyProtocol: boolean;
  accountabilityCheckins: boolean;
  communityUpdates: boolean;
  challengeReminders: boolean;
  weeklyInsights: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  progressSharing: boolean;
  communityParticipation: boolean;
  anonymousAnalytics: boolean;
}

export interface ContentPreferences {
  preferredContentTypes: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  contentDuration: 'short' | 'medium' | 'long';
  spiritualFocus: 'high' | 'medium' | 'low';
}

// Analytics and Insights
export interface UserAnalytics {
  userId: string;
  overallProgress: number;
  dimensionProgress: Record<DimensionType, number>;
  consistencyScore: number;
  communityEngagement: number;
  
  // Patterns
  peakPerformanceTimes: string[];
  habitSuccessRates: Record<string, number>;
  correlationInsights: CorrelationInsight[];
  progressTrajectory: ProgressTrajectory;
}

export interface CorrelationInsight {
  dimension1: DimensionType;
  dimension2: DimensionType;
  correlation: number; // -1 to 1
  strength: 'weak' | 'moderate' | 'strong';
  description: string;
}

export interface ProgressTrajectory {
  currentVelocity: number;
  projectedScore: number;
  timeline: string;
  confidence: number; // 0-100
}

// Legacy types for backward compatibility
export interface UserAssessment extends LifeAuditAssessment {}
export interface PersonalizedPlan extends DailyAscensionProtocol {}
