'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  TrendingUp, 
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
  Calendar,
  Clock,
  Award,
  BookOpenCheck,
  Cross,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  PieChart,
  Activity,
  TargetIcon,
  Sparkles
} from 'lucide-react';

interface AssessmentResult {
  id: string;
  userId: string;
  physicalScore: number;
  mentalScore: number;
  spiritualScore: number;
  relationalScore: number;
  financialScore: number;
  totalScore: number;
  strongestArea: string;
  biggestOpportunity: string;
  keystoneHabitFocus: string;
  accountabilityNeed: string;
  improvementPotential: number;
  improvementUrgency: 'low' | 'medium' | 'high' | 'critical';
  recommendedNextSteps: string[];
  insights: string[];
  created_at: string;
}

interface DimensionData {
  name: string;
  score: number;
  color: string;
  icon: React.ReactNode;
  description: string;
  recommendations: string[];
}

function AssessmentResultsContent() {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Try to get results from localStorage (from assessment)
    const storedResults = localStorage.getItem('assessmentResults');
    
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        const results: AssessmentResult = {
          id: '1',
          userId: user.id,
          physicalScore: parsedResults.physicalScore || 0,
          mentalScore: parsedResults.mentalScore || 0,
          spiritualScore: parsedResults.spiritualScore || 0,
          relationalScore: parsedResults.relationalScore || 0,
          financialScore: parsedResults.financialScore || 0,
          totalScore: parsedResults.totalScore || 0,
          strongestArea: parsedResults.strongestArea || 'mental',
          biggestOpportunity: parsedResults.biggestOpportunity || 'financial',
          keystoneHabitFocus: 'morning_routine',
          accountabilityNeed: 'community_support',
          improvementPotential: 100 - (parsedResults.totalScore || 0),
          improvementUrgency: parsedResults.improvementUrgency || 'medium',
          recommendedNextSteps: [
            'Start with a 5-minute morning prayer routine',
            'Create a weekly budget and track expenses',
            'Schedule 3 quality time sessions with family this week',
            'Begin a 30-day fitness challenge',
            'Join a small group or accountability partner program'
          ],
          insights: [
            'Your mental clarity and focus are strong foundations to build upon',
            'Financial planning could unlock significant life improvements',
            'Relationships are an area where small investments yield big returns',
            'Spiritual growth often follows physical and mental discipline',
            'Creative expression can enhance all other life areas'
          ],
          created_at: parsedResults.assessmentDate || new Date().toISOString()
        };
        setResults(results);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing stored results:', error);
        // Fallback to mock data
        loadMockResults();
      }
    } else {
      // No stored results, load mock data
      loadMockResults();
    }
  }, [user, router]);

  const loadMockResults = () => {
    setTimeout(() => {
      const mockResults: AssessmentResult = {
        id: '1',
        userId: user.id,
        physicalScore: 65,
        mentalScore: 72,
        spiritualScore: 58,
        relationalScore: 45,
        financialScore: 38,
        totalScore: 53,
        strongestArea: 'mental',
        biggestOpportunity: 'financial',
        keystoneHabitFocus: 'morning_routine',
        accountabilityNeed: 'community_support',
        improvementPotential: 47,
        improvementUrgency: 'high',
        recommendedNextSteps: [
          'Start with a 5-minute morning prayer routine',
          'Create a weekly budget and track expenses',
          'Schedule 3 quality time sessions with family this week',
          'Begin a 30-day fitness challenge',
          'Join a small group or accountability partner program'
        ],
        insights: [
          'Your mental clarity and focus are strong foundations to build upon',
          'Financial planning could unlock significant life improvements',
          'Relationships are an area where small investments yield big returns',
          'Spiritual growth often follows physical and mental discipline',
          'Creative expression can enhance all other life areas'
        ],
        created_at: new Date().toISOString()
      };
      setResults(mockResults);
      setIsLoading(false);
    }, 1500);
  };

  const getDimensionData = (): DimensionData[] => [
    {
      name: 'Physical',
      score: results?.physicalScore || 0,
      color: 'from-rose-400 to-rose-600',
      icon: <Heart className="h-6 w-6" />,
      description: 'Health, fitness, energy, and physical well-being',
      recommendations: [
        'Start with 10-minute daily walks',
        'Gradually increase to 30 minutes of exercise 3x/week',
        'Focus on sleep quality and nutrition',
        'Consider joining a fitness class or group'
      ]
    },
    {
      name: 'Mental',
      score: results?.mentalScore || 0,
      color: 'from-sky-400 to-sky-600',
      icon: <Brain className="h-6 w-6" />,
      description: 'Focus, clarity, learning, and cognitive function',
      recommendations: [
        'Practice daily meditation or mindfulness',
        'Read for 15 minutes each day',
        'Learn a new skill or hobby',
        'Challenge yourself with puzzles or brain games'
      ]
    },
    {
      name: 'Spiritual',
      score: results?.spiritualScore || 0,
      color: 'from-violet-400 to-violet-600',
      icon: <BookOpen className="h-6 w-6" />,
      description: 'Faith, purpose, meaning, and spiritual growth',
      recommendations: [
        'Start with 5 minutes of daily prayer',
        'Read spiritual texts or devotionals',
        'Join a small group or Bible study',
        'Practice gratitude and reflection'
      ]
    },
    {
      name: 'Relational',
      score: results?.relationalScore || 0,
      color: 'from-emerald-400 to-emerald-600',
      icon: <Users className="h-6 w-6" />,
      description: 'Family, friends, community, and social connections',
      recommendations: [
        'Schedule weekly family time',
        'Reach out to one friend each week',
        'Join a community group or club',
        'Practice active listening and empathy'
      ]
    },
    {
      name: 'Financial',
      score: results?.financialScore || 0,
      color: 'from-amber-400 to-amber-600',
      icon: <DollarSign className="h-6 w-6" />,
      description: 'Budgeting, saving, investing, and financial security',
      recommendations: [
        'Create a monthly budget',
        'Start an emergency fund',
        'Track all expenses for 30 days',
        'Learn about basic investing'
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Results</h2>
          <p className="text-blue-200">We're processing your assessment to provide personalized insights...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Results Found</h2>
          <p className="text-blue-200 mb-6">Please complete the assessment first.</p>
          <button
            onClick={() => router.push('/assessment')}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  const dimensionData = getDimensionData();
  const strongestDimension = dimensionData.find(d => d.name.toLowerCase() === results.strongestArea);
  const opportunityDimension = dimensionData.find(d => d.name.toLowerCase() === results.biggestOpportunity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-blue-200 hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-white">Your Assessment Results</h1>
            </div>
            <div className="text-blue-200 text-sm">
              {new Date(results.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overall Score */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-black">{results.totalScore}</div>
              <div className="text-sm text-black">Total Score</div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Your Ascension Score: {results.totalScore}/100
          </h2>
          <p className={`text-xl font-semibold mb-2 ${getScoreColor(results.totalScore)}`}>
            {getScoreLabel(results.totalScore)}
          </p>
          <p className="text-blue-200 max-w-2xl mx-auto">
            You have {results.improvementPotential} points of potential improvement across all dimensions. 
            Focus on your biggest opportunities for maximum impact.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-8">
          {['overview', 'dimensions', 'insights', 'action-plan'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-yellow-400 text-black'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Star className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Your Strongest Area</h3>
                </div>
                {strongestDimension && (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-4">
                      {strongestDimension.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{strongestDimension.name}</h4>
                    <div className="text-3xl font-bold text-green-400 mb-2">{strongestDimension.score}/100</div>
                    <p className="text-blue-200 text-sm">{strongestDimension.description}</p>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Target className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Biggest Opportunity</h3>
                </div>
                {opportunityDimension && (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                      {opportunityDimension.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{opportunityDimension.name}</h4>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">{opportunityDimension.score}/100</div>
                    <p className="text-blue-200 text-sm">{opportunityDimension.description}</p>
                  </div>
                )}
              </div>
            </div>

                         {/* Quick Stats */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Improvement Potential</h3>
                <div className="text-3xl font-bold text-blue-400">{results.improvementPotential} pts</div>
                <p className="text-blue-200 text-sm">Available for growth</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                  <Lightbulb className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Keystone Focus</h3>
                <div className="text-lg font-medium text-purple-400 capitalize">
                  {results.keystoneHabitFocus.replace('_', ' ')}
                </div>
                <p className="text-blue-200 text-sm">Start here for maximum impact</p>
              </div>

                             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                 <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                   <Users className="h-8 w-8 text-green-400" />
                 </div>
                 <h3 className="text-lg font-semibold text-white mb-2">Accountability Need</h3>
                 <div className="text-lg font-medium text-green-400 capitalize">
                   {results.accountabilityNeed.replace('_', ' ')}
                 </div>
                 <p className="text-blue-200 text-sm">Your support preference</p>
               </div>
             </div>

             {/* Improvement Urgency */}
             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
               <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                 results.improvementUrgency === 'critical' ? 'bg-red-500/20' :
                 results.improvementUrgency === 'high' ? 'bg-orange-500/20' :
                 results.improvementUrgency === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
               }`}>
                 <div className={`h-8 w-8 ${
                   results.improvementUrgency === 'critical' ? 'text-red-400' :
                   results.improvementUrgency === 'high' ? 'text-orange-400' :
                   results.improvementUrgency === 'medium' ? 'text-yellow-400' : 'text-green-400'
                 }`}>
                   {results.improvementUrgency === 'critical' ? '🚨' :
                    results.improvementUrgency === 'high' ? '⚠️' :
                    results.improvementUrgency === 'medium' ? '⚡' : '✅'}
                 </div>
               </div>
               <h3 className="text-lg font-semibold text-white mb-2">Improvement Urgency</h3>
               <div className={`text-lg font-medium capitalize mb-2 ${
                 results.improvementUrgency === 'critical' ? 'text-red-400' :
                 results.improvementUrgency === 'high' ? 'text-orange-400' :
                 results.improvementUrgency === 'medium' ? 'text-yellow-400' : 'text-green-400'
               }`}>
                 {results.improvementUrgency}
               </div>
               <p className="text-blue-200 text-sm">
                 {results.improvementUrgency === 'critical' ? 'Immediate action required' :
                  results.improvementUrgency === 'high' ? 'Focus on this area soon' :
                  results.improvementUrgency === 'medium' ? 'Steady improvement recommended' : 'Maintain current progress'}
               </p>
            </div>
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="space-y-6">
            {dimensionData.map((dimension) => (
              <div key={dimension.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${dimension.color}`}>
                      {dimension.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{dimension.name}</h3>
                      <p className="text-blue-200 text-sm">{dimension.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(dimension.score)}`}>
                      {dimension.score}/100
                    </div>
                    <div className="text-blue-200 text-sm">{getScoreLabel(dimension.score)}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full bg-gradient-to-r ${dimension.color} transition-all duration-1000`}
                      style={{ width: `${dimension.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Recommendations:</h4>
                  <ul className="space-y-2">
                    {dimension.recommendations.map((rec, index) => (
                      <li key={index} className="text-white text-sm flex items-start">
                        <CheckCircle className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Key Insights</h3>
              <div className="space-y-4">
                {results.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-200">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Understanding Your Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">80-100: Excellent</h4>
                  <p className="text-blue-200 text-sm">You're thriving in this area. Focus on maintenance and helping others.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">60-79: Good</h4>
                  <p className="text-blue-200 text-sm">Solid foundation with room for improvement. Small changes can yield big results.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">40-59: Fair</h4>
                  <p className="text-blue-200 text-sm">This area needs attention. Focus here for significant life improvements.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">0-39: Needs Attention</h4>
                  <p className="text-blue-200 text-sm">Priority area for immediate focus. Start with small, consistent actions.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'action-plan' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Your Personalized Action Plan</h3>
              <div className="space-y-4">
                {results.recommendedNextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{step}</p>
                    </div>
                    <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-xl font-bold text-white mb-4">Ready to Take Action?</h3>
              <p className="text-blue-200 mb-6">
                Your assessment reveals {results.improvementPotential} points of potential growth. 
                Start with your biggest opportunity area for maximum impact.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/onboarding/goals')}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all"
                >
                  Set Your Goals
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/onboarding/goals')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl rounded-full hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Start Your Transformation Journey
            <ArrowRight className="ml-2 h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your results...</p>
        </div>
      </div>
    }>
      <AssessmentResultsContent />
    </Suspense>
  );
}
