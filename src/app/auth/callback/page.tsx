'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

// Wrapper component that uses useSearchParams
function OAuthCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getRedirectPath } = useSupabaseAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Handling OAuth callback');
        
        // Supabase will automatically handle the OAuth callback
        // We just need to wait for the auth state to update
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        
        // Wait a moment for Supabase to process the callback and UserFlowManager to handle routing
        setTimeout(() => {
          // The UserFlowManager will automatically redirect based on completion status
          // No need to manually redirect here
          console.log('✅ OAuth callback complete - UserFlowManager will handle routing');
        }, 1500);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [router]);

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
