export interface BibleVerse {
  id: string;
  verseText: string;
  reference: string;
  category: 'motivation' | 'consistency' | 'faith' | 'perseverance' | 'growth' | 'comfort' | 'guidance';
  context: string;
  applicableSituations: string[];
}

export const bibleVerses: BibleVerse[] = [
  // MOTIVATION - For users who need encouragement to start or continue
  {
    id: 'mv1',
    verseText: 'I can do all things through Christ who strengthens me.',
    reference: 'Philippians 4:13',
    category: 'motivation',
    context: 'Perfect for users who feel overwhelmed or need confidence to pursue their goals.',
    applicableSituations: ['low_energy', 'self_doubt', 'goal_setting', 'new_beginning']
  },
  {
    id: 'mv2',
    verseText: 'For God gave us a spirit not of fear but of power and love and self-control.',
    reference: '2 Timothy 1:7',
    category: 'motivation',
    context: 'Helps users overcome fear and anxiety to take action.',
    applicableSituations: ['anxiety', 'fear', 'procrastination', 'stress']
  },
  {
    id: 'mv3',
    verseText: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    reference: 'Joshua 1:9',
    category: 'motivation',
    context: 'Encourages users to face challenges with courage and faith.',
    applicableSituations: ['challenge', 'uncertainty', 'change', 'adversity']
  },

  // CONSISTENCY - For users struggling with maintaining habits
  {
    id: 'cs1',
    verseText: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.',
    reference: 'Galatians 6:9',
    category: 'consistency',
    context: 'Reminds users that consistent effort leads to results.',
    applicableSituations: ['habit_breaking', 'low_streak', 'discouragement', 'plateau']
  },
  {
    id: 'cs2',
    verseText: 'But as for you, be strong and do not give up, for your work will be rewarded.',
    reference: '2 Chronicles 15:7',
    category: 'consistency',
    context: 'Encourages persistence in daily routines and goals.',
    applicableSituations: ['routine_struggle', 'goal_progress', 'daily_habits']
  },
  {
    id: 'cs3',
    verseText: 'The plans of the diligent lead to profit as surely as haste leads to poverty.',
    reference: 'Proverbs 21:5',
    category: 'consistency',
    context: 'Emphasizes the value of steady, consistent effort over time.',
    applicableSituations: ['financial_goals', 'long_term_planning', 'steady_progress']
  },

  // FAITH - For users needing spiritual strength
  {
    id: 'ft1',
    verseText: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    reference: 'Hebrews 11:1',
    category: 'faith',
    context: 'Helps users understand and strengthen their faith foundation.',
    applicableSituations: ['spiritual_doubt', 'uncertainty', 'trust_issues']
  },
  {
    id: 'ft2',
    verseText: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    reference: 'Proverbs 3:5-6',
    category: 'faith',
    context: 'Guides users to trust God in decision-making and life direction.',
    applicableSituations: ['decision_making', 'life_direction', 'trust', 'guidance']
  },
  {
    id: 'ft3',
    verseText: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    reference: 'Isaiah 40:31',
    category: 'faith',
    context: 'Promises renewed strength through faith and hope in God.',
    applicableSituations: ['exhaustion', 'weakness', 'renewal', 'hope']
  },

  // PERSEVERANCE - For users facing difficulties
  {
    id: 'ps1',
    verseText: 'Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.',
    reference: 'James 1:2-3',
    category: 'perseverance',
    context: 'Teaches users to find growth opportunities in challenges.',
    applicableSituations: ['difficulty', 'challenge', 'growth_opportunity', 'testing']
  },
  {
    id: 'ps2',
    verseText: 'We also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope.',
    reference: 'Romans 5:3-4',
    category: 'perseverance',
    context: 'Shows how challenges build character and hope.',
    applicableSituations: ['suffering', 'character_building', 'hope_development']
  },
  {
    id: 'ps3',
    verseText: 'Blessed is the one who perseveres under trial, because, having stood the test, that person will receive the crown of life that the Lord has promised to those who love him.',
    reference: 'James 1:12',
    category: 'perseverance',
    context: 'Promises reward for those who endure difficulties faithfully.',
    applicableSituations: ['endurance', 'reward', 'faithful_persistence']
  },

  // GROWTH - For users working on personal development
  {
    id: 'gw1',
    verseText: 'But grow in the grace and knowledge of our Lord and Savior Jesus Christ.',
    reference: '2 Peter 3:18',
    category: 'growth',
    context: 'Encourages continuous spiritual and personal growth.',
    applicableSituations: ['personal_development', 'learning', 'spiritual_growth']
  },
  {
    id: 'gw2',
    verseText: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.',
    reference: 'Romans 12:2',
    category: 'growth',
    context: 'Guides users toward positive transformation and mindset renewal.',
    applicableSituations: ['mindset_change', 'transformation', 'renewal', 'positive_change']
  },
  {
    id: 'gw3',
    verseText: 'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.',
    reference: 'Ephesians 2:10',
    category: 'growth',
    context: 'Reminds users of their purpose and potential for good works.',
    applicableSituations: ['purpose_discovery', 'potential_realization', 'good_works']
  },

  // COMFORT - For users experiencing pain or loss
  {
    id: 'cf1',
    verseText: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    reference: 'Matthew 11:28',
    category: 'comfort',
    context: 'Offers rest and comfort to those feeling overwhelmed.',
    applicableSituations: ['exhaustion', 'burden', 'overwhelm', 'need_rest']
  },
  {
    id: 'cf2',
    verseText: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
    reference: 'Psalm 34:18',
    category: 'comfort',
    context: 'Assures users that God is near during difficult times.',
    applicableSituations: ['heartbreak', 'crushed_spirit', 'loneliness', 'pain']
  },
  {
    id: 'cf3',
    verseText: 'Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.',
    reference: 'Psalm 55:22',
    category: 'comfort',
    context: 'Encourages users to give their worries to God.',
    applicableSituations: ['worry', 'anxiety', 'stress', 'need_support']
  },

  // GUIDANCE - For users seeking direction
  {
    id: 'gd1',
    verseText: 'Your word is a lamp for my feet, a light on my path.',
    reference: 'Psalm 119:105',
    category: 'guidance',
    context: 'Shows how God\'s word provides direction in life.',
    applicableSituations: ['direction_needed', 'path_uncertainty', 'guidance_seeking']
  },
  {
    id: 'gd2',
    verseText: 'In all your ways submit to him, and he will make your paths straight.',
    reference: 'Proverbs 3:6',
    category: 'guidance',
    context: 'Promises clear direction when we submit to God.',
    applicableSituations: ['decision_making', 'path_choice', 'submission']
  },
  {
    id: 'gd3',
    verseText: 'Whether you turn to the right or to the left, your ears will hear a voice behind you, saying, "This is the way; walk in it."',
    reference: 'Isaiah 30:21',
    category: 'guidance',
    context: 'Assures users that God will guide their steps.',
    applicableSituations: ['direction_confusion', 'choice_difficulty', 'guidance_needed']
  }
];

export const getVersesByCategory = (category: string) => {
  return bibleVerses.filter(v => v.category === category);
};

export const getVersesBySituation = (situation: string) => {
  return bibleVerses.filter(v => 
    v.applicableSituations.some(s => s.includes(situation))
  );
};

export const getRandomVerse = () => {
  return bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
};

export const getPersonalizedVerse = (userData: {
  mood?: number;
  energy?: number;
  streak?: number;
  recentProgress?: number;
  goals?: any[];
}) => {
  // Logic to select the most appropriate verse based on user data
  if (userData.mood && userData.mood < 5) {
    return getVersesByCategory('comfort')[0];
  }
  
  if (userData.streak && userData.streak < 3) {
    return getVersesByCategory('consistency')[0];
  }
  
  if (userData.energy && userData.energy < 5) {
    return getVersesByCategory('motivation')[0];
  }
  
  if (userData.recentProgress && userData.recentProgress < 30) {
    return getVersesByCategory('perseverance')[0];
  }
  
  // Default to growth verse
  return getVersesByCategory('growth')[0];
};
