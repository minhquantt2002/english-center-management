import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';

export const useStaffScheduleApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/schedules');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSchedule = useCallback(async (scheduleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/staff/schedules', scheduleData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSchedule = useCallback(async (id, scheduleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/staff/schedules/${id}`, scheduleData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSchedule = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/staff/schedules/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClassroomSchedules = useCallback(async (classroomId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/staff/classrooms/${classroomId}/schedules`
      );
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
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getClassroomSchedules,
  };
};
