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
        return response.data;
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
  const getStudentClasses = useCallback(
    async (params?: GetStudentClassesParams): Promise<ClassroomResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : '';
        const response = await api.get(`/student/classes${queryString}`);
        return response.data;
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

  // Get student's schedule
  const getStudentSchedule = useCallback(
    async (params?: GetStudentScheduleParams): Promise<ScheduleResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : '';
        const response = await api.get(`/student/schedule${queryString}`);
        return response.data;
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

  // Get student's scores
  const getStudentScores = useCallback(
    async (params?: GetStudentScoresParams): Promise<ScoreResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : '';
        const response = await api.get(`/student/scores${queryString}`);
        return response.data;
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

  // Get class details
  const getClassDetails = useCallback(
    async (classId: string): Promise<ClassroomResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/student/classes/${classId}`);
        return response.data;
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

  // Get student profile
  const getStudentProfile = useCallback(async (): Promise<StudentResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/student/profile');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update student profile
  const updateStudentProfile = useCallback(
    async (profileData: StudentUpdate): Promise<StudentResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put('/student/profile', profileData);
        return response.data;
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

  // Get class schedules
  const getClassSchedules = useCallback(
    async (classId: string): Promise<ScheduleResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/student/classes/${classId}/schedules`);
        return response.data;
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

  // Get class scores
  const getClassScores = useCallback(
    async (classId: string): Promise<ScoreResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/student/classes/${classId}/scores`);
        return response.data;
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
