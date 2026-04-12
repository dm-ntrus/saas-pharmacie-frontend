"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

const basePath = (pharmacyId: string) => `/pharmacies/${pharmacyId}/commercial-terms`;

export function usePriceLists() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["price-lists", pharmacyId],
    queryFn: () => apiService.get(`${basePath(pharmacyId)}/price-lists`),
    enabled: !!pharmacyId,
  });
}

export function useCreatePriceList() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.post(`${basePath(pharmacyId)}/price-lists`, data),
    onSuccess: () => {
      toast.success("Price list créée");
      qc.invalidateQueries({ queryKey: ["price-lists", pharmacyId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCreateDiscountRule() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.post(`${basePath(pharmacyId)}/discount-rules`, data),
    onSuccess: () => {
      toast.success("Regle de remise creee");
      qc.invalidateQueries({ queryKey: ["price-lists", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["discount-rules", pharmacyId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDiscountRules() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["discount-rules", pharmacyId],
    queryFn: () => apiService.get(`${basePath(pharmacyId)}/discount-rules`),
    enabled: !!pharmacyId,
  });
}

export function usePricingQuote() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.post(`${basePath(pharmacyId)}/pricing/quote`, data),
    onError: (err: Error) => toast.error(err.message),
  });
}
