'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { databaseService } from '@/lib/supabase';
import { 
  TrendingUp, 
  Target, 
  Calendar,
  Award,
  Lightbulb, 
  CheckCircle, 
  AlertCircle,
  Clock,
  BarChart3,
  Activity,
  Zap,
  ArrowRight,
  RefreshCw,
  TrendingDown,
  Eye,
  Plus,
  Minus,
  Star,
  Flame
} from 'lucide-react';

interface WeeklySnapshot {
  id: string;
  week_start: string;
  week_end: string;
  completion_percentage: number;
  total_habits: number;
  completed_habits: number;
  current_streak: number;
  best_streak: number;
  avg_mood?: number;
  avg_energy?: number;
  best_moment?: string;
  worst_moment?: string;
  top_habits: string[];
  struggling_habits: string[];
  ai_summary?: string;
  ai_insights: any[];
}

interface HeatmapDay {
  date: string;
  completion_percentage: number;
  total_habits: number;
  completed_habits: number;
  partial_habits: number;
  missed_habits: number;
  mood_score?: number;
  energy_level?: number;
  notes?: string;
  status: 'excellent' | 'good' | 'partial' | 'poor';
}

interface Insight {
  id: string;
  insight_type: string;
  priority: string;
  title: string;
  description: string;
  evidence: string;
  suggested_action: string;
  action_type: string;
  action_data: any;
  is_applied: boolean;
  dismissed: boolean;
}

interface WeeklyFocus {
  id: string;
  focus_title: string;
  focus_description: string;
  focus_type: string;
  target_habits: string[];
  target_completion_rate: number;
  target_streak: number;
  current_progress: number;
  is_achieved: boolean;
  is_ai_generated: boolean;
}

interface HabitDetail {
  id: string;
  title: string;
  moment: string;
  completion_rate: number;
  current_streak: number;
  best_streak: number;
  last_checkin?: string;
}

