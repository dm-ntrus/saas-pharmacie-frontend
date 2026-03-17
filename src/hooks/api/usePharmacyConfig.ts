"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "react-hot-toast";
import type {
  PharmacyConfig,
  CreatePharmacyConfigDto,
  UpdatePharmacyConfigDto,
  PharmacyConfigFindManyParams,
  PharmacyConfigFindManyResult,
} from "@/types/pharmacy";

const BASE = "/pharmacy-config";

function useOrgId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `?${q}` : "";
}

export function usePharmacyConfigList(params: Omit<PharmacyConfigFindManyParams, "organization_id">) {
  const orgId = useOrgId();
  const fullParams = { ...params, organization_id: orgId };
  return useQuery<PharmacyConfigFindManyResult>({
    queryKey: ["pharmacy-config", orgId, fullParams],
    queryFn: () =>
      apiService.get<PharmacyConfigFindManyResult>(`${BASE}${buildQuery(fullParams)}`),
    enabled: !!orgId,
    staleTime: 30_000,
  });
}

export function usePharmacyConfigResolvedContext(tenantId?: string, pharmacyId?: string) {
  const orgId = useOrgId();
  return useQuery<Record<string, unknown>>({
    queryKey: ["pharmacy-config-context", orgId, tenantId, pharmacyId],
    queryFn: () =>
      apiService.get<Record<string, unknown>>(
        `${BASE}/context${buildQuery({
          organization_id: orgId,
          tenant_id: tenantId,
          pharmacy_id: pharmacyId,
        })}`
      ),
    enabled: !!orgId,
    staleTime: 60_000,
  });
}

export function usePharmacyConfigResolve(
  configKey: string,
  tenantId?: string,
  pharmacyId?: string
) {
  const orgId = useOrgId();
  return useQuery({
    queryKey: ["pharmacy-config-resolve", orgId, configKey, tenantId, pharmacyId],
    queryFn: () =>
      apiService.get(`${BASE}/resolve${buildQuery({
        config_key: configKey,
        organization_id: orgId,
        tenant_id: tenantId,
        pharmacy_id: pharmacyId,
      })}`),
    enabled: !!orgId && !!configKey,
  });
}

export function usePharmacyConfigFeature(key: string, tenantId?: string, pharmacyId?: string) {
  const orgId = useOrgId();
  return useQuery({
    queryKey: ["pharmacy-config-feature", orgId, key, tenantId, pharmacyId],
    queryFn: () =>
      apiService.get(
        `${BASE}/feature/${encodeURIComponent(key)}${buildQuery({
          organization_id: orgId,
          tenant_id: tenantId,
          pharmacy_id: pharmacyId,
        })}`
      ),
    enabled: !!orgId && !!key,
  });
}

export function usePharmacyConfigKeys() {
  const orgId = useOrgId();
  return useQuery<{ keys: string[] }>({
    queryKey: ["pharmacy-config-keys", orgId],
    queryFn: () =>
      apiService.get<{ keys: string[] }>(`${BASE}/keys${buildQuery({ organization_id: orgId })}`),
    enabled: !!orgId,
    staleTime: 60_000,
  });
}

export function useCreatePharmacyConfig() {
  const orgId = useOrgId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePharmacyConfigDto) =>
      apiService.post<PharmacyConfig>(BASE, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pharmacy-config", orgId] });
      qc.invalidateQueries({ queryKey: ["pharmacy-config-keys", orgId] });
      qc.invalidateQueries({ queryKey: ["pharmacy-config-context", orgId] });
      toast.success("Configuration créée");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erreur"
      ),
  });
}

export function useUpdatePharmacyConfig() {
  const orgId = useOrgId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePharmacyConfigDto }) =>
      apiService.patch<PharmacyConfig>(`${BASE}/${encodeURIComponent(id)}`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pharmacy-config", orgId] });
      qc.invalidateQueries({ queryKey: ["pharmacy-config-context", orgId] });
      toast.success("Configuration mise à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDeletePharmacyConfig() {
  const orgId = useOrgId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.delete(`${BASE}/${encodeURIComponent(id)}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pharmacy-config", orgId] });
      qc.invalidateQueries({ queryKey: ["pharmacy-config-keys", orgId] });
      qc.invalidateQueries({ queryKey: ["pharmacy-config-context", orgId] });
      toast.success("Configuration supprimée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function usePharmacyConfigBulkImport() {
  const orgId = useOrgId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dtos: CreatePharmacyConfigDto[]) =>
      apiService.post<PharmacyConfig[]>(`${BASE}/bulk-import`, dtos),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pharmacy-config", orgId] });
      qc.invalidateQueries({ queryKey: ["pharmacy-config-keys", orgId] });
      qc.invalidateQueries({ queryKey: ["pharmacy-config-context", orgId] });
      toast.success("Configurations importées");
    },
    onError: () => toast.error("Erreur lors de l'import"),
  });
}

export function usePharmacyConfigReset() {
  const orgId = useOrgId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.patch<PharmacyConfig>(`${BASE}/${encodeURIComponent(id)}/reset`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pharmacy-config", orgId] });
      qc.invalidateQueries({ queryKey: ["pharmacy-config-context", orgId] });
      toast.success("Configuration réinitialisée");
    },
    onError: () => toast.error("Erreur"),
  });
}

/** URL pour télécharger l'export JSON (ouvrir dans un nouvel onglet ou window.location) */
export function getPharmacyConfigExportUrl(orgId: string, category?: string, pharmacyId?: string): string {
  const base = typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_API_URL ?? "";
  const params = new URLSearchParams({ organization_id: orgId });
  if (category) params.set("category", category);
  if (pharmacyId) params.set("pharmacy_id", pharmacyId);
  return `${base}${BASE}/export?${params.toString()}`;
}
