/**
 * Types pour le module Paiements Simplifié
 * Aligné avec le backend simplifié
 */

export type PaymentStatus = 
  | 'pending'      // En attente de vérification
  | 'processing'   // En cours de traitement
  | 'completed'    // Paiement terminé et vérifié
  | 'failed'       // Paiement échoué
  | 'cancelled';   // Paiement annulé

export type PaymentProvider = 
  | 'manual'       // Paiement manuel avec preuve
  | 'bank_transfer' // Virement bancaire
  | 'cash';        // Espèces

export interface Payment {
  id: string;
  invoiceId: string;
  tenantId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  transactionId?: string;
  proofUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PaymentProofUpload {
  invoiceId: string;
  fileBase64: string;
  fileName: string;
  mimeType: string;
}

export interface PaymentVerification {
  paymentId: string;
  approved: boolean;
  notes?: string;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: Payment;
  error?: string;
}

export interface PaymentsListResponse {
  success: boolean;
  data: Payment[];
  count: number;
  error?: string;
}

export interface PaymentHealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// Labels pour l'UI
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'En attente',
  processing: 'En traitement',
  completed: 'Terminé',
  failed: 'Échoué',
  cancelled: 'Annulé',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export const PAYMENT_PROVIDER_LABELS: Record<PaymentProvider, string> = {
  manual: 'Manuel',
  bank_transfer: 'Virement',
  cash: 'Espèces',
};

export const PAYMENT_PROVIDER_ICONS: Record<PaymentProvider, string> = {
  manual: '📄',
  bank_transfer: '🏦',
  cash: '💰',
};

// Types pour les formulaires UI
export interface PaymentUploadFormData {
  invoiceId: string;
  file: File | null;
  fileName: string;
  mimeType: string;
}

export interface PaymentVerificationFormData {
  paymentId: string;
  approved: boolean;
  notes: string;
}

// Types pour les filtres et pagination
export interface PaymentFilters {
  status?: PaymentStatus;
  provider?: PaymentProvider;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaymentPagination {
  page: number;
  limit: number;
  total: number;
}

// Types pour les statistiques
export interface PaymentStatistics {
  totalPayments: number;
  totalAmount: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
  byProvider: Record<PaymentProvider, number>;
  byStatus: Record<PaymentStatus, number>;
  recentPayments: Payment[];
}

// Types pour les événements de paiement
export interface PaymentEvent {
  type: 'payment_created' | 'payment_verified' | 'payment_failed';
  paymentId: string;
  invoiceId: string;
  tenantId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Types pour les notifications
export interface PaymentNotification {
  id: string;
  type: 'payment_uploaded' | 'payment_verified' | 'payment_failed';
  paymentId: string;
  invoiceId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Types pour les exports
export interface PaymentExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  filters?: PaymentFilters;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Types pour les rapports
export interface PaymentReport {
  period: string;
  totalPayments: number;
  totalAmount: number;
  averageAmount: number;
  successRate: number;
  topInvoices: Array<{
    invoiceId: string;
    amount: number;
    paymentCount: number;
  }>;
  providerDistribution: Array<{
    provider: PaymentProvider;
    count: number;
    amount: number;
    percentage: number;
  }>;
}