export default function AnalyticsPage() {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showHabitDetails, setShowHabitDetails] = useState(false);
  
  // Data states
  const [weeklySnapshot, setWeeklySnapshot] = useState<WeeklySnapshot | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [weeklyFocus, setWeeklyFocus] = useState<WeeklyFocus | null>(null);
  const [habitDetails, setHabitDetails] = useState<HabitDetail[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadAnalyticsData();
    }
  }, [user?.id]);

  const loadAnalyticsData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadWeeklySnapshot(),
        loadHeatmapData(),
        loadInsights(),
        loadWeeklyFocus(),
        loadHabitDetails()
      ]);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklySnapshot = async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔄 Loading weekly snapshot for user:', user.id);
      
      // Load habits and check-ins for the past week
      const habits = await databaseService.getHabits(user.id);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      let totalCheckins = 0;
      let completedCheckins = 0;
      
      for (const habit of habits) {
        const checkins = await databaseService.getHabitCheckins(user.id, habit.id);
        const weekCheckins = checkins.filter(checkin => 
          new Date(checkin.date) >= weekAgo && new Date(checkin.date) <= today
        );
        
        totalCheckins += weekCheckins.length;
        completedCheckins += weekCheckins.filter(c => c.completed).length;
      }
      
      const completionRate = totalCheckins > 0 ? (completedCheckins / totalCheckins) * 100 : 0;
      
      const snapshot: WeeklySnapshot = {
        week_start: weekAgo.toISOString().split('T')[0],
        week_end: today.toISOString().split('T')[0],
        overall_completion: Math.round(completionRate),
        total_habits: habits.length,
        completed_habits: habits.filter(h => {
          // Check if habit was completed at least once this week
          return true; // TODO: Implement proper completion check
        }).length,
        current_streak: 0, // TODO: Calculate actual streak
        best_streak: 0, // TODO: Calculate best streak
        mood_trend: 'stable', // TODO: Calculate from user progress
        energy_trend: 'stable', // TODO: Calculate from user progress
        ai_summary: `You completed ${completedCheckins} out of ${totalCheckins} habit check-ins this week. Keep up the great work!`
      };
      
      setWeeklySnapshot(snapshot);
    } catch (error) {
      console.error('Error loading weekly snapshot:', error);
    }
  };

  const loadHeatmapData = async () => {
    try {
      const response = await fetch(`/api/analytics/progress-heatmap?userId=${user?.id}&period=30`);
      const data = await response.json();
      if (data.data) {
        setHeatmapData(data.data);
      }
    } catch (error) {
      console.error('Error loading heatmap data:', error);
    }
  };

  const loadInsights = async () => {
    try {
      const response = await fetch(`/api/analytics/insights?userId=${user?.id}&type=weekly&limit=5`);
      const data = await response.json();
      if (data.data) {
        setInsights(data.data);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const loadWeeklyFocus = async () => {
    try {
      const response = await fetch(`/api/analytics/weekly-focus?userId=${user?.id}`);
      const data = await response.json();
      if (data.data) {
        setWeeklyFocus(data.data);
      }
    } catch (error) {
      console.error('Error loading weekly focus:', error);
    }
  };

  const loadHabitDetails = async () => {
    try {
      const response = await fetch(`/api/habits?userId=${user?.id}`);
      const data = await response.json();
      if (data.data) {
        setHabitDetails(data.data);
      }
    } catch (error) {
      console.error('Error loading habit details:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadAnalyticsData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleApplyInsight = async (insightId: string) => {
    try {
      const response = await fetch('/api/analytics/insights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insightId,
          action: 'apply',
          userId: user?.id
        })
      });

      if (response.ok) {
        // Update local state
        setInsights(prev => prev.map(insight => 
          insight.id === insightId 
            ? { ...insight, is_applied: true }
            : insight
        ));
      }
    } catch (error) {
      console.error('Error applying insight:', error);
    }
  };

  const handleDismissInsight = async (insightId: string) => {
    try {
      const response = await fetch('/api/analytics/insights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insightId,
          action: 'dismiss',
          userId: user?.id
        })
      });

      if (response.ok) {
        // Remove from local state
        setInsights(prev => prev.filter(insight => insight.id !== insightId));
      }
    } catch (error) {
      console.error('Error dismissing insight:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'partial': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-white/10 rounded-xl"></div>
              <div className="h-64 bg-white/10 rounded-xl"></div>
              <div className="h-64 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Weekly Review & Analytics</h1>
            <p className="text-blue-200">Your complete habit progress dashboard with AI insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowHabitDetails(!showHabitDetails)}
              variant="ghost"
              className="text-blue-200 hover:text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showHabitDetails ? 'Hide' : 'Show'} Details
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Weekly Snapshot */}
        {weeklySnapshot && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-yellow-400" />
                Weekly Snapshot
              </h2>
              <div className="text-sm text-blue-200">
                {new Date(weeklySnapshot.week_start).toLocaleDateString()} - {new Date(weeklySnapshot.week_end).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {weeklySnapshot.completion_percentage}%
          </div>
                <div className="text-blue-200 text-sm">Completion Rate</div>
                <div className="text-xs text-gray-400 mt-1">
                  {weeklySnapshot.completed_habits}/{weeklySnapshot.total_habits} habits
        </div>
      </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1 flex items-center justify-center">
                  <Zap className="w-6 h-6 mr-1 text-orange-400" />
                  {weeklySnapshot.current_streak}
          </div>
                <div className="text-blue-200 text-sm">Current Streak</div>
                <div className="text-xs text-gray-400 mt-1">
                  Best: {weeklySnapshot.best_streak} days
        </div>
      </div>

              {weeklySnapshot.avg_mood && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {weeklySnapshot.avg_mood.toFixed(1)}
                  </div>
                  <div className="text-blue-200 text-sm">Avg Mood</div>
                  <div className="text-xs text-gray-400 mt-1">1-10 scale</div>
                </div>
              )}
                
              {weeklySnapshot.best_moment && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1 capitalize">
                    {weeklySnapshot.best_moment}
                  </div>
                  <div className="text-blue-200 text-sm">Best Moment</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {weeklySnapshot.worst_moment && `vs ${weeklySnapshot.worst_moment}`}
                  </div>
                </div>
              )}
            </div>

            {weeklySnapshot.ai_summary && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {weeklySnapshot.ai_summary}
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Progress Tracking & Analytics */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
              Progress Tracking & Analytics
            </h2>
            <div className="flex space-x-2">
              {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  variant={activeTab === tab ? 'default' : 'ghost'}
                  className={`capitalize ${
                    activeTab === tab 
                      ? 'bg-white/20 text-white' 
                      : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </Button>
              ))}
            </div>
                </div>
                
          {activeTab === 'daily' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Daily Heatmap (Last 30 Days)</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    <span className="text-blue-200">80%+</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span className="text-blue-200">60-79%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                    <span className="text-blue-200">30-59%</span>
                </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                    <span className="text-blue-200">&lt;30%</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {heatmapData.slice(-30).map((day, index) => (
                  <div
                    key={day.date}
                    onClick={() => setSelectedDay(selectedDay === day.date ? null : day.date)}
                    className={`aspect-square rounded ${getStatusColor(day.status)} opacity-80 hover:opacity-100 transition-all cursor-pointer ${
                      selectedDay === day.date ? 'ring-2 ring-white/50 scale-105' : ''
                    }`}
                    title={`${new Date(day.date).toLocaleDateString()}: ${day.completion_percentage}% (${day.completed_habits}/${day.total_habits})`}
                  />
                ))}
            </div>

              {/* Selected Day Details */}
              {selectedDay && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">
                      {new Date(selectedDay).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h4>
                    <Button
                      onClick={() => setSelectedDay(null)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {(() => {
                    const dayData = heatmapData.find(d => d.date === selectedDay);
                    if (!dayData) return null;
                  
                  return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white mb-1">
                            {dayData.completion_percentage}%
                            </div>
                          <div className="text-blue-200 text-sm">Completion Rate</div>
                          <div className="text-xs text-gray-400">
                            {dayData.completed_habits}/{dayData.total_habits} habits
                          </div>
                        </div>
                        
                        {dayData.mood_score && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                              {dayData.mood_score}/10
                            </div>
                            <div className="text-blue-200 text-sm">Mood Score</div>
                          </div>
                        )}
                        
                        {dayData.energy_level && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                              {dayData.energy_level}/10
                            </div>
                            <div className="text-blue-200 text-sm">Energy Level</div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {activeTab === 'weekly' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Weekly Trends</h3>
                {weeklySnapshot && (
                  <div className="text-sm text-blue-200">
                    Week of {new Date(weeklySnapshot.week_start).toLocaleDateString()}
                  </div>
                          )}
                        </div>
              
              {/* Weekly Bar Chart */}
              <div className="grid grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const dayData = heatmapData.filter(d => {
                    const date = new Date(d.date);
                    return date.getDay() === (index + 1) % 7;
                  });
                  const avgCompletion = dayData.length > 0 
                    ? Math.round(dayData.reduce((sum, d) => sum + d.completion_percentage, 0) / dayData.length)
                    : 0;
                  
                  return (
                    <div key={day} className="text-center">
                      <div className="text-blue-200 text-sm mb-2">{day}</div>
                      <div className={`h-16 rounded-lg flex items-end justify-center relative ${
                        avgCompletion >= 80 ? 'bg-green-500' :
                        avgCompletion >= 60 ? 'bg-blue-500' :
                        avgCompletion >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} style={{ height: `${Math.max(20, avgCompletion)}px` }}>
                        <span className="text-white text-xs font-semibold">{avgCompletion}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Weekly Analytics Summary */}
              {weeklySnapshot && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-white font-semibold">Best Day</span>
                    </div>
                    <div className="text-blue-200 text-sm">
                      {(() => {
                        const dayData = heatmapData.filter(d => {
                          const weekStart = new Date(weeklySnapshot.week_start);
                          const weekEnd = new Date(weeklySnapshot.week_end);
                          const date = new Date(d.date);
                          return date >= weekStart && date <= weekEnd;
                        });
                        const bestDay = dayData.reduce((best, current) => 
                          current.completion_percentage > best.completion_percentage ? current : best
                        );
                        return bestDay ? `${new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'long' })} (${bestDay.completion_percentage}%)` : 'No data';
                      })()}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center mb-2">
                      <TrendingDown className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="text-white font-semibold">Needs Attention</span>
                    </div>
                    <div className="text-blue-200 text-sm">
                      {(() => {
                        const dayData = heatmapData.filter(d => {
                          const weekStart = new Date(weeklySnapshot.week_start);
                          const weekEnd = new Date(weeklySnapshot.week_end);
                          const date = new Date(d.date);
                          return date >= weekStart && date <= weekEnd;
                        });
                        const worstDay = dayData.reduce((worst, current) => 
                          current.completion_percentage < worst.completion_percentage ? current : worst
                        );
                        return worstDay ? `${new Date(worstDay.date).toLocaleDateString('en-US', { weekday: 'long' })} (${worstDay.completion_percentage}%)` : 'No data';
                      })()}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center mb-2">
                      <Flame className="w-4 h-4 text-orange-400 mr-2" />
                      <span className="text-white font-semibold">Consistency</span>
                    </div>
                    <div className="text-blue-200 text-sm">
                      {(() => {
                        const dayData = heatmapData.filter(d => {
                          const weekStart = new Date(weeklySnapshot.week_start);
                          const weekEnd = new Date(weeklySnapshot.week_end);
                          const date = new Date(d.date);
                          return date >= weekStart && date <= weekEnd;
                        });
                        const consistentDays = dayData.filter(d => d.completion_percentage >= 70).length;
                        return `${consistentDays}/${dayData.length} days consistent`;
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'monthly' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Monthly Overview</h3>
              <div className="text-center text-blue-200">
                Monthly trend visualization coming soon...
              </div>
            </div>
          )}

          {/* Habit Details Section */}
          {showHabitDetails && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Habit Performance Details
              </h3>
              
              {habitDetails.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {habitDetails.map((habit) => (
                    <div key={habit.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-white font-semibold">{habit.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          habit.moment === 'morning' ? 'bg-yellow-500/20 text-yellow-400' :
                          habit.moment === 'midday' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {habit.moment}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200 text-sm">Completion Rate</span>
                          <span className="text-white font-semibold">{habit.completion_rate}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200 text-sm">Current Streak</span>
                          <div className="flex items-center">
                            <Flame className="w-3 h-3 text-orange-400 mr-1" />
                            <span className="text-white font-semibold">{habit.current_streak}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200 text-sm">Best Streak</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            <span className="text-white font-semibold">{habit.best_streak}</span>
                          </div>
                        </div>
                        
                        {habit.last_checkin && (
                          <div className="flex items-center justify-between">
                            <span className="text-blue-200 text-sm">Last Check-in</span>
                            <span className="text-gray-400 text-xs">
                              {new Date(habit.last_checkin).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-blue-200 py-8">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No habits found. Create some habits to see detailed analytics.</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Insights */}
        {insights.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center mb-6">
              <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
              AI Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((insight) => (
                <div key={insight.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)} bg-white/10`}>
                      {insight.priority}
                    </span>
                  </div>
                  
                  <p className="text-blue-200 text-sm mb-3">{insight.description}</p>
                
                  <div className="text-xs text-gray-400 mb-4">
                    <strong>Evidence:</strong> {insight.evidence}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApplyInsight(insight.id)}
                      disabled={insight.is_applied}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {insight.is_applied ? 'Applied' : 'Apply'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismissInsight(insight.id)}
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      Dismiss
                    </Button>
                  </div>
              </div>
              ))}
            </div>
          </Card>
        )}

        {/* Wins & Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
              <Award className="w-5 h-5 mr-2 text-green-400" />
              Wins
            </h2>
            <div className="space-y-3">
              {weeklySnapshot?.current_streak > 0 && (
                <div className="flex items-center text-green-400">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-sm">{weeklySnapshot.current_streak}-day streak!</span>
                </div>
              )}
              {weeklySnapshot?.completion_percentage >= 80 && (
                <div className="flex items-center text-green-400">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm">Excellent completion rate ({weeklySnapshot.completion_percentage}%)</span>
                </div>
              )}
              {weeklySnapshot?.best_moment && (
                <div className="flex items-center text-green-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Strong {weeklySnapshot.best_moment} routine</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
              Opportunities
            </h2>
            <div className="space-y-3">
              {weeklySnapshot?.worst_moment && (
                <div className="flex items-center text-yellow-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Optimize {weeklySnapshot.worst_moment} habits</span>
                </div>
              )}
              {weeklySnapshot?.struggling_habits && weeklySnapshot.struggling_habits.length > 0 && (
                <div className="flex items-center text-yellow-400">
                  <Activity className="w-4 h-4 mr-2" />
                  <span className="text-sm">{weeklySnapshot.struggling_habits.length} habit(s) need attention</span>
                </div>
              )}
              {weeklySnapshot?.completion_percentage < 70 && (
                <div className="flex items-center text-yellow-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm">Focus on consistency this week</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Forward Focus */}
        {weeklyFocus && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center mb-4">
              <Target className="w-6 h-6 mr-2 text-purple-400" />
              Forward Focus
            </h2>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">{weeklyFocus.focus_title}</h3>
              <p className="text-blue-200 text-sm mb-4">{weeklyFocus.focus_description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-200">
                  Target: {weeklyFocus.target_completion_rate}% completion rate
                </div>
                <Button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/30">
                  Plan Week
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}