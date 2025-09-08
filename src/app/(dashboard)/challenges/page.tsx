'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { databaseService } from '@/lib/supabase';
import GoalDetailModal from '@/components/GoalDetailModal';
import CreateGoalModal from '@/components/CreateGoalModal';
import CreateChallengeModal from '@/components/CreateChallengeModal';
import InvitePartnerModal from '@/components/InvitePartnerModal';
import XPBadgeSystem from '@/components/XPBadgeSystem';
import {
  Target,
  Trophy,
  Plus,
  TrendingUp,
  Calendar,
  Users,
  Zap,
  Star,
  Flame,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Eye,
  Edit3,
  Pause,
  Archive,
  GripVertical,
  Sparkles,
  Brain,
  BarChart3,
  Activity,
  MessageCircle,
  Share2,
  Settings
} from 'lucide-react';

// Types
interface Goal {
  id: string;
  title: string;
  purpose: string;
  target_type: string;
  target_value: any;
  target_date?: string;
  progress_pct: number;
  priority: number;
  state: string;
  health: 'green' | 'yellow' | 'red';
  metadata: any;
  goal_milestones: any[];
  goal_habits: any[];
  challenges: any[];
  goal_ai_suggestions: any[];
  goal_accountability: any[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  reward_xp: number;
  reward_badge?: string;
  challenge_state: 'planned' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  challenge_tasks: any[];
}

interface AISuggestion {
  id: string;
  suggestion_type: string;
  short_text: string;
  rationale: string;
  estimated_effort: string;
  projected_impact?: string;
  evidence: string;
  confidence_score: number;
  applied_at?: string;
  dismissed_at?: string;
}

interface UserXP {
  total_xp: number;
  level: number;
  badges: any[];
}

export default function GoalsChallengesPage() {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  
  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showGoalDetail, setShowGoalDetail] = useState(false);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [showInvitePartner, setShowInvitePartner] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<Goal | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadGoals(),
        loadChallenges(),
        loadAISuggestions(),
        loadUserXP()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGoals = async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔄 Loading goals for user:', user.id);
      const dbGoals = await databaseService.getGoals(user.id);
      console.log('📊 Loaded goals:', dbGoals.length);
      
      setGoals(dbGoals);
      
