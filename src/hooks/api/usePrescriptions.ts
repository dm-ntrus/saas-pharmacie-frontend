"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { toast } from "react-hot-toast";
import type { Prescription, PrescriptionItem, CreatePrescriptionDto, CreatePrescriptionItemDto } from "@/types/prescriptions";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

function basePath(pharmacyId: string) {
  return `/pharmacies/${pharmacyId}/prescriptions`;
}

function advancedPath(pharmacyId: string) {
  return `${basePath(pharmacyId)}/advanced`;
}

export function usePrescriptions(status?: string) {
  const pid = usePharmacyId();
  return useQuery<Prescription[]>({
    queryKey: ["prescriptions", pid, status],
    queryFn: () =>
      apiService.get<Prescription[]>(
        status ? `${basePath(pid)}?status=${status}` : basePath(pid)
      ),
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function usePrescriptionById(id: string) {
  const pid = usePharmacyId();
  return useQuery<Prescription>({
    queryKey: ["prescription", pid, id],
    queryFn: () => apiService.get<Prescription>(`${basePath(pid)}/${id}`),
    enabled: !!pid && !!id,
  });
}

export function usePrescriptionStats() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["prescription-stats", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/stats`),
    enabled: !!pid,
  });
}

export function useControlledSubstanceLogs(filters?: {
  productId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const pid = usePharmacyId();
  const params = new URLSearchParams();
  if (filters?.productId) params.set("productId", filters.productId);
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);
  const query = params.toString();
  return useQuery({
    queryKey: ["controlled-substance-logs", pid, query],
    queryFn: () =>
      apiService.get(
        query ? `${basePath(pid)}/controlled-substances?${query}` : `${basePath(pid)}/controlled-substances`
      ),
    enabled: !!pid,
  });
}

export function usePrescriptionsByPatient(patientId: string, status?: string) {
  const pid = usePharmacyId();
  return useQuery<Prescription[]>({
    queryKey: ["prescriptions-by-patient", pid, patientId, status],
    queryFn: () =>
      apiService.get<Prescription[]>(
        status
          ? `${basePath(pid)}/patient/${patientId}?status=${status}`
          : `${basePath(pid)}/patient/${patientId}`
      ),
    enabled: !!pid && !!patientId,
  });
}

export function usePrescriptionItems(prescriptionId: string) {
  const pid = usePharmacyId();
  return useQuery<PrescriptionItem[]>({
    queryKey: ["prescription-items", pid, prescriptionId],
    queryFn: () =>
      apiService.get<PrescriptionItem[]>(`${basePath(pid)}/${prescriptionId}/items`),
    enabled: !!pid && !!prescriptionId,
  });
}

export function usePrescriptionInteractions(prescriptionId: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["prescription-interactions", pid, prescriptionId],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/${prescriptionId}/interactions`),
    enabled: !!pid && !!prescriptionId,
  });
}

export function useCreatePrescription() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePrescriptionDto) =>
      apiService.post<Prescription>(basePath(pid), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prescriptions", pid] });
      toast.success("Ordonnance créée");
    },
    onError: (err: unknown) =>
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Erreur"),
  });
}

export function useUpdatePrescriptionStatus() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiService.put<Prescription>(`${basePath(pid)}/${id}/status`, { status }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["prescriptions", pid] });
      qc.invalidateQueries({ queryKey: ["prescription", pid, id] });
      toast.success("Statut mis à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useAddPrescriptionItem() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      prescriptionId,
      data,
    }: {
      prescriptionId: string;
      data: CreatePrescriptionItemDto;
    }) =>
      apiService.post<PrescriptionItem>(
        `${basePath(pid)}/${prescriptionId}/items`,
        data
      ),
    onSuccess: (_, { prescriptionId }) => {
      qc.invalidateQueries({ queryKey: ["prescription-items", pid, prescriptionId] });
      qc.invalidateQueries({ queryKey: ["prescription", pid, prescriptionId] });
      toast.success("Ligne ajoutée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDispensePrescriptionItem() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      prescriptionId,
      itemId,
      quantityDispensed,
      batchId,
    }: {
      prescriptionId: string;
      itemId: string;
      quantityDispensed: string;
      batchId?: string;
    }) =>
      apiService.put(
        `${basePath(pid)}/${prescriptionId}/items/${itemId}/dispense`,
        { quantityDispensed, batchId }
      ),
    onSuccess: (_, { prescriptionId }) => {
      qc.invalidateQueries({ queryKey: ["prescription-items", pid, prescriptionId] });
      qc.invalidateQueries({ queryKey: ["prescription", pid, prescriptionId] });
      qc.invalidateQueries({ queryKey: ["prescriptions", pid] });
      toast.success("Ligne dispensée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useVerifyPrescription() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      apiService.put<Prescription>(`${basePath(pid)}/${id}/verify`, { notes }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["prescriptions", pid] });
      qc.invalidateQueries({ queryKey: ["prescription", pid, id] });
      toast.success("Ordonnance vérifiée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useRefillPrescription() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post<Prescription>(`${basePath(pid)}/${id}/refill`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prescriptions", pid] });
      toast.success("Renouvellement demandé");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function usePrescriptionLabel() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["prescription-label", pid],
    queryFn: () => apiService.get(`${basePath(pid)}/label`),
    enabled: false,
  });
}

export function useGetPrescriptionLabel(prescriptionId: string, itemId?: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["prescription-label", pid, prescriptionId, itemId],
    queryFn: () =>
      apiService.get<{ labelHtml: string; labelText: string; barcodeData: string }>(
        itemId
          ? `${basePath(pid)}/${prescriptionId}/label?itemId=${itemId}`
          : `${basePath(pid)}/${prescriptionId}/label`
      ),
    enabled: !!pid && !!prescriptionId,
  });
}

export function useCancelPrescription() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiService.post<Prescription>(`${basePath(pid)}/${id}/cancel`, { reason }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["prescriptions", pid] });
      qc.invalidateQueries({ queryKey: ["prescription", pid, id] });
      toast.success("Ordonnance annulée");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Advanced (prescriptions/advanced) ─────────────────────────────────────

export function useEndOfTreatmentAlerts() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["prescription-alerts-end-of-treatment", pid],
    queryFn: () =>
      apiService.get(`${advancedPath(pid)}/alerts/end-of-treatment`),
    enabled: !!pid,
  });
}

export function usePatientAlerts(patientId: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["prescription-alerts-patient", pid, patientId],
    queryFn: () =>
      apiService.get(`${advancedPath(pid)}/alerts/patient/${patientId}`),
    enabled: !!pid && !!patientId,
  });
}
