'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
    BookOpen,
  Heart,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Lightbulb,
  Users,
  Cross,
  Church,
  Music,
  RefreshCw
} from 'lucide-react';
import { getPersonalizedVerse, getRandomVerse, BibleVerse } from '@/data/bible-verses';
import { getQuoteByDate } from '@/data/daily-quotes';

interface SpiritualActivity {
  id: string;
  type: 'prayer' | 'reading' | 'meditation' | 'worship' | 'service' | 'gratitude';
  duration: number;
  notes: string;
  date: string;
}

export default function FaithPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [todayVerse, setTodayVerse] = useState<BibleVerse | null>(null);
  const [todayQuote, setTodayQuote] = useState<any>(null);
  const [spiritualActivities, setSpiritualActivities] = useState<SpiritualActivity[]>([]);
  const [newActivity, setNewActivity] = useState<Partial<SpiritualActivity>>({
    type: 'prayer',
    duration: 0,
    notes: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load today's verse and quote
    const verse = getPersonalizedVerse({ mood: 7, energy: 7, streak: 5 });
    setTodayVerse(verse);
    
    const quote = getQuoteByDate(new Date());
    setTodayQuote(quote);

    // Load spiritual activities from localStorage
    const storedActivities = localStorage.getItem(`spiritualActivities_${user.id}`);
    if (storedActivities) {
      setSpiritualActivities(JSON.parse(storedActivities));
    }
  }, [user, router]);

  if (!user) return null;

  const handleAddActivity = () => {
    if (!newActivity.type || !newActivity.duration) return;

    const activity: SpiritualActivity = {
      id: Date.now().toString(),
      type: newActivity.type,
      duration: newActivity.duration,
      notes: newActivity.notes || '',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedActivities = [activity, ...spiritualActivities];
    setSpiritualActivities(updatedActivities);
    localStorage.setItem(`spiritualActivities_${user.id}`, JSON.stringify(updatedActivities));
    
    setNewActivity({ type: 'prayer', duration: 0, notes: '' });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'prayer': return <Heart className="h-5 w-5" />;
      case 'reading': return <BookOpen className="h-5 w-5" />;
      case 'meditation': return <Target className="h-5 w-5" />;
      case 'worship': return <Music className="h-5 w-5" />;
      case 'service': return <Users className="h-5 w-5" />;
      case 'gratitude': return <Heart className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'prayer': return 'from-purple-400 to-purple-600';
      case 'reading': return 'from-blue-400 to-blue-600';
      case 'meditation': return 'from-green-400 to-green-600';
      case 'worship': return 'from-yellow-400 to-yellow-600';
      case 'service': return 'from-red-400 to-red-600';
      case 'gratitude': return 'from-pink-400 to-pink-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTotalTimeThisWeek = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return spiritualActivities
      .filter(activity => new Date(activity.date) >= oneWeekAgo)
      .reduce((total, activity) => total + activity.duration, 0);
  };

  const getStreakDays = () => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date();
    
    while (streak < 365) { // Max 1 year
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasActivity = spiritualActivities.some(activity => activity.date === dateStr);
      
      if (hasActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Faith & Spiritual Growth</h1>
              <p className="text-blue-200 text-sm">Deepen your spiritual journey</p>
            </div>
            <div className="text-blue-200 text-sm flex items-center space-x-2">
              <Calendar size={16} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-8">
          {['overview', 'daily-verse', 'activities', 'growth', 'resources'].map((tab) => (
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
            {/* Today's Verse */}
            {todayVerse && (
              <div className="bg-gradient-to-r from-purple-400/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                                         <BookOpen className="h-8 w-8 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Today&apos;s Verse</h2>
                  <p className="text-blue-200">Personalized for your spiritual journey</p>
                </div>
                <div className="text-center mb-6">
                  <blockquote className="text-xl text-white italic mb-4">
                    &ldquo;{todayVerse.verseText}&rdquo;
                  </blockquote>
                  <cite className="text-purple-300 font-semibold">— {todayVerse.reference}</cite>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">{todayVerse.context}</p>
                </div>
              </div>
            )}

            {/* Today's Quote */}
            {todayQuote && (
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
                    <Lightbulb className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Today&apos;s Inspiration</h2>
                </div>
                <div className="text-center mb-6">
                  <blockquote className="text-xl text-white italic mb-4">
                    &ldquo;{todayQuote.quoteText}&rdquo;
                  </blockquote>
                  <cite className="text-yellow-300 font-semibold">— {todayQuote.author}</cite>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">{todayQuote.context}</p>
                </div>
              </div>
            )}

            {/* Spiritual Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">This Week</h3>
                <div className="text-3xl font-bold text-purple-400">{getTotalTimeThisWeek()} min</div>
                <p className="text-blue-200 text-sm">Spiritual time invested</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Current Streak</h3>
                <div className="text-3xl font-bold text-green-400">{getStreakDays()} days</div>
                <p className="text-blue-200 text-sm">Consistent spiritual practice</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Activities</h3>
                <div className="text-3xl font-bold text-blue-400">{spiritualActivities.length}</div>
                <p className="text-blue-200 text-sm">Total spiritual activities</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'daily-verse' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Daily Bible Verses</h2>
              <p className="text-blue-200 text-lg">Find strength and guidance in God&apos;s Word</p>
            </div>

            {/* Verse Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['motivation', 'consistency', 'faith', 'perseverance', 'growth', 'comfort', 'guidance'].map((category) => (
                <div key={category} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all cursor-pointer">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                      <BookOpen className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white capitalize mb-2">
                      {category.replace('_', ' ')}
                    </h3>
                    <p className="text-blue-200 text-sm">
                      Verses for {category === 'motivation' ? 'encouragement' : 
                                 category === 'consistency' ? 'perseverance' :
                                 category === 'perseverance' ? 'challenges' :
                                 category === 'growth' ? 'development' :
                                 category === 'comfort' ? 'difficult times' :
                                 category === 'guidance' ? 'direction' : 'faith'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Random Verse Button */}
            <div className="text-center">
              <button
                onClick={() => setTodayVerse(getRandomVerse())}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-400 to-blue-500 text-white font-bold text-xl rounded-full hover:from-purple-300 hover:to-blue-400 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <RefreshCw className="h-6 w-6 mr-2" />
                Get Another Verse
              </button>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Track Spiritual Activities</h2>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-lg hover:from-purple-300 hover:to-blue-400 transition-all">
                Add Activity
              </button>
            </div>

            {/* Add New Activity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Log Today&apos;s Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as any })}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="prayer">Prayer</option>
                  <option value="reading">Bible Reading</option>
                  <option value="meditation">Meditation</option>
                  <option value="worship">Worship</option>
                  <option value="service">Service</option>
                  <option value="gratitude">Gratitude</option>
                </select>
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={newActivity.duration || ''}
                  onChange={(e) => setNewActivity({ ...newActivity, duration: parseInt(e.target.value) || 0 })}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={handleAddActivity}
                  className="px-4 py-3 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-lg hover:from-purple-300 hover:to-blue-400 transition-all"
                >
                  Add
                </button>
              </div>
              <textarea
                placeholder="Notes about your spiritual activity..."
                value={newActivity.notes || ''}
                onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-purple-400 resize-none"
                rows={3}
              />
            </div>

            {/* Recent Activities */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {spiritualActivities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold capitalize">
                          {activity.type.replace('_', ' ')}
                        </h4>
                        <p className="text-blue-200 text-sm">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{activity.duration} min</div>
                      {activity.notes && (
                        <p className="text-blue-200 text-sm max-w-xs truncate">{activity.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
                {spiritualActivities.length === 0 && (
                  <p className="text-blue-200 text-center py-8">No activities logged yet. Start your spiritual journey today!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Spiritual Growth Tools</h2>
              <p className="text-blue-200 text-lg">Resources to deepen your faith and spiritual practice</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                                         <Heart className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Prayer Journal</h3>
                  <p className="text-blue-200">Track your prayers and see how God answers</p>
                </div>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-lg hover:from-purple-300 hover:to-blue-400 transition-all">
                  Start Journaling
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Bible Study Plans</h3>
                  <p className="text-blue-200">Structured reading plans for spiritual growth</p>
                </div>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:from-green-300 hover:to-blue-400 transition-all">
                  View Plans
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
                    <Users className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Community Groups</h3>
                  <p className="text-blue-200">Connect with other believers for accountability</p>
                </div>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all">
                  Find Groups
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                    <Cross className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Spiritual Challenges</h3>
                  <p className="text-blue-200">30-day challenges to strengthen your faith</p>
                </div>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg hover:from-red-300 hover:to-pink-400 transition-all">
                  Start Challenge
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Spiritual Resources</h2>
              <p className="text-blue-200 text-lg">Books, podcasts, and tools to support your faith journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Recommended Books</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">The Purpose Driven Life</div>
                      <div className="text-blue-200 text-sm">Rick Warren</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Mere Christianity</div>
                      <div className="text-blue-200 text-sm">C.S. Lewis</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">The Screwtape Letters</div>
                      <div className="text-blue-200 text-sm">C.S. Lewis</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Podcasts & Media</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Music className="h-5 w-5 text-yellow-400" />
                    <div>
                      <div className="text-white font-medium">The Bible Project</div>
                      <div className="text-blue-200 text-sm">Biblical education</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Music className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Focus on the Family</div>
                      <div className="text-blue-200 text-sm">Family & faith</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Music className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">Desiring God</div>
                      <div className="text-blue-200 text-sm">John Piper ministry</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
