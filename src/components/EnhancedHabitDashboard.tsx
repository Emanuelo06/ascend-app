'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Zap, 
  Clock, 
  Calendar,
  Flame,
  Trophy,
  BarChart3,
  Activity,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Habit, HabitCheckin, HabitMetrics } from '@/types';
import EnhancedHabitAnalytics, { HabitAnalytics } from '@/lib/enhanced-habit-analytics';
import RealtimeHabitService, { RealtimeUpdate, RealtimeStats } from '@/lib/realtime-habit-service';

interface EnhancedHabitDashboardProps {
  userId: string;
  habits: Habit[];
  checkins: HabitCheckin[];
  metrics: HabitMetrics[];
}

export default function EnhancedHabitDashboard({ 
  userId, 
  habits, 
  checkins, 
  metrics 
}: EnhancedHabitDashboardProps) {
  const [analytics, setAnalytics] = useState<HabitAnalytics | null>(null);
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'predictions' | 'recommendations' | 'performance'>('overview');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const analyticsService = EnhancedHabitAnalytics.getInstance();
  const realtimeService = RealtimeHabitService.getInstance();

  useEffect(() => {
    loadAnalytics();
    loadRealtimeStats();
    setupRealtimeUpdates();
  }, [userId, habits, checkins, metrics]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await analyticsService.generateAnalytics(userId, habits, checkins, metrics);
      setAnalytics(analyticsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeStats = async () => {
    try {
      const stats = await realtimeService.getRealtimeStats(userId);
      setRealtimeStats(stats);
    } catch (error) {
      console.error('Error loading real-time stats:', error);
    }
  };

  const setupRealtimeUpdates = () => {
    const unsubscribe = realtimeService.subscribe(userId, (update: RealtimeUpdate) => {
      console.log('Real-time update received:', update);
      
      // Handle different types of updates
      switch (update.type) {
        case 'streak_updated':
          // Update streak display
          break;
        case 'checkin_recorded':
          // Refresh analytics
          loadAnalytics();
          break;
        case 'habit_created':
        case 'habit_updated':
        case 'habit_deleted':
          // Refresh data
          loadAnalytics();
          break;
      }
    });

    return unsubscribe;
  };

  const getTrendIcon = (value: number, previousValue: number) => {
    if (value > previousValue) return <ArrowUp className="w-4 h-4 text-green-400" />;
    if (value < previousValue) return <ArrowDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (value: number, previousValue: number) => {
    if (value > previousValue) return 'text-green-400';
    if (value < previousValue) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-2 text-blue-200">Loading analytics...</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-blue-200">Unable to load analytics. Please try again.</p>
        <Button onClick={loadAnalytics} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with real-time status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Enhanced Habit Analytics</h2>
          <p className="text-blue-200">Real-time insights and AI-powered recommendations</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${realtimeService.getConnectionStatus() ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-blue-200">
              {realtimeService.getConnectionStatus() ? 'Live' : 'Offline'}
            </span>
          </div>
          <Button
            onClick={loadAnalytics}
            variant="outline"
            size="sm"
            className="border-blue-400/30 text-blue-200 hover:bg-blue-500/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-right">
        <span className="text-xs text-blue-300">
          Last updated: {formatTimeAgo(lastUpdate)}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'trends', label: 'Trends', icon: TrendingUp },
          { id: 'predictions', label: 'Predictions', icon: Brain },
          { id: 'recommendations', label: 'AI Tips', icon: Lightbulb },
          { id: 'performance', label: 'Performance', icon: Activity }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                : 'text-blue-300 hover:text-blue-200 hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab analytics={analytics} realtimeStats={realtimeStats} />
      )}
      
      {activeTab === 'trends' && (
        <TrendsTab analytics={analytics} />
      )}
      
      {activeTab === 'predictions' && (
        <PredictionsTab analytics={analytics} />
      )}
      
      {activeTab === 'recommendations' && (
        <RecommendationsTab analytics={analytics} />
      )}
      
      {activeTab === 'performance' && (
        <PerformanceTab analytics={analytics} />
      )}
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ analytics, realtimeStats }: { analytics: HabitAnalytics; realtimeStats: RealtimeStats | null }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Habits"
          value={analytics.overall.totalHabits}
          icon={Target}
          color="from-blue-500 to-blue-600"
          trend={realtimeStats ? realtimeStats.totalHabits - analytics.overall.totalHabits : 0}
        />
        <MetricCard
          title="Completion Rate"
          value={`${analytics.overall.completionRate}%`}
          icon={CheckCircle}
          color="from-green-500 to-green-600"
          trend={0} // Would calculate from previous data
        />
        <MetricCard
          title="Current Streak"
          value={analytics.overall.currentStreak}
          icon={Flame}
          color="from-orange-500 to-orange-600"
          trend={0} // Would calculate from previous data
        />
        <MetricCard
          title="Total XP"
          value={analytics.overall.totalXP}
          icon={Trophy}
          color="from-purple-500 to-purple-600"
          trend={0} // Would calculate from previous data
        />
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-200">This Week</span>
                <span className="text-white font-semibold">{analytics.overall.weeklyProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${analytics.overall.weeklyProgress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-400" />
              Monthly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-200">This Month</span>
                <span className="text-white font-semibold">{analytics.overall.monthlyProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                  style={{ width: `${analytics.overall.monthlyProgress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-blue-600/20 border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-purple-400" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {analytics.overall.averageStreak}
              </div>
              <div className="text-blue-200 text-sm">Average Streak</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {analytics.overall.longestStreak}
              </div>
              <div className="text-blue-200 text-sm">Longest Streak</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {analytics.overall.activeHabits}
              </div>
              <div className="text-blue-200 text-sm">Active Habits</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Trends Tab Component
function TrendsTab({ analytics }: { analytics: HabitAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Daily Trends */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
            Daily Trends (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end space-x-1">
            {analytics.trends.dailyTrends.slice(-14).map((trend, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-t transition-all duration-500"
                  style={{ height: `${trend.completionRate}%` }}
                ></div>
                <div className="text-xs text-blue-200 mt-2 transform -rotate-45 origin-left">
                  {new Date(trend.date).getDate()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-400" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.trends.weeklyTrends.slice(-4).map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">
                    Week {index + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">
                      {trend.averageCompletionRate}%
                    </span>
                    <div className="w-16 bg-white/20 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        style={{ width: `${trend.averageCompletionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Seasonal Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.trends.seasonalPatterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">{pattern.season}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">
                      {pattern.averageCompletionRate}%
                    </span>
                    <div className="w-16 bg-white/20 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                        style={{ width: `${pattern.averageCompletionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Predictions Tab Component
function PredictionsTab({ analytics }: { analytics: HabitAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Next Week Forecast */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-blue-600/20 border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            Next Week Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-white mb-2">
              {analytics.predictions.nextWeekForecast.predictedCompletionRate}%
            </div>
              <div className="text-blue-200">Predicted Completion Rate</div>
              <div className="text-sm text-purple-200 mt-2">
                Confidence: {Math.round(analytics.predictions.nextWeekForecast.confidence * 100)}%
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Key Factors</h4>
              <ul className="space-y-1">
                {analytics.predictions.nextWeekForecast.factors.map((factor, index) => (
                  <li key={index} className="text-blue-200 text-sm flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {analytics.predictions.nextWeekForecast.recommendations.map((rec, index) => (
                  <li key={index} className="text-blue-200 text-sm flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habit Success Predictions */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-400" />
            Habit Success Probability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.predictions.habitSuccessProbability.slice(0, 5).map((prediction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <div className="text-white font-medium">{prediction.habitName}</div>
                  <div className="text-blue-200 text-sm">
                    Confidence: {Math.round(prediction.confidence * 100)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {prediction.successProbability}%
                  </div>
                  <div className="text-blue-200 text-sm">Success Rate</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Recommendations Tab Component
function RecommendationsTab({ analytics }: { analytics: HabitAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Habit Optimizations */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Habit Optimizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recommendations.habitOptimization.slice(0, 3).map((optimization, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">{optimization.habitName}</h4>
                  <div className="text-right">
                    <div className="text-sm text-blue-200">Current: {optimization.currentScore}</div>
                    <div className="text-lg font-bold text-green-400">→ {optimization.potentialScore}</div>
                  </div>
                </div>
                <div className="text-blue-200 text-sm mb-3">
                  Estimated Impact: +{optimization.estimatedImpact} points
                </div>
                <div className="space-y-1">
                  {optimization.improvements.map((improvement, impIndex) => (
                    <div key={impIndex} className="text-blue-200 text-sm flex items-center">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      {improvement}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Habit Suggestions */}
      <Card className="bg-gradient-to-r from-green-500/20 to-blue-600/20 border-green-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-green-400" />
            AI-Suggested New Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.recommendations.newHabitSuggestions.map((suggestion, index) => (
              <div key={index} className="p-4 bg-white/10 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{suggestion.title}</h4>
                    <div className="text-blue-200 text-sm mb-2">{suggestion.reasoning}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-200">Confidence</div>
                    <div className="text-lg font-bold text-green-400">
                      {Math.round(suggestion.confidence * 100)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-blue-200 mb-3">
                  <span>Difficulty: {suggestion.difficulty}/3</span>
                  <span>Time: {suggestion.estimatedTime}m</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-400 hover:to-blue-500">
                  Add This Habit
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivation Tips */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-purple-400" />
            Motivation Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recommendations.motivationTips.map((tip, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                tip.type === 'encouragement' ? 'border-green-400 bg-green-500/10' :
                tip.type === 'challenge' ? 'border-yellow-400 bg-yellow-500/10' :
                tip.type === 'insight' ? 'border-blue-400 bg-blue-500/10' :
                'border-purple-400 bg-purple-500/10'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    tip.type === 'encouragement' ? 'bg-green-500/20' :
                    tip.type === 'challenge' ? 'bg-yellow-500/20' :
                    tip.type === 'insight' ? 'bg-blue-500/20' :
                    'bg-purple-500/20'
                  }`}>
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white mb-2">{tip.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">{tip.actionItem}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tip.urgency === 'high' ? 'bg-red-500/20 text-red-200' :
                        tip.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-200' :
                        'bg-green-500/20 text-green-200'
                      }`}>
                        {tip.urgency} priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Performance Tab Component
function PerformanceTab({ analytics }: { analytics: HabitAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Consistency"
          value={`${analytics.performance.consistency.overallConsistency}%`}
          icon={CheckCircle}
          color="from-green-500 to-green-600"
          trend={0}
        />
        <MetricCard
          title="Efficiency"
          value={`${analytics.performance.efficiency.optimizationScore}%`}
          icon={Zap}
          color="from-blue-500 to-blue-600"
          trend={0}
        />
        <MetricCard
          title="Growth"
          value={`${analytics.performance.growth.personalDevelopment}%`}
          icon={TrendingUp}
          color="from-purple-500 to-purple-600"
          trend={0}
        />
        <MetricCard
          title="Engagement"
          value={`${analytics.performance.engagement.learningEngagement}%`}
          icon={Activity}
          color="from-orange-500 to-orange-600"
          trend={0}
        />
      </div>

      {/* Detailed Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
              Consistency Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.performance.consistency).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">{value}%</span>
                    <div className="w-20 bg-white/20 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-400" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.performance.engagement).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">{value}%</span>
                    <div className="w-20 bg-white/20 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string; 
  trend: number; 
}) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {trend !== 0 && (
          <div className="flex items-center mt-2">
            {trend > 0 ? (
              <ArrowUp className="w-4 h-4 text-green-400 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-400 mr-1" />
            )}
            <span className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Math.abs(trend)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
