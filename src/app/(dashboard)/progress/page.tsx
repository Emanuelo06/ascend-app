'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Zap,
  Heart,
  Brain,
  Eye,
  Users,
  DollarSign,
  Palette,
  BookOpen,
  ChevronUp,
  ChevronDown,
  Star,
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { LifeDimension } from '@/types';

interface ProgressData {
  dimension: LifeDimension;
  currentScore: number;
  previousScore: number;
  improvement: number;
  goal: number;
  activities: string[];
  nextSteps: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  achievedAt: string;
  icon: string;
  category: string;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'dimensions' | 'achievements' | 'insights'>('overview');
  const [selectedDimension, setSelectedDimension] = useState<LifeDimension>('physical');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const [progressData] = useState<Record<LifeDimension, ProgressData>>({
    physical: {
      dimension: 'physical',
      currentScore: 78,
      previousScore: 72,
      improvement: 8.3,
      goal: 85,
      activities: ['Morning workout', 'Evening walk', 'Healthy eating'],
      nextSteps: ['Increase workout intensity', 'Add strength training', 'Improve sleep quality']
    },
    mental: {
      dimension: 'mental',
      currentScore: 82,
      previousScore: 75,
      improvement: 9.3,
      goal: 88,
      activities: ['Daily reading', 'Meditation', 'Learning new skills'],
      nextSteps: ['Deepen meditation practice', 'Take advanced courses', 'Practice mindfulness']
    },
    spiritual: {
      dimension: 'spiritual',
      currentScore: 85,
      previousScore: 80,
      improvement: 6.3,
      goal: 90,
      activities: ['Daily prayer', 'Scripture study', 'Church attendance'],
      nextSteps: ['Increase prayer time', 'Join Bible study', 'Serve in ministry']
    },
    relational: {
      dimension: 'relational',
      currentScore: 76,
      previousScore: 70,
      improvement: 8.6,
      goal: 82,
      activities: ['Family time', 'Friend meetups', 'Community involvement'],
      nextSteps: ['Deepen existing relationships', 'Make new connections', 'Improve communication']
    },
    financial: {
      dimension: 'financial',
      currentScore: 68,
      previousScore: 62,
      improvement: 9.7,
      goal: 75,
      activities: ['Budget tracking', 'Saving goals', 'Investment research'],
      nextSteps: ['Increase savings rate', 'Diversify investments', 'Reduce expenses']
    },
    creative: {
      dimension: 'creative',
      currentScore: 71,
      previousScore: 65,
      improvement: 9.2,
      goal: 78,
      activities: ['Writing', 'Drawing', 'Music appreciation'],
      nextSteps: ['Take art classes', 'Join creative groups', 'Explore new mediums']
    },
    legacy: {
      dimension: 'legacy',
      currentScore: 73,
      previousScore: 67,
      improvement: 9.0,
      goal: 80,
      activities: ['Mentoring', 'Volunteering', 'Knowledge sharing'],
      nextSteps: ['Expand mentoring reach', 'Create lasting impact', 'Document wisdom']
    }
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: '7-Day Streak Master',
      description: 'Completed daily routines for 7 consecutive days',
      achievedAt: '2024-01-15',
      icon: '🔥',
      category: 'consistency'
    },
    {
      id: '2',
      title: 'Physical Pioneer',
      description: 'Improved physical dimension score by 10+ points',
      achievedAt: '2024-01-10',
      icon: '💪',
      category: 'physical'
    },
    {
      id: '3',
      title: 'Spiritual Growth',
      description: 'Maintained spiritual practices for 30 days',
      achievedAt: '2024-01-05',
      icon: '🙏',
      category: 'spiritual'
    },
    {
      id: '4',
      title: 'Community Builder',
      description: 'Helped 5+ community members achieve their goals',
      achievedAt: '2024-01-01',
      icon: '👥',
      category: 'relational'
    }
  ]);

  if (!user) {
    router.push('/login');
    return null;
  }

  const getDimensionIcon = (dimension: LifeDimension) => {
    const icons = {
      physical: '💪',
      mental: '🧠',
      spiritual: '🙏',
      relational: '👥',
      financial: '💰',
      creative: '🎨',
      legacy: '🌟'
    };
    return icons[dimension];
  };

  const getDimensionColor = (dimension: LifeDimension) => {
    const colors = {
      physical: 'from-green-400 to-emerald-500',
      mental: 'from-blue-400 to-cyan-500',
      spiritual: 'from-purple-400 to-pink-500',
      relational: 'from-yellow-400 to-orange-500',
      financial: 'from-emerald-400 to-teal-500',
      creative: 'from-pink-400 to-rose-500',
      legacy: 'from-indigo-400 to-purple-500'
    };
    return colors[dimension];
  };

  const overallScore = Object.values(progressData).reduce((sum, data) => sum + data.currentScore, 0) / 7;
  const overallImprovement = Object.values(progressData).reduce((sum, data) => sum + data.improvement, 0) / 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">Progress Tracking</h1>
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
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Overall Score</h3>
            <p className="text-3xl font-bold text-blue-400">{Math.round(overallScore)}/100</p>
            <p className="text-blue-200 text-sm">Life Balance</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Improvement</h3>
            <p className="text-3xl font-bold text-green-400">+{overallImprovement.toFixed(1)}%</p>
            <p className="text-blue-200 text-sm">This period</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-white font-semibold mb-2">Goals Set</h3>
            <p className="text-3xl font-bold text-yellow-400">7</p>
            <p className="text-blue-200 text-sm">Dimensions</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Achievements</h3>
            <p className="text-3xl font-bold text-purple-400">{achievements.length}</p>
            <p className="text-blue-200 text-sm">Earned</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('dimensions')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'dimensions'
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Dimensions
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 inline mr-2" />
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'insights'
                ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <Lightbulb className="w-4 h-4 inline mr-2" />
            AI Insights
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Time Range Selector */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1">
                {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      timeRange === range
                        ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension Overview Chart */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Life Dimensions Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(progressData).map(([key, data]) => (
                  <div key={key} className="text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${getDimensionColor(data.dimension)} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl`}>
                      {getDimensionIcon(data.dimension)}
                    </div>
                    <h4 className="text-white font-semibold mb-2 capitalize">{key}</h4>
                    <p className="text-2xl font-bold text-blue-400 mb-1">{data.currentScore}/100</p>
                    <div className="flex items-center justify-center space-x-1">
                      {data.improvement > 0 ? (
                        <ChevronUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-sm ${data.improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {data.improvement > 0 ? '+' : ''}{data.improvement.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Progress Timeline</h3>
              <div className="space-y-4">
                {Object.entries(progressData)
                  .sort(([, a], [, b]) => b.improvement - a.improvement)
                  .slice(0, 5)
                  .map(([key, data]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{getDimensionIcon(data.dimension)}</span>
                        <div>
                          <h4 className="text-white font-medium capitalize">{key}</h4>
                          <p className="text-blue-200 text-sm">Score: {data.currentScore}/100</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">+{data.improvement.toFixed(1)}%</p>
                        <p className="text-blue-200 text-sm">Improvement</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="space-y-8">
            {/* Dimension Selector */}
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(progressData).map((dimension) => (
                <button
                  key={dimension}
                  onClick={() => setSelectedDimension(dimension as LifeDimension)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedDimension === dimension
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                      : 'bg-white/10 text-blue-200 hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{getDimensionIcon(dimension as LifeDimension)}</span>
                  {dimension.charAt(0).toUpperCase() + dimension.slice(1)}
                </button>
              ))}
            </div>

            {/* Selected Dimension Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className={`w-24 h-24 bg-gradient-to-r ${getDimensionColor(selectedDimension)} rounded-full flex items-center justify-center mx-auto mb-4 text-4xl`}>
                  {getDimensionIcon(selectedDimension)}
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 capitalize">{selectedDimension}</h3>
                <p className="text-blue-200 text-lg">Current Score: {progressData[selectedDimension].currentScore}/100</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Improvement</h4>
                  <p className="text-2xl font-bold text-blue-400">+{progressData[selectedDimension].improvement.toFixed(1)}%</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-black" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Goal</h4>
                  <p className="text-2xl font-bold text-yellow-400">{progressData[selectedDimension].goal}/100</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Activities</h4>
                  <p className="text-2xl font-bold text-green-400">{progressData[selectedDimension].activities.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Current Activities
                  </h4>
                  <div className="space-y-2">
                    {progressData[selectedDimension].activities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-blue-200">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-yellow-400" />
                    Next Steps
                  </h4>
                  <div className="space-y-2">
                    {progressData[selectedDimension].nextSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <Target className="w-4 h-4 text-yellow-400" />
                        <span className="text-blue-200">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-white/5 rounded-xl p-6 border border-white/20 hover:bg-white/10 transition-all">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h4 className="text-white font-semibold text-lg">{achievement.title}</h4>
                    </div>
                    <p className="text-blue-200 text-center mb-4">{achievement.description}</p>
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-blue-200 capitalize">
                        {achievement.category}
                      </span>
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-blue-300 text-sm">Achieved on</p>
                      <p className="text-white font-medium">
                        {new Date(achievement.achievedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Progress */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Achievement Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-black" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Next Achievement</h4>
                  <p className="text-blue-200 mb-2">30-Day Consistency Master</p>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-yellow-400 text-sm mt-2">13/20 days completed</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Achievement Streak</h4>
                  <p className="text-blue-200 mb-2">Current streak: 3 achievements</p>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-purple-400 text-sm mt-2">3/4 achievements this month</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
                <Lightbulb className="w-6 h-6 mr-3 text-yellow-400" />
                AI-Powered Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Growth Patterns
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-blue-200 text-sm mb-2">Your strongest growth area:</p>
                      <p className="text-white font-medium">Financial Dimension (+9.7%)</p>
                      <p className="text-blue-200 text-xs mt-1">Consistent budget tracking and saving habits</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-blue-200 text-sm mb-2">Area needing attention:</p>
                      <p className="text-white font-medium">Creative Dimension (71/100)</p>
                      <p className="text-blue-200 text-xs mt-1">Consider exploring new creative outlets</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    Personalized Recommendations
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-blue-200 text-sm mb-2">Based on your patterns:</p>
                      <ul className="text-white text-sm space-y-1">
                        <li>• Morning routines boost your energy by 15%</li>
                        <li>• Spiritual practices improve mood consistency</li>
                        <li>• Community engagement enhances motivation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-400/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-purple-400 mb-3">Strategic Next Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="text-white font-medium mb-2">Focus on Creative</h5>
                    <p className="text-blue-200 text-sm">Dedicate 30 min daily to creative pursuits</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="text-white font-medium mb-2">Maintain Momentum</h5>
                    <p className="text-blue-200 text-sm">Keep up your excellent financial habits</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                    <h5 className="text-white font-medium mb-2">Expand Network</h5>
                    <p className="text-blue-200 text-sm">Connect with 2 new accountability partners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-lg rounded-full hover:from-green-500 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-2xl mr-4">
            Set New Goals
          </button>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold text-lg rounded-full hover:from-blue-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-2xl">
            Export Progress Report
          </button>
        </div>
      </div>
    </div>
  );
}
