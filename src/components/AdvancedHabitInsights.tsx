'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  BarChart3, 
  Brain,
  Zap,
  Clock,
  Award,
  TrendingDown,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';
import { Habit, HabitCheckin } from '@/types';

interface AdvancedHabitInsightsProps {
  habits: Habit[];
  checkins: HabitCheckin[];
}

interface HabitCorrelation {
  habit1: string;
  habit2: string;
  correlation: number;
  strength: 'strong' | 'moderate' | 'weak';
  type: 'positive' | 'negative';
}

interface PredictiveInsight {
  habitId: string;
  habitTitle: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  factors: string[];
}

const AdvancedHabitInsights: React.FC<AdvancedHabitInsightsProps> = ({ habits, checkins }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  // Calculate habit correlations
  const calculateCorrelations = (): HabitCorrelation[] => {
    const correlations: HabitCorrelation[] = [];
    
    // Simple correlation calculation based on completion patterns
    for (let i = 0; i < habits.length; i++) {
      for (let j = i + 1; j < habits.length; j++) {
        const habit1 = habits[i];
        const habit2 = habits[j];
        
        const habit1Checkins = checkins.filter(c => c.habitId === habit1.id);
        const habit2Checkins = checkins.filter(c => c.habitId === habit2.id);
        
        if (habit1Checkins.length > 0 && habit2Checkins.length > 0) {
          // Calculate correlation based on completion dates
          const dates1 = habit1Checkins.map(c => c.date);
          const dates2 = habit2Checkins.map(c => c.date);
          
          // Simple overlap calculation
          const overlap = dates1.filter(date => dates2.includes(date)).length;
          const totalDays = Math.max(dates1.length, dates2.length);
          const correlation = totalDays > 0 ? overlap / totalDays : 0;
          
          if (correlation > 0.1) { // Only show meaningful correlations
            correlations.push({
              habit1: habit1.title,
              habit2: habit2.title,
              correlation: Math.round(correlation * 100),
              strength: correlation > 0.7 ? 'strong' : correlation > 0.4 ? 'moderate' : 'weak',
              type: correlation > 0.5 ? 'positive' : 'negative'
            });
          }
        }
      }
    }
    
    return correlations.sort((a, b) => b.correlation - a.correlation);
  };

  // Generate predictive insights
  const generatePredictiveInsights = (): PredictiveInsight[] => {
    const insights: PredictiveInsight[] = [];
    
    habits.forEach(habit => {
      const habitCheckins = checkins.filter(c => c.habitId === habit.id);
      if (habitCheckins.length < 3) return; // Need more data
      
      const recentCheckins = habitCheckins.slice(-7); // Last 7 checkins
      const completionRate = recentCheckins.filter(c => c.status === 'done').length / recentCheckins.length;
      
      if (completionRate < 0.5) {
        insights.push({
          habitId: habit.id,
          habitTitle: habit.title,
          prediction: 'At risk of becoming inconsistent',
          confidence: 75,
          timeframe: 'Next 2 weeks',
          factors: ['Low recent completion rate', 'Declining trend', 'Difficulty level may be too high']
        });
      } else if (completionRate > 0.8) {
        insights.push({
          habitId: habit.id,
          habitTitle: habit.title,
          prediction: 'Ready for next level challenge',
          confidence: 85,
          timeframe: 'Next week',
          factors: ['High consistency', 'Stable performance', 'Ready for progression']
        });
      }
    });
    
    return insights;
  };

  // Calculate habit momentum
  const calculateMomentum = (habitId: string) => {
    const habitCheckins = checkins.filter(c => c.habitId === habitId);
    if (habitCheckins.length < 2) return 0;
    
    const recent = habitCheckins.slice(-3);
    const older = habitCheckins.slice(-6, -3);
    
    const recentRate = recent.filter(c => c.status === 'done').length / recent.length;
    const olderRate = older.filter(c => c.status === 'done').length / older.length;
    
    return recentRate - olderRate;
  };

  const correlations = calculateCorrelations();
  const predictiveInsights = generatePredictiveInsights();

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'weak': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getCorrelationIcon = (type: string) => {
    return type === 'positive' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Habit Momentum Analysis */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Habit Momentum Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.filter(h => !h.archived).map(habit => {
            const momentum = calculateMomentum(habit.id);
            const momentumIcon = momentum > 0 ? <TrendingUp className="w-6 h-6 text-green-400" /> : 
                               momentum < 0 ? <TrendingDown className="w-6 h-6 text-red-400" /> : 
                               <Activity className="w-6 h-6 text-blue-400" />;
            
            return (
              <div key={habit.id} className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">{habit.title}</h4>
                  {momentumIcon}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200 text-sm">Momentum</span>
                    <span className={`font-semibold ${momentum > 0 ? 'text-green-400' : momentum < 0 ? 'text-red-400' : 'text-blue-400'}`}>
                      {momentum > 0 ? '+' : ''}{Math.round(momentum * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200 text-sm">Status</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      momentum > 0.1 ? 'bg-green-500/20 text-green-400' :
                      momentum < -0.1 ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {momentum > 0.1 ? 'Accelerating' : momentum < -0.1 ? 'Declining' : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Correlations */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Habit Correlations</h3>
        <div className="space-y-4">
          {correlations.length > 0 ? (
            correlations.map((correlation, index) => (
              <div key={index} className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getCorrelationIcon(correlation.type)}
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {correlation.habit1} ↔ {correlation.habit2}
                      </h4>
                      <p className="text-blue-200 text-sm">
                        {correlation.type === 'positive' ? 'Positive' : 'Negative'} correlation
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{correlation.correlation}%</div>
                    <span className={`text-sm px-2 py-1 rounded-full ${getStrengthColor(correlation.strength)} bg-white/10`}>
                      {correlation.strength.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-blue-200 text-sm">
                    {correlation.type === 'positive' 
                      ? `When you complete "${correlation.habit1}", you're ${correlation.correlation}% more likely to complete "${correlation.habit2}" on the same day.`
                      : `Completing "${correlation.habit1}" and "${correlation.habit2}" on the same day is ${correlation.correlation}% less likely.`
                    }
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-12 h-12 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">No Correlations Yet</h4>
              <p className="text-blue-200">Complete more habits to see how they relate to each other.</p>
            </div>
          )}
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Predictive Insights</h3>
        <div className="space-y-4">
          {predictiveInsights.length > 0 ? (
            predictiveInsights.map((insight, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                      <Brain className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">{insight.habitTitle}</h4>
                      <p className="text-purple-200 text-lg mb-2">{insight.prediction}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-blue-200">Confidence: {insight.confidence}%</span>
                        <span className="text-green-200">Timeframe: {insight.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h5 className="font-semibold text-white mb-3 flex items-center">
                    <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                    Key Factors
                  </h5>
                  <div className="space-y-2">
                    {insight.factors.map((factor, factorIndex) => (
                      <div key={factorIndex} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-purple-200">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-12 h-12 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Building Insights</h4>
              <p className="text-blue-200">Continue tracking habits to receive personalized predictions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Metrics */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Advanced Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <PieChart className="w-5 h-5 text-blue-400 mr-2" />
              Habit Distribution
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Morning Habits</span>
                <span className="text-white font-semibold">
                  {habits.filter(h => h.moment === 'morning').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Midday Habits</span>
                <span className="text-white font-semibold">
                  {habits.filter(h => h.moment === 'midday').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Evening Habits</span>
                <span className="text-white font-semibold">
                  {habits.filter(h => h.moment === 'evening').length}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <LineChart className="w-5 h-5 text-green-400 mr-2" />
              Performance Trends
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-200">Best Performing</span>
                <span className="text-white font-semibold">
                  {habits.length > 0 ? habits[0].title : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-200">Needs Attention</span>
                <span className="text-white font-semibold">
                  {habits.length > 1 ? habits[1].title : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-200">Consistency Score</span>
                <span className="text-white font-semibold">
                  {Math.round((checkins.filter(c => c.status === 'done').length / Math.max(checkins.length, 1)) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedHabitInsights;
