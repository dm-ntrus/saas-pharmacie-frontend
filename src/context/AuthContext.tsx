"use client";

/**
 * AuthContext — legacy adapter over the enterprise SessionContext.
 *
 * New code SHOULD use `useSession()` / `useFeature()` / `usePlan()` /
 * `useQuota()` / `usePermission()` from `@/context/SessionContext`.
 *
 * This module is kept solely for backward compatibility with existing
 * consumers of `useAuth()`. It mounts a `<SessionProvider>` and then
 * projects the enriched `SessionSnapshot` down onto the historical
 * `AuthContext` shape (user + roles + organizations) without making any
 * additional network calls or JWT decodes.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { jwtService, normalizeJwtOrganizations } from "@/services/jwt.service";
import { tokenService } from "@/services/token.service";
import { setCookie } from "@/utils/cookies";
import { ACCESS_TOKEN_UPDATED_EVENT } from "@/utils/access-token-events";
import { SessionProvider, useSession } from "@/context/SessionContext";

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
  permissions: string[];
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

/**
 * Bridge component — consumes SessionContext and exposes the legacy
 * AuthContext surface. Must be mounted inside <SessionProvider>.
 */
const AuthBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const session = useSession();

  const user = useMemo<AuthUser | null>(() => {
    if (!session.session?.user) return null;
    const u = session.session.user;
    const tenantSlug =
      session.session.tenant?.slug ||
      session.session.organizations?.[0]?.slug ||
      null;
    return {
      id: u.id,
      email: u.email,
      name: u.name || u.email || u.id,
      avatar: null,
      firstName: u.givenName ?? null,
      lastName: u.familyName ?? null,
      given_name: u.givenName || "",
      family_name: u.familyName || "",
      roles: u.roles,
      permissions: u.permissions || [],
      tenantId: session.session.tenant?.id || null,
      tenantSlug,
      organizations: (session.session.organizations || []).map((o) => ({
        id: o.id,
        name: o.name || "",
        roles: o.roles,
        tenantId: o.tenantId || "",
        subdomain: o.slug || o.name || "",
      })),
    };
  }, [session.session]);

  const refreshUser = useCallback(() => {
    void session.refresh();
  }, [session]);

  const logout = useCallback(() => {
    void session.logout();
  }, [session]);

  // Legacy login(): token is typically already set via the BFF cookie flow.
  // We mirror it into tokenService for any remaining non-cookie consumer
  // and trigger a single session refresh.
  const login = useCallback(
    async (access: string, refresh: string, expiresIn: number) => {
      tokenService.setTokens(access, refresh, expiresIn);
      try {
        const decoded = jwtService.decode(access);
        const isAdmin = decoded.realm_access?.roles?.includes("system_admin");
        if (isAdmin) {
          router.replace("/admin");
        } else {
          const orgs = normalizeJwtOrganizations(decoded.organizations);
          const slug = orgs[0]?.attributes?.subdomain?.[0] || orgs[0]?.name;
          if (slug) setCookie("slug_organization", slug);
          if (slug) router.replace(`/tenant/${slug}/dashboard`);
        }
      } catch {
        /* ignore — /me will resolve state */
      }
      await session.refresh();
    },
    [session, router],
  );

  const getCurrentTenant = useCallback(
    () =>
      session.session?.tenant?.slug ||
      session.session?.organizations?.[0]?.slug ||
      null,
    [session.session],
  );

  // Bridge legacy ACCESS_TOKEN_UPDATED events -> session refresh,
  // so existing interceptors keep working without any call-site changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onAccessTokenUpdated = () => {
      void session.refresh();
    };
    window.addEventListener(ACCESS_TOKEN_UPDATED_EVENT, onAccessTokenUpdated);
    return () => {
      window.removeEventListener(
        ACCESS_TOKEN_UPDATED_EVENT,
        onAccessTokenUpdated,
      );
    };
  }, [session]);

  const value: AuthContextType = {
    user,
    loading: session.loading,
    isAuthenticated: session.isAuthenticated,
    isAdmin: session.isAdmin,
    login,
    logout,
    refreshUser,
    getCurrentTenant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SessionProvider>
      <AuthBridge>{children}</AuthBridge>
    </SessionProvider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
