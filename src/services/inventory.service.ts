import { apiService } from "./api.service";

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  isActive: boolean;
  requiresPrescription: boolean;
}

interface CreateProductDto {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string;
  unitPrice: number;
  costPrice?: number;
  reorderLevel?: number;
  requiresPrescription?: boolean;
}

class InventoryService {
  private getBasePath(orgId: string) {
    return `/api/organizations/${orgId}/inventory`;
  }
  
  /**
   * Récupérer tous les produits
   */
  async getProducts(orgId: string): Promise<Product[]> {
    return apiService.get<Product[]>(`${this.getBasePath(orgId)}/products`);
  }
  
  /**
   * Récupérer un produit par ID
   */
  async getProduct(orgId: string, productId: string): Promise<Product> {
    return apiService.get<Product>(`${this.getBasePath(orgId)}/products/${productId}`);
  }
  
  /**
   * Créer un nouveau produit
   */
  async createProduct(orgId: string, data: CreateProductDto): Promise<Product> {
    return apiService.post<Product>(`${this.getBasePath(orgId)}/products`, data);
  }
  
  /**
   * Mettre à jour un produit
   */
  async updateProduct(
    orgId: string,
    productId: string,
    data: Partial<CreateProductDto>
  ): Promise<Product> {
    return apiService.put<Product>(
      `${this.getBasePath(orgId)}/products/${productId}`,
      data
    );
  }
  
  /**
   * Supprimer un produit
   */
  async deleteProduct(orgId: string, productId: string): Promise<void> {
    return apiService.delete(`${this.getBasePath(orgId)}/products/${productId}`);
  }
  
  /**
   * Rechercher des produits
   */
  async searchProducts(
    orgId: string,
    query: string,
    filters?: {
      category?: string;
      inStock?: boolean;
      requiresPrescription?: boolean;
    }
  ): Promise<Product[]> {
    const params = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    
    return apiService.get<Product[]>(
      `${this.getBasePath(orgId)}/products/search?${params.toString()}`
    );
  }
  
  /**
   * Obtenir les produits en rupture de stock
   */
  async getLowStockProducts(orgId: string): Promise<Product[]> {
    return apiService.get<Product[]>(`${this.getBasePath(orgId)}/products/low-stock`);
  }
}

export const inventoryService = new InventoryService();