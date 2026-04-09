"use client";

import { useMutation } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

export function useImportPartnersCsv() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: (csv: string) => apiService.post(`/pharmacies/${pharmacyId}/b2b-integrations/partners/import-csv`, { csv }),
    onSuccess: () => toast.success("Import CSV termine"),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRegisterWebhook() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: (data: { endpointUrl: string; eventTypes: string[]; secret?: string }) =>
      apiService.post(`/pharmacies/${pharmacyId}/b2b-integrations/webhooks/register`, data),
    onSuccess: () => toast.success("Webhook enregistre"),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useIngestWebhook() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiService.post(`/pharmacies/${pharmacyId}/b2b-integrations/webhooks/ingest`, payload),
    onError: (err: Error) => toast.error(err.message),
  });
}
