'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Habit, HabitCheckin } from '@/types';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Brain, 
  Target, 
  Clock, 
  TrendingUp,
  Calendar,
  Sparkles,
  Lightbulb,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Settings,
  Filter,
  Search
} from 'lucide-react';
import CreateHabitModal from '@/components/CreateHabitModal';
import Link from 'next/link';

export default function HabitsPage() {
  const { user } = useSupabaseAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<HabitCheckin[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMoment, setFilterMoment] = useState<string>('all');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [addedAIHabits, setAddedAIHabits] = useState<Set<string>>(new Set());
  const [newlyAddedHabitId, setNewlyAddedHabitId] = useState<string | null>(null);

  useEffect(() => {
    loadHabits();
  }, []);

  const saveHabitsToStorage = (habitsToSave: Habit[]) => {
    try {
      localStorage.setItem('ascend-habits', JSON.stringify(habitsToSave));
    } catch (error) {
      console.error('Error saving habits to localStorage:', error);
    }
  };

  const saveAddedAIHabitsToStorage = (addedHabits: Set<string>) => {
    try {
      localStorage.setItem('ascend-added-ai-habits', JSON.stringify(Array.from(addedHabits)));
    } catch (error) {
      console.error('Error saving added AI habits to localStorage:', error);
    }
  };

  const clearAllData = () => {
    try {
      localStorage.removeItem('ascend-habits');
      localStorage.removeItem('ascend-added-ai-habits');
      setHabits([]);
      setAddedAIHabits(new Set());
      alert('All habit data has been cleared.');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const loadHabits = async () => {
    try {
      if (!user?.id) {
        console.log('No user ID available');
        setHabits([]);
        return;
      }

      // Check if this is a demo user
      const isDemoUser = user.isDemoUser || localStorage.getItem('ascend-demo-mode') === 'true';
      
      if (isDemoUser) {
        console.log('🚀 Loading demo habits for demo user');
        const demoHabits = localStorage.getItem('ascend-habits');
        if (demoHabits) {
          const habits = JSON.parse(demoHabits);
          setHabits(habits);
          return;
        }
      }

      console.log('🔄 Loading real user habits for:', user.id);
      
      // Load real habits from database
      const dbHabits = await databaseService.getHabits(user.id);
      console.log('📊 Loaded habits from database:', dbHabits.length);
      
      if (dbHabits.length === 0) {
        console.log('📝 No habits found - user needs to create habits first');
        setHabits([]);
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

      setHabits(userHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
      setHabits([]);
    }
  };

  const handleCreateHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // TODO: Replace with real API call once backend is fully set up
      // const response = await fetch('/api/habits', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: 'demo-user',
      //     habitName: habitData.title,
      //     category: habitData.category || 'spiritual',
      //     frequency: habitData.cadence.type,
      //     targetCount: habitData.cadence.target || 1,
      //     description: habitData.purpose,
      //     priority: habitData.priority || 'medium'
      //   })
      // });
      // 
      // if (response.ok) {
      //   const data = await response.json();
      //   setHabits(prev => [...prev, data.data]);
      //   setShowCreateModal(false);
      //   return;
      // }
      
      // For now, use local storage
      const newHabit: Habit = {
        ...habitData,
        id: `habit-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      saveHabitsToStorage(updatedHabits);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating habit:', error);
      alert('Failed to create habit. Please try again.');
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      // TODO: Replace with real API call once backend is fully set up
      // const response = await fetch(`/api/habits/${habitId}`, {
      //   method: 'DELETE'
      // });
      // 
      // if (response.ok) {
      //   const updatedHabits = habits.filter(h => h.id !== habitId);
      //   setHabits(updatedHabits);
      //   saveHabitsToStorage(updatedHabits);
      //   return;
      // }
      
      // For now, use local storage
      const updatedHabits = habits.filter(h => h.id !== habitId);
      setHabits(updatedHabits);
      saveHabitsToStorage(updatedHabits);
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit. Please try again.');
    }
  };

  const handleAddAISuggestedHabit = (aiHabit: any) => {
    // Convert AI suggested habit to regular habit format
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      userId: 'demo-user',
      title: aiHabit.title,
      purpose: aiHabit.purpose,
      moment: aiHabit.moment,
      cadence: aiHabit.cadence,
      dose: aiHabit.dose,
      window: aiHabit.window,
      difficulty: aiHabit.difficulty,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to habits list
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    saveHabitsToStorage(updatedHabits);

    // Mark this AI habit as added
    const updatedAddedAIHabits = new Set(addedAIHabits).add(aiHabit.id);
    setAddedAIHabits(updatedAddedAIHabits);
    saveAddedAIHabitsToStorage(updatedAddedAIHabits);

    // Set newly added habit for highlighting
    setNewlyAddedHabitId(newHabit.id);

    // Clear the highlight after 3 seconds
    setTimeout(() => setNewlyAddedHabitId(null), 3000);

    // Show success message (you can enhance this with a proper toast notification)
    alert(`✅ "${aiHabit.title}" has been added to your habits!`);
  };

  const getHabitStats = (habit: Habit) => {
    // Mock stats - replace with real data
    const totalDays = 30;
    const completedDays = Math.floor(Math.random() * totalDays);
    const streak = Math.floor(Math.random() * 15);
    const successRate = Math.round((completedDays / totalDays) * 100);
    
    return { totalDays, completedDays, streak, successRate };
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getMomentColor = (moment: string) => {
    switch (moment) {
      case 'morning': return 'text-blue-400';
      case 'midday': return 'text-green-400';
      case 'evening': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || true; // Add category logic later
    const matchesMoment = filterMoment === 'all' || habit.moment === filterMoment;
    
    return matchesSearch && matchesCategory && matchesMoment;
  });

  const generateAIRecommendations = () => {
    return [
      {
        type: 'timing',
        title: 'Optimize Morning Routine',
        description: 'Your morning habits have a 23% higher success rate when started before 7:00 AM',
        confidence: 87,
        action: 'Adjust workout time to 6:30 AM'
      },
      {
        type: 'difficulty',
        title: 'Progressive Difficulty',
        description: 'Consider increasing workout difficulty gradually as you build consistency',
        confidence: 92,
        action: 'Increase workout difficulty to level 3'
      },
      {
        type: 'new_habit',
        title: 'Add Evening Reflection',
        description: 'Based on your spiritual morning habit, an evening reflection could complement your routine',
        confidence: 78,
        action: 'Create evening reflection habit'
      }
    ];
  };

  const generateAISuggestedHabits = () => {
    return [
      {
        id: 'ai-1',
        title: 'Mindful Breathing',
        purpose: 'Reduce stress and improve focus throughout the day',
        moment: 'midday',
        cadence: { type: 'daily' },
        dose: { unit: 'minutes', target: 5 },
        window: { start: '12:00', end: '14:00' },
        difficulty: 1,
        confidence: 94,
        reason: 'Based on your high stress levels during work hours',
        category: 'mental-wellness'
      },
      {
        id: 'ai-2',
        title: 'Gratitude Journaling',
        purpose: 'Build positive mindset and emotional resilience',
        moment: 'evening',
        cadence: { type: 'daily' },
        dose: { unit: 'entries', target: 3 },
        window: { start: '20:00', end: '21:00' },
        difficulty: 1,
        confidence: 89,
        reason: 'Complements your spiritual morning routine',
        category: 'spiritual-growth'
      },
      {
        id: 'ai-3',
        title: 'Power Walking',
        purpose: 'Boost energy and maintain physical health',
        moment: 'morning',
        cadence: { type: 'daily' },
        dose: { unit: 'minutes', target: 15 },
        window: { start: '06:00', end: '08:00' },
        difficulty: 2,
        confidence: 87,
        reason: 'Lower impact alternative to your current workout',
        category: 'physical-health'
      },
      {
        id: 'ai-4',
        title: 'Digital Detox Hour',
        purpose: 'Improve sleep quality and reduce screen time',
        moment: 'evening',
        cadence: { type: 'daily' },
        dose: { unit: 'minutes', target: 60 },
        window: { start: '21:00', end: '22:00' },
        difficulty: 2,
        confidence: 82,
        reason: 'Addresses your evening screen time patterns',
        category: 'digital-wellness'
      }
    ];
  };

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Habit Management</h1>
          <p className="text-blue-200">Create, edit, and optimize your habits with AI-powered insights</p>
        </div>
                 <div className="flex flex-col sm:flex-row gap-2">
           <Button
             onClick={() => setShowAIInsights(!showAIInsights)}
             className="bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700"
           >
             <Brain className="w-4 h-4 mr-2" />
             AI Insights
           </Button>
           <Button
             onClick={() => setShowCreateModal(true)}
             className="bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700"
           >
             <Plus className="w-4 h-4 mr-2" />
             Add Habit
           </Button>
           <Button
             onClick={clearAllData}
             variant="outline"
             className="border-red-400/30 text-red-200 hover:bg-red-500/20"
           >
             <Trash2 className="w-4 h-4 mr-2" />
             Clear Data
           </Button>
         </div>
             </div>

       {/* Data Persistence Info */}
       <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3">
         <div className="flex items-center justify-between">
           <p className="text-blue-200 text-sm">
             💾 Your habits are automatically saved locally and will persist between sessions
           </p>
           <span className="text-blue-300 text-sm font-medium">
             {habits.length} habit{habits.length !== 1 ? 's' : ''} saved
           </span>
         </div>
       </div>

       {/* AI Insights Panel */}
      {showAIInsights && (
        <Card className="bg-gradient-to-r from-purple-500/20 to-blue-600/20 border-purple-400/30">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              AI-Powered Habit Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generateAIRecommendations().map((rec, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600">
                      {rec.type === 'timing' && <Clock className="w-4 h-4 text-white" />}
                      {rec.type === 'difficulty' && <Target className="w-4 h-4 text-white" />}
                      {rec.type === 'new_habit' && <Sparkles className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">{rec.title}</h4>
                      <p className="text-blue-200 text-xs mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200 text-xs">Confidence: {rec.confidence}%</span>
                        <button className="text-purple-400 hover:text-purple-300 text-xs font-medium">
                          {rec.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI-Suggested New Habits */}
      <Card className="bg-gradient-to-r from-green-500/20 to-blue-600/20 border-green-400/30">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Sparkles className="w-5 h-5 mr-2 text-green-400" />
            AI-Suggested New Habits
            <span className="ml-2 text-sm text-green-200 font-normal">Based on your patterns & goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {generateAISuggestedHabits().map((habit) => (
               <div key={habit.id} className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                 addedAIHabits.has(habit.id) 
                   ? 'border-green-400/50 bg-green-500/5' 
                   : 'border-white/20 hover:border-green-400/40'
               }`}>
                                 <div className="flex items-start justify-between mb-3">
                   <div className="flex-1">
                     <h4 className="text-white font-semibold text-sm mb-1">{habit.title}</h4>
                     <p className="text-blue-200 text-xs mb-2">{habit.purpose}</p>
                   </div>
                   <div className="flex items-center space-x-2 ml-2">
                     {addedAIHabits.has(habit.id) && (
                       <span className="px-2 py-1 bg-green-600/30 text-green-200 text-xs rounded-full flex items-center">
                         <CheckCircle className="w-3 h-3 mr-1" />
                         Added
                       </span>
                     )}
                     <span className="px-2 py-1 bg-green-500/20 text-green-200 text-xs rounded-full">
                       {habit.confidence}% match
                     </span>
                   </div>
                 </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-xs">
                    <Clock className="w-3 h-3 text-blue-200" />
                    <span className="text-white">{habit.window.start} - {habit.window.end}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <Target className="w-3 h-3 text-green-200" />
                    <span className="text-white">{habit.dose.target} {habit.dose.unit}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={`${getDifficultyColor(habit.difficulty)}`}>
                      Difficulty: {habit.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-2 mb-3">
                  <p className="text-green-200 text-xs italic">"{habit.reason}"</p>
                </div>
                
                                 <div className="flex space-x-2">
                   {addedAIHabits.has(habit.id) ? (
                     <button
                       disabled
                       className="flex-1 px-3 py-2 bg-green-600/50 text-green-200 text-xs rounded-lg cursor-not-allowed flex items-center justify-center"
                     >
                       <CheckCircle className="w-3 h-3 mr-1" />
                       Added ✓
                     </button>
                   ) : (
                     <button
                       onClick={() => handleAddAISuggestedHabit(habit)}
                       className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white text-xs rounded-lg hover:from-green-400 hover:to-blue-500 transition-all text-center"
                     >
                       Add This Habit
                     </button>
                   )}
                   <button className="px-3 py-2 bg-white/10 text-blue-200 text-xs rounded-lg hover:bg-white/20 transition-all">
                     Learn More
                   </button>
                 </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-200" />
                <input
                  type="text"
                  placeholder="Search habits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
            </div>
            <select
              value={filterMoment}
              onChange={(e) => setFilterMoment(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-400/50"
            >
              <option value="all">All Moments</option>
              <option value="morning">Morning</option>
              <option value="midday">Midday</option>
              <option value="evening">Evening</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHabits.map((habit) => {
          const stats = getHabitStats(habit);
          return (
                         <Card key={habit.id} className={`bg-white/10 backdrop-blur-sm border transition-all ${
               newlyAddedHabitId === habit.id 
                 ? 'border-green-400/50 bg-green-500/10 ring-2 ring-green-400/30' 
                 : 'border-white/20 hover:border-white/40'
             }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white text-lg mb-2">{habit.title}</CardTitle>
                    <p className="text-blue-200 text-sm line-clamp-2">{habit.purpose}</p>
                  </div>
                                     <div className="flex items-center space-x-2 ml-2">
                     {newlyAddedHabitId === habit.id && (
                       <span className="px-2 py-1 bg-green-600/30 text-green-200 text-xs rounded-full flex items-center">
                         <Sparkles className="w-3 h-3 mr-1" />
                         New
                       </span>
                     )}
                     <button
                       onClick={() => setSelectedHabit(habit)}
                       className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                     >
                       <Eye className="w-4 h-4 text-blue-200" />
                     </button>
                     <button
                       onClick={() => setEditingHabit(habit)}
                       className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                     >
                       <Edit3 className="w-4 h-4 text-yellow-400" />
                     </button>
                     <button
                       onClick={() => handleDeleteHabit(habit.id)}
                       className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                     >
                       <Trash2 className="w-4 h-4 text-red-400" />
                     </button>
                   </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Habit Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-200" />
                    <span className="text-white">{habit.window.start} - {habit.window.end}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-200" />
                    <span className="text-white">{habit.dose.target} {habit.dose.unit}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`${getDifficultyColor(habit.difficulty)}`}>
                      Difficulty: {habit.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`${getMomentColor(habit.moment)}`}>
                      {habit.moment.charAt(0).toUpperCase() + habit.moment.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Success Rate</span>
                    <span className="text-white font-semibold">{stats.successRate}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        stats.successRate >= 80 ? 'bg-green-400' :
                        stats.successRate >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${stats.successRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-blue-200">
                    <span>Current Streak: {stats.streak} days</span>
                    <span>{stats.completedDays}/{stats.totalDays} days</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2">
                  <Link
                    href={`/daily?habit=${habit.id}`}
                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-200 text-sm rounded-lg hover:bg-blue-500/30 transition-colors text-center"
                  >
                    Check-in
                  </Link>
                  <Link
                    href={`/analytics?tab=ai-insights&habit=${habit.id}`}
                    className="flex-1 px-3 py-2 bg-purple-500/20 text-purple-200 text-sm rounded-lg hover:bg-purple-500/30 transition-colors text-center"
                  >
                    AI Analysis
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredHabits.length === 0 && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-blue-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Habits Found</h3>
            <p className="text-blue-200 mb-6">
              {searchTerm || filterMoment !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first habit to start building positive routines'
              }
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Habit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Habit Modal */}
      <CreateHabitModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateHabit}
      />
    </div>
  );
}
