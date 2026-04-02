"use client";

import { useQuery } from "@tanstack/react-query";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";
import type { Plan, PlanFilterParams } from "@/types/billing";

/**
 * Fetches plans from the public catalog (no auth required).
 * Endpoint: GET /plans/public
 */
async function fetchPublicPlans(
  params: PlanFilterParams = {},
): Promise<Plan[]> {
  const base = getApiBaseUrl();
  const qs = new URLSearchParams();

  const defaults: Record<string, string | number | boolean | undefined> = {
    limit: params.limit ?? 20,
    offset: params.offset ?? 0,
    includeFeatureFlags: params.includeFeatureFlags ?? true,
    sortBy: params.sortBy ?? "sort_order",
    sortDir: params.sortDir ?? "ASC",
    active: params.active ?? true,
    search: params.search,
    planTier: params.planTier,
    type: params.type,
    interval: params.interval,
    currency: params.currency,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    featureKey: params.featureKey,
    featureKeys: params.featureKeys,
  };

  for (const [k, v] of Object.entries(defaults)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }

  const url = `${base}/plans/public?${qs.toString()}`;
  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Plans API ${res.status}`);

  const raw = await res.json();
  if (Array.isArray(raw)) return raw;
  if (raw?.items && Array.isArray(raw.items)) return raw.items;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw?.result)) return raw.result;
  return [];
}

export function usePublicPlans(params: PlanFilterParams = {}) {
  return useQuery<Plan[]>({
    queryKey: ["public-plans", params],
    queryFn: () => fetchPublicPlans(params),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export function usePublicPlanDetail(planId: string | null | undefined) {
  return useQuery<Plan>({
    queryKey: ["public-plan", planId],
    queryFn: async () => {
      const base = getApiBaseUrl();
      const res = await fetch(
        `${base}/plans/public/${encodeURIComponent(planId!)}`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error(`Plan API ${res.status}`);
      const raw = await res.json();
      if (raw?.data && typeof raw.data === "object" && !Array.isArray(raw.data)) return raw.data;
      return raw;
    },
    enabled: !!planId,
    staleTime: 10 * 60 * 1000,
  });
}
