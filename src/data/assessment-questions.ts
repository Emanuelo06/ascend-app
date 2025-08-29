export interface AssessmentQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  category: 'physical' | 'mental' | 'spiritual' | 'relational' | 'financial';
  responseScale: 1 | 2 | 3 | 4 | 5;
  weight: number;
  context: string;
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // PHYSICAL DIMENSION (7 questions)
  {
    id: 'p1',
    questionNumber: 1,
    questionText: 'How would you rate your overall physical health and energy levels?',
    category: 'physical',
    responseScale: 5,
    weight: 2,
    context: 'This question assesses your baseline physical condition and daily energy levels.'
  },
  {
    id: 'p2',
    questionNumber: 2,
    questionText: 'How consistent are you with regular exercise or physical activity?',
    category: 'physical',
    responseScale: 5,
    weight: 2,
    context: 'Evaluates your commitment to physical fitness and movement.'
  },
  {
    id: 'p3',
    questionNumber: 3,
    questionText: 'How would you rate your sleep quality and recovery?',
    category: 'physical',
    responseScale: 5,
    weight: 2,
    context: 'Assesses your sleep patterns and recovery quality.'
  },
  {
    id: 'p4',
    questionNumber: 4,
    questionText: 'How well do you maintain a balanced and nutritious diet?',
    category: 'physical',
    responseScale: 5,
    weight: 1,
    context: 'Evaluates your nutrition habits and dietary choices.'
  },
  {
    id: 'p5',
    questionNumber: 5,
    questionText: 'How often do you experience physical stress or tension?',
    category: 'physical',
    responseScale: 5,
    weight: 1,
    context: 'Assesses your physical stress levels and tension management.'
  },
  {
    id: 'p6',
    questionNumber: 6,
    questionText: 'How would you rate your physical mobility and flexibility?',
    category: 'physical',
    responseScale: 5,
    weight: 1,
    context: 'Evaluates your range of motion and physical flexibility.'
  },
  {
    id: 'p7',
    questionNumber: 7,
    questionText: 'How consistent are you with preventive health measures (check-ups, screenings)?',
    category: 'physical',
    responseScale: 5,
    weight: 1,
    context: 'Assesses your proactive approach to health maintenance.'
  },

  // MENTAL DIMENSION (7 questions)
  {
    id: 'm1',
    questionNumber: 8,
    questionText: 'How would you rate your mental clarity and focus throughout the day?',
    category: 'mental',
    responseScale: 5,
    weight: 2,
    context: 'Evaluates your cognitive sharpness and ability to concentrate.'
  },
  {
    id: 'm2',
    questionNumber: 9,
    questionText: 'How often do you engage in learning new skills or knowledge?',
    category: 'mental',
    responseScale: 5,
    weight: 2,
    context: 'Assesses your commitment to continuous learning and growth.'
  },
  {
    id: 'm3',
    questionNumber: 10,
    questionText: 'How well do you manage stress and emotional regulation?',
    category: 'mental',
    responseScale: 5,
    weight: 2,
    context: 'Evaluates your stress management and emotional control.'
  },
  {
    id: 'm4',
    questionNumber: 11,
    questionText: 'How consistent are you with mental health practices (meditation, mindfulness)?',
    category: 'mental',
    responseScale: 5,
    weight: 1,
    context: 'Assesses your mental wellness practices and routines.'
  },
  {
    id: 'm5',
    questionNumber: 12,
    questionText: 'How would you rate your problem-solving and decision-making abilities?',
    category: 'mental',
    responseScale: 5,
    weight: 1,
    context: 'Evaluates your cognitive problem-solving skills.'
  },
  {
    id: 'm6',
    questionNumber: 13,
    questionText: 'How often do you experience mental fatigue or brain fog?',
    category: 'mental',
    responseScale: 5,
    weight: 1,
    context: 'Assesses your mental energy levels and cognitive fatigue.'
  },
  {
    id: 'm7',
    questionNumber: 14,
    questionText: 'How well do you maintain work-life balance and boundaries?',
    category: 'mental',
    responseScale: 5,
    weight: 1,
    context: 'Evaluates your ability to balance different life areas.'
  },

  // SPIRITUAL DIMENSION (7 questions)
  {
    id: 's1',
    questionNumber: 15,
    questionText: 'How consistent are you with daily prayer or spiritual practices?',
    category: 'spiritual',
    responseScale: 5,
    weight: 2,
    context: 'Assesses your daily spiritual discipline and prayer life.'
  },
  {
    id: 's2',
    questionNumber: 16,
    questionText: 'How would you rate your sense of purpose and meaning in life?',
    category: 'spiritual',
    responseScale: 5,
    weight: 2,
    context: 'Evaluates your understanding of life purpose and meaning.'
  },
  {
    id: 's3',
    questionNumber: 17,
    questionText: 'How often do you engage with spiritual texts or teachings?',
    category: 'spiritual',
    responseScale: 5,
    weight: 2,
    context: 'Assesses your engagement with spiritual literature and learning.'
  },
  {
    id: 's4',
    questionNumber: 18,
    questionText: 'How well do you practice gratitude and appreciation?',
    category: 'spiritual',
    responseScale: 5,
    weight: 1,
    context: 'Evaluates your gratitude practice and appreciation mindset.'
  },
  {
    id: 's5',
    questionNumber: 19,
    questionText: 'How connected do you feel to your faith community or spiritual group?',
    category: 'spiritual',
    responseScale: 5,
    weight: 1,
    context: 'Assesses your spiritual community involvement.'
  },
  {
    id: 's6',
    questionNumber: 20,
    questionText: 'How often do you experience spiritual growth or transformation?',
    category: 'spiritual',
    responseScale: 5,
    weight: 1,
    context: 'Evaluates your spiritual development and growth.'
  },
  {
    id: 's7',
    questionNumber: 21,
    questionText: 'How well do you integrate your faith into daily decisions?',
    category: 'spiritual',
    responseScale: 5,
    weight: 1,
    context: 'Assesses how your faith influences daily choices.'
  },

  // RELATIONAL DIMENSION (7 questions)
  {
    id: 'r1',
    questionNumber: 22,
    questionText: 'How would you rate the quality of your closest relationships?',
    category: 'relational',
    responseScale: 5,
    weight: 2,
    context: 'Evaluates the depth and quality of your key relationships.'
  },
  {
    id: 'r2',
    questionNumber: 23,
    questionText: 'How well do you communicate and express your feelings?',
    category: 'relational',
    responseScale: 5,
    weight: 2,
    context: 'Assesses your communication skills and emotional expression.'
  },
  {
    id: 'r3',
    questionNumber: 24,
    questionText: 'How often do you spend quality time with family and friends?',
    category: 'relational',
    responseScale: 5,
    weight: 2,
    context: 'Evaluates your investment in relationship building.'
  },
  {
    id: 'r4',
    questionNumber: 25,
    questionText: 'How well do you handle conflicts and disagreements?',
    category: 'relational',
    responseScale: 5,
    weight: 1,
    context: 'Assesses your conflict resolution skills.'
  },
  {
    id: 'r5',
    questionNumber: 26,
    questionText: 'How often do you show empathy and support to others?',
    category: 'relational',
    responseScale: 5,
    weight: 1,
    context: 'Evaluates your empathy and support for others.'
  },
  {
    id: 'r6',
    questionNumber: 27,
    questionText: 'How well do you maintain healthy boundaries in relationships?',
    category: 'relational',
    responseScale: 5,
    weight: 1,
    context: 'Assesses your ability to set and maintain healthy boundaries.'
  },
  {
    id: 'r7',
    questionNumber: 28,
    questionText: 'How often do you feel lonely or disconnected from others?',
    category: 'relational',
    responseScale: 5,
    weight: 1,
    context: 'Evaluates your sense of connection and belonging.'
  },

  // FINANCIAL DIMENSION (7 questions)
  {
    id: 'f1',
    questionNumber: 29,
    questionText: 'How would you rate your overall financial stability and security?',
    category: 'financial',
    responseScale: 5,
    weight: 2,
    context: 'Assesses your current financial situation and security.'
  },
  {
    id: 'f2',
    questionNumber: 30,
    questionText: 'How consistent are you with budgeting and tracking expenses?',
    category: 'financial',
    responseScale: 5,
    weight: 2,
    context: 'Evaluates your financial planning and expense management.'
  },
  {
    id: 'f3',
    questionNumber: 31,
    questionText: 'How well do you save money and build emergency funds?',
    category: 'financial',
    responseScale: 5,
    weight: 2,
    context: 'Assesses your saving habits and emergency preparedness.'
  },
  {
    id: 'f4',
    questionNumber: 32,
    questionText: 'How knowledgeable are you about investing and wealth building?',
    category: 'financial',
    responseScale: 5,
    weight: 1,
    context: 'Evaluates your financial education and investment knowledge.'
  },
  {
    id: 'f5',
    questionNumber: 33,
    questionText: 'How well do you manage debt and avoid unnecessary expenses?',
    category: 'financial',
    responseScale: 5,
    weight: 1,
    context: 'Assesses your debt management and spending discipline.'
  },
  {
    id: 'f6',
    questionNumber: 34,
    questionText: 'How often do you review and adjust your financial goals?',
    category: 'financial',
    responseScale: 5,
    weight: 1,
    context: 'Evaluates your financial goal setting and review process.'
  },
  {
    id: 'f7',
    questionNumber: 35,
    questionText: 'How well do you plan for long-term financial goals (retirement, major purchases)?',
    category: 'financial',
    responseScale: 5,
    weight: 1,
    context: 'Assesses your long-term financial planning and foresight.'
  }
];

export const getQuestionsByCategory = (category: string) => {
  return assessmentQuestions.filter(q => q.category === category);
};

export const getTotalQuestions = () => assessmentQuestions.length;

export const getCategoryWeights = () => {
  const weights: { [key: string]: number } = {};
  assessmentQuestions.forEach(q => {
    weights[q.category] = (weights[q.category] || 0) + q.weight;
  });
  return weights;
};
