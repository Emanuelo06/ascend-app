'use client';

import { useState, useEffect, useRef } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { 
  BrainIcon,
  MessageCircleIcon,
  SendIcon,
  ClockIcon,
  TargetIcon,
  TrendingUpIcon,
  LightbulbIcon,
  HeartIcon,
  ZapIcon,
  ArrowRightIcon,
  UserIcon,
  BotIcon,
  CalendarIcon,
  BarChart3Icon,
  BookOpenIcon,
  StarIcon
} from 'lucide-react';

interface CoachingSession {
  id: string;
  type: 'daily_motivation' | 'goal_setting' | 'crisis_support' | 'habit_building' | 'mindfulness' | 'custom';
  message: string;
  response: string;
  timestamp: string;
  rating?: number;
}

interface CoachingContext {
  currentGoals: string[];
  recentChallenges: string[];
  mood: 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';
  energy: 'high' | 'medium' | 'low';
  focus: 'high' | 'medium' | 'low';
}

export default function CoachingPage() {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<CoachingSession | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<CoachingSession['type']>('daily_motivation');
  const [coachingContext, setCoachingContext] = useState<CoachingContext>({
    currentGoals: ['Build healthy habits', 'Improve fitness', 'Reduce stress'],
    recentChallenges: ['Finding time for exercise', 'Maintaining consistency'],
    mood: 'good',
    energy: 'medium',
    focus: 'medium'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadCoachingSessions();
  }, [user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadCoachingSessions = async () => {
    // Simulate loading coaching sessions
    setTimeout(() => {
      setSessions([
        {
          id: '1',
          type: 'daily_motivation',
          message: 'I need some motivation to start my day',
          response: 'Good morning! Remember that every great achievement starts with a single step. You have the power to create the life you want. Start with one small action today - whether it\'s a 5-minute meditation, a short walk, or writing down your top 3 priorities. What would make today feel successful for you?',
          timestamp: '2024-01-15T09:00:00Z',
          rating: 5
        },
        {
          id: '2',
          type: 'goal_setting',
          message: 'I want to set better goals for this year',
          response: 'Great initiative! Let\'s create SMART goals that will truly inspire you. Start by asking yourself: What matters most to me right now? What would I like to achieve in the next 90 days? Break down your big goals into smaller, actionable steps. Remember, progress over perfection!',
          timestamp: '2024-01-14T15:30:00Z',
          rating: 4
        }
      ]);
    }, 1000);
  };

  const startNewSession = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const newSession: CoachingSession = {
      id: Date.now().toString(),
      type: selectedType,
      message: message,
      response: '',
      timestamp: new Date().toISOString()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);

    // Simulate AI response generation
    setTimeout(() => {
      const aiResponse = generateAIResponse(selectedType, message, coachingContext);
      setSessions(prev => 
        prev.map(s => 
          s.id === newSession.id 
            ? { ...s, response: aiResponse }
            : s
        )
      );
      setCurrentSession(prev => prev ? { ...prev, response: aiResponse } : null);
      setIsLoading(false);
      setMessage('');
    }, 2000);
  };

  const generateAIResponse = (type: string, userMessage: string, context: CoachingContext): string => {
    const responses = {
      daily_motivation: [
        "You're doing amazing! Every day is a new opportunity to grow and improve. Remember, progress isn't always linear, but consistency is key. What's one thing you're grateful for today?",
        "Good morning! You have incredible potential within you. Today, focus on being 1% better than yesterday. Small steps lead to big changes. What would make today feel successful?",
        "You've got this! Every challenge you face is making you stronger. Trust the process and believe in yourself. What's one positive action you can take right now?"
      ],
      goal_setting: [
        "Excellent! Setting clear goals is the first step to achieving them. Let's break this down: What's your main objective? What's your timeline? What resources do you need? Remember, goals should excite you and feel achievable.",
        "Great question! The best goals are specific, measurable, and meaningful to you. Start with your 'why' - why does this goal matter? Then create a roadmap with milestones. What's your first step?",
        "Perfect timing for goal setting! Consider what success looks like for you. Break big goals into smaller, actionable steps. Celebrate progress along the way. What's one goal you'd like to focus on first?"
      ],
      crisis_support: [
        "I hear you, and it's okay to not be okay. You're not alone in this. Take a deep breath. What's one small thing you can do right now to take care of yourself? Remember, this moment will pass.",
        "I'm here for you. It sounds like you're going through a really tough time. Let's focus on getting through this moment, then the next. What would be most helpful for you right now?",
        "You're showing incredible strength by reaching out. It's okay to ask for help. Let's take this one step at a time. What do you need most right now?"
      ],
      habit_building: [
        "Building new habits takes time and patience. Start small - choose one habit and commit to it for 21 days. Stack it onto an existing routine. What habit would have the biggest positive impact on your life?",
        "Great focus on habits! Remember the 2-minute rule: make it so easy you can't say no. Start with tiny actions and build from there. What's one small habit you'd like to start today?",
        "Habit building is a journey, not a destination. Focus on consistency over perfection. Track your progress and celebrate small wins. What habit are you working on, and how can I support you?"
      ],
      mindfulness: [
        "Mindfulness is about being present in this moment. Take a deep breath and notice what you're experiencing right now. What do you see, hear, feel? There's no need to change anything - just observe.",
        "Beautiful practice! Mindfulness helps us find peace in the present moment. Start with just 5 minutes of focused breathing. Notice your thoughts without judgment. What's one way you can be more present today?",
        "Mindfulness is a gift you give yourself. It's about finding calm in the chaos. Try this: take three deep breaths and notice how you feel. What would help you feel more centered right now?"
      ],
      custom: [
        "I'm here to support you with whatever you need. Let's explore this together. What would be most helpful for you right now? I'm listening and ready to help you find clarity and direction.",
        "Thank you for sharing this with me. I want to understand how I can best support you. Let's work through this together. What's the next step you'd like to take?",
        "I appreciate you reaching out. Let's figure this out together. Sometimes talking through things helps us see new perspectives. What would you like to focus on or work through?"
      ]
    };

    const typeResponses = responses[type as keyof typeof responses] || responses.custom;
    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  };

  const rateSession = (sessionId: string, rating: number) => {
    setSessions(prev => 
      prev.map(s => 
        s.id === sessionId ? { ...s, rating } : s
      )
    );
  };

  const getSessionTypeIcon = (type: string) => {
    const icons = {
      daily_motivation: <ZapIcon className="w-5 h-5" />,
      goal_setting: <TargetIcon className="w-5 h-5" />,
      crisis_support: <HeartIcon className="w-5 h-5" />,
      habit_building: <TrendingUpIcon className="w-5 h-5" />,
      mindfulness: <BrainIcon className="w-5 h-5" />,
      custom: <MessageCircleIcon className="w-5 h-5" />
    };
    return icons[type as keyof typeof icons] || icons.custom;
  };

  const getSessionTypeColor = (type: string) => {
    const colors = {
      daily_motivation: 'bg-yellow-100 text-yellow-700',
      goal_setting: 'bg-blue-100 text-blue-700',
      crisis_support: 'bg-red-100 text-red-700',
      habit_building: 'bg-green-100 text-green-700',
      mindfulness: 'bg-purple-100 text-purple-700',
      custom: 'bg-slate-100 text-slate-700'
    };
    return colors[type as keyof typeof colors] || colors.custom;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ASCEND
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Coaching Sessions</h2>
          <p className="text-slate-600">
            Get personalized coaching, motivation, and support from your AI coach
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - New Session */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 sticky top-24">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Start New Session</h3>
              
              <div className="space-y-4">
                {/* Session Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Session Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as any)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="daily_motivation">Daily Motivation</option>
                    <option value="goal_setting">Goal Setting</option>
                    <option value="crisis_support">Crisis Support</option>
                    <option value="habit_building">Habit Building</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share what's on your mind, ask for advice, or request motivation..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                {/* Send Button */}
                <button
                  onClick={startNewSession}
                  disabled={isLoading || !message.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <BrainIcon className="w-5 h-5 mr-2 animate-spin" />
                      AI is thinking...
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-5 h-5 mr-2" />
                      Start Session
                    </>
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Quick Start</h4>
                <div className="space-y-2">
                  {['daily_motivation', 'goal_setting', 'mindfulness'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type as any);
                        setMessage(type === 'daily_motivation' ? 'I need some motivation to start my day' : 
                                  type === 'goal_setting' ? 'I want to set better goals for this year' :
                                  'I need help staying present and mindful');
                      }}
                      className="w-full text-left p-3 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sessions */}
          <div className="lg:col-span-2">
            {/* Current Session */}
            {currentSession && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Current Session</h3>
                  <span className={`px-3 py-1 text-xs rounded-full ${getSessionTypeColor(currentSession.type)}`}>
                    {currentSession.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {/* User Message */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-xl p-4">
                      <p className="text-slate-900">{currentSession.message}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(currentSession.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* AI Response */}
                  {currentSession.response ? (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <BotIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                        <p className="text-slate-900">{currentSession.response}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(currentSession.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2 text-slate-500">
                        <BrainIcon className="w-5 h-5 animate-spin" />
                        <span>AI is crafting your response...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Session History */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Session History</h3>
              
              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <BrainIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No coaching sessions yet. Start your first session!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getSessionTypeColor(session.type)}`}>
                            {getSessionTypeIcon(session.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">
                              {session.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {new Date(session.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {session.rating && (
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= session.rating! 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{session.message}</p>
                        </div>
                        
                        {session.response && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-slate-700">{session.response}</p>
                          </div>
                        )}
                      </div>
                      
                      {!session.rating && session.response && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-sm text-slate-600 mb-2">Rate this session:</p>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => rateSession(session.id, star)}
                                className="text-slate-300 hover:text-yellow-400 transition-colors"
                              >
                                <StarIcon className="w-5 h-5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <div ref={messagesEndRef} />
    </div>
  );
}
