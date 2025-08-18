import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import {
  UserResponse,
  UserCreate,
  UserUpdate,
  GetUsersQuery,
  UpdateUserRoleRequest,
} from '../../../types/admin';

export const useUserApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(
    async (userData: UserCreate): Promise<UserResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/admin/users', userData);
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

  const updateUser = useCallback(
    async (id: string, userData: UserUpdate): Promise<UserResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/admin/users/${id}`, userData);
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

  const getUsers = useCallback(
    async (query?: GetUsersQuery): Promise<UserResponse[]> => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = query
          ? `?${new URLSearchParams(query as Record<string, string>)}`
          : '';
        const response = await api.get(`/admin/users${queryParams}`);
        return response as UserResponse[];
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

  const updateUserRole = useCallback(
    async (
      id: string,
      roleData: UpdateUserRoleRequest
    ): Promise<UserResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`/admin/users/${id}/role`, roleData);
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
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    updateUserRole,
  } as const;
};
