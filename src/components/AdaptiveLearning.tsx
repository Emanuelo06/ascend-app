'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  BarChart3,
  Clock,
  Zap,
  Target,
  Activity,
  PieChart,
  LineChart,
  Calendar,
  Star,
  Award,
  Lightbulb,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Habit, HabitCheckin } from '@/types';

interface AdaptiveLearningProps {
  habits: Habit[];
  checkins: HabitCheckin[];
}

interface BehaviorPattern {
  id: string;
  habitId: string;
  habitTitle: string;
  pattern: string;
  confidence: number;
  frequency: string;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation: string;
  dataPoints: number;
}

interface LearningInsight {
  id: string;
  type: 'pattern_discovery' | 'optimization_opportunity' | 'risk_identification' | 'success_factor';
  title: string;
  description: string;
  evidence: string[];
  confidence: number;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface HabitOptimization {
  habitId: string;
  habitTitle: string;
  currentMetrics: {
    completionRate: number;
    averageEffort: number;
    consistency: number;
  };
  optimizedMetrics: {
    completionRate: number;
    averageEffort: number;
    consistency: number;
  };
  improvements: string[];
  implementation: string[];
}

const AdaptiveLearning: React.FC<AdaptiveLearningProps> = ({ habits, checkins }) => {
  const [activeTab, setActiveTab] = useState<'patterns' | 'insights' | 'optimization'>('patterns');
  const [behaviorPatterns, setBehaviorPatterns] = useState<BehaviorPattern[]>([]);
  const [learningInsights, setLearningInsights] = useState<LearningInsight[]>([]);
  const [habitOptimizations, setHabitOptimizations] = useState<HabitOptimization[]>([]);
  const [expandedPatterns, setExpandedPatterns] = useState<Set<string>>(new Set());
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  useEffect(() => {
    generateMockData();
  }, [habits, checkins]);

  const generateMockData = () => {
    // Mock behavior patterns
    const mockPatterns: BehaviorPattern[] = [
      {
        id: '1',
        habitId: 'habit-1',
        habitTitle: 'Morning Workout',
        pattern: 'Higher completion rate on weekdays (87%) vs weekends (45%)',
        confidence: 0.94,
        frequency: 'Consistent over 6 weeks',
        impact: 'positive',
        recommendation: 'Leverage weekday momentum to build weekend consistency',
        dataPoints: 42
      },
      {
        id: '2',
        habitId: 'habit-2',
        habitTitle: 'Reading',
        pattern: 'Reading after 9 PM has 70% lower completion rate',
        confidence: 0.89,
        frequency: 'Observed in 8 out of 10 attempts',
        impact: 'negative',
        recommendation: 'Move reading to earlier evening hours',
        dataPoints: 38
      },
      {
        id: '3',
        habitId: 'habit-3',
        habitTitle: 'Meditation',
        pattern: 'Shorter sessions (5-10 min) have 3x higher completion than longer ones',
        confidence: 0.91,
        frequency: 'Pattern consistent across 4 weeks',
        impact: 'positive',
        recommendation: 'Focus on consistent short sessions rather than occasional long ones',
        dataPoints: 35
      }
    ];

    // Mock learning insights
    const mockInsights: LearningInsight[] = [
      {
        id: '1',
        type: 'pattern_discovery',
        title: 'Energy Level Correlation',
        description: 'Your morning habits have a 40% higher success rate when preceded by 7+ hours of sleep.',
        evidence: ['Sleep data analysis', 'Habit completion correlation', 'Weekly pattern consistency'],
        confidence: 0.87,
        actionable: true,
        priority: 'high'
      },
      {
        id: '2',
        type: 'optimization_opportunity',
        title: 'Habit Stacking Potential',
        description: 'Combining your morning workout with post-workout reading increases both habit completion rates.',
        evidence: ['Habit pairing analysis', 'Completion rate improvement', 'Time efficiency gain'],
        confidence: 0.82,
        actionable: true,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'risk_identification',
        title: 'Burnout Warning Signs',
        description: 'Your habit load has increased 60% this month while completion rates dropped 25%.',
        evidence: ['Habit count increase', 'Completion rate decline', 'Consistency pattern change'],
        confidence: 0.78,
        actionable: true,
        priority: 'high'
      }
    ];

    // Mock habit optimizations
    const mockOptimizations: HabitOptimization[] = [
      {
        habitId: 'habit-1',
        habitTitle: 'Morning Workout',
        currentMetrics: {
          completionRate: 0.75,
          averageEffort: 0.68,
          consistency: 0.72
        },
        optimizedMetrics: {
          completionRate: 0.89,
          averageEffort: 0.82,
          consistency: 0.85
        },
        improvements: [
          'Move workout to 6:30 AM (peak energy window)',
          'Reduce initial duration to 20 minutes',
          'Add 5-minute warm-up routine'
        ],
        implementation: [
          'Gradually shift wake-up time by 15 minutes daily',
          'Create morning routine checklist',
          'Set up workout clothes the night before'
        ]
      },
      {
        habitId: 'habit-2',
        habitTitle: 'Reading',
        currentMetrics: {
          completionRate: 0.45,
          averageEffort: 0.58,
          consistency: 0.41
        },
        optimizedMetrics: {
          completionRate: 0.73,
          averageEffort: 0.71,
          consistency: 0.68
        },
        improvements: [
          'Schedule reading for 7:00 PM (optimal time)',
          'Start with 15-minute sessions',
          'Create dedicated reading environment'
        ],
        implementation: [
          'Set daily reminder for 7:00 PM',
          'Prepare reading space in advance',
          'Track reading progress with visual markers'
        ]
      }
    ];

    setBehaviorPatterns(mockPatterns);
    setLearningInsights(mockInsights);
    setHabitOptimizations(mockOptimizations);
  };

  const togglePatternExpansion = (patternId: string) => {
    setExpandedPatterns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(patternId)) {
        newSet.delete(patternId);
      } else {
        newSet.add(patternId);
      }
      return newSet;
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'negative': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'neutral': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pattern_discovery': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'optimization_opportunity': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'risk_identification': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'success_factor': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const tabs = [
    { id: 'patterns', label: 'Behavior Patterns', icon: Activity },
    { id: 'insights', label: 'Learning Insights', icon: Brain },
    { id: 'optimization', label: 'Habit Optimization', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Adaptive Learning Engine</h2>
          <p className="text-gray-300 mt-1">
            AI-powered behavior analysis and habit optimization
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
        {/* Behavior Patterns Tab */}
        {activeTab === 'patterns' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Behavior Pattern Recognition</span>
            </div>
            
            {behaviorPatterns.map((pattern) => (
              <div
                key={pattern.id}
                className="p-6 rounded-xl border bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{pattern.habitTitle}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(pattern.impact)}`}>
                        {pattern.impact} impact
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Confidence:</span>
                        <span className={`font-medium ${getConfidenceColor(pattern.confidence)}`}>
                          {Math.round(pattern.confidence * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Data Points:</span>
                        <span className="text-sm text-gray-300">{pattern.dataPoints}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Frequency:</span>
                        <span className="text-sm text-gray-300">{pattern.frequency}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-3">{pattern.pattern}</p>
                    
                    {expandedPatterns.has(pattern.id) && (
                      <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">AI Recommendation:</h4>
                        <p className="text-gray-300 text-sm">{pattern.recommendation}</p>
                        
                        {showAdvancedMetrics && (
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            <h5 className="text-xs font-medium text-gray-400 mb-2">Advanced Analysis:</h5>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-gray-400">Pattern Strength: </span>
                                <span className="text-gray-300">Strong</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Sample Size: </span>
                                <span className="text-gray-300">Sufficient</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Trend Direction: </span>
                                <span className="text-gray-300">Stable</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Outlier Count: </span>
                                <span className="text-gray-300">2</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePatternExpansion(pattern.id)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {expandedPatterns.has(pattern.id) ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show Details
                      </>
                    )}
                  </button>
                  <button className="px-3 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                    Apply Recommendation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Learning Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <Brain className="w-5 h-5" />
              <span className="font-medium">AI Learning Insights</span>
            </div>
            
            {learningInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-6 rounded-xl border transition-all ${
                  insight.priority === 'high'
                    ? 'bg-red-500/10 border-red-500/30'
                    : insight.priority === 'medium'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-green-500/10 border-green-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
                        {insight.priority} priority
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(insight.type)}`}>
                        {insight.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">{insight.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Supporting Evidence:</h4>
                      <ul className="space-y-1">
                        {insight.evidence.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-blue-400 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Confidence:</span>
                      <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {insight.actionable && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Take Action
                    </button>
                  )}
                  <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Habit Optimization Tab */}
        {activeTab === 'optimization' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <Target className="w-5 h-5" />
              <span className="font-medium">Habit Performance Optimization</span>
            </div>
            
            {habitOptimizations.map((optimization) => (
              <div
                key={optimization.habitId}
                className="p-6 rounded-xl border bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-4">{optimization.habitTitle}</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Current Metrics */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Current Performance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Completion Rate</span>
                        <span className="text-sm font-medium text-gray-300">
                          {Math.round(optimization.currentMetrics.completionRate * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Average Effort</span>
                        <span className="text-sm font-medium text-gray-300">
                          {Math.round(optimization.currentMetrics.averageEffort * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Consistency</span>
                        <span className="text-sm font-medium text-gray-300">
                          {Math.round(optimization.currentMetrics.consistency * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Optimized Metrics */}
                  <div>
                    <h4 className="text-sm font-medium text-green-400 mb-3">Optimized Performance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Completion Rate</span>
                        <span className="text-sm font-medium text-green-400">
                          {Math.round(optimization.optimizedMetrics.completionRate * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Average Effort</span>
                        <span className="text-sm font-medium text-green-400">
                          {Math.round(optimization.optimizedMetrics.averageEffort * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Consistency</span>
                        <span className="text-sm font-medium text-green-400">
                          {Math.round(optimization.optimizedMetrics.consistency * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Key Improvements */}
                  <div>
                    <h4 className="text-sm font-medium text-blue-400 mb-3">Key Improvements</h4>
                    <ul className="space-y-2">
                      {optimization.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-blue-400 mt-1">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Implementation Steps */}
                  <div>
                    <h4 className="text-sm font-medium text-green-400 mb-3">Implementation Steps</h4>
                    <ul className="space-y-2">
                      {optimization.implementation.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-green-400 mt-1">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-600">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Apply Optimization
                  </button>
                  <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                    Review Details
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

export default AdaptiveLearning;
