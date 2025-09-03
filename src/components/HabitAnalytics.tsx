'use client';

import React from 'react';
import { 
  TrendingUp, 
  Flame, 
  Target, 
  Calendar, 
  BarChart3, 
  Award,
  Clock,
  Zap
} from 'lucide-react';
import { Habit, HabitCheckin } from '@/types';

interface HabitAnalyticsProps {
  habits: Habit[];
  checkins: HabitCheckin[];
}

const HabitAnalytics: React.FC<HabitAnalyticsProps> = ({ habits, checkins }) => {
  // Calculate analytics
  const getHabitStats = (habitId: string) => {
    const habitCheckins = checkins.filter(c => c.habitId === habitId);
    const totalCheckins = habitCheckins.length;
    const completedCheckins = habitCheckins.filter(c => c.status === 'done').length;
    const completionRate = totalCheckins > 0 ? (completedCheckins / totalCheckins) * 100 : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    const sortedCheckins = habitCheckins
      .filter(c => c.status === 'done')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedCheckins.length > 0) {
      let currentDate = new Date();
      let lastCheckinDate = new Date(sortedCheckins[0].date);
      
      // Check if last checkin was today or yesterday
      const daysDiff = Math.floor((currentDate.getTime() - lastCheckinDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        // Calculate current streak
        for (let i = 0; i < sortedCheckins.length - 1; i++) {
          const current = new Date(sortedCheckins[i].date);
          const next = new Date(sortedCheckins[i + 1].date);
          const diff = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diff === 1) {
            tempStreak++;
          } else {
            break;
          }
        }
        currentStreak = tempStreak + 1;
      }
      
      // Calculate best streak
      tempStreak = 1;
      for (let i = 0; i < sortedCheckins.length - 1; i++) {
        const current = new Date(sortedCheckins[i].date);
        const next = new Date(sortedCheckins[i + 1].date);
        const diff = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diff === 1) {
          tempStreak++;
        } else {
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      bestStreak = Math.max(bestStreak, tempStreak);
    }
    
    return {
      totalCheckins,
      completedCheckins,
      completionRate,
      currentStreak,
      bestStreak,
      averageEffort: habitCheckins.length > 0 
        ? habitCheckins.reduce((sum, c) => sum + c.effort, 0) / habitCheckins.length 
        : 0
    };
  };

  const getOverallStats = () => {
    const totalHabits = habits.filter(h => !h.archived).length;
    const activeHabits = habits.filter(h => !h.archived && checkins.some(c => 
      c.habitId === h.id && 
      new Date(c.date).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    )).length;
    
    const totalCheckins = checkins.length;
    const completedCheckins = checkins.filter(c => c.status === 'done').length;
    const overallCompletionRate = totalCheckins > 0 ? (completedCheckins / totalCheckins) * 100 : 0;
    
    const totalStreak = habits.reduce((sum, habit) => {
      const stats = getHabitStats(habit.id);
      return sum + stats.currentStreak;
    }, 0);
    
    return {
      totalHabits,
      activeHabits,
      totalCheckins,
      completedCheckins,
      overallCompletionRate,
      totalStreak
    };
  };

  const overallStats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Overall Habit Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-2">{overallStats.totalHabits}</div>
            <div className="text-blue-200">Total Habits</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">{overallStats.activeHabits}</div>
            <div className="text-green-200">Active This Week</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">{Math.round(overallStats.overallCompletionRate)}%</div>
            <div className="text-yellow-200">Completion Rate</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400 mb-2">{overallStats.totalStreak}</div>
            <div className="text-red-200">Total Streak Days</div>
          </div>
        </div>
      </div>

      {/* Individual Habit Analytics */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Habit Performance Details</h3>
        <div className="space-y-4">
          {habits.filter(h => !h.archived).map(habit => {
            const stats = getHabitStats(habit.id);
            
            return (
              <div key={habit.id} className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">{habit.title}</h4>
                    <p className="text-blue-200 text-sm">{habit.purpose}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{Math.round(stats.completionRate)}%</div>
                    <div className="text-blue-200 text-sm">Success Rate</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-blue-200 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Total</span>
                    </div>
                    <div className="text-lg font-semibold text-white">{stats.totalCheckins}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-blue-200 mb-2">
                      <Target className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                    <div className="text-lg font-semibold text-green-400">{stats.completedCheckins}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-blue-200 mb-2">
                      <Flame className="w-4 h-4" />
                      <span>Current</span>
                    </div>
                    <div className="text-lg font-semibold text-orange-400">{stats.currentStreak}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-blue-200 mb-2">
                      <Award className="w-4 h-4" />
                      <span>Best</span>
                    </div>
                    <div className="text-lg font-semibold text-purple-400">{stats.bestStreak}</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-blue-200 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(stats.completionRate)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        stats.completionRate >= 80 ? 'bg-green-400' : 
                        stats.completionRate >= 60 ? 'bg-yellow-400' : 
                        stats.completionRate >= 40 ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Effort Score */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-blue-200">
                    <Clock className="w-4 h-4" />
                    <span>Average Effort:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3].map(level => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-full ${
                          level <= stats.averageEffort ? 'bg-yellow-400' : 'bg-white/20'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-white ml-2">{stats.averageEffort.toFixed(1)}/3</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Weekly Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
              This Week vs Last Week
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Completion Rate</span>
                <span className="text-green-400 font-semibold">+12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Active Habits</span>
                <span className="text-green-400 font-semibold">+2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Average Streak</span>
                <span className="text-green-400 font-semibold">+1.5 days</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 text-green-400 mr-2" />
              Achievements
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-200 text-sm">7-day streak on Morning Prayer</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-blue-200 text-sm">90% completion rate this month</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-purple-200 text-sm">Consistent evening routine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitAnalytics;

