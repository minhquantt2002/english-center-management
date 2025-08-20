import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  TeacherResponse,
  TeacherCreate,
  TeacherUpdate,
  TeacherScheduleResponse,
} from '../../../types/admin';

export const useTeacherApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTeacher = useCallback(
    async (teacherData: TeacherCreate): Promise<TeacherResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/admin/teachers', teacherData);
        return response as TeacherResponse;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra';
          console.log('err:', err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateTeacher = useCallback(
    async (
      id: string,
      teacherData: TeacherUpdate
    ): Promise<TeacherResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/admin/teachers/${id}`, teacherData);
        return response as TeacherResponse;
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

  const deleteTeacher = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/teachers/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeachers = useCallback(async (): Promise<TeacherResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/teachers');
      return response as TeacherResponse[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeacherById = useCallback(
    async (id: string): Promise<TeacherResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/admin/teachers/${id}`);
        return response as TeacherResponse;
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

  const getTeacherSchedule = useCallback(
    async (id: string): Promise<TeacherScheduleResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/admin/teachers/${id}/schedule`);
        return response as TeacherScheduleResponse;
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
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeachers,
    getTeacherById,
    getTeacherSchedule,
  };
};
