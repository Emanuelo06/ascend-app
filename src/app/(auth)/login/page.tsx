'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Wrapper component that uses useSearchParams
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    stayLoggedIn: false
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error: signInError } = await signIn(formData.email, formData.password);
      
      if (signInError) {
        setError(signInError);
      } else {
        // Redirect to intended page or dashboard
        router.push(redirectTo);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');

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
      setError('Failed to load demo account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipAuth = () => {
    setIsLoading(true);
    setError('');
    try {
      // Simulate successful authentication for testing
      localStorage.setItem('ascend_auth_token', 'skip-auth-token');
      localStorage.setItem('ascend_user_data', JSON.stringify({
        id: 'skip-user-123',
        email: 'skip@example.com',
        full_name: 'Skip User',
        avatar_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subscription_tier: 'premium' as const,
        onboarding_completed: true,
        streaks: {
          current: 0,
          longest: 0,
          lastActivity: new Date().toISOString()
        },
        goals: [],
        totalScore: 0,
        physicalScore: 0,
        mentalScore: 0,
        spiritualScore: 0,
        relationalScore: 0,
        financialScore: 0,
        dailyCheckins: [],
        progressHistory: []
      }));
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to skip authentication');
    } finally {
      setIsLoading(false);
    }
  };

  // Motivational quote of the day
  const quoteOfTheDay = {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    scripture: "Proverbs 16:9 - 'In their hearts humans plan their course, but the Lord establishes their steps.'"
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
          <h2 className="text-2xl font-bold text-white mt-4 mb-2">
            Welcome Back, Ascender
          </h2>
          <p className="text-blue-200">Continue your transformation journey</p>
          
          {redirectTo !== '/dashboard' && (
            <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
              <p className="text-yellow-200 text-xs">
                After signing in, you&apos;ll be redirected to complete your Life Audit assessment.
              </p>
            </div>
          )}
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

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
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.stayLoggedIn}
                  onChange={(e) => handleInputChange('stayLoggedIn', e.target.checked)}
                  className="w-4 h-4 text-yellow-400 bg-white/20 border-white/30 rounded focus:ring-yellow-400 focus:ring-2"
                  disabled={isLoading}
                />
                <span className="text-blue-200 text-sm">Stay logged in</span>
              </label>
              <Link
                href="/reset-password"
                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-3 px-6 rounded-lg hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Skip Auth Section - For Testing */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-center mb-4">
              <p className="text-red-200 text-sm mb-2">🚨 Testing Mode</p>
              <p className="text-red-300 text-xs">Skip authentication to test all features immediately</p>
            </div>
            
            <button
              onClick={() => handleSkipAuth()}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-400 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-red-500 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold flex items-center justify-center space-x-2"
            >
              <span>⚡ Skip Auth & Test App</span>
            </button>
            
            <div className="mt-3 text-center">
              <p className="text-red-200 text-xs">
                This will bypass all authentication and take you directly to the dashboard
              </p>
            </div>
          </div>

          {/* Demo Account Section */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center mb-4">
              <p className="text-blue-200 text-sm mb-2">Want to explore ASCEND first?</p>
              <p className="text-blue-300 text-xs">Try our demo account to see all features</p>
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

          {/* Quick Access Links */}
          <div className="mt-6 pt-6 border-t border-white/20 text-center">
            <p className="text-blue-200 text-sm mb-4">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>

          {/* Demo Account Info */}
          <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
            <p className="text-yellow-200 text-xs text-center">
              <strong>Demo Account:</strong> demo@example.com / password
            </p>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <p className="text-white italic text-lg mb-2">
              &ldquo;{quoteOfTheDay.text}&rdquo;
            </p>
            <p className="text-blue-200 text-sm mb-3">
              — {quoteOfTheDay.author}
            </p>
            <p className="text-blue-300 text-xs">
              {quoteOfTheDay.scripture}
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-blue-300 text-xs">
            🔒 Your data is encrypted and secure. We never share your information.
          </p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" />
          <p>Loading login page...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
