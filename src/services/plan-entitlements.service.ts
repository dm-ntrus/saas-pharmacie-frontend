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
        return o.data as PlanEntitlementsSummary;
      }
    }
    if ("features" in o) {
      return raw as PlanEntitlementsSummary;
    }
  }
  return {
    billingOrganizationId: "",
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
