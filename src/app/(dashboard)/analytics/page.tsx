'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar,
  Brain,
  Award,
  Clock,
  Zap,
  Flame,
  Star,
  CheckCircle,
  Users,
  Lightbulb,
  Bell,
  Activity
} from 'lucide-react';
import { Habit, HabitCheckin } from '@/types';
import HabitAnalytics from '@/components/HabitAnalytics';
import AIHabitRecommendations from '@/components/AIHabitRecommendations';
import AdvancedHabitInsights from '@/components/AdvancedHabitInsights';
import SmartNotifications from '@/components/SmartNotifications';
import AdvancedTrendAnalysis from '@/components/AdvancedTrendAnalysis';
import SocialAccountability from '@/components/SocialAccountability';
import AIPersonalization from '@/components/AIPersonalization';
import AdaptiveLearning from '@/components/AdaptiveLearning';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import NeuralHabitEngine from '@/components/NeuralHabitEngine';
import RealTimeOptimizer from '@/components/RealTimeOptimizer';

export default function AnalyticsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<HabitCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'ai-insights' | 'advanced-insights' | 'notifications' | 'trends' | 'social' | 'ai-personalization' | 'adaptive-learning' | 'predictive' | 'neural-engine' | 'real-time' | 'advanced-predictive'>('overview');

  useEffect(() => {
    // Load mock data for demonstration
    const mockHabits: Habit[] = [
      {
        id: '1',
        userId: 'demo-user',
        title: 'Morning Prayer',
        purpose: 'Start the day with gratitude and spiritual connection',
        moment: 'morning',
        cadence: { type: 'daily' },
        dose: { unit: 'minutes', target: 10 },
        window: { start: '07:00', end: '11:00' },
        difficulty: 2,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: 'demo-user',
        title: 'Hydration',
        purpose: 'Stay hydrated throughout the day',
        moment: 'morning',
        cadence: { type: 'daily' },
        dose: { unit: 'liters', target: 2 },
        window: { start: '06:00', end: '22:00' },
        difficulty: 1,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        userId: 'demo-user',
        title: 'Deep Work',
        purpose: 'Uninterrupted focused work sessions',
        moment: 'morning',
        cadence: { type: 'weekdays' },
        dose: { unit: 'minutes', target: 90 },
        window: { start: '08:00', end: '12:00' },
        difficulty: 3,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        userId: 'demo-user',
        title: 'Mindful Breaks',
        purpose: 'Take intentional breaks to maintain focus',
        moment: 'midday',
        cadence: { type: 'daily' },
        dose: { unit: 'minutes', target: 5 },
        window: { start: '12:00', end: '14:00' },
        difficulty: 1,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        userId: 'demo-user',
        title: 'Evening Reflection',
        purpose: 'End the day with gratitude and prayer',
        moment: 'evening',
        cadence: { type: 'daily' },
        dose: { unit: 'minutes', target: 5 },
        window: { start: '20:00', end: '22:00' },
        difficulty: 1,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const mockCheckins: HabitCheckin[] = [
      {
        id: '1',
        userId: 'demo-user',
        habitId: '1',
        date: new Date().toISOString().split('T')[0],
        status: 'done',
        effort: 2,
        doseActual: 10,
        note: 'Felt very connected today',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: 'demo-user',
        habitId: '2',
        date: new Date().toISOString().split('T')[0],
        status: 'partial',
        effort: 1,
        doseActual: 1.5,
        note: 'Need to drink more water',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        userId: 'demo-user',
        habitId: '3',
        date: new Date().toISOString().split('T')[0],
        status: 'done',
        effort: 3,
        doseActual: 90,
        note: 'Great focus session',
        createdAt: new Date().toISOString()
      }
    ];

    setHabits(mockHabits);
    setCheckins(mockCheckins);
    setLoading(false);
  }, []);

  const handleApplyRecommendation = (recommendation: any) => {
    // Handle applying AI recommendations
    console.log('Applying recommendation:', recommendation);
    // In a real app, this would trigger specific actions
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Habit Analytics', icon: Target },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
    { id: 'advanced-insights', label: 'Advanced Insights', icon: TrendingUp },
    { id: 'notifications', label: 'Smart Notifications', icon: Bell },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'social', label: 'Social & Community', icon: Users },
    { id: 'ai-personalization', label: 'AI Personalization', icon: Lightbulb },
    { id: 'adaptive-learning', label: 'Adaptive Learning', icon: Target },
    { id: 'predictive', label: 'Predictive Analytics', icon: TrendingUp },
    { id: 'neural-engine', label: 'Neural Engine', icon: Brain },
    { id: 'real-time', label: 'Real-Time', icon: Zap },
    { id: 'advanced-predictive', label: 'Advanced Predictive', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Analytics & Insights</h1>
              <p className="text-blue-200 text-sm sm:text-base md:text-lg leading-relaxed">
                Deep dive into your habit performance and get AI-powered recommendations
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <div className="text-blue-200 text-xs sm:text-sm">Monthly Overview</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-xl overflow-x-auto">
          <div className="flex space-x-1 sm:space-x-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12">
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Stats */}
            <div className="backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Quick Overview</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Target className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">{habits.filter(h => !h.archived).length}</div>
                  <div className="text-blue-200 text-xs sm:text-sm">Active Habits</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 mb-1 sm:mb-2">{checkins.filter(c => c.status === 'done').length}</div>
                  <div className="text-green-200 text-xs sm:text-sm">Completed Today</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-1 sm:mb-2">7</div>
                  <div className="text-yellow-200 text-xs sm:text-sm">Day Streak</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">+15%</div>
                  <div className="text-purple-200 text-xs sm:text-sm">vs Last Week</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Recent Activity</h3>
              <div className="space-y-4">
                {checkins.slice(0, 5).map((checkin) => {
                  const habit = habits.find(h => h.id === checkin.habitId);
                  if (!habit) return null;
                  
                  return (
                    <div key={checkin.id} className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            checkin.status === 'done' ? 'bg-green-400' : 
                            checkin.status === 'partial' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                          <div>
                            <div className="font-semibold text-white">{habit.title}</div>
                            <div className="text-blue-200 text-sm">
                              {new Date(checkin.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-blue-200">Effort: {checkin.effort}/3</div>
                          {checkin.note && (
                            <div className="text-xs text-blue-300 italic">"{checkin.note}"</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">View Detailed Analytics</h4>
                  <p className="text-blue-200 text-sm">Deep dive into your habit performance</p>
                </button>
                
                <button className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Get AI Insights</h4>
                  <p className="text-green-200 text-sm">Personalized recommendations</p>
                </button>
                
                <button className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Track Trends</h4>
                  <p className="text-yellow-200 text-sm">See your progress over time</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <HabitAnalytics habits={habits} checkins={checkins} />
        )}

        {activeTab === 'ai-insights' && (
          <AIHabitRecommendations 
            habits={habits} 
            checkins={checkins} 
            onApplyRecommendation={handleApplyRecommendation}
          />
        )}

        {activeTab === 'advanced-insights' && (
          <AdvancedHabitInsights 
            habits={habits} 
            checkins={checkins} 
          />
        )}

        {activeTab === 'notifications' && (
          <SmartNotifications 
            habits={habits} 
            checkins={checkins} 
            onDismiss={(id) => console.log('Dismiss notification:', id)}
            onMarkRead={(id) => console.log('Mark notification read:', id)}
          />
        )}

        {activeTab === 'trends' && (
          <AdvancedTrendAnalysis habits={habits} checkins={checkins} />
        )}

        {activeTab === 'social' && (
          <SocialAccountability habits={habits} checkins={checkins} />
        )}

        {activeTab === 'ai-personalization' && (
          <AIPersonalization habits={habits} checkins={checkins} />
        )}

        {activeTab === 'adaptive-learning' && (
          <AdaptiveLearning habits={habits} checkins={checkins} />
        )}

        {activeTab === 'predictive' && (
          <PredictiveAnalytics habits={habits} checkins={checkins} />
        )}

        {activeTab === 'neural-engine' && (
          <NeuralHabitEngine />
        )}

        {activeTab === 'real-time' && (
          <RealTimeOptimizer />
        )}

        {activeTab === 'advanced-predictive' && (
          <PredictiveAnalytics habits={habits} checkins={checkins} />
        )}
      </div>
    </div>
  );
}

