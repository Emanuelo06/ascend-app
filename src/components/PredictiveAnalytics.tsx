'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  BarChart3,
  Clock,
  Zap,
  Target,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  LineChart,
  PieChart,
  Activity,
  Target as TargetIcon
} from 'lucide-react';
import { Habit, HabitCheckin } from '@/types';

interface PredictiveAnalyticsProps {
  habits: Habit[];
  checkins: HabitCheckin[];
}

interface HabitForecast {
  habitId: string;
  habitTitle: string;
  currentTrend: 'improving' | 'declining' | 'stable';
  nextWeekPrediction: number;
  nextMonthPrediction: number;
  confidence: number;
  factors: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface GoalProjection {
  goalId: string;
  goalTitle: string;
  targetDate: Date;
  currentProgress: number;
  projectedCompletion: Date;
  onTrack: boolean;
  confidence: number;
  requiredActions: string[];
  riskFactors: string[];
}

interface RiskAssessment {
  habitId: string;
  habitTitle: string;
  riskType: 'burnout' | 'plateau' | 'consistency_drop' | 'overload';
  riskLevel: 'low' | 'medium' | 'high';
  probability: number;
  impact: 'low' | 'medium' | 'high';
  warningSigns: string[];
  mitigationStrategies: string[];
  timeframe: string;
}

interface SeasonalPrediction {
  habitId: string;
  habitTitle: string;
  seasonalPattern: 'summer_boost' | 'winter_dip' | 'spring_renewal' | 'fall_consistency';
  confidence: number;
  historicalData: {
    season: string;
    completionRate: number;
    averageEffort: number;
  }[];
  upcomingSeason: string;
  predictedPerformance: number;
  preparationTips: string[];
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ habits, checkins }) => {
  const [activeTab, setActiveTab] = useState<'forecasting' | 'goals' | 'risks' | 'seasonal'>('forecasting');
  const [habitForecasts, setHabitForecasts] = useState<HabitForecast[]>([]);
  const [goalProjections, setGoalProjections] = useState<GoalProjection[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [seasonalPredictions, setSeasonalPredictions] = useState<SeasonalPrediction[]>([]);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  useEffect(() => {
    generateMockData();
  }, [habits, checkins]);

  const generateMockData = () => {
    // Mock habit forecasts
    const mockForecasts: HabitForecast[] = [
      {
        habitId: 'habit-1',
        habitTitle: 'Morning Workout',
        currentTrend: 'improving',
        nextWeekPrediction: 0.85,
        nextMonthPrediction: 0.92,
        confidence: 0.87,
        factors: ['Consistent wake-up time', 'Prepared workout clothes', 'Positive momentum'],
        riskLevel: 'low',
        recommendations: [
          'Maintain current routine structure',
          'Gradually increase workout intensity',
          'Track energy levels for optimal timing'
        ]
      },
      {
        habitId: 'habit-2',
        habitTitle: 'Reading',
        currentTrend: 'declining',
        nextWeekPrediction: 0.35,
        nextMonthPrediction: 0.25,
        confidence: 0.78,
        factors: ['Evening fatigue', 'Competing priorities', 'Lack of dedicated time'],
        riskLevel: 'high',
        recommendations: [
          'Move reading to earlier evening hours',
          'Set specific reading goals',
          'Create distraction-free environment'
        ]
      },
      {
        habitId: 'habit-3',
        habitTitle: 'Meditation',
        currentTrend: 'stable',
        nextWeekPrediction: 0.68,
        nextMonthPrediction: 0.72,
        confidence: 0.82,
        factors: ['Consistent timing', 'Appropriate duration', 'Good environment'],
        riskLevel: 'medium',
        recommendations: [
          'Experiment with session length',
          'Try different meditation styles',
          'Track stress levels correlation'
        ]
      }
    ];

    // Mock goal projections
    const mockGoals: GoalProjection[] = [
      {
        goalId: 'goal-1',
        goalTitle: 'Complete 30-day workout streak',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        currentProgress: 0.67,
        projectedCompletion: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        onTrack: true,
        confidence: 0.89,
        requiredActions: [
          'Maintain current consistency',
          'Plan for weekend workouts',
          'Have backup workout options'
        ],
        riskFactors: ['Weekend schedule changes', 'Potential illness', 'Travel plans']
      },
      {
        goalId: 'goal-2',
        goalTitle: 'Read 12 books this year',
        targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        currentProgress: 0.42,
        projectedCompletion: new Date(Date.now() + 380 * 24 * 60 * 60 * 1000),
        onTrack: false,
        confidence: 0.65,
        requiredActions: [
          'Increase daily reading time',
          'Choose shorter books',
          'Set weekly reading targets'
        ],
        riskFactors: ['Work schedule changes', 'Competing priorities', 'Reading fatigue']
      }
    ];

    // Mock risk assessments
    const mockRisks: RiskAssessment[] = [
      {
        habitId: 'habit-1',
        habitTitle: 'Morning Workout',
        riskType: 'plateau',
        riskLevel: 'medium',
        probability: 0.45,
        impact: 'medium',
        warningSigns: [
          'Performance not improving',
          'Motivation starting to dip',
          'Routine feeling stale'
        ],
        mitigationStrategies: [
          'Introduce new exercises',
          'Set performance milestones',
          'Vary workout intensity'
        ],
        timeframe: '2-3 weeks'
      },
      {
        habitId: 'habit-2',
        habitTitle: 'Reading',
        riskType: 'consistency_drop',
        riskLevel: 'high',
        probability: 0.78,
        impact: 'high',
        warningSigns: [
          'Frequent missed sessions',
          'Decreasing page count',
          'Loss of interest'
        ],
        mitigationStrategies: [
          'Reduce reading goals temporarily',
          'Find more engaging content',
          'Join reading group for accountability'
        ],
        timeframe: '1-2 weeks'
      }
    ];

    // Mock seasonal predictions
    const mockSeasonal: SeasonalPrediction[] = [
      {
        habitId: 'habit-1',
        habitTitle: 'Morning Workout',
        seasonalPattern: 'summer_boost',
        confidence: 0.91,
        historicalData: [
          { season: 'Winter', completionRate: 0.72, averageEffort: 0.68 },
          { season: 'Spring', completionRate: 0.78, averageEffort: 0.75 },
          { season: 'Summer', completionRate: 0.89, averageEffort: 0.82 },
          { season: 'Fall', completionRate: 0.81, averageEffort: 0.76 }
        ],
        upcomingSeason: 'Summer',
        predictedPerformance: 0.89,
        preparationTips: [
          'Plan outdoor workout routes',
          'Adjust workout timing for heat',
          'Stay hydrated throughout the day'
        ]
      },
      {
        habitId: 'habit-2',
        habitTitle: 'Reading',
        seasonalPattern: 'winter_dip',
        confidence: 0.76,
        historicalData: [
          { season: 'Winter', completionRate: 0.45, averageEffort: 0.52 },
          { season: 'Spring', completionRate: 0.58, averageEffort: 0.61 },
          { season: 'Summer', completionRate: 0.62, averageEffort: 0.65 },
          { season: 'Fall', completionRate: 0.55, averageEffort: 0.58 }
        ],
        upcomingSeason: 'Winter',
        predictedPerformance: 0.45,
        preparationTips: [
          'Create cozy reading environment',
          'Set realistic winter reading goals',
          'Use reading as indoor activity'
        ]
      }
    ];

    setHabitForecasts(mockForecasts);
    setGoalProjections(mockGoals);
    setRiskAssessments(mockRisks);
    setSeasonalPredictions(mockSeasonal);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case 'declining': return <ArrowDownRight className="w-4 h-4 text-red-400" />;
      case 'stable': return <Minus className="w-4 h-4 text-yellow-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-400';
      case 'declining': return 'text-red-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const tabs = [
    { id: 'forecasting', label: 'Habit Forecasting', icon: TrendingUp },
    { id: 'goals', label: 'Goal Projections', icon: TargetIcon },
    { id: 'risks', label: 'Risk Assessment', icon: AlertTriangle },
    { id: 'seasonal', label: 'Seasonal Patterns', icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Predictive Analytics</h2>
          <p className="text-gray-300 mt-1">
            AI-powered forecasting and future habit planning
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600/50 transition-all"
          >
            {showAdvancedMetrics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAdvancedMetrics ? 'Hide' : 'Show'} Advanced
          </button>
          <button
            onClick={generateMockData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh AI
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {/* Habit Forecasting Tab */}
        {activeTab === 'forecasting' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Habit Performance Forecasting</span>
            </div>
            
            {habitForecasts.map((forecast) => (
              <div
                key={forecast.habitId}
                className="p-6 rounded-xl border bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{forecast.habitTitle}</h3>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(forecast.currentTrend)}
                        <span className={`text-sm font-medium ${getTrendColor(forecast.currentTrend)}`}>
                          {forecast.currentTrend}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(forecast.riskLevel)}`}>
                        {forecast.riskLevel} risk
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {Math.round(forecast.nextWeekPrediction * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Next Week</div>
                      </div>
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {Math.round(forecast.nextMonthPrediction * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Next Month</div>
                      </div>
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className={`text-2xl font-bold ${getConfidenceColor(forecast.confidence)}`}>
                          {Math.round(forecast.confidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Confidence</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Key Factors:</h4>
                      <ul className="space-y-1">
                        {forecast.factors.map((factor, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-blue-400 mt-1">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">AI Recommendations:</h4>
                      <ul className="space-y-1">
                        {forecast.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-green-400 mt-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Recommendations
                  </button>
                  <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                    View Detailed Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Goal Projections Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <TargetIcon className="w-5 h-5" />
              <span className="font-medium">Goal Achievement Projections</span>
            </div>
            
            {goalProjections.map((goal) => (
              <div
                key={goal.goalId}
                className={`p-6 rounded-xl border transition-all ${
                  goal.onTrack
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{goal.goalTitle}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        goal.onTrack ? 'bg-green-500/20 text-green-600 border-green-500/30' : 'bg-red-500/20 text-red-600 border-red-500/30'
                      }`}>
                        {goal.onTrack ? 'On Track' : 'At Risk'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {Math.round(goal.currentProgress * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Current Progress</div>
                      </div>
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {Math.round(goal.confidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Confidence</div>
                      </div>
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-gray-300">
                          {goal.projectedCompletion.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">Projected</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-2">Required Actions:</h4>
                        <ul className="space-y-1">
                          {goal.requiredActions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-green-400 mt-1">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-400 mb-2">Risk Factors:</h4>
                        <ul className="space-y-1">
                          {goal.riskFactors.map((risk, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-red-400 mt-1">•</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Update Progress
                  </button>
                  <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                    Adjust Goal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Risk Assessment Tab */}
        {activeTab === 'risks' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Risk Assessment & Mitigation</span>
            </div>
            
            {riskAssessments.map((risk) => (
              <div
                key={risk.habitId}
                className={`p-6 rounded-xl border transition-all ${
                  risk.riskLevel === 'high'
                    ? 'bg-red-500/10 border-red-500/30'
                    : risk.riskLevel === 'medium'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-green-500/10 border-green-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{risk.habitTitle}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(risk.riskLevel)}`}>
                        {risk.riskLevel} risk
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(risk.impact)}`}>
                        {risk.impact} impact
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-red-400">
                          {Math.round(risk.probability * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Probability</div>
                      </div>
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-gray-300">
                          {risk.timeframe}
                        </div>
                        <div className="text-xs text-gray-400">Timeframe</div>
                      </div>
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-gray-300 capitalize">
                          {risk.riskType.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-400">Risk Type</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-red-400 mb-2">Warning Signs:</h4>
                        <ul className="space-y-1">
                          {risk.warningSigns.map((sign, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-red-400 mt-1">•</span>
                              {sign}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-2">Mitigation Strategies:</h4>
                        <ul className="space-y-1">
                          {risk.mitigationStrategies.map((strategy, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-green-400 mt-1">•</span>
                              {strategy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Take Action
                  </button>
                  <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                    Dismiss Risk
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Seasonal Patterns Tab */}
        {activeTab === 'seasonal' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Seasonal Performance Patterns</span>
            </div>
            
            {seasonalPredictions.map((prediction) => (
              <div
                key={prediction.habitId}
                className="p-6 rounded-xl border bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{prediction.habitTitle}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-600 border-blue-500/30">
                        {prediction.seasonalPattern.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {Math.round(prediction.predictedPerformance * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Predicted Performance</div>
                      </div>
                      <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <div className={`text-2xl font-bold ${getConfidenceColor(prediction.confidence)}`}>
                          {Math.round(prediction.confidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Confidence</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Historical Performance:</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {prediction.historicalData.map((data, index) => (
                          <div key={index} className="text-center p-2 bg-gray-700/30 rounded">
                            <div className="text-sm font-medium text-gray-300">{data.season}</div>
                            <div className="text-xs text-gray-400">
                              {Math.round(data.completionRate * 100)}% | {Math.round(data.averageEffort * 100)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Preparation Tips for {prediction.upcomingSeason}:</h4>
                      <ul className="space-y-1">
                        {prediction.preparationTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-blue-400 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Plan for Season
                  </button>
                  <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                    View Seasonal Trends
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
