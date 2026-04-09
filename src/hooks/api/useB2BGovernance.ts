"use client";

import { useMutation } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

export function useRequestCreditOverride() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.post(`/pharmacies/${pharmacyId}/b2b-governance/credit-override`, data),
    onSuccess: () => toast.success("Demande d'override credit envoyee"),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRequestPriceOverride() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.post(`/pharmacies/${pharmacyId}/b2b-governance/price-override`, data),
    onSuccess: () => toast.success("Demande d'override prix envoyee"),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useApproveOverride() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      apiService.post(`/pharmacies/${pharmacyId}/b2b-governance/approvals/${id}/approve`, { reason }),
    onSuccess: () => toast.success("Override approuve"),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRejectOverride() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      apiService.post(`/pharmacies/${pharmacyId}/b2b-governance/approvals/${id}/reject`, { reason }),
    onSuccess: () => toast.success("Override rejete"),
    onError: (err: Error) => toast.error(err.message),
  });
}
