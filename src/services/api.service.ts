import { AxiosError, type AxiosRequestConfig } from 'axios';
import { apiClient } from '@/helpers/auth-interceptor';

class ApiService {
  /**
   * Effectuer une requête GET
   */
  async get<T = any>(endpoint: string, config = {}): Promise<T> {
    try {
      const response = await apiClient.get<T>(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Effectuer une requête POST
   */
  async post<T = any>(endpoint: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await apiClient.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Effectuer une requête PUT
   */
  async put<T = any>(endpoint: string, data?: any, config = {}): Promise<T> {
    try {
      const response = await apiClient.put<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Effectuer une requête PATCH
   */
  async patch<T = any>(endpoint: string, data?: any, config = {}): Promise<T> {
    try {
      const response = await apiClient.patch<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Effectuer une requête DELETE
   */
  async delete<T = any>(endpoint: string, config = {}): Promise<T> {
    try {
      const response = await apiClient.delete<T>(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ---------------------------------------------------------------------------
  // Domain helpers (thin wrappers using pharmacy-scoped routes)
  // ---------------------------------------------------------------------------

  private pharmacyPath(pharmacyId: string) {
    return `/pharmacies/${encodeURIComponent(pharmacyId)}`;
  }

  // Accounting
  getAccounts(pharmacyId: string): Promise<any[]> {
    return this.get(`${this.pharmacyPath(pharmacyId)}/accounting/accounts`);
  }

  createAccount(pharmacyId: string, data: unknown): Promise<unknown> {
    return this.post(`${this.pharmacyPath(pharmacyId)}/accounting/accounts`, data);
  }

  createExpense(pharmacyId: string, data: unknown): Promise<unknown> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.post(
      `${this.pharmacyPath(pharmacyId)}/accounting/expenses`,
      data,
      isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {},
    );
  }

  approveExpense(pharmacyId: string, expenseId: string, approvedBy: string): Promise<unknown> {
    return this.post(`${this.pharmacyPath(pharmacyId)}/accounting/expenses/${encodeURIComponent(expenseId)}/approve`, { approvedBy });
  }

  createInvoice(pharmacyId: string, data: unknown): Promise<unknown> {
    return this.post(`${this.pharmacyPath(pharmacyId)}/accounting/invoices`, data);
  }

  recordInvoicePayment(pharmacyId: string, invoiceId: string, data: unknown): Promise<unknown> {
    return this.post(`${this.pharmacyPath(pharmacyId)}/accounting/invoices/${encodeURIComponent(invoiceId)}/payments`, data);
  }

  createJournalEntry(pharmacyId: string, data: unknown): Promise<unknown> {
    return this.post(`${this.pharmacyPath(pharmacyId)}/accounting/journal-entries`, data);
  }

  createTransaction(pharmacyId: string, data: unknown): Promise<unknown> {
    return this.post(`${this.pharmacyPath(pharmacyId)}/accounting/transactions`, data);
  }

  // Inventory / products
  getProducts(pharmacyId: string, params?: { search?: string; limit?: number; offset?: number }): Promise<unknown> {
    return this.get(`${this.pharmacyPath(pharmacyId)}/inventory/products`, { params });
  }

  // Patients / prescriptions
  createPrescription(pharmacyId: string, patientId: string, data: unknown): Promise<unknown> {
    return this.post(`${this.pharmacyPath(pharmacyId)}/prescriptions`, { ...data as object, patientId });
  }

  deletePatient(pharmacyId: string, patientId: string): Promise<unknown> {
    return this.delete(`${this.pharmacyPath(pharmacyId)}/patients/${encodeURIComponent(patientId)}`);
  }

  verifyPrescription(pharmacyId: string, prescriptionId: string, data: unknown): Promise<unknown> {
    return this.post(`${this.pharmacyPath(pharmacyId)}/prescriptions/${encodeURIComponent(prescriptionId)}/verify`, data);
  }

  dispensePrescription(pharmacyId: string, prescriptionId: string, data: unknown): Promise<unknown> {
    return this.post(`${this.pharmacyPath(pharmacyId)}/prescriptions/${encodeURIComponent(prescriptionId)}/dispense`, data);
  }

  getCurrentUser(): Promise<unknown> {
    return this.get('/bff/auth/me');
  }

  /**
   * Upload de fichiers avec FormData
   */
  async upload<T = any>(endpoint: string, formData: FormData, config = {}): Promise<T> {
    try {
      const response = await apiClient.post<T>(endpoint, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Gérer les erreurs
   */
  private handleError(error: unknown): Error {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.error || 'Une erreur est survenue';

      switch (status) {
        case 401:
          // Géré par l'intercepteur, mais au cas où
          return new Error('Session expirée. Veuillez vous reconnecter.');

        case 403:
          return new Error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');

        case 404:
          return new Error('Ressource non trouvée.');

        case 409:
          return new Error(
            typeof errorMessage === "string" && errorMessage.length > 0
              ? errorMessage
              : "Conflit : cette ressource existe déjà (ex. sous-domaine ou e-mail).",
          );

        case 422:
          return new Error(`Données invalides : ${errorMessage}`);

        case 429:
          return new Error('Trop de requêtes. Veuillez réessayer plus tard.');

        case 500:
          return new Error('Erreur serveur. Veuillez réessayer plus tard.');

        default:
          return new Error(errorMessage);
      }
    }

    // Erreur réseau ou autre
    if (error instanceof Error) {
      return error;
    }

    return new Error('Une erreur inattendue est survenue');
  }
}

export const apiService = new ApiService();

// Legacy default import support
export default apiService;