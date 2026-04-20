/**
 * Service de paiements simplifié
 * Aligné avec le backend simplifié
 */

import { apiService } from './api.service';
import {
  Payment,
  PaymentProofUpload,
  PaymentVerification,
  PaymentResponse,
  PaymentsListResponse,
  PaymentHealthResponse,
  PaymentFilters,
} from '@/types/payments';

class PaymentsService {
  private basePath = '/api/v1/payments';

  /**
   * Uploader une preuve de paiement
   */
  async uploadPaymentProof(data: PaymentProofUpload): Promise<PaymentResponse> {
    try {
      const response = await apiService.post<PaymentResponse>(
        `${this.basePath}/upload-proof`,
        data
      );
      return response;
    } catch (error) {
      console.error('Payment upload error:', error);
      throw error;
    }
  }

  /**
   * Uploader une preuve de paiement avec FormData (pour fichiers)
   */
  async uploadPaymentProofFile(
    invoiceId: string,
    file: File
  ): Promise<PaymentResponse> {
    try {
      // Convertir le fichier en base64
      const base64 = await this.fileToBase64(file);
      
      const data: PaymentProofUpload = {
        invoiceId,
        fileBase64: base64,
        fileName: file.name,
        mimeType: file.type,
      };

      return this.uploadPaymentProof(data);
    } catch (error) {
      console.error('Payment file upload error:', error);
      throw error;
    }
  }

  /**
   * Vérifier un paiement (admin)
   */
  async verifyPayment(data: PaymentVerification): Promise<PaymentResponse> {
    try {
      const response = await apiService.post<PaymentResponse>(
        `${this.basePath}/verify`,
        data
      );
      return response;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  /**
   * Récupérer un paiement par ID
   */
  async getPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await apiService.get<PaymentResponse>(
        `${this.basePath}/${paymentId}`
      );
      return response;
    } catch (error) {
      console.error('Get payment error:', error);
      throw error;
    }
  }

  /**
   * Lister les paiements d'un tenant
   */
  async listPayments(
    tenantId: string,
    limit: number = 10,
    filters?: PaymentFilters
  ): Promise<PaymentsListResponse> {
    try {
      const params: any = { limit };
      
      if (filters) {
        if (filters.status) params.status = filters.status;
        if (filters.provider) params.provider = filters.provider;
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;
        if (filters.search) params.search = filters.search;
      }

      const response = await apiService.get<PaymentsListResponse>(
        `${this.basePath}/tenant/${tenantId}`,
        { params }
      );
      return response;
    } catch (error) {
      console.error('List payments error:', error);
      throw error;
    }
  }

  /**
   * Health check du service de paiement
   */
  async healthCheck(): Promise<PaymentHealthResponse> {
    try {
      const response = await apiService.get<PaymentHealthResponse>(
        `${this.basePath}/health`
      );
      return response;
    } catch (error) {
      console.error('Payment health check error:', error);
      throw error;
    }
  }

  /**
   * Convertir un fichier en base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Valider un fichier de preuve de paiement
   */
  validatePaymentFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];

    if (!file) {
      return { valid: false, error: 'Aucun fichier sélectionné' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Le fichier est trop volumineux (max 10MB)' };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Type de fichier non supporté. Utilisez JPG, PNG, GIF, WEBP ou PDF',
      };
    }

    return { valid: true };
  }

  /**
   * Formater un montant pour l'affichage
   */
  formatAmount(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Formater une date pour l'affichage
   */
  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  }

  /**
   * Obtenir le temps écoulé depuis une date
   */
  getTimeAgo(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}`;
    } else if (diffHour > 0) {
      return `il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`;
    } else if (diffMin > 0) {
      return `il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
    } else {
      return `à l'instant`;
    }
  }

  /**
   * Générer un récapitulatif de paiement pour l'email/notification
   */
  generatePaymentSummary(payment: Payment): string {
    return `
      Paiement #${payment.id}
      Facture: ${payment.invoiceId}
      Montant: ${this.formatAmount(payment.amount, payment.currency)}
      Statut: ${payment.status}
      Méthode: ${payment.provider}
      Date: ${this.formatDate(payment.createdAt)}
      ${payment.proofUrl ? `Preuve: ${payment.proofUrl}` : ''}
    `.trim();
  }

  /**
   * Exporter les paiements au format CSV
   */
  exportPaymentsToCSV(payments: Payment[]): string {
    const headers = ['ID', 'Facture', 'Montant', 'Devise', 'Statut', 'Méthode', 'Date création'];
    const rows = payments.map(payment => [
      payment.id,
      payment.invoiceId,
      payment.amount.toString(),
      payment.currency,
      payment.status,
      payment.provider,
      this.formatDate(payment.createdAt),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * Filtrer les paiements par statut
   */
  filterPaymentsByStatus(payments: Payment[], status: string): Payment[] {
    return payments.filter(payment => payment.status === status);
  }

  /**
   * Calculer les statistiques des paiements
   */
  calculatePaymentStatistics(payments: Payment[]) {
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const byStatus = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byProvider = payments.reduce((acc, payment) => {
      acc[payment.provider] = (acc[payment.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPayments: payments.length,
      totalAmount,
      averageAmount: payments.length > 0 ? totalAmount / payments.length : 0,
      byStatus,
      byProvider,
    };
  }
}

export const paymentsService = new PaymentsService();

// Export par défaut pour la compatibilité
export default paymentsService;