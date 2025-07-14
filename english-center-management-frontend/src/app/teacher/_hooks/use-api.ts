import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  TeacherDashboard,
  ClassSession,
  StudentInClass,
  StudentScore,
  TeachingSchedule,
  AttendanceEntry,
  GradeBook,
} from '../../../types';

// Additional types for API requests and responses
export interface AttendanceData {
  sessionId: string;
  sessionDate: string;
  attendance: {
    studentId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    arrivalTime?: string;
    notes?: string;
  }[];
}

export interface ScoreData {
  studentId: string;
  testType: 'quiz' | 'midterm' | 'final' | 'assignment';
  testDate: string;
  scores: {
    listening?: number;
    speaking?: number;
    reading?: number;
    writing?: number;
    grammar?: number;
    vocabulary?: number;
  };
  maxScores?: {
    listening?: number;
    speaking?: number;
    reading?: number;
    writing?: number;
    grammar?: number;
    vocabulary?: number;
  };
  comments?: string;
}

export interface GradesData {
  assignmentId: string;
  grades: {
    studentId: string;
    score: number;
    feedback?: string;
  }[];
}

export interface ClassDetails {
  id: string;
  name: string;
  level: string;
  room: string;
  maxStudents: number;
  totalStudents: number;
  currentUnit: string;
  schedule: {
    day: string;
    time: string;
  };
  teacher: {
    id: string;
    name: string;
  };
  status: 'active' | 'completed' | 'cancelled';
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  level: string;
  status: 'active' | 'inactive';
  joinDate: string;
  attendanceRate?: number;
  averageScore?: number;
}

export interface ScheduleData {
  id: string;
  classId: string;
  className: string;
  day: string;
  time: string;
  room: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  topic?: string;
}

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

  // Get teacher's classes
  const getTeacherClasses = useCallback(async (): Promise<ClassSession[]> => {
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
  const getTeachingSchedule = useCallback(async (): Promise<
    TeachingSchedule[]
  > => {
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
  const getClassDetails = useCallback(
    async (classId: string): Promise<ClassDetails> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/teacher/classes/${classId}`);
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

  // Get class students
  const getClassStudents = useCallback(
    async (classId: string): Promise<StudentInClass[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/teacher/classes/${classId}/students`);
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

  // Update attendance
  const updateAttendance = useCallback(
    async (
      classId: string,
      attendanceData: AttendanceData
    ): Promise<AttendanceEntry[]> => {
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
  const getClassGrades = useCallback(
    async (classId: string): Promise<GradeBook> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/teacher/classes/${classId}/grades`);
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

  // Get teaching schedule details
  const getTeachingScheduleDetails = useCallback(async (): Promise<
    TeachingSchedule[]
  > => {
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
    getTeacherClasses,
    getTeachingSchedule,
    getClassDetails,
    getClassStudents,
    updateAttendance,
    getClassGrades,
    createStudentScore,
    updateStudentScore,
    updateGrades,

    getTeachingScheduleDetails,
    getClassSchedule,
  };
};
