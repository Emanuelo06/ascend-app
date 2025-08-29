'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  CalendarIcon, 
  ArrowLeftIcon, 
  CheckCircle, 
  Circle, 
  Clock, 
  TrendingUp, 
  Target, 
  Heart,
  Brain,
  Zap,
  BookOpen,
  Sun,
  Moon,
  Star,
  Trophy,
  BarChart3,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import { MORNING_ROUTINE_TEMPLATE, EVENING_REFLECTION_TEMPLATE } from '@/constants';

interface DailyProgress {
  morning_completed: boolean;
  evening_completed: boolean;
  streak_count: number;
  energy_level: number;
  mood_rating: number;
  gratitude_entries: string[];
  daily_wins: string[];
  growth_areas: string[];
  tomorrow_intentions: string[];
}

export default function DailyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({
    morning_completed: false,
    evening_completed: false,
    streak_count: 7,
    energy_level: 8,
    mood_rating: 8,
    gratitude_entries: ['Family support', 'Good health', 'New opportunities'],
    daily_wins: ['Completed morning routine', 'Had a productive meeting'],
    growth_areas: ['Need more patience', 'Could exercise more'],
    tomorrow_intentions: ['Start with prayer', 'Exercise before work']
  });

  const [morningRoutine, setMorningRoutine] = useState(MORNING_ROUTINE_TEMPLATE);
  const [eveningReflection, setEveningReflection] = useState(EVENING_REFLECTION_TEMPLATE);
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'progress'>('morning');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleRoutineComplete = (id: string, type: 'morning' | 'evening') => {
    if (type === 'morning') {
      setMorningRoutine(prev => 
        prev.map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );
    } else {
      setEveningReflection(prev => 
        prev.map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );
    }
  };

  const morningCompleted = morningRoutine.filter(item => item.completed).length;
  const eveningCompleted = eveningReflection.filter(item => item.completed).length;
  const totalMorningItems = morningRoutine.length;
  const totalEveningItems = eveningReflection.length;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Every step forward is progress, no matter how small.",
      "Your consistency today builds your success tomorrow.",
      "You're stronger than you think, more capable than you know.",
      "God's grace is sufficient for today's challenges.",
      "Focus on progress, not perfection."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">Daily Ascension</h1>
            </div>
            <button 
              onClick={() => router.push('/dashboard')} 
              className="text-blue-200 hover:text-white transition-colors flex items-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {getGreeting()}, {user.full_name}!
          </h2>
          <p className="text-blue-200 text-lg mb-4">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-yellow-400 text-lg font-medium">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-white font-semibold mb-2">Current Streak</h3>
            <p className="text-3xl font-bold text-yellow-400">{dailyProgress.streak_count}</p>
            <p className="text-blue-200 text-sm">days</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Morning Progress</h3>
            <p className="text-3xl font-bold text-green-400">{morningCompleted}/{totalMorningItems}</p>
            <p className="text-blue-200 text-sm">completed</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Energy Level</h3>
            <p className="text-3xl font-bold text-blue-400">{dailyProgress.energy_level}/10</p>
            <p className="text-blue-200 text-sm">feeling great!</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Mood Rating</h3>
            <p className="text-3xl font-bold text-purple-400">{dailyProgress.mood_rating}/10</p>
            <p className="text-blue-200 text-sm">positive vibes</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-8">
          <button
            onClick={() => setActiveTab('morning')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'morning'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4 inline mr-2" />
            Morning Routine
          </button>
          <button
            onClick={() => setActiveTab('evening')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'evening'
                ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4 inline mr-2" />
            Evening Reflection
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'progress'
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Daily Progress
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'morning' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <Sun className="w-6 h-6 mr-3 text-yellow-400" />
                Morning Ascension Protocol
              </h3>
              <div className="text-right">
                <p className="text-blue-200 text-sm">Progress</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {Math.round((morningCompleted / totalMorningItems) * 100)}%
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {morningRoutine.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.completed
                      ? 'bg-green-500/20 border-green-500/30'
                      : 'bg-white/5 border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleRoutineComplete(item.id, 'morning')}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          item.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-white/30 hover:border-white/50'
                        }`}
                      >
                        {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      <div>
                        <h4 className={`font-medium ${
                          item.completed ? 'text-green-200' : 'text-white'
                        }`}>
                          {item.name}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-blue-200">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.duration_minutes} min
                          </span>
                          <span className="capitalize">{item.category.replace('_', ' ')}</span>
                          {item.optional && (
                            <span className="text-yellow-400 text-xs">Optional</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {item.intensity_options && (
                      <select className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white text-sm">
                        {item.intensity_options.map((intensity) => (
                          <option key={intensity} value={intensity} className="bg-slate-800">
                            {intensity}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-xl">
              <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Today's Focus
              </h4>
              <p className="text-blue-200">
                Based on your recent progress, focus on <strong>mental priming</strong> today. 
                Your learning module will include content specifically tailored to your current goals.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'evening' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <Moon className="w-6 h-6 mr-3 text-blue-400" />
                Evening Reflection
              </h3>
              <div className="text-right">
                <p className="text-blue-200 text-sm">Progress</p>
                <p className="text-2xl font-bold text-blue-400">
                  {Math.round((eveningCompleted / totalEveningItems) * 100)}%
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {eveningReflection.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.completed
                      ? 'bg-blue-500/20 border-blue-500/30'
                      : 'bg-white/5 border-white/20'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => handleRoutineComplete(item.id, 'evening')}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${
                        item.completed
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-white/30 hover:border-white/50'
                      }`}
                    >
                      {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-medium mb-2 ${
                        item.completed ? 'text-blue-200' : 'text-white'
                      }`}>
                        {item.question}
                      </h4>
                      {item.completed && (
                        <textarea
                          placeholder="Write your reflection..."
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-blue-200 resize-none"
                          rows={3}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-400/10 to-cyan-500/10 border border-blue-400/20 rounded-xl">
              <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Reflection Tip
              </h4>
              <p className="text-blue-200">
                Take time to truly reflect on your answers. The depth of your reflection 
                directly correlates with your growth and self-awareness.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-green-400" />
              Today's Progress & Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gratitude Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-pink-400" />
                  Gratitude Entries
                </h4>
                <div className="space-y-2">
                  {dailyProgress.gratitude_entries.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-blue-200">{entry}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all">
                  Add Gratitude Entry
                </button>
              </div>

              {/* Daily Wins */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Daily Wins
                </h4>
                <div className="space-y-2">
                  {dailyProgress.daily_wins.map((win, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-blue-200">{win}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all">
                  Add Daily Win
                </button>
              </div>
            </div>

            {/* Growth Areas & Tomorrow's Intentions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-400" />
                  Growth Areas
                </h4>
                <div className="space-y-2">
                  {dailyProgress.growth_areas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <RefreshCw className="w-4 h-4 text-orange-400" />
                      <span className="text-blue-200">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-400" />
                  Tomorrow's Intentions
                </h4>
                <div className="space-y-2">
                  {dailyProgress.tomorrow_intentions.map((intention, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-200">{intention}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-400/10 to-pink-500/10 border border-purple-400/20 rounded-xl">
              <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                AI-Powered Insights
              </h4>
              <p className="text-blue-200 mb-3">
                Based on your daily patterns, here are personalized recommendations:
              </p>
              <ul className="text-blue-200 space-y-2">
                <li>• Your energy peaks in the morning - maximize your routine completion before 9 AM</li>
                <li>• Consider adding 5 minutes of meditation to your evening reflection</li>
                <li>• Your gratitude practice is strong - try sharing one entry with your accountability partner</li>
              </ul>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-full hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-2xl">
            Complete Today's Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
