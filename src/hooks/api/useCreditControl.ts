"use client";

import { useQuery } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

export function useCreditAccount(partnerId?: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["credit-account", pharmacyId, partnerId],
    queryFn: () => apiService.get(`/pharmacies/${pharmacyId}/credit-control/${partnerId}`),
    enabled: !!pharmacyId && !!partnerId,
  });
}
