'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HABIT_PACKS, HABIT_TEMPLATES } from '@/data/habit-templates';
import { HabitTemplate, Moment } from '@/types';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Target,
  Heart,
  Zap,
  Star,
  Bell,
  Settings,
  Package
} from 'lucide-react';

interface OnboardingData {
  step: number;
  goals: string[];
  selectedPack: string | null;
  morningTime: string;
  notifications: boolean;
  quietHours: { start: string; end: string };
  morningStart: string;
  workSchedule: string;
  sleepSchedule: string;
  dailyReminders: boolean;
  weeklyReviews: boolean;
}

const GOALS = [
  { id: 'health', title: 'Health & Fitness', icon: Heart, description: 'Build strength and energy' },
  { id: 'faith', title: 'Spiritual Growth', icon: Star, description: 'Deepen your faith journey' },
  { id: 'focus', title: 'Focus & Productivity', icon: Target, description: 'Achieve more with less stress' },
  { id: 'relationships', title: 'Relationships', icon: Heart, description: 'Strengthen connections' },
  { id: 'productivity', title: 'Personal Growth', icon: Zap, description: 'Level up your life' }
];

export default function EnhancedOnboardingPage() {
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    step: 1,
    goals: [],
    selectedPack: null,
    morningTime: '07:30',
    notifications: true,
    quietHours: { start: '22:00', end: '07:00' },
    morningStart: '07:30',
    workSchedule: '9-5',
    sleepSchedule: 'normal',
    dailyReminders: true,
    weeklyReviews: true
  });

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const updateOnboardingData = (key: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (onboardingData.step < 5) {
      updateOnboardingData('step', onboardingData.step + 1);
    }
  };

  const prevStep = () => {
    if (onboardingData.step > 1) {
      updateOnboardingData('step', onboardingData.step - 1);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else if (prev.length < 3) {
        return [...prev, goalId];
      }
      return prev;
    });
  };

  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId);
  };

  const handleComplete = () => {
    // Save onboarding data and redirect to dashboard
    const finalData = {
      ...onboardingData,
      goals: selectedGoals,
      selectedPack
    };
    
    // Store in localStorage for demo purposes
    localStorage.setItem('ascend_onboarding_data', JSON.stringify(finalData));
    
    // Update user data to mark onboarding as completed
    const userData = localStorage.getItem('ascend_user_data');
    if (userData) {
      const user = JSON.parse(userData);
      const updatedUser = {
        ...user,
        onboarding_completed: true,
        goals: selectedGoals,
        updated_at: new Date().toISOString()
      };
      
      // Update stored user data
      localStorage.setItem('ascend_user_data', JSON.stringify(updatedUser));
      
      // Update user in users list
      const storedUsers = localStorage.getItem('ascend_users') || '[]';
      const users = JSON.parse(storedUsers);
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem('ascend_users', JSON.stringify(users));
      }
    }
    
    // Redirect to assessment since onboarding is complete
    router.push('/assessment');
  };

  const canProceed = () => {
    switch (onboardingData.step) {
      case 1: return true; // Welcome step always allows proceeding
      case 2: return selectedGoals.length > 0 && selectedGoals.length <= 3;
      case 3: return selectedPack !== null;
      case 4: return onboardingData.morningStart !== '';
      case 5: return true; // Notifications step always allows proceeding
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (onboardingData.step) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <GoalsStep selectedGoals={selectedGoals} onGoalToggle={toggleGoal} />;
      case 3:
        return <StarterPackStep selectedPack={selectedPack} onPackSelect={handlePackSelect} />;
      case 4:
        return <ScheduleStep 
          morningTime={onboardingData.morningTime} 
          onTimeChange={(time) => updateOnboardingData('morningTime', time)} 
        />;
      case 5:
        return <NotificationsStep 
          notifications={onboardingData.notifications}
          quietHours={onboardingData.quietHours}
          onNotificationsChange={(enabled) => updateOnboardingData('notifications', enabled)}
          onQuietHoursChange={(hours) => updateOnboardingData('quietHours', hours)}
        />;
      default:
        return <WelcomeStep />;
    }
  };

  const getStepTitle = () => {
    switch (onboardingData.step) {
      case 1: return 'Welcome to ASCEND';
      case 2: return 'Choose Your Goals';
      case 3: return 'Select Starter Pack';
      case 4: return 'Set Your Schedule';
      case 5: return 'Notifications & Preferences';
      default: return 'Welcome';
    }
  };

  const getStepDescription = () => {
    switch (onboardingData.step) {
      case 1: return 'Let\'s get you started on your transformation journey';
      case 2: return 'Pick 1-3 areas you want to focus on most';
      case 3: return 'Choose a pre-built habit pack to get started quickly';
      case 4: return 'When do you want your morning moment?';
      case 5: return 'Customize how we\'ll support you';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome to Ascend</h1>
            <p className="text-blue-200 text-lg">
              Let&apos;s create your personalized habit journey in just a few steps
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium">Step {onboardingData.step} of 5</span>
            <span className="text-blue-200 text-sm">{Math.round((onboardingData.step / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(onboardingData.step / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Step Content */}
        <div className="backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-2xl">
          {onboardingData.step === 1 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Target className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">What are your main goals?</h2>
              <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
                Choose up to 3 primary areas you&apos;d like to focus on. We&apos;ll customize your experience based on your selections.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      selectedGoals.includes(goal.id)
                        ? 'border-yellow-400 bg-yellow-400/5 shadow-lg'
                        : 'border-white/20 hover:border-white/40 hover:shadow-md'
                    }`}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <goal.icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{goal.title}</h3>
                    <p className="text-blue-200 text-sm">{goal.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingData.step === 2 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Package className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Choose your starter pack</h2>
              <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
                Select a pre-built habit pack to get started quickly, or choose custom to build from scratch.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {HABIT_PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      selectedPack === pack.id
                        ? 'border-yellow-400 bg-yellow-400/5 shadow-lg'
                        : 'border-white/20 hover:border-white/40 hover:shadow-md'
                    }`}
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <pack.icon className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{pack.name}</h3>
                    <p className="text-blue-200 text-sm mb-4">{pack.description}</p>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">{pack.habitCount}</div>
                      <div className="text-blue-200 text-sm">habits included</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingData.step === 3 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Clock className="w-12 h-12 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Set your schedule</h2>
              <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
                Tell us about your daily routine so we can suggest the best times for your habits.
              </p>
              
              <div className="max-w-md mx-auto mb-8">
                <div className="rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                  <label className="block text-white font-medium mb-2">Morning Start Time</label>
                  <Input
                    type="time"
                    value={onboardingData.morningStart}
                    onChange={(e) => updateOnboardingData('morningStart', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder-blue-200/50"
                  />
                </div>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white mb-1">Work Schedule</h3>
                      <p className="text-blue-200 text-sm">When are you typically working?</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateOnboardingData('workSchedule', '9-5')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          onboardingData.workSchedule === '9-5'
                            ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        9-5
                      </button>
                      <button
                        onClick={() => updateOnboardingData('workSchedule', 'flexible')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          onboardingData.workSchedule === 'flexible'
                            ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        Flexible
                      </button>
                      <button
                        onClick={() => updateOnboardingData('workSchedule', 'night')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          onboardingData.workSchedule === 'night'
                            ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        Night
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white mb-1">Sleep Schedule</h3>
                      <p className="text-blue-200 text-sm">What&apos;s your typical bedtime?</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateOnboardingData('sleepSchedule', 'early')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          onboardingData.sleepSchedule === 'early'
                            ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        Early (9-10 PM)
                      </button>
                      <button
                        onClick={() => updateOnboardingData('sleepSchedule', 'normal')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          onboardingData.sleepSchedule === 'normal'
                            ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        Normal (10-11 PM)
                      </button>
                      <button
                        onClick={() => updateOnboardingData('sleepSchedule', 'late')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          onboardingData.sleepSchedule === 'late'
                            ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        Late (11+ PM)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {onboardingData.step === 4 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Bell className="w-12 h-12 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Notification preferences</h2>
              <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
                How would you like to stay on track? We&apos;ll send gentle reminders to help you build momentum.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white mb-1">Daily Reminders</h3>
                      <p className="text-blue-200 text-sm">Get notified about your daily habits</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateOnboardingData('dailyReminders', true)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          onboardingData.dailyReminders
                            ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        On
                      </button>
                      <button
                        onClick={() => updateOnboardingData('dailyReminders', false)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          !onboardingData.dailyReminders
                            ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        Off
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white mb-1">Weekly Reviews</h3>
                      <p className="text-blue-200 text-sm">Receive insights about your progress</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateOnboardingData('weeklyReviews', true)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          onboardingData.weeklyReviews
                            ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        On
                      </button>
                      <button
                        onClick={() => updateOnboardingData('weeklyReviews', false)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          !onboardingData.weeklyReviews
                            ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        Off
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {onboardingData.step === 5 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">You&apos;re all set!</h2>
              <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
                Your personalized habit journey is ready. Let&apos;s start building the life you want, one habit at a time.
              </p>
              
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Your Setup Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-200">Goals: {selectedGoals.length} selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-blue-200">Pack: {HABIT_PACKS.find(p => p.id === selectedPack)?.name}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-purple-200">Schedule: {onboardingData.workSchedule}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-yellow-200">Reminders: {onboardingData.dailyReminders ? 'On' : 'Off'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={prevStep}
              disabled={onboardingData.step === 1}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                onboardingData.step === 1
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-lg'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2 inline" />
              Previous
            </button>
            
            <div className="flex space-x-4">
              {onboardingData.step < 5 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                    !canProceed()
                      ? 'bg-blue-500/30 text-blue-200/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <CheckCircle className="w-5 h-5 mr-2 inline" />
                  Complete Setup
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Zap className="w-12 h-12 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900">Welcome to ASCEND</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Your AI-powered life transformation platform. We'll help you build consistent habits, 
        track your progress, and achieve your goals through daily rituals and intelligent coaching.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Daily Moments</h3>
          <p className="text-sm text-gray-600">Morning, Midday, and Evening rituals</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Tracking</h3>
          <p className="text-sm text-gray-600">AI-powered insights and progress</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Grace & Growth</h3>
          <p className="text-sm text-gray-600">Forgiving streaks and encouragement</p>
        </div>
      </div>
    </div>
  );
}

function GoalsStep({ selectedGoals, onGoalToggle }: { selectedGoals: string[], onGoalToggle: (goalId: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">Select up to 3 areas you want to focus on most</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GOAL_OPTIONS.map((goal) => (
          <div
            key={goal.id}
            onClick={() => onGoalToggle(goal.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedGoals.includes(goal.id)
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{goal.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{goal.label}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
              {selectedGoals.includes(goal.id) && (
                <CheckCircle className="w-5 h-5 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        {selectedGoals.length}/3 goals selected
      </div>
    </div>
  );
}

function StarterPackStep({ selectedPack, onPackSelect }: { selectedPack: string | null, onPackSelect: (packId: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">Choose a starter pack to get you started quickly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HABIT_PACKS.map((pack) => (
          <div
            key={pack.id}
            onClick={() => onPackSelect(pack.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedPack === pack.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${pack.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-3xl">{pack.icon}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pack.name}</h3>
              <p className="text-gray-600 mb-4">{pack.description}</p>
              
              <div className="space-y-2">
                {pack.habits.slice(0, 3).map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{habit.title}</span>
                    <span className="text-gray-500">{habit.dose?.target} {habit.dose?.unit}</span>
                  </div>
                ))}
                {pack.habits.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{pack.habits.length - 3} more habits
                  </div>
                )}
              </div>
              
              {selectedPack === pack.id && (
                <div className="mt-4">
                  <CheckCircle className="w-6 h-6 text-blue-500 mx-auto" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleStep({ morningTime, onTimeChange }: { morningTime: string, onTimeChange: (time: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">When do you want your morning moment to begin?</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white text-center">
          <div className="text-3xl mb-2">🌅</div>
          <h3 className="text-xl font-semibold mb-2">Morning Moment</h3>
          <p className="text-white/90 mb-4">Start your day with intention and purpose</p>
          
          <div className="flex items-center justify-center space-x-4">
            <Clock className="w-5 h-5" />
            <Input
              type="time"
              value={morningTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-32 text-center text-gray-900 font-semibold"
            />
          </div>
          
          <p className="text-sm text-white/80 mt-3">
            Your morning habits will be due between {morningTime} and 11:00 AM
          </p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>💡 Tip: Choose a time that fits your natural rhythm</p>
      </div>
    </div>
  );
}

function NotificationsStep({ 
  notifications, 
  quietHours, 
  onNotificationsChange, 
  onQuietHoursChange 
}: {
  notifications: boolean;
  quietHours: { start: string; end: string };
  onNotificationsChange: (enabled: boolean) => void;
  onQuietHoursChange: (hours: { start: string; end: string }) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">Customize how we'll support you throughout the day</p>
      </div>

      <div className="space-y-6">
        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-600">Get reminders for your habits</p>
            </div>
          </div>
          <Button
            variant={notifications ? "default" : "outline"}
            onClick={() => onNotificationsChange(!notifications)}
            className={notifications ? "bg-blue-600" : ""}
          >
            {notifications ? "On" : "Off"}
          </Button>
        </div>

        {/* Quiet Hours */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Quiet Hours</h3>
              <p className="text-sm text-gray-600">When should we stay quiet?</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">From:</span>
              <Input
                type="time"
                value={quietHours.start}
                onChange={(e) => onQuietHoursChange({ ...quietHours, start: e.target.value })}
                className="w-24"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">To:</span>
              <Input
                type="time"
                value={quietHours.end}
                onChange={(e) => onQuietHoursChange({ ...quietHours, end: e.target.value })}
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Batch Notifications */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <Star className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Batch Notifications</h3>
              <p className="text-sm text-gray-600">
                We'll send one notification per moment instead of spamming you
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>🔔 You can change these settings anytime in your profile</p>
      </div>
    </div>
  );
}
