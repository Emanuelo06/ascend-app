'use client';

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { UsersIcon, ArrowLeftIcon, UserPlusIcon } from 'lucide-react';

export default function PartnerPage() {
  const { user } = useSupabaseAuth();
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Accountability Partner</h1>
            </div>
            <button onClick={() => router.push('/dashboard')} className="text-gray-600 hover:text-gray-800">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Accountability Partner</h2>
          <div className="text-center py-12">
            <UserPlusIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Partner matching coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
