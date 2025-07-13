import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

// Role API hooks
export const useRoleApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (userData: any) => {
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

  const updateUser = useCallback(async (id: string, userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
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

  const getUsers = useCallback(async () => {
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

  const updateUserRole = useCallback(async (id: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/admin/users/${id}/role`, { role });
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
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    updateUserRole,
  };
};
