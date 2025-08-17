import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  StudentResponse,
  StudentCreate,
  StudentUpdate,
  StudentAchievementsResponse,
  StudentInvoicesResponse,
} from '../../../types/staff';

export const useStaffStudentApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStudents = useCallback(async (): Promise<StudentResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/students');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudentById = useCallback(
    async (id: string): Promise<StudentResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/staff/students/${id}/`);
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

  const createStudent = useCallback(
    async (studentData: StudentCreate): Promise<StudentResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/staff/students', studentData);
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

  const updateStudent = useCallback(
    async (
      id: string,
      studentData: StudentUpdate
    ): Promise<StudentResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/staff/students/${id}`, studentData);
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
  const deleteStudent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/staff/students/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableStudents = useCallback(async (): Promise<
    StudentResponse[]
  > => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/students/available');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudentAchievements = useCallback(
    async (studentId: string): Promise<StudentAchievementsResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/staff/students/${studentId}/achievements`
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

  const getStudentInvoices = useCallback(
    async (studentId: string): Promise<StudentInvoicesResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/staff/students/${studentId}/invoices`);
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

  return {
    loading,
    error,
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getAvailableStudents,
    getStudentAchievements,
    getStudentInvoices,
    getStudentById,
  };
};
