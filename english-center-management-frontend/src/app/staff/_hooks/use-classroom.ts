import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  ClassroomResponse,
  ClassroomCreate,
  ClassroomUpdate,
  GetClassroomsQuery,
  AssignStudentResponse,
  AssignMultipleStudentsResponse,
  ClassroomStudentsResponse,
} from '../../../types/staff';

export const useStaffClassroomApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getClassrooms = useCallback(
    async (filters?: GetClassroomsQuery): Promise<ClassroomResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = '/staff/classrooms';
        if (filters) {
          const params = new URLSearchParams();
          if (filters.course_id) params.append('course_id', filters.course_id);
          if (filters.teacher_id)
            params.append('teacher_id', filters.teacher_id);
          if (filters.status) params.append('status', filters.status);
          if (params.toString()) {
            endpoint += `?${params.toString()}`;
          }
        }
        const response = await api.get(endpoint);
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

  const getClassroomById = useCallback(
    async (id: string): Promise<ClassroomResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/staff/classrooms/${id}`);
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

  const createClassroom = useCallback(
    async (classroomData: ClassroomCreate): Promise<ClassroomResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/staff/classrooms', classroomData);
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
    async (
      id: string,
      classroomData: ClassroomUpdate
    ): Promise<ClassroomResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(
          `/staff/classrooms/${id}`,
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

  const assignStudentToClassroom = useCallback(
    async (
      classroomId: string,
      studentId: string
    ): Promise<AssignStudentResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(
          `/staff/classrooms/${classroomId}/students`,
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

  const assignMultipleStudentsToClassroom = useCallback(
    async (
      classroomId: string,
      studentIds: string[]
    ): Promise<AssignMultipleStudentsResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(
          `/staff/classrooms/${classroomId}/students/bulk`,
          { studentIds }
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

  const getClassroomStudents = useCallback(
    async (classroomId: string): Promise<ClassroomStudentsResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/staff/classrooms/${classroomId}/students`
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

  const deleteStudent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/students/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStudentFromClassroom = useCallback(
    async (classroomId: string, studentId: string) => {
      setLoading(true);
      setError(null);
      try {
        await api.delete(
          `/admin/students/${studentId}/classrooms/${classroomId}`
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

  return {
    loading,
    error,
    getClassrooms,
    getClassroomById,
    createClassroom,
    updateClassroom,
    assignStudentToClassroom,
    assignMultipleStudentsToClassroom,
    getClassroomStudents,
    deleteClassroom,
    deleteStudent,
    deleteStudentFromClassroom,
  };
};
