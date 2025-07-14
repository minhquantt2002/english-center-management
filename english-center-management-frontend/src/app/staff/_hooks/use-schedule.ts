import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { TimeSlot } from '../../../types/common';

// API response data structure for teachers
export interface TeacherApiResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  hourlyRate?: number;
  status: 'active' | 'inactive' | 'pending';
  role_name: string;
}

// API response data structure for rooms
export interface RoomApiResponse {
  id: string;
  name: string;
  capacity: number;
  location?: string;
  equipment?: string[];
  status: 'available' | 'occupied' | 'maintenance';
  type: 'classroom' | 'lab' | 'auditorium' | 'online';
}

// API response data structure for schedules
export interface ScheduleApiResponse {
  id: string;
  weekday: string;
  start_time: string;
  end_time: string;
  room?: {
    id: string;
    name: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  title?: string;
  description?: string;
  class_id?: string;
}

// Schedule session interface for staff components
export interface ScheduleSession {
  id: string;
  day: string;
  timeSlot: TimeSlot;
  room: string;
  teacher: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

// Data structure for creating a new schedule
export interface CreateScheduleData {
  class_id: string;
  room_id: string;
  weekday: string;
  start_time: string;
  end_time: string;
  title?: string;
  description?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

// Data structure for updating a schedule
export interface UpdateScheduleData {
  status?: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  room_id?: string;
  weekday?: string;
  start_time?: string;
  end_time?: string;
  title?: string;
  description?: string;
}

export const useStaffScheduleApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSchedules = useCallback(async (): Promise<ScheduleApiResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/schedules');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSchedule = useCallback(
    async (scheduleData: CreateScheduleData): Promise<ScheduleApiResponse> => {
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
      scheduleData: UpdateScheduleData
    ): Promise<ScheduleApiResponse> => {
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

  const deleteSchedule = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/staff/schedules/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClassroomSchedules = useCallback(
    async (classroomId: string): Promise<ScheduleApiResponse[]> => {
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
