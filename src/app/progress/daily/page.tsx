'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Heart, 
  Brain, 
  BookOpen, 
  Users, 
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  Save,
  Calendar,
  Smile,
  Zap
} from 'lucide-react';

interface DailyProgress {
  date: string;
  moodScore: number;
  energyLevel: number;
  spiritualTime: number;
  physicalActivity: number;
  mentalStimulation: number;
  relationalQuality: number;
  financialActions: number;
  notes: string;
}

export default function DailyProgressPage() {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<DailyProgress>({
    date: new Date().toISOString().split('T')[0],
    moodScore: 5,
    energyLevel: 5,
    spiritualTime: 0,
    physicalActivity: 0,
    mentalStimulation: 0,
    relationalQuality: 5,
    financialActions: 0,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user has already submitted today
    const today = new Date().toISOString().split('T')[0];
    const storedProgress = localStorage.getItem(`dailyProgress_${user.id}_${today}`);
    if (storedProgress) {
      setHasSubmittedToday(true);
      setProgress(JSON.parse(storedProgress));
    }
  }, [user, router]);

  if (!user) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Store in localStorage for now (in real app, send to API)
      localStorage.setItem(`dailyProgress_${user.id}_${progress.date}`, JSON.stringify(progress));
      
      // Show success message
      alert('Daily progress saved successfully!');
      setHasSubmittedToday(true);
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('There was an error saving your progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 8) return '😄';
    if (score >= 6) return '🙂';
    if (score >= 4) return '😐';
    if (score >= 2) return '😔';
    return '😢';
  };

  const getEnergyEmoji = (score: number) => {
    if (score >= 8) return '⚡';
    if (score >= 6) return '💪';
    if (score >= 4) return '🔄';
    if (score >= 2) return '😴';
    return '💤';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Daily Progress Tracker</h1>
              <p className="text-blue-200 text-sm">Track your daily activities and mood</p>
            </div>
            <div className="text-blue-200 text-sm flex items-center space-x-2">
              <Calendar size={16} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {hasSubmittedToday ? (
          /* Already Submitted Today */
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Already Tracked Today!</h2>
            <p className="text-blue-200 mb-6">
              You&apos;ve already logged your progress for today. Come back tomorrow to track your next day!
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Today&apos;s Summary</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-blue-200">Mood:</span>
                  <span className="text-white">{getMoodEmoji(progress.moodScore)} {progress.moodScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Energy:</span>
                  <span className="text-white">{getEnergyEmoji(progress.energyLevel)} {progress.energyLevel}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Spiritual Time:</span>
                  <span className="text-white">{progress.spiritualTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Physical Activity:</span>
                  <span className="text-white">{progress.physicalActivity} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Mental Stimulation:</span>
                  <span className="text-white">{progress.mentalStimulation} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Relational Quality:</span>
                  <span className="text-white">{progress.relationalQuality}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Financial Actions:</span>
                  <span className="text-white">{progress.financialActions}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Progress Form */
          <div className="space-y-8">
            {/* Date Selection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Date</span>
              </h2>
              <input
                type="date"
                value={progress.date}
                onChange={(e) => setProgress({ ...progress, date: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Mood & Energy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Smile className="h-5 w-5" />
                  <span>How are you feeling today?</span>
                </h2>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getMoodEmoji(progress.moodScore)}</div>
                  <div className="text-2xl font-bold text-white">{progress.moodScore}/10</div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={progress.moodScore}
                  onChange={(e) => setProgress({ ...progress, moodScore: parseInt(e.target.value) })}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-blue-200 text-sm mt-2">
                  <span>Terrible</span>
                  <span>Amazing</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Energy Level</span>
                </h2>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{getEnergyEmoji(progress.energyLevel)}</div>
                  <div className="text-2xl font-bold text-white">{progress.energyLevel}/10</div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={progress.energyLevel}
                  onChange={(e) => setProgress({ ...progress, energyLevel: parseInt(e.target.value) })}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-blue-200 text-sm mt-2">
                  <span>Exhausted</span>
                  <span>Energized</span>
                </div>
              </div>
            </div>

            {/* Life Dimensions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6">Life Dimensions Activity</h2>
              <div className="space-y-6">
                {/* Spiritual */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <BookOpen className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Spiritual Time</h3>
                      <p className="text-blue-200 text-sm">Prayer, meditation, reading</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={progress.spiritualTime}
                      onChange={(e) => setProgress({ ...progress, spiritualTime: parseInt(e.target.value) || 0 })}
                      className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:border-yellow-400"
                    />
                    <span className="text-blue-200">min</span>
                  </div>
                </div>

                {/* Physical */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Heart className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Physical Activity</h3>
                      <p className="text-blue-200 text-sm">Exercise, walking, sports</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={progress.physicalActivity}
                      onChange={(e) => setProgress({ ...progress, physicalActivity: parseInt(e.target.value) || 0 })}
                      className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:border-yellow-400"
                    />
                    <span className="text-blue-200">min</span>
                  </div>
                </div>

                {/* Mental */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Brain className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Mental Stimulation</h3>
                      <p className="text-blue-200 text-sm">Learning, reading, puzzles</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={progress.mentalStimulation}
                      onChange={(e) => setProgress({ ...progress, mentalStimulation: parseInt(e.target.value) || 0 })}
                      className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:border-yellow-400"
                    />
                    <span className="text-blue-200">min</span>
                  </div>
                </div>

                {/* Relational */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Users className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Relational Quality</h3>
                      <p className="text-blue-200 text-sm">Family, friends, community</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={progress.relationalQuality}
                      onChange={(e) => setProgress({ ...progress, relationalQuality: parseInt(e.target.value) || 5 })}
                      className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:border-yellow-400"
                    />
                    <span className="text-blue-200">/10</span>
                  </div>
                </div>

                {/* Financial */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <DollarSign className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Financial Actions</h3>
                      <p className="text-blue-200 text-sm">Budgeting, saving, planning</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={progress.financialActions}
                      onChange={(e) => setProgress({ ...progress, financialActions: parseInt(e.target.value) || 0 })}
                      className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:border-yellow-400"
                    />
                    <span className="text-blue-200">actions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Additional Notes</h2>
              <textarea
                value={progress.notes}
                onChange={(e) => setProgress({ ...progress, notes: e.target.value })}
                placeholder="How was your day? Any highlights or challenges? What are you grateful for?"
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-yellow-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl rounded-full hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-3"></div>
                    Saving Progress...
                  </>
                ) : (
                  <>
                    <Save className="h-6 w-6 mr-2" />
                    Save Daily Progress
                  </>
                )}
              </button>
              <p className="text-blue-200 text-sm mt-4">
                Track your progress daily to see patterns and improvements over time
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #fbbf24, #f97316);
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #fbbf24, #f97316);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
