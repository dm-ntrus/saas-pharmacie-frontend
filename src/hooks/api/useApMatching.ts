"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

const basePath = (pharmacyId: string) => `/pharmacies/${pharmacyId}/ap-matching/three-way`;

export function useApThreeWayMatches() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["ap-three-way", pharmacyId],
    queryFn: () => apiService.get(basePath(pharmacyId)),
    enabled: !!pharmacyId,
  });
}

export function useCreateApThreeWayMatch() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.post(basePath(pharmacyId), data),
    onSuccess: () => {
      toast.success("Controle AP enregistre");
      qc.invalidateQueries({ queryKey: ["ap-three-way", pharmacyId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
