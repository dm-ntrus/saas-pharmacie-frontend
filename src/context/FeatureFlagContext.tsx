"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOrganization } from './OrganizationContext';
import { featureFlagService } from '@/services/feature-flag.service';

interface FeatureFlagContextType {
  features: Record<string, boolean>;
  isFeatureEnabled: (featureKey: string) => boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentOrganization } = useOrganization();
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (currentOrganization) {
      loadFeatures();
    }
  }, [currentOrganization]);
  
  const loadFeatures = async () => {
    if (!currentOrganization) return;
    
    setLoading(true);
    try {
      const features = await featureFlagService.getTenantFeatures(currentOrganization.id);
      setFeatures(features);
    } catch (error) {
      console.error('Failed to load features:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const isFeatureEnabled = (featureKey: string): boolean => {
    return features[featureKey] || false;
  };
  
  return (
    <FeatureFlagContext.Provider
      value={{
        features,
        isFeatureEnabled,
        loading,
        refresh: loadFeatures
      }}
    >
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
  }
  return context;
};