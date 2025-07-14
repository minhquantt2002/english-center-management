import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';

// Types for API requests and responses
export interface CreateClassroomData {
  class_name: string;
  course_id: string;
  teacher_id: string;
  start_date: string;
  end_date: string;
  duration?: number | null;
  max_students?: number | null;
  description?: string;
}

export interface UpdateClassroomData extends Partial<CreateClassroomData> {
  id: string;
}

export interface AssignStudentData {
  studentId: string;
}

// Teacher interface for classroom response (matches API structure)
export interface ClassroomTeacher {
  id: string;
  name: string;
  email: string;
  role_name: string;
  avatar?: string;
  specialization?: string;
}

// Course interface for classroom response (matches API structure)
export interface ClassroomCourse {
  id: string;
  course_name: string;
  level: string;
  description?: string;
}

// Classroom response interface (matches actual API response)
export interface ClassroomResponse {
  id: string;
  class_name: string;
  course_id: string;
  teacher_id: string;
  status: string;
  duration: number | null;
  start_date: string;
  end_date: string;
  description: string | null;
  max_students: number | null;
  current_students: number;
  created_at: string;
  course: ClassroomCourse;
  teacher: ClassroomTeacher;
}

export const useClassroomApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClassroom = useCallback(
    async (classroomData: CreateClassroomData) => {
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
    async (id: string, classroomData: Partial<CreateClassroomData>) => {
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
