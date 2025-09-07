'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Target, TrendingUp, Heart, Brain, BookOpen,
  Users, DollarSign, Calendar, CheckCircle, Star, Lightbulb, 
  Zap, Activity, BarChart3, Award, Trophy, Flame, Plus,
  ChevronRight, Settings, Bell, RefreshCw, TargetIcon, Sparkles,
  Edit3, Sun, Moon, Coffee, Zap as ZapIcon, Target as TargetIcon2,
  TrendingUp as TrendingUpIcon, Heart as HeartIcon, BookOpen as BookOpenIcon,
  Users as UsersIcon, DollarSign as DollarSignIcon, Clock, CheckCircle2,
  XCircle, AlertCircle, Smile, Frown, Meh
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number;
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high';
}

interface DailyRecommendation {
  type: 'habit' | 'challenge' | 'reflection' | 'learning';
  title: string;
  description: string;
  estimatedTime: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

interface Habit {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
  category: string;
}

export default function DashboardPage() {
  const { user, updateUserData } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyRecommendations, setDailyRecommendations] = useState<DailyRecommendation[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mood, setMood] = useState<number>(3);
  const [moodNote, setMoodNote] = useState('');
  const [aiTip, setAiTip] = useState('');
  const [showAiTip, setShowAiTip] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      generateAiTip();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // TODO: Replace with real API call once backend is fully set up
      // const response = await fetch(`/api/dashboard/summary?userId=${user?.id || 'demo-user'}`);
      // if (response.ok) {
      //   const data = await response.json();
      //   // Update dashboard with real data
      //   // setCurrentStreak(data.data.currentStreak);
      //   // setTotalHabits(data.data.totalHabits);
      //   // etc.
      // }
      
      // Load user's actual goals from onboarding
      const userGoals = user?.goals || [];
      const mockGoals: Goal[] = userGoals.map((goal, index) => ({
        id: `goal-${index}`,
        title: goal,
        category: 'personal',
        progress: 0, // Start at 0
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
        status: 'active',
        priority: 'high'
      }));

      setGoals(mockGoals);

    // Generate daily recommendations based on user's goals
    const recommendations: DailyRecommendation[] = [
      {
        type: 'habit',
        title: 'Morning Prayer & Reflection',
        description: 'Start your day with spiritual grounding',
        estimatedTime: 10,
        category: 'spiritual',
        priority: 'high'
      },
      {
        type: 'challenge',
        title: '30-Minute Workout',
        description: 'Build physical strength and energy',
        estimatedTime: 30,
        category: 'physical',
        priority: 'high'
      },
      {
        type: 'reflection',
        title: 'Daily Goal Review',
        description: 'Check progress on your selected goals',
        estimatedTime: 5,
        category: 'mental',
        priority: 'medium'
      }
    ];

    setDailyRecommendations(recommendations);

