export interface DailyQuote {
  id: string;
  quoteText: string;
  author: string;
  category: 'motivation' | 'success' | 'leadership' | 'growth' | 'wisdom' | 'inspiration';
  context: string;
}

export const dailyQuotes: DailyQuote[] = [
  // MOTIVATION
  {
    id: 'mq1',
    quoteText: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'motivation',
    context: 'Perfect for users who need to find passion in their daily activities.'
  },
  {
    id: 'mq2',
    quoteText: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'motivation',
    context: 'Encourages users to persevere through both success and failure.'
  },
  {
    id: 'mq3',
    quoteText: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    category: 'motivation',
    context: 'Inspires users to hold onto their dreams and aspirations.'
  },
  {
    id: 'mq4',
    quoteText: 'Don\'t watch the clock; do what it does. Keep going.',
    author: 'Sam Levenson',
    category: 'motivation',
    context: 'Reminds users to stay consistent and persistent in their efforts.'
  },
  {
    id: 'mq5',
    quoteText: 'The only limit to our realization of tomorrow will be our doubts of today.',
    author: 'Franklin D. Roosevelt',
    category: 'motivation',
    context: 'Encourages users to overcome self-doubt and believe in their potential.'
  },

  // SUCCESS
  {
    id: 'sq1',
    quoteText: 'Success is walking from failure to failure with no loss of enthusiasm.',
    author: 'Winston Churchill',
    category: 'success',
    context: 'Teaches users to maintain enthusiasm even when facing setbacks.'
  },
  {
    id: 'sq2',
    quoteText: 'The road to success and the road to failure are almost exactly the same.',
    author: 'Colin R. Davis',
    category: 'success',
    context: 'Shows that success and failure are separated only by persistence.'
  },
  {
    id: 'sq3',
    quoteText: 'Success is not the key to happiness. Happiness is the key to success.',
    author: 'Herman Cain',
    category: 'success',
    context: 'Reminds users that happiness comes first, then success follows.'
  },
  {
    id: 'sq4',
    quoteText: 'I find that the harder I work, the more luck I seem to have.',
    author: 'Thomas Jefferson',
    category: 'success',
    context: 'Demonstrates the relationship between hard work and good fortune.'
  },
  {
    id: 'sq5',
    quoteText: 'Success usually comes to those who are too busy to be looking for it.',
    author: 'Henry David Thoreau',
    category: 'success',
    context: 'Encourages users to focus on their work rather than seeking recognition.'
  },

  // LEADERSHIP
  {
    id: 'lq1',
    quoteText: 'The greatest leader is not necessarily the one who does the greatest things. He is the one that gets the people to do the greatest things.',
    author: 'Ronald Reagan',
    category: 'leadership',
    context: 'Teaches users about the power of inspiring others to achieve greatness.'
  },
  {
    id: 'lq2',
    quoteText: 'Leadership and learning are indispensable to each other.',
    author: 'John F. Kennedy',
    category: 'leadership',
    context: 'Emphasizes the importance of continuous learning for effective leadership.'
  },
  {
    id: 'lq3',
    quoteText: 'A leader is one who knows the way, goes the way, and shows the way.',
    author: 'John C. Maxwell',
    category: 'leadership',
    context: 'Defines true leadership as knowing, doing, and teaching.'
  },
  {
    id: 'lq4',
    quoteText: 'The supreme quality for leadership is unquestionably integrity.',
    author: 'Dwight D. Eisenhower',
    category: 'leadership',
    context: 'Highlights integrity as the foundation of effective leadership.'
  },
  {
    id: 'lq5',
    quoteText: 'Leadership is the capacity to translate vision into reality.',
    author: 'Warren Bennis',
    category: 'leadership',
    context: 'Shows that leadership is about making dreams come true.'
  },

  // GROWTH
  {
    id: 'gq1',
    quoteText: 'Growth is the only evidence of life.',
    author: 'John Henry Newman',
    category: 'growth',
    context: 'Reminds users that growth is a sign of being truly alive.'
  },
  {
    id: 'gq2',
    quoteText: 'The only person you are destined to become is the person you decide to be.',
    author: 'Ralph Waldo Emerson',
    category: 'growth',
    context: 'Empowers users to take control of their personal development.'
  },
  {
    id: 'gq3',
    quoteText: 'Change is the end result of all true learning.',
    author: 'Leo Buscaglia',
    category: 'growth',
    context: 'Shows that real learning leads to personal transformation.'
  },
  {
    id: 'gq4',
    quoteText: 'We cannot become what we want by remaining what we are.',
    author: 'Max DePree',
    category: 'growth',
    context: 'Encourages users to embrace change for personal growth.'
  },
  {
    id: 'gq5',
    quoteText: 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.',
    author: 'Brian Herbert',
    category: 'growth',
    context: 'Shows that learning is a combination of gift, skill, and choice.'
  },

  // WISDOM
  {
    id: 'wq1',
    quoteText: 'Wisdom comes from experience, and experience comes from mistakes.',
    author: 'Anonymous',
    category: 'wisdom',
    context: 'Teaches users to value mistakes as learning opportunities.'
  },
  {
    id: 'wq2',
    quoteText: 'The only true wisdom is in knowing you know nothing.',
    author: 'Socrates',
    category: 'wisdom',
    context: 'Encourages humility and continuous learning.'
  },
  {
    id: 'wq3',
    quoteText: 'Knowledge speaks, but wisdom listens.',
    author: 'Jimi Hendrix',
    category: 'wisdom',
    context: 'Shows the difference between having knowledge and being wise.'
  },
  {
    id: 'wq4',
    quoteText: 'Wisdom is not a product of schooling but of the lifelong attempt to acquire it.',
    author: 'Albert Einstein',
    category: 'wisdom',
    context: 'Emphasizes that wisdom comes from lifelong learning, not just education.'
  },
  {
    id: 'wq5',
    quoteText: 'The fool doth think he is wise, but the wise man knows himself to be a fool.',
    author: 'William Shakespeare',
    category: 'wisdom',
    context: 'Teaches the value of self-awareness and humility.'
  },

  // INSPIRATION
  {
    id: 'iq1',
    quoteText: 'What you get by achieving your goals is not as important as what you become by achieving your goals.',
    author: 'Zig Ziglar',
    category: 'inspiration',
    context: 'Focuses on personal transformation rather than just goal achievement.'
  },
  {
    id: 'iq2',
    quoteText: 'The only impossible journey is the one you never begin.',
    author: 'Tony Robbins',
    category: 'inspiration',
    context: 'Encourages users to start their journey, no matter how daunting it seems.'
  },
  {
    id: 'iq3',
    quoteText: 'Believe you can and you\'re halfway there.',
    author: 'Theodore Roosevelt',
    category: 'inspiration',
    context: 'Shows the power of belief in achieving success.'
  },
  {
    id: 'iq4',
    quoteText: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    category: 'inspiration',
    context: 'Encourages persistence regardless of speed.'
  },
  {
    id: 'iq5',
    quoteText: 'The best way to predict the future is to create it.',
    author: 'Peter Drucker',
    category: 'inspiration',
    context: 'Empowers users to take control of their destiny.'
  },

  // Additional motivational quotes for variety
  {
    id: 'mq6',
    quoteText: 'Every morning we are born again. What we do today matters most.',
    author: 'Buddha',
    category: 'motivation',
    context: 'Reminds users that each day is a fresh start and today\'s actions matter most.'
  },
  {
    id: 'mq7',
    quoteText: 'The difference between ordinary and extraordinary is that little extra.',
    author: 'Jimmy Johnson',
    category: 'motivation',
    context: 'Shows that small extra efforts can lead to extraordinary results.'
  },
  {
    id: 'sq6',
    quoteText: 'Success is stumbling from failure to failure with no loss of enthusiasm.',
    author: 'Winston Churchill',
    category: 'success',
    context: 'Another perspective on maintaining enthusiasm through failures.'
  },
  {
    id: 'gq6',
    quoteText: 'Personal development is a major time-saver. The better you become, the less time it takes you to achieve your goals.',
    author: 'Brian Tracy',
    category: 'growth',
    context: 'Shows the long-term benefits of personal development.'
  },
  {
    id: 'wq6',
    quoteText: 'The more you learn, the more you realize how much you don\'t know.',
    author: 'Albert Einstein',
    category: 'wisdom',
    context: 'Encourages continuous learning and intellectual humility.'
  }
];

export const getQuotesByCategory = (category: string) => {
  return dailyQuotes.filter(q => q.category === category);
};

export const getRandomQuote = () => {
  return dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
};

export const getQuoteByDate = (date: Date) => {
  // Use the date to deterministically select a quote
  // This ensures the same quote appears on the same date for all users
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return dailyQuotes[dayOfYear % dailyQuotes.length];
};

export const getPersonalizedQuote = (userData: {
  mood?: number;
  energy?: number;
  goals?: any[];
  recentActivity?: string;
}) => {
  // Select quote based on user's current state
  if (userData.mood && userData.mood < 5) {
    return getQuotesByCategory('motivation')[0];
  }
  
  if (userData.energy && userData.energy < 5) {
    return getQuotesByCategory('inspiration')[0];
  }
  
  if (userData.goals && userData.goals.length > 0) {
    return getQuotesByCategory('success')[0];
  }
  
  // Default to growth quote
  return getQuotesByCategory('growth')[0];
};
