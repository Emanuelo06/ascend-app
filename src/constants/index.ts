// ASCEND Platform Constants

// Navigation Items
export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '🏠',
    current: true,
  },
  {
    name: 'Life Audit',
    href: '/audit',
    icon: '📊',
    current: false,
  },
  {
    name: 'Daily Activities',
    href: '/daily',
    icon: '📅',
    current: false,
  },
  {
    name: 'Analytics & Progress',
    href: '/analytics',
    icon: '📈',
    current: false,
  },
  {
    name: 'Community',
    href: '/community',
    icon: '👥',
    current: false,
  },
  {
    name: 'Partner',
    href: '/partner',
    icon: '🤝',
    current: false,
  },
  {
    name: 'Spiritual Center',
    href: '/spiritual',
    icon: '🙏',
    current: false,
  },
  {
    name: 'Challenges',
    href: '/challenges',
    icon: '🔥',
    current: false,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: '👤',
    current: false,
  },
];

// Life Audit Questions by Category
export const LIFE_AUDIT_QUESTIONS = {
  physical: [
    {
      id: 'physical_1',
      question: 'I wake up feeling energized and ready for the day',
      category: 'physical' as const,
    },
    {
      id: 'physical_2',
      question: 'I engage in regular physical activity that challenges me',
      category: 'physical' as const,
    },
    {
      id: 'physical_3',
      question: 'I eat nutritious foods that fuel my body well',
      category: 'physical' as const,
    },
    {
      id: 'physical_4',
      question: 'I get quality, restorative sleep most nights',
      category: 'physical' as const,
    },
    {
      id: 'physical_5',
      question: 'I feel strong and confident in my physical abilities',
      category: 'physical' as const,
    },
  ],
  mental: [
    {
      id: 'mental_1',
      question: 'I practice mindfulness and mental clarity techniques',
      category: 'mental' as const,
    },
    {
      id: 'mental_2',
      question: 'I continuously learn and develop new skills',
      category: 'mental' as const,
    },
    {
      id: 'mental_3',
      question: 'I manage stress effectively and maintain emotional balance',
      category: 'mental' as const,
    },
    {
      id: 'mental_4',
      question: 'I have clear goals and a sense of direction',
      category: 'mental' as const,
    },
    {
      id: 'mental_5',
      question: 'I practice positive thinking and gratitude',
      category: 'mental' as const,
    },
  ],
  spiritual: [
    {
      id: 'spiritual_1',
      question: 'I spend intentional time in prayer/meditation daily',
      category: 'spiritual' as const,
    },
    {
      id: 'spiritual_2',
      question: 'I regularly read and reflect on Scripture',
      category: 'spiritual' as const,
    },
    {
      id: 'spiritual_3',
      question: 'I feel God\'s presence and guidance in my life',
      category: 'spiritual' as const,
    },
    {
      id: 'spiritual_4',
      question: 'I live according to my spiritual values consistently',
      category: 'spiritual' as const,
    },
    {
      id: 'spiritual_5',
      question: 'I have a strong sense of purpose and calling',
      category: 'spiritual' as const,
    },
  ],
  relational: [
    {
      id: 'relational_1',
      question: 'I have deep, meaningful relationships with family and friends',
      category: 'relational' as const,
    },
    {
      id: 'relational_2',
      question: 'I communicate openly and honestly in my relationships',
      category: 'relational' as const,
    },
    {
      id: 'relational_3',
      question: 'I actively listen and show empathy to others',
      category: 'relational' as const,
    },
    {
      id: 'relational_4',
      question: 'I resolve conflicts constructively and seek reconciliation',
      category: 'relational' as const,
    },
    {
      id: 'relational_5',
      question: 'I contribute positively to my community and workplace',
      category: 'relational' as const,
    },
  ],
  financial: [
    {
      id: 'financial_1',
      question: 'I have a clear budget and track my spending',
      category: 'financial' as const,
    },
    {
      id: 'financial_2',
      question: 'I save and invest for my future goals',
      category: 'financial' as const,
    },
    {
      id: 'financial_3',
      question: 'I avoid unnecessary debt and manage existing debt well',
      category: 'financial' as const,
    },
    {
      id: 'financial_4',
      question: 'I give generously and support causes I believe in',
      category: 'financial' as const,
    },
    {
      id: 'financial_5',
      question: 'I have financial peace and security',
      category: 'financial' as const,
    },
  ],
};

