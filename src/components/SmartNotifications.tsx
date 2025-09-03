'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  Settings,
  X,
  Star,
  TrendingUp,
  Calendar,
  Smartphone
} from 'lucide-react';
import { Habit, HabitCheckin } from '@/types';

interface SmartNotification {
  id: string;
  type: 'reminder' | 'achievement' | 'warning' | 'suggestion' | 'motivation';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  read: boolean;
  action?: string;
  habitId?: string;
}

interface SmartNotificationsProps {
  habits: Habit[];
  checkins: HabitCheckin[];
  onDismiss: (notificationId: string) => void;
  onMarkRead: (notificationId: string) => void;
}

const SmartNotifications: React.FC<SmartNotificationsProps> = ({ 
  habits, 
  checkins, 
  onDismiss, 
  onMarkRead 
}) => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high-priority'>('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Generate smart notifications based on user behavior
    const generateNotifications = (): SmartNotification[] => {
      const newNotifications: SmartNotification[] = [];
      
      // Check for overdue habits
      habits.forEach(habit => {
        const today = new Date().toISOString().split('T')[0];
        const todayCheckin = checkins.find(c => 
          c.habitId === habit.id && c.date === today
        );
        
        if (!todayCheckin) {
          const now = new Date();
          const habitStart = new Date(`${today}T${habit.window.start}`);
          const habitEnd = new Date(`${today}T${habit.window.end}`);
          
          if (now > habitEnd) {
            newNotifications.push({
              id: `overdue-${habit.id}`,
              type: 'warning',
              title: 'Habit Overdue',
              message: `"${habit.title}" was due between ${habit.window.start} and ${habit.window.end}. It's not too late to complete it!`,
              priority: 'high',
              timestamp: new Date(),
              read: false,
              action: 'Complete Now',
              habitId: habit.id
            });
          } else if (now >= habitStart && now <= habitEnd) {
            newNotifications.push({
              id: `due-${habit.id}`,
              type: 'reminder',
              title: 'Habit Due',
              message: `"${habit.title}" is due now. This is the perfect time to complete it!`,
              priority: 'medium',
              timestamp: new Date(),
              read: false,
              action: 'Start Now',
              habitId: habit.id
            });
          }
        }
      });

      // Check for achievements
      habits.forEach(habit => {
        const habitCheckins = checkins.filter(c => c.habitId === habit.id);
        if (habitCheckins.length >= 7) {
          const recentCheckins = habitCheckins.slice(-7);
          const completionRate = recentCheckins.filter(c => c.status === 'done').length / 7;
          
          if (completionRate >= 0.8) {
            newNotifications.push({
              id: `achievement-${habit.id}`,
              type: 'achievement',
              title: 'Great Consistency!',
              message: `You've maintained "${habit.title}" with ${Math.round(completionRate * 100)}% success rate this week. Keep up the amazing work!`,
              priority: 'medium',
              timestamp: new Date(),
              read: false,
              action: 'Celebrate',
              habitId: habit.id
            });
          }
        }
      });

      // Check for streaks
      habits.forEach(habit => {
        const habitCheckins = checkins.filter(c => c.habitId === habit.id);
        if (habitCheckins.length >= 3) {
          const recentCheckins = habitCheckins.slice(-3);
          const allDone = recentCheckins.every(c => c.status === 'done');
          
          if (allDone) {
            newNotifications.push({
              id: `streak-${habit.id}`,
              type: 'motivation',
              title: 'Streak Alert!',
              message: `You're on a 3-day streak with "${habit.title}"! Don't break the chain - complete it today!`,
              priority: 'medium',
              timestamp: new Date(),
              read: false,
              action: 'Continue Streak',
              habitId: habit.id
            });
          }
        }
      });

      // Check for timing optimization suggestions
      const morningHabits = habits.filter(h => h.moment === 'morning');
      if (morningHabits.length > 3) {
        newNotifications.push({
          id: 'timing-optimization',
          type: 'suggestion',
          title: 'Morning Routine Optimization',
          message: 'You have many morning habits. Consider spreading some to other times to avoid overwhelm.',
          priority: 'low',
          timestamp: new Date(),
          read: false,
          action: 'Review Schedule'
        });
      }

      // Check for missing habit categories
      const categories = habits.map(h => h.category);
      if (!categories.includes('health')) {
        newNotifications.push({
          id: 'missing-health',
          type: 'suggestion',
          title: 'Wellness Balance',
          message: 'Consider adding a health-focused habit to balance your routine.',
          priority: 'low',
          timestamp: new Date(),
          read: false,
          action: 'Add Health Habit'
        });
      }

      return newNotifications;
    };

    const newNotifications = generateNotifications();
    setNotifications(newNotifications);
  }, [habits, checkins]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'high-priority') return notification.priority === 'high';
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="w-5 h-5" />;
      case 'achievement': return <Star className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'suggestion': return <Target className="w-5 h-5" />;
      case 'motivation': return <Zap className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30';
      case 'achievement': return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
      case 'warning': return 'from-red-500/20 to-pink-500/20 border-red-400/30';
      case 'suggestion': return 'from-purple-500/20 to-pink-500/20 border-purple-400/30';
      case 'motivation': return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-400/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  const handleNotificationAction = (notification: SmartNotification) => {
    if (notification.action === 'Complete Now' || notification.action === 'Start Now') {
      // In a real app, this would navigate to the habit completion page
      console.log('Navigate to habit completion:', notification.habitId);
    }
    
    onMarkRead(notification.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <Bell className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Smart Notifications</h3>
              <p className="text-blue-200">Intelligent reminders and insights based on your behavior</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {notifications.filter(n => !n.read).length}
              </div>
              <div className="text-blue-200 text-sm">Unread</div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-white/5 text-blue-200 hover:bg-white/10'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === 'unread'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-white/5 text-blue-200 hover:bg-white/10'
            }`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setFilter('high-priority')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === 'high-priority'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-white/5 text-blue-200 hover:bg-white/10'
            }`}
          >
            High Priority ({notifications.filter(n => n.priority === 'high').length})
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-gradient-to-r ${getTypeColor(notification.type)} backdrop-blur-sm rounded-2xl p-6 border shadow-xl hover:shadow-2xl transition-all duration-300 ${
                notification.read ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-white/10">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-semibold text-white">{notification.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)} bg-white/10`}>
                        {notification.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <p className="text-blue-200 text-sm mb-3">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-200">
                        {notification.timestamp.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <span className="text-purple-200">
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {notification.action && (
                    <button
                      onClick={() => handleNotificationAction(notification)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      {notification.action}
                    </button>
                  )}
                  <button
                    onClick={() => onDismiss(notification.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-blue-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">All Caught Up!</h4>
            <p className="text-blue-200">No new notifications at the moment.</p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      {showSettings && (
        <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h4 className="text-xl font-semibold text-white mb-6 text-center">Notification Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-white mb-3">Smart Reminders</h5>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400/20" />
                  <span className="text-blue-200">Habit due reminders</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400/20" />
                  <span className="text-blue-200">Achievement celebrations</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400/20" />
                  <span className="text-blue-200">Streak alerts</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold text-white mb-3">Delivery</h5>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400/20" />
                  <span className="text-blue-200">Push notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400/20" />
                  <span className="text-blue-200">Email summaries</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400/20" />
                  <span className="text-blue-200">Smart timing</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartNotifications;
