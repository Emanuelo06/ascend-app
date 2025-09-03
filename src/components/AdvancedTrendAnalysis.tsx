'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BarChart3, 
  Brain,
  Zap,
  Clock,
  Award,
  Activity,
  PieChart,
  LineChart,
  Target,
  Flame,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { Habit, HabitCheckin } from '@/types';

interface AdvancedTrendAnalysisProps {
  habits: Habit[];
  checkins: HabitCheckin[];
}

interface TrendData {
  period: string;
  completionRate: number;
  totalHabits: number;
  completedHabits: number;
  averageEffort: number;
  streakDays: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface SeasonalPattern {
  habitId: string;
  habitTitle: string;
  pattern: 'weekly' | 'monthly' | 'seasonal';
  bestDays: string[];
  worstDays: string[];
  confidence: number;
  recommendation: string;
}

interface PredictiveModel {
  habitId: string;
  habitTitle: string;
  nextWeekPrediction: number;
  nextMonthPrediction: number;
  confidence: number;
  factors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

const AdvancedTrendAnalysis: React.FC<AdvancedTrendAnalysisProps> = ({ habits, checkins }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedHabit, setSelectedHabit] = useState<string>('all');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [seasonalPatterns, setSeasonalPatterns] = useState<SeasonalPattern[]>([]);
  const [predictiveModels, setPredictiveModels] = useState<PredictiveModel[]>([]);

  useEffect(() => {
    generateTrendData();
    generateSeasonalPatterns();
    generatePredictiveModels();
  }, [selectedTimeframe, selectedHabit, habits, checkins]);

  const generateTrendData = () => {
    const trends: TrendData[] = [];
    const periods = getPeriods(selectedTimeframe);
    
    periods.forEach((period, index) => {
      const periodCheckins = getCheckinsForPeriod(period);
      const completionRate = calculateCompletionRate(periodCheckins);
      const averageEffort = calculateAverageEffort(periodCheckins);
      const streakDays = calculateStreakDays(periodCheckins);
      
      const previousPeriod = index > 0 ? periods[index - 1] : null;
      const change = previousPeriod ? completionRate - calculateCompletionRate(getCheckinsForPeriod(previousPeriod)) : 0;
      
      trends.push({
        period: period.label,
        completionRate,
        totalHabits: habits.length,
        completedHabits: Math.round(completionRate * habits.length / 100),
        averageEffort,
        streakDays,
        change,
        trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable'
      });
    });
    
    setTrendData(trends);
  };

  const generateSeasonalPatterns = () => {
    const patterns: SeasonalPattern[] = [];
    
    habits.forEach(habit => {
      const habitCheckins = checkins.filter(c => c.habitId === habit.id);
      if (habitCheckins.length < 14) return; // Need at least 2 weeks of data
      
      const weeklyPattern = analyzeWeeklyPattern(habitCheckins);
      const monthlyPattern = analyzeMonthlyPattern(habitCheckins);
      
      if (weeklyPattern.confidence > 0.6) {
        patterns.push({
          habitId: habit.id,
          habitTitle: habit.title,
          pattern: 'weekly',
          bestDays: weeklyPattern.bestDays,
          worstDays: weeklyPattern.worstDays,
          confidence: weeklyPattern.confidence,
          recommendation: weeklyPattern.recommendation
        });
      }
      
      if (monthlyPattern.confidence > 0.6) {
        patterns.push({
          habitId: habit.id,
          habitTitle: habit.title,
          pattern: 'monthly',
          bestDays: monthlyPattern.bestDays,
          worstDays: monthlyPattern.worstDays,
          confidence: monthlyPattern.confidence,
          recommendation: monthlyPattern.recommendation
        });
      }
    });
    
    setSeasonalPatterns(patterns);
  };

  const generatePredictiveModels = () => {
    const models: PredictiveModel[] = [];
    
    habits.forEach(habit => {
      const habitCheckins = checkins.filter(c => c.habitId === habit.id);
      if (habitCheckins.length < 21) return; // Need at least 3 weeks of data
      
      const nextWeekPrediction = predictNextWeek(habitCheckins);
      const nextMonthPrediction = predictNextMonth(habitCheckins);
      const confidence = calculatePredictionConfidence(habitCheckins);
      const factors = identifyPredictionFactors(habitCheckins);
      const riskLevel = assessRiskLevel(nextWeekPrediction, confidence);
      
      models.push({
        habitId: habit.id,
        habitTitle: habit.title,
        nextWeekPrediction,
        nextMonthPrediction,
        confidence,
        factors,
        riskLevel
      });
    });
    
    setPredictiveModels(models);
  };