// Daily Ascension Protocol Templates
export const MORNING_ROUTINE_TEMPLATE = [
  {
    id: 'wake_worship_1',
    name: 'Gratitude Declaration',
    duration_minutes: 2,
    category: 'wake_worship' as const,
    completed: false,
    optional: false,
  },
  {
    id: 'wake_worship_2',
    name: 'Scripture Meditation',
    duration_minutes: 3,
    category: 'wake_worship' as const,
    completed: false,
    optional: false,
  },
  {
    id: 'wake_worship_3',
    name: 'Intention Prayer',
    duration_minutes: 2,
    category: 'wake_worship' as const,
    completed: false,
    optional: false,
  },
  {
    id: 'physical_1',
    name: 'Dynamic Warm-up',
    duration_minutes: 3,
    category: 'physical_activation' as const,
    completed: false,
    optional: false,
  },
  {
    id: 'physical_2',
    name: 'Core Strength Circuit',
    duration_minutes: 5,
    category: 'physical_activation' as const,
    completed: false,
    optional: false,
    intensity_options: ['Light', 'Moderate', 'Intense'],
  },
  {
    id: 'physical_3',
    name: 'Energy Visualization',
    duration_minutes: 3,
    category: 'physical_activation' as const,
    completed: false,
    optional: true,
  },
  {
    id: 'mental_1',
    name: 'Learning Module',
    duration_minutes: 5,
    category: 'mental_priming' as const,
    completed: false,
    optional: false,
  },
  {
    id: 'mental_2',
    name: 'Focus Training',
    duration_minutes: 3,
    category: 'mental_priming' as const,
    completed: false,
    optional: false,
  },
  {
    id: 'mental_3',
    name: 'Success Visualization',
    duration_minutes: 2,
    category: 'mental_priming' as const,
    completed: false,
    optional: false,
  },
  {
    id: 'mission_1',
    name: 'Priority Review',
    duration_minutes: 2,
    category: 'mission_alignment' as const,
    completed: false,
    optional: false,
  },
  {
    id: 'mission_2',
    name: 'Purpose Connection',
    duration_minutes: 2,
    category: 'mission_alignment' as const,
    completed: false,
    optional: false,
  },
  {
    id: 'mission_3',
    name: 'Commitment Declaration',
    duration_minutes: 1,
    category: 'mission_alignment' as const,
    completed: false,
    optional: false,
  },
];

export const EVENING_REFLECTION_TEMPLATE = [
  {
    id: 'reflection_1',
    question: 'What am I most grateful for today?',
    completed: false,
  },
  {
    id: 'reflection_2',
    question: 'How did I grow or improve today?',
    completed: false,
  },
  {
    id: 'reflection_3',
    question: 'Where did I fall short of my values?',
    completed: false,
  },
  {
    id: 'reflection_4',
    question: 'What lesson is God teaching me?',
    completed: false,
  },
  {
    id: 'reflection_5',
    question: 'How can I serve others better tomorrow?',
    completed: false,
  },
];

// Challenge Templates
export const CHALLENGE_TEMPLATES = [
  {
    id: 'morning_mastery',
    title: '30-Day Morning Mastery Challenge',
    description: 'Build an unshakeable morning routine that transforms your entire day',
    duration_days: 30,
    challenge_type: 'habits' as const,
    difficulty: 'medium' as const,
    daily_tasks: [
      { day: 1, task: 'Wake up 15 minutes earlier than usual' },
      { day: 2, task: 'Add 5 minutes of gratitude practice' },
      { day: 3, task: 'Include 10 minutes of light stretching' },
      // ... more tasks
    ],
  },
  {
    id: 'spiritual_depth',
    title: '21-Day Spiritual Depth Challenge',
    description: 'Deepen your spiritual connection through daily practices',
    duration_days: 21,
    challenge_type: 'spiritual' as const,
    difficulty: 'easy' as const,
    daily_tasks: [
      { day: 1, task: 'Read one chapter of Scripture' },
      { day: 2, task: 'Spend 10 minutes in prayer' },
      { day: 3, task: 'Write down one thing you\'re thankful for' },
      // ... more tasks
    ],
  },
];

// Community Post Types
export const POST_TYPES = [
  { value: 'encouragement', label: 'Encouragement', icon: '💪' },
  { value: 'milestone', label: 'Milestone', icon: '🎯' },
  { value: 'question', label: 'Question', icon: '❓' },
  { value: 'prayer_request', label: 'Prayer Request', icon: '🙏' },
];

// Notification Types
export const NOTIFICATION_TYPES = {
  reminder: { icon: '⏰', color: 'text-blue-500' },
  achievement: { icon: '🏆', color: 'text-yellow-500' },
  partner_message: { icon: '💬', color: 'text-green-500' },
  challenge_update: { icon: '🔥', color: 'text-orange-500' },
  community_activity: { icon: '👥', color: 'text-purple-500' },
};

