import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { User, UserRole, UserStatus } from '../../../types';

export const useUserApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (userData: any): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/admin/users', userData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (id: string, userData: any): Promise<User> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/admin/users/${id}`, userData);
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

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/users/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUsers = useCallback(async (): Promise<User[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/users');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(
    async (id: string, role: UserRole): Promise<User> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/admin/users/${id}/role`, { role });
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
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    updateUserRole,
  } as const;
};
