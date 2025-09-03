'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOMENTS, HABIT_TEMPLATES } from '@/data/habit-templates';
import { habitEngine } from '@/lib/habit-engine';
import { habitDatabaseService } from '@/lib/habit-database-service';
import { Habit, HabitOccurrence, HabitCheckin, Moment } from '@/types';
import { 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  SkipForward, 
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
  Plus,
  AlertCircle,
  MinusCircle,
  XCircle,
  Edit3,
  Trash2
} from 'lucide-react';
import CreateHabitModal from '@/components/CreateHabitModal';

export default function DailyPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<HabitCheckin[]>([]);
  const [currentMoment, setCurrentMoment] = useState<Moment | null>(null);
  const [showStartAllModal, setShowStartAllModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    // Get current moment
    const moment = habitEngine.getCurrentMoment();
    setCurrentMoment(moment);
    
    // Load user data
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // For now, use mock data instead of database connection
      // This will be replaced with real database calls once the schema is set up
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
        }
      ];
      
      setHabits(mockHabits);
      setCheckins(mockCheckins);
      
      // TODO: Replace with real database calls once schema is set up
      // const [userHabits, userCheckins] = await Promise.all([
      //   habitDatabaseService.getHabitsByUser(demoUserId),
      //   habitDatabaseService.getCheckinsByUser(demoUserId, new Date().toISOString().split('T')[0])
      // ]);
      
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getHabitsForMoment = (momentName: string) => {
    return habits.filter(habit => habit.moment === momentName);
  };

  const getCheckinForHabit = (habitId: string, date: string) => {
    return checkins.find(checkin => 
      checkin.habitId === habitId && checkin.date === date
    );
  };

  const getProgressForMoment = (momentName: string) => {
    const momentHabits = getHabitsForMoment(momentName);
    const today = new Date().toISOString().split('T')[0];
    
    const completed = momentHabits.filter(habit => {
      const checkin = getCheckinForHabit(habit.id, today);
      return checkin && checkin.status !== 'skipped';
    }).length;
    
    return { completed, total: momentHabits.length };
  };

  const handleCheckin = async (habitId: string, status: 'done' | 'partial' | 'skipped', effort: number = 2) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const existingCheckin = checkins.find(c => c.habitId === habitId && c.date === today);
      
      if (existingCheckin) {
        // Update existing checkin in local state
        setCheckins(prev => prev.map(c => 
          c.id === existingCheckin.id 
            ? { ...c, status, effort: effort as 0 | 1 | 2 | 3, editedAt: new Date().toISOString() }
            : c
        ));
      } else {
        // Create new checkin in local state
        const newCheckin: HabitCheckin = {
          id: `${habitId}-${today}`,
          userId: 'demo-user',
          habitId,
          date: today,
          status,
          effort: effort as 0 | 1 | 2 | 3,
          createdAt: new Date().toISOString()
        };
        setCheckins(prev => [...prev, newCheckin]);
      }
      
      // TODO: Replace with real database calls once schema is set up
      // if (existingCheckin) {
      //   const updatedCheckin = await habitDatabaseService.updateCheckin(existingCheckin.id, {
      //     status,
      //     effort,
      //     editedAt: new Date().toISOString()
      //   });
      //   setCheckins(prev => prev.map(c => 
      //     c.id === existingCheckin.id ? updatedCheckin : c
      //   ));
      // } else {
      //   const newCheckin = await habitDatabaseService.createCheckin({
      //     userId: 'demo-user',
      //     habitId,
      //     date: today,
      //     status,
      //     effort
      //   });
      //   setCheckins(prev => [...prev, newCheckin]);
      // }
    } catch (err) {
      console.error('Error saving checkin:', err);
      // Fallback to local state update if database fails
      const today = new Date().toISOString().split('T')[0];
      const existingCheckin = checkins.find(c => c.habitId === habitId && c.date === today);
      
      if (existingCheckin) {
        setCheckins(prev => prev.map(c => 
          c.id === existingCheckin.id 
            ? { ...c, status, effort: effort as 0 | 1 | 2 | 3, editedAt: new Date().toISOString() }
            : c
        ));
      } else {
        const newCheckin: HabitCheckin = {
          id: `${habitId}-${today}`,
          userId: 'demo-user',
          habitId,
          date: today,
          status,
          effort: effort as 0 | 1 | 2 | 3,
          createdAt: new Date().toISOString()
        };
        setCheckins(prev => [...prev, newCheckin]);
      }
    }
  };

  const handleCreateHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setHabits(prev => [newHabit, ...prev]);
    setShowCreateModal(false);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCheckins(prev => prev.filter(c => c.habitId !== habitId));
  };

  const handleArchiveHabit = (habitId: string) => {
    setHabits(prev => prev.map(h => 
      h.id === habitId ? { ...h, archived: true } : h
    ));
  };

  const getStatusIcon = (status: 'done' | 'partial' | 'skipped' | undefined) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <Pause className="w-5 h-5 text-yellow-500" />;
      case 'skipped':
        return <SkipForward className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'done' | 'partial' | 'skipped' | undefined) => {
    switch (status) {
      case 'done':
        return 'border-green-500 bg-green-500/10';
      case 'partial':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'skipped':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getTodayProgress = () => {
    const totalHabits = habits.length;
    const completedHabits = checkins.filter(c => 
      c.date === new Date().toISOString().split('T')[0] && c.status !== 'skipped'
    ).length;
    return Math.round((completedHabits / totalHabits) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Your Habits</h2>
          <p className="text-blue-200">Preparing your daily transformation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-blue-200 mb-4">{error}</p>
          <Button onClick={loadUserData} className="bg-yellow-400 text-black hover:bg-yellow-300">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Today&apos;s Habits</h1>
              <p className="text-blue-200 text-lg">
                {currentMoment ? `Focus on your ${currentMoment.name.toLowerCase()} rituals` : 'Plan your day with intention'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Habit</span>
              </button>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-blue-200 text-sm">
                  {currentMoment ? `${currentMoment.name} Time` : 'Choose your moment'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 text-red-200 text-center">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Moment Focus */}
            {currentMoment && (
              <div className="mb-8">
                <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {currentMoment.name} Focus
                      </h2>
                      <p className="text-blue-200 text-lg">
                        {currentMoment.startTime} - {currentMoment.endTime}
                      </p>
                    </div>
                    <div className={`p-4 rounded-2xl ${currentMoment.color} shadow-lg`}>
                      <currentMoment.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {habits
                      .filter(habit => habit.moment === currentMoment.id && !habit.archived)
                      .map(habit => {
                        const checkin = checkins.find(c => c.habitId === habit.id && c.date === new Date().toISOString().split('T')[0]);
                        const progress = checkin ? (checkin.status === 'done' ? 100 : checkin.status === 'partial' ? 50 : 0) : 0;
                        
                        return (
                          <div key={habit.id} className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-xl font-semibold text-white">{habit.title}</h3>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setEditingHabit(habit)}
                                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                      <Edit3 className="w-4 h-4 text-blue-400" />
                                    </button>
                                    <button
                                      onClick={() => handleArchiveHabit(habit.id)}
                                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-blue-200 text-sm mb-3">{habit.purpose}</p>
                                <div className="flex items-center space-x-4 text-sm text-blue-200">
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {habit.window.start} - {habit.window.end}
                                  </span>
                                  {habit.dose && (
                                    <span className="flex items-center">
                                      <Target className="w-4 h-4 mr-2" />
                                      {habit.dose.target} {habit.dose.unit}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="ml-6">
                                <div className="w-24 h-24 relative">
                                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="40"
                                      stroke="currentColor"
                                      strokeWidth="8"
                                      fill="none"
                                      className="text-white/20"
                                    />
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="40"
                                      stroke="currentColor"
                                      strokeWidth="8"
                                      fill="none"
                                      strokeDasharray={`${2 * Math.PI * 40}`}
                                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                                      className="text-blue-400 transition-all duration-500 ease-out"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold text-white">{progress}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleCheckin(habit.id, 'done', 3)}
                                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    checkin?.status === 'done'
                                      ? 'bg-green-500/20 text-green-200 border border-green-400/30 shadow-lg'
                                      : 'bg-white/10 text-white border border-white/20 hover:bg-green-500/20 hover:border-green-400/30 hover:shadow-lg'
                                  }`}
                                >
                                  <CheckCircle className="w-5 h-5 mr-2 inline" />
                                  Done
                                </button>
                                <button
                                  onClick={() => handleCheckin(habit.id, 'partial', 2)}
                                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    checkin?.status === 'partial'
                                      ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30 shadow-lg'
                                      : 'bg-white/10 text-white border border-white/20 hover:bg-yellow-500/20 hover:border-yellow-400/30 hover:shadow-lg'
                                  }`}
                                >
                                  <MinusCircle className="w-5 h-5 mr-2 inline" />
                                  Partial
                                </button>
                                <button
                                  onClick={() => handleCheckin(habit.id, 'skipped', 1)}
                                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    checkin?.status === 'skipped'
                                      ? 'bg-red-500/20 text-red-200 border border-red-400/30 shadow-lg'
                                      : 'bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:border-red-400/30 hover:shadow-lg'
                                  }`}
                                >
                                  <XCircle className="w-5 h-5 mr-2 inline" />
                                  Skip
                                </button>
                              </div>
                              
                              {checkin && (
                                <div className="text-right">
                                  <div className="text-sm text-blue-200 mb-1">
                                    Effort: {checkin.effort}/3
                                  </div>
                                  {checkin.note && (
                                    <div className="text-xs text-blue-300 italic">
                                      &quot;{checkin.note}&quot;
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* All Moments Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOMENTS.map(moment => {
                const momentHabits = habits.filter(habit => habit.moment === moment.id && !habit.archived);
                const completedHabits = momentHabits.filter(habit => {
                  const checkin = checkins.find(c => c.habitId === habit.id && c.date === new Date().toISOString().split('T')[0]);
                  return checkin && checkin.status === 'done';
                });
                const completionRate = momentHabits.length > 0 ? (completedHabits.length / momentHabits.length) * 100 : 0;
                
                return (
                  <div key={moment.id} className="backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className={`bg-gradient-to-r ${moment.color} rounded-t-2xl p-6`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{moment.name}</h3>
                          <p className="text-white/80 text-sm">{moment.startTime} - {moment.endTime}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
                          <moment.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-blue-200 mb-2">
                          <span>Progress</span>
                          <span>{Math.round(completionRate)}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              completionRate === 100 ? 'bg-green-400' : 
                              completionRate > 50 ? 'bg-yellow-400' : 'bg-blue-400'
                            }`}
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {completedHabits.length}/{momentHabits.length}
                        </div>
                        <div className="text-blue-200 text-sm">habits completed</div>
                      </div>
                      
                      {momentHabits.length === 0 && (
                        <div className="text-center py-4">
                          <div className="text-blue-200 text-sm mb-2">No habits scheduled</div>
                          <button 
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-blue-500/20 text-blue-200 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition-colors"
                          >
                            Add Habit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Today&apos;s Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {habits.filter(habit => {
                      const checkin = checkins.find(c => c.habitId === habit.id && c.date === new Date().toISOString().split('T')[0]);
                      return checkin && checkin.status === 'done';
                    }).length}
                  </div>
                  <div className="text-blue-200">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {habits.filter(habit => {
                      const checkin = checkins.find(c => c.habitId === habit.id && c.date === new Date().toISOString().split('T')[0]);
                      return checkin && checkin.status === 'partial';
                    }).length}
                  </div>
                  <div className="text-blue-200">Partial</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {habits.filter(habit => {
                      const checkin = checkins.find(c => c.habitId === habit.id && c.date === new Date().toISOString().split('T')[0]);
                      return checkin && checkin.status === 'skipped';
                    }).length}
                  </div>
                  <div className="text-blue-200">Skipped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {habits.filter(habit => {
                      const checkin = checkins.find(c => c.habitId === habit.id && c.date === new Date().toISOString().split('T')[0]);
                      return !checkin;
                    }).length}
                  </div>
                  <div className="text-blue-200">Pending</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Habit Modal */}
      <CreateHabitModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateHabit}
      />
    </div>
  );
}
