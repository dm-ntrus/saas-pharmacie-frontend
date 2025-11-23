import React from 'react';
import { useFeatureFlags } from '@/context/FeatureFlagContext';

interface FeatureGateProps {
  feature: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  fallback = null,
  children
}) => {
  const { isFeatureEnabled, loading } = useFeatureFlags();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!isFeatureEnabled(feature)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};