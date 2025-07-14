'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import { api } from '../lib/api';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role_name: string;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  input_level?: string;
  specialization?: string;
  address?: string;
  education?: string;
  experience_years?: number;
  level?: string;
  parent_name?: string;
  parent_phone?: string;
  student_id?: string;
  created_at: string;
}

interface UserInfoContextType {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  fetchUserInfo: () => Promise<void>;
  updateUserInfo: (data: Partial<UserInfo>) => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(
  undefined
);

export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error('useUserInfo must be used within a UserInfoProvider');
  }
  return context;
};

interface UserInfoProviderProps {
  children: ReactNode;
}

export const UserInfoProvider: React.FC<UserInfoProviderProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    if (!session?.accessToken) {
      setUserInfo(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.get('/auth/me');
      setUserInfo(data);
    } catch (err) {
      console.error('Error fetching user info:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch user info'
      );
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (data: Partial<UserInfo>) => {
    if (!session?.accessToken) {
      throw new Error('No authentication token');
    }

    setLoading(true);
    setError(null);

    try {
      const updatedData = await api.put('/auth/me', data);
      setUserInfo(updatedData);
    } catch (err) {
      console.error('Error updating user info:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to update user info'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserInfo = async () => {
    await fetchUserInfo();
  };

  // Fetch user info when session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchUserInfo();
    } else if (status === 'unauthenticated') {
      setUserInfo(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  const value = {
    userInfo,
    loading,
    error,
    fetchUserInfo,
    updateUserInfo,
    refreshUserInfo,
  };

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
};
