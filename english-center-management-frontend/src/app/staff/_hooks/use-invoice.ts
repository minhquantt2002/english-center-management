import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { Invoice } from '../../../types/staff';

// Interface cho dữ liệu tạo invoice
export interface CreateInvoiceData {
  studentId: string;
  courseId: string;
  classId: string;
  tuitionFee: number;
  paymentMethod: 'cash' | 'transfer';
  notes?: string;
}

// Interface cho response API
export interface InvoiceResponse {
  success: boolean;
  data: Invoice;
  message?: string;
}

export interface InvoicesResponse {
  success: boolean;
  data: Invoice[];
  message?: string;
}

export const useStaffInvoiceApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = useCallback(
    async (invoiceData: CreateInvoiceData): Promise<InvoiceResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/staff/invoices', invoiceData);
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

  const getInvoices = useCallback(async (): Promise<InvoicesResponse> => {
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
