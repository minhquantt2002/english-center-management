import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  StatCard as CommonStatCard,
  SystemStatus,
} from '../../../types/common';

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
  recentEnrollments: Array<{
    id: string;
    name: string;
    course: string;
    time: string;
    avatar: string;
  }>;
}

export interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: string;
}

// UI Component Props Types
export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  iconBg: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
}

export interface EnrollmentProps {
  name: string;
  course: string;
  time: string;
  avatar: string;
}

export interface SystemStatusProps {
  service: string;
  status: string;
  statusColor: string;
}

// API Response Types
export interface DashboardApiResponse {
  stats: CommonStatCard[];
  dashboardStats: DashboardStats;
  systemStatus: SystemStatus[];
}

export const useDashboardApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboardStats = useCallback(async (): Promise<DashboardStats> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatCards = useCallback(async (): Promise<StatCard[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/dashboard/stat-cards');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getDashboardStats,
    getStatCards,
  };
};
