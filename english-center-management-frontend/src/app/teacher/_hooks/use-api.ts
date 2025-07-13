import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

// Teacher API hooks
export const useTeacherApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get teacher dashboard data
  const getTeacherDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/teacher/dashboard');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get teacher's classes
  const getTeacherClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/teacher/classes');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get teacher's teaching schedule
  const getTeachingSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/teacher/schedule');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get class details
  const getClassDetails = useCallback(async (classId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/teacher/classes/${classId}`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get class students
  const getClassStudents = useCallback(async (classId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/teacher/classes/${classId}/students`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update attendance
  const updateAttendance = useCallback(
    async (classId: string, attendanceData: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(
          `/teacher/classes/${classId}/attendance`,
          attendanceData
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

  // Get class grades
  const getClassGrades = useCallback(async (classId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/teacher/classes/${classId}/grades`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create student score
  const createStudentScore = useCallback(
    async (classId: string, scoreData: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(
          `/teacher/classes/${classId}/scores`,
          scoreData
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

  // Update student score
  const updateStudentScore = useCallback(
    async (classId: string, scoreId: string, scoreData: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(
          `/teacher/classes/${classId}/scores/${scoreId}`,
          scoreData
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

  // Update grades
  const updateGrades = useCallback(async (classId: string, gradesData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(
        `/teacher/classes/${classId}/grades`,
        gradesData
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

  // Get class materials
  const getClassMaterials = useCallback(async (classId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/teacher/classes/${classId}/materials`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload material
  const uploadMaterial = useCallback(
    async (classId: string, materialData: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(
          `/teacher/classes/${classId}/materials`,
          materialData
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

  // Get teaching schedule details
  const getTeachingScheduleDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/teacher/schedule/details');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get class schedule
  const getClassSchedule = useCallback(async (classId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/teacher/classes/${classId}/schedule`);
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
    getTeacherDashboard,
    getTeacherClasses,
    getTeachingSchedule,
    getClassDetails,
    getClassStudents,
    updateAttendance,
    getClassGrades,
    createStudentScore,
    updateStudentScore,
    updateGrades,
    getClassMaterials,
    uploadMaterial,
    getTeachingScheduleDetails,
    getClassSchedule,
  };
};