    // Mock habits data
    const mockHabits: Habit[] = [
      { id: '1', title: 'Morning Prayer', completed: true, streak: 7, category: 'spiritual' },
      { id: '2', title: '30-Minute Workout', completed: false, streak: 3, category: 'physical' },
      { id: '3', title: 'Evening Reading', completed: false, streak: 5, category: 'mental' },
      { id: '4', title: 'Hydration Check', completed: true, streak: 12, category: 'physical' }
    ];
    setHabits(mockHabits);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to empty data if there's an error
      setGoals([]);
      setHabits([]);
    }
  };

  const generateAiTip = () => {
    const tips = [
      "Based on your morning prayer streak, try adding 2 minutes of gratitude journaling to amplify the spiritual benefits.",
      "Your workout consistency dips on Wednesdays. Consider scheduling it as your first task of the day.",
      "Your hydration habit is strong! Try adding a glass of water before each meal to optimize digestion.",
      "Your evening reading habit could benefit from a 5-minute reflection afterward to solidify learning.",
      "Your spiritual practices show excellent consistency. Consider adding a weekly spiritual challenge to deepen your journey."
    ];
    setAiTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: 'Good morning', icon: <Sun className="w-6 h-6 text-yellow-400" />, emoji: '☀️' };
    if (hour < 17) return { greeting: 'Good afternoon', icon: <ZapIcon className="w-6 h-6 text-orange-400" />, emoji: '⚡' };
    return { greeting: 'Good evening', icon: <Moon className="w-6 h-6 text-blue-400" />, emoji: '🌙' };
  };

  const getKeystoneHabit = () => {
    const keystoneHabits = habits.filter(h => h.category === 'spiritual');
    return keystoneHabits.length > 0 ? keystoneHabits[0] : habits[0];
  };

  const getHabitCompletionPercentage = () => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(h => h.completed).length;
    return Math.round((completed / habits.length) * 100);
  };

  const getCurrentStreak = () => {
    return habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
  };

  const getMoodIcon = (moodValue: number) => {
    if (moodValue >= 4) return <Smile className="w-6 h-6 text-green-400" />;
    if (moodValue >= 3) return <Meh className="w-6 h-6 text-yellow-400" />;
    return <Frown className="w-6 h-6 text-red-400" />;
  };

  const getMoodColor = (moodValue: number) => {
    if (moodValue >= 4) return 'from-green-400 to-emerald-500';
    if (moodValue >= 3) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return <HeartIcon className="w-5 h-5 text-red-400" />;
      case 'mental': return <Brain className="w-5 h-5 text-blue-400" />;
      case 'spiritual': return <BookOpenIcon className="w-5 h-5 text-purple-400" />;
      case 'relational': return <UsersIcon className="w-5 h-5 text-green-400" />;
      case 'financial': return <DollarSignIcon className="w-5 h-5 text-yellow-400" />;
      default: return <TargetIcon2 className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'from-red-400 to-red-600';
      case 'mental': return 'from-blue-400 to-blue-600';
      case 'spiritual': return 'from-purple-400 to-purple-600';
      case 'relational': return 'from-green-400 to-green-600';
      case 'financial': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const quickActions = [
    { name: 'Daily Check-in', href: '/daily', icon: Calendar, color: 'from-blue-400 to-blue-600' },
    { name: 'AI Analytics', href: '/analytics', icon: Brain, color: 'from-purple-400 to-pink-600' },
    { name: 'Track Progress', href: '/progress', icon: TrendingUpIcon, color: 'from-green-400 to-green-600' },
    { name: 'Set Goals', href: '/challenges', icon: Target, color: 'from-purple-400 to-purple-600' },
    { name: 'Workout Plan', href: '/workouts', icon: HeartIcon, color: 'from-red-400 to-red-600' },
    { name: 'Spiritual Growth', href: '/spiritual', icon: BookOpenIcon, color: 'from-indigo-400 to-indigo-600' },
    { name: 'Community', href: '/community', icon: UsersIcon, color: 'from-emerald-400 to-emerald-600' },
  ];

  if (!user) {
    return null;
  }

  const timeOfDay = getTimeOfDay();
  const keystoneHabit = getKeystoneHabit();
  const habitCompletion = getHabitCompletionPercentage();
  const currentStreak = getCurrentStreak();

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* 🎯 TOP ZONE: Daily Greeting & Keystone Focus */}
      <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-blue-400/30">
        <div className="text-center space-y-4">
          {/* Time-based Greeting */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            {timeOfDay.icon}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              {timeOfDay.greeting}, {user.full_name} {timeOfDay.emoji}
            </h1>
          </div>
          
          {/* Keystone Habit Spotlight */}
          {keystoneHabit && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <TargetIcon className="w-8 h-8 text-yellow-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Today&apos;s Keystone Focus</h2>
              </div>
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl p-4 border border-yellow-400/30">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{keystoneHabit.title}</h3>
                <p className="text-blue-200 text-sm sm:text-base mb-3">
                  This is your most important habit today. Complete it first to set the tone for success.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-yellow-400 font-semibold">🔥 {keystoneHabit.streak} day streak</span>
                  <Link
                    href="/daily"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all text-sm"
                  >
                    Start Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📊 MIDDLE ZONE: Progress Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Habit Completion Ring */}
        <div className="bg-gradient-to-br from-green-600/30 to-green-800/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-400/50 text-center">
          <h3 className="text-xl font-bold text-white mb-6">Today&apos;s Progress</h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            {/* Background Circle */}
            <div className="absolute inset-0 rounded-full border-8 border-white/20"></div>
            {/* Progress Circle */}
            <div 
              className="absolute inset-0 rounded-full border-8 border-transparent border-t-green-400 border-r-green-400 transition-all duration-1000 ease-out"
              style={{ 
                transform: `rotate(${habitCompletion * 3.6 - 90}deg)`,
                clipPath: habitCompletion >= 50 ? 'none' : 'polygon(50% 0%, 50% 50%, 100% 50%, 100% 100%, 0% 100%, 0% 0%)'
              }}
            ></div>
            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{habitCompletion}%</div>
                <div className="text-sm text-blue-200">Complete</div>
              </div>
            </div>
          </div>
          <p className="text-blue-200 text-sm">
            {habits.filter(h => h.completed).length} of {habits.length} habits done
          </p>
        </div>

        {/* Streak Flame */}
        <div className="bg-gradient-to-br from-orange-500/20 via-red-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-400/40 text-center">
          <h3 className="text-xl font-bold text-white mb-6">Current Streak</h3>
          <div className="relative w-36 h-36 mx-auto mb-4">
            {/* Perfect circle background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 to-red-500/20 border-4 border-orange-400/30"></div>
            
            {/* Background glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/10 to-red-500/10 blur-2xl"></div>
            
            {/* Main flame - perfectly centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Flame className="w-28 h-28 text-orange-400 drop-shadow-lg" />
            </div>
            
            {/* Streak number - perfectly centered circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-black/60 backdrop-blur-sm rounded-full border-2 border-white/40 shadow-2xl flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-white leading-none">{currentStreak}</div>
                <div className="text-xs font-semibold text-orange-200 uppercase tracking-wider">days</div>
              </div>
            </div>
          </div>
          
          {/* Motivational message */}
          <div className="bg-gradient-to-r from-orange-400/20 to-red-500/20 rounded-xl p-3 border border-orange-400/30">
            <p className="text-white font-semibold text-lg">Keep the fire burning! 🔥</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-purple-600/30 to-purple-800/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-400/50 text-center">
          <h3 className="text-xl font-bold text-white mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-blue-200 text-sm">Total Score</span>
              </div>
              <span className="text-white font-semibold">{user.totalScore || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-blue-200 text-sm">Active Goals</span>
              </div>
              <span className="text-white font-semibold">{goals.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-blue-200 text-sm">Check-ins</span>
              </div>
              <span className="text-white font-semibold">{user.dailyCheckins?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎨 MIDDLE ZONE: Life Dimensions Progress */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
          Life Dimensions Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: 'Physical', score: user.physicalScore || 0, color: 'from-red-400 to-red-600', icon: <HeartIcon className="w-5 h-5" /> },
            { name: 'Mental', score: user.mentalScore || 0, color: 'from-blue-400 to-blue-600', icon: <Brain className="w-5 h-5" /> },
            { name: 'Spiritual', score: user.spiritualScore || 0, color: 'from-purple-400 to-purple-600', icon: <BookOpenIcon className="w-5 h-5" /> },
            { name: 'Relational', score: user.relationalScore || 0, color: 'from-green-400 to-green-600', icon: <UsersIcon className="w-5 h-5" /> },
            { name: 'Financial', score: user.financialScore || 0, color: 'from-yellow-400 to-yellow-600', icon: <DollarSignIcon className="w-5 h-5" /> },
          ].map((dimension) => (
            <div key={dimension.name} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${dimension.color}`}>
                  {dimension.icon}
                </div>
              </div>
              <h4 className="text-white font-semibold text-sm mb-2">{dimension.name}</h4>
              <div className="text-2xl font-bold text-white mb-2">{dimension.score}</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${dimension.color} transition-all duration-1000`}
                  style={{ width: `${dimension.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/audit"
            className="inline-flex items-center px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all"
          >
            Take Life Audit
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 🚀 Quick Actions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center hover:bg-white/20 transition-all group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-medium text-sm leading-tight">{action.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* 🎭 BOTTOM ZONE: Reflection + AI Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Daily Reflection Widget */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Smile className="w-6 h-6 mr-3 text-green-400" />
            Daily Reflection
          </h3>
          
          {/* Mood Slider */}
          <div className="mb-6">
            <label className="block text-blue-200 text-sm mb-3">How are you feeling today?</label>
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 text-sm">😞</span>
              <span className="text-yellow-400 text-sm">😐</span>
              <span className="text-green-400 text-sm">😊</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex items-center justify-center mt-3">
              {getMoodIcon(mood)}
              <span className="ml-2 text-white font-semibold">
                {mood === 1 ? 'Terrible' : mood === 2 ? 'Bad' : mood === 3 ? 'Okay' : mood === 4 ? 'Good' : 'Excellent'}
              </span>
            </div>
          </div>

          {/* Mood Note */}
          <div className="mb-6">
            <label className="block text-blue-200 text-sm mb-3">Add a note (optional)</label>
            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="How was your day? What went well? What could be better?"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200/50 resize-none"
              rows={3}
            />
          </div>

          <button className="w-full bg-gradient-to-r from-green-400 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-green-300 hover:to-blue-500 transition-all">
            Save Reflection
          </button>
        </div>

        {/* AI Coach Tip */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Brain className="w-6 h-6 mr-3 text-purple-400" />
            AI Coach Tip of the Day
          </h3>
          
          {showAiTip ? (
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-400 to-pink-600">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm leading-relaxed">{aiTip}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAiTip(false)}
                  className="flex-1 px-4 py-2 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-all"
                >
                  Got it!
                </button>
                <button
                  onClick={generateAiTip}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-600 text-white font-medium rounded-lg hover:from-purple-300 hover:to-pink-500 transition-all"
                >
                  New Tip
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-blue-200 mb-6">Ready for today&apos;s personalized coaching tip?</p>
              <button
                onClick={() => setShowAiTip(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-300 hover:to-pink-500 transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get AI Tip
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🎯 Call to Action */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Today?</h3>
          <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
            Your journey to becoming the best version of yourself starts with small, consistent actions. 
            Choose your next step below.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/daily"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all"
            >
              Daily Check-in
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/habits"
              className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
            >
              Manage Habits
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
            >
              AI Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}





