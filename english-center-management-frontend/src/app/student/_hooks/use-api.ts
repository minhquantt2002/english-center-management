import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  StudentDashboard,
  GetStudentClassesParams,
  ClassroomResponse,
  GetStudentScheduleParams,
  ScheduleResponse,
  GetStudentScoresParams,
  ScoreResponse,
  StudentResponse,
  StudentUpdate,
} from '../../../types/student';

// Student API hooks
export const useStudentApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get student dashboard data
  const getStudentDashboard =
    useCallback(async (): Promise<StudentDashboard> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/student/dashboard');
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

  // Get student's classes
  const getStudentClasses = useCallback(async (): Promise<
    ClassroomResponse[]
  > => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/student/classes`);
      return response || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      console.error('Error fetching student classes:', err);
      return []; // Trả về array rỗng thay vì throw error
    } finally {
      setLoading(false);
    }
  }, []);

  // Get student's schedule
  const getStudentSchedule = useCallback(async (): Promise<
    ScheduleResponse[]
  > => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/student/schedule`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      console.error('Error fetching student schedule:', err);
      return []; // Trả về array rỗng thay vì throw error
    } finally {
      setLoading(false);
    }
  }, []);

  // Get student's scores
  const getStudentScores = useCallback(async (): Promise<ScoreResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/student/scores`);
      return response || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      console.error('Error fetching student scores:', err);
      return []; // Trả về array rỗng thay vì throw error
    } finally {
      setLoading(false);
    }
  }, []);

  // Get class details
  const getClassDetails = useCallback(
    async (classId: string): Promise<ClassroomResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/student/classes/${classId}`);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        console.error('Error fetching class details:', err);
        return null; // Trả về null thay vì throw error
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get student profile
  const getStudentProfile =
    useCallback(async (): Promise<StudentResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/student/profile');
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        console.error('Error fetching student profile:', err);
        return null; // Trả về null thay vì throw error
      } finally {
        setLoading(false);
      }
    }, []);

  // Update student profile
  const updateStudentProfile = useCallback(
    async (profileData: StudentUpdate): Promise<StudentResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put('/student/profile', profileData);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        console.error('Error updating student profile:', err);
        return null; // Trả về null thay vì throw error
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get class schedules
  const getClassSchedules = useCallback(
    async (classId: string): Promise<ScheduleResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/student/classes/${classId}/schedules`);
        return response || [];
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        console.error('Error fetching class schedules:', err);
        return []; // Trả về array rỗng thay vì throw error
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get class scores
  const getClassScores = useCallback(
    async (classId: string): Promise<ScoreResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/student/classes/${classId}/scores`);
        return response || [];
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        console.error('Error fetching class scores:', err);
        return []; // Trả về array rỗng thay vì throw error
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getStudentDashboard,
    getStudentClasses,
    getStudentSchedule,
    getStudentScores,
    getClassDetails,
    getStudentProfile,
    updateStudentProfile,
    getClassSchedules,
    getClassScores,
  };
};
