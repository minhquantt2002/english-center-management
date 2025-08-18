import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  TeacherDashboard,
  TeacherClassroomResponse,
  GradeBook,
  ScoreData,
  StudentScore,
  GradesData,
  ScheduleData,
} from '../../../types/teacher';
import { ScheduleResponse } from '../../../types/student';

// Teacher API hooks
export const useTeacherApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get teacher dashboard data
  const getTeacherDashboard =
    useCallback(async (): Promise<TeacherDashboard> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/teacher/dashboard');
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

  // Get teacher's teaching schedule
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

  // Get class details
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

  // Create student score
  const createStudentScore = useCallback(
    async (classId: string, scoreData: ScoreData): Promise<StudentScore> => {
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
    async (
      classId: string,
      scoreId: string,
      scoreData: ScoreData
    ): Promise<StudentScore> => {
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
  const updateGrades = useCallback(
    async (classId: string, gradesData: GradesData): Promise<GradeBook> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(
          `/teacher/classes/${classId}/grades`,
          gradesData
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

  // Get class schedule
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

  return {
    loading,
    error,
    getTeacherDashboard,
    getTeachingSchedule,
    getClassrooms,
    createStudentScore,
    updateStudentScore,
    updateGrades,
    getClassSchedule,
    getClassroomDetail,
  };
};
