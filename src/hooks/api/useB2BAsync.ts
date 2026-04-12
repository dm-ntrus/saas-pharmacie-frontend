"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

export function useSubmitB2BJob() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: (data: { jobType: string; idempotencyKey: string; payload?: Record<string, unknown> }) =>
      apiService.post(`/pharmacies/${pharmacyId}/b2b-async/jobs`, data),
    onSuccess: () => toast.success("Job asynchrone lance"),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useB2BJob(jobId?: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["b2b-job", pharmacyId, jobId],
    queryFn: () => apiService.get(`/pharmacies/${pharmacyId}/b2b-async/jobs/${jobId}`),
    enabled: !!pharmacyId && !!jobId,
    refetchInterval: (query) => {
      const status = String((query.state.data as { status?: string } | undefined)?.status ?? "").toLowerCase();
      if (status === "done" || status === "failed" || status === "cancelled") return false;
      return 1500;
    },
  });
}
