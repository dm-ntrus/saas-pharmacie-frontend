/**
 * Session contract — MIRRORS the backend `SessionSnapshot` defined in
 * `saas-pharmacie-backend/src/auth/session/types/session-claims.types.ts`.
 *
 * Single source of truth for everything the FE needs to render gated UI:
 *   identity + tenant + plan + features + quotas + free-tier fallback.
 *
 * Bump `SESSION_CLAIMS_VERSION` here in lockstep with the backend whenever
 * the shape changes — the AuthContext drops sessions whose `v` is older.
 */

export const SESSION_CLAIMS_VERSION = 1 as const;

export type PlanTier =
  | "free"
  | "starter"
  | "professional"
  | "enterprise"
  | "custom";

export type SubscriptionStatus =
  | "active"
  | "trial"
  | "past_due"
  | "cancelled"
  | "expired"
  | "incomplete"
  | "paused"
  | "unknown";

export const PLAN_TIER_RANK: Record<PlanTier, number> = {
  free: 0,
  starter: 1,
  professional: 2,
  enterprise: 3,
  custom: 4,
};

export interface SessionPlan {
  subscriptionId?: string;
  planId?: string;
  planKey?: string;
  tier: PlanTier;
  status: SubscriptionStatus;
  currentPeriodEnd?: string;
  trialEndsAt?: string;
  cancelAtPeriodEnd?: boolean;
  inGracePeriod?: boolean;
  graceDaysRemaining?: number;
}

export interface SessionFeature {
  enabled: boolean;
  limit?: number;
  config?: Record<string, unknown>;
  source?: "plan" | "override" | "default";
}

export interface SessionTenant {
  id: string;
  name?: string;
  slug?: string;
  billingOrgId?: string;
  localization?: {
    currency?: string;
    language?: string;
    timezone?: string;
    dateFormat?: string;
  };
}

export interface SessionOrganization {
  id: string;
  name?: string;
  slug?: string;
  tenantId?: string;
  roles: string[];
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  roles: string[];
  permissions: string[];
  userType: "system" | "tenant" | "patient" | "public" | string;
  isPatient?: boolean;
}

export interface SessionQuotas {
  maxUsers?: number;
  maxStorageGb?: number;
  maxApiCallsPerMonth?: number;
  maxConcurrentSessions?: number;
  maxPharmacies?: number;
  [key: string]: number | undefined;
}

export interface SessionSnapshot {
  user: SessionUser;
  tenant: SessionTenant | null;
  organizations: SessionOrganization[];
  activeOrganizationId?: string;
  activeOrganizationSlug?: string;
  plan: SessionPlan;
  features: Record<string, SessionFeature>;
  quotas: SessionQuotas;
  enabledFeatureKeys: string[];
  freeTierFeatureKeys: string[];
  catalogKeys: readonly string[];
  v: typeof SESSION_CLAIMS_VERSION;
}

/**
 * Body returned by `GET /bff/auth/me`.
 * Backward-compatible: still exposes the legacy `user` and `tenant` top-level
 * fields, plus the new `session` superset.
 */
export interface MeResponseBody {
  user: {
    id: string;
    email: string;
    keycloakId?: string;
    roles: string[];
    permissions?: string[];
    tenantId?: string | null;
    organizationId?: string | null;
    keycloakOrganizations?: Array<{
      id: string;
      name?: string;
      roles?: string[];
      attributes?: { tenant_id?: string[]; subdomain?: string[] };
    }>;
  } | null;
  tenant: {
    id: string;
    localization: {
      currency?: string;
      timezone?: string;
      language?: string;
      dateFormat?: string;
    };
  } | null;
  session: SessionSnapshot | null;
  sessionExpiresInMs: number;
  tokenExpiresInMs: number | null;
  sid?: string;
  assembledAt?: string;
}

/**
 * Helper: returns whether the active plan is at least the requested tier.
 * `custom` plans always satisfy any requirement.
 */
export function planSatisfies(
  current: PlanTier | undefined | null,
  required: PlanTier,
): boolean {
  if (!current) return false;
  if (current === "custom") return true;
  return (PLAN_TIER_RANK[current] ?? 0) >= (PLAN_TIER_RANK[required] ?? 0);
}

/**
 * Helper: returns whether the plan is currently usable (active/trial/grace).
 */
export function planUsable(plan: SessionPlan | undefined | null): boolean {
  if (!plan) return false;
  if (plan.status === "active" || plan.status === "trial") return true;
  if (plan.status === "past_due" && plan.inGracePeriod) return true;
  return false;
}

/**
 * Helper: read a feature flag from the snapshot, with safe fallback rules:
 *  - `system` users always pass.
 *  - When no session is loaded yet, returns `null` (caller decides UX).
 *  - When the snapshot has no subscription, falls back to `freeTierFeatureKeys`.
 */
export function evaluateFeature(
  session: SessionSnapshot | null | undefined,
  featureKey: string,
): boolean | null {
  if (!session) return null;
  if (session.user?.userType === "system") return true;

  const lc = featureKey.toLowerCase();
  const direct = session.features?.[lc] ?? session.features?.[featureKey];
  if (direct) return !!direct.enabled;

  if (session.freeTierFeatureKeys?.includes(lc)) return true;
  return false;
}
