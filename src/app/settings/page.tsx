'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Palette,
  LogOut,
  Save,
  Edit3,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Crown,
  Star
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  subscriptionTier: 'free' | 'premium' | 'premium_plus';
  subscriptionExpiresAt?: string;
  notifications: {
    email: boolean;
    push: boolean;
    dailyReminders: boolean;
    weeklyReports: boolean;
    goalUpdates: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };
}

export default function SettingsPage() {
  const { user, signOut } = useSupabaseAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    email: '',
    fullName: '',
    subscriptionTier: 'free',
    notifications: {
      email: true,
      push: true,
      dailyReminders: true,
      weeklyReports: true,
      goalUpdates: true,
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      timezone: 'UTC',
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load user profile from localStorage or API
    const storedProfile = localStorage.getItem(`userProfile_${user.id}`);
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      // Set default profile
      setProfile({
        ...profile,
        id: user.id,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || '',
      });
    }
  }, [user, router]);

  if (!user) return null;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage for now (in real app, send to API)
      localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(profile));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('There was an error saving your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    try {
      // In real app, call API to change password
      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('There was an error changing your password. Please try again.');
    }
  };

  const getSubscriptionIcon = (tier: string) => {
    switch (tier) {
      case 'premium_plus': return <Crown className="h-5 w-5 text-yellow-400" />;
      case 'premium': return <Star className="h-5 w-5 text-blue-400" />;
      default: return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'premium_plus': return 'from-yellow-400 to-orange-500';
      case 'premium': return 'from-blue-400 to-purple-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const subscriptionFeatures = {
    free: ['Basic goal tracking', 'Daily progress logging', 'Assessment access', 'Basic insights'],
    premium: ['Advanced analytics', 'Unlimited goals', 'AI recommendations', 'Progress charts', 'Priority support'],
    premium_plus: ['Personal AI coaching', 'Advanced insights', 'Custom routines', 'Community access', '24/7 support']
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Settings</h1>
              <p className="text-blue-200 text-sm">Manage your account and preferences</p>
            </div>
            <div className="w-6"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Account */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-200 text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-200 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white opacity-50 cursor-not-allowed"
                    />
                    <p className="text-blue-200 text-xs mt-1">Email cannot be changed</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Full Name:</span>
                    <span className="text-white font-medium">{profile.fullName || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Email:</span>
                    <span className="text-white font-medium">{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Member Since:</span>
                    <span className="text-white font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Password Change */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Change Password</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400 pr-12"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </h2>
              <div className="space-y-4">
                {Object.entries(profile.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <p className="text-blue-200 text-sm">
                        {key === 'email' && 'Receive email notifications'}
                        {key === 'push' && 'Receive push notifications'}
                        {key === 'dailyReminders' && 'Daily progress reminders'}
                        {key === 'weeklyReports' && 'Weekly progress summaries'}
                        {key === 'goalUpdates' && 'Goal achievement updates'}
                      </p>
                    </div>
                    <button
                      onClick={() => setProfile({
                        ...profile,
                        notifications: {
                          ...profile.notifications,
                          [key]: !value
                        }
                      })}
                      className={`w-12 h-6 rounded-full transition-all ${
                        value ? 'bg-yellow-400' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-all transform ${
                        value ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Preferences</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Theme</label>
                  <select
                    value={profile.preferences.theme}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, theme: e.target.value as any }
                    })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Language</label>
                  <select
                    value={profile.preferences.language}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, language: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Timezone</label>
                  <select
                    value={profile.preferences.timezone}
                    onChange={(e) => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, timezone: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Subscription & Actions */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getSubscriptionColor(profile.subscriptionTier)} mb-4`}>
                  {getSubscriptionIcon(profile.subscriptionTier)}
                </div>
                <h3 className="text-xl font-bold text-white capitalize mb-2">
                  {profile.subscriptionTier.replace('_', ' ')} Plan
                </h3>
                {profile.subscriptionExpiresAt && (
                  <p className="text-blue-200 text-sm">
                    Expires: {new Date(profile.subscriptionExpiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {subscriptionFeatures[profile.subscriptionTier as keyof typeof subscriptionFeatures].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-blue-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {profile.subscriptionTier === 'free' && (
                <button className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all">
                  Upgrade to Premium
                </button>
              )}
            </div>

            {/* Account Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-left">
                  Export Data
                </button>
                <button className="w-full px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-left">
                  Delete Account
                </button>
                <button
                  onClick={signOut}
                  className="w-full px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-left flex items-center justify-between"
                >
                  <span>Sign Out</span>
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Support</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-left">
                  Help Center
                </button>
                <button className="w-full px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-left">
                  Contact Support
                </button>
                <button className="w-full px-4 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-left">
                  Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
