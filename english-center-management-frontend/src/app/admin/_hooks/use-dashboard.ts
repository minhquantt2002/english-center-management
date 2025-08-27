import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';

export const useDashboardApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboard = useCallback(async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/dashboard');
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
    getDashboard,
  };
};
