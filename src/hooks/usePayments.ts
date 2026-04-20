/**
 * Hooks React pour les paiements
 */

import { useState, useCallback } from 'react';
import { paymentsService } from '@/services/payments.service';
import {
  Payment,
  PaymentProofUpload,
  PaymentVerification,
  PaymentResponse,
  PaymentsListResponse,
  PaymentFilters,
} from '@/types/payments';

export function usePaymentUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Payment | null>(null);

  const uploadPaymentProof = useCallback(async (data: PaymentProofUpload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await paymentsService.uploadPaymentProof(data);
      
      if (response.success && response.data) {
        setData(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Échec de l\'upload du paiement');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadPaymentProofFile = useCallback(async (invoiceId: string, file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await paymentsService.uploadPaymentProofFile(invoiceId, file);
      
      if (response.success && response.data) {
        setData(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Échec de l\'upload du fichier');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    uploadPaymentProof,
    uploadPaymentProofFile,
    reset,
  };
}

export function usePaymentVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Payment | null>(null);

  const verifyPayment = useCallback(async (data: PaymentVerification) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await paymentsService.verifyPayment(data);
      
      if (response.success && response.data) {
        setData(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Échec de la vérification du paiement');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    verifyPayment,
    reset,
  };
}

export function usePaymentList(tenantId: string, initialLimit: number = 10) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<PaymentFilters>({});

  const loadPayments = useCallback(async (customFilters?: PaymentFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentFilters = customFilters || filters;
      const response = await paymentsService.listPayments(
        tenantId,
        initialLimit,
        currentFilters
      );
      
      if (response.success && response.data) {
        setData(response.data);
        setTotal(response.count || response.data.length);
        return response.data;
      } else {
        throw new Error(response.error || 'Échec du chargement des paiements');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, initialLimit, filters]);

  const updateFilters = useCallback((newFilters: PaymentFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const refresh = useCallback(() => {
    return loadPayments();
  }, [loadPayments]);

  return {
    isLoading,
    error,
    data,
    total,
    filters,
    loadPayments,
    updateFilters,
    resetFilters,
    refresh,
  };
}

export function usePaymentDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Payment | null>(null);

  const loadPayment = useCallback(async (paymentId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await paymentsService.getPayment(paymentId);
      
      if (response.success && response.data) {
        setData(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Paiement non trouvé');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    loadPayment,
    reset,
  };
}

export function usePaymentHealth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  const checkHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await paymentsService.healthCheck();
      setIsHealthy(response.success);
      return response.success;
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      setIsHealthy(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setIsHealthy(null);
  }, []);

  return {
    isLoading,
    error,
    isHealthy,
    checkHealth,
    reset,
  };
}

export function usePaymentStatistics(payments: Payment[]) {
  const calculateStats = useCallback(() => {
    return paymentsService.calculatePaymentStatistics(payments);
  }, [payments]);

  const filterByStatus = useCallback((status: string) => {
    return paymentsService.filterPaymentsByStatus(payments, status);
  }, [payments]);

  const exportToCSV = useCallback(() => {
    return paymentsService.exportPaymentsToCSV(payments);
  }, [payments]);

  const formatAmount = useCallback((amount: number, currency: string = 'EUR') => {
    return paymentsService.formatAmount(amount, currency);
  }, []);

  const formatDate = useCallback((date: Date | string) => {
    return paymentsService.formatDate(date);
  }, []);

  const getTimeAgo = useCallback((date: Date | string) => {
    return paymentsService.getTimeAgo(date);
  }, []);

  return {
    calculateStats,
    filterByStatus,
    exportToCSV,
    formatAmount,
    formatDate,
    getTimeAgo,
  };
}