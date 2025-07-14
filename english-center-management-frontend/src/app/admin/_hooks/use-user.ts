import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { User, UserRole, UserStatus } from '../../../types';

// Types for API requests and responses
export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  dateOfBirth?: string;
  address?: string;
  specialization?: string;
  qualification?: string;
  experience?: number;
  hourlyRate?: number;
  bio?: string;
  languages?: string[];
  certifications?: string[];
  studentId?: string;
  level?: string;
  enrollmentDate?: string;
  parentContact?: string;
  notes?: string;
  currentClass?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  employeeId?: string;
  department?: string;
  position?: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UserResponse {
  data: User[];
  total?: number;
  page?: number;
  limit?: number;
}

export const useUserApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(
    async (userData: CreateUserRequest): Promise<User> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/admin/users', userData);
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

  const updateUser = useCallback(
    async (id: string, userData: Partial<CreateUserRequest>): Promise<User> => {
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
