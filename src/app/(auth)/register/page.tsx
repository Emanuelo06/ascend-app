'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageRange: '',
    gender: '',
    timezone: '',
    primaryGoals: [] as string[],
    biggestChallenge: '',
    faithDescription: '',
    christianContentComfort: ''
  });

  const router = useRouter();
  const { signUp } = useAuth();

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error: signUpError } = await signUp(formData.email, formData.password, formData.fullName);
      
      if (signUpError) {
        setError(signUpError);
      } else {
        // Redirect to onboarding goals
        router.push('/onboarding/goals');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      // Create demo user data
      const demoUser = {
        id: 'demo-user-123',
        email: 'demo@ascend.app',
        full_name: 'Demo User',
        avatar_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subscription_tier: 'premium' as const,
        onboarding_completed: true,
        streaks: {
          current: 7,
          longest: 21,
          lastActivity: new Date().toISOString()
        },
        goals: ['Build Consistent Morning Routine', 'Improve Physical Fitness', 'Deepen Spiritual Connection'],
        totalScore: 78,
        physicalScore: 82,
        mentalScore: 75,
        spiritualScore: 85,
        relationalScore: 70,
        financialScore: 65,
        dailyCheckins: [],
        progressHistory: []
      };

      // Store demo user data
      localStorage.setItem('ascend_auth_token', 'demo-token-123');
      localStorage.setItem('ascend_user_data', JSON.stringify(demoUser));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
      case 2:
        return formData.ageRange && formData.gender && formData.timezone;
      case 3:
        return formData.primaryGoals.length > 0 && formData.biggestChallenge && formData.faithDescription && formData.christianContentComfort;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              ASCEND
            </h1>
          </Link>
          <p className="text-blue-200 mt-2">Begin Your Transformation Journey</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-200">Step {step} of 3</span>
            <span className="text-sm text-blue-200">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-200 text-sm mb-6">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Create Your Account</h2>
                
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all pr-12"
                      placeholder="Create a strong password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all pr-12"
                      placeholder="Confirm your password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {formData.password && formData.confirmPassword && (
                  <div className={`p-3 rounded-lg text-sm ${
                    formData.password === formData.confirmPassword 
                      ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-200 border border-red-500/30'
                  }`}>
                    {formData.password === formData.confirmPassword ? (
                      <div className="flex items-center">
                        <CheckCircle size={16} className="mr-2" />
                        Passwords match
                      </div>
                    ) : (
                      'Passwords do not match'
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Personal Details</h2>
                
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Age Range
                  </label>
                  <select
                    value={formData.ageRange}
                    onChange={(e) => handleInputChange('ageRange', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  >
                    <option value="" className="text-gray-600">Select age range</option>
                    <option value="18-25" className="text-black">18-25</option>
                    <option value="26-35" className="text-black">26-35</option>
                    <option value="36-45" className="text-black">36-45</option>
                    <option value="46-55" className="text-black">46-55</option>
                    <option value="55+" className="text-black">55+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  >
                    <option value="" className="text-gray-600">Select gender</option>
                    <option value="male" className="text-black">Male</option>
                    <option value="female" className="text-black">Female</option>
                    <option value="prefer_not_to_say" className="text-black">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  >
                    <option value="" className="text-gray-600">Select timezone</option>
                    <option value="UTC-8" className="text-black">Pacific Time (UTC-8)</option>
                    <option value="UTC-7" className="text-black">Mountain Time (UTC-7)</option>
                    <option value="UTC-6" className="text-black">Central Time (UTC-6)</option>
                    <option value="UTC-5" className="text-black">Eastern Time (UTC-5)</option>
                    <option value="UTC+0" className="text-black">UTC</option>
                    <option value="UTC+1" className="text-black">Central European Time (UTC+1)</option>
                    <option value="UTC+5:30" className="text-black">India Standard Time (UTC+5:30)</option>
                    <option value="UTC+8" className="text-black">China Standard Time (UTC+8)</option>
                    <option value="UTC+9" className="text-black">Japan Standard Time (UTC+9)</option>
                    <option value="UTC+10" className="text-black">Australian Eastern Time (UTC+10)</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Growth Goals & Faith</h2>
                
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Primary Goals (Select up to 3)
                  </label>
                  <div className="space-y-2">
                    {[
                      'Physical fitness and health',
                      'Mental clarity and focus',
                      'Spiritual growth and faith',
                      'Better relationships',
                      'Career advancement',
                      'Financial stability',
                      'Personal development',
                      'Stress management',
                      'Work-life balance',
                      'Community service'
                    ].map((goal) => (
                      <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.primaryGoals.includes(goal)}
                          onChange={(e) => {
                            if (e.target.checked && formData.primaryGoals.length < 3) {
                              handleInputChange('primaryGoals', [...formData.primaryGoals, goal]);
                            } else if (!e.target.checked) {
                              handleInputChange('primaryGoals', formData.primaryGoals.filter(g => g !== goal));
                            }
                          }}
                          className="w-4 h-4 text-yellow-400 bg-white/20 border-white/30 rounded focus:ring-yellow-400 focus:ring-2"
                          disabled={isLoading}
                        />
                        <span className="text-white text-sm">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Biggest Challenge
                  </label>
                  <textarea
                    value={formData.biggestChallenge}
                    onChange={(e) => handleInputChange('biggestChallenge', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    placeholder="What&apos;s your biggest challenge right now?"
                    rows={3}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Faith Description
                  </label>
                  <select
                    value={formData.faithDescription}
                    onChange={(e) => handleInputChange('faithDescription', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  >
                    <option value="" className="text-gray-600">Select description</option>
                    <option value="strong_growing" className="text-black">Strong and growing in my faith</option>
                    <option value="committed_inconsistent" className="text-black">Committed but inconsistent</option>
                    <option value="searching_exploring" className="text-black">Searching and exploring</option>
                    <option value="open_uncertain" className="text-black">Open but uncertain</option>
                    <option value="prefer_not_share" className="text-black">Prefer not to share</option>
                  </select>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">
                    Christian Content Comfort Level
                  </label>
                  <select
                    value={formData.christianContentComfort}
                    onChange={(e) => handleInputChange('christianContentComfort', e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  >
                    <option value="" className="text-gray-600">Select comfort level</option>
                    <option value="yes_want" className="text-black">Yes, I want Christian content</option>
                    <option value="yes_not_exclusively" className="text-black">Yes, but not exclusively</option>
                    <option value="sometimes_depends" className="text-black">Sometimes, it depends</option>
                    <option value="prefer_minimal" className="text-black">Prefer minimal Christian content</option>
                  </select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 text-blue-200 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Back
                </button>
              )}
              
              <div className="ml-auto">
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                  >
                    Next
                    <ArrowRight size={16} className="ml-2 inline" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepValid() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Demo Account Section */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="text-center mb-4">
            <p className="text-blue-200 text-sm mb-2">Want to explore ASCEND first?</p>
            <p className="text-blue-300 text-xs">Try our demo account to see all features before registering</p>
          </div>
          
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold flex items-center justify-center space-x-2"
          >
            <span>🚀 Try Demo Account</span>
          </button>
          
          <div className="mt-3 text-center">
            <p className="text-yellow-200 text-xs">
              Demo includes: Full Life Audit, AI Coaching, Workout Plans, Nutrition Guidance & More!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-blue-200">
            Already have an account?{' '}
            <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
