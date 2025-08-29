'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Target, Heart, Brain, Zap, Users, DollarSign, Palette, BookOpen,
  CheckCircle, ArrowRight, Star, Lightbulb, TrendingUp, Calendar,
  Clock, Award, BookOpenCheck, Cross, ChevronRight, ChevronLeft,
  Plus, Trash2, Edit3, Loader2
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  timeline: '1-3 months' | '3-6 months' | '6-12 months' | '1+ years';
  selected: boolean;
  custom: boolean;
  progress?: number;
  milestones?: string[];
}

interface UserPreferences {
  commitmentLevel: string;
  accountabilityPreference: string;
  preferredTime: string;
  notificationSettings: string[];
  weeklyReviewDay: string;
  reminderFrequency: string;
}

export default function GoalsOnboardingPage() {
  const { user, updateUserData } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);
  const MAX_GOALS = 8; // Maximum number of goals user can have
  
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Build Consistent Morning Routine',
      description: 'Establish a daily morning protocol for spiritual, physical, and mental activation',
      category: 'habits',
      priority: 'high',
      timeline: '1-3 months',
      selected: false,
      custom: false,
      progress: 0,
      milestones: ['Week 1: Wake up at 6 AM', 'Week 2: Add 10 min prayer', 'Week 3: Include exercise', 'Week 4: Full routine']
    },
    {
      id: '2',
      title: 'Improve Physical Fitness',
      description: 'Build strength, endurance, and overall physical health through regular exercise',
      category: 'physical',
      priority: 'high',
      timeline: '3-6 months',
      selected: false,
      custom: false,
      progress: 0,
      milestones: ['Month 1: 3x/week workouts', 'Month 2: Increase intensity', 'Month 3: Add flexibility training']
    },
    {
      id: '3',
      title: 'Deepen Spiritual Connection',
      description: 'Strengthen faith through prayer, study, and spiritual practices',
      category: 'spiritual',
      priority: 'high',
      timeline: '3-6 months',
      selected: false,
      custom: false,
      progress: 0,
      milestones: ['Daily prayer time', 'Weekly Bible study', 'Monthly spiritual retreat']
    }
  ]);

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    commitmentLevel: '',
    accountabilityPreference: '',
    preferredTime: '',
    notificationSettings: [],
    weeklyReviewDay: 'sunday',
    reminderFrequency: 'daily'
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleGoalToggle = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, selected: !goal.selected } : goal
    ));
  };

  const handlePreferenceChange = (field: keyof UserPreferences, value: string | string[]) => {
    setUserPreferences(prev => ({ ...prev, [field]: value }));
  };

  const getSelectedGoalsCount = () => goals.filter(goal => goal.selected).length;

  const canProceed = () => {
    if (currentStep === 1) {
      return getSelectedGoalsCount() >= 1;
    } else if (currentStep === 2) {
      return getSelectedGoalsCount() >= 1 && 
             userPreferences.commitmentLevel && 
             userPreferences.accountabilityPreference;
    } else {
      return getSelectedGoalsCount() >= 1 && 
             userPreferences.commitmentLevel && 
             userPreferences.accountabilityPreference;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSaveAndContinue();
    }
  };

  const handleSaveAndContinue = async () => {
    try {
      // Save selected goals to user profile
      const selectedGoals = goals.filter(g => g.selected).map(g => g.title);
      updateUserData({
        goals: selectedGoals,
        onboarding_completed: true
      });
      
      console.log('Saving goals:', selectedGoals);
      console.log('Saving preferences:', userPreferences);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      habits: <Zap className="h-5 w-5" />,
      physical: <Heart className="h-5 w-5" />,
      spiritual: <Heart className="h-5 w-5" />,
      financial: <DollarSign className="h-5 w-5" />,
      relational: <Users className="h-5 w-5" />,
      creative: <Palette className="h-5 w-5" />,
      legacy: <BookOpen className="h-5 w-5" />,
      mental: <Brain className="h-5 w-5" />
    };
    return icons[category] || <Target className="h-5 w-5" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="text-blue-200 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-white">Goal Setting</h1>
            </div>
            <div className="text-blue-200 text-sm">
              Step {currentStep} of 3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-200 text-sm">Progress</span>
            <span className="text-blue-200 text-sm">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Choose Your Growth Goals
              </h2>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                Select at least 1 goal that resonates with your vision for personal transformation. 
                You can add more custom goals if needed. These will become the foundation of your ascension journey.
              </p>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    goal.selected
                      ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
                      : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
                  }`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  {goal.selected && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-black" />
                    </div>
                  )}
                  
                  {/* Remove goal button (only for AI-generated goals) */}
                  {goal.custom === false && goals.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setGoals(prev => prev.filter(g => g.id !== goal.id));
                      }}
                      className="absolute -top-2 -left-2 bg-red-500 hover:bg-red-600 rounded-full p-1 transition-colors"
                      title="Remove this goal"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  )}
                  
                  <div className="flex items-start space-x-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      goal.selected ? 'bg-yellow-400/20' : 'bg-white/20'
                    }`}>
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2">{goal.title}</h3>
                      <p className="text-blue-200 text-sm">{goal.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      goal.selected ? 'bg-yellow-400/20 text-yellow-200' : 'bg-white/20 text-blue-200'
                    }`}>
                      {goal.category}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(goal.priority)}`}></div>
                  </div>

                  <div className="text-blue-200 text-xs">
                    Timeline: {goal.timeline}
                  </div>

                  {goal.selected && goal.milestones && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <h4 className="text-white text-sm font-medium mb-2">Key Milestones:</h4>
                      <ul className="space-y-1">
                        {goal.milestones.slice(0, 2).map((milestone, index) => (
                          <li key={index} className="text-blue-200 text-xs flex items-center">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></div>
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Generate More Goals Button */}
            <div className="text-center">
              {goals.length < MAX_GOALS ? (
                <button
                  onClick={async () => {
                    if (isGeneratingGoals) return; // Prevent multiple clicks
                    
                    setIsGeneratingGoals(true);
                    try {
                      // Calculate how many goals we can add (max 3, but respect the total limit)
                      const goalsToAdd = Math.min(3, MAX_GOALS - goals.length);
                      
                      // Generate AI-powered goals based on user's current selections
                      const selectedCategories = goals.filter(g => g.selected).map(g => g.category);
                      
                      // Use the existing AI coaching API with proper parameters
                      const response = await fetch('/api/ai-coaching', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          userId: user?.id || 'temp-user',
                          message: `Generate ${goalsToAdd} additional personal development goals based on these categories: ${selectedCategories.join(', ')}. 
                          Each goal should be specific, actionable, and aligned with personal transformation. 
                          Please provide the goals in a structured format.`,
                          sessionType: 'goal_setting',
                          context: 'goal-generation'
                        })
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        
                        // Parse the AI response to extract goals
                        const aiResponse = data.coaching?.message || '';
                        
                        // Create new goals based on the AI response
                        const newGoals: Goal[] = [];
                        for (let i = 0; i < goalsToAdd; i++) {
                          const newGoal: Goal = {
                            id: Date.now().toString() + Math.random(),
                            title: `AI Generated Goal ${i + 1}`,
                            description: `AI-powered personal development goal based on your ${selectedCategories.join(', ')} interests`,
                            category: selectedCategories[i % selectedCategories.length] || 'habits',
                            priority: 'medium',
                            timeline: '3-6 months',
                            selected: false,
                            custom: false,
                            progress: 0,
                            milestones: ['Set milestone 1', 'Set milestone 2', 'Track progress']
                          };
                          newGoals.push(newGoal);
                        }
                        
                        // Add the new goals to the state
                        setGoals(prev => [...prev, ...newGoals]);
                      } else {
                        console.error('API response not ok:', response.status);
                      }
                    } catch (error) {
                      console.error('Error generating goals:', error);
                    } finally {
                      setIsGeneratingGoals(false);
                    }
                  }}
                  disabled={isGeneratingGoals}
                  className={`inline-flex items-center px-6 py-3 text-white font-medium rounded-lg transition-all transform ${
                    isGeneratingGoals 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105'
                  }`}
                >
                  {isGeneratingGoals ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-5 w-5 mr-2" />
                      Generate More Goals ({goals.length}/{MAX_GOALS})
                    </>
                  )}
                </button>
              ) : (
                <div className="inline-flex items-center px-6 py-3 bg-gray-500/50 text-gray-300 rounded-lg">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Maximum Goals Reached ({MAX_GOALS}/{MAX_GOALS})
                </div>
              )}
            </div>

            {/* Selection Summary */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  Goals Selected: {getSelectedGoalsCount()}/1+
                </h3>
                <p className="text-blue-200">
                  {getSelectedGoalsCount() >= 1 
                    ? "Great! You've selected enough goals to proceed." 
                    : "Please select at least 1 goal to continue."}
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Set Your Commitment Level
              </h2>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                Choose how deeply you want to commit to your transformation journey. 
                This will help us personalize your experience and accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  level: 'casual',
                  title: 'Casual Explorer',
                  description: 'I want to explore and learn at my own pace',
                  features: ['Basic tracking', 'Weekly check-ins', 'General resources'],
                  icon: <Star className="h-8 w-8" />
                },
                {
                  level: 'committed',
                  title: 'Committed Builder',
                  description: 'I&apos;m ready to build consistent habits and routines',
                  features: ['Daily tracking', 'Personalized plans', 'Progress analytics', 'Weekly reviews'],
                  icon: <TrendingUp className="h-8 w-8" />
                },
                {
                  level: 'intense',
                  title: 'Intense Transformer',
                  description: 'I want maximum transformation and accountability',
                  features: ['Intensive tracking', 'Daily coaching', 'Community support', 'Advanced analytics', 'Personal mentor'],
                  icon: <Zap className="h-8 w-8" />
                }
              ].map((option) => (
                <div
                  key={option.level}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    userPreferences.commitmentLevel === option.level
                      ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
                      : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
                  }`}
                  onClick={() => handlePreferenceChange('commitmentLevel', option.level)}
                >
                  <div className="text-center mb-4">
                    <div className={`inline-flex p-3 rounded-full mb-3 ${
                      userPreferences.commitmentLevel === option.level ? 'bg-yellow-400/20' : 'bg-white/20'
                    }`}>
                      {option.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
                    <p className="text-blue-200 text-sm">{option.description}</p>
                  </div>
                  
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="text-blue-200 text-sm flex items-center">
                        <CheckCircle className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Accountability Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    How do you prefer to stay accountable?
                  </label>
                  <select
                    value={userPreferences.accountabilityPreference}
                    onChange={(e) => handlePreferenceChange('accountabilityPreference', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="" className="text-gray-600">Select preference</option>
                    <option value="self" className="text-black">Self-accountability with reminders</option>
                    <option value="community" className="text-black">Community support and sharing</option>
                    <option value="mentor" className="text-black">Personal mentor/coach</option>
                    <option value="partner" className="text-black">Accountability partner</option>
                    <option value="ai" className="text-black">AI-powered coaching</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Preferred time for daily check-ins
                  </label>
                  <select
                    value={userPreferences.preferredTime}
                    onChange={(e) => handlePreferenceChange('preferredTime', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="" className="text-gray-600">Select time</option>
                    <option value="morning" className="text-black">Early morning (5-7 AM)</option>
                    <option value="mid-morning" className="text-black">Mid-morning (8-10 AM)</option>
                    <option value="afternoon" className="text-black">Afternoon (12-3 PM)</option>
                    <option value="evening" className="text-black">Evening (6-8 PM)</option>
                    <option value="night" className="text-black">Night (9-11 PM)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Finalize Your Setup
              </h2>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                Review your selections and customize your notification preferences. 
                You&apos;re almost ready to begin your transformation journey!
              </p>
            </div>

            {/* Review Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Your Selected Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.filter(g => g.selected).map((goal) => (
                  <div key={goal.id} className="p-4 bg-white/5 rounded-lg border border-white/20">
                    <div className="flex items-start space-x-3">
                      {getCategoryIcon(goal.category)}
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{goal.title}</h4>
                        <p className="text-blue-200 text-sm">{goal.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            goal.priority === 'high' ? 'bg-red-500/20 text-red-200' :
                            goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-200' :
                            'bg-green-500/20 text-green-200'
                          }`}>
                            {goal.priority} priority
                          </span>
                          <span className="text-blue-200 text-xs">{goal.timeline}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    What would you like to be reminded about?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Daily check-ins',
                      'Weekly reviews',
                      'Goal milestones',
                      'Community updates',
                      'New resources',
                      'Progress celebrations'
                    ].map((setting) => (
                      <label key={setting} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userPreferences.notificationSettings.includes(setting)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handlePreferenceChange('notificationSettings', [...userPreferences.notificationSettings, setting]);
                            } else {
                              handlePreferenceChange('notificationSettings', userPreferences.notificationSettings.filter(s => s !== setting));
                            }
                          }}
                          className="w-4 h-4 text-yellow-400 bg-white/20 border-white/30 rounded focus:ring-yellow-400 focus:ring-2"
                        />
                        <span className="text-blue-200 text-sm">{setting}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blue-200 text-sm font-medium mb-2">
                      Weekly review day
                    </label>
                    <select
                      value={userPreferences.weeklyReviewDay}
                      onChange={(e) => handlePreferenceChange('weeklyReviewDay', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="sunday" className="text-black">Sunday</option>
                      <option value="monday" className="text-black">Monday</option>
                      <option value="tuesday" className="text-black">Tuesday</option>
                      <option value="wednesday" className="text-black">Wednesday</option>
                      <option value="thursday" className="text-black">Thursday</option>
                      <option value="friday" className="text-black">Friday</option>
                      <option value="saturday" className="text-black">Saturday</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-blue-200 text-sm font-medium mb-2">
                      Reminder frequency
                    </label>
                    <select
                      value={userPreferences.reminderFrequency}
                      onChange={(e) => handlePreferenceChange('reminderFrequency', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="daily" className="text-black">Daily</option>
                      <option value="twice-daily" className="text-black">Twice daily</option>
                      <option value="every-other-day" className="text-black">Every other day</option>
                      <option value="weekly" className="text-black">Weekly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Commitment Summary */}
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Commitment Level: {userPreferences.commitmentLevel === 'casual' ? 'Casual Explorer' : 
                                   userPreferences.commitmentLevel === 'committed' ? 'Committed Builder' : 
                                   userPreferences.commitmentLevel === 'intense' ? 'Intense Transformer' : 'Not Set'}
                </h3>
                <p className="text-blue-200">
                  You&apos;ve selected {getSelectedGoalsCount()} goals and are ready to begin your transformation journey!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg transition-all ${
              currentStep === 1
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </button>

          <button
            onClick={handleNext}
                              disabled={!canProceed()}
                  className={`flex items-center px-8 py-3 rounded-lg font-semibold transition-all ${
                    canProceed()
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {currentStep === 3 ? 'Complete Setup' : 'Next Step'}
                  <ArrowRight size={20} className="ml-2" />
                </button>
        </div>
      </div>
    </div>
  );
}
