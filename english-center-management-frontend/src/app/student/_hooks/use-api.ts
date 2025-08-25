import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  ClassroomResponse,
  ScheduleResponse,
  StudentResponse,
  StudentUpdate,
  HomeworkStudentResponse,
  EnrollmentScoreResponse,
  AttendanceStudentResponse,
} from '../../../types/student';
import { ExamResponse } from '../../teacher/_hooks/use-exam';

export const useStudentApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStudentDashboard = useCallback(async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/student/dashboard');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudentScheduleById = useCallback(
    async (id: string): Promise<ScheduleResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/student/schedule/${id}`);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        console.error('Error fetching student schedule:', err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

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
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getHomeworksByStudentId = useCallback(async (): Promise<
    HomeworkStudentResponse[]
  > => {
    try {
      const response = await api.get(`/homework/student/`);
      return response;
    } catch (err) {
      throw err instanceof Error ? err.message : 'Có lỗi xảy ra';
    }
  }, []);

  const getAttendancesByStudentId = useCallback(async (): Promise<
    AttendanceStudentResponse[]
  > => {
    try {
      const response = await api.get(`/attendance/student/`);
      return response;
    } catch (err) {
      throw err instanceof Error ? err.message : 'Có lỗi xảy ra';
    }
  }, []);

  const getScoresByStudentId = useCallback(
    async (classId: string): Promise<EnrollmentScoreResponse> => {
      try {
        const response = await api.get(`/student/score/student/${classId}/`);
        return response || [];
      } catch (err) {
        throw err instanceof Error ? err.message : 'Có lỗi xảy ra';
      }
    },
    []
  );

  const getExamsByStudentId = useCallback(
    async (
      classId: string
    ): Promise<{ student_id: string; exams: ExamResponse[] }> => {
      try {
        const response = await api.get(`/student/exam/${classId}/`);
        return response || { student_id: '', exams: [] };
      } catch (err) {
        throw err instanceof Error ? err.message : 'Có lỗi xảy ra';
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
    getClassDetails,
    getStudentProfile,
    updateStudentProfile,
    getClassSchedules,
    getHomeworksByStudentId,
    getScoresByStudentId,
    getAttendancesByStudentId,
    getStudentScheduleById,
    getExamsByStudentId,
  };
};
