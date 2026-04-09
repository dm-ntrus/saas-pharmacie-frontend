"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

const basePath = (pharmacyId: string) => `/pharmacies/${pharmacyId}/partners`;

export function usePartners(params?: Record<string, unknown>) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["partners", pharmacyId, params ?? {}],
    queryFn: () => apiService.get(basePath(pharmacyId), { params }),
    enabled: !!pharmacyId,
  });
}

export function usePartner(id?: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["partner", pharmacyId, id],
    queryFn: () => apiService.get(`${basePath(pharmacyId)}/${id}`),
    enabled: !!pharmacyId && !!id,
  });
}

export function useCreatePartner() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.post(basePath(pharmacyId), data),
    onSuccess: () => {
      toast.success("Partenaire cree");
      qc.invalidateQueries({ queryKey: ["partners", pharmacyId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdatePartner() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.patch(`${basePath(pharmacyId)}/${id}`, data),
    onSuccess: (_res, vars) => {
      toast.success("Partenaire mis a jour");
      qc.invalidateQueries({ queryKey: ["partners", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["partner", pharmacyId, vars.id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function usePartnerCreditCheck() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: ({ partnerId, data }: { partnerId: string; data: Record<string, unknown> }) =>
      apiService.post(`${basePath(pharmacyId)}/${partnerId}/credit-check`, data),
    onError: (err: Error) => toast.error(err.message),
  });
}
