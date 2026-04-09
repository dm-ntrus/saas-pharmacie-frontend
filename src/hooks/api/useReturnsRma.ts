"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

export function useCreateReturnAuthorization() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`/pharmacies/${pharmacyId}/returns-rma/authorizations`, data),
    onSuccess: () => {
      toast.success("Demande de retour creee");
      qc.invalidateQueries({ queryKey: ["returns-rma", pharmacyId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useReturnAuthorizations() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["returns-rma", pharmacyId],
    queryFn: () => apiService.get(`/pharmacies/${pharmacyId}/returns-rma/authorizations`),
    enabled: !!pharmacyId,
  });
}

export function useSetReturnDisposition() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.post(`/pharmacies/${pharmacyId}/returns-rma/${id}/disposition`, data),
    onSuccess: () => toast.success("Disposition retour enregistree"),
    onError: (err: Error) => toast.error(err.message),
  });
}
