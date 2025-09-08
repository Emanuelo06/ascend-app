'use client';

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEffect, useState } from 'react';

export default function DemoDebugger() {
  const { user, supabaseUser, isLoading } = useSupabaseAuth();
  const [localStorageData, setLocalStorageData] = useState<any>({});

  useEffect(() => {
    const getLocalStorageData = () => {
      return {
        'ascend-demo-mode': localStorage.getItem('ascend-demo-mode'),
        'ascend_auth_token': localStorage.getItem('ascend_auth_token'),
        'ascend_user_data': localStorage.getItem('ascend_user_data'),
        'ascend-habits': localStorage.getItem('ascend-habits'),
        'ascend-checkins': localStorage.getItem('ascend-checkins'),
      };
    };

    setLocalStorageData(getLocalStorageData());
  }, []);

  const isDemoUser = user?.isDemoUser || localStorage.getItem('ascend-demo-mode') === 'true' || user?.id === 'demo-user-123';

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">🔍 Demo Debug Info</h3>
      
      <div className="mb-2">
        <strong>Auth State:</strong>
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Has User: {user ? 'Yes' : 'No'}</div>
        <div>Has SupabaseUser: {supabaseUser ? 'Yes' : 'No'}</div>
        <div>Is Demo User: {isDemoUser ? 'Yes' : 'No'}</div>
      </div>

      <div className="mb-2">
        <strong>User Data:</strong>
        <div>ID: {user?.id || 'None'}</div>
        <div>Email: {user?.email || 'None'}</div>
        <div>IsDemoUser: {user?.isDemoUser ? 'Yes' : 'No'}</div>
        <div>Onboarding: {user?.onboarding_completed ? 'Yes' : 'No'}</div>
        <div>Assessment: {user?.assessment_completed ? 'Yes' : 'No'}</div>
      </div>

      <div className="mb-2">
        <strong>LocalStorage:</strong>
        {Object.entries(localStorageData).map(([key, value]) => (
          <div key={key}>
            {key}: {value ? 'Set' : 'Not Set'}
          </div>
        ))}
      </div>

      <div className="mb-2">
        <strong>Demo Mode Check:</strong>
        <div>Demo Mode Flag: {localStorage.getItem('ascend-demo-mode')}</div>
        <div>Demo Token: {localStorage.getItem('ascend_auth_token')}</div>
        <div>Has Demo Data: {localStorage.getItem('ascend_user_data') ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
}
