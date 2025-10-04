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
  SalesAnalytics,
  CreateSaleDto,
  SaleQueryDto,
  SalesReportQueryDto,
  CreateProductDto,
  ProductBatchDto,
  BatchQueryDto,
  AdjustBatchQuantityDto,
  InventoryAlert,
  CreatePrescriptionDto,
  CreatePatientDto,
  PatientQueryDto,
  CreateTransactionDto,
  CreateAccountDto,
  DispensePrescriptionDto,
  CreateInvoiceDto,
  CreateExpenseDto,
  ProductQueryDto,
  InventoryLocation,
  InventoryLocationDto
} from '@/types';

// ==================== API CLIENT ====================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        const tenant = this.getTenantFromSubdomain();
        if (tenant) {
          config.headers['X-Tenant-ID'] = tenant;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
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
    return parts.length > 2 ? parts[0] : null;
  }

  private handleErrorResponse(error: AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || 'Une erreur est survenue';

      const errorMessages: Record<number, string> = {
        401: 'Session expirée. Veuillez vous reconnecter.',
        403: 'Accès refusé. Permissions insuffisantes.',
        404: 'Ressource non trouvée.',
        429: 'Trop de requêtes. Veuillez patienter.',
        500: 'Erreur serveur. Veuillez réessayer plus tard.',
      };

      toast.error(errorMessages[status] || message);
      
      if (status === 401) this.logout();
    } else if (error.request) {
      toast.error('Erreur de connexion. Vérifiez votre connexion internet.');
    }
  }

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

  // ==================== AUTH ====================

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    const { token } = response.data;
    this.setToken(token);
    return response.data;
  }

  async register(userData: any) {
    const response = await this.client.post('/auth/register', userData);
    const { token } = response.data;
    this.setToken(token);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // ==================== SALES ====================

  async createSale(saleData: CreateSaleDto): Promise<{ sale: Sale; billingTransaction?: any }> {
    const response = await this.client.post('/api/sales', saleData);
    return response.data;
  }

  async getSales(query?: SaleQueryDto): Promise<PaginatedResponse<Sale>>{
    const response = await this.client.get('/api/sales', { params: query });
    return response.data;
  }

  async getSale(id: string): Promise<Sale> {
    const response = await this.client.get(`/api/sales/${id}`);
    return response.data;
  }

   async deleteSale(id: string): Promise<{ message: string }> {
    const response = await this.client.delete(`/api/sales/${id}`);
    return response.data;
  }

  async getSaleByNumber(saleNumber: string): Promise<Sale> {
    const response = await this.client.get(`/api/sales/number/${saleNumber}`);
    return response.data;
  }

  async refundSale(id: string, reason?: string): Promise<Sale> {
    const response = await this.client.put(`/api/sales/${id}/refund`, { reason });
    return response.data;
  }

  async getSalesReport(query: SalesReportQueryDto): Promise<any> {
    const response = await this.client.get('/api/sales/reports/summary', { params: query });
    return response.data;
  }

  // ==================== INVENTORY - PRODUCTS ====================

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const response = await this.client.post('/api/inventory/products', productData);
    return response.data;
  }

  async updateProduct(id: string, productData: Partial<CreateProductDto>): Promise<Product> {
    const response = await this.client.put(`/api/inventory/products/${id}`, productData);
    return response.data;
  }

  async getProducts(query?: ProductQueryDto): Promise<PaginatedResponse<Product>> {
    const response = await this.client.get('/api/inventory/products', { params: query });
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.client.get(`/api/inventory/products/${id}`);
    return response.data;
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await this.client.delete(`/api/inventory/products/${id}`);
    return response.data;
  }

  async getProductStockSummary(id: string): Promise<any> {
    const response = await this.client.get(`/api/inventory/products/${id}/stock-summary`);
    return response.data;
  }

  // ==================== INVENTORY - BATCHES ====================

  async createBatch(batchData: ProductBatchDto): Promise<any> {
    const response = await this.client.post('/api/inventory/batches', batchData);
    return response.data;
  }

  async getBatches(query?: BatchQueryDto): Promise<PaginatedResponse<any>> {
    const response = await this.client.get('/api/inventory/batches', { params: query });
    return response.data;
  }

  async getExpiringBatches(days: number): Promise<any[]> {
    const response = await this.client.get('/api/inventory/batches/expiring', { params: { days } });
    return response.data;
  }

  async adjustBatchQuantity(id: string, adjustmentData: AdjustBatchQuantityDto): Promise<any> {
    const response = await this.client.post(`/api/inventory/batches/${id}/adjust-quantity`, adjustmentData);
    return response.data;
  }

  // ==================== INVENTORY - ALERTS ====================

  async getInventoryAlerts(query?: { type?: string; severity?: string; resolved?: boolean; page?: number; limit?: number }): Promise<PaginatedResponse<InventoryAlert>> {
    const response = await this.client.get('/api/inventory/alerts', { params: query });
    return response.data;
  }

  async acknowledgeAlert(id: string, data: { userId: string; notes?: string }): Promise<InventoryAlert> {
    const response = await this.client.put(`/api/inventory/alerts/${id}/acknowledge`, data);
    return response.data;
  }

  async resolveAlert(id: string, data: { resolvedBy: string; resolutionNotes: string }): Promise<InventoryAlert> {
    const response = await this.client.put(`/api/inventory/alerts/${id}/resolve`, data);
    return response.data;
  }

  async snoozeAlert(id: string, data: { snoozeUntil: Date; userId: string }): Promise<InventoryAlert> {
    const response = await this.client.post(`/api/inventory/alerts/${id}/snooze`, data);
    return response.data;
  }

   // ==================== INVENTORY - LOCATIONS ====================
   
  async getInventoryLocations(query?: { type?: string; category?: string; active?: boolean; page?: number; limit?: number }): Promise<PaginatedResponse<InventoryLocation>> {
    const response = await this.client.get('/api/inventory/locations', { params: query });
    return response.data;
  }

  async createInventoryLocation(data: InventoryLocationDto): Promise<InventoryLocation> {
    const response = await this.client.post('/api/inventory/locations', data);
    return response.data;
  }

  async updateInventoryLocation(id: string, data: Partial<InventoryLocationDto>): Promise<InventoryLocation> {
    const response = await this.client.put(`/api/inventory/locations/${id}`, data);
    return response.data;
  }

  async deleteInventoryLocation(id: string): Promise<void> {
    await this.client.delete(`/api/inventory/locations/${id}`);
  }

     // ==================== INVENTORY - CONTROLLED SUBSTANCES ====================

  async getControlledSubstanceLogs(query?: ControlledSubstanceQueryDto): Promise<PaginatedResponse<ControlledSubstanceLog>> {
    const response = await this.client.get('/api/inventory/controlled-substances', { params: query });
    return response.data;
  }

  async createControlledSubstanceLog(data: CreateControlledSubstanceLogDto): Promise<ControlledSubstanceLog> {
    const response = await this.client.post('/api/inventory/controlled-substances/log', data);
    return response.data;
  }

  // ==================== INVENTORY - ANALYTICS ====================

  async getStockLevelsReport(): Promise<any> {
    const response = await this.client.get('/api/inventory/analytics/stock-levels');
    return response.data;
  }

  async getExpirationReport(): Promise<any> {
    const response = await this.client.get('/api/inventory/analytics/expiration-report');
    return response.data;
  }

  async getLowStockReport(): Promise<any> {
    const response = await this.client.get('/api/inventory/analytics/low-stock-report');
    return response.data;
  }

  async getInventoryValuation(): Promise<any> {
    const response = await this.client.get('/api/inventory/analytics/inventory-valuation');
    return response.data;
  }

  async reconcileInventory(): Promise<any> {
    const response = await this.client.post('/api/inventory/reconcile');
    return response.data;
  }

  async checkInventoryAlerts(): Promise<{ message: string }> {
    const response = await this.client.post('/api/inventory/check-alerts');
    return response.data;
  }

  // ==================== PATIENTS ====================

  async createPatient(patientData: CreatePatientDto): Promise<Patient> {
    const response = await this.client.post('/api/patients', patientData);
    return response.data;
  }

  async getPatients(query?: PatientQueryDto): Promise<PaginatedResponse<Patient>> {
    const response = await this.client.get('/api/patients', { params: query });
    return response.data;
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const response = await this.client.get(`/api/patients/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getPatient(id: string): Promise<Patient> {
    const response = await this.client.get(`/api/patients/${id}`);
    return response.data;
  }

  async updatePatient(id: string, patientData: Partial<CreatePatientDto>): Promise<Patient> {
    const response = await this.client.put(`/api/patients/${id}`, patientData);
    return response.data;
  }

  // ==================== PRESCRIPTIONS ====================

  async createPrescription(patientId: string, prescriptionData: CreatePrescriptionDto): Promise<Prescription> {
    const response = await this.client.post(`/api/patients/${patientId}/prescriptions`, prescriptionData);
    return response.data;
  }

  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    const response = await this.client.get(`/api/patients/${patientId}/prescriptions`);
    return response.data;
  }

  async verifyPrescription(id: string, verifierId: string): Promise<Prescription> {
    const response = await this.client.put(`/api/patients/prescriptions/${id}/verify`, { verifierId });
    return response.data;
  }

  async dispensePrescription(id: string, dispenseData: DispensePrescriptionDto): Promise<Prescription> {
    const response = await this.client.put(`/api/patients/prescriptions/${id}/dispense`, dispenseData);
    return response.data;
  }

  // ==================== ACCOUNTING ====================

  async createAccount(accountData: CreateAccountDto): Promise<any> {
    const response = await this.client.post('/accounting/accounts', accountData);
    return response.data;
  }

  async getAccounts(): Promise<any[]> {
    const response = await this.client.get('/accounting/accounts');
    return response.data;
  }

  async createTransaction(transactionData: CreateTransactionDto): Promise<any> {
    const response = await this.client.post('/accounting/transactions', transactionData);
    return response.data;
  }

  async postTransaction(id: string): Promise<any> {
    const response = await this.client.patch(`/accounting/transactions/${id}/post`);
    return response.data;
  }

   async createJournalEntry(journalEntryData: any): Promise<any> {
    const response = await this.client.post('/accounting/journal-entries', journalEntryData);
    return response.data;
  }

  async createInvoice(invoiceData: CreateInvoiceDto): Promise<any> {
    const response = await this.client.post('/accounting/invoices', invoiceData);
    return response.data;
  }

  async recordInvoicePayment(id: string, paymentData: { paidAmount: number; paidDate: Date }): Promise<any> {
    const response = await this.client.patch(`/accounting/invoices/${id}/payment`, paymentData);
    return response.data;
  }

  async createExpense(expenseData: CreateExpenseDto): Promise<any> {
    const response = await this.client.post('/accounting/expenses', expenseData);
    return response.data;
  }

  async approveExpense(id: string, approvedBy: string): Promise<any> {
    const response = await this.client.patch(`/accounting/expenses/${id}/approve`, { approvedBy });
    return response.data;
  }

  async getTrialBalance(): Promise<any> {
    const response = await this.client.get('/accounting/reports/trial-balance');
    return response.data;
  }

  async getIncomeStatement(startDate: string, endDate: string): Promise<any> {
    const response = await this.client.get('/accounting/reports/income-statement', {
      params: { startDate, endDate }
    });
    return response.data;
  }

  async getBalanceSheet(asOfDate: string): Promise<any> {
    const response = await this.client.get('/accounting/reports/balance-sheet', {
      params: { asOfDate }
    });
    return response.data;
  }

  // ==================== ANALYTICS ====================

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.client.get('/analytics/dashboard');
    return response.data;
  }

  async getSalesAnalytics(period: string = '30d'): Promise<SalesAnalytics> {
    const response = await this.client.get(`/analytics/sales?period=${period}`);
    return response.data;
  }

  // ==================== SEARCH ====================

  async search(query: string): Promise<any> {
    const response = await this.client.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;