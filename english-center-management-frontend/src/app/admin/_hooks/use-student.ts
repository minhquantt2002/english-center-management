import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  StudentResponse,
  StudentCreate,
  StudentUpdate,
} from '../../../types/admin';

export const useStudentApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStudent = useCallback(
    async (studentData: StudentCreate): Promise<StudentResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/admin/students', studentData);
        return response as StudentResponse;
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

  const updateStudent = useCallback(
    async (
      id: string,
      studentData: StudentUpdate
    ): Promise<StudentResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/admin/students/${id}`, studentData);
        return response as StudentResponse;
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

  const getStudents = useCallback(async (): Promise<StudentResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/students');
      return response as StudentResponse[];
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
    createStudent,
    updateStudent,
    deleteStudent,
    getStudents,
  };
};
