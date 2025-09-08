'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Award,
  Calendar,
  User,
  Send,
  BookOpen,
  Prayer,
  Lightbulb,
  Star,
  Eye,
  EyeOff,
  Flag,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { POST_TYPES } from '@/constants';

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  postType: 'encouragement' | 'milestone' | 'question' | 'prayer_request';
  likesCount: number;
  commentsCount: number;
  isAnonymous: boolean;
  createdAt: string;
  tags: string[];
  photoUrl?: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
}

export default function CommunityPage() {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'encouragement' | 'milestone' | 'question' | 'prayer_request'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [newPost, setNewPost] = useState({
    content: '',
    postType: 'encouragement' as const,
    isAnonymous: false,
    tags: [] as string[]
  });

  const [posts] = useState<CommunityPost[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Sarah Johnson',
      userAvatar: '👩‍🦰',
      content: 'Just completed my 30-day morning routine challenge! The consistency has completely transformed my energy levels and mental clarity. Remember, small steps every day lead to massive changes over time. Keep pushing forward, everyone! 💪',
      postType: 'milestone',
      likesCount: 24,
      commentsCount: 8,
      isAnonymous: false,
      createdAt: '2024-01-15T10:30:00Z',
      tags: ['morning-routine', 'consistency', 'transformation'],
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '2',
      userId: 'user2',
      userAvatar: '🙏',
      content: 'Could use some prayer support today. Going through a challenging season at work and feeling overwhelmed. Any words of encouragement or advice from those who have been through similar situations would be greatly appreciated.',
      postType: 'prayer_request',
      likesCount: 18,
      commentsCount: 12,
      isAnonymous: true,
      createdAt: '2024-01-15T09:15:00Z',
      tags: ['prayer', 'work-challenges', 'support'],
      isLiked: true,
      isBookmarked: false
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Michael Chen',
      userAvatar: '👨‍💼',
      content: 'Question for the community: What spiritual practices have you found most effective for maintaining peace during stressful times? I\'m looking to deepen my spiritual foundation and would love to hear your experiences.',
      postType: 'question',
      likesCount: 15,
      commentsCount: 23,
      isAnonymous: false,
      createdAt: '2024-01-15T08:45:00Z',
      tags: ['spiritual-practices', 'peace', 'stress-management'],
      isLiked: false,
      isBookmarked: true
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Emma Rodriguez',
      userAvatar: '👩‍🎨',
      content: 'Today I want to encourage anyone who feels like they\'re not making progress. I was there 6 months ago, feeling stuck and discouraged. But I kept showing up, kept trying, and slowly things started to change. Your breakthrough is coming! Don\'t give up! 🌟',
      postType: 'encouragement',
      likesCount: 31,
      commentsCount: 15,
      isAnonymous: false,
      createdAt: '2024-01-15T07:20:00Z',
      tags: ['encouragement', 'perseverance', 'breakthrough'],
      isLiked: false,
      isBookmarked: false
    }
  ]);

  const [comments] = useState<Comment[]>([
    {
      id: '1',
      userId: 'user5',
      userName: 'David Wilson',
      userAvatar: '👨‍🦱',
      content: 'Praying for you! Work challenges can be so overwhelming. Remember that God is with you in the midst of it all. I found that taking short prayer breaks throughout the day really helps me stay centered.',
      createdAt: '2024-01-15T10:45:00Z',
      likesCount: 5
    },
    {
      id: '2',
      userId: 'user6',
      userName: 'Lisa Thompson',
      userAvatar: '👩‍🦳',
      content: 'You\'re not alone in this! I went through a similar season last year. What helped me was setting clear boundaries and taking one day at a time. Sending you strength and peace! 🙏',
      createdAt: '2024-01-15T11:00:00Z',
      likesCount: 3
    }
  ]);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLike = (postId: string) => {
    // Toggle like functionality
  };

  const handleBookmark = (postId: string) => {
    // Toggle bookmark functionality
  };

  const handleCreatePost = () => {
    // Create post functionality
    setShowCreatePost(false);
    setNewPost({ content: '', postType: 'encouragement', isAnonymous: false, tags: [] });
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab !== 'all' && post.postType !== activeTab) return false;
    if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getPostTypeIcon = (type: string) => {
    const icons = {
      encouragement: '💪',
      milestone: '🎯',
      question: '❓',
      prayer_request: '🙏'
    };
    return icons[type as keyof typeof icons];
  };

  const getPostTypeColor = (type: string) => {
    const colors = {
      encouragement: 'from-green-400 to-emerald-500',
      milestone: 'from-yellow-400 to-orange-500',
      question: 'from-blue-400 to-cyan-500',
      prayer_request: 'from-purple-400 to-pink-500'
    };
    return colors[type as keyof typeof colors];
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">Community</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowCreatePost(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </button>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Active Members</h3>
            <p className="text-3xl font-bold text-blue-400">1,247</p>
            <p className="text-blue-200 text-sm">Growing daily</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Posts Today</h3>
            <p className="text-3xl font-bold text-green-400">23</p>
            <p className="text-blue-200 text-sm">Engagement high</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-white font-semibold mb-2">Your Rank</h3>
            <p className="text-3xl font-bold text-yellow-400">#42</p>
            <p className="text-blue-200 text-sm">Top 5%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Badges Earned</h3>
            <p className="text-3xl font-bold text-purple-400">8</p>
            <p className="text-blue-200 text-sm">Community leader</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts, topics, or members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option value="recent" className="bg-slate-800">Most Recent</option>
                <option value="popular" className="bg-slate-800">Most Popular</option>
                <option value="trending" className="bg-slate-800">Trending</option>
              </select>
              <button className="px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-8">
          {(['all', 'encouragement', 'milestone', 'question', 'prayer_request'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              {tab === 'all' ? (
                <>
                  <Users className="w-4 h-4 inline mr-2" />
                  All Posts
                </>
              ) : (
                <>
                  <span className="mr-2">{getPostTypeIcon(tab)}</span>
                  {tab.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                    {post.userAvatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold">
                        {post.isAnonymous ? 'Anonymous User' : post.userName}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPostTypeColor(post.postType)} text-white`}>
                        {getPostTypeIcon(post.postType)}
                        {post.postType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                    <p className="text-blue-200 text-sm">{formatTimeAgo(post.createdAt)}</p>
                  </div>
                </div>
                <button className="text-blue-200 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-blue-100 text-lg leading-relaxed">{post.content}</p>
                {post.photoUrl && (
                  <div className="mt-4">
                    <img src={post.photoUrl} alt="Post attachment" className="rounded-lg max-w-full" />
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-blue-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      post.isLiked ? 'text-red-400' : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likesCount}</span>
                  </button>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.commentsCount}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`transition-colors ${
                    post.isBookmarked ? 'text-yellow-400' : 'text-blue-200 hover:text-white'
                  }`}
                >
                  <Star className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-6">Create a Post</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Post Type</label>
                  <select
                    value={newPost.postType}
                    onChange={(e) => setNewPost(prev => ({ ...prev, postType: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {POST_TYPES.map((type) => (
                      <option key={type.value} value={type.value} className="bg-slate-800">
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your thoughts, questions, or experiences..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPost.isAnonymous}
                      onChange={(e) => setNewPost(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                      className="w-4 h-4 text-purple-400 bg-white/20 border-white/30 rounded focus:ring-purple-400 focus:ring-2"
                    />
                    <span className="text-blue-200 text-sm">Post anonymously</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="px-6 py-3 bg-white/20 border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.content.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white">Post Details</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Post Content */}
              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                    {selectedPost.userAvatar}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {selectedPost.isAnonymous ? 'Anonymous User' : selectedPost.userName}
                    </h4>
                    <p className="text-blue-200 text-sm">{formatTimeAgo(selectedPost.createdAt)}</p>
                  </div>
                </div>
                <p className="text-blue-100 text-lg leading-relaxed">{selectedPost.content}</p>
              </div>

              {/* Comments */}
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">Comments ({comments.length})</h4>
                <div className="space-y-4 mb-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-sm">
                          {comment.userAvatar}
                        </div>
                        <div>
                          <h5 className="text-white font-medium text-sm">{comment.userName}</h5>
                          <p className="text-blue-200 text-xs">{formatTimeAgo(comment.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-blue-100">{comment.content}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <button className="flex items-center space-x-1 text-blue-200 hover:text-white transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{comment.likesCount}</span>
                        </button>
                        <button className="text-blue-200 hover:text-white transition-colors text-sm">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold text-lg rounded-full hover:from-purple-500 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl mr-4">
            Join Discussion
          </button>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold text-lg rounded-full hover:from-blue-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-2xl">
            Invite Friends
          </button>
        </div>
      </div>
    </div>
  );
}
