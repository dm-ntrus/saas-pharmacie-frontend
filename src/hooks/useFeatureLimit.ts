import { useState, useEffect } from 'react';
import { useOrganization } from '../context/OrganizationContext';
import { featureFlagService } from '../services/feature-flag.service';

interface FeatureLimit {
  allowed: boolean;
  limit: number;
  usage: number;
  remaining: number;
  percentage: number;
  resetDate?: Date;
}

export function useFeatureLimit(featureKey: string): FeatureLimit | null {
  const { currentOrganization } = useOrganization();
  const [limitInfo, setLimitInfo] = useState<FeatureLimit | null>(null);
  
  useEffect(() => {
    if (currentOrganization) {
      loadLimitInfo();
    }
  }, [currentOrganization, featureKey]);
  
  const loadLimitInfo = async () => {
    if (!currentOrganization) return;
    
    try {
      const data = await featureFlagService.checkFeatureUsage(
        currentOrganization.id,
        featureKey
      );
      
      setLimitInfo({
        ...data,
        percentage: (data.usage / data.limit) * 100,
        resetDate: data.resetDate ? new Date(data.resetDate) : undefined
      });
    } catch (error) {
      console.error('Failed to load feature limit:', error);
    }
  };
  
  return limitInfo;
}