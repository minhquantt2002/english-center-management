import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  CourseCreate,
  CourseUpdate,
  CourseResponse,
} from '../../../types/admin';

export const useCourseApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourse = useCallback(
    async (courseData: CourseCreate): Promise<CourseResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/admin/courses', courseData);
        return response as CourseResponse;
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

  const updateCourse = useCallback(
    async (id: string, courseData: CourseUpdate): Promise<CourseResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/admin/courses/${id}`, courseData);
        return response as CourseResponse;
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

  const deleteCourse = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/courses/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCourses = useCallback(async (): Promise<CourseResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/courses');
      return response as CourseResponse[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCourseById = useCallback(
    async (id: string): Promise<CourseResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/admin/courses/${id}`);
        return response as CourseResponse;
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
    createCourse,
    updateCourse,
    deleteCourse,
    getCourses,
    getCourseById,
  };
};
