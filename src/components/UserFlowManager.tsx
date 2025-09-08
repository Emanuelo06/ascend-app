'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { userInitializationService } from '@/lib/user-initialization-service';
import { databaseService } from '@/lib/supabase';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface UserFlowManagerProps {
  children: React.ReactNode;
}

export default function UserFlowManager({ children }: UserFlowManagerProps) {
  const { user, supabaseUser, isLoading } = useSupabaseAuth();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState<string>('');

  useEffect(() => {
    console.log('🔄 UserFlowManager useEffect triggered:', {
      isLoading,
      hasSupabaseUser: !!supabaseUser,
      hasUser: !!user,
      userEmail: user?.email
    });
    
    if (!isLoading && supabaseUser && user) {
      handleUserFlow();
    }
  }, [isLoading, supabaseUser, user]);

  const handleUserFlow = async () => {
    if (!user || !supabaseUser) return;

    try {
      console.log('🔄 Managing user flow for:', user.email);
      console.log('📊 User completion status from auth context:', {
        onboarding_completed: user.onboarding_completed,
        assessment_completed: user.assessment_completed,
        totalScore: user.totalScore
      });
      
      console.log('🔍 Full user object:', user);

      // Use the data from the auth context (which is already loaded from database)
      // If user hasn't completed onboarding, redirect to onboarding
      if (!user.onboarding_completed) {
        console.log('➡️ User needs onboarding - redirecting to onboarding');
        router.push('/onboarding/goals');
        return;
      }

      // If user has completed onboarding but not assessment, redirect to assessment
      if (user.onboarding_completed && !user.assessment_completed) {
        console.log('➡️ User needs assessment - redirecting to assessment');
        router.push('/assessment');
        return;
      }

      // If user has completed both onboarding and assessment, they can access dashboard
      if (user.onboarding_completed && user.assessment_completed) {
        console.log('✅ User has completed onboarding and assessment - allowing dashboard access');
        // No redirect needed, just allow the dashboard to render
        return;
      }

      // Fallback: if somehow we get here, redirect to onboarding
      console.log('⚠️ Fallback: redirecting to onboarding');
      router.push('/onboarding/goals');

    } catch (error) {
      console.error('❌ Error managing user flow:', error);
      // On error, redirect to onboarding as a safe fallback
      router.push('/onboarding/goals');
    }
  };

  const initializeUserData = async () => {
    if (!user || !supabaseUser) return;

    try {
      setIsInitializing(true);
      setInitializationStatus('Initializing your personalized experience...');

      // Get assessment results
      const assessment = await databaseService.getLifeAuditAssessment(user.id);
      
      if (assessment) {
        setInitializationStatus('Creating goals and habits from your assessment...');
        
        // Initialize user with assessment data
        await userInitializationService.initializeNewUser({
          userId: user.id,
          email: user.email,
          fullName: user.full_name,
          assessmentResults: {
            totalScore: assessment.ascension_score,
            physicalScore: assessment.analysis?.physical || 0,
            mentalScore: assessment.analysis?.mental || 0,
            spiritualScore: assessment.analysis?.spiritual || 0,
            relationalScore: assessment.analysis?.relational || 0,
            financialScore: assessment.analysis?.financial || 0,
            strongestDimension: assessment.strongest_dimension,
            biggestOpportunity: assessment.biggest_opportunity
          }
        });
      } else {
        setInitializationStatus('Setting up your account...');
        
        // Initialize user with basic data
        await userInitializationService.initializeNewUser({
          userId: user.id,
          email: user.email,
          fullName: user.full_name
        });
      }

      setInitializationStatus('Setup complete! Redirecting to dashboard...');
      
      // Wait a moment then redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('❌ Error initializing user data:', error);
      setInitializationStatus('Setup failed. Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } finally {
      setIsInitializing(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-yellow-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading ASCEND</h2>
          <p className="text-blue-200">Preparing your transformation journey...</p>
        </div>
      </div>
    );
  }

  // Show initialization state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Setting Up Your Account</h2>
          <p className="text-blue-200 mb-6">{initializationStatus}</p>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show children if user is authenticated and flow is complete
  if (user && supabaseUser) {
    return <>{children}</>;
  }

  // Show login prompt if not authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
        <p className="text-blue-200 mb-6">Please sign in to access your ASCEND dashboard.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
