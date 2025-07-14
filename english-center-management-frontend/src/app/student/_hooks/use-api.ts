import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';

// Student API hooks
export const useStudentApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get student dashboard data
  const getStudentDashboard = useCallback(async () => {
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

  // Get student's classes
  const getStudentClasses = useCallback(async () => {
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
  const getStudentSchedule = useCallback(async () => {
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
  const getStudentScores = useCallback(async () => {
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
  const getClassDetails = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/student/classes/${classId}`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get class assignments
  const getClassAssignments = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/student/classes/${classId}/assignments`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit assignment
  const submitAssignment = useCallback(
    async (classId, assignmentId, submissionData) => {
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
  const getStudentProfile = useCallback(async () => {
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
  const updateStudentProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/student/profile', profileData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get class schedules
  const getClassSchedules = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/student/classes/${classId}/schedules`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get class scores
  const getClassScores = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/student/classes/${classId}/scores`);
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
