import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';

export enum HomeworkStatus {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
}

export interface UpdateHomework {
  student_id: string;
  status: HomeworkStatus;
  feedback: string;
}

export interface Homework extends UpdateHomework {
  id: string;
}

export interface SessionHomeworkResponse {
  id: string;
  topic: string;
  class_id: string;
  schedule_id: string;
  homeworks: Homework[];
  created_at: string;
}

export const useHomeworkApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSessionHomeworks = useCallback(
    async (classId: string): Promise<SessionHomeworkResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/homework/${classId}/`);
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

  const updateHomework = useCallback(
    async (
      homeworkId: string,
      updateHomework: UpdateHomework
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(
          `/homework/${homeworkId}/`,
          updateHomework
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

  return {
    loading,
    error,
    getSessionHomeworks,
    updateHomework,
  };
};
