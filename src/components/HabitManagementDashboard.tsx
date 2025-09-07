'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, Search, Filter, Target, Clock, Calendar, TrendingUp, Flame, CheckCircle, 
  XCircle, Pause, Play, Edit, Trash2, Archive, Eye, BarChart3, Brain, Zap, 
  Activity, Star, Heart, BookOpen, Dumbbell, DollarSign, Sun, Moon, Coffee 
} from 'lucide-react';
import { Habit, HabitCheckin, HabitMetrics } from '@/types';
import EnhancedHabitDashboard from './EnhancedHabitDashboard';
import HabitInsightsEngine from './HabitInsightsEngine';

interface HabitManagementDashboardProps {
  userId: string;
}

interface HabitWithMetrics extends Habit {
  recentCheckins: HabitCheckin[];
  completionRate: number;
  currentStreak: number;
}

export default function HabitManagementDashboard({ userId }: HabitManagementDashboardProps) {
  const [habits, setHabits] = useState<HabitWithMetrics[]>([]);
  const [checkins, setCheckins] = useState<HabitCheckin[]>([]);
  const [metrics, setMetrics] = useState<HabitMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMoment, setSelectedMoment] = useState<string>('all');
  const [activeView, setActiveView] = useState<'habits' | 'analytics' | 'insights'>('habits');
  const [selectedHabit, setSelectedHabit] = useState<HabitWithMetrics | null>(null);

  useEffect(() => {
    loadHabits();
  }, [userId]);

  const loadHabits = async () => {
    try {
      setLoading(true);
      
      // Load demo habits
      const demoHabits: Habit[] = [
        {
          id: '1', userId, title: 'Morning Prayer', purpose: 'Start the day with gratitude',
          moment: 'morning', cadence: { type: 'daily' }, dose: { unit: 'minutes', target: 10 },
          window: { start: '07:00', end: '11:00' }, difficulty: 2, archived: false,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        },
        {
          id: '2', userId, title: 'Hydration', purpose: 'Stay hydrated throughout the day',
          moment: 'morning', cadence: { type: 'daily' }, dose: { unit: 'liters', target: 2 },
          window: { start: '06:00', end: '22:00' }, difficulty: 1, archived: false,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        }
      ];
      
      setHabits(demoHabits.map(habit => ({
        ...habit,
        recentCheckins: [],
        completionRate: Math.floor(Math.random() * 100),
        currentStreak: Math.floor(Math.random() * 7)
      })));
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMomentIcon = (moment: string) => {
    switch (moment) {
      case 'morning': return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'midday': return <Coffee className="w-4 h-4 text-orange-400" />;
      case 'evening': return <Moon className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 2: return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 3: return 'bg-red-500/20 text-red-200 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && !habit.archived) ||
                         (selectedStatus === 'archived' && habit.archived);
    const matchesMoment = selectedMoment === 'all' || habit.moment === selectedMoment;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesMoment;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-2 text-blue-200">Loading habits...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Habit Management Dashboard</h2>
          <p className="text-blue-200">Manage, track, and optimize your habits</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setActiveView('habits')}
            variant={activeView === 'habits' ? 'default' : 'outline'}
            size="sm"
            className={activeView === 'habits' 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'border-blue-400/30 text-blue-200 hover:bg-blue-500/20'
            }
          >
            <Target className="w-4 h-4 mr-2" />
            Habits
          </Button>
          <Button
            onClick={() => setActiveView('analytics')}
            variant={activeView === 'analytics' ? 'default' : 'outline'}
            size="sm"
            className={activeView === 'analytics' 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'border-blue-400/30 text-blue-200 hover:bg-blue-500/20'
            }
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button
            onClick={() => setActiveView('insights')}
            variant={activeView === 'insights' ? 'default' : 'outline'}
            size="sm"
            className={activeView === 'insights' 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'border-blue-400/30 text-blue-200 hover:bg-blue-500/20'
            }
          >
            <Brain className="w-4 h-4 mr-2" />
            Insights
          </Button>
        </div>
      </div>

      {/* View Content */}
      {activeView === 'habits' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {habits.filter(h => !h.archived).length}
                </div>
                <div className="text-blue-200 text-sm">Active Habits</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {habits.filter(h => h.completionRate >= 80).length}
                </div>
                <div className="text-green-200 text-sm">High Performers</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {habits.filter(h => h.currentStreak >= 7).length}
                </div>
                <div className="text-yellow-200 text-sm">Week+ Streaks</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {Math.round(habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length)}%
                </div>
                <div className="text-purple-200 text-sm">Avg Completion</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                <input
                  type="text"
                  placeholder="Search habits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Habits Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredHabits.map((habit) => (
              <Card 
                key={habit.id} 
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => setSelectedHabit(habit)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getMomentIcon(habit.moment)}
                      <div>
                        <h4 className="text-white font-semibold">{habit.title}</h4>
                        <p className="text-blue-200 text-sm">{habit.purpose}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(habit.difficulty)}`}>
                      {habit.difficulty}/3
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200">Completion Rate</span>
                      <span className="text-white font-semibold">{habit.completionRate}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                        style={{ width: `${habit.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-200">{habit.currentStreak} day streak</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-blue-300" />
                      <span className="text-blue-200">{habit.dose?.target}{habit.dose?.unit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <EnhancedHabitDashboard 
          userId={userId}
          habits={habits}
          checkins={checkins}
          metrics={metrics}
        />
      )}

      {activeView === 'insights' && (
        <HabitInsightsEngine 
          userId={userId}
          habits={habits}
          checkins={checkins}
          metrics={metrics}
        />
      )}
    </div>
  );
}
