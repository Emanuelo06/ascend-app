'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { TrophyIcon, ArrowLeftIcon, TargetIcon } from 'lucide-react';

export default function ChallengesPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Challenges</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Challenges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <TargetIcon className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">7-Day Consistency</h3>
              </div>
              <p className="text-gray-600 mb-4">Complete your daily protocol for 7 consecutive days</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Join Challenge
              </button>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-xl hover:border-green-300 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <TrophyIcon className="w-8 h-8 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">30-Day Transformation</h3>
              </div>
              <p className="text-gray-600 mb-4">Focus on your top 3 priority dimensions for 30 days</p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Join Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
