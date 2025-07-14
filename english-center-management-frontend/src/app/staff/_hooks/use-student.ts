import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { Student, CourseLevel } from '../../../types';

// Types for student data
export interface CreateStudentData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  level: CourseLevel;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UpdateStudentData extends Partial<CreateStudentData> {
  id: string;
}

export interface StudentAchievement {
  id: string;
  studentId: string;
  title: string;
  description: string;
  type: 'academic' | 'participation' | 'improvement' | 'special';
  date: string;
  points?: number;
  certificate?: string;
}

export interface StudentInvoice {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'online';
  paidAt?: string;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  notes?: string;
  invoiceNumber: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface StudentsResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}

export interface StudentResponse {
  data: Student;
}

export interface AvailableStudentsResponse {
  data: Student[];
}

export interface StudentAchievementsResponse {
  data: StudentAchievement[];
}

export interface StudentInvoicesResponse {
  data: StudentInvoice[];
}

export const useStaffStudentApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStudents = useCallback(async (): Promise<StudentsResponse> => {
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

  const createStudent = useCallback(
    async (studentData: CreateStudentData): Promise<StudentResponse> => {
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
      studentData: Partial<CreateStudentData>
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

  const getAvailableStudents =
    useCallback(async (): Promise<AvailableStudentsResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/staff/students/available');
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra';
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
    getAvailableStudents,
    getStudentAchievements,
    getStudentInvoices,
  };
};
