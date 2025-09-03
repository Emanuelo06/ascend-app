'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Target,
  TrendingUp,
  Clock,
  Zap,
  Lightbulb,
  BarChart3,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Habit, HabitCheckin } from '@/types';

interface AIPersonalizationProps {
  habits: Habit[];
  checkins: HabitCheckin[];
}

interface AdaptiveSuggestion {
  id: string;
  habitId?: string;
  type: 'new_habit' | 'modify_habit' | 'timing_change' | 'difficulty_adjust';
  title: string;
  description: string;
  confidence: number;
  reasoning: string[];
  impact: 'high' | 'medium' | 'low';
  action?: string;
  applied: boolean;
}

interface DifficultyAdjustment {
  habitId: string;
  habitTitle: string;
  currentDifficulty: number;
  suggestedDifficulty: number;
  reason: string;
  confidence: number;
  applied: boolean;
}

interface PersonalizedCoaching {
  id: string;
  type: 'motivation' | 'strategy' | 'warning' | 'celebration';
  title: string;
  message: string;
  context: string;
  actionable: boolean;
  actions?: string[];
  priority: 'high' | 'medium' | 'low';
}

interface SmartSchedule {
  habitId: string;
  habitTitle: string;
  currentTime: string;
  optimalTime: string;
  reason: string;
  confidence: number;
  applied: boolean;
}

