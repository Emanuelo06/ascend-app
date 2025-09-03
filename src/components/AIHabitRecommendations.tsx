'use client';

import React, { useState } from 'react';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Clock, 
  Star,
  Plus,
  CheckCircle,
  X
} from 'lucide-react';
import { Habit, HabitCheckin } from '@/types';

interface AIRecommendation {
  id: string;
  type: 'optimization' | 'new_habit' | 'timing' | 'motivation';
  title: string;
  description: string;
  confidence: number;
  action: string;
  impact: 'high' | 'medium' | 'low';
  category: 'productivity' | 'health' | 'spiritual' | 'relationships';
}

interface AIHabitRecommendationsProps {
  habits: Habit[];
  checkins: HabitCheckin[];
  onApplyRecommendation: (recommendation: AIRecommendation) => void;
}

const AIHabitRecommendations: React.FC<AIHabitRecommendationsProps> = ({ 
  habits, 
  checkins, 
  onApplyRecommendation 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');

  // Generate AI recommendations based on user data
  const generateRecommendations = (): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];
    
    // Analyze completion patterns
    const completionRates = habits.map(habit => {
      const habitCheckins = checkins.filter(c => c.habitId === habit.id);
      const total = habitCheckins.length;
      const completed = habitCheckins.filter(c => c.status === 'done').length;
      return { habit, rate: total > 0 ? completed / total : 0 };
    });

    // Find low-performing habits
    const lowPerforming = completionRates.filter(r => r.rate < 0.5);
    if (lowPerforming.length > 0) {
      const habit = lowPerforming[0].habit;
      recommendations.push({
        id: 'opt-1',
        type: 'optimization',
        title: 'Optimize Habit Timing',
        description: `"${habit.title}" has a low completion rate. Consider adjusting the time window or breaking it into smaller steps.`,
        confidence: 85,
        action: 'Review timing and difficulty',
        impact: 'high',
        category: habit.category as any
      });
    }

    // Check for missing habit categories
    const categories = habits.map(h => h.category);
    if (!categories.includes('health')) {
      recommendations.push({
        id: 'new-1',
        type: 'new_habit',
        title: 'Add Physical Wellness',
        description: 'You don\'t have any health-focused habits. Consider adding exercise, hydration, or sleep optimization.',
        confidence: 90,
        action: 'Create health habit',
        impact: 'high',
        category: 'health'
      });
    }

    // Check for timing conflicts
    const morningHabits = habits.filter(h => h.moment === 'morning');
    if (morningHabits.length > 3) {
      recommendations.push({
        id: 'timing-1',
        type: 'timing',
        title: 'Morning Routine Optimization',
        description: 'You have many morning habits which might be overwhelming. Consider spreading some to other moments.',
        confidence: 75,
        action: 'Redistribute habits',
        impact: 'medium',
        category: 'productivity'
      });
    }

    // Motivation boost for consistent habits
    const consistentHabits = completionRates.filter(r => r.rate > 0.8);
    if (consistentHabits.length > 0) {
      recommendations.push({
        id: 'mot-1',
        type: 'motivation',
        title: 'Celebrate Consistency',
        description: `Great job maintaining "${consistentHabits[0].habit.title}"! Consider adding a related habit to build momentum.`,
        confidence: 95,
        action: 'Add related habit',
        impact: 'medium',
        category: consistentHabits[0].habit.category as any
      });
    }

    // Check for spiritual balance
    if (!categories.includes('spiritual')) {
      recommendations.push({
        id: 'new-2',
        type: 'new_habit',
        title: 'Spiritual Growth',
        description: 'Consider adding a spiritual practice like prayer, meditation, or gratitude to balance your routine.',
        confidence: 80,
        action: 'Create spiritual habit',
        impact: 'medium',
        category: 'spiritual'
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();
  
  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
    if (selectedImpact !== 'all' && rec.impact !== selectedImpact) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="w-5 h-5" />;
      case 'new_habit': return <Plus className="w-5 h-5" />;
      case 'timing': return <Clock className="w-5 h-5" />;
      case 'motivation': return <Star className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30';
      case 'new_habit': return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
      case 'timing': return 'from-purple-500/20 to-pink-500/20 border-purple-400/30';
      case 'motivation': return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-400/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">AI Habit Insights</h3>
              <p className="text-blue-200">Personalized recommendations based on your behavior patterns</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-400 mb-1">{recommendations.length}</div>
            <div className="text-blue-200 text-sm">Recommendations</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
          >
            <option value="all">All Categories</option>
            <option value="productivity">Productivity</option>
            <option value="health">Health</option>
            <option value="spiritual">Spiritual</option>
            <option value="relationships">Relationships</option>
          </select>

          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
          >
            <option value="all">All Impact Levels</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation) => (
          <div 
            key={recommendation.id} 
            className={`bg-gradient-to-r ${getTypeColor(recommendation.type)} backdrop-blur-sm rounded-2xl p-6 border shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-white/10">
                  {getTypeIcon(recommendation.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-xl font-semibold text-white">{recommendation.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(recommendation.impact)} bg-white/10`}>
                      {recommendation.impact.toUpperCase()} IMPACT
                    </span>
                  </div>
                  <p className="text-blue-200 text-sm mb-3">{recommendation.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-purple-200">
                      Confidence: {recommendation.confidence}%
                    </span>
                    <span className="text-blue-200">
                      Category: {recommendation.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onApplyRecommendation(recommendation)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Apply</span>
                </button>
              </div>
            </div>

            {/* Action Steps */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h5 className="font-semibold text-white mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 text-purple-400 mr-2" />
                Recommended Action
              </h5>
              <p className="text-blue-200 text-sm">{recommendation.action}</p>
            </div>
          </div>
        ))}

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-purple-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">All Caught Up!</h4>
            <p className="text-blue-200">You're doing great! Check back later for new AI insights.</p>
          </div>
        )}
      </div>

      {/* AI Explanation */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white">How AI Works</h4>
            <p className="text-blue-200 text-sm">Understanding your personalized recommendations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-200">Analyzes your completion patterns and streaks</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-200">Identifies gaps in your habit categories</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-purple-200">Suggests optimal timing and difficulty adjustments</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-yellow-200">Recommends complementary habits for momentum</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-red-200">Highlights areas for improvement and optimization</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span className="text-pink-200">Adapts suggestions based on your progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHabitRecommendations;

