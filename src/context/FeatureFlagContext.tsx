"use client";

/**
 * FeatureFlagContext — legacy public API kept identical, but now sourced
 * 100% from the enterprise `SessionContext`.
 *
 * Rationale:
 *   - The session JWT minted by the backend (`/bff/auth/me`) already carries
 *     plan + features + quotas for the current tenant.
 *   - Keeping a second React Query fetch (`plan-entitlements`) on top of it
 *     would duplicate state, risk divergence, and send an extra round-trip
 *     on every tenant switch.
 *   - By proxying here, every existing consumer of `useFeatureFlags()` /
 *     `isFeatureEnabled()` / `<FeatureGate>` / `<ModuleGuard>` automatically
 *     inherits: JTI revocation, plan-status awareness (trial / grace),
 *     free-tier fallback, session-version invalidation, SSO, etc.
 *
 * Public API unchanged: `useFeatureFlags()` still returns
 *   { features, limits, isFeatureEnabled, loading, refresh }.
 */

import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { toast } from "react-hot-toast";
import { useSession } from "@/context/SessionContext";
import {
  ENTITLEMENT_DENIED_EVENT,
  type EntitlementDeniedDetail,
} from "@/helpers/auth-interceptor";

interface FeatureFlagContextType {
  /** `featureKey -> enabled` flattened from the session snapshot. */
  features: Record<string, boolean>;
  /** `featureKey -> limit` (0 / undefined when no limit). */
  limits: Record<string, number>;
  /** Canonical enabled-check (case-insensitive, plan-aware, free-tier aware). */
  isFeatureEnabled: (featureKey: string) => boolean;
  /** `true` while the very first /me reply has not yet returned. */
  loading: boolean;
  /** Force a fresh /me round-trip. */
  refresh: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(
  undefined,
);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session, loading, hasFeature, refresh } = useSession();

  // --- Project session.features -> legacy `features` / `limits` maps --------
  const { features, limits } = useMemo(() => {
    const f: Record<string, boolean> = {};
    const l: Record<string, number> = {};
    const src = session?.features ?? {};
    for (const [key, entry] of Object.entries(src)) {
      f[key] = !!entry?.enabled;
      if (typeof entry?.limit === "number") l[key] = entry.limit;
    }
    // Free-tier keys must also surface as enabled (no subscription case).
    if (session?.freeTierFeatureKeys?.length) {
      for (const k of session.freeTierFeatureKeys) {
        if (f[k] === undefined) f[k] = true;
      }
    }
    return { features: f, limits: l };
  }, [session]);

  // --- Global 403 ENTITLEMENT_NOT_IN_PLAN toast (preserved) -----------------
  useEffect(() => {
    function onDenied(e: Event) {
      const detail = (e as CustomEvent<EntitlementDeniedDetail>).detail;
      toast.error(
        detail?.message ||
          "Cette fonctionnalité n'est pas incluse dans votre plan.",
        {
          id: `entitlement-denied-${detail?.featureKey ?? "unknown"}`,
          duration: 5000,
        },
      );
    }
    window.addEventListener(ENTITLEMENT_DENIED_EVENT, onDenied);
    return () =>
      window.removeEventListener(ENTITLEMENT_DENIED_EVENT, onDenied);
  }, []);

  // --- Legacy `isFeatureEnabled` semantics:
  //     - optimistic during first load (avoid sidebar flash),
  //     - plan-aware / free-tier aware via the session predicate. ------------
  const isFeatureEnabled = useCallback(
    (featureKey: string): boolean => {
      if (!featureKey) return false;

      if (loading && !session) {
        // First /me not yet resolved: optimistic to avoid empty sidebar.
        return true;
      }

      if (!session) {
        // Authenticated-but-no-session (error state): pessimistic.
        return false;
      }

      return hasFeature(featureKey);
    },
    [session, loading, hasFeature],
  );

  const value = useMemo<FeatureFlagContextType>(
    () => ({
      features,
      limits,
      isFeatureEnabled,
      loading,
      refresh,
    }),
    [features, limits, isFeatureEnabled, loading, refresh],
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagProvider");
  }
  return context;
};
