import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { CourseResponse } from '../../../types/staff';

export const useStaffCourseApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCourses = useCallback(async (): Promise<CourseResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/courses');
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
    getCourses,
  };
};
