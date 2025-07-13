import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

// Staff API hooks
export const useStaffApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Student management
  const getStudents = useCallback(async () => {
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

  const createStudent = useCallback(async (studentData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/staff/students', studentData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudent = useCallback(async (id: string, studentData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/staff/students/${id}`, studentData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Teacher management
  const getTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/teachers');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeacherSchedule = useCallback(async (teacherId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/staff/teachers/${teacherId}/schedule`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Course management
  const getCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/courses');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Classroom management
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

  const getClassroomById = useCallback(async (id: string) => {
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

  const createClassroom = useCallback(async (classroomData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/staff/classrooms', classroomData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClassroom = useCallback(
    async (id: string, classroomData: any) => {
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
    async (classroomId: string, studentId: string) => {
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
    async (classroomId: string, studentIds: string[]) => {
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

  // Invoice management
  const createInvoice = useCallback(async (invoiceData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/staff/invoices', invoiceData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/invoices');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Stats
  const getStaffStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/stats');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Room management
  const getRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/rooms');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Schedule management
  const getSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/schedules');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSchedule = useCallback(async (scheduleData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/staff/schedules', scheduleData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSchedule = useCallback(async (id: string, scheduleData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/staff/schedules/${id}`, scheduleData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSchedule = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/staff/schedules/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClassroomSchedules = useCallback(async (classroomId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/staff/classrooms/${classroomId}/schedules`
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

  const getClassroomStudents = useCallback(async (classroomId: string) => {
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

  const getAvailableStudents = useCallback(async () => {
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

  const getStudentAchievements = useCallback(async (studentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/staff/students/${studentId}/achievements`
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

  const getStudentInvoices = useCallback(async (studentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/staff/students/${studentId}/invoices`);
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
    // Student management
    getStudents,
    createStudent,
    updateStudent,
    // Teacher management
    getTeachers,
    getTeacherSchedule,
    // Course management
    getCourses,
    // Classroom management
    getClassrooms,
    getClassroomById,
    createClassroom,
    updateClassroom,
    assignStudentToClassroom,
    assignMultipleStudentsToClassroom,
    // Invoice management
    createInvoice,
    getInvoices,
    // Stats
    getStaffStats,
    // Room management
    getRooms,
    // Schedule management
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getClassroomSchedules,
    getClassroomStudents,
    getAvailableStudents,
    getStudentAchievements,
    getStudentInvoices,
  };
};
