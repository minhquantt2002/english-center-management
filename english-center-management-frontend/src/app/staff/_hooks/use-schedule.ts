import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  ScheduleResponse,
  ScheduleCreate,
  ScheduleUpdate,
  GetSchedulesQuery,
  DeleteScheduleResponse,
  ClassroomSchedulesResponse,
} from '../../../types/staff';

export const useStaffScheduleApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSchedules = useCallback(
    async (filters?: GetSchedulesQuery): Promise<ScheduleResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = '/staff/schedules';
        if (filters) {
          const params = new URLSearchParams();
          if (filters.classroom_id)
            params.append('classroom_id', filters.classroom_id);
          if (filters.teacher_id)
            params.append('teacher_id', filters.teacher_id);
          if (filters.weekday) params.append('weekday', filters.weekday);
          if (params.toString()) {
            endpoint += `?${params.toString()}`;
          }
        }
        const response = await api.get(endpoint);
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

  const createSchedule = useCallback(
    async (scheduleData: ScheduleCreate): Promise<ScheduleResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/staff/schedules', scheduleData);
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

  const updateSchedule = useCallback(
    async (
      id: string,
      scheduleData: ScheduleUpdate
    ): Promise<ScheduleResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/staff/schedules/${id}`, scheduleData);
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

  const deleteSchedule = useCallback(
    async (id: string): Promise<DeleteScheduleResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.delete(`/staff/schedules/${id}`);
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

  const getClassroomSchedules = useCallback(
    async (classroomId: string): Promise<ClassroomSchedulesResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/staff/classrooms/${classroomId}/schedules`
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
    getSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getClassroomSchedules,
  };
};
