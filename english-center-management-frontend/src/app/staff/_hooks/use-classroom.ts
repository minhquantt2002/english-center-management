import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { ClassroomCreate } from '../../../types/classroom';

export const useStaffClassroomApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getClassrooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/classrooms');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClassroomById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/staff/classrooms/${id}`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createClassroom = useCallback(
    async (classroomData: ClassroomCreate) => {
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

  const updateClassroom = useCallback(async (id, classroomData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/staff/classrooms/${id}`, classroomData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignStudentToClassroom = useCallback(
    async (classroomId, studentId) => {
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
    async (classroomId, studentIds) => {
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

  const getClassroomStudents = useCallback(async (classroomId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/staff/classrooms/${classroomId}/students`
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
    getClassrooms,
    getClassroomById,
    createClassroom,
    updateClassroom,
    assignStudentToClassroom,
    assignMultipleStudentsToClassroom,
    getClassroomStudents,
  };
};
