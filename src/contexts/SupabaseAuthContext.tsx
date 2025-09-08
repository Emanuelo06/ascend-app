'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { getSupabaseClient, databaseService } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  subscription_tier: 'free' | 'premium' | 'premium_plus';
  onboarding_completed: boolean;
  assessment_completed: boolean;
  // User progress data - all starting at 0
  xp: number;
  level: number;
  streaks: {
    current: number;
    longest: number;
    lastActivity: string | null;
  };
  goals: string[];
  totalScore: number;
  physicalScore: number;
  mentalScore: number;
  spiritualScore: number;
  relationalScore: number;
  financialScore: number;
  dailyCheckins: any[];
  progressHistory: any[];
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserData: (data: Partial<User>) => Promise<void>;
  getRedirectPath: (user: User) => string;
  createUserProfile: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = getSupabaseClient();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await handleSignIn(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSupabaseUser(null);
          setSession(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return;
      }

      if (session?.user) {
        console.log('👤 User found in session:', session.user.email);
        await handleSignIn(session.user);
      } else {
        console.log('❌ No user in session');
        setUser(null);
        setSupabaseUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('🔄 Handling sign in for user:', supabaseUser.email);
      
      // Get or create user profile
      let userProfile = await databaseService.getUserProfile(supabaseUser.id);
      
      if (!userProfile) {
        console.log('🆕 Creating new user profile for:', supabaseUser.email);
        userProfile = await databaseService.createUserProfile(
          supabaseUser.id,
          supabaseUser.email || '',
          supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name
        );
      }

      // If we still don't have a profile, create a temporary one for the session
      if (!userProfile) {
        console.log('⚠️ Could not create user profile, using temporary profile');
        userProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
          subscription_tier: 'free',
          onboarding_completed: false,
          assessment_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      // Get user's assessment data to check completion status
      const assessment = await databaseService.getLifeAuditAssessment(supabaseUser.id);
      
      // Get user's XP data
      const userXP = await databaseService.getUserXP(supabaseUser.id);

      // Create user object with real data from database
      const userData: User = {
        id: userProfile.id,
        email: userProfile.email,
        full_name: userProfile.full_name || '',
        avatar_url: supabaseUser.user_metadata?.avatar_url,
        created_at: userProfile.created_at,
        updated_at: userProfile.updated_at,
        subscription_tier: userProfile.subscription_tier || 'free',
        onboarding_completed: userProfile.onboarding_completed || false,
        assessment_completed: userProfile.assessment_completed || false,
        // Use real XP data or defaults
        xp: userXP?.total_xp || 0,
        level: userXP?.level || 1,
        streaks: {
          current: 0, // TODO: Calculate from habit check-ins
          longest: 0, // TODO: Calculate from habit check-ins
          lastActivity: null
        },
        goals: [], // Will be loaded separately
        totalScore: assessment?.ascension_score || 0,
        physicalScore: assessment?.analysis?.physical || 0,
        mentalScore: assessment?.analysis?.mental || 0,
        spiritualScore: assessment?.analysis?.spiritual || 0,
        relationalScore: assessment?.analysis?.relational || 0,
        financialScore: assessment?.analysis?.financial || 0,
        dailyCheckins: [],
        progressHistory: []
      };

      console.log('✅ User profile loaded with real data:', {
        id: userData.id,
        email: userData.email,
        onboarding_completed: userData.onboarding_completed,
        assessment_completed: userData.assessment_completed,
        totalScore: userData.totalScore,
        xp: userData.xp,
        level: userData.level
      });
      
      console.log('🔍 User profile details:', userProfile);
      console.log('🔍 Assessment data:', assessment);
      console.log('🔍 XP data:', userXP);
      
      setUser(userData);
      setSupabaseUser(supabaseUser);
      setSession(await supabase.auth.getSession().then(r => r.data.session));
      
    } catch (error) {
      console.error('Error handling sign in:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error.message };
      }

      if (data.user) {
        console.log('✅ Sign in successful:', data.user.email);
        await handleSignIn(data.user);
      }

      return {};
    } catch (error) {
      console.error('Sign in failed:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error: error.message };
      }

      if (data.user) {
        console.log('✅ Sign up successful:', data.user.email);
        // User profile will be created when they confirm their email
        // For now, we'll create it immediately
        await handleSignIn(data.user);
      }

      return {};
    } catch (error) {
      console.error('Sign up failed:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        return { error: error.message };
      }

      // The OAuth flow will redirect, so we don't need to do anything else here
      return {};
    } catch (error) {
      console.error('Google sign in failed:', error);
      return { error: 'Google sign-in failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const updateUserData = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      console.log('🔄 Updating user data:', data);
      
      // Update local state immediately
      const updatedUser = { ...user, ...data, updated_at: new Date().toISOString() };
      setUser(updatedUser);
      console.log('✅ User data updated in local state');
      
      // Try to update in Supabase (but don't block on it)
      try {
        const updatedProfile = await databaseService.updateUserProfile(user.id, {
          full_name: data.full_name,
          assessment_completed: data.assessment_completed,
          updated_at: new Date().toISOString()
        });
        console.log('✅ User data updated in database:', updatedProfile);
      } catch (dbError) {
        console.error('❌ Database update failed, but local state updated:', dbError);
      }
      
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const createUserProfile = async (userData: any) => {
    if (!supabaseUser) return;
    
    try {
      console.log('🆕 Creating user profile with data:', userData);
      
      const profile = await databaseService.createUserProfile(
        supabaseUser.id,
        supabaseUser.email || '',
        userData.full_name
      );

      if (profile) {
        console.log('✅ User profile created:', profile);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const getRedirectPath = (user: User): string => {
    console.log('🧭 Determining redirect path for user:', {
      onboarding_completed: user.onboarding_completed,
      assessment_completed: user.assessment_completed,
      totalScore: user.totalScore
    });

    // If user hasn't completed onboarding, send them to onboarding
    if (!user.onboarding_completed) {
      console.log('➡️ Redirecting to onboarding');
      return '/onboarding/goals';
    }
    
    // If user has completed onboarding but no assessment, send them to assessment
    if (!user.assessment_completed || user.totalScore === 0) {
      console.log('➡️ Redirecting to assessment');
      return '/assessment';
    }
    
    // User has completed both onboarding and assessment, send to dashboard
    console.log('➡️ Redirecting to dashboard');
    return '/dashboard';
  };

  const value = {
    user,
    supabaseUser,
    session,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    checkAuth,
    updateUserData,
    getRedirectPath,
    createUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