const AIPersonalization: React.FC<AIPersonalizationProps> = ({ habits, checkins }) => {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'difficulty' | 'coaching' | 'scheduling'>('suggestions');
  const [suggestions, setSuggestions] = useState<AdaptiveSuggestion[]>([]);
  const [difficultyAdjustments, setDifficultyAdjustments] = useState<DifficultyAdjustment[]>([]);
  const [coachingInsights, setCoachingInsights] = useState<PersonalizedCoaching[]>([]);
  const [smartSchedules, setSmartSchedules] = useState<SmartSchedule[]>([]);

  useEffect(() => {
    // Generate mock AI personalization data
    generateMockData();
  }, [habits, checkins]);

  const generateMockData = () => {
    // Mock adaptive suggestions
    const mockSuggestions: AdaptiveSuggestion[] = [
      {
        id: '1',
        type: 'new_habit',
        title: 'Add Evening Reflection',
        description: 'Based on your morning routine success, an evening reflection habit could help you process your day and prepare for tomorrow.',
        confidence: 0.87,
        reasoning: ['High morning routine completion rate', 'Evening time availability detected', 'Complementary to existing habits'],
        impact: 'high',
        action: 'Create Evening Reflection habit',
        applied: false
      },
      {
        id: '2',
        habitId: 'habit-1',
        type: 'modify_habit',
        title: 'Adjust Workout Timing',
        description: 'Your workout completion rate is 40% higher when done before 9 AM. Consider moving it earlier.',
        confidence: 0.92,
        reasoning: ['Pattern analysis shows morning success', 'Energy levels peak in early hours', 'Consistency improves with timing'],
        impact: 'medium',
        action: 'Move workout to 7:00 AM',
        applied: false
      }
    ];

    // Mock difficulty adjustments
    const mockDifficultyAdjustments: DifficultyAdjustment[] = [
      {
        habitId: 'habit-1',
        habitTitle: 'Morning Workout',
        currentDifficulty: 3,
        suggestedDifficulty: 4,
        reason: 'You\'ve consistently completed this habit for 3 weeks. Ready for a challenge!',
        confidence: 0.89,
        applied: false
      },
      {
        habitId: 'habit-2',
        habitTitle: 'Reading',
        currentDifficulty: 4,
        suggestedDifficulty: 3,
        reason: 'Recent struggles suggest this might be too challenging right now.',
        confidence: 0.76,
        applied: false
      }
    ];

    // Mock personalized coaching
    const mockCoaching: PersonalizedCoaching[] = [
      {
        id: '1',
        type: 'celebration',
        title: 'Amazing Week!',
        message: 'You\'ve hit your highest completion rate this month. Your consistency is building momentum!',
        context: 'Weekly performance review',
        actionable: false,
        priority: 'low'
      },
      {
        id: '2',
        type: 'strategy',
        title: 'Break Through Your Plateau',
        message: 'Try breaking your 30-minute workout into 3x 10-minute sessions throughout the day.',
        context: 'Workout habit analysis',
        actionable: true,
        actions: ['Split workout into micro-sessions', 'Set reminders for each session'],
        priority: 'medium'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Burnout Risk Detected',
        message: 'Your habit load has increased 40% this week. Consider reducing to maintain quality.',
        context: 'Habit load analysis',
        actionable: true,
        actions: ['Review habit priorities', 'Pause low-impact habits'],
        priority: 'high'
      }
    ];

    // Mock smart scheduling
    const mockSchedules: SmartSchedule[] = [
      {
        habitId: 'habit-1',
        habitTitle: 'Morning Workout',
        currentTime: '8:00 AM',
        optimalTime: '6:30 AM',
        reason: 'Your energy and completion rate peak 1.5 hours earlier',
        confidence: 0.91,
        applied: false
      },
      {
        habitId: 'habit-2',
        habitTitle: 'Reading',
        currentTime: '10:00 PM',
        optimalTime: '8:00 PM',
        reason: 'Evening reading has 60% higher completion rate',
        confidence: 0.78,
        applied: false
      }
    ];

    setSuggestions(mockSuggestions);
    setDifficultyAdjustments(mockDifficultyAdjustments);
    setCoachingInsights(mockCoaching);
    setSmartSchedules(mockSchedules);
  };

  const handleApplySuggestion = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === suggestionId ? { ...s, applied: true } : s)
    );
  };

  const handleApplyDifficultyAdjustment = (habitId: string) => {
    setDifficultyAdjustments(prev => 
      prev.map(d => d.habitId === habitId ? { ...d, applied: true } : d)
    );
  };

  const handleApplySchedule = (habitId: string) => {
    setSmartSchedules(prev => 
      prev.map(s => s.habitId === habitId ? { ...s, applied: true } : s)
    );
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const tabs = [
    { id: 'suggestions', label: 'Adaptive Suggestions', icon: Lightbulb },
    { id: 'difficulty', label: 'Difficulty Adjustment', icon: Target },
    { id: 'coaching', label: 'Personalized Coaching', icon: Brain },
    { id: 'scheduling', label: 'Smart Scheduling', icon: Clock }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI-Powered Personalization</h2>
          <p className="text-gray-300 mt-1">
            Intelligent insights that adapt to your behavior and optimize your habits
          </p>
        </div>
        <button
          onClick={generateMockData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh AI
        </button>
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
        {/* Adaptive Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <Lightbulb className="w-5 h-5" />
              <span className="font-medium">AI-Generated Habit Suggestions</span>
            </div>
            
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-6 rounded-xl border transition-all ${
                  suggestion.applied
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{suggestion.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact} impact
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">{suggestion.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Confidence:</span>
                        <span className={`font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Type:</span>
                        <span className="text-sm text-gray-300 capitalize">
                          {suggestion.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">AI Reasoning:</h4>
                      <ul className="space-y-1">
                        {suggestion.reasoning.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-blue-400 mt-1">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {!suggestion.applied && suggestion.action && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApplySuggestion(suggestion.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {suggestion.action}
                    </button>
                    <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                      Dismiss
                    </button>
                  </div>
                )}

                {suggestion.applied && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Applied successfully</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Difficulty Adjustment Tab */}
        {activeTab === 'difficulty' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <Target className="w-5 h-5" />
              <span className="font-medium">Dynamic Difficulty Adjustment</span>
            </div>
            
            {difficultyAdjustments.map((adjustment) => (
              <div
                key={adjustment.habitId}
                className={`p-6 rounded-xl border transition-all ${
                  adjustment.applied
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{adjustment.habitTitle}</h3>
                    <p className="text-gray-300 mb-3">{adjustment.reason}</p>
                    
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Current:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                                level <= adjustment.currentDifficulty
                                  ? 'bg-blue-500 border-blue-500 text-white'
                                  : 'border-gray-600 text-gray-400'
                              }`}
                            >
                              {level}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Suggested:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                                level <= adjustment.suggestedDifficulty
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-600 text-gray-400'
                              }`}
                            >
                              {level}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Confidence:</span>
                      <span className={`font-medium ${getConfidenceColor(adjustment.confidence)}`}>
                        {Math.round(adjustment.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {!adjustment.applied && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApplyDifficultyAdjustment(adjustment.habitId)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Apply Difficulty Change
                    </button>
                    <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                      Keep Current Level
                    </button>
                  </div>
                )}

                {adjustment.applied && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Difficulty adjusted successfully</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Personalized Coaching Tab */}
        {activeTab === 'coaching' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <Brain className="w-5 h-5" />
              <span className="font-medium">AI Coaching Insights</span>
            </div>
            
            {coachingInsights.map((insight) => (
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
                    </div>
                    <p className="text-gray-300 mb-3">{insight.message}</p>
                    
                    <div className="mb-4">
                      <span className="text-sm text-gray-400">Context: </span>
                      <span className="text-sm text-gray-300">{insight.context}</span>
                    </div>

                    {insight.actionable && insight.actions && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Actionable Steps:</h4>
                        <ul className="space-y-1">
                          {insight.actions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-blue-400 mt-1">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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

        {/* Smart Scheduling Tab */}
        {activeTab === 'scheduling' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Optimal Timing Recommendations</span>
            </div>
            
            {smartSchedules.map((schedule) => (
              <div
                key={schedule.habitId}
                className={`p-6 rounded-xl border transition-all ${
                  schedule.applied
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{schedule.habitTitle}</h3>
                    <p className="text-gray-300 mb-3">{schedule.reason}</p>
                    
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Current:</span>
                        <div className="px-3 py-1 bg-gray-700 text-white rounded-lg font-mono">
                          {schedule.currentTime}
                        </div>
                      </div>
                      
                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Optimal:</span>
                        <div className="px-3 py-1 bg-green-600 text-white rounded-lg font-mono">
                          {schedule.optimalTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Confidence:</span>
                      <span className={`font-medium ${getConfidenceColor(schedule.confidence)}`}>
                        {Math.round(schedule.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {!schedule.applied && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApplySchedule(schedule.habitId)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Apply New Time
                    </button>
                    <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                      Keep Current Time
                    </button>
                  </div>
                )}

                {schedule.applied && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Schedule updated successfully</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPersonalization;
