import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';

export const useStaffStudentApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/students');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (studentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/staff/students', studentData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudent = useCallback(async (id, studentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/staff/students/${id}`, studentData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/students/available');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudentAchievements = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/staff/students/${studentId}/achievements`
      );
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudentInvoices = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/staff/students/${studentId}/invoices`);
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
    getStudents,
    createStudent,
    updateStudent,
    getAvailableStudents,
    getStudentAchievements,
    getStudentInvoices,
  };
};
