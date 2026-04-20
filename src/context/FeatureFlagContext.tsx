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

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: planEntitlementsQueryKey(pharmacyId),
    queryFn: () => fetchPlanEntitlementsSummary(pharmacyId!),
    enabled: !!pharmacyId,
    staleTime: 30_000,
    retry: (failureCount, error: any) => {
      // Ne pas retry sur 404 (pas d'abonnement) ou 403 (pas autorisé)
      const status = error?.response?.status;
      if (status === 404 || status === 403) {
        return false;
      }
      // Retry max 2 fois sur erreurs réseau/serveur (5xx)
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  const features = data?.features ?? {};
  const limits = data?.limits ?? {};
  const loading = !!pharmacyId && (isLoading || isFetching);

  // Gestion d'erreur explicite
  useEffect(() => {
    if (error) {
      const status = (error as any)?.response?.status;

      if (status === 404) {
        // Pas d'abonnement actif - état normal pour free tier
        console.warn("No active subscription found for pharmacy");
        // Pas de toast, c'est un état valide
      } else if (status === 403) {
        // Accès refusé - problème de permissions
        toast.error("Accès refusé aux informations d'abonnement", {
          id: "entitlement-403",
          duration: 5000,
        });
      } else if (status && status >= 500) {
        // Erreur serveur
        toast.error("Erreur serveur lors du chargement des fonctionnalités", {
          id: "entitlement-5xx",
          duration: 5000,
        });
      } else if (error) {
        // Autre erreur (réseau, timeout, etc.)
        toast.error("Erreur lors du chargement des fonctionnalités", {
          id: "entitlement-error",
          duration: 5000,
        });
      }
    }
  }, [error]);

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
      
      // Distinguer loading initial vs erreur
      if (loading && Object.keys(features).length === 0) {
        // Premier chargement: optimiste (évite sidebar vide)
        return true;
      }

      if (error) {
        const status = (error as any)?.response?.status;
        if (status === 404) {
          // Pas d'abonnement: mode free tier (features de base uniquement)
          const freeTierFeatures = [
            "module.dashboard",
            "module.settings",
            "module.sales",
            "module.inventory",
            "module.patients",
            "module.prescriptions",
            "module.notifications",
          ];
          return freeTierFeatures.includes(featureKey.toLowerCase());
        }
        // Autre erreur: pessimiste (sécurité)
        return false;
      }

      // Vérification normale
      if (features[featureKey] !== undefined) return !!features[featureKey];
      const lower = featureKey.toLowerCase();
      if (features[lower] !== undefined) return !!features[lower];
      return false;
    },
    [features, loading, error],
  );

  const refresh = useCallback(async () => {
    if (!pharmacyId) return;
    await queryClient.invalidateQueries({
      queryKey: planEntitlementsQueryKey(pharmacyId),
    });
  }, [pharmacyId, queryClient]);

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
