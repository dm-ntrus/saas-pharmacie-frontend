import { apiService } from "./api.service";

interface Sale {
  id: string;
  saleNumber: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mobile_money' | 'insurance';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  status: 'draft' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface CreateSaleDto {
  customerId?: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
  paymentMethod: string;
  discount?: number;
  notes?: string;
}

class SalesService {
  private getBasePath(orgId: string) {
    return `/api/organizations/${orgId}/sales`;
  }
  
  /**
   * Récupérer toutes les ventes
   */
  async getSales(
    orgId: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      status?: string;
      paymentStatus?: string;
    }
  ): Promise<Sale[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const query = params.toString();
    return apiService.get<Sale[]>(
      `${this.getBasePath(orgId)}${query ? `?${query}` : ''}`
    );
  }
  
  /**
   * Créer une nouvelle vente
   */
  async createSale(orgId: string, data: CreateSaleDto): Promise<Sale> {
    return apiService.post<Sale>(this.getBasePath(orgId), data);
  }
  
  /**
   * Obtenir les statistiques de ventes
   */
  async getSalesStats(
    orgId: string,
    period: 'today' | 'week' | 'month' | 'year'
  ): Promise<{
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    topProducts: Array<{ productId: string; productName: string; quantity: number }>;
  }> {
    return apiService.get(
      `${this.getBasePath(orgId)}/stats?period=${period}`
    );
  }
}

export const salesService = new SalesService();