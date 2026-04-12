/**
 * @deprecated Use `FeatureFlagContext` (`useFeatureFlags()`) and
 * `plan-entitlements.service.ts` instead. This service used a legacy
 * endpoint (`/api/organizations/:id/features/...`) that is no longer
 * the canonical path for entitlement checks. Kept temporarily for
 * backward compatibility with `useFeatureLimit`; will be removed in
 * next major cleanup.
 */

import { apiClient } from "@/helpers/auth-interceptor";

interface FeatureCheckResponse {
  feature: string;
  enabled: boolean;
  limit?: number;
  usage?: number;
  remaining?: number;
  config?: Record<string, unknown>;
}

class FeatureFlagService {
  async isFeatureEnabled(
    organizationId: string,
    featureKey: string,
  ): Promise<boolean> {
    try {
      const { data } = await apiClient.get<FeatureCheckResponse>(
        `/pharmacies/${organizationId}/plan-entitlements/check/${featureKey}`,
      );
      return data?.enabled ?? false;
    } catch {
      return false;
    }
  }

  async getTenantFeatures(
    organizationId: string,
  ): Promise<Record<string, boolean>> {
    try {
      const { data } = await apiClient.get<{ features: Record<string, boolean> }>(
        `/pharmacies/${organizationId}/plan-entitlements`,
      );
      return data?.features ?? {};
    } catch {
      return {};
    }
  }

  async checkFeatureUsage(
    organizationId: string,
    featureKey: string,
  ): Promise<{
    allowed: boolean;
    limit: number;
    usage: number;
    remaining: number;
    resetDate?: string;
  }> {
    try {
      const { data } = await apiClient.get(
        `/pharmacies/${organizationId}/plan-entitlements/usage/${featureKey}`,
      );
      return data as any;
    } catch {
      return { allowed: false, limit: 0, usage: 0, remaining: 0 };
    }
  }
}

export const featureFlagService = new FeatureFlagService();
