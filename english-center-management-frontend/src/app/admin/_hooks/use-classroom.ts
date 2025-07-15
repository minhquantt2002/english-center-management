import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  ClassroomCreate,
  ClassroomResponse,
  ClassroomUpdate,
  GetClassroomsQuery,
  AssignStudentRequest,
  StudentResponse,
} from '../../../types/admin';

export const useClassroomApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClassroom = useCallback(
    async (classroomData: ClassroomCreate): Promise<ClassroomResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/admin/classrooms', classroomData);
        return response as ClassroomResponse;
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
    async (
      id: string,
      classroomData: ClassroomUpdate
    ): Promise<ClassroomResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(
          `/admin/classrooms/${id}`,
          classroomData
        );
        return response as ClassroomResponse;
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

  const getClassrooms = useCallback(
    async (query?: GetClassroomsQuery): Promise<ClassroomResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = query
          ? `?${new URLSearchParams(query as Record<string, string>)}`
          : '';
        const response = await api.get(`/admin/classrooms${queryParams}`);
        return response as ClassroomResponse[];
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

  const getClassroomById = useCallback(
    async (id: string): Promise<ClassroomResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/admin/classrooms/${id}`);
        return response as ClassroomResponse;
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
    async (classroomId: string, studentData: AssignStudentRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(
          `/admin/classrooms/${classroomId}/students`,
          studentData
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

  const getClassroomStudents = useCallback(
    async (classroomId: string): Promise<StudentResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/admin/classrooms/${classroomId}/students`
        );
        return response as StudentResponse[];
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
