import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';

export interface ExamBase {
  exam_name: string;
  description?: string;
  class_id: string;
  start_time: string;
  duration: number;
}

export interface ExamCreate extends ExamBase {}

export interface ExamUpdate {
  exam_name?: string;
  description?: string;
  start_time?: string;
  duration?: number;
}

export interface ExamResponse extends ExamBase {
  id: string;
  created_at: string;
  classroom: {
    id: string;
    class_name: string;
  };
}

export const useExam = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get all exams
  const getExams = useCallback(async (): Promise<ExamResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/exams');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get exams by class ID
  const getExamsByClassId = useCallback(
    async (classId: string): Promise<ExamResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/exams/class/${classId}`);
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

  // Get exam by ID
  const getExamById = useCallback(
    async (examId: string): Promise<ExamResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/exams/${examId}`);
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

  // Create new exam
  const createExam = useCallback(
    async (examData: ExamCreate): Promise<ExamResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/exams', examData);
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

  // Update exam
  const updateExam = useCallback(
    async (examId: string, examData: ExamUpdate): Promise<ExamResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/exams/${examId}`, examData);
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

  // Delete exam
  const deleteExam = useCallback(async (examId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/exams/${examId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,

    // Actions
    getExams,
    getExamsByClassId,
    getExamById,
    createExam,
    updateExam,
    deleteExam,
    clearError,
  };
};
