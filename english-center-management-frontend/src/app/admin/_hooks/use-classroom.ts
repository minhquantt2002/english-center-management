import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  ClassroomCreate,
  ClassroomResponse,
  ClassroomUpdate,
} from '../../../types/classroom';

export const useClassroomApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClassroom = useCallback(
    async (classroomData: ClassroomCreate) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/admin/classrooms', classroomData);
        return response;
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

  const updateClassroom = useCallback(
    async (id: string, classroomData: Partial<ClassroomUpdate>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(
          `/admin/classrooms/${id}`,
          classroomData
        );
        return response;
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

  const deleteClassroom = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/classrooms/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClassrooms = useCallback(async (): Promise<ClassroomResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/classrooms');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClassroomById = useCallback(
    async (id: string): Promise<ClassroomResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/admin/classrooms/${id}`);
        return response;
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

  const assignStudentToClassroom = useCallback(
    async (classroomId: string, studentId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(
          `/admin/classrooms/${classroomId}/students`,
          { studentId }
        );
        return response;
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

  const removeStudentFromClassroom = useCallback(
    async (classroomId: string, studentId: string) => {
      setLoading(true);
      setError(null);
      try {
        await api.delete(
          `/admin/classrooms/${classroomId}/students/${studentId}`
        );
        return true;
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

  const getClassroomStudents = useCallback(async (classroomId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/admin/classrooms/${classroomId}/students`
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
    createClassroom,
    updateClassroom,
    deleteClassroom,
    getClassrooms,
    getClassroomById,
    assignStudentToClassroom,
    removeStudentFromClassroom,
    getClassroomStudents,
  };
};
