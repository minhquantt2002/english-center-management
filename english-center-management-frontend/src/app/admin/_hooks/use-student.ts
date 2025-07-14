import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  Student,
  StudentProfile,
  CourseLevel,
  UserStatus,
} from '../../../types';

// Type definitions for API responses
export interface CreateStudentRequest
  extends Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'> {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  level: CourseLevel;
  enrollmentDate: string;
  enrollmentStatus: UserStatus;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UpdateStudentRequest extends Partial<StudentProfile> {
  id: string;
}

export interface StudentApiResponse {
  data: Student[];
  message?: string;
  success: boolean;
}

export const useStudentApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStudent = useCallback(
    async (studentData: CreateStudentRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/admin/students', studentData);
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
    async (id: string, studentData: UpdateStudentRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/admin/students/${id}`, studentData);
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

  const getStudents = useCallback(async (): Promise<Student[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/students');
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
    createStudent,
    updateStudent,
    deleteStudent,
    getStudents,
  };
};
