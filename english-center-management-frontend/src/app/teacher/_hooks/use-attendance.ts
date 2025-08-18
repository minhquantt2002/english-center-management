import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';

export interface CreateAttendance {
  student_id: string;
  is_present: boolean;
}

export interface CreateSessionAttendance {
  topic: string;
  class_id: string;
  schedule_id: string;
  attendances: CreateAttendance[];
}

export interface SessionAttendanceResponse extends CreateSessionAttendance {
  id: string;
  created_at: string;
}

// Teacher API hooks
export const useAttendanceApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSessionAttendances = useCallback(
    async (classId: string): Promise<SessionAttendanceResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/attendance/${classId}/`);
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

  const createAttendance = useCallback(
    async (createdAttendance: CreateSessionAttendance): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(`/attendance`, createdAttendance);
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
    getSessionAttendances,
    createAttendance,
  };
};
