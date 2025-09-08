'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  X,
  Target,
  Calendar,
  Activity,
  Trophy,
  Brain,
  Users,
  Share2,
  Edit3,
  Pause,
  Archive,
  Plus,
  Clock,
  Star,
  Flame,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  MessageCircle,
  BarChart3,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

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

interface GoalDetailModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onGoalUpdate: () => void;
}

export default function GoalDetailModal({ goal, isOpen, onClose, userId, onGoalUpdate }: GoalDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'habits' | 'challenges' | 'suggestions' | 'accountability'>('overview');
  const [loading, setLoading] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [showInvitePartner, setShowInvitePartner] = useState(false);

  if (!isOpen || !goal) return null;

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

  const handleApplySuggestion = async (suggestionId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/goals/ai-suggestions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestionId,
          userId,
          action: 'apply'
        })
      });
      
      if (response.ok) {
        onGoalUpdate();
      }
    } catch (error) {
      console.error('Error applying suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissSuggestion = async (suggestionId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/goals/ai-suggestions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestionId,
          userId,
          action: 'dismiss'
        })
      });
      
      if (response.ok) {
        onGoalUpdate();
      }
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async (challengeId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: 'start'
        })
      });
      
      if (response.ok) {
        onGoalUpdate();
      }
    } catch (error) {
      console.error('Error starting challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{goal.title}</h2>
              <p className="text-blue-200">{goal.purpose}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getHealthColor(goal.health)}`}>
              {getHealthIcon(goal.health)}
              <span className="capitalize">{goal.health}</span>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Goal Info */}
          <div className="w-1/3 p-6 border-r border-white/10 overflow-y-auto">
            <div className="space-y-6">
              {/* Progress Ring */}
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - goal.progress_pct / 100)}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{Math.round(goal.progress_pct)}%</div>
                      <div className="text-sm text-blue-200">Complete</div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Progress</h3>
                <p className="text-blue-200 text-sm">Keep up the great work!</p>
              </div>

              {/* Goal Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Target Type</span>
                  <span className="text-white font-medium capitalize">{goal.target_type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Target Value</span>
                  <span className="text-white font-medium">
                    {goal.target_value?.value} {goal.target_value?.type}
                  </span>
                </div>
                {goal.target_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Target Date</span>
                    <span className="text-white font-medium">
                      {new Date(goal.target_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Priority</span>
                  <span className="text-white font-medium">{goal.priority}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">State</span>
                  <span className="text-white font-medium capitalize">{goal.state}</span>
                </div>
              </div>

              {/* Milestones */}
              {goal.goal_milestones && goal.goal_milestones.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Milestones
                  </h4>
                  <div className="space-y-2">
                    {goal.goal_milestones.map((milestone) => (
                      <div key={milestone.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{milestone.title}</span>
                          {milestone.achieved_at ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        {milestone.due_date && (
                          <p className="text-blue-200 text-xs mt-1">
                            Due: {new Date(milestone.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => setShowCreateChallenge(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Challenge
                </Button>
                <Button
                  onClick={() => setShowInvitePartner(true)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Invite Partner
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-blue-200 hover:text-white hover:bg-white/10"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Goal
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'habits', label: 'Habits', icon: Activity },
                { id: 'challenges', label: 'Challenges', icon: Trophy },
                { id: 'suggestions', label: 'AI Suggestions', icon: Brain },
                { id: 'accountability', label: 'Partners', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-blue-400 bg-white/5'
                      : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-3">
                        <Activity className="w-5 h-5 text-blue-400" />
                        <h4 className="text-white font-semibold">Linked Habits</h4>
                      </div>
                      <div className="text-2xl font-bold text-white">{goal.goal_habits?.length || 0}</div>
                      <p className="text-blue-200 text-sm">Habits contributing to this goal</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-3">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <h4 className="text-white font-semibold">Active Challenges</h4>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {goal.challenges?.filter(c => c.challenge_state === 'running').length || 0}
                      </div>
                      <p className="text-blue-200 text-sm">Challenges in progress</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-3">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <h4 className="text-white font-semibold">AI Suggestions</h4>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {goal.goal_ai_suggestions?.filter(s => !s.applied_at && !s.dismissed_at).length || 0}
                      </div>
                      <p className="text-blue-200 text-sm">Pending suggestions</p>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Progress Timeline
                    </h4>
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-blue-200">Progress timeline visualization coming soon</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'habits' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold">Linked Habits</h4>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Link Habit
                    </Button>
                  </div>
                  
                  {goal.goal_habits && goal.goal_habits.length > 0 ? (
                    <div className="space-y-3">
                      {goal.goal_habits.map((goalHabit) => (
                        <div key={goalHabit.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-white font-medium">{goalHabit.habits?.title}</h5>
                              <p className="text-blue-200 text-sm">{goalHabit.habits?.purpose}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">Weight: {goalHabit.weight}</div>
                              <div className="text-blue-200 text-sm">
                                {goalHabit.habits?.moment} • {goalHabit.habits?.difficulty}/5
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-blue-200">No habits linked to this goal yet</p>
                      <Button
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {/* TODO: Open habit linking modal */}}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Link Your First Habit
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'challenges' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold">Challenges</h4>
                    <Button
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      onClick={() => setShowCreateChallenge(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Challenge
                    </Button>
                  </div>
                  
                  {goal.challenges && goal.challenges.length > 0 ? (
                    <div className="space-y-3">
                      {goal.challenges.map((challenge) => (
                        <div key={challenge.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="text-white font-medium">{challenge.title}</h5>
                              <p className="text-blue-200 text-sm">{challenge.description}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              challenge.challenge_state === 'running' ? 'bg-green-500/20 text-green-400' :
                              challenge.challenge_state === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                              challenge.challenge_state === 'failed' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {challenge.challenge_state}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-blue-200">
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
                                onClick={() => handleStartChallenge(challenge.id)}
                                disabled={loading}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                              >
                                Start Challenge
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-blue-200">No challenges created for this goal yet</p>
                      <Button
                        className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white"
                        onClick={() => setShowCreateChallenge(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Challenge
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">AI Suggestions</h4>
                  
                  {goal.goal_ai_suggestions && goal.goal_ai_suggestions.length > 0 ? (
                    <div className="space-y-3">
                      {goal.goal_ai_suggestions
                        .filter(s => !s.applied_at && !s.dismissed_at)
                        .map((suggestion) => (
                        <div key={suggestion.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="text-white font-medium">{suggestion.short_text}</h5>
                              <p className="text-blue-200 text-sm">{suggestion.rationale}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-blue-200">
                                {Math.round(suggestion.confidence_score * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-xs text-gray-400 italic">{suggestion.evidence}</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-blue-200">
                              <span>Effort: {suggestion.estimated_effort}</span>
                              {suggestion.projected_impact && (
                                <span>Impact: {suggestion.projected_impact}</span>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApplySuggestion(suggestion.id)}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Apply
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDismissSuggestion(suggestion.id)}
                                disabled={loading}
                                className="text-gray-400 hover:text-white"
                              >
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-blue-200">No AI suggestions available yet</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Keep working on your goal to receive personalized suggestions
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'accountability' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold">Accountability Partners</h4>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setShowInvitePartner(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Invite Partner
                    </Button>
                  </div>
                  
                  {goal.goal_accountability && goal.goal_accountability.length > 0 ? (
                    <div className="space-y-3">
                      {goal.goal_accountability.map((partnership) => (
                        <div key={partnership.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h5 className="text-white font-medium">
                                  {partnership.partner_profile?.full_name || partnership.partner_email}
                                </h5>
                                <p className="text-blue-200 text-sm">
                                  {partnership.partner_profile?.email || partnership.partner_email}
                                </p>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              partnership.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                              partnership.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              partnership.status === 'declined' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {partnership.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-blue-200">No accountability partners yet</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Invite someone to help you stay accountable to this goal
                      </p>
                      <Button
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setShowInvitePartner(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Invite Your First Partner
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
