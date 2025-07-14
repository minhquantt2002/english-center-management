import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';

export const useStaffInvoiceApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = useCallback(async (invoiceData: any): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/staff/invoices', invoiceData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInvoices = useCallback(async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/staff/invoices');
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
    createInvoice,
    getInvoices,
  };
};
