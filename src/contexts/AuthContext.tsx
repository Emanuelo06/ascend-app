'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  subscription_tier: 'free' | 'premium' | 'premium_plus';
  onboarding_completed: boolean;
  // User progress data - all starting at 0
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
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserData: (data: Partial<User>) => void;
  getRedirectPath: (user: User) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if user is logged in (check localStorage)
      const token = localStorage.getItem('ascend_auth_token');
      const userData = localStorage.getItem('ascend_user_data');
      
      if (token && userData) {
        // In a real app, you'd verify the token with your backend
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      
      // Get stored users
      const storedUsers = localStorage.getItem('ascend_users');
      if (!storedUsers) {
        return { error: 'No users found. Please register first.' };
      }

      const users = JSON.parse(storedUsers);
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        return { error: 'User not found. Please register first.' };
      }

      // In a real app, you'd verify the password hash
      // For now, we'll use a simple check
      if (user.password !== password) {
        return { error: 'Invalid password.' };
      }

      // Create auth token and store user data
      const token = `token-${Date.now()}`;
      localStorage.setItem('ascend_auth_token', token);
      localStorage.setItem('ascend_user_data', JSON.stringify(user));
      
      setUser(user);
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const storedUsers = localStorage.getItem('ascend_users') || '[]';
      const users = JSON.parse(storedUsers);
      
      if (users.find((u: any) => u.email === email)) {
        return { error: 'User with this email already exists.' };
      }
      
      // Create new user with 0 data
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subscription_tier: 'free',
        onboarding_completed: false,
        // Initialize all progress data to 0
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
      
      // Store user in users list
      users.push({ ...newUser, password }); // Store password for demo purposes
      localStorage.setItem('ascend_users', JSON.stringify(users));
      
      // Store auth data
      const token = `token-${Date.now()}`;
      localStorage.setItem('ascend_auth_token', token);
      localStorage.setItem('ascend_user_data', JSON.stringify(newUser));
      
      setUser(newUser);
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      setIsLoading(true);
      
      // Import and use the real Google OAuth function
      const { signInWithGoogle: realGoogleSignIn } = await import('@/lib/auth');
      const result = await realGoogleSignIn();
      
      if (result.error) {
        return { error: result.error.message };
      }
      
      // The real function will redirect to Google OAuth
      // We don't need to do anything else here
      return {};
    } catch (error) {
      return { error: 'Google sign-in failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear auth data
      localStorage.removeItem('ascend_auth_token');
      localStorage.removeItem('ascend_user_data');
      
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const updateUserData = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data, updated_at: new Date().toISOString() };
      setUser(updatedUser);
      
      // Update stored user data
      localStorage.setItem('ascend_user_data', JSON.stringify(updatedUser));
      
      // Update user in users list
      const storedUsers = localStorage.getItem('ascend_users') || '[]';
      const users = JSON.parse(storedUsers);
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data, updated_at: new Date().toISOString() };
        localStorage.setItem('ascend_users', JSON.stringify(users));
      }
    }
  };

  const getRedirectPath = (user: User): string => {
    // If user hasn't completed onboarding, send them to onboarding
    if (!user.onboarding_completed) {
      return '/onboarding/goals';
    }
    
    // If user has completed onboarding but no assessment score, send them to assessment
    if (user.totalScore === 0) {
      return '/assessment';
    }
    
    // User has completed both onboarding and assessment, send to dashboard
    return '/dashboard';
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    checkAuth,
    updateUserData,
    getRedirectPath
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
