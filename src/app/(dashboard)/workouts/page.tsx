'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { 
  DumbbellIcon,
  ClockIcon,
  TargetIcon,
  TrendingUpIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  BarChart3Icon,
  HeartIcon,
  ZapIcon,
  BrainIcon,
  TimerIcon,
  RepeatIcon,
  WeightIcon
} from 'lucide-react';

interface WorkoutPlan {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed' | 'recovery';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: WorkoutExercise[];
  createdAt: string;
  completed: boolean;
}

interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  duration?: string;
  rest: string;
  instructions: string;
  muscleGroups: string[];
}

export default function WorkoutsPage() {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<'strength' | 'cardio' | 'flexibility' | 'mixed' | 'recovery'>('strength');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load existing workout plans
    loadWorkoutPlans();
  }, [user, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && currentWorkout) {
      interval = setInterval(() => {
        setExerciseTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, currentWorkout]);

  const loadWorkoutPlans = async () => {
    // Simulate loading workout plans
    setTimeout(() => {
      setWorkoutPlans([
        {
          id: '1',
          name: 'Upper Body Strength',
          type: 'strength',
          duration: 45,
          difficulty: 'intermediate',
          exercises: [
            {
              id: '1',
              name: 'Push-ups',
              sets: 3,
              reps: '10-15',
              rest: '60s',
              instructions: 'Keep your body straight, lower chest to ground',
              muscleGroups: ['Chest', 'Triceps', 'Shoulders']
            },
            {
              id: '2',
              name: 'Pull-ups',
              sets: 3,
              reps: '8-12',
              rest: '90s',
              instructions: 'Pull your chin above the bar',
              muscleGroups: ['Back', 'Biceps']
            }
          ],
          createdAt: '2024-01-15',
          completed: true
        }
      ]);
    }, 1000);
  };

  const generateWorkout = async () => {
    setIsGenerating(true);
    
    // Simulate AI workout generation
    setTimeout(() => {
      const newWorkout: WorkoutPlan = {
        id: Date.now().toString(),
        name: `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Training`,
        type: selectedType,
        duration: selectedDuration,
        difficulty: 'intermediate',
        exercises: generateExercises(selectedType, selectedDuration),
        createdAt: new Date().toISOString(),
        completed: false
      };
      
      setWorkoutPlans(prev => [newWorkout, ...prev]);
      setCurrentWorkout(newWorkout);
      setIsGenerating(false);
    }, 2000);
  };

  const generateExercises = (type: string, duration: number): WorkoutExercise[] => {
    const exercises: WorkoutExercise[] = [];
    const exerciseCount = Math.floor(duration / 10);
    
    for (let i = 0; i < exerciseCount; i++) {
      exercises.push({
        id: (i + 1).toString(),
        name: `Exercise ${i + 1}`,
        sets: 3,
        reps: '10-15',
        rest: '60s',
        instructions: 'Perform with proper form and controlled movement',
        muscleGroups: ['Full Body']
      });
    }
    
    return exercises;
  };

  const startWorkout = (workout: WorkoutPlan) => {
    setCurrentWorkout(workout);
    setIsWorkoutActive(true);
    setCurrentExerciseIndex(0);
    setExerciseTimer(0);
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const resumeWorkout = () => {
    setIsWorkoutActive(true);
  };

  const completeWorkout = () => {
    if (currentWorkout) {
      setWorkoutPlans(prev => 
        prev.map(w => 
          w.id === currentWorkout.id ? { ...w, completed: true } : w
        )
      );
      setCurrentWorkout(null);
      setIsWorkoutActive(false);
      setCurrentExerciseIndex(0);
      setExerciseTimer(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ASCEND
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Workout Plans</h2>
          <p className="text-slate-600">
            Get personalized workout plans generated by AI based on your goals and preferences
          </p>
        </div>

        {/* Generate New Workout */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Generate New Workout</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Workout Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Workout Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="strength">Strength Training</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="mixed">Mixed</option>
                <option value="recovery">Recovery</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generateWorkout}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <BrainIcon className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ZapIcon className="w-5 h-5 mr-2" />
                    Generate Workout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Current Workout */}
        {currentWorkout && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Current Workout: {currentWorkout.name}</h3>
              <div className="flex items-center space-x-4">
                {isWorkoutActive ? (
                  <button
                    onClick={pauseWorkout}
                    className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                  >
                    <PauseIcon className="w-4 h-4 mr-2" />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={resumeWorkout}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Resume
                  </button>
                )}
                <button
                  onClick={completeWorkout}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Complete
                </button>
              </div>
            </div>

            {/* Workout Timer */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-4">
                <TimerIcon className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {formatTime(exerciseTimer)}
                </span>
                <span className="text-slate-600">Workout Time</span>
              </div>
            </div>

            {/* Current Exercise */}
            {currentWorkout.exercises[currentExerciseIndex] && (
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  Exercise {currentExerciseIndex + 1} of {currentWorkout.exercises.length}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">
                      {currentWorkout.exercises[currentExerciseIndex].name}
                    </h5>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Sets: {currentWorkout.exercises[currentExerciseIndex].sets}</p>
                      <p>Reps: {currentWorkout.exercises[currentExerciseIndex].reps}</p>
                      <p>Rest: {currentWorkout.exercises[currentExerciseIndex].rest}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">
                      {currentWorkout.exercises[currentExerciseIndex].instructions}
                    </p>
                    <div className="mt-3">
                      <p className="text-xs text-slate-500">Muscle Groups:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentWorkout.exercises[currentExerciseIndex].muscleGroups.map((muscle, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Exercise Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
                disabled={currentExerciseIndex === 0}
                className="px-4 py-2 text-slate-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous Exercise
              </button>
              
              <span className="text-sm text-slate-600">
                {currentExerciseIndex + 1} / {currentWorkout.exercises.length}
              </span>
              
              <button
                onClick={() => setCurrentExerciseIndex(prev => Math.min(currentWorkout.exercises.length - 1, prev + 1))}
                disabled={currentExerciseIndex === currentWorkout.exercises.length - 1}
                className="px-4 py-2 text-slate-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next Exercise
              </button>
            </div>
          </div>
        )}

        {/* Workout History */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Workout History</h3>
          
          {workoutPlans.length === 0 ? (
            <div className="text-center py-12">
              <DumbbellIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No workouts yet. Generate your first AI workout plan!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workoutPlans.map((workout) => (
                <div key={workout.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-slate-900">{workout.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          workout.completed 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {workout.completed ? 'Completed' : 'New'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {workout.duration} min
                        </span>
                        <span className="flex items-center">
                          <TargetIcon className="w-4 h-4 mr-1" />
                          {workout.difficulty}
                        </span>
                        <span className="flex items-center">
                          <DumbbellIcon className="w-4 h-4 mr-1" />
                          {workout.exercises.length} exercises
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!workout.completed && (
                        <button
                          onClick={() => startWorkout(workout)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <PlayIcon className="w-4 h-4 mr-2" />
                          Start
                        </button>
                      )}
                      <button className="px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors">
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
