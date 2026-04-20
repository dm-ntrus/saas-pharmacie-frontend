"use client";

/**
 * Declarative session guards.
 *
 * Wire them around any JSX subtree that should only render for a given
 * feature / plan tier / role / permission in the current session.
 *
 * ```tsx
 * <RequireFeature feature="module.ai_prescriptions">
 *   <AiPrescriptionsCard />
 * </RequireFeature>
 *
 * <RequirePlan min="professional" fallback={<UpgradeCTA />}>
 *   <AdvancedAnalytics />
 * </RequirePlan>
 *
 * <RequireRole role="tenant_admin">
 *   <DangerZoneSettings />
 * </RequireRole>
 * ```
 *
 * All guards:
 *   - Render `loadingFallback` (or nothing) while the first /me is in flight.
 *   - Render `fallback` (or nothing) when access is denied.
 *   - Render `children` when access is granted.
 *
 * They piggy-back on `SessionContext`, so they share the single /me fetch
 * performed by the root `<SessionProvider>` — no extra network traffic.
 */

import React from "react";
import { useSession } from "@/context/SessionContext";
import type { PlanTier } from "@/types/session";

type GuardCommon = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
};

// -- <RequireFeature> -------------------------------------------------------

export interface RequireFeatureProps extends GuardCommon {
  /** Single feature key. */
  feature?: string;
  /** Multiple feature keys. Evaluated against `mode` (default "all"). */
  features?: string[];
  /** "all": every feature must be enabled; "any": at least one. */
  mode?: "all" | "any";
}

export const RequireFeature: React.FC<RequireFeatureProps> = ({
  feature,
  features,
  mode = "all",
  fallback = null,
  loadingFallback = null,
  children,
}) => {
  const { loading, hasFeature, hasAllFeatures, hasAnyFeature } = useSession();
  if (loading) return <>{loadingFallback}</>;

  const keys = features ?? (feature ? [feature] : []);
  if (keys.length === 0) return <>{children}</>;

  const granted =
    mode === "any" ? hasAnyFeature(keys) : hasAllFeatures(keys);

  return granted ? <>{children}</> : <>{fallback}</>;
};

// -- <RequirePlan> ----------------------------------------------------------

export interface RequirePlanProps extends GuardCommon {
  /** Minimum plan tier required to render children. */
  min: PlanTier;
  /** If true, also require the plan to be currently active/usable. */
  requireActive?: boolean;
}

export const RequirePlan: React.FC<RequirePlanProps> = ({
  min,
  requireActive = false,
  fallback = null,
  loadingFallback = null,
  children,
}) => {
  const { loading, hasPlanTier, isPlanActive } = useSession();
  if (loading) return <>{loadingFallback}</>;
  if (!hasPlanTier(min)) return <>{fallback}</>;
  if (requireActive && !isPlanActive) return <>{fallback}</>;
  return <>{children}</>;
};

// -- <RequireRole> ----------------------------------------------------------

export interface RequireRoleProps extends GuardCommon {
  role?: string;
  roles?: string[];
  mode?: "all" | "any";
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  role,
  roles,
  mode = "any",
  fallback = null,
  loadingFallback = null,
  children,
}) => {
  const { loading, hasRole } = useSession();
  if (loading) return <>{loadingFallback}</>;

  const keys = roles ?? (role ? [role] : []);
  if (keys.length === 0) return <>{children}</>;

  const granted =
    mode === "all" ? keys.every((r) => hasRole(r)) : keys.some((r) => hasRole(r));
  return granted ? <>{children}</> : <>{fallback}</>;
};

// -- <RequirePermission> ----------------------------------------------------

export interface RequirePermissionProps extends GuardCommon {
  permission?: string;
  permissions?: string[];
  mode?: "all" | "any";
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  permissions,
  mode = "all",
  fallback = null,
  loadingFallback = null,
  children,
}) => {
  const { loading, hasPermission } = useSession();
  if (loading) return <>{loadingFallback}</>;

  const keys = permissions ?? (permission ? [permission] : []);
  if (keys.length === 0) return <>{children}</>;

  const granted =
    mode === "any"
      ? keys.some((p) => hasPermission(p))
      : keys.every((p) => hasPermission(p));
  return granted ? <>{children}</> : <>{fallback}</>;
};

// -- <RequireAuth> ----------------------------------------------------------

export const RequireAuth: React.FC<GuardCommon> = ({
  fallback = null,
  loadingFallback = null,
  children,
}) => {
  const { loading, isAuthenticated } = useSession();
  if (loading) return <>{loadingFallback}</>;
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};
