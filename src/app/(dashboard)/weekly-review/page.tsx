'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Trophy, 
  Lightbulb, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
  Brain,
  BookOpen
} from 'lucide-react';

interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  progress: number;
  topWins: string[];
  opportunities: string[];
  aiInsights: {
    content: string;
    action: string;
    microChallenge: string;
  }[];
  actionPlan: string[];
}

// Mock data for demo
const mockWeeklyData: WeeklyData = {
  weekStart: '2025-01-13',
  weekEnd: '2025-01-19',
  progress: 78,
  topWins: [
    'Morning Prayer - 6/7 days completed',
    'Hydration - Consistently hitting 2L daily',
    'Deep Work - 4/5 weekdays with 90min sessions'
  ],
  opportunities: [
    'Evening Reflection - Only 2/7 days completed',
    'Mindful Breaks - Often forgotten during busy periods',
    'Sleep Schedule - Inconsistent bedtime routine'
  ],
  aiInsights: [
    {
      content: 'You\'re most consistent in the morning. Your prayer habit has a strong foundation.',
      action: 'Move Evening Reflection to 8:30 PM',
      microChallenge: '3 days of evening gratitude'
    },
    {
      content: 'Your hydration habit is solid. Consider adding a midday reminder.',
      action: 'Set 2 PM hydration alert',
      microChallenge: 'Drink water before each meal'
    }
  ],
  actionPlan: [
    'Move Evening Reflection to 8:30 PM for better consistency',
    'Add midday hydration reminder at 2 PM',
    'Set consistent 10:30 PM bedtime alarm'
  ]
};

export default function WeeklyReviewPage() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData>(mockWeeklyData);
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);

  const getWeekRange = () => {
    const start = new Date(weeklyData.weekStart);
    const end = new Date(weeklyData.weekEnd);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleApplyInsight = (insightIndex: number) => {
    setSelectedInsight(insightIndex);
    // Here you would implement the actual action
    console.log('Applying insight:', weeklyData.aiInsights[insightIndex]);
  };

  const handleCompleteAction = (actionIndex: number) => {
    // Here you would mark the action as completed
    console.log('Completing action:', weeklyData.actionPlan[actionIndex]);
  };

  const getCurrentWeek = () => {
    const start = new Date(weeklyData.weekStart);
    const end = new Date(weeklyData.weekEnd);
    const startDay = start.getDay(); // 0 for Sunday, 6 for Saturday
    const endDay = end.getDay(); // 0 for Sunday, 6 for Saturday

    if (startDay === 0 && endDay === 6) {
      return `${start.getMonth() + 1}/${start.getDate()}`;
    }
    return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`;
  };

  const getWeekDateRange = () => {
    const start = new Date(weeklyData.weekStart);
    const end = new Date(weeklyData.weekEnd);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Weekly Review</h1>
              <p className="text-blue-200 text-lg">
                Reflect on your progress and plan for the week ahead
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                Week {getCurrentWeek()}
              </div>
              <div className="text-blue-200 text-sm">
                {getWeekDateRange()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Progress Overview */}
          <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Weekly Progress Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-green-500/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - 78 / 100)}`}
                      className="text-green-400 transition-all duration-500 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">78%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-400 mb-2">78%</div>
                <div className="text-blue-200">Completion Rate</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-blue-500/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - 65 / 100)}`}
                      className="text-blue-400 transition-all duration-500 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">65%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-400 mb-2">65%</div>
                <div className="text-blue-200">Consistency Score</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-yellow-500/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - 42 / 100)}`}
                      className="text-yellow-400 transition-all duration-500 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">42</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-400 mb-2">42</div>
                <div className="text-blue-200">Habits Completed</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-purple-500/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - 89 / 100)}`}
                      className="text-purple-400 transition-all duration-500 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">89%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-400 mb-2">89%</div>
                <div className="text-blue-200">Goal Achievement</div>
              </div>
            </div>
          </div>

          {/* Top Wins & Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Wins */}
            <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-2xl bg-green-500/20 mr-4">
                  <Trophy className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Top Wins</h3>
                  <p className="text-blue-200">Celebrating your achievements</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {weeklyData.topWins.map((win, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-500/10 to-green-500/5 backdrop-blur-sm rounded-2xl p-4 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-green-400 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{win}</h4>
                        <p className="text-green-200 text-sm">Achieved this week</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 text-xs">Impact: Positive</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/20 mr-4">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Growth Opportunities</h3>
                  <p className="text-blue-200">Areas to focus on next week</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {weeklyData.opportunities.map((opportunity, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{opportunity}</h4>
                        <p className="text-blue-200 text-sm">Potential for improvement</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Lightbulb className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300 text-xs">Potential: High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-2xl bg-purple-500/20 mr-4">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">AI Insights</h3>
                <p className="text-blue-200">Personalized recommendations based on your data</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {weeklyData.aiInsights.map((insight, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className={`p-2 rounded-xl ${insight.type === 'improvement' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                      {insight.type === 'improvement' ? (
                        <TrendingUp className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{insight.content}</h4>
                      <p className="text-purple-200 text-sm">Insight Type</p>
                    </div>
                  </div>
                  
                  <p className="text-blue-200 text-sm mb-4">{insight.content}</p>
                  
                  <div className="space-y-2">
                    {insight.action && (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-purple-200">Recommended Action: {insight.action}</span>
                      </div>
                    )}
                    {insight.microChallenge && (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-purple-200">Micro-Challenge: {insight.microChallenge}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-2xl bg-orange-500/20 mr-4">
                <Calendar className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Next Week&apos;s Action Plan</h3>
                <p className="text-blue-200">Specific steps to improve your habits</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {weeklyData.actionPlan.map((action, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-[1.02]">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center mb-3">
                      <span className="text-orange-400 font-bold text-xl">{index + 1}</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">{action}</h4>
                    <p className="text-orange-200 text-sm">Action for next week</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-orange-200">Priority: Medium</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Reflection */}
          <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-2xl bg-indigo-500/20 mr-4">
                <BookOpen className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Weekly Reflection</h3>
                <p className="text-blue-200">Take time to reflect on your journey</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-3">What went well?</h4>
                <textarea
                  placeholder="Reflect on your successes this week..."
                  className="w-full h-32 bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-blue-200/50 backdrop-blur-sm focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-200"
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-3">What could be improved?</h4>
                <textarea
                  placeholder="Think about areas for growth..."
                  className="w-full h-32 bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-blue-200/50 backdrop-blur-sm focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Save Reflection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
