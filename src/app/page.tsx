'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, Target, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleAssessmentClick = () => {
    if (user) {
      router.push('/assessment');
    } else {
      router.push('/login?redirect=/assessment');
    }
  };

  const handleSkipAuth = () => {
    try {
      // Create a test user and bypass authentication completely
      const testUser = {
        id: 'test-user-123',
        email: 'test@ascend.app',
        full_name: 'Test User',
        avatar_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subscription_tier: 'premium',
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
      };

      // Store test user data
      localStorage.setItem('ascend_auth_token', 'test-token-123');
      localStorage.setItem('ascend_user_data', JSON.stringify(testUser));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Skip auth failed:', error);
      // Fallback: just redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-indigo-900/40" />
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Mountain Silhouette */}
            <div className="absolute bottom-0 left-0 w-full h-1/3">
              <svg viewBox="0 0 1200 400" className="w-full h-full">
                <path
                  d="M0,400 L200,300 L400,250 L600,200 L800,150 L1000,100 L1200,50 L1200,400 Z"
                  fill="url(#mountainGradient)"
                  className="animate-pulse"
                />
                <defs>
                  <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Most People Live at{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                30%
              </span>{' '}
              of Their God-Given Potential
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-8">
              What&apos;s Your Percentage?
            </p>
            <div className="text-4xl md:text-6xl font-bold text-white mb-8">
              <span className="animate-ping text-yellow-400">15%</span> •{' '}
              <span className="animate-ping text-orange-400" style={{ animationDelay: '0.5s' }}>28%</span> •{' '}
              <span className="animate-ping text-red-400" style={{ animationDelay: '1s' }}>42%</span>
            </div>
          </div>

          <button
            onClick={handleAssessmentClick}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl rounded-full hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Discover Your Gap
            <ArrowRight className="ml-2 h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">
            Join Thousands Already Ascending
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Users className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">2,847</div>
              <div className="text-blue-200">Lives Transformed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Target className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">156,420</div>
              <div className="text-blue-200">Total Streaks</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Star className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">89,234</div>
              <div className="text-blue-200">Prayers Answered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            The Complete Ascension System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Life Audit Assessment",
                description: "15-minute conversation revealing your current standing in life&apos;s seven dimensions",
                icon: "🎯",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Daily Ascension Protocol",
                description: "Personalized morning, midday, and evening routines that stack habits for maximum impact",
                icon: "🌅",
                color: "from-yellow-500 to-orange-500"
              },
              {
                title: "Accountability Partnership",
                description: "AI-matched accountability partners who complement your strengths and support your growth",
                icon: "🤝",
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "AI Coaching Engine",
                description: "Personalized guidance that adapts to your progress and provides real-time support",
                icon: "🧠",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Community Hub",
                description: "Connect with like-minded individuals on similar growth journeys",
                icon: "🔥",
                color: "from-red-500 to-pink-500"
              },
              {
                title: "Progress Analytics",
                description: "Track your growth across all dimensions with detailed insights and projections",
                icon: "📊",
                color: "from-indigo-500 to-blue-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-3xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-blue-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-400/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Discover Your True Potential?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Take the 15-minute Life Audit and see exactly where you stand in life&apos;s seven dimensions
          </p>
          <button
            onClick={handleAssessmentClick}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl rounded-full hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Start Your Life Audit Now
            <ArrowRight className="ml-2 h-6 w-6" />
          </button>

          {/* Skip Auth Button - For Testing */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center mb-4">
              <p className="text-red-200 text-sm mb-2">🚨 Testing Mode</p>
              <p className="text-red-300 text-xs">Skip authentication to test all features immediately</p>
            </div>
            
            <button
              onClick={() => handleSkipAuth()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold rounded-lg hover:from-red-500 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <span>⚡ Skip Auth & Test App</span>
            </button>
            
            <div className="mt-3 text-center">
              <p className="text-red-200 text-xs">
                This will bypass all authentication and take you directly to the dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">ASCEND</div>
          <p className="text-blue-200 mb-6">
            Unlock your God-given potential through intentional growth and spiritual development
          </p>
          <div className="flex justify-center space-x-6 text-blue-200">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/support" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
