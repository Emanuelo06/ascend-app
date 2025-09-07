'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Calendar,
  BarChart3,
  Lightbulb,
  Zap,
  Flame,
  Star,
  Activity,
  Eye,
  Settings,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Target as TargetIcon,
  Timer,
  Award,
  Users,
  Heart,
  BookOpen,
  Dumbbell,
  DollarSign
} from 'lucide-react';
import { Habit, HabitCheckin, HabitMetrics } from '@/types';
import EnhancedHabitAnalytics, { HabitAnalytics } from '@/lib/enhanced-habit-analytics';

interface HabitInsightsEngineProps {
  userId: string;
  habits: Habit[];
  checkins: HabitCheckin[];
  metrics: HabitMetrics[];
}

interface InsightCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  insights: Insight[];
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'opportunity' | 'achievement';
  priority: 'low' | 'medium' | 'high';
  actionItem: string;
  impact: number; // 1-10 scale
  confidence: number; // 0-1
}

export default function HabitInsightsEngine({ 
  userId, 
  habits, 
  checkins, 
  metrics 
}: HabitInsightsEngineProps) {
  const [analytics, setAnalytics] = useState<HabitAnalytics | null>(null);
  const [insightCategories, setInsightCategories] = useState<InsightCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('patterns');
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

  const analyticsService = EnhancedHabitAnalytics.getInstance();

  useEffect(() => {
    loadAnalytics();
  }, [userId, habits, checkins, metrics]);

  useEffect(() => {
    if (analytics) {
      generateInsights();
    }
  }, [analytics]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await analyticsService.generateAnalytics(userId, habits, checkins, metrics);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = () => {
    if (!analytics) return;

    const categories: InsightCategory[] = [
      {
        id: 'patterns',
        title: 'Behavior Patterns',
        description: 'Discover recurring patterns in your habit performance',
        icon: Brain,
        color: 'from-purple-500 to-blue-600',
        insights: generatePatternInsights()
      },
      {
        id: 'optimization',
        title: 'Optimization Opportunities',
        description: 'Identify areas where small changes can have big impacts',
        icon: Target,
        color: 'from-green-500 to-blue-600',
        insights: generateOptimizationInsights()
      },
      {
        id: 'achievements',
        title: 'Achievements & Milestones',
        description: 'Celebrate your progress and recognize your wins',
        icon: Award,
        color: 'from-yellow-500 to-orange-600',
        insights: generateAchievementInsights()
      },
      {
        id: 'challenges',
        title: 'Challenges & Solutions',
        description: 'Address obstacles and find solutions to improve consistency',
        icon: AlertTriangle,
        color: 'from-red-500 to-pink-600',
        insights: generateChallengeInsights()
      },
      {
        id: 'predictions',
        title: 'Future Predictions',
        description: 'AI-powered insights about your future habit performance',
        icon: TrendingUp,
        color: 'from-indigo-500 to-purple-600',
        insights: generatePredictionInsights()
      }
    ];

    setInsightCategories(categories);
  };

  const generatePatternInsights = (): Insight[] => {
    if (!analytics) return [];

    const insights: Insight[] = [];

    // Time-based patterns
    const morningHabits = habits.filter(h => h.moment === 'morning');
    const morningCompletion = analytics.overall.weeklyProgress;
    
    if (morningHabits.length > 0) {
      insights.push({
        id: 'morning-pattern',
        title: 'Morning Momentum',
        description: `You have ${morningHabits.length} morning habits with ${morningCompletion}% weekly completion rate.`,
        type: morningCompletion > 70 ? 'positive' : 'opportunity',
        priority: morningCompletion > 70 ? 'low' : 'medium',
        actionItem: morningCompletion > 70 
          ? 'Consider adding more morning habits to leverage this momentum'
          : 'Focus on completing your first habit of the day to build momentum',
        impact: 7,
        confidence: 0.85
      });
    }

    // Streak patterns
    const avgStreak = analytics.overall.averageStreak;
    if (avgStreak > 5) {
      insights.push({
        id: 'streak-pattern',
        title: 'Streak Master',
        description: `Your average streak of ${avgStreak} days shows excellent consistency.`,
        type: 'achievement',
        priority: 'low',
        actionItem: 'Maintain this momentum by focusing on habit quality over quantity',
        impact: 6,
        confidence: 0.9
      });
    }

    // Category performance
    const categoryBreakdown = analytics.overall.categoryBreakdown;
    const bestCategory = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (bestCategory) {
      insights.push({
        id: 'category-pattern',
        title: `${bestCategory[0]} Excellence`,
        description: `Your ${bestCategory[0]} habits are performing at ${bestCategory[1]}% completion rate.`,
        type: 'positive',
        priority: 'low',
        actionItem: `Apply strategies from ${bestCategory[0]} habits to other categories`,
        impact: 6,
        confidence: 0.8
      });
    }

    return insights;
  };

  const generateOptimizationInsights = (): Insight[] => {
    if (!analytics) return [];

    const insights: Insight[] = [];

    // Low-performing habits
    const lowPerformingHabits = habits.filter(h => {
      const habitMetrics = metrics.find(m => m.habitId === h.id);
      return habitMetrics && habitMetrics.ema30 < 0.5;
    });

    if (lowPerformingHabits.length > 0) {
      insights.push({
        id: 'low-performance',
        title: 'Optimization Opportunity',
        description: `${lowPerformingHabits.length} habits are performing below 50% completion rate.`,
        type: 'opportunity',
        priority: 'high',
        actionItem: 'Review and adjust these habits to improve consistency',
        impact: 8,
        confidence: 0.9
      });
    }

    // Habit timing optimization
    const timingInsights = analytics.recommendations.habitOptimization.slice(0, 2);
    timingInsights.forEach((optimization, index) => {
      insights.push({
        id: `timing-${index}`,
        title: `Timing Optimization: ${optimization.habitName}`,
        description: `Moving this habit could improve completion by ${optimization.estimatedImpact} points.`,
        type: 'opportunity',
        priority: 'medium',
        actionItem: `Consider adjusting the timing for ${optimization.habitName}`,
        impact: 7,
        confidence: optimization.confidence
      });
    });

    return insights;
  };

  const generateAchievementInsights = (): Insight[] => {
    if (!analytics) return [];

    const insights: Insight[] = [];

    // Streak achievements
    if (analytics.overall.currentStreak >= 7) {
      insights.push({
        id: 'week-streak',
        title: 'Week Warrior',
        description: `You've maintained a ${analytics.overall.currentStreak}-day streak!`,
        type: 'achievement',
        priority: 'low',
        actionItem: 'Keep up the great work and aim for your next milestone',
        impact: 5,
        confidence: 1.0
      });
    }

    if (analytics.overall.longestStreak >= 30) {
      insights.push({
        id: 'month-streak',
        title: 'Month Master',
        description: `Your longest streak of ${analytics.overall.longestStreak} days is impressive!`,
        type: 'achievement',
        priority: 'low',
        actionItem: 'You\'ve proven consistency - consider adding more challenging habits',
        impact: 6,
        confidence: 1.0
      });
    }

    // XP achievements
    if (analytics.overall.totalXP >= 1000) {
      insights.push({
        id: 'xp-milestone',
        title: 'XP Champion',
        description: `You've earned ${analytics.overall.totalXP} XP points!`,
        type: 'achievement',
        priority: 'low',
        actionItem: 'Great progress! Focus on quality habits to maximize XP gains',
        impact: 4,
        confidence: 1.0
      });
    }

    return insights;
  };

  const generateChallengeInsights = (): Insight[] => {
    if (!analytics) return [];

    const insights: Insight[] = [];

    // Consistency challenges
    if (analytics.overall.completionRate < 60) {
      insights.push({
        id: 'consistency-challenge',
        title: 'Consistency Challenge',
        description: `Your overall completion rate of ${analytics.overall.completionRate}% indicates room for improvement.`,
        type: 'warning',
        priority: 'high',
        actionItem: 'Start with just 1-2 core habits and build from there',
        impact: 9,
        confidence: 0.95
      });
    }

    // Habit overload
    if (habits.length > 8) {
      insights.push({
        id: 'habit-overload',
        title: 'Habit Overload',
        description: `You have ${habits.length} active habits, which might be overwhelming.`,
        type: 'warning',
        priority: 'medium',
        actionItem: 'Consider archiving or combining some habits to focus on core ones',
        impact: 7,
        confidence: 0.8
      });
    }

    // Weekend drop-off
    const weekendTrend = analytics.trends.weeklyTrends;
    if (weekendTrend.length > 0) {
      const lastWeek = weekendTrend[weekendTrend.length - 1];
      if (lastWeek.averageCompletionRate < 50) {
        insights.push({
          id: 'weekend-challenge',
          title: 'Weekend Consistency',
          description: 'Your habit completion tends to drop on weekends.',
          type: 'warning',
          priority: 'medium',
          actionItem: 'Adjust weekend habits to be more flexible and enjoyable',
          impact: 6,
          confidence: 0.75
        });
      }
    }

    return insights;
  };

  const generatePredictionInsights = (): Insight[] => {
    if (!analytics) return [];

    const insights: Insight[] = [];

    // Next week forecast
    const forecast = analytics.predictions.nextWeekForecast;
    if (forecast.predictedCompletionRate < 70) {
      insights.push({
        id: 'forecast-warning',
        title: 'Weekly Forecast',
        description: `Next week's predicted completion rate is ${forecast.predictedCompletionRate}%.`,
        type: 'warning',
        priority: 'medium',
        actionItem: forecast.recommendations[0] || 'Focus on your top 3 most important habits',
        impact: 6,
        confidence: forecast.confidence
      });
    }

    // Habit success predictions
    const successPredictions = analytics.predictions.habitSuccessProbability.slice(0, 3);
    successPredictions.forEach((prediction, index) => {
      if (prediction.successProbability < 60) {
        insights.push({
          id: `success-prediction-${index}`,
          title: `Success Prediction: ${prediction.habitName}`,
          description: `This habit has a ${prediction.successProbability}% success probability.`,
          type: 'warning',
          priority: 'medium',
          actionItem: 'Consider simplifying or adjusting this habit to improve success rate',
          impact: 6,
          confidence: prediction.confidence
        });
      }
    });

    return insights;
  };

  const toggleInsightExpansion = (insightId: string) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(insightId)) {
      newExpanded.delete(insightId);
    } else {
      newExpanded.add(insightId);
    }
    setExpandedInsights(newExpanded);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'opportunity': return <Target className="w-5 h-5 text-blue-400" />;
      case 'achievement': return <Award className="w-5 h-5 text-purple-400" />;
      default: return <Lightbulb className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'low': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-2 text-blue-200">Analyzing your habits...</span>
      </div>
    );
  }

  if (!analytics || insightCategories.length === 0) {
    return (
      <div className="text-center p-8">
        <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <p className="text-blue-200">No insights available yet. Complete some habits to generate insights.</p>
        <Button onClick={loadAnalytics} className="mt-4">Refresh Analysis</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Habit Insights Engine</h2>
          <p className="text-blue-200">AI-powered analysis of your habit patterns and recommendations</p>
        </div>
        <Button
          onClick={loadAnalytics}
          variant="outline"
          size="sm"
          className="border-blue-400/30 text-blue-200 hover:bg-blue-500/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      {/* Category Navigation */}
      <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 overflow-x-auto">
        {insightCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r ' + category.color + ' text-white border border-white/30'
                : 'text-blue-300 hover:text-blue-200 hover:bg-white/5'
            }`}
          >
            <category.icon className="w-4 h-4" />
            <span>{category.title}</span>
          </button>
        ))}
      </div>

      {/* Selected Category Content */}
      {insightCategories.map((category) => (
        selectedCategory === category.id && (
          <div key={category.id} className="space-y-4">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${category.color} mb-4`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
              <p className="text-blue-200">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {category.insights.map((insight) => (
                <Card 
                  key={insight.id} 
                  className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer ${
                    expandedInsights.has(insight.id) ? 'ring-2 ring-blue-400/50' : ''
                  }`}
                  onClick={() => toggleInsightExpansion(insight.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold text-sm">{insight.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)}`}>
                            {insight.priority} priority
                          </span>
                        </div>
                        
                        <p className="text-blue-200 text-sm mb-3">{insight.description}</p>
                        
                        {expandedInsights.has(insight.id) && (
                          <div className="space-y-3 pt-3 border-t border-white/10">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-blue-300">Impact Score</span>
                              <span className="text-white font-semibold">{insight.impact}/10</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-blue-300">Confidence</span>
                              <span className="text-white font-semibold">{Math.round(insight.confidence * 100)}%</span>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <p className="text-blue-200 text-sm font-medium mb-1">Action Item:</p>
                              <p className="text-white text-sm">{insight.actionItem}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {category.insights.length === 0 && (
              <div className="text-center py-8">
                <Lightbulb className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
                <p className="text-blue-300">No insights available for this category yet.</p>
                <p className="text-blue-200 text-sm">Complete more habits to generate insights.</p>
              </div>
            )}
          </div>
        )
      ))}

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
            Insights Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {insightCategories.reduce((sum, cat) => 
                  sum + cat.insights.filter(i => i.type === 'positive').length, 0
                )}
              </div>
              <div className="text-blue-200 text-sm">Positive Insights</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {insightCategories.reduce((sum, cat) => 
                  sum + cat.insights.filter(i => i.type === 'warning').length, 0
                )}
              </div>
              <div className="text-blue-200 text-sm">Warnings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {insightCategories.reduce((sum, cat) => 
                  sum + cat.insights.filter(i => i.type === 'opportunity').length, 0
                )}
              </div>
              <div className="text-blue-200 text-sm">Opportunities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {insightCategories.reduce((sum, cat) => 
                  sum + cat.insights.filter(i => i.type === 'achievement').length, 0
                )}
              </div>
              <div className="text-blue-200 text-sm">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
