import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { Teacher } from '../../../types';

// Type for creating a new teacher
export interface CreateTeacherData {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  hourlyRate?: number;
  bio?: string;
  languages?: string[];
  certifications?: string[];
}

// Type for updating a teacher
export interface UpdateTeacherData extends Partial<CreateTeacherData> {
  status?: 'active' | 'inactive' | 'suspended';
}

// Type for teacher schedule response
export interface TeacherSchedule {
  id: string;
  classId: string;
  className: string;
  level: string;
  room: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  day: string;
  date?: string;
  studentCount: number;
  maxStudents?: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  topic?: string;
  color?: string;
  bgColor?: string;
  notes?: string;
}

export const useTeacherApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTeacher = useCallback(async (teacherData: CreateTeacherData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/admin/teachers', teacherData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTeacher = useCallback(
    async (id: string, teacherData: UpdateTeacherData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/admin/teachers/${id}`, teacherData);
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

  const getTeachers = useCallback(async (): Promise<Teacher[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/teachers');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeacherById = useCallback(async (id: string): Promise<Teacher> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/admin/teachers/${id}`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeacherSchedule = useCallback(
    async (id: string): Promise<TeacherSchedule[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/admin/teachers/${id}/schedule`);
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
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeachers,
    getTeacherById,
    getTeacherSchedule,
  };
};