// AI-Driven Subscription Tiers - Fully Automated Pricing
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Life Audit Assessment',
      'Basic Progress Tracking',
      'Limited Community Access',
      'Basic Daily Protocol',
      'Community Support',
    ],
    limitations: [
      'No AI Coaching',
      'Limited Accountability Features',
      'Basic Analytics',
      'No Custom Protocols',
    ],
    aiOptimized: false,
  },
  premium: {
    name: 'Premium',
    price: 9.99, // Base price - will be dynamically adjusted by AI
    features: [
      'Everything in Free',
      'Full AI Coaching with Atlas',
      'Unlimited Accountability Partners',
      'Advanced Progress Analytics',
      'Priority Community Access',
      'Custom Daily Protocols',
      'Challenge Participation',
      'AI-Powered Goal Setting',
      'Personalized Growth Path',
    ],
    popular: true,
    aiOptimized: true,
    dynamicPricing: {
      minPrice: 7.99,
      maxPrice: 14.99,
      basePrice: 9.99,
      seasonalAdjustments: true,
      marketResponsive: true,
    },
  },
  premium_plus: {
    name: 'Premium Plus',
    price: 19.99, // Base price - will be dynamically adjusted by AI
    features: [
      'Everything in Premium',
      'Advanced AI Coaching Sessions',
      'Priority AI Support',
      'Advanced Analytics Dashboard',
      'Custom Challenge Creation',
      'AI-Powered Certification Track',
      'Exclusive AI-Generated Content',
      'Predictive Growth Insights',
      'AI-Powered Crisis Support',
      'Advanced Accountability Features',
      'AI-Generated Personalized Workouts',
      'Smart Goal Optimization',
    ],
    aiOptimized: true,
    dynamicPricing: {
      minPrice: 16.99,
      maxPrice: 24.99,
      basePrice: 19.99,
      seasonalAdjustments: true,
      marketResponsive: true,
      surgePricing: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 49.99, // Base price - will be dynamically adjusted by AI
    features: [
      'Everything in Premium Plus',
      'Team Management',
      'Advanced Reporting',
      'Custom Integrations',
      'Dedicated AI Support',
      'White-label Solutions',
      'API Access',
      'Custom AI Training',
      'Advanced Security Features',
    ],
    aiOptimized: true,
    dynamicPricing: {
      minPrice: 39.99,
      maxPrice: 69.99,
      basePrice: 49.99,
      seasonalAdjustments: true,
      marketResponsive: true,
      surgePricing: true,
      volumeDiscounts: true,
    },
  },
};

// AI Pricing Configuration
export const AI_PRICING_CONFIG = {
  optimizationInterval: 24 * 60 * 60 * 1000, // 24 hours
  marketMonitoringInterval: 6 * 60 * 60 * 1000, // 6 hours
  performanceMonitoringInterval: 12 * 60 * 60 * 1000, // 12 hours
  seasonalMonitoringInterval: 24 * 60 * 60 * 1000, // 24 hours
  
  // AI Decision Thresholds
  thresholds: {
    highChurnRate: 15, // Trigger optimization if churn > 15%
    lowConversionRate: 10, // Trigger optimization if conversion < 10%
    highPriceVolatility: 5, // Trigger optimization if volatility > 5
    marketDeclineThreshold: 8, // Trigger optimization if conversion < 8%
  },
  
  // Pricing Adjustment Limits
  adjustmentLimits: {
    maxIncrease: 0.5, // Max 50% increase
    maxDecrease: 0.3, // Max 30% decrease
    maxDiscount: 0.25, // Max 25% discount
    maxSurgePricing: 0.15, // Max 15% surge
  },
  
  // Seasonal Factors
  seasonalFactors: {
    newYear: 1.2, // January boost
    summerDip: 0.9, // Summer months
    backToSchool: 1.1, // September boost
    holidaySeason: 1.2, // December boost
  },
  
  // Personalization Factors
  personalizationFactors: {
    highEngagement: 0.9, // 10% discount for high engagement
    highChurnRisk: 0.85, // 15% discount for high churn risk
    newUser: 0.8, // 20% discount for new users
    loyalUser: 0.95, // 5% discount for loyal users
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  openai: {
    daily_motivation: '/api/openai/daily-motivation',
    habit_suggestions: '/api/openai/habit-suggestions',
    crisis_support: '/api/openai/crisis-support',
    goal_analysis: '/api/openai/goal-analysis',
    spiritual_guidance: '/api/openai/spiritual-guidance',
  },
  audit: '/api/audit',
  daily_checkin: '/api/daily-checkin',
  progress: '/api/progress',
  partners: '/api/partners',
  spiritual: '/api/spiritual',
  stripe: '/api/stripe',
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  PROGRESS_SAVED: 'Progress saved successfully!',
  CHALLENGE_JOINED: 'Challenge joined successfully!',
  PARTNER_MATCHED: 'Partner matched successfully!',
  POST_CREATED: 'Post created successfully!',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'ascend_user_token',
  USER_PROFILE: 'ascend_user_profile',
  THEME: 'ascend_theme',
  ONBOARDING_COMPLETE: 'ascend_onboarding_complete',
  AUDIT_RESULTS: 'ascend_audit_results',
  DAILY_PROGRESS: 'ascend_daily_progress',
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  TINY: 250,
  SMALL: 375,
  MEDIUM: 768,
  LARGE: 1024,
  XLARGE: 1280,
  XXLARGE: 1920,
};

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_TAGS: 5,
  MAX_COMMENT_LENGTH: 500,
  MAX_POST_LENGTH: 2000,
};

// Feature Flags
export const FEATURES = {
  AI_COACHING: true,
  WEATHER_INTEGRATION: true,
  VIDEO_CALLS: false,
  ADVANCED_ANALYTICS: true,
  CUSTOM_CHALLENGES: true,
  EXPORT_DATA: true,
};
