import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { UserResponse, UserCreate, UserUpdate } from '../../../types/admin';

export const useStaffApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStaff = useCallback(
    async (staffData: UserCreate): Promise<UserResponse> => {
      setLoading(true);
      setError(null);
      try {
        // Ensure role_name is 'staff'
        const response = await api.post('/admin/staff', {
          ...staffData,
          role_name: 'staff',
        });
        return response as UserResponse;
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

  const updateStaff = useCallback(
    async (id: string, staffData: UserUpdate): Promise<UserResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/admin/staff/${id}`, staffData);
        return response as UserResponse;
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

  const deleteStaff = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/staff/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStaffs = useCallback(async (): Promise<UserResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      // Filter by role_name=staff
      const response = await api.get('/admin/staff');
      return response as UserResponse[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStaffById = useCallback(
    async (id: string): Promise<UserResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/admin/staff/${id}`);
        return response as UserResponse;
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
    createStaff,
    updateStaff,
    deleteStaff,
    getStaffs,
    getStaffById,
  };
};
