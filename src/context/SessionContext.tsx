"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";
import { getCookie, removeCookie } from "@/utils/cookies";
import {
  evaluateFeature,
  planSatisfies,
  planUsable,
  type MeResponseBody,
  type PlanTier,
  type SessionFeature,
  type SessionPlan,
  type SessionQuotas,
  type SessionSnapshot,
  type SessionTenant,
  type SessionUser,
} from "@/types/session";

/**
 * SessionContext — single source of truth for identity + tenant + plan +
 * features + quotas. Backed by `GET /bff/auth/me`.
 *
 *  - Loaded eagerly on mount.
 *  - Re-fetched on a proactive timer (8% before session expiry).
 *  - Forced re-fetch is exposed via `refresh()`.
 *  - Inactivity logout is preserved.
 *
 * Replaces the legacy AuthContext for new code. AuthContext stays as a thin
 * adapter so existing components (`useAuth`) keep working without refactor.
 */

const INACTIVITY_TIMEOUT_MS =
  Number(process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT_MS) || 30 * 60 * 1000;

const REFRESH_BUFFER_MS =
  Number(process.env.NEXT_PUBLIC_TOKEN_REFRESH_BUFFER_MS) || 60 * 1000;

export interface SessionContextValue {
  /** Full enriched snapshot (`null` until first /me reply or when logged out). */
  session: SessionSnapshot | null;
  /** Convenience: identity. */
  user: SessionUser | null;
  /** Convenience: tenant. */
  tenant: SessionTenant | null;
  /** Convenience: plan. */
  plan: SessionPlan | null;
  /** Convenience: quotas. */
  quotas: SessionQuotas;
  /** True until first /me reply lands. */
  loading: boolean;
  /** True when there is a logged-in user. */
  isAuthenticated: boolean;
  /** True when the user is a platform admin / system user. */
  isAdmin: boolean;
  /** True when `plan.status` is currently usable (active/trial/grace). */
  isPlanActive: boolean;
  /** ISO timestamp of the last successful /me. */
  lastSyncedAt: string | null;

  /** Predicates (memoised). */
  hasFeature: (key: string) => boolean;
  hasAllFeatures: (keys: string[]) => boolean;
  hasAnyFeature: (keys: string[]) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (...roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasPlanTier: (minTier: PlanTier) => boolean;
  getFeature: (key: string) => SessionFeature | undefined;
  getQuota: (key: string) => number | undefined;

  /** Force a fresh /me round-trip. */
  refresh: () => Promise<void>;
  /** Logout via BFF + clear local state. */
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [session, setSession] = useState<SessionSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef<Promise<void> | null>(null);

  const scheduleNextRefresh = useCallback((sessionExpiresInMs: number) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const delay = Math.max(sessionExpiresInMs - REFRESH_BUFFER_MS, 5_000);
    refreshTimerRef.current = setTimeout(() => {
      void doRefresh();
    }, delay);
  }, []);

