import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { Teacher } from '../../../types';
import { TeachingSchedule } from '../../../types/teacher';

// API Response types
export interface TeachersResponse {
  data: Teacher[];
  message?: string;
  total?: number;
}

export interface TeacherScheduleResponse {
  data: TeachingSchedule[];
  message?: string;
  teacherId: string;
}

export const useStaffTeacherApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTeachers = useCallback(async (): Promise<Teacher[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/teachers');
      return response.data || response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeacherSchedule = useCallback(
    async (teacherId: string): Promise<TeachingSchedule[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/staff/teachers/${teacherId}/schedule`);
        return response.data || response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getTeachers,
    getTeacherSchedule,
  };
};
