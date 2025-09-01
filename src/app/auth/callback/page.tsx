'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth-service';

// Wrapper component that uses useSearchParams
function AuthCallbackForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      setStatus('loading');
      setMessage('Processing authentication...');

      // Get the current session after OAuth redirect
      const { data: { session }, error } = await authService.supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
        return;
      }

      if (session?.user) {
        setStatus('success');
        setMessage('Authentication successful! Redirecting to dashboard...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setStatus('error');
        setMessage('No session found. Please try again.');
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Unexpected error in auth callback:', error);
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <div className="mx-auto w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            )}
            {status === 'success' && (
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Status Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'loading' && 'Processing...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Oops!'}
          </h2>
          
          <p className="text-gray-600 mb-6">{message}</p>

          {/* Progress Bar for Loading */}
          {status === 'loading' && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          )}

          {/* Action Buttons */}
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Animation */}
          {status === 'loading' && (
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>If you're not redirected automatically, please wait a moment.</p>
          <p className="mt-1">This page handles authentication from external providers.</p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication callback...</p>
        </div>
      </div>
    }>
      <AuthCallbackForm />
    </Suspense>
  );
}