  const doRefresh = useCallback(async (): Promise<void> => {
    if (inFlightRef.current) return inFlightRef.current;
    const base = getApiBaseUrl();

    const promise = (async () => {
      setLoading((l) => l || session === null);
      try {
        const r = await axios.get<MeResponseBody>(`${base}/bff/auth/me`, {
          withCredentials: true,
        });
        const body = (r.data as any)?.data ?? r.data;

        if (!body?.session || !body.user?.id) {
          setSession(null);
          return;
        }

        setSession(body.session);
        setLastSyncedAt(body.assembledAt || new Date().toISOString());

        const ttl =
          typeof body.sessionExpiresInMs === "number" && body.sessionExpiresInMs > 0
            ? body.sessionExpiresInMs
            : typeof body.tokenExpiresInMs === "number" && body.tokenExpiresInMs > 0
              ? body.tokenExpiresInMs
              : 5 * 60 * 1000;
        scheduleNextRefresh(ttl);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          setSession(null);
        }
      } finally {
        setLoading(false);
      }
    })();

    inFlightRef.current = promise;
    try {
      await promise;
    } finally {
      inFlightRef.current = null;
    }
  }, [scheduleNextRefresh, session]);

  // Inactivity timer ----------------------------------------------------------
  const resetInactivity = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      void logoutInternal("inactivity");
    }, INACTIVITY_TIMEOUT_MS);
  }, []);

  const logoutInternal = useCallback(
    async (reason: "user" | "inactivity" | "expired" = "user") => {
      const base = getApiBaseUrl();
      const csrf = getCookie("csrf_token");
      const slug = getCookie("slug_organization");

      setSession(null);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

      try {
        await axios.post(
          `${base}/bff/auth/logout`,
          {},
          {
            withCredentials: true,
            headers: csrf ? { "X-CSRF-Token": csrf } : undefined,
          },
        );
      } catch {
        /* tolerable */
      }

      ["slug_organization", "tenant_id", "current_organization", "entitled_modules", "csrf_token"].forEach(
        (c) => removeCookie(c),
      );

      const target =
        slug && reason !== "user"
          ? `/tenant/${slug}/auth/login?reason=${reason}`
          : slug
            ? `/tenant/${slug}/auth/login`
            : "/auth/login";
      router.replace(target);
    },
    [router],
  );

  // Mount: kick off first /me ------------------------------------------------
  useEffect(() => {
    void doRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wire up inactivity tracking once a session is loaded
  useEffect(() => {
    if (!session) return;
    const events: (keyof WindowEventMap)[] = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];
    const handler = () => resetInactivity();
    events.forEach((e) =>
      window.addEventListener(e, handler, { passive: true } as EventListenerOptions),
    );
    resetInactivity();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [session, resetInactivity]);

  // Sync `entitled_modules` cookie for Edge middleware (defence-in-depth) ----
  useEffect(() => {
    if (!session) return;
    const value = (session.enabledFeatureKeys || []).join(",");
    if (typeof document !== "undefined") {
      const maxAge = 24 * 60 * 60;
      document.cookie = `entitled_modules=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  }, [session]);

  // ---------------------------------------------------------------------------

  const value = useMemo<SessionContextValue>(() => {
    const features = session?.features ?? {};
    const quotas = session?.quotas ?? {};

    const hasFeature = (key: string): boolean => {
      const r = evaluateFeature(session, key);
      return r === true;
    };
    const hasAllFeatures = (keys: string[]) => keys.every(hasFeature);
    const hasAnyFeature = (keys: string[]) => keys.some(hasFeature);

    const hasRole = (role: string) =>
      !!session?.user?.roles?.some(
        (r) => r.toLowerCase() === role.toLowerCase(),
      );
    const hasAnyRole = (...roles: string[]) => roles.some(hasRole);

    const hasPermission = (permission: string) =>
      !!session?.user?.permissions?.includes(permission);

    const hasPlanTier = (minTier: PlanTier) =>
      planSatisfies(session?.plan?.tier, minTier);

    return {
      session,
      user: session?.user ?? null,
      tenant: session?.tenant ?? null,
      plan: session?.plan ?? null,
      quotas,
      loading,
      isAuthenticated: !!session?.user?.id,
      isAdmin:
        session?.user?.userType === "system" ||
        !!session?.user?.roles?.some((r) =>
          ["system_admin", "super_admin", "platform_admin"].includes(r),
        ),
      isPlanActive: planUsable(session?.plan ?? null),
      lastSyncedAt,
      hasFeature,
      hasAllFeatures,
      hasAnyFeature,
      hasRole,
      hasAnyRole,
      hasPermission,
      hasPlanTier,
      getFeature: (k: string) =>
        features[k.toLowerCase()] ?? features[k] ?? undefined,
      getQuota: (k: string) => quotas[k],
      refresh: doRefresh,
      logout: () => logoutInternal("user"),
    };
  }, [session, loading, lastSyncedAt, doRefresh, logoutInternal]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used inside <SessionProvider>");
  }
  return ctx;
}

// ---------- Dedicated hooks (ergonomic shortcuts) ---------------------------

/**
 * NOTE: named `useSessionFeature` (not `useFeature`) to avoid a collision
 * with `useFeature()` in `@/hooks/useFeatureCatalog` which returns the
 * catalog-level metadata (icon/label/category) for a feature entry.
 */
export function useSessionFeature(key: string): {
  enabled: boolean;
  feature: SessionFeature | undefined;
  loading: boolean;
} {
  const { hasFeature, getFeature, loading } = useSession();
  return { enabled: hasFeature(key), feature: getFeature(key), loading };
}

export function usePlan(): {
  plan: SessionPlan | null;
  isActive: boolean;
  satisfies: (min: PlanTier) => boolean;
  loading: boolean;
} {
  const { plan, isPlanActive, hasPlanTier, loading } = useSession();
  return { plan, isActive: isPlanActive, satisfies: hasPlanTier, loading };
}

export function useQuota(key: string): number | undefined {
  return useSession().getQuota(key);
}

export function usePermission(perm: string): boolean {
  return useSession().hasPermission(perm);
}
