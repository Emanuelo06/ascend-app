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
  Edit3
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

export default function DashboardPage() {
  const { user, updateUserData } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyRecommendations, setDailyRecommendations] = useState<DailyRecommendation[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
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
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return <Heart className="w-5 h-5 text-red-400" />;
      case 'mental': return <Brain className="w-5 h-5 text-blue-400" />;
      case 'spiritual': return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'relational': return <Users className="w-5 h-5 text-green-400" />;
      case 'financial': return <DollarSign className="w-5 h-5 text-yellow-400" />;
      default: return <Target className="w-5 h-5 text-gray-400" />;
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
    { name: 'Track Progress', href: '/progress', icon: TrendingUp, color: 'from-green-400 to-green-600' },
    { name: 'Set Goals', href: '/challenges', icon: Target, color: 'from-purple-400 to-purple-600' },
    { name: 'Workout Plan', href: '/workouts', icon: Heart, color: 'from-red-400 to-red-600' },
    { name: 'Spiritual Growth', href: '/spiritual', icon: BookOpen, color: 'from-indigo-400 to-indigo-600' },
    { name: 'Community', href: '/community', icon: Users, color: 'from-emerald-400 to-emerald-600' },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* Welcome Header */}
      <div className="text-center px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
          Welcome back, {user.full_name}! 👋
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
          Ready to continue your transformation journey? Let&apos;s make today count.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-3 sm:mb-4">
            <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Current Streak</h3>
          <div className="text-xl sm:text-3xl font-bold text-yellow-400">{user.streaks?.current || 0} days</div>
          <p className="text-blue-200 text-xs sm:text-sm">Keep it going!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-3 sm:mb-4">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Total Score</h3>
          <div className="text-xl sm:text-3xl font-bold text-blue-400">{user.totalScore || 0} pts</div>
          <p className="text-blue-200 text-xs sm:text-sm">Your journey progress</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-3 sm:mb-4">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Active Goals</h3>
          <div className="text-xl sm:text-3xl font-bold text-green-400">{goals.length}</div>
          <p className="text-blue-200 text-xs sm:text-sm">Goals in progress</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-3 sm:mb-4">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Check-ins</h3>
          <div className="text-xl sm:text-3xl font-bold text-purple-400">{user.dailyCheckins?.length || 0}</div>
          <p className="text-blue-200 text-xs sm:text-sm">Days tracked</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-4 border border-white/20 text-center hover:bg-white/20 transition-all group min-w-0"
            >
              <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r ${action.color} rounded-lg mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-white font-medium text-xs sm:text-sm leading-tight break-words">{action.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured: AI-Powered Insights */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-400/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-400 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white">AI-Powered Habit Insights</h3>
              <p className="text-purple-200 text-sm sm:text-base">Discover personalized recommendations and predictive analytics</p>
            </div>
          </div>
          <Link
            href="/analytics"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-400 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-300 hover:to-pink-500 transition-all text-sm sm:text-base whitespace-nowrap"
          >
            Explore AI Features
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-2" />
            <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">Adaptive Suggestions</h4>
            <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">AI learns from your behavior and suggests habit improvements</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mb-2" />
            <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">Smart Optimization</h4>
            <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">Automatically adjust difficulty and timing for maximum success</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 sm:col-span-2 lg:col-span-1">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-2" />
            <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">Predictive Analytics</h4>
            <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">Forecast future performance and identify potential risks</p>
          </div>
        </div>
      </div>

      {/* Habit Management & AI Suggestions */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-green-400/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white">Habit Management & AI Suggestions</h3>
              <p className="text-green-200 text-sm sm:text-base">Create, modify, and optimize your habits with AI-powered recommendations</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link
              href="/habits"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-400 to-blue-600 text-white font-semibold rounded-lg hover:from-green-300 hover:to-blue-500 transition-all text-sm sm:text-base whitespace-nowrap"
            >
              Manage Habits
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              href="/analytics?tab=ai-insights"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all text-sm sm:text-base whitespace-nowrap"
            >
              AI Insights
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mb-2" />
            <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">Create New Habits</h4>
            <p className="text-green-200 text-xs sm:text-sm leading-relaxed">Add new habits to your routine with guided setup and AI suggestions</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
            <Edit3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-2" />
            <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">Modify Existing</h4>
            <p className="text-green-200 text-xs sm:text-sm leading-relaxed">Adjust timing, difficulty, and frequency based on AI analysis</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 sm:col-span-2 lg:col-span-1">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-2" />
            <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">AI Recommendations</h4>
            <p className="text-green-200 text-xs sm:text-sm leading-relaxed">Get personalized habit suggestions based on your goals and patterns</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {['overview', 'goals', 'recommendations'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-yellow-400 text-black'
                : 'text-blue-200 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Today's Focus */}
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-yellow-400/30">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-400 flex-shrink-0" />
              <span className="break-words">Today&apos;s Focus</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="min-w-0">
                <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Primary Goal</h4>
                <p className="text-blue-200 text-sm sm:text-base leading-relaxed break-words">
                  {goals.length > 0 ? goals[0].title : 'Complete your daily check-in to set goals'}
                </p>
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Daily Habit</h4>
                <p className="text-blue-200 text-sm sm:text-base leading-relaxed">Morning prayer and reflection (10 min)</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-6">
              <Link
                href="/daily"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all text-sm sm:text-base"
              >
                Start Daily Check-in
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Life Dimensions</h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { name: 'Physical', score: user.physicalScore || 0, color: 'from-red-400 to-red-600' },
                  { name: 'Mental', score: user.mentalScore || 0, color: 'from-blue-400 to-blue-600' },
                  { name: 'Spiritual', score: user.spiritualScore || 0, color: 'from-purple-400 to-purple-600' },
                  { name: 'Relational', score: user.relationalScore || 0, color: 'from-green-400 to-green-600' },
                  { name: 'Financial', score: user.financialScore || 0, color: 'from-yellow-400 to-yellow-600' },
                ].map((dimension) => (
                  <div key={dimension.name} className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-white">{dimension.name}</span>
                      <span className="text-blue-200">{dimension.score}/100</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${dimension.color} transition-all duration-1000`}
                        style={{ width: `${dimension.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 sm:mt-6">
                <Link
                  href="/audit"
                  className="text-yellow-400 hover:text-yellow-300 text-xs sm:text-sm font-medium"
                >
                  Take Life Audit →
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Recent Activity</h3>
              {user.dailyCheckins && user.dailyCheckins.length > 0 ? (
                <div className="space-y-3">
                  {user.dailyCheckins.slice(-3).map((checkin: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-blue-200 text-xs sm:text-sm">Habit completed</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Target className="w-10 h-10 sm:w-12 sm:h-12 text-blue-200 mx-auto mb-3 sm:mb-4" />
                  <p className="text-blue-200 mb-3 sm:mb-4 text-sm sm:text-base">No habits tracked yet</p>
                  <Link
                    href="/daily"
                    className="inline-flex items-center px-3 sm:px-4 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition-all text-sm sm:text-base"
                  >
                    Start Your First Habit
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Your Goals</h3>
            <Link
              href="/challenges"
              className="inline-flex items-center px-4 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Link>
          </div>
          
          {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    {getCategoryIcon(goal.category)}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      goal.priority === 'high' ? 'bg-red-500/20 text-red-200' :
                      goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-200' :
                      'bg-green-500/20 text-green-200'
                    }`}>
                      {goal.priority} priority
                    </span>
                  </div>
                  
                  <h4 className="text-white font-semibold mb-2">{goal.title}</h4>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-200">Progress</span>
                      <span className="text-white">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(goal.category)} transition-all duration-1000`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-blue-200 text-sm">
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-blue-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Goals Set Yet</h3>
              <p className="text-blue-200 mb-6">Set your first goal to start your transformation journey</p>
              <Link
                href="/challenges"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all"
              >
                Set Your First Goal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Today's Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyRecommendations.map((rec, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(rec.category)}`}>
                    {getCategoryIcon(rec.category)}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rec.priority === 'high' ? 'bg-red-500/20 text-red-200' :
                    rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-200' :
                    'bg-green-500/20 text-green-200'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                
                <h4 className="text-white font-semibold mb-2">{rec.title}</h4>
                <p className="text-blue-200 text-sm mb-4">{rec.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">{rec.estimatedTime} min</span>
                  <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                    Start Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform?</h3>
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
              href="/challenges"
              className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
            >
              Set New Goals
            </Link>
            <Link
              href="/spiritual"
              className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
            >
              Spiritual Growth
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

