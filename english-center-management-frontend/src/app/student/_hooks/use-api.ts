import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  StudentProfile,
  StudentClass,
  StudentSchedule,
  TestResult,
} from '../../../types/student';
import { BaseEntity } from '../../../types/common';

// Student dashboard data interface
export interface StudentDashboardData extends BaseEntity {
  profile?: StudentProfile;
  studentProfile?: StudentProfile;
  stats: {
    totalClasses: number;
    inProgress: number;
    completed: number;
    averageProgress: number;
  };
  recentActivity?: Array<{
    id: string;
    type: 'class' | 'assignment' | 'exam';
    title: string;
    date: string;
    status: string;
  }>;
}

// Assignment interface for students
export interface StudentAssignment extends BaseEntity {
  id: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  assignedDate: string;
  dueDate: string;
  maxScore: number;
  type: 'homework' | 'project' | 'essay' | 'presentation' | 'quiz';
  instructions?: string;
  attachments?: string[];
  status: 'assigned' | 'submitted' | 'graded' | 'late' | 'missing';
  submittedAt?: string;
  score?: number;
  feedback?: string;
}

// Assignment submission data interface
export interface AssignmentSubmissionData {
  content: string;
  attachments?: File[];
  comments?: string;
}

// Student profile update data interface
export interface StudentProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Class details interface for students
export interface StudentClassDetails extends StudentClass {
  course: {
    id: string;
    name: string;
    description: string;
    level: string;
    duration: number;
  };
  teacher: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    specialization: string;
    bio?: string;
  };
  students: Array<{
    id: string;
    name: string;
    avatar?: string;
    email: string;
  }>;
  assignments: StudentAssignment[];
  schedules: StudentSchedule[];
  scores: TestResult[];
}

// Student API hooks
export const useStudentApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get student dashboard data
  const getStudentDashboard =
    useCallback(async (): Promise<StudentDashboardData> => {
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
  const getStudentClasses = useCallback(async (): Promise<StudentClass[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/student/classes');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get student's schedule
  const getStudentSchedule = useCallback(async (): Promise<
    StudentSchedule[]
  > => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/student/schedule');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get student's scores
  const getStudentScores = useCallback(async (): Promise<TestResult[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/student/scores');
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
    async (classId: string): Promise<StudentClassDetails> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/student/classes/${classId}`);
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

  // Get class assignments
  const getClassAssignments = useCallback(
    async (classId: string): Promise<StudentAssignment[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/student/classes/${classId}/assignments`
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

  // Submit assignment
  const submitAssignment = useCallback(
    async (
      classId: string,
      assignmentId: string,
      submissionData: AssignmentSubmissionData
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(
          `/student/classes/${classId}/assignments/${assignmentId}/submit`,
          submissionData
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

  // Get student profile
  const getStudentProfile = useCallback(async (): Promise<StudentProfile> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/student/profile');
      return response;
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
    async (profileData: StudentProfileUpdateData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put('/student/profile', profileData);
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

  // Get class schedules
  const getClassSchedules = useCallback(
    async (classId: string): Promise<StudentSchedule[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/student/classes/${classId}/schedules`);
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

  // Get class scores
  const getClassScores = useCallback(
    async (classId: string): Promise<TestResult[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/student/classes/${classId}/scores`);
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
    getStudentDashboard,
    getStudentClasses,
    getStudentSchedule,
    getStudentScores,
    getClassDetails,
    getClassAssignments,
    submitAssignment,
    getStudentProfile,
    updateStudentProfile,
    getClassSchedules,
    getClassScores,
  };
};
