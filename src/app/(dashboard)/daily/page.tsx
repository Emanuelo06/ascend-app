'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOMENTS, HABIT_TEMPLATES } from '@/data/habit-templates';
import { habitEngine } from '@/lib/habit-engine';
import { habitDatabaseService } from '@/lib/habit-database-service';
import { Habit, HabitOccurrence, HabitCheckin, Moment } from '@/types';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
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
  Trash2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  RotateCcw,
  Archive,
  Eye,
  Settings,
  Brain,
  Zap,
  Activity,
  Award,
  Users,
  Heart,
  BookOpen,
  Dumbbell,
  DollarSign,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';
import CreateHabitModal from '@/components/CreateHabitModal';

export default function DailyPage() {
  const { user } = useSupabaseAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<HabitCheckin[]>([]);
  const [currentMoment, setCurrentMoment] = useState<Moment | null>(null);
  const [showStartAllModal, setShowStartAllModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [expandedMoments, setExpandedMoments] = useState<Set<string>>(new Set(['morning']));
  const [showHabitDetails, setShowHabitDetails] = useState<string | null>(null);
  const [habitStats, setHabitStats] = useState<Record<string, { streak: number; completionRate: number; lastCompleted: string | null }>>({});
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

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
      
      if (!user?.id) {
        console.log('No user ID available');
        setHabits([]);
        setCheckins([]);
        setLoading(false);
        return;
      }

      // Check if this is a demo user
      const isDemoUser = user.isDemoUser || localStorage.getItem('ascend-demo-mode') === 'true';
      
      if (isDemoUser) {
        console.log('🚀 Loading demo data for demo user');
        const demoHabits = localStorage.getItem('ascend-habits');
        const demoCheckins = localStorage.getItem('ascend-checkins');
        
        if (demoHabits) {
          const habits = JSON.parse(demoHabits);
          setHabits(habits);
        }
        
        if (demoCheckins) {
          const checkins = JSON.parse(demoCheckins);
          setCheckins(checkins);
        }
        
        setLoading(false);
        return;
      }

      console.log('🔄 Loading real user habits for:', user.id);
      
      // Load real habits from database
      const dbHabits = await databaseService.getHabits(user.id);
      console.log('📊 Loaded habits from database:', dbHabits.length);
      
      if (dbHabits.length === 0) {
        console.log('📝 No habits found - user needs to create habits first');
        setHabits([]);
        setCheckins([]);
        setLoading(false);
        return;
      }
      
      // Convert database habits to the format expected by the component
      const userHabits: Habit[] = dbHabits.map(habit => ({
        id: habit.id,
        userId: habit.user_id,
        title: habit.title,
        purpose: habit.purpose || '',
        moment: habit.metadata?.moment || 'morning',
        category: habit.metadata?.category || 'general',
        priority: habit.metadata?.priority || 'medium',
        cadence: habit.cadence || { type: 'daily' },
        dose: habit.dose || { unit: 'times', target: 1 },
        window: habit.window || { start: '06:00', end: '22:00' },
        difficulty: habit.difficulty || 1,
        archived: habit.archived || false,
        createdAt: habit.created_at,
        updatedAt: habit.updated_at
      }));

      // Load today's check-ins
      const today = new Date().toISOString().split('T')[0];
      const dbCheckins = await databaseService.getHabitCheckins(user.id, undefined, today);
      console.log('📊 Loaded check-ins for today:', dbCheckins.length);
      
      const userCheckins: HabitCheckin[] = dbCheckins.map(checkin => ({
        id: checkin.id,
        userId: checkin.user_id,
        habitId: checkin.habit_id,
        date: checkin.date,
        status: checkin.completed ? 'done' : 'pending',
        effort: checkin.effort || 1,
        doseActual: checkin.dose_actual || 0,
        note: checkin.notes || '',
        createdAt: checkin.created_at
      }));

      setHabits(userHabits);
      setCheckins(userCheckins);
      
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load habits. Please try again.');
      setHabits([]);
      setCheckins([]);
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
    
    // Initialize stats for the new habit
    setHabitStats(prev => ({
      ...prev,
      [newHabit.id]: {
        streak: 0,
        completionRate: 0,
        lastCompleted: null
      }
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCheckins(prev => prev.filter(c => c.habitId !== habitId));
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowCreateModal(true);
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

  const toggleMomentExpansion = (momentName: string) => {
    setExpandedMoments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(momentName)) {
        newSet.delete(momentName);
      } else {
        newSet.add(momentName);
      }
      return newSet;
    });
  };

  const getHabitStats = (habitId: string) => {
    if (!habitStats[habitId]) {
      // Initialize stats if they don't exist
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        const stats = {
          streak: Math.floor(Math.random() * 7) + 1,
          completionRate: Math.floor(Math.random() * 40) + 60,
          lastCompleted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        setHabitStats(prev => ({ ...prev, [habitId]: stats }));
        return stats;
      }
      return { streak: 0, completionRate: 0, lastCompleted: null };
    }
    return habitStats[habitId];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spiritual': return Heart;
      case 'physical': return Dumbbell;
      case 'mental': return Brain;
      case 'relational': return Users;
      case 'financial': return DollarSign;
      default: return Target;
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
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
                const isExpanded = expandedMoments.has(moment.id);
                
                return (
                  <div key={moment.id} className="backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className={`bg-gradient-to-r ${moment.color} rounded-t-2xl p-6`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{moment.name}</h3>
                          <p className="text-white/80 text-sm">{moment.startTime} - {moment.endTime}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
                            <moment.icon className="w-6 h-6 text-white" />
                          </div>
                          <button
                            onClick={() => toggleMomentExpansion(moment.id)}
                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-white" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-white" />
                            )}
                          </button>
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
                      
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-white mb-1">
                          {completedHabits.length}/{momentHabits.length}
                        </div>
                        <div className="text-blue-200 text-sm">habits completed</div>
                      </div>

                      {/* Expandable Habit List */}
                      {isExpanded && momentHabits.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {momentHabits.map(habit => {
                            const checkin = getCheckinForHabit(habit.id, new Date().toISOString().split('T')[0]);
                            const stats = getHabitStats(habit.id);
                            const CategoryIcon = getCategoryIcon(habit.category || 'spiritual');
                            
                            return (
                              <div key={habit.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <CategoryIcon className={`w-5 h-5 ${getDifficultyColor(habit.difficulty)}`} />
                                    <div>
                                      <h4 className="text-white font-semibold text-sm">{habit.title}</h4>
                                      <p className="text-blue-200 text-xs">{habit.purpose}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(habit.priority || 'medium')}`}>
                                      {habit.priority || 'medium'}
                                    </span>
                                    <button
                                      onClick={() => setShowHabitDetails(showHabitDetails === habit.id ? null : habit.id)}
                                      className="p-1 rounded hover:bg-white/10 transition-colors"
                                    >
                                      <MoreHorizontal className="w-4 h-4 text-blue-200" />
                                    </button>
                                  </div>
                                </div>

                                {/* Habit Details */}
                                {showHabitDetails === habit.id && (
                                  <div className="space-y-3 pt-3 border-t border-white/10">
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                      <div>
                                        <div className="text-lg font-bold text-green-400">{stats.streak}</div>
                                        <div className="text-blue-200 text-xs">Day Streak</div>
                                      </div>
                                      <div>
                                        <div className="text-lg font-bold text-blue-400">{stats.completionRate}%</div>
                                        <div className="text-blue-200 text-xs">Success Rate</div>
                                      </div>
                                      <div>
                                        <div className="text-lg font-bold text-purple-400">
                                          {habit.dose?.target || 0} {habit.dose?.unit || 'units'}
                                        </div>
                                        <div className="text-blue-200 text-xs">Target</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleEditHabit(habit)}
                                        className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-200 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition-colors text-sm"
                                      >
                                        <Edit3 className="w-4 h-4 mr-1 inline" />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleArchiveHabit(habit.id)}
                                        className="px-3 py-2 bg-yellow-500/20 text-yellow-200 rounded-lg border border-yellow-400/30 hover:bg-yellow-500/30 transition-colors text-sm"
                                      >
                                        <Archive className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteHabit(habit.id)}
                                        className="px-3 py-2 bg-red-500/20 text-red-200 rounded-lg border border-red-400/30 hover:bg-red-500/30 transition-colors text-sm"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Check-in Status */}
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-blue-300">
                                    {habit.window.start} - {habit.window.end}
                                  </div>
                                  <div className="flex space-x-2">
                                    {checkin ? (
                                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(checkin.status)}`}>
                                        {getStatusIcon(checkin.status)}
                                        <span className="ml-1 capitalize">{checkin.status}</span>
                                      </div>
                                    ) : (
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() => handleCheckin(habit.id, 'done', 2)}
                                          className="px-3 py-1 bg-green-500/20 text-green-200 rounded-full text-xs border border-green-400/30 hover:bg-green-500/30 transition-colors"
                                        >
                                          Done
                                        </button>
                                        <button
                                          onClick={() => handleCheckin(habit.id, 'partial', 1)}
                                          className="px-3 py-1 bg-yellow-500/20 text-yellow-200 rounded-full text-xs border border-yellow-400/30 hover:bg-yellow-500/30 transition-colors"
                                        >
                                          Partial
                                        </button>
                                        <button
                                          onClick={() => handleCheckin(habit.id, 'skipped', 0)}
                                          className="px-3 py-1 bg-red-500/20 text-red-200 rounded-full text-xs border border-red-400/30 hover:bg-red-500/30 transition-colors"
                                        >
                                          Skip
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

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
          onSubmit={handleCreateHabit}
          userId="demo-user"
        />
    </div>
  );
}
