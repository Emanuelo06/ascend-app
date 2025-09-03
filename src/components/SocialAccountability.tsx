'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Heart, 
  Trophy, 
  Target,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  X,
  Send,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { Habit, HabitCheckin } from '@/types';

interface AccountabilityPartner {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  habits: string[];
  completionRate: number;
  streak: number;
  mutualHabits: number;
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  maxParticipants: number;
  startDate: Date;
  endDate: Date;
  progress: number;
  rewards: string[];
  category: 'fitness' | 'productivity' | 'mindfulness' | 'learning';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  habitId?: string;
  habitTitle?: string;
  type: 'achievement' | 'milestone' | 'motivation' | 'question';
  likes: number;
  comments: number;
  timestamp: Date;
  isLiked: boolean;
}

interface SocialAccountabilityProps {
  habits: Habit[];
  checkins: HabitCheckin[];
}

const SocialAccountability: React.FC<SocialAccountabilityProps> = ({ habits, checkins }) => {
  const [activeTab, setActiveTab] = useState<'partners' | 'challenges' | 'community' | 'leaderboard'>('partners');
  const [partners, setPartners] = useState<AccountabilityPartner[]>([]);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    // Generate mock accountability partners
    const mockPartners: AccountabilityPartner[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: '👩‍💼',
        status: 'online',
        lastSeen: new Date(),
        habits: ['Morning Exercise', 'Reading', 'Meditation'],
        completionRate: 87,
        streak: 12,
        mutualHabits: 2
      },
      {
        id: '2',
        name: 'Mike Chen',
        avatar: '👨‍💻',
        status: 'away',
        lastSeen: new Date(Date.now() - 30 * 60 * 1000),
        habits: ['Deep Work', 'Hydration', 'Evening Walk'],
        completionRate: 92,
        streak: 8,
        mutualHabits: 1
      },
      {
        id: '3',
        name: 'Emma Davis',
        avatar: '👩‍🎨',
        status: 'offline',
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
        habits: ['Creative Writing', 'Sketching', 'Mindful Eating'],
        completionRate: 78,
        streak: 15,
        mutualHabits: 0
      }
    ];

    // Generate mock community challenges
    const mockChallenges: CommunityChallenge[] = [
      {
        id: '1',
        title: '30-Day Fitness Challenge',
        description: 'Complete 30 minutes of exercise every day for 30 days',
        participants: 156,
        maxParticipants: 200,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        progress: 78,
        rewards: ['Fitness Badge', 'Community Recognition', 'Progress Certificate'],
        category: 'fitness',
        difficulty: 'medium'
      },
      {
        id: '2',
        title: 'Mindful Morning Routine',
        description: 'Establish a consistent morning routine with meditation and planning',
        participants: 89,
        maxParticipants: 150,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
        progress: 45,
        rewards: ['Mindfulness Badge', 'Inner Peace Achievement'],
        category: 'mindfulness',
        difficulty: 'easy'
      },
      {
        id: '3',
        title: 'Productivity Sprint',
        description: 'Complete 5 high-impact tasks daily for 21 days',
        participants: 234,
        maxParticipants: 300,
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        progress: 67,
        rewards: ['Productivity Master Badge', 'Efficiency Certificate'],
        category: 'productivity',
        difficulty: 'hard'
      }
    ];

    // Generate mock social posts
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        userId: '1',
        userName: 'Sarah Johnson',
        userAvatar: '👩‍💼',
        content: 'Just completed my 12th day of morning exercise! 💪 The energy boost is incredible. Who else is feeling the morning routine benefits?',
        habitId: '1',
        habitTitle: 'Morning Exercise',
        type: 'achievement',
        likes: 24,
        comments: 8,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isLiked: false
      },
      {
        id: '2',
        userId: '2',
        userName: 'Mike Chen',
        userAvatar: '👨‍💻',
        content: 'Question: How do you maintain focus during deep work sessions? I\'m trying to improve my concentration but getting distracted easily.',
        type: 'question',
        likes: 12,
        comments: 15,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isLiked: true
      },
      {
        id: '3',
        userId: '3',
        userName: 'Emma Davis',
        userAvatar: '👩‍🎨',
        content: 'Reached 100 days of creative writing! 🎨 The daily practice has transformed my creativity. Consistency really is the key to mastery.',
        habitId: '3',
        habitTitle: 'Creative Writing',
        type: 'milestone',
        likes: 45,
        comments: 12,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isLiked: false
      }
    ];

    setPartners(mockPartners);
    setChallenges(mockChallenges);
    setSocialPosts(mockPosts);
  };

  const handleLikePost = (postId: string) => {
    setSocialPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: SocialPost = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      userAvatar: '👤',
      content: newPost,
      type: 'motivation',
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      isLiked: false
    };

    setSocialPosts([post, ...socialPosts]);
    setNewPost('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'away': return 'text-yellow-400';
      case 'offline': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-blue-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness': return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
      case 'productivity': return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30';
      case 'mindfulness': return 'from-purple-500/20 to-pink-500/20 border-purple-400/30';
      case 'learning': return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-400/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
              <Users className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Social Accountability</h3>
              <p className="text-green-200">Connect with partners, join challenges, and build a supportive community</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400 mb-1">{partners.length}</div>
              <div className="text-green-200 text-sm">Partners</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-400 mb-1">{challenges.length}</div>
              <div className="text-blue-200 text-sm">Active Challenges</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4">
          {[
            { id: 'partners', label: 'Accountability Partners', icon: Users },
            { id: 'challenges', label: 'Community Challenges', icon: Trophy },
            { id: 'community', label: 'Social Feed', icon: MessageCircle },
            { id: 'leaderboard', label: 'Leaderboard', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-white/5 text-green-200 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accountability Partners Tab */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold text-white">Your Accountability Partners</h4>
            <button
              onClick={() => setShowAddPartner(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Partner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{partner.avatar}</div>
                    <div>
                      <h5 className="text-lg font-semibold text-white">{partner.name}</h5>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusDot(partner.status)}`}></div>
                        <span className={`text-sm ${getStatusColor(partner.status)}`}>
                          {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-200">Completion Rate</span>
                    <span className="text-white font-semibold">{partner.completionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-200">Current Streak</span>
                    <span className="text-white font-semibold">{partner.streak} days</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-200">Mutual Habits</span>
                    <span className="text-white font-semibold">{partner.mutualHabits}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h6 className="font-semibold text-white text-sm">Active Habits:</h6>
                  <div className="flex flex-wrap gap-2">
                    {partner.habits.slice(0, 3).map((habit, index) => (
                      <span key={index} className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        {habit}
                      </span>
                    ))}
                    {partner.habits.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-blue-200 rounded-full text-xs">
                        +{partner.habits.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    Message
                  </button>
                  <button className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                    <Share2 className="w-4 h-4 inline mr-1" />
                    Share Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold text-white">Active Community Challenges</h4>
            <button
              onClick={() => setShowCreateChallenge(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Create Challenge</span>
            </button>
          </div>

          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className={`bg-gradient-to-r ${getCategoryColor(challenge.category)} backdrop-blur-sm rounded-2xl p-6 border shadow-xl hover:shadow-2xl transition-all duration-300`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="text-xl font-semibold text-white">{challenge.title}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)} bg-white/10`}>
                        {challenge.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-blue-200 text-sm mb-3">{challenge.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-200">Participants:</span>
                        <div className="text-white font-semibold">{challenge.participants}/{challenge.maxParticipants}</div>
                      </div>
                      <div>
                        <span className="text-blue-200">Progress:</span>
                        <div className="text-white font-semibold">{challenge.progress}%</div>
                      </div>
                      <div>
                        <span className="text-blue-200">Start Date:</span>
                        <div className="text-white font-semibold">
                          {challenge.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <span className="text-blue-200">End Date:</span>
                        <div className="text-white font-semibold">
                          {challenge.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-blue-200 mb-2">
                    <span>Challenge Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="mb-4">
                  <h6 className="font-semibold text-white text-sm mb-2">Rewards:</h6>
                  <div className="flex flex-wrap gap-2">
                    {challenge.rewards.map((reward, index) => (
                      <span key={index} className="px-3 py-1 bg-white/10 text-yellow-400 rounded-full text-sm">
                        🏆 {reward}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Join Challenge
                  </button>
                  <button className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Feed Tab */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-white">Community Feed</h4>

          {/* Create Post */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex space-x-3">
              <div className="text-2xl">👤</div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your progress, ask questions, or motivate others..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20 resize-none"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm">
                      🏆 Achievement
                    </button>
                    <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                      ❓ Question
                    </button>
                    <button className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm">
                      💪 Motivation
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 inline mr-2" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Posts */}
          <div className="space-y-4">
            {socialPosts.map((post) => (
              <div key={post.id} className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/30 transition-all duration-300">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="text-2xl">{post.userAvatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-white">{post.userName}</h5>
                      {post.habitTitle && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                          {post.habitTitle}
                        </span>
                      )}
                      <span className="text-blue-200 text-sm">
                        {post.timestamp.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-blue-200">{post.content}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        post.isLiked 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-white/10 text-blue-200 hover:bg-white/20'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white/10 text-blue-200 rounded-lg hover:bg-white/20 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white/10 text-blue-200 rounded-lg hover:bg-white/20 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-white">Community Leaderboard</h4>
          
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <h5 className="text-lg font-semibold text-white mb-2">This Month's Top Performers</h5>
              <p className="text-blue-200 text-sm">Based on completion rates, streaks, and community engagement</p>
            </div>

            <div className="space-y-4">
              {[
                { rank: 1, name: 'Sarah Johnson', avatar: '👩‍💼', score: 98, streak: 15, habits: 5 },
                { rank: 2, name: 'Mike Chen', avatar: '👨‍💻', score: 95, streak: 12, habits: 4 },
                { rank: 3, name: 'Emma Davis', avatar: '👩‍🎨', score: 92, streak: 18, habits: 6 },
                { rank: 4, name: 'Alex Rodriguez', avatar: '👨‍🏫', score: 89, streak: 10, habits: 3 },
                { rank: 5, name: 'Lisa Wang', avatar: '👩‍⚕️', score: 87, streak: 14, habits: 4 }
              ].map((user, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg">
                    {user.rank}
                  </div>
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="flex-1">
                    <h6 className="font-semibold text-white">{user.name}</h6>
                    <div className="flex items-center space-x-4 text-sm text-blue-200">
                      <span>Score: {user.score}</span>
                      <span>Streak: {user.streak} days</span>
                      <span>Habits: {user.habits}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">{user.score}</div>
                    <div className="text-blue-200 text-sm">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialAccountability;
