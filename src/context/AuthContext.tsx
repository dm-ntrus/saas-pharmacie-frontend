"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { jwtService, normalizeJwtOrganizations } from "@/services/jwt.service";
import { tokenService } from "@/services/token.service";
import { useRouter } from "next/navigation";
import { getCookie, setCookie, removeCookie } from "@/utils/cookies";
import { ACCESS_TOKEN_UPDATED_EVENT } from "@/utils/access-token-events";
import axios from "axios";
import { getApiBaseUrl } from "@/helpers/auth-interceptor";

const INACTIVITY_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT_MS) || 30 * 60 * 1000;
const TOKEN_REFRESH_BUFFER_MS = Number(process.env.NEXT_PUBLIC_TOKEN_REFRESH_BUFFER_MS) || 60 * 1000;

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  given_name: string;
  family_name: string;
  roles: string[];
  tenantId?: string | null;
  tenantSlug?: string | null;
  organizations: {
    id: string;
    name: string;
    roles: string[];
    tenantId: string;
    subdomain: string;
  }[];
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (access: string, refresh: string, expiresIn: number) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
  getCurrentTenant: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadUserFromToken = useCallback((token: string) => {
    try {
      const decoded = jwtService.decode(token);

      const orgs = normalizeJwtOrganizations(decoded.organizations).map(
        (org) => ({
          id: org.id,
          name: org.name,
          roles: org.roles,
          tenantId: org.attributes?.tenant_id?.[0] ?? "",
          subdomain: org.attributes?.subdomain?.[0] || org.name,
        }),
      );

      const firstOrg = orgs[0] || null;

      setUser({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        roles: decoded.realm_access?.roles || [],
        tenantId:
          (decoded as any).tenant_id ||
          (decoded as any).tenantId ||
          firstOrg?.tenantId ||
          null,
        tenantSlug: firstOrg?.subdomain || null,
        organizations: orgs,
      });
    } catch (error) {
      console.error("Failed to decode token", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Proactive token refresh ---
  const scheduleTokenRefresh = useCallback((expiresInMs: number) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const refreshIn = Math.max(expiresInMs - TOKEN_REFRESH_BUFFER_MS, 5000);
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const csrf = getCookie("csrf_token");
        await axios.post(
          `${getApiBaseUrl()}/bff/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: csrf ? { "X-CSRF-Token": csrf } : {},
          },
        );
      } catch {
        // Refresh failed — user will be redirected on next API 401
      }
    }, refreshIn);
  }, []);

  // --- Inactivity timeout ---
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      setUser(null);
      tokenService.clearTokens();
      removeCookie("slug_organization");
      removeCookie("tenant_id");
      removeCookie("entitled_modules");
      const orgSlug = getCookie("slug_organization");
      if (orgSlug) router.replace(`/tenant/${orgSlug}/auth/login?reason=inactivity`);
      else router.replace("/auth/login?reason=inactivity");
    }, INACTIVITY_TIMEOUT_MS);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    const handler = () => resetInactivityTimer();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    resetInactivityTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [user, resetInactivityTimer]);

  // --- Load user via BFF on mount ---
  const refreshUser = useCallback(() => {
    const base = getApiBaseUrl();
    setLoading(true);
    axios
      .get(`${base}/bff/auth/me`, { withCredentials: true })
      .then((r) => {
        const payload = r.data?.data ?? r.data;
        const u = payload?.user;
        if (!u?.id) {
          setUser(null);
          return;
        }
        setUser({
          id: u.id,
          name: u.email || u.id,
          email: u.email || "",
          given_name: "",
          family_name: "",
          roles: u.roles || [],
          tenantId: u.tenantId || null,
          tenantSlug:
            u.keycloakOrganizations?.[0]?.attributes?.subdomain?.[0] || null,
          organizations: (u.keycloakOrganizations || []).map((org: any) => ({
            id: org.id,
            name: org.name,
            roles: org.roles,
            tenantId: org.attributes?.tenant_id?.[0],
            subdomain: org.attributes?.subdomain?.[0],
          })),
        });
        const ttlMs = r.data?.tokenExpiresInMs;
        const refreshDelay = typeof ttlMs === "number" && ttlMs > 0 ? ttlMs : 5 * 60 * 1000;
        scheduleTokenRefresh(refreshDelay);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [scheduleTokenRefresh]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onAccessTokenUpdated = () => {
      const t = tokenService.getAccessToken();
      if (t) loadUserFromToken(t);
    };
    window.addEventListener(ACCESS_TOKEN_UPDATED_EVENT, onAccessTokenUpdated);
    return () => {
      window.removeEventListener(ACCESS_TOKEN_UPDATED_EVENT, onAccessTokenUpdated);
    };
  }, [loadUserFromToken]);

  // --- Login ---
  const login = async (
    access: string,
    refresh: string,
    expiresIn: number,
  ) => {
    tokenService.setTokens(access, refresh, expiresIn);
    loadUserFromToken(access);
    scheduleTokenRefresh(expiresIn * 1000);

    const decoded = jwtService.decode(access);
    const isAdmin = decoded.realm_access?.roles?.includes("system_admin");

    if (isAdmin) {
      router.replace("/admin");
    } else {
      const orgs = normalizeJwtOrganizations(decoded.organizations);
      const firstOrg = orgs[0];
      const slug = firstOrg?.attributes?.subdomain?.[0] || firstOrg?.name;
      if (slug) setCookie("slug_organization", slug);
      router.replace(`/tenant/${slug}/dashboard`);
    }
  };

  // --- Logout: clear everything + revoke BFF session ---
  const logout = useCallback(() => {
    // Read redirect target BEFORE clearing cookies
    const orgSlug = getCookie("slug_organization");
    const csrf = getCookie("csrf_token");
    const base = getApiBaseUrl();

    // Clear React state immediately
    setUser(null);

    // Clear all client-side tokens and session data
    tokenService.clearTokens();
    removeCookie("slug_organization");
    removeCookie("tenant_id");
    removeCookie("entitled_modules");
    removeCookie("current_organization");
    removeCookie("csrf_token");

    // Clear timers
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    axios
      .post(
        `${base}/bff/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: csrf ? { "X-CSRF-Token": csrf } : {},
        },
      )
      .finally(() => {
        if (orgSlug) router.replace(`/tenant/${orgSlug}/auth/login`);
        else router.replace("/auth/login");
      });
  }, [router]);

  const getCurrentTenant = (): string | null => {
    return user?.tenantSlug || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.roles.includes("system_admin") || false,
        login,
        logout,
        refreshUser,
        getCurrentTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
