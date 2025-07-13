import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

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

export const useAdminApi = () => {
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
