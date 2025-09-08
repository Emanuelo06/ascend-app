'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOMENTS, HABIT_TEMPLATES } from '@/data/habit-templates';
import { habitEngine } from '@/lib/habit-engine';
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
  Sparkles
} from 'lucide-react';

// Real user data will be loaded from database

export default function EnhancedDailyPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<HabitCheckin[]>([]);
  const [currentMoment, setCurrentMoment] = useState<Moment | null>(null);
  const [showStartAllModal, setShowStartAllModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
      
      // Get user from context (you'll need to import useSupabaseAuth)
      const { useSupabaseAuth } = await import('@/contexts/SupabaseAuthContext');
      const { user } = useSupabaseAuth();
      
      if (!user?.id) {
        console.log('No user ID available');
        setHabits([]);
        setCheckins([]);
        setLoading(false);
        return;
      }

      console.log('🔄 Loading real user habits for enhanced daily page:', user.id);
      
      // Load real habits from database
      const { databaseService } = await import('@/lib/supabase');
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
      
    } catch (error) {
      console.error('Error loading user data:', error);
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

  const handleCheckin = (habitId: string, status: 'done' | 'partial' | 'skipped', effort: number = 2) => {
    const today = new Date().toISOString().split('T')[0];
    const existingCheckin = checkins.find(c => c.habitId === habitId && c.date === today);
    
    if (existingCheckin) {
      // Update existing checkin
      setCheckins(prev => prev.map(c => 
        c.id === existingCheckin.id 
          ? { ...c, status, effort, editedAt: new Date().toISOString() }
          : c
      ));
    } else {
      // Create new checkin
      const newCheckin: HabitCheckin = {
        id: `${habitId}-${today}`,
        userId: 'demo-user',
        habitId,
        date: today,
        status,
        effort,
        createdAt: new Date().toISOString()
      };
      setCheckins(prev => [...prev, newCheckin]);
    }
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
        return 'border-green-500 bg-green-50';
      case 'partial':
        return 'border-yellow-500 bg-yellow-50';
      case 'skipped':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, Emanuele 🌅
              </h1>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {/* Progress Ring */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {getTodayProgress()}%
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-500 transform rotate-90"
                   style={{
                     background: `conic-gradient(from 0deg, #3b82f6 ${getTodayProgress() * 3.6}deg, transparent 0deg)`
                   }}>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Moment Highlight */}
        {currentMoment && (
          <div className="mb-8">
            <div className={`bg-gradient-to-r ${currentMoment.color} rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="text-3xl mr-3">{currentMoment.icon}</span>
                    {currentMoment.displayName} Moment
                  </h2>
                  <p className="text-white/90 mt-2">
                    {currentMoment.startTime} - {currentMoment.endTime}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {getProgressForMoment(currentMoment.name).completed}/{getProgressForMoment(currentMoment.name).total}
                  </div>
                  <div className="text-white/80">habits done</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Moments */}
        <div className="space-y-8">
          {MOMENTS.map((moment) => {
            const momentHabits = getHabitsForMoment(moment.name);
            const progress = getProgressForMoment(moment.name);
            
            if (momentHabits.length === 0) return null;

            return (
              <Card key={moment.id} className="shadow-lg border-0">
                <CardHeader className={`bg-gradient-to-r ${moment.color} rounded-t-lg`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <span className="text-2xl mr-3">{moment.icon}</span>
                      {moment.displayName}
                    </CardTitle>
                    <div className="text-white text-right">
                      <div className="text-2xl font-bold">{progress.completed}/{progress.total}</div>
                      <div className="text-white/80 text-sm">habits done</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {progress.total > 0 && (
                    <div className="mb-4">
                      <Button 
                        onClick={() => setShowStartAllModal(true)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start All {moment.displayName} Habits
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {momentHabits.map((habit) => {
                      const today = new Date().toISOString().split('T')[0];
                      const checkin = getCheckinForHabit(habit.id, today);
                      const isDue = habitEngine.isHabitDue(habit, {
                        id: `${habit.id}-${today}`,
                        userId: habit.userId,
                        habitId: habit.id,
                        date: today,
                        windowStart: new Date().toISOString(),
                        windowEnd: new Date().toISOString(),
                        dueAt: new Date().toISOString()
                      } as HabitOccurrence);
                      
                      return (
                        <div 
                          key={habit.id}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${getStatusColor(checkin?.status)} ${
                            isDue ? 'ring-2 ring-blue-200' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                {getStatusIcon(checkin?.status)}
                                <div>
                                  <h3 className="font-semibold text-gray-900">{habit.title}</h3>
                                  {habit.purpose && (
                                    <p className="text-sm text-gray-600 mt-1">{habit.purpose}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4 mt-3">
                                {habit.dose && (
                                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                                    <Target className="w-4 h-4" />
                                    <span>{habit.dose.target} {habit.dose.unit}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>🔥 7</span>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                  <Calendar className="w-4 h-4" />
                                  <span>84%</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {!checkin && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCheckin(habit.id, 'partial', 1)}
                                    className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                                  >
                                    Partial
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleCheckin(habit.id, 'done', 2)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Done
                                  </Button>
                                </>
                              )}
                              
                              {checkin && (
                                <div className="text-center">
                                  <div className="text-sm font-medium text-gray-900">
                                    {checkin.status === 'done' ? 'Completed!' : 
                                     checkin.status === 'partial' ? 'Partial' : 'Skipped'}
                                  </div>
                                  {checkin.effort > 0 && (
                                    <div className="text-xs text-gray-500">
                                      Effort: {checkin.effort}/3
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {momentHabits.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No habits for this moment yet</p>
                      <Button variant="outline" className="mt-3">
                        Add from Template
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
