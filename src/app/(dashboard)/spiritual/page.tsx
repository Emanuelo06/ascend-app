'use client';

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Heart, 
  Cross, 
  Heart as HeartIcon, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Plus,
  ArrowRight,
  Star,
  Flame,
  BookOpenCheck
} from 'lucide-react';

export default function SpiritualPage() {
  const { user, updateUserData } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  const spiritualPractices = [
    { name: 'Daily Prayer', description: 'Morning and evening prayer time', frequency: 'Daily', icon: Heart },
    { name: 'Bible Reading', description: 'Scripture study and reflection', frequency: 'Daily', icon: BookOpen },
    { name: 'Gratitude Journal', description: 'Write down blessings and thanks', frequency: 'Daily', icon: HeartIcon },
    { name: 'Meditation', description: 'Quiet time for spiritual reflection', frequency: '3x/week', icon: Lightbulb },
    { name: 'Worship Music', description: 'Listen to uplifting music', frequency: 'Daily', icon: Star },
    { name: 'Small Group', description: 'Connect with other believers', frequency: 'Weekly', icon: Cross },
  ];

  const spiritualGoals = [
    { title: 'Deepen Prayer Life', progress: 0, target: '30 min daily prayer' },
    { title: 'Read Through Bible', progress: 0, target: 'Complete in 1 year' },
    { title: 'Serve Others', progress: 0, target: 'Weekly service opportunity' },
    { title: 'Grow in Faith', progress: 0, target: 'Daily spiritual practices' },
  ];

  const dailyDevotional = {
    title: "Today's Devotional",
    verse: "Philippians 4:6-7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    reflection: "What are you anxious about today? Take a moment to bring it to God in prayer."
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <BookOpen className="w-10 h-10 mr-3 text-purple-400" />
          Spiritual Growth
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
          Nurture your faith and deepen your spiritual connection. Your spiritual journey is unique and personal.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mb-4">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Spiritual Streak</h3>
          <div className="text-3xl font-bold text-purple-400">{user.streaks?.current || 0} days</div>
          <p className="text-blue-200 text-sm">Keep the flame burning</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Spiritual Score</h3>
          <div className="text-3xl font-bold text-blue-400">{user.spiritualScore || 0}/100</div>
          <p className="text-blue-200 text-sm">Your spiritual progress</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-4">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Active Goals</h3>
          <div className="text-3xl font-bold text-green-400">{spiritualGoals.length}</div>
          <p className="text-blue-200 text-sm">Spiritual objectives</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {['overview', 'practices', 'goals', 'devotionals'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-purple-400 text-black'
                : 'text-blue-200 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Today's Devotional */}
          <div className="bg-gradient-to-r from-purple-400/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <BookOpenCheck className="w-6 h-6 mr-2 text-purple-400" />
              {dailyDevotional.title}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-purple-400 font-semibold mb-2">{dailyDevotional.verse}</h4>
                <p className="text-blue-200 italic mb-4">&ldquo;{dailyDevotional.text}&rdquo;</p>
                <h5 className="text-white font-medium mb-2">Reflection Question:</h5>
                <p className="text-blue-200">{dailyDevotional.reflection}</p>
              </div>
                              <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/20 rounded-full mb-4">
                    <Heart className="h-10 w-10 text-purple-400" />
                  </div>
                  <button className="px-6 py-3 bg-purple-400 text-white font-semibold rounded-lg hover:bg-purple-300 transition-all">
                    Start Prayer Time
                  </button>
                </div>
            </div>
          </div>

          {/* Spiritual Practices Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Recommended Practices</h3>
              <div className="space-y-3">
                {spiritualPractices.slice(0, 3).map((practice, index) => {
                  const Icon = practice.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <Icon className="w-5 h-5 text-purple-400" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{practice.name}</h4>
                        <p className="text-blue-200 text-sm">{practice.description}</p>
                      </div>
                      <span className="text-purple-400 text-sm font-medium">{practice.frequency}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <Link
                  href="#practices"
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                >
                  View All Practices →
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Spiritual Goals</h3>
              <div className="space-y-3">
                {spiritualGoals.slice(0, 2).map((goal, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-white font-medium mb-2">{goal.title}</h4>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-200">Progress</span>
                        <span className="text-white">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-1000"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-blue-200 text-sm">{goal.target}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  href="#goals"
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                >
                  View All Goals →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'practices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Spiritual Practices</h3>
            <button className="inline-flex items-center px-4 py-2 bg-purple-400 text-white font-medium rounded-lg hover:bg-purple-300 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Practice
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spiritualPractices.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mb-3">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold text-lg">{practice.name}</h4>
                    <p className="text-blue-200 text-sm">{practice.description}</p>
                  </div>
                  
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm font-medium mb-4">
                      {practice.frequency}
                    </span>
                    <button className="w-full px-4 py-2 bg-purple-400 text-white font-medium rounded-lg hover:bg-purple-300 transition-all">
                      Start Practice
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Spiritual Goals</h3>
            <button className="inline-flex items-center px-4 py-2 bg-purple-400 text-white font-medium rounded-lg hover:bg-purple-300 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spiritualGoals.map((goal, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="text-white font-semibold text-lg mb-3">{goal.title}</h4>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-200">Progress</span>
                    <span className="text-white">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-1000"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-blue-200 text-sm mb-4">{goal.target}</p>
                
                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-purple-400 text-white font-medium rounded-lg hover:bg-purple-300 transition-all">
                    Update Progress
                  </button>
                  <button className="px-4 py-2 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-all">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'devotionals' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Daily Devotionals</h3>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-white mb-2">Start Your Day Right</h4>
              <p className="text-blue-200">Take time each morning to connect with God and set your spiritual intentions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="text-center">
                  <h5 className="text-white font-semibold mb-3">Morning Routine</h5>
                  <ul className="text-blue-200 text-sm space-y-2">
                    <li>• 5 minutes of prayer</li>
                    <li>• Read today&apos;s verse</li>
                    <li>• Set spiritual intention</li>
                    <li>• Express gratitude</li>
                  </ul>
                </div>
                
                <div className="text-center">
                <h5 className="text-white font-semibold mb-3">Evening Reflection</h5>
                <ul className="text-blue-200 text-sm space-y-2">
                  <li>• Review your day</li>
                  <li>• Thank God for blessings</li>
                  <li>• Ask for guidance</li>
                  <li>• Plan tomorrow</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-400 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-300 hover:to-blue-400 transition-all">
                Start Devotional Time
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-400/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
          <h3 className="text-2xl font-bold text-white mb-4">Deepen Your Faith</h3>
          <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
            Spiritual growth is a journey, not a destination. Every day is an opportunity to draw closer to God 
            and become more like Christ.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/daily"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-400 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-300 hover:to-blue-400 transition-all"
            >
              Daily Check-in
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
            >
              Join Community
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
            >
              Spiritual Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
