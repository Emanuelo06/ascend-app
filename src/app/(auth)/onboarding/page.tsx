'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  Target, 
  Heart, 
  Brain, 
  Zap, 
  Users, 
  DollarSign, 
  Palette, 
  BookOpen,
  CheckCircle,
  ArrowRight,
  Star,
  Lightbulb,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  BookOpenCheck,
  Cross,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  timeline: '1-3 months' | '3-6 months' | '6-12 months' | '1+ years';
  selected: boolean;
}

export default function OnboardingPage() {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    ageRange: '',
    gender: '',
    timezone: '',
    primaryGoals: [] as string[],
    biggestChallenge: '',
    faithDescription: '',
    christianContentComfort: '',
    commitmentLevel: '',
    accountabilityPreference: '',
    preferredTime: '',
    notificationSettings: [] as string[]
  });

  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Build Consistent Morning Routine',
      description: 'Establish a daily morning protocol for spiritual, physical, and mental activation',
      category: 'habits',
      priority: 'high',
      timeline: '1-3 months',
      selected: false
    },
    {
      id: '2',
      title: 'Improve Physical Fitness',
      description: 'Build strength, endurance, and overall physical health through regular exercise',
      category: 'physical',
      priority: 'high',
      timeline: '3-6 months',
      selected: false
    },
    {
      id: '3',
      title: 'Deepen Spiritual Connection',
      description: 'Strengthen faith through prayer, study, and spiritual practices',
      category: 'spiritual',
      priority: 'high',
      timeline: '3-6 months',
      selected: false
    },
    {
      id: '4',
      title: 'Financial Freedom',
      description: 'Create a budget, save consistently, and build wealth for the future',
      category: 'financial',
      priority: 'medium',
      timeline: '6-12 months',
      selected: false
    },
    {
      id: '5',
      title: 'Strengthen Relationships',
      description: 'Build deeper connections with family, friends, and community',
      category: 'relational',
      priority: 'medium',
      timeline: '3-6 months',
      selected: false
    },
    {
      id: '6',
      title: 'Career Advancement',
      description: 'Develop skills, expand network, and advance in professional life',
      category: 'career',
      priority: 'medium',
      timeline: '6-12 months',
      selected: false
    }
  ]);

  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Welcome & Vision',
      description: 'Set your personal vision and understand your journey',
      icon: <Star className="w-6 h-6" />,
      completed: currentStep > 1
    },
    {
      id: 2,
      title: 'Goal Setting',
      description: 'Choose your primary goals and priorities',
      icon: <Target className="w-6 h-6" />,
      completed: currentStep > 2
    },
    {
      id: 3,
      title: 'Spiritual Foundation',
      description: 'Establish your spiritual foundation and preferences',
      icon: <Heart className="w-6 h-6" />,
      completed: currentStep > 3
    },
    {
      id: 4,
      title: 'Commitment & Schedule',
      description: 'Set your commitment level and preferred schedule',
      icon: <Calendar className="w-6 h-6" />,
      completed: currentStep > 4
    },
    {
      id: 5,
      title: 'Review & Launch',
      description: 'Review your setup and begin your journey',
      icon: <CheckCircle className="w-6 h-6" />,
      completed: currentStep > 5
    }
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      if (selectedGoals.find(g => g.id === goalId)) {
        setSelectedGoals(prev => prev.filter(g => g.id !== goalId));
      } else {
        setSelectedGoals(prev => [...prev, goal]);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding data and redirect to dashboard
    router.push('/dashboard');
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Your Ascension Journey, {user?.full_name}!
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
              You're about to embark on a transformative journey that will help you ascend to new heights 
              in every dimension of your life. Let's start by understanding your vision and setting the foundation.
            </p>
            
            <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">Your Vision Statement</h3>
              <p className="text-blue-200 mb-4">
                "I am committed to becoming the best version of myself, growing in faith, strength, and wisdom, 
                while positively impacting those around me and building a legacy of excellence."
              </p>
              <p className="text-blue-300 text-sm">
                This vision will guide your daily decisions and keep you focused on what truly matters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Goal Setting</h4>
                <p className="text-blue-200 text-sm">Define clear, measurable goals for each life dimension</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Progress Tracking</h4>
                <p className="text-blue-200 text-sm">Monitor your growth with detailed analytics and insights</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Community Support</h4>
                <p className="text-blue-200 text-sm">Connect with like-minded individuals on similar journeys</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Primary Goals</h2>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                Select 3-5 goals that resonate most with your current season of life. 
                These will become your primary focus areas for the next 90 days.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-6 rounded-xl border cursor-pointer transition-all ${
                    selectedGoals.find(g => g.id === goal.id)
                      ? 'bg-gradient-to-r from-green-400/20 to-emerald-500/20 border-green-400/30'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">{goal.title}</h4>
                      <p className="text-blue-200 text-sm mb-3">{goal.description}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          goal.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {goal.priority} priority
                        </span>
                        <span className="px-2 py-1 bg-white/10 rounded-full text-blue-200">
                          {goal.timeline}
                        </span>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedGoals.find(g => g.id === goal.id)
                        ? 'bg-green-500 border-green-500'
                        : 'border-white/30'
                    }`}>
                      {selectedGoals.find(g => g.id === goal.id) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedGoals.length > 0 && (
              <div className="bg-gradient-to-r from-green-400/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-green-400 mb-3">
                  Selected Goals ({selectedGoals.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedGoals.map((goal) => (
                    <div key={goal.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-blue-200">{goal.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Spiritual Foundation</h2>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                Your spiritual journey is the cornerstone of your ascension. Let's understand your current 
                spiritual foundation and how you'd like to grow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-3">
                    How would you describe your current faith journey?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'strong_growing', label: 'Strong and Growing', description: 'Deep faith, actively growing' },
                      { value: 'committed_inconsistent', label: 'Committed but Inconsistent', description: 'Believe but struggle with consistency' },
                      { value: 'searching_exploring', label: 'Searching and Exploring', description: 'Curious, seeking answers' },
                      { value: 'open_uncertain', label: 'Open but Uncertain', description: 'Open to faith, not sure yet' },
                      { value: 'prefer_not_share', label: 'Prefer Not to Share', description: 'Keep this private for now' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="faithDescription"
                          value={option.value}
                          checked={formData.faithDescription === option.value}
                          onChange={(e) => handleInputChange('faithDescription', e.target.value)}
                          className="mt-1 w-4 h-4 text-purple-400 bg-white/20 border-white/30 focus:ring-purple-400"
                        />
                        <div>
                          <div className="text-white font-medium">{option.label}</div>
                          <div className="text-blue-200 text-sm">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-3">
                    How comfortable are you with Christian content and spiritual guidance?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'yes_want', label: 'Yes, I Want It', description: 'Include Christian content and guidance' },
                      { value: 'yes_not_exclusively', label: 'Yes, but Not Exclusively', description: 'Mix of spiritual and secular content' },
                      { value: 'sometimes_depends', label: 'Sometimes, It Depends', description: 'Selective about spiritual content' },
                      { value: 'prefer_minimal', label: 'Prefer Minimal', description: 'Keep spiritual content minimal' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="christianContentComfort"
                          value={option.value}
                          checked={formData.christianContentComfort === option.value}
                          onChange={(e) => handleInputChange('christianContentComfort', e.target.value)}
                          className="mt-1 w-4 h-4 text-purple-400 bg-white/20 border-white/30 focus:ring-purple-400"
                        />
                        <div>
                          <div className="text-white font-medium">{option.label}</div>
                          <div className="text-blue-200 text-sm">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-3">
                    What's your biggest spiritual challenge right now?
                  </label>
                  <textarea
                    value={formData.biggestChallenge}
                    onChange={(e) => handleInputChange('biggestChallenge', e.target.value)}
                    placeholder="Share your current spiritual struggles or questions..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-400/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Spiritual Growth Path
              </h4>
              <p className="text-blue-200 mb-3">
                Based on your preferences, we'll create a personalized spiritual growth path that includes:
              </p>
              <ul className="text-blue-200 space-y-2">
                <li>• Daily devotional content tailored to your faith level</li>
                <li>• Prayer and meditation practices that fit your schedule</li>
                <li>• Scripture study plans that match your learning style</li>
                <li>• Community connections with similar spiritual goals</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Commitment & Schedule</h2>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                Set your commitment level and preferred schedule to ensure your success on this journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-3">
                    What's your commitment level for this journey?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'casual', label: 'Casual (15-30 min/day)', description: 'Start slow, build gradually' },
                      { value: 'committed', label: 'Committed (30-60 min/day)', description: 'Regular daily practice' },
                      { value: 'dedicated', label: 'Dedicated (60-90 min/day)', description: 'Serious transformation focus' },
                      { value: 'all_in', label: 'All In (90+ min/day)', description: 'Maximum growth potential' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="commitmentLevel"
                          value={option.value}
                          checked={formData.commitmentLevel === option.value}
                          onChange={(e) => handleInputChange('commitmentLevel', e.target.value)}
                          className="mt-1 w-4 h-4 text-blue-400 bg-white/20 border-white/30 focus:ring-blue-400"
                        />
                        <div>
                          <div className="text-white font-medium">{option.label}</div>
                          <div className="text-blue-200 text-sm">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-3">
                    When do you prefer to do your daily practices?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'early_morning', label: 'Early Morning (5-7 AM)', description: 'Start the day strong' },
                      { value: 'morning', label: 'Morning (7-9 AM)', description: 'After breakfast routine' },
                      { value: 'mid_morning', label: 'Mid-Morning (9-11 AM)', description: 'Break from work' },
                      { value: 'lunch_break', label: 'Lunch Break (12-2 PM)', description: 'Midday refresh' },
                      { value: 'afternoon', label: 'Afternoon (2-5 PM)', description: 'Energy boost time' },
                      { value: 'evening', label: 'Evening (6-8 PM)', description: 'Wind down routine' },
                      { value: 'late_evening', label: 'Late Evening (8-10 PM)', description: 'Before bed reflection' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredTime"
                          value={option.value}
                          checked={formData.preferredTime === option.value}
                          onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                          className="mt-1 w-4 h-4 text-blue-400 bg-white/20 border-white/30 focus:ring-blue-400"
                        />
                        <div>
                          <div className="text-white font-medium">{option.label}</div>
                          <div className="text-blue-200 text-sm">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-3">
                    How would you like to be held accountable?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'self', label: 'Self-Accountability', description: 'Track my own progress' },
                      { value: 'partner', label: 'Accountability Partner', description: 'Weekly check-ins with a partner' },
                      { value: 'group', label: 'Small Group', description: 'Monthly group accountability' },
                      { value: 'coach', label: 'AI Coach', description: 'Daily AI-powered guidance' },
                      { value: 'hybrid', label: 'Hybrid Approach', description: 'Mix of different methods' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="accountabilityPreference"
                          value={option.value}
                          checked={formData.accountabilityPreference === option.value}
                          onChange={(e) => handleInputChange('accountabilityPreference', e.target.value)}
                          className="mt-1 w-4 h-4 text-blue-400 bg-white/20 border-white/30 focus:ring-blue-400"
                        />
                        <div>
                          <div className="text-white font-medium">{option.label}</div>
                          <div className="text-blue-200 text-sm">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-3">
                    Notification preferences
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'daily_reminders', label: 'Daily Reminders', description: 'Get reminded of daily tasks' },
                      { value: 'weekly_reports', label: 'Weekly Progress Reports', description: 'Receive weekly summaries' },
                      { value: 'achievement_alerts', label: 'Achievement Alerts', description: 'Celebrate milestones' },
                      { value: 'community_updates', label: 'Community Updates', description: 'Stay connected with community' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={formData.notificationSettings.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('notificationSettings', [...formData.notificationSettings, option.value]);
                            } else {
                              handleInputChange('notificationSettings', formData.notificationSettings.filter(s => s !== option.value));
                            }
                          }}
                          className="mt-1 w-4 h-4 text-blue-400 bg-white/20 border-white/30 focus:ring-blue-400"
                        />
                        <div>
                          <div className="text-white font-medium">{option.label}</div>
                          <div className="text-blue-200 text-sm">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Review & Launch</h2>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                Let's review your setup and get you ready to launch into your ascension journey!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Journey Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-blue-400 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Selected Goals
                  </h4>
                  <div className="space-y-2">
                    {selectedGoals.map((goal) => (
                      <div key={goal.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-blue-200">{goal.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-400 flex items-center">
                                         <Heart className="w-5 h-5 mr-2" />
                    Spiritual Setup
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-blue-200 text-sm">Faith Level</p>
                      <p className="text-white font-medium">{formData.faithDescription || 'Not specified'}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-blue-200 text-sm">Content Preference</p>
                      <p className="text-white font-medium">{formData.christianContentComfort || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-400/10 to-emerald-500/10 border border-green-400/20 rounded-xl">
                <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  What Happens Next?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="text-white font-medium mb-2">Personalized Plan</h5>
                    <p className="text-blue-200 text-sm">Get your custom daily protocol</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                    <h5 className="text-white font-medium mb-2">Community Access</h5>
                    <p className="text-blue-200 text-sm">Connect with like-minded members</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="text-white font-medium mb-2">Progress Tracking</h5>
                    <p className="text-blue-200 text-sm">Monitor your growth journey</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-blue-200 text-lg mb-6">
                Ready to begin your transformation? Click below to launch your ascension journey!
              </p>
              <button
                onClick={handleComplete}
                className="px-12 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-xl rounded-full hover:from-green-500 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Launch My Journey
                <ArrowRight className="w-6 h-6 ml-3 inline" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-xl font-semibold text-white">Onboarding</h1>
            </div>
            <button 
              onClick={() => router.push('/dashboard')} 
              className="text-blue-200 hover:text-white transition-colors flex items-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  step.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : step.id === currentStep
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white/10 border-white/30 text-blue-200'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 transition-all ${
                    step.completed ? 'bg-green-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="text-center flex-1">
                <h3 className={`text-sm font-medium ${
                  step.id === currentStep ? 'text-white' : 'text-blue-200'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-xs mt-1 ${
                  step.id === currentStep ? 'text-blue-200' : 'text-blue-300'
                }`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          {getStepContent()}
        </div>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${
                currentStep === 1
                  ? 'bg-white/10 text-blue-300 cursor-not-allowed'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg hover:from-blue-500 hover:to-cyan-600 transition-all flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
