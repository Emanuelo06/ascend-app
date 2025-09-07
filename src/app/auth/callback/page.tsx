'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Wrapper component that uses useSearchParams
function OAuthCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getRedirectPath } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL params
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          setStatus('error');
          setMessage(`OAuth error: ${error}`);
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // For now, we'll simulate a successful OAuth flow
        // In production, this would exchange the code for tokens and create/authenticate the user
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        
        // Simulate the OAuth user creation
        const oauthUser = {
          id: `oauth-user-${Date.now()}`,
          email: `oauth-${Date.now()}@example.com`,
          full_name: 'OAuth User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subscription_tier: 'free' as const,
          onboarding_completed: false,
          streaks: {
            current: 0,
            longest: 0,
            lastActivity: null
          },
          goals: [],
          totalScore: 0,
          physicalScore: 0,
          mentalScore: 0,
          spiritualScore: 0,
          relationalScore: 0,
          financialScore: 0,
          dailyCheckins: [],
          progressHistory: []
        };

        // Store the OAuth user data
        localStorage.setItem('ascend_auth_token', `oauth-token-${Date.now()}`);
        localStorage.setItem('ascend_user_data', JSON.stringify(oauthUser));

        // Determine redirect path and redirect
        setTimeout(() => {
          const redirectPath = getRedirectPath(oauthUser);
          router.push(redirectPath);
        }, 1500);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, getRedirectPath]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center max-w-md w-full">
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="animate-spin text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Completing Sign In</h2>
            <p className="text-blue-200">Please wait while we complete your authentication...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to ASCEND!</h2>
            <p className="text-blue-200">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
            <p className="text-red-200">{message}</p>
            <p className="text-blue-200 text-sm mt-2">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center max-w-md w-full">
          <Loader2 size={48} className="animate-spin text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
          <p className="text-blue-200">Please wait...</p>
        </div>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}
