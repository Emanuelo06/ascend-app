'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Target, 
  Heart, 
  Brain, 
  Users, 
  DollarSign, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Lightbulb,
  TrendingUp,
  Shield
} from 'lucide-react';

export default function AssessmentWelcomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleStartAssessment = () => {
    setIsStarting(true);
    router.push('/assessment/questions');
  };

  const dimensions = [
    {
      name: 'Physical',
      icon: <Heart className="h-8 w-8 text-red-400" />,
      description: 'Health, fitness, energy, and physical well-being',
      color: 'from-red-400 to-red-600'
    },
    {
      name: 'Mental',
      icon: <Brain className="h-8 w-8 text-blue-400" />,
      description: 'Focus, clarity, learning, and cognitive function',
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Spiritual',
      icon: <BookOpen className="h-8 w-8 text-purple-400" />,
      description: 'Faith, purpose, meaning, and spiritual growth',
      color: 'from-purple-400 to-purple-600'
    },
    {
      name: 'Relational',
      icon: <Users className="h-8 w-8 text-green-400" />,
      description: 'Family, friends, community, and social connections',
      color: 'from-green-400 to-green-600'
    },
    {
      name: 'Financial',
      icon: <DollarSign className="h-8 w-8 text-yellow-400" />,
      description: 'Budgeting, saving, investing, and financial security',
      color: 'from-yellow-400 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
            <Target className="h-10 w-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Your Life Assessment
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Discover your current position across 5 key life dimensions and get personalized insights to accelerate your growth.
          </p>
        </div>

        {/* What You'll Discover */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What You&apos;ll Discover
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Your Current Scores</h3>
                <p className="text-blue-200 text-sm">See how you&apos;re performing in each life area with detailed breakdowns</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Lightbulb className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Personalized Insights</h3>
                <p className="text-blue-200 text-sm">Get specific recommendations based on your unique situation</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Priority Focus Areas</h3>
                <p className="text-blue-200 text-sm">Identify where to focus your energy for maximum impact</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Action Plan</h3>
                <p className="text-blue-200 text-sm">Receive a step-by-step plan to improve your weakest areas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Life Dimensions Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            The 5 Life Dimensions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dimensions.map((dimension) => (
              <div key={dimension.name} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  {dimension.icon}
                  <h3 className="text-lg font-semibold text-white">{dimension.name}</h3>
                </div>
                <p className="text-blue-200 text-sm">{dimension.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Assessment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">35 Questions</h3>
              <p className="text-blue-200 text-sm">Comprehensive evaluation across all life areas</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <Clock className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">15-20 Minutes</h3>
              <p className="text-blue-200 text-sm">Quick and focused assessment experience</p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                <Lightbulb className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Instant Results</h3>
              <p className="text-blue-200 text-sm">Get your personalized insights immediately</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
              <div>
                <h3 className="text-white font-semibold">Answer Questions Honestly</h3>
                <p className="text-blue-200 text-sm">Rate yourself on a scale of 1-5 for each question. Be honest - this is for your growth!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">2</div>
              <div>
                <h3 className="text-white font-semibold">Get Your Scores</h3>
                <p className="text-blue-200 text-sm">Receive detailed scores for each life dimension and your overall ascension score</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">3</div>
              <div>
                <h3 className="text-white font-semibold">Receive Personalized Insights</h3>
                <p className="text-blue-200 text-sm">Get specific recommendations and an action plan tailored to your results</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">4</div>
              <div>
                <h3 className="text-white font-semibold">Start Your Transformation</h3>
                <p className="text-blue-200 text-sm">Use your insights to set meaningful goals and track your progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Commitment */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Your Privacy & Our Commitment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
                <Shield className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">100% Private</h3>
              <p className="text-blue-200 text-sm">Your assessment results are completely confidential and secure</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
                <Heart className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Personalized Experience</h3>
              <p className="text-blue-200 text-sm">Every recommendation is tailored to your unique situation and goals</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStartAssessment}
            disabled={isStarting}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl rounded-full hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-3"></div>
                Preparing Assessment...
              </>
            ) : (
              <>
                Start Your Assessment
                <ArrowRight className="ml-2 h-6 w-6" />
              </>
            )}
          </button>
          <p className="text-blue-200 text-sm mt-4">
            This will take approximately 15-20 minutes to complete
          </p>
        </div>
      </div>
    </div>
  );
}
