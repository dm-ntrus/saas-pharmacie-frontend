"use client";

import { useQuery } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

export function useB2BDashboard() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["b2b-dashboard", pharmacyId],
    queryFn: () => apiService.get(`/pharmacies/${pharmacyId}/b2b-dashboard`),
    enabled: !!pharmacyId,
    staleTime: 30_000,
  });
}
