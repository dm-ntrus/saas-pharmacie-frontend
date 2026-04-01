"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchTenantProvisioningStatus,
  isValidProvisioningId,
} from "@/services/tenant-registration.service";

export const tenantProvisioningStatusQueryKey = (provisioningId: string) =>
  ["tenant-provisioning-status", provisioningId] as const;

/**
 * Polling du statut d’inscription (complète WebSocket sur la page succès).
 */
export function useTenantProvisioningStatus(provisioningId: string | undefined) {
  return useQuery({
    queryKey: tenantProvisioningStatusQueryKey(provisioningId ?? ""),
    queryFn: () => fetchTenantProvisioningStatus(provisioningId!),
    enabled: !!provisioningId && isValidProvisioningId(provisioningId),
    refetchInterval: (query) => {
      const s = query.state.data?.status;
      if (s === "completed" || s === "failed") return false;
      return 5_000;
    },
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("non trouvée") || msg.includes("404")) return false;
      return true;
    },
    staleTime: 0,
  });
}
