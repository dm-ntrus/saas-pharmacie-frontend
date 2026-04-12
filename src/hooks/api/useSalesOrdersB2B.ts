"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

const basePath = (pharmacyId: string) => `/pharmacies/${pharmacyId}/sales-orders-b2b`;

export function useSalesOrdersB2B() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-orders-b2b", pharmacyId],
    queryFn: () => apiService.get(basePath(pharmacyId)),
    enabled: !!pharmacyId,
  });
}

export function useSalesOrderB2B(id?: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-order-b2b", pharmacyId, id],
    queryFn: () => apiService.get(`${basePath(pharmacyId)}/${id}`),
    enabled: !!pharmacyId && !!id,
  });
}

export function useCreateSalesOrderB2B() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.post(basePath(pharmacyId), data),
    onSuccess: () => {
      toast.success("Commande B2B creee");
      qc.invalidateQueries({ queryKey: ["sales-orders-b2b", pharmacyId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useTransitionSalesOrderB2B() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      apiService.post(`${basePath(pharmacyId)}/${id}/transition`, { status, reason }),
    onSuccess: (_res, vars) => {
      toast.success("Statut de commande mis a jour");
      qc.invalidateQueries({ queryKey: ["sales-orders-b2b", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["sales-order-b2b", pharmacyId, vars.id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
