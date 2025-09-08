'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Star,
  Award,
  Flame,
  Target,
  Zap,
  Crown,
  Gem,
  Shield,
  Sword,
  Heart,
  Brain,
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface UserXP {
  total_xp: number;
  level: number;
  badges: any[];
  recent_transactions?: any[];
}

interface XPBadgeSystemProps {
  userId: string;
  className?: string;
}

export default function XPBadgeSystem({ userId, className = '' }: XPBadgeSystemProps) {
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadUserXP();
  }, [userId]);

  const loadUserXP = async () => {
    try {
      const response = await fetch(`/api/user/xp?userId=${userId}&includeTransactions=true`);
      const data = await response.json();
      if (data.data) {
        setUserXP(data.data);
      }
    } catch (error) {
      console.error('Error loading user XP:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelInfo = (level: number) => {
    const xpForCurrentLevel = (level - 1) * 100;
    const xpForNextLevel = level * 100;
    const progressToNext = ((userXP?.total_xp || 0) - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel);
    
    return {
      currentLevelXP: xpForCurrentLevel,
      nextLevelXP: xpForNextLevel,
      progressToNext: Math.min(progressToNext * 100, 100),
      xpNeeded: Math.max(xpForNextLevel - (userXP?.total_xp || 0), 0)
    };
  };

  const getLevelTitle = (level: number) => {
    if (level >= 50) return 'Legendary';
    if (level >= 40) return 'Master';
    if (level >= 30) return 'Expert';
    if (level >= 20) return 'Advanced';
    if (level >= 10) return 'Intermediate';
    return 'Beginner';
  };

  const getLevelColor = (level: number) => {
    if (level >= 50) return 'from-purple-600 to-pink-600';
    if (level >= 40) return 'from-yellow-500 to-orange-500';
    if (level >= 30) return 'from-blue-500 to-indigo-500';
    if (level >= 20) return 'from-green-500 to-emerald-500';
    if (level >= 10) return 'from-blue-400 to-cyan-400';
    return 'from-gray-400 to-slate-400';
  };

  const getLevelIcon = (level: number) => {
    if (level >= 50) return <Crown className="w-5 h-5" />;
    if (level >= 40) return <Gem className="w-5 h-5" />;
    if (level >= 30) return <Shield className="w-5 h-5" />;
    if (level >= 20) return <Sword className="w-5 h-5" />;
    if (level >= 10) return <Award className="w-5 h-5" />;
    return <Star className="w-5 h-5" />;
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'consistency': return <CheckCircle className="w-4 h-4" />;
      case 'challenge': return <Trophy className="w-4 h-4" />;
      case 'habit': return <Zap className="w-4 h-4" />;
      case 'goal': return <Award className="w-4 h-4" />;
      case 'physical': return <Heart className="w-4 h-4" />;
      case 'mental': return <Brain className="w-4 h-4" />;
      case 'spiritual': return <BookOpen className="w-4 h-4" />;
      case 'relational': return <Users className="w-4 h-4" />;
      case 'financial': return <DollarSign className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'streak': return 'from-orange-500 to-red-500';
      case 'milestone': return 'from-blue-500 to-indigo-500';
      case 'consistency': return 'from-green-500 to-emerald-500';
      case 'challenge': return 'from-yellow-500 to-orange-500';
      case 'habit': return 'from-purple-500 to-pink-500';
      case 'goal': return 'from-cyan-500 to-blue-500';
      case 'physical': return 'from-red-500 to-pink-500';
      case 'mental': return 'from-blue-500 to-cyan-500';
      case 'spiritual': return 'from-purple-500 to-violet-500';
      case 'relational': return 'from-green-500 to-teal-500';
      case 'financial': return 'from-yellow-500 to-amber-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  if (loading) {
    return (
      <Card className={`bg-white/10 backdrop-blur-sm border-white/20 p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-white/10 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!userXP) {
    return (
      <Card className={`bg-white/10 backdrop-blur-sm border-white/20 p-4 ${className}`}>
        <div className="text-center">
          <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-blue-200 text-sm">XP system not initialized</p>
        </div>
      </Card>
    );
  }

  const levelInfo = getLevelInfo(userXP.level);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main XP Display */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${getLevelColor(userXP.level)} rounded-xl flex items-center justify-center`}>
              {getLevelIcon(userXP.level)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Level {userXP.level} • {getLevelTitle(userXP.level)}
              </h3>
              <p className="text-blue-200 text-sm">{userXP.total_xp} Total XP</p>
            </div>
          </div>
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="ghost"
            className="text-blue-200 hover:text-white hover:bg-white/10"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-200">Progress to Level {userXP.level + 1}</span>
            <span className="text-white font-medium">
              {userXP.total_xp - levelInfo.currentLevelXP} / {levelInfo.nextLevelXP - levelInfo.currentLevelXP} XP
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r ${getLevelColor(userXP.level)} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${levelInfo.progressToNext}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-xs">
            {levelInfo.xpNeeded} XP needed for next level
          </p>
        </div>
      </Card>

      {/* Detailed View */}
      {showDetails && (
        <div className="space-y-4">
          {/* Recent XP Transactions */}
          {userXP.recent_transactions && userXP.recent_transactions.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Recent XP Earned
              </h4>
              <div className="space-y-3">
                {userXP.recent_transactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{transaction.description}</p>
                        <p className="text-blue-200 text-xs">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">+{transaction.amount} XP</p>
                      <p className="text-gray-400 text-xs capitalize">{transaction.source_type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Badges */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-400" />
              Badges & Achievements
            </h4>
            
            {userXP.badges && userXP.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userXP.badges.map((badge, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getBadgeColor(badge.type)} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
                      {getBadgeIcon(badge.type)}
                    </div>
                    <h5 className="text-white font-medium text-sm">{badge.name}</h5>
                    <p className="text-blue-200 text-xs">{badge.description}</p>
                    {badge.earned_at && (
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(badge.earned_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-blue-200">No badges earned yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Complete challenges and reach milestones to earn badges
                </p>
              </div>
            )}
          </Card>

          {/* XP Sources */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              How to Earn XP
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Habit Completion</p>
                    <p className="text-blue-200 text-sm">+5 XP per habit</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Challenge Completion</p>
                    <p className="text-blue-200 text-sm">+25-200 XP</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-white font-medium">Streak Milestones</p>
                    <p className="text-blue-200 text-sm">+10-50 XP</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Target className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Goal Milestones</p>
                    <p className="text-blue-200 text-sm">+50-100 XP</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Award className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Consistency Bonus</p>
                    <p className="text-blue-200 text-sm">+15 XP weekly</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white font-medium">AI Suggestion Applied</p>
                    <p className="text-blue-200 text-sm">+10 XP</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
