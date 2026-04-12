import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Tenant, 
  Product, 
  Patient, 
  Prescription, 
  Sale,
  DashboardStats,
  SalesAnalytics
} from '@/types';

// Configuration de base d'Axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Intercepteur de requête
    this.client.interceptors.request.use(
      (config) => {
        // Ajouter le token d'authentification si disponible
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Ajouter l'ID du tenant depuis le subdomain ou headers
        const tenant = this.getTenantFromSubdomain();
        if (tenant) {
          config.headers['X-Tenant-ID'] = tenant;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponse
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        this.handleErrorResponse(error);
        return Promise.reject(error);
      }
    );
  }

  private getTenantFromSubdomain(): string | null {
    if (typeof window === 'undefined') return null;
    
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Si c'est un subdomain (ex: pharmacy1.localhost)
    if (parts.length > 2) {
      return parts[0];
    }
    
    return null;
  }

  private handleErrorResponse(error: AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || 'Une erreur est survenue';

      switch (status) {
        case 401:
          toast.error('Session expirée. Veuillez vous reconnecter.');
          this.logout();
          break;
        case 403:
          toast.error('Accès refusé. Permissions insuffisantes.');
          break;
        case 404:
          toast.error('Ressource non trouvée.');
          break;
        case 429:
          toast.error('Trop de requêtes. Veuillez patienter.');
          break;
        case 500:
          toast.error('Erreur serveur. Veuillez réessayer plus tard.');
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      toast.error('Erreur de connexion. Vérifiez votre connexion internet.');
    }
  }

  // Méthodes d'authentification
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    
    return this.token;
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
  }

  // Méthodes API pour l'authentification
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.client.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login',
      { email, password }
    );
    
    const { token } = response.data.data;
    this.setToken(token);
    
    return response.data.data;
  }

  async register(userData: any): Promise<{ user: User; token: string }> {
    const response = await this.client.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/register',
      userData
    );
    
    const { token } = response.data.data;
    this.setToken(token);
    
    return response.data.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }

  // Méthodes API pour les patients
  async getPatients(page = 1, limit = 20): Promise<PaginatedResponse<Patient>> {
    const response = await this.client.get<PaginatedResponse<Patient>>(
      `/patients?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getPatient(id: number): Promise<Patient> {
    const response = await this.client.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data;
  }

  async createPatient(patientData: any): Promise<Patient> {
    const response = await this.client.post<ApiResponse<Patient>>('/patients', patientData);
    return response.data.data;
  }

  async updatePatient(id: number, patientData: any): Promise<Patient> {
    const response = await this.client.put<ApiResponse<Patient>>(`/patients/${id}`, patientData);
    return response.data.data;
  }

  async deletePatient(id: number): Promise<void> {
    await this.client.delete(`/patients/${id}`);
  }

  // Méthodes API pour les produits
  async getProducts(page = 1, limit = 20): Promise<PaginatedResponse<Product>> {
    const response = await this.client.get<PaginatedResponse<Product>>(
      `/inventory/products?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.client.get<ApiResponse<Product>>(`/inventory/products/${id}`);
    return response.data.data;
  }

  async createProduct(productData: any): Promise<Product> {
    const response = await this.client.post<ApiResponse<Product>>('/inventory/products', productData);
    return response.data.data;
  }

  async updateProduct(id: number, productData: any): Promise<Product> {
    const response = await this.client.put<ApiResponse<Product>>(`/inventory/products/${id}`, productData);
    return response.data.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.client.delete(`/inventory/products/${id}`);
  }

  // Méthodes API pour les prescriptions
  async getPrescriptions(page = 1, limit = 20): Promise<PaginatedResponse<Prescription>> {
    const response = await this.client.get<PaginatedResponse<Prescription>>(
      `/prescriptions?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getPrescription(id: number): Promise<Prescription> {
    const response = await this.client.get<ApiResponse<Prescription>>(`/prescriptions/${id}`);
    return response.data.data;
  }

  async createPrescription(prescriptionData: any): Promise<Prescription> {
    const response = await this.client.post<ApiResponse<Prescription>>('/prescriptions', prescriptionData);
    return response.data.data;
  }

  async updatePrescription(id: number, prescriptionData: any): Promise<Prescription> {
    const response = await this.client.put<ApiResponse<Prescription>>(`/prescriptions/${id}`, prescriptionData);
    return response.data.data;
  }

  async fillPrescription(id: number): Promise<Prescription> {
    const response = await this.client.patch<ApiResponse<Prescription>>(`/prescriptions/${id}/fill`);
    return response.data.data;
  }

  // Méthodes API pour les ventes
  async getSales(page = 1, limit = 20): Promise<PaginatedResponse<Sale>> {
    const response = await this.client.get<PaginatedResponse<Sale>>(
      `/sales?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getSale(id: number): Promise<Sale> {
    const response = await this.client.get<ApiResponse<Sale>>(`/sales/${id}`);
    return response.data.data;
  }

  async createSale(saleData: any): Promise<Sale> {
    const response = await this.client.post<ApiResponse<Sale>>('/sales', saleData);
    return response.data.data;
  }

  async refundSale(id: number, refundData: any): Promise<Sale> {
    const response = await this.client.patch<ApiResponse<Sale>>(`/sales/${id}/refund`, refundData);
    return response.data.data;
  }

  // Méthodes API pour le tableau de bord
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.client.get<ApiResponse<DashboardStats>>('/analytics/dashboard');
    return response.data.data;
  }

  async getSalesAnalytics(period: string = '30d'): Promise<SalesAnalytics> {
    const response = await this.client.get<ApiResponse<SalesAnalytics>>(`/analytics/sales?period=${period}`);
    return response.data.data;
  }

  // Méthodes API pour l'inventaire
  async getLowStockAlerts(): Promise<any[]> {
    const response = await this.client.get<ApiResponse<any[]>>('/inventory/alerts/low-stock');
    return response.data.data;
  }

  async getExpiringProducts(): Promise<any[]> {
    const response = await this.client.get<ApiResponse<any[]>>('/inventory/alerts/expiring');
    return response.data.data;
  }

  async updateInventoryQuantity(productId: number, locationId: number, quantity: number): Promise<any> {
    const response = await this.client.patch<ApiResponse<any>>(
      `/inventory/products/${productId}/locations/${locationId}/quantity`,
      { quantity }
    );
    return response.data.data;
  }

  // Méthodes API pour les rapports
  async generateReport(reportType: string, filters: any): Promise<Blob> {
    const response = await this.client.post(
      `/reports/${reportType}`,
      filters,
      { responseType: 'blob' }
    );
    return response.data;
  }

  // Méthodes API pour les utilisateurs
  async getUsers(page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    const response = await this.client.get<PaginatedResponse<User>>(
      `/users?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async createUser(userData: any): Promise<User> {
    const response = await this.client.post<ApiResponse<User>>('/users', userData);
    return response.data.data;
  }

  async updateUser(id: number, userData: any): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }

  // Méthodes API pour les tenants
  async getTenant(): Promise<Tenant> {
    const response = await this.client.get<ApiResponse<Tenant>>('/tenant');
    return response.data.data;
  }

  async updateTenant(tenantData: any): Promise<Tenant> {
    const response = await this.client.put<ApiResponse<Tenant>>('/tenant', tenantData);
    return response.data.data;
  }

  // Recherche globale
  async search(query: string): Promise<any> {
    const response = await this.client.get<ApiResponse<any>>(`/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  }
}

// Instance singleton de l'API client
export const apiClient = new ApiClient();

// Export des méthodes pour faciliter l'utilisation
export const {
  login,
  register,
  getCurrentUser,
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  fillPrescription,
  getSales,
  getSale,
  createSale,
  refundSale,
  getDashboardStats,
  getSalesAnalytics,
  getLowStockAlerts,
  getExpiringProducts,
  updateInventoryQuantity,
  generateReport,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getTenant,
  updateTenant,
  search,
} = apiClient;