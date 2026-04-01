"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { toast } from "react-hot-toast";
import type {
  QualityEvent,
  CAPA,
  QualityDocument,
  QualityMetric,
  TrainingRecord,
  CreateQualityEventDto,
  CreateCAPADto,
  CreateQualityDocumentDto,
  CreateQualityMetricDto,
  CreateTrainingRecordDto,
  QualityDashboardDto,
} from "@/types/quality";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

function basePath(pharmacyId: string) {
  return `/pharmacies/${pharmacyId}/quality`;
}

function buildQuery(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `?${q}` : "";
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export function useQualityDashboard() {
  const pid = usePharmacyId();
  return useQuery<QualityDashboardDto>({
    queryKey: ["quality-dashboard", pid],
    queryFn: () => apiService.get<QualityDashboardDto>(`${basePath(pid)}/dashboard`),
    enabled: !!pid,
    staleTime: 60_000,
  });
}

export function useCheckOverdueCAPAs() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiService.post(`${basePath(pid)}/check-overdue-capas`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      qc.invalidateQueries({ queryKey: ["quality-capas", pid] });
      toast.success("Vérification CAPAs en retard effectuée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCheckDocumentReviews() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiService.post(`${basePath(pid)}/check-document-reviews`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      qc.invalidateQueries({ queryKey: ["quality-documents", pid] });
      toast.success("Vérification révisions documents effectuée");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Events ────────────────────────────────────────────────────────────────

export function useQualityEvents(params?: Record<string, string | number | undefined>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["quality-events", pid, params],
    queryFn: async () => {
      const res = await apiService.get<{ events?: QualityEvent[] }>(`${basePath(pid)}/events${buildQuery(params)}`);
      return Array.isArray(res?.events) ? res.events : (Array.isArray(res) ? res : []);
    },
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useQualityEventById(id: string) {
  const pid = usePharmacyId();
  return useQuery<QualityEvent>({
    queryKey: ["quality-event", pid, id],
    queryFn: () => apiService.get<QualityEvent>(`${basePath(pid)}/events/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateQualityEvent() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateQualityEventDto) =>
      apiService.post<QualityEvent>(`${basePath(pid)}/events`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quality-events", pid] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("Événement qualité créé");
    },
    onError: (err: unknown) =>
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Erreur"),
  });
}

export function useUpdateQualityEvent() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Record<string, unknown> }) =>
      apiService.put<QualityEvent>(`${basePath(pid)}/events/${id}`, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["quality-events", pid] });
      qc.invalidateQueries({ queryKey: ["quality-event", pid, id] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("Événement mis à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDeleteQualityEvent() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`${basePath(pid)}/events/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quality-events", pid] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("Événement supprimé");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── CAPAs ─────────────────────────────────────────────────────────────────

export function useCAPAs(params?: Record<string, string | number | undefined>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["quality-capas", pid, params],
    queryFn: async () => {
      const res = await apiService.get<{ capas?: CAPA[] }>(`${basePath(pid)}/capas${buildQuery(params)}`);
      return Array.isArray(res?.capas) ? res.capas : (Array.isArray(res) ? res : []);
    },
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useCAPAById(id: string) {
  const pid = usePharmacyId();
  return useQuery<CAPA>({
    queryKey: ["quality-capa", pid, id],
    queryFn: () => apiService.get<CAPA>(`${basePath(pid)}/capas/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateCAPA() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCAPADto) =>
      apiService.post<CAPA>(`${basePath(pid)}/capas`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quality-capas", pid] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("CAPA créée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateCAPA() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Record<string, unknown> }) =>
      apiService.put<CAPA>(`${basePath(pid)}/capas/${id}`, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["quality-capas", pid] });
      qc.invalidateQueries({ queryKey: ["quality-capa", pid, id] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("CAPA mise à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Documents ─────────────────────────────────────────────────────────────

export function useQualityDocuments(params?: Record<string, string | number | boolean | undefined>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["quality-documents", pid, params],
    queryFn: async () => {
      const res = await apiService.get<{ documents?: QualityDocument[] }>(`${basePath(pid)}/documents${buildQuery(params)}`);
      return Array.isArray(res?.documents) ? res.documents : (Array.isArray(res) ? res : []);
    },
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useQualityDocumentById(id: string) {
  const pid = usePharmacyId();
  return useQuery<QualityDocument>({
    queryKey: ["quality-document", pid, id],
    queryFn: () => apiService.get<QualityDocument>(`${basePath(pid)}/documents/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateQualityDocument() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateQualityDocumentDto) =>
      apiService.post<QualityDocument>(`${basePath(pid)}/documents`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quality-documents", pid] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("Document créé");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateQualityDocument() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Record<string, unknown> }) =>
      apiService.put<QualityDocument>(`${basePath(pid)}/documents/${id}`, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["quality-documents", pid] });
      qc.invalidateQueries({ queryKey: ["quality-document", pid, id] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("Document mis à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useApproveQualityDocument() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put<QualityDocument>(`${basePath(pid)}/documents/${id}/approve`),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["quality-documents", pid] });
      qc.invalidateQueries({ queryKey: ["quality-document", pid, id] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("Document approuvé");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Metrics ────────────────────────────────────────────────────────────────

export function useQualityMetrics(params?: Record<string, string | number | undefined>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["quality-metrics", pid, params],
    queryFn: async () => {
      const res = await apiService.get<{ metrics?: QualityMetric[] }>(`${basePath(pid)}/metrics${buildQuery(params)}`);
      return Array.isArray(res?.metrics) ? res.metrics : (Array.isArray(res) ? res : []);
    },
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useQualityMetricById(id: string) {
  const pid = usePharmacyId();
  return useQuery<QualityMetric>({
    queryKey: ["quality-metric", pid, id],
    queryFn: () => apiService.get<QualityMetric>(`${basePath(pid)}/metrics/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateQualityMetric() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateQualityMetricDto) =>
      apiService.post<QualityMetric>(`${basePath(pid)}/metrics`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quality-metrics", pid] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("Métrique créée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateQualityMetric() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Record<string, unknown> }) =>
      apiService.put<QualityMetric>(`${basePath(pid)}/metrics/${id}`, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["quality-metrics", pid] });
      qc.invalidateQueries({ queryKey: ["quality-metric", pid, id] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("Métrique mise à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Training ───────────────────────────────────────────────────────────────

export function useTrainingRecords(params?: Record<string, string | number | undefined>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["quality-training", pid, params],
    queryFn: async () => {
      const res = await apiService.get<{ records?: TrainingRecord[] }>(`${basePath(pid)}/training-records${buildQuery(params)}`);
      return Array.isArray(res?.records) ? res.records : (Array.isArray(res) ? res : []);
    },
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useTrainingRecordById(id: string) {
  const pid = usePharmacyId();
  return useQuery<TrainingRecord>({
    queryKey: ["quality-training-record", pid, id],
    queryFn: () => apiService.get<TrainingRecord>(`${basePath(pid)}/training-records/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateTrainingRecord() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTrainingRecordDto) =>
      apiService.post<TrainingRecord>(`${basePath(pid)}/training-records`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quality-training", pid] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("Formation enregistrée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateTrainingRecord() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Record<string, unknown> }) =>
      apiService.put<TrainingRecord>(`${basePath(pid)}/training-records/${id}`, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["quality-training", pid] });
      qc.invalidateQueries({ queryKey: ["quality-training-record", pid, id] });
      qc.invalidateQueries({ queryKey: ["quality-dashboard", pid] });
      toast.success("Formation mise à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}
