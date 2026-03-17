"use client";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import type { Plan, PlanFilterParams } from "@/types/billing";

const BASE = "/plans";

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `?${q}` : "";
}

/** Liste des plans (API publique, pas de tenant dans l’URL) */
export function usePlansList(params: PlanFilterParams = {}) {
  const queryParams = {
    limit: params.limit ?? 20,
    offset: params.offset ?? 0,
    includeFeatureFlags: params.includeFeatureFlags ?? true,
    sortBy: params.sortBy ?? "sort_order",
    sortDir: params.sortDir ?? "ASC",
    search: params.search,
    planTier: params.planTier,
    type: params.type,
    interval: params.interval,
    currency: params.currency,
    active: params.active,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    featureKey: params.featureKey,
    featureKeys: params.featureKeys,
  };
  return useQuery<Plan[]>({
    queryKey: ["plans", queryParams],
    queryFn: async () => {
      const q = buildQuery(queryParams);
      const raw = await apiService.get<Plan[] | { items: Plan[]; total: number }>(`${BASE}${q}`);
      return Array.isArray(raw) ? raw : raw?.items ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Détail d’un plan (API publique) */
export function usePlan(planId: string | null | undefined) {
  return useQuery({
    queryKey: ["plan", planId],
    queryFn: () => apiService.get<Plan>(`${BASE}/${encodeURIComponent(planId!)}`),
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });
}

/** Plans offrant une feature donnée (API publique) */
export function usePlansByFeature(featureKey: string | null | undefined) {
  return useQuery({
    queryKey: ["plans-by-feature", featureKey],
    queryFn: () =>
      apiService.get<Plan[]>(
        `${BASE}/by-feature/${encodeURIComponent(featureKey!)}`
      ),
    enabled: !!featureKey,
    staleTime: 5 * 60 * 1000,
  });
}