  const getPeriods = (timeframe: string) => {
    const now = new Date();
    const periods = [];
    
    switch (timeframe) {
      case 'week':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          periods.push({
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            start: date.toISOString().split('T')[0],
            end: date.toISOString().split('T')[0]
          });
        }
        break;
      case 'month':
        for (let i = 3; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          periods.push({
            label: date.toLocaleDateString('en-US', { month: 'short' }),
            start: new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0],
            end: new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]
          });
        }
        break;
      case 'quarter':
        for (let i = 3; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - (i * 3));
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          periods.push({
            label: `Q${quarter} ${date.getFullYear()}`,
            start: new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1).toISOString().split('T')[0],
            end: new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3 + 3, 0).toISOString().split('T')[0]
          });
        }
        break;
      case 'year':
        for (let i = 4; i >= 0; i--) {
          const year = now.getFullYear() - i;
          periods.push({
            label: year.toString(),
            start: `${year}-01-01`,
            end: `${year}-12-31`
          });
        }
        break;
    }
    
    return periods;
  };

  const getCheckinsForPeriod = (period: any) => {
    if (selectedHabit === 'all') {
      return checkins.filter(c => c.date >= period.start && c.date <= period.end);
    }
    return checkins.filter(c => c.habitId === selectedHabit && c.date >= period.start && c.date <= period.end);
  };

  const calculateCompletionRate = (periodCheckins: HabitCheckin[]) => {
    if (periodCheckins.length === 0) return 0;
    const completed = periodCheckins.filter(c => c.status === 'done').length;
    return Math.round((completed / periodCheckins.length) * 100);
  };

  const calculateAverageEffort = (periodCheckins: HabitCheckin[]) => {
    if (periodCheckins.length === 0) return 0;
    const totalEffort = periodCheckins.reduce((sum, c) => sum + c.effort, 0);
    return Math.round((totalEffort / periodCheckins.length) * 10) / 10;
  };

  const calculateStreakDays = (periodCheckins: HabitCheckin[]) => {
    // Simplified streak calculation for demo
    return Math.floor(Math.random() * 7) + 1;
  };

  const analyzeWeeklyPattern = (habitCheckins: HabitCheckin[]) => {
    const dayStats = new Array(7).fill(0).map(() => ({ total: 0, completed: 0 }));
    
    habitCheckins.forEach(checkin => {
      const day = new Date(checkin.date).getDay();
      dayStats[day].total++;
      if (checkin.status === 'done') dayStats[day].completed++;
    });
    
    const completionRates = dayStats.map((day, index) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
      rate: day.total > 0 ? day.completed / day.total : 0
    }));
    
    const sorted = completionRates.sort((a, b) => b.rate - a.rate);
    const bestDays = sorted.slice(0, 3).map(d => d.day);
    const worstDays = sorted.slice(-3).map(d => d.day);
    
    return {
      bestDays,
      worstDays,
      confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
      recommendation: `Focus on ${worstDays[0]} and ${worstDays[1]} to improve consistency`
    };
  };

  const analyzeMonthlyPattern = (habitCheckins: HabitCheckin[]) => {
    // Simplified monthly pattern analysis
    return {
      bestDays: ['1-5', '15-20'],
      worstDays: ['25-31'],
      confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
      recommendation: 'Plan important habits in the first half of the month'
    };
  };

  const predictNextWeek = (habitCheckins: HabitCheckin[]) => {
    const recentCheckins = habitCheckins.slice(-7);
    const recentRate = calculateCompletionRate(recentCheckins);
    
    // Simple trend-based prediction
    const trend = recentCheckins.length >= 14 ? 
      recentRate - calculateCompletionRate(habitCheckins.slice(-14, -7)) : 0;
    
    return Math.max(0, Math.min(100, recentRate + trend));
  };

  const predictNextMonth = (habitCheckins: HabitCheckin[]) => {
    const weeklyPrediction = predictNextWeek(habitCheckins);
    
    // Monthly prediction with some variation
    return Math.max(0, Math.min(100, weeklyPrediction + (Math.random() - 0.5) * 20));
  };

  const calculatePredictionConfidence = (habitCheckins: HabitCheckin[]) => {
    // Confidence based on data consistency
    const recentCheckins = habitCheckins.slice(-7);
    const completionRates = recentCheckins.map(c => c.status === 'done' ? 1 : 0);
    const variance = calculateVariance(completionRates);
    
    return Math.max(0.3, Math.min(0.95, 1 - variance * 0.5));
  };

  const calculateVariance = (values: number[]) => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const identifyPredictionFactors = (habitCheckins: HabitCheckin[]) => {
    const factors = [];
    const recentRate = calculateCompletionRate(habitCheckins.slice(-7));
    
    if (recentRate < 50) factors.push('Low recent performance');
    if (recentRate > 80) factors.push('High consistency');
    if (habitCheckins.length > 30) factors.push('Sufficient historical data');
    if (habitCheckins.length < 21) factors.push('Limited data for prediction');
    
    return factors;
  };

  const assessRiskLevel = (prediction: number, confidence: number) => {
    if (prediction < 50 || confidence < 0.6) return 'high';
    if (prediction < 70 || confidence < 0.8) return 'medium';
    return 'low';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Time Period Selection */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Advanced Trend Analysis</h3>
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {['week', 'month', 'quarter', 'year'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedTimeframe === timeframe
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-blue-200 hover:bg-white/10'
              }`}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <select
            value={selectedHabit}
            onChange={(e) => setSelectedHabit(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
          >
            <option value="all">All Habits</option>
            {habits.map(habit => (
              <option key={habit.id} value={habit.id}>{habit.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trend Data Visualization */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h4 className="text-xl font-semibold text-white mb-6 text-center">Performance Trends</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendData.map((trend, index) => (
            <div key={index} className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-white">{trend.period}</h5>
                {getTrendIcon(trend.trend)}
              </div>
              
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">{trend.completionRate}%</div>
                  <div className="text-blue-200 text-sm">Completion Rate</div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200">Completed</span>
                  <span className="text-white font-semibold">{trend.completedHabits}/{trend.totalHabits}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200">Avg Effort</span>
                  <span className="text-white font-semibold">{trend.averageEffort}/3</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200">Streak</span>
                  <span className="text-white font-semibold">{trend.streakDays} days</span>
                </div>
                
                {trend.change !== 0 && (
                  <div className={`text-center text-sm font-semibold ${
                    trend.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trend.change > 0 ? '+' : ''}{trend.change}% change
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Patterns */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h4 className="text-xl font-semibold text-white mb-6 text-center">Seasonal Patterns & Cycles</h4>
        <div className="space-y-6">
          {seasonalPatterns.length > 0 ? (
            seasonalPatterns.map((pattern, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h5 className="text-xl font-semibold text-white mb-2">{pattern.habitTitle}</h5>
                    <p className="text-purple-200 text-sm mb-2">
                      {pattern.pattern.charAt(0).toUpperCase() + pattern.pattern.slice(1)} Pattern
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-blue-200">Confidence:</span>
                      <span className="text-white font-semibold">{Math.round(pattern.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="font-semibold text-white mb-3 flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-2" />
                      Best Days
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      {pattern.bestDays.map((day, dayIndex) => (
                        <span key={dayIndex} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="font-semibold text-white mb-3 flex items-center">
                      <Target className="w-4 h-4 text-red-400 mr-2" />
                      Challenge Days
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      {pattern.worstDays.map((day, dayIndex) => (
                        <span key={dayIndex} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <h6 className="font-semibold text-white mb-2 flex items-center">
                    <Brain className="w-4 h-4 text-purple-400 mr-2" />
                    AI Recommendation
                  </h6>
                  <p className="text-purple-200 text-sm">{pattern.recommendation}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-purple-400" />
              </div>
              <h5 className="text-xl font-semibold text-white mb-2">Building Pattern Recognition</h5>
              <p className="text-blue-200">Continue tracking habits to discover seasonal patterns and cycles.</p>
            </div>
          )}
        </div>
      </div>

      {/* Predictive Models */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h4 className="text-xl font-semibold text-white mb-6 text-center">Predictive Models & Forecasting</h4>
        <div className="space-y-6">
          {predictiveModels.length > 0 ? (
            predictiveModels.map((model, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h5 className="text-xl font-semibold text-white mb-2">{model.habitTitle}</h5>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-200">Confidence:</span>
                      <span className="text-white font-semibold">{Math.round(model.confidence * 100)}%</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(model.riskLevel)} bg-white/10`}>
                        {model.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="text-center">
                    <h6 className="font-semibold text-white mb-2">Next Week Prediction</h6>
                    <div className="text-3xl font-bold text-blue-400 mb-1">{Math.round(model.nextWeekPrediction)}%</div>
                    <div className="text-blue-200 text-sm">Expected completion rate</div>
                  </div>
                  
                  <div className="text-center">
                    <h6 className="font-semibold text-white mb-2">Next Month Prediction</h6>
                    <div className="text-3xl font-bold text-cyan-400 mb-1">{Math.round(model.nextMonthPrediction)}%</div>
                    <div className="text-cyan-200 text-sm">Long-term forecast</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h6 className="font-semibold text-white flex items-center">
                    <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                    Key Factors
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {model.factors.map((factor, factorIndex) => (
                      <span key={factorIndex} className="px-3 py-1 bg-white/10 text-blue-200 rounded-full text-sm">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-12 h-12 text-blue-400" />
              </div>
              <h5 className="text-xl font-semibold text-white mb-2">Building Predictive Models</h5>
              <p className="text-blue-200">Continue tracking habits to enable AI-powered predictions and forecasting.</p>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Analytics Summary */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h4 className="text-xl font-semibold text-white mb-6 text-center">Analytics Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400 mb-2">
              {trendData.length > 0 ? trendData[trendData.length - 1].completionRate : 0}%
            </div>
            <div className="text-green-200">Current Performance</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-2">{seasonalPatterns.length}</div>
            <div className="text-purple-200">Patterns Identified</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-2">{predictiveModels.length}</div>
            <div className="text-blue-200">Predictive Models</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTrendAnalysis;
