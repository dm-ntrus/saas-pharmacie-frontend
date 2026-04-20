import type { QueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import type { PlanEntitlementsSummary } from "@/types/plan-entitlements";

export function planEntitlementsQueryKey(pharmacyId: string | undefined) {
  return ["plan-entitlements", pharmacyId ?? ""] as const;
}

function unwrapPlanEntitlements(raw: unknown, pharmacyId: string): PlanEntitlementsSummary {
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (o.data && typeof o.data === "object") {
      const d = o.data as Record<string, unknown>;
      if ("features" in d) {
        return normalizeResponse(d, pharmacyId);
      }
    }
    if ("features" in o) {
      return normalizeResponse(o, pharmacyId);
    }
  }
  return createEmptySummary(pharmacyId);
}

function normalizeResponse(o: Record<string, unknown>, pharmacyId: string): PlanEntitlementsSummary {
  const tenantId = (o.tenantId as string | undefined) || "";

  return {
    tenantId: tenantId,
    pharmacyContextId: (o.pharmacyContextId as string) || pharmacyId,
    features: (o.features as Record<string, boolean>) || {},
    limits: (o.limits as Record<string, number>) || {},
    catalogKeys: (o.catalogKeys as readonly string[]) || [],
    subscriptionId: o.subscriptionId as string | undefined,
    planId: o.planId as string | undefined,
    reason: o.reason as string | undefined,
  };
}

function createEmptySummary(pharmacyId: string): PlanEntitlementsSummary {
  return {
    tenantId: "",
    pharmacyContextId: pharmacyId,
    features: {},
    limits: {},
    catalogKeys: [],
  };
}

export async function fetchPlanEntitlementsSummary(
  pharmacyId: string,
): Promise<PlanEntitlementsSummary> {
  const raw = await apiService.get<unknown>(
    `/pharmacies/${encodeURIComponent(pharmacyId)}/plan-entitlements`,
  );
  return unwrapPlanEntitlements(raw, pharmacyId);
}

export function invalidatePlanEntitlementsQueries(
  qc: QueryClient,
  pharmacyId: string | undefined,
): void {
  if (pharmacyId) {
    void qc.invalidateQueries({ queryKey: planEntitlementsQueryKey(pharmacyId) });
  }
}
