"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "./OrganizationContext";
import {
  fetchPlanEntitlementsSummary,
  planEntitlementsQueryKey,
} from "@/services/plan-entitlements.service";
import { setCookie } from "@/utils/cookies";
import {
  ENTITLEMENT_DENIED_EVENT,
  type EntitlementDeniedDetail,
} from "@/helpers/auth-interceptor";
import { toast } from "react-hot-toast";

interface FeatureFlagContextType {
  features: Record<string, boolean>;
  limits: Record<string, number>;
  isFeatureEnabled: (featureKey: string) => boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(
  undefined,
);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentOrganization } = useOrganization();
  const pharmacyId = currentOrganization?.id;
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: planEntitlementsQueryKey(pharmacyId),
    queryFn: () => fetchPlanEntitlementsSummary(pharmacyId!),
    enabled: !!pharmacyId,
    staleTime: 30_000,
    retry: 1,
  });

  const features = data?.features ?? {};
  const limits = data?.limits ?? {};

  // Sync entitled module keys to a cookie for Edge middleware consumption
  useEffect(() => {
    if (!data?.features) return;
    const enabledKeys = Object.entries(data.features)
      .filter(([, v]) => v)
      .map(([k]) => k);
    setCookie("entitled_modules", enabledKeys.join(","), 1);
  }, [data?.features]);

  // Global listener for backend 403 ENTITLEMENT_NOT_IN_PLAN responses
  useEffect(() => {
    function onDenied(e: Event) {
      const detail = (e as CustomEvent<EntitlementDeniedDetail>).detail;
      toast.error(
        detail.message ||
          "Cette fonctionnalité n'est pas incluse dans votre plan.",
        { id: `entitlement-denied-${detail.featureKey}`, duration: 5000 },
      );
    }
    window.addEventListener(ENTITLEMENT_DENIED_EVENT, onDenied);
    return () =>
      window.removeEventListener(ENTITLEMENT_DENIED_EVENT, onDenied);
  }, []);

  const isFeatureEnabled = useCallback(
    (featureKey: string): boolean => {
      if (!featureKey) return false;
      if (features[featureKey] !== undefined) return !!features[featureKey];
      const lower = featureKey.toLowerCase();
      if (features[lower] !== undefined) return !!features[lower];
      return false;
    },
    [features],
  );

  const refresh = useCallback(async () => {
    if (!pharmacyId) return;
    await queryClient.invalidateQueries({
      queryKey: planEntitlementsQueryKey(pharmacyId),
    });
  }, [pharmacyId, queryClient]);

  const loading = !!pharmacyId && (isLoading || isFetching);

  const value = useMemo(
    () => ({
      features,
      limits,
      isFeatureEnabled,
      loading,
      refresh,
    }),
    [features, limits, isFeatureEnabled, loading, refresh],
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagProvider");
  }
  return context;
};
