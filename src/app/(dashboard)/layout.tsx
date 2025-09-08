'use client';

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import UserFlowManager from '@/components/UserFlowManager';
import DemoDebugger from '@/components/DemoDebugger';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  User, 
  Target, 
  TrendingUp, 
  Heart, 
  Brain, 
  BookOpen,
  Users, 
  DollarSign, 
  Palette, 
  Calendar, 
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
  Trophy,
  Flame,
  BarChart3,
  MessageCircle,
  Zap
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut, isLoading } = useSupabaseAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState<any>(null);

  // Check for demo mode
  useEffect(() => {
    const checkDemoMode = () => {
      const demoMode = localStorage.getItem('ascend-demo-mode') === 'true';
      const demoToken = localStorage.getItem('ascend_auth_token') === 'demo-token-123';
      const demoUserData = localStorage.getItem('ascend_user_data');
      
      console.log('🔍 Layout demo check:', {
        demoMode,
        demoToken,
        hasDemoUserData: !!demoUserData
      });
      
      if ((demoMode || demoToken) && demoUserData) {
        console.log('🚀 Demo mode detected in layout');
        setIsDemoMode(true);
        setDemoUser(JSON.parse(demoUserData));
        return;
      }
    };
    
    checkDemoMode();
  }, []);

  useEffect(() => {
    if (!isLoading && !user && !isDemoMode) {
      router.push('/login');
    }
  }, [user, isLoading, router, isDemoMode]);

  if (isLoading && !isDemoMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Dashboard</h2>
          <p className="text-blue-200">Preparing your transformation journey...</p>
        </div>
      </div>
    );
  }

  if (!user && !isDemoMode) {
    return null;
  }

  // Use demo user if in demo mode, otherwise use regular user
  const currentUser = isDemoMode ? demoUser : user;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: pathname === '/dashboard' },
    { name: 'Habit Management', href: '/habits', icon: Target, current: pathname === '/habits' },
    { name: 'Daily Check-in', href: '/daily', icon: Calendar, current: pathname === '/daily' },
    { name: 'Analytics & Progress', href: '/analytics', icon: BarChart3, current: pathname === '/analytics' },
    { name: 'Goals & Challenges', href: '/challenges', icon: Target, current: pathname === '/challenges' },
    { name: 'Physical Health', href: '/workouts', icon: Heart, current: pathname === '/workouts' },
    { name: 'Mental Fitness', href: '/coaching', icon: Brain, current: pathname === '/coaching' },
    { name: 'Spiritual Growth', href: '/spiritual', icon: BookOpen, current: pathname === '/spiritual' },
    { name: 'Relationships', href: '/community', icon: Users, current: pathname === '/community' },
    { name: 'Financial Health', href: '/nutrition', icon: DollarSign, current: pathname === '/nutrition' },
    { name: 'Life Audit', href: '/audit', icon: BarChart3, current: pathname === '/audit' },
    { name: 'Accountability', href: '/partner', icon: MessageCircle, current: pathname === '/partner' },
    { name: 'Profile', href: '/profile', icon: User, current: pathname === '/profile' },
  ];

  const handleSignOut = async () => {
    if (isDemoMode) {
      // Clear demo data
      localStorage.removeItem('ascend-demo-mode');
      localStorage.removeItem('ascend_user_data');
      localStorage.removeItem('ascend-habits');
      localStorage.removeItem('ascend-checkins');
      localStorage.removeItem('ascend_auth_token');
      router.push('/');
    } else {
      await signOut();
      router.push('/');
    }
  };

  return (
    <UserFlowManager>
      <DemoDebugger />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-sm border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">ASCEND</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentUser?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{currentUser?.full_name || 'User'}</p>
                  <p className="text-blue-200 text-sm">{currentUser?.email || 'user@example.com'}</p>
                  {isDemoMode && (
                    <p className="text-yellow-400 text-xs">🚀 Demo Mode</p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      item.current
                        ? 'bg-yellow-400 text-black font-semibold'
                        : 'text-white hover:bg-white/10 hover:text-yellow-400'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/20">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 w-full px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg"
              >
                <Menu size={24} />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 text-blue-200">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">Current Streak: {currentUser?.streaks?.current || 0} days</span>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-blue-200">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm">Total Score: {currentUser?.totalScore || 0}</span>
                </div>
                {isDemoMode && (
                  <div className="hidden md:flex items-center space-x-2 text-yellow-400">
                    <span className="text-sm">🚀 Demo Account</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </UserFlowManager>
  );
}
