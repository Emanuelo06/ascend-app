'use client';

import { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';

interface HabitPattern {
  id: string;
  name: string;
  successRate: number;
  optimalTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  failurePatterns: string[];
  recommendations: string[];
  riskScore: number;
}

interface NeuralInsight {
  type: 'pattern' | 'optimization' | 'prediction' | 'risk';
  title: string;
  description: string;
  confidence: number;
  action: string;
  priority: 'low' | 'medium' | 'high';
}

export default function NeuralHabitEngine() {
  const [patterns, setPatterns] = useState<HabitPattern[]>([]);
  const [insights, setInsights] = useState<NeuralInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<HabitPattern | null>(null);

  useEffect(() => {
    loadNeuralData();
  }, []);

  const loadNeuralData = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockPatterns: HabitPattern[] = [
      {
        id: '1',
        name: 'Morning Prayer',
        successRate: 87,
        optimalTime: '6:00 AM',
        difficulty: 'easy',
        failurePatterns: ['Weekend inconsistency', 'Travel disruption'],
        recommendations: ['Set weekend-specific reminders', 'Create travel routine'],
        riskScore: 23
      },
      {
        id: '2',
        name: '30-Minute Workout',
        successRate: 64,
        optimalTime: '5:30 PM',
        difficulty: 'medium',
        failurePatterns: ['Work stress', 'Energy depletion'],
        recommendations: ['Pre-workout energy boost', 'Stress management techniques'],
        riskScore: 41
      },
      {
        id: '3',
        name: 'Reading',
        successRate: 92,
        optimalTime: '8:00 PM',
        difficulty: 'easy',
        failurePatterns: ['Late night fatigue'],
        recommendations: ['Earlier bedtime routine', 'Reading time adjustment'],
        riskScore: 18
      }
    ];

    const mockInsights: NeuralInsight[] = [
      {
        type: 'pattern',
        title: 'Weekend Habit Vulnerability',
        description: 'Your morning habits are 34% less likely to succeed on weekends',
        confidence: 89,
        action: 'Implement weekend-specific strategies',
        priority: 'high'
      },
      {
        type: 'optimization',
        title: 'Optimal Workout Timing',
        description: 'Moving your workout to 6:00 PM increases success rate by 23%',
        confidence: 76,
        action: 'Adjust workout schedule',
        priority: 'medium'
      },
      {
        type: 'prediction',
        title: 'Holiday Season Risk',
        description: 'Predicted 28% decrease in habit consistency during holiday season',
        confidence: 82,
        action: 'Create holiday maintenance plan',
        priority: 'high'
      }
    ];

    setPatterns(mockPatterns);
    setInsights(mockInsights);
    setIsAnalyzing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <Target className="w-5 h-5" />;
      case 'optimization': return <Zap className="w-5 h-5" />;
      case 'prediction': return <TrendingUp className="w-5 h-5" />;
      case 'risk': return <AlertTriangle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Neural Engine Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Neural Habit Engine</h2>
            <p className="text-purple-200">Advanced AI-powered habit pattern recognition and optimization</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">87%</div>
                <div className="text-green-200 text-sm">Pattern Accuracy</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">23</div>
                <div className="text-yellow-200 text-sm">Optimizations</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">+34%</div>
                <div className="text-blue-200 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Brain className="w-6 h-6 mr-2 text-purple-400" />
          Neural Insights
        </h3>
        
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-blue-200">Analyzing habit patterns with AI...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-400/20">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getPriorityColor(insight.priority)}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{insight.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        insight.priority === 'high' ? 'bg-red-500/20 text-red-200' :
                        insight.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-200' :
                        'bg-green-500/20 text-green-200'
                      }`}>
                        {insight.priority} priority
                      </span>
                    </div>
                    <p className="text-blue-200 text-sm mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200 text-sm">Confidence: {insight.confidence}%</span>
                      <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                        {insight.action} →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Habit Patterns */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Habit Pattern Analysis</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {patterns.map((pattern) => (
            <div 
              key={pattern.id}
              onClick={() => setSelectedPattern(pattern)}
              className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20 cursor-pointer hover:border-blue-400/40 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">{pattern.name}</h4>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  pattern.difficulty === 'easy' ? 'bg-green-500/20 text-green-200' :
                  pattern.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-200' :
                  'bg-red-500/20 text-red-200'
                }`}>
                  {pattern.difficulty}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Success Rate</span>
                  <span className="text-white font-semibold">{pattern.successRate}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Optimal Time</span>
                  <span className="text-white font-semibold">{pattern.optimalTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Risk Score</span>
                  <span className={`font-semibold ${
                    pattern.riskScore < 30 ? 'text-green-400' :
                    pattern.riskScore < 60 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {pattern.riskScore}/100
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Detail Modal */}
      {selectedPattern && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedPattern.name}</h3>
              <button 
                onClick={() => setSelectedPattern(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Failure Patterns</h4>
                <div className="space-y-2">
                  {selectedPattern.failurePatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-blue-200 text-sm">{pattern}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">AI Recommendations</h4>
                <div className="space-y-2">
                  {selectedPattern.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-blue-200 text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2 rounded-lg hover:from-purple-400 hover:to-blue-500 transition-all">
                Apply Recommendations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
