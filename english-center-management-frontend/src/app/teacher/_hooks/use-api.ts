import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  TeacherClassroomResponse,
  ScheduleData,
  ScoreUpdate,
} from '../../../types/teacher';
import { ScheduleResponse } from '../../../types/student';

export const useTeacherApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTeacherDashboard = useCallback(async (): Promise<any> => {
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

  const getTeachingSchedule = useCallback(async (): Promise<
    ScheduleResponse[]
  > => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/teacher/schedule`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClassrooms = useCallback(async (): Promise<
    TeacherClassroomResponse[]
  > => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/teacher/classes`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClassroomDetail = useCallback(
    async (classroomId: string): Promise<TeacherClassroomResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/teacher/classes/${classroomId}`);
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

  const getClassSchedule = useCallback(
    async (classId: string): Promise<ScheduleData[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/teacher/classes/${classId}/schedule`);
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

  const updateScore = useCallback(
    async (scoreId: string, scoreData: ScoreUpdate): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/teacher/score/${scoreId}/`, scoreData);
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
    getTeacherDashboard,
    getTeachingSchedule,
    getClassrooms,
    getClassSchedule,
    getClassroomDetail,
    updateScore,
  };
};
