import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { User } from '@/types';

export class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private tenantId: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Configuration des intercepteurs
    this.setupInterceptors();
    
    // Récupération des tokens depuis le localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      this.tenantId = localStorage.getItem('tenant_id');
    }
  }

  private setupInterceptors() {
    // Intercepteur de requête pour ajouter l'authentification
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      
      if (this.tenantId) {
        config.headers['X-Tenant-Id'] = this.tenantId;
      }
      
      return config;
    });

    // Intercepteur de réponse pour gérer les erreurs d'authentification
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setAuth(token: string, tenantId?: string) {
    this.token = token;
    if (tenantId) {
      this.tenantId = tenantId;
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      if (tenantId) {
        localStorage.setItem('tenant_id', tenantId);
      }
    }
  }

  // Ajout : Détection de l'environnement
  private isDev() {
    return process.env.NODE_ENV !== 'production';
  }

  // Ajout : Stockage du refresh token
  private setRefreshToken(token: string) {
    if (this.isDev()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', token);
      }
    } else {
      // En production, le backend doit définir un cookie httpOnly
      // Rien à faire côté client
    }
  }

  private getRefreshToken(): string | null {
    if (this.isDev()) {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('refresh_token');
      }
    }
    // En production, le cookie httpOnly sera envoyé automatiquement par le navigateur
    return null;
  }

  private clearRefreshToken() {
    if (this.isDev()) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('refresh_token');
      }
    }
    // En production, le backend doit supprimer le cookie
  }

  // Ajout : Méthode pour rafraîchir le token d'accès
  async refreshToken(): Promise<string> {
    try {
      let response;
      if (this.isDev()) {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) throw new Error('Aucun refresh token disponible');
        response = await this.client.post('/auth/refresh', { refresh_token: refreshToken });
      } else {
        // En production, le cookie httpOnly est envoyé automatiquement
        response = await this.client.post('/auth/refresh');
      }
      const { access_token, refresh_token } = response.data;
      if (access_token) {
        this.setAuth(access_token);
        if (refresh_token) this.setRefreshToken(refresh_token);
        return access_token;
      }
      throw new Error('Échec du rafraîchissement du token');
    } catch (error: any) {
      this.clearAuth();
      this.clearRefreshToken();
      throw new Error('Session expirée, veuillez vous reconnecter');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Méthodes d'authentification
  async login(email: string, password: string): Promise<{ user: User; token: string; tenantId?: string }> {
    try {
      const response = await this.client.post('/auth/login', { email, password });
      
      const { user, access_token, refresh_token, tenant } = response.data;
      
      if (access_token) {
        this.setAuth(access_token, tenant?.id);
        if (refresh_token) this.setRefreshToken(refresh_token);
        return {
          user,
          token: access_token,
          tenantId: tenant?.id
        };
      }
      
      throw new Error('Token d\'accès non reçu');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  }

  async register(userData: any): Promise<{ user: User; token: string; tenantId?: string }> {
    try {
      const response = await this.client.post('/auth/register', userData);
      
      const { user, access_token, refresh_token, tenant } = response.data;
      
      if (access_token) {
        this.setAuth(access_token, tenant?.id);
        if (refresh_token) this.setRefreshToken(refresh_token);
        return {
          user,
          token: access_token,
          tenantId: tenant?.id
        };
      }
      
      throw new Error('Token d\'accès non reçu');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.client.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error('Impossible de récupérer les informations utilisateur');
    }
  }

  logout() {
    this.clearAuth();
  }

  // Méthodes HTTP génériques
  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(endpoint, config);
    return response.data;
  }

  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(endpoint, data, config);
    return response.data;
  }

  async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(endpoint, data, config);
    return response.data;
  }

  async patch<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch(endpoint, data, config);
    return response.data;
  }

  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(endpoint, config);
    return response.data;
  }

  // === MÉTHODES SPÉCIFIQUES AUX MODULES ===

  // Dashboard & Analytics
  async getTenantDashboard() {
    return this.get('/analytics/dashboard');
  }

  async getDashboardMetrics(timeRange?: string) {
    return this.get('/analytics/metrics', { params: { timeRange } });
  }

  async getSalesOverview(params?: any) {
    return this.get('/analytics/sales-overview', { params });
  }

  // Alertes et Notifications
  async getLowStockAlerts() {
    return this.get('/inventory/alerts/low-stock');
  }

  async getExpiringProducts(days?: number) {
    return this.get('/inventory/alerts/expiring', { params: { days } });
  }

  async getPendingPrescriptions() {
    return this.get('/prescriptions', { params: { status: 'pending' } });
  }

  async getNotifications() {
    return this.get('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.patch(`/notifications/${id}/read`);
  }

  // Gestion des Utilisateurs
  async getUsers(params?: any) {
    return this.get('/users', { params });
  }

  async createUser(userData: any) {
    return this.post('/users', userData);
  }

  async updateUser(id: string, userData: any) {
    return this.put(`/users/${id}`, userData);
  }

  async deleteUser(id: string) {
    return this.delete(`/users/${id}`);
  }

  async getUserById(id: string) {
    return this.get(`/users/${id}`);
  }

  // Gestion de l'Inventaire
  async getProducts(params?: any) {
    return this.get('/inventory/products', { params });
  }

  async searchProducts(query: string) {
    return this.get('/inventory/products/search', { params: { q: query } });
  }

  async getProductById(id: string) {
    return this.get(`/inventory/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.post('/inventory/products', productData);
  }

  async updateProduct(id: string, productData: any) {
    return this.put(`/inventory/products/${id}`, productData);
  }

  async deleteProduct(id: string) {
    return this.delete(`/inventory/products/${id}`);
  }

  async adjustStock(productId: string, adjustment: any) {
    return this.post(`/inventory/products/${productId}/adjust`, adjustment);
  }

  // Gestion des Patients
  async getPatients(params?: any) {
    return this.get('/patients', { params });
  }

  async searchPatients(query: string) {
    return this.get('/patients/search', { params: { q: query } });
  }

  async getPatientById(id: string) {
    return this.get(`/patients/${id}`);
  }

  async getPatientHistory(id: string) {
    return this.get(`/patients/${id}/history`);
  }

  async createPatient(patientData: any) {
    return this.post('/patients', patientData);
  }

  async updatePatient(id: string, patientData: any) {
    return this.put(`/patients/${id}`, patientData);
  }

  // Gestion des Prescriptions
  async getPrescriptions(params?: any) {
    return this.get('/prescriptions', { params });
  }

  async getPrescriptionById(id: string) {
    return this.get(`/prescriptions/${id}`);
  }

  async createPrescription(prescriptionData: any) {
    return this.post('/prescriptions', prescriptionData);
  }

  async updatePrescription(id: string, prescriptionData: any) {
    return this.put(`/prescriptions/${id}`, prescriptionData);
  }

  async dispensePrescription(id: string, dispensingData: any) {
    return this.post(`/prescriptions/${id}/dispense`, dispensingData);
  }

  async checkDrugInteractions(medications: string[]) {
    return this.post('/ai/drug-interactions', { medications });
  }

  // Point de Vente (POS) & Facturation
  async createTransaction(transactionData: any) {
    return this.post('/billing/transactions', transactionData);
  }

  async getTransactions(params?: any) {
    return this.get('/billing/transactions', { params });
  }

  async getTransactionById(id: string) {
    return this.get(`/billing/transactions/${id}`);
  }

  async processPayment(transactionId: string, paymentData: any) {
    return this.post(`/billing/transactions/${transactionId}/payment`, paymentData);
  }

  async generateReceipt(transactionId: string) {
    return this.get(`/billing/transactions/${transactionId}/receipt`);
  }

  // Rapports et Analytics
  async getReports(type: string, params?: any) {
    return this.get(`/reports/${type}`, { params });
  }

  async getSalesReport(params: any) {
    return this.get('/reports/sales', { params });
  }

  async getInventoryReport(params?: any) {
    return this.get('/reports/inventory', { params });
  }

  async getFinancialReport(params: any) {
    return this.get('/reports/financial', { params });
  }

  // Configuration Pharmacie
  async getPharmacyConfig() {
    return this.get('/pharmacy/config');
  }

  async updatePharmacyConfig(config: any) {
    return this.put('/pharmacy/config', config);
  }

  // Abonnements
  async getCurrentSubscription() {
    return this.get('/subscriptions/current');
  }

  async updateSubscription(planId: string) {
    return this.post('/subscriptions/upgrade', { planId });
  }

  async getSubscriptionHistory() {
    return this.get('/subscriptions/history');
  }

  // Gestion RH
  async getEmployees(params?: any) {
    return this.get('/hr/employees', { params });
  }

  async createEmployee(employeeData: any) {
    return this.post('/hr/employees', employeeData);
  }

  async updateEmployee(id: string, employeeData: any) {
    return this.put(`/hr/employees/${id}`, employeeData);
  }

  async getAttendance(params?: any) {
    return this.get('/hr/attendance', { params });
  }

  // Programme de Fidélité
  async getLoyaltyProgram() {
    return this.get('/loyalty/program');
  }

  async getCustomerLoyalty(customerId: string) {
    return this.get(`/loyalty/customers/${customerId}`);
  }

  async awardLoyaltyPoints(customerId: string, points: number, reason: string) {
    return this.post(`/loyalty/customers/${customerId}/points`, { points, reason });
  }

  // Livraisons
  async getDeliveries(params?: any) {
    return this.get('/delivery/orders', { params });
  }

  async createDelivery(deliveryData: any) {
    return this.post('/delivery/orders', deliveryData);
  }

  async updateDeliveryStatus(id: string, status: string) {
    return this.patch(`/delivery/orders/${id}/status`, { status });
  }
}

// Instance globale du client API
export const apiClient = new ApiClient();