      // Set current focus (highest priority active goal)
      const activeGoals = dbGoals.filter((g: Goal) => g.state === 'active');
      if (activeGoals.length > 0) {
        const focusGoal = activeGoals.sort((a: Goal, b: Goal) => b.priority - a.priority)[0];
        setCurrentFocus(focusGoal);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const loadChallenges = async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔄 Loading challenges for user:', user.id);
      const dbChallenges = await databaseService.getChallenges(user.id);
      console.log('🏆 Loaded challenges:', dbChallenges.length);
      
      setChallenges(dbChallenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const loadAISuggestions = async () => {
    try {
      const response = await fetch(`/api/goals/ai-suggestions?userId=${user?.id}`);
      const data = await response.json();
      if (data.data) {
        setAiSuggestions(data.data);
      }
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
    }
  };

  const loadUserXP = async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔄 Loading user XP for user:', user.id);
      const dbUserXP = await databaseService.getUserXP(user.id);
      console.log('💰 Loaded user XP:', dbUserXP);
      
      setUserXP(dbUserXP);
    } catch (error) {
      console.error('Error loading user XP:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowGoalDetail(true);
  };

  const handleApplySuggestion = async (suggestionId: string) => {
    try {
      const response = await fetch('/api/goals/ai-suggestions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestionId,
          userId: user?.id,
          action: 'apply'
        })
      });
      
      if (response.ok) {
        await loadAISuggestions();
        await loadGoals();
      }
    } catch (error) {
      console.error('Error applying suggestion:', error);
    }
  };

  const handleDismissSuggestion = async (suggestionId: string) => {
    try {
      const response = await fetch('/api/goals/ai-suggestions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestionId,
          userId: user?.id,
          action: 'dismiss'
        })
      });
      
      if (response.ok) {
        await loadAISuggestions();
      }
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'green': return 'text-green-500 bg-green-50 border-green-200';
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'red': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'green': return <CheckCircle className="w-4 h-4" />;
      case 'yellow': return <AlertCircle className="w-4 h-4" />;
      case 'red': return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Goals & Challenges</h2>
          <p className="text-blue-200">Preparing your transformation journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Goals & Challenges</h1>
            <p className="text-blue-200">Your complete life transformation dashboard</p>
          </div>
            <div className="flex items-center space-x-3">
            {userXP && (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">Level {userXP.level}</span>
                <span className="text-blue-200">{userXP.total_xp} XP</span>
              </div>
            )}
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
        </div>
      </div>

        {/* Hero / Current Focus */}
        {currentFocus && (
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-white/20 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Focus of the Week</h2>
                    <p className="text-purple-200">Your top priority goal</p>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{currentFocus.title}</h3>
                <p className="text-purple-200 mb-4">{currentFocus.purpose}</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-white/20 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${currentFocus.progress_pct}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold">{Math.round(currentFocus.progress_pct)}%</span>
                  </div>
                  {currentFocus.target_date && (
                    <div className="flex items-center space-x-2 text-purple-200">
                      <Calendar className="w-4 h-4" />
                      <span>Target: {new Date(currentFocus.target_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => handleGoalClick(currentFocus)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  onClick={() => setShowCreateChallenge(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Plan Next Step
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Target className="w-6 h-6 mr-2 text-blue-400" />
                Your Goals
              </h2>
              <Button
                onClick={() => setShowCreateGoal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Goal
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <Card
                  key={goal.id}
                  className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer group"
                  onClick={() => handleGoalClick(goal)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{goal.title}</h3>
                      <p className="text-blue-200 text-sm mb-3">{goal.purpose}</p>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getHealthColor(goal.health)}`}>
                      {getHealthIcon(goal.health)}
                      <span className="capitalize">{goal.health}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">Progress</span>
                      <span className="text-white font-semibold">{Math.round(goal.progress_pct)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress_pct}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-blue-200">
                          <Activity className="w-3 h-3" />
                          <span>{goal.goal_habits?.length || 0} habits</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-200">
                          <Trophy className="w-3 h-3" />
                          <span>{goal.challenges?.length || 0} challenges</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-200">
                        <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs">Priority {goal.priority}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Coach Panel */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Coach</h3>
              </div>
              
              {aiSuggestions.length > 0 ? (
                <div className="space-y-3">
                  {aiSuggestions.slice(0, 2).map((suggestion) => (
                    <div key={suggestion.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm">{suggestion.short_text}</h4>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-blue-200">{Math.round(suggestion.confidence_score * 100)}%</span>
                        </div>
                      </div>
                      <p className="text-blue-200 text-xs mb-3">{suggestion.rationale}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 italic">{suggestion.evidence}</span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApplySuggestion(suggestion.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                          >
                            Apply
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismissSuggestion(suggestion.id)}
                            className="text-gray-400 hover:text-white text-xs px-3 py-1"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-blue-200 text-sm">No suggestions yet. Keep working on your goals!</p>
                </div>
              )}
            </Card>

            {/* Challenges Carousel */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Micro-Challenges
                </h3>
                <Button
                  onClick={() => setShowCreateChallenge(true)}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  New
                </Button>
              </div>

              <div className="space-y-3">
                {challenges.slice(0, 3).map((challenge) => (
                  <div key={challenge.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{challenge.title}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        challenge.challenge_state === 'running' ? 'bg-green-500/20 text-green-400' :
                        challenge.challenge_state === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        challenge.challenge_state === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {challenge.challenge_state}
                      </div>
                    </div>
                    <p className="text-blue-200 text-xs mb-3">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-blue-200">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{challenge.duration_days} days</span>
                        </div>
                        {challenge.reward_xp > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{challenge.reward_xp} XP</span>
                          </div>
                        )}
                      </div>
                      {challenge.challenge_state === 'planned' && (
                        <Button
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1"
                        >
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* XP & Badges System */}
            <XPBadgeSystem userId={user?.id || ''} />

            {/* Metrics & Forecast */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                Progress Overview
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Active Goals</span>
                  <span className="text-white font-semibold">{goals.filter(g => g.state === 'active').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Running Challenges</span>
                  <span className="text-white font-semibold">{challenges.filter(c => c.challenge_state === 'running').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Avg Progress</span>
                  <span className="text-white font-semibold">
                    {goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress_pct, 0) / goals.length) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">AI Suggestions</span>
                  <span className="text-white font-semibold">{aiSuggestions.filter(s => !s.applied_at && !s.dismissed_at).length}</span>
                </div>
            </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <GoalDetailModal
        goal={selectedGoal}
        isOpen={showGoalDetail}
        onClose={() => setShowGoalDetail(false)}
        userId={user?.id || ''}
        onGoalUpdate={loadData}
      />

      <CreateGoalModal
        isOpen={showCreateGoal}
        onClose={() => setShowCreateGoal(false)}
        userId={user?.id || ''}
        onGoalCreated={loadData}
      />

      <CreateChallengeModal
        isOpen={showCreateChallenge}
        onClose={() => setShowCreateChallenge(false)}
        userId={user?.id || ''}
        goalId={selectedGoal?.id}
        onChallengeCreated={loadData}
      />

      <InvitePartnerModal
        isOpen={showInvitePartner}
        onClose={() => setShowInvitePartner(false)}
        userId={user?.id || ''}
        goal={selectedGoal}
        onPartnerInvited={loadData}
      />
    </div>
  );
}
