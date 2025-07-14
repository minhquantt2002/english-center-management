import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { StaffStats, Room } from '../../../types/staff';

export const useStaffStatsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStaffStats = useCallback(async (): Promise<StaffStats> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/stats');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRooms = useCallback(async (): Promise<Room[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/rooms');
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
    getStaffStats,
    getRooms,
  };
};
