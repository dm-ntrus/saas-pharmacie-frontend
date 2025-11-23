import { tokenService } from "./token.service";

interface FeatureCheckResponse {
  feature: string;
  enabled: boolean;
  limit?: number;
  usage?: number;
  remaining?: number;
  config?: Record<string, any>;
}

class FeatureFlagService {
  private baseUrl = '/api/organizations';
  
  /**
   * Vérifier si une feature est activée
   */
  async isFeatureEnabled(
    organizationId: string,
    featureKey: string
  ): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/${organizationId}/features/${featureKey}/check`,
      {
        headers: {
          'Authorization': `Bearer ${tokenService.getAccessToken()}`,
          'X-Organization-ID': organizationId
        }
      }
    );
    
    if (!response.ok) {
      return false;
    }
    
    const data: FeatureCheckResponse = await response.json();
    return data.enabled;
  }
  
  /**
   * Obtenir toutes les features du tenant
   */
  async getTenantFeatures(organizationId: string): Promise<Record<string, boolean>> {
    const response = await fetch(
      `${this.baseUrl}/${organizationId}/features`,
      {
        headers: {
          'Authorization': `Bearer ${tokenService.getAccessToken()}`,
          'X-Organization-ID': organizationId
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch features');
    }
    
    return response.json();
  }
  
  /**
   * Vérifier l'usage d'une feature quantitative
   */
  async checkFeatureUsage(
    organizationId: string,
    featureKey: string
  ): Promise<{
    allowed: boolean;
    limit: number;
    usage: number;
    remaining: number;
    resetDate?: string;
  }> {
    const response = await fetch(
      `${this.baseUrl}/${organizationId}/features/${featureKey}/usage`,
      {
        headers: {
          'Authorization': `Bearer ${tokenService.getAccessToken()}`,
          'X-Organization-ID': organizationId
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to check feature usage');
    }
    
    return response.json();
  }
}

export const featureFlagService = new FeatureFlagService();