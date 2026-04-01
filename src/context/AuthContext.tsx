"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { jwtService } from "@/services/jwt.service";
import { tokenService } from "@/services/token.service";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/utils/cookies";
import { ACCESS_TOKEN_UPDATED_EVENT } from "@/utils/access-token-events";
import axios from "axios";

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

  //
  // Decode token + extract roles, tenant, slug, etc.
  //
  const loadUserFromToken = useCallback((token: string) => {
    try {
      const decoded = jwtService.decode(token);

      const orgs =
        decoded.organizations?.map((org) => ({
          id: org.id,
          name: org.name,
          roles: org.roles,
          tenantId: org.attributes?.tenant_id?.[0],
          subdomain: org.attributes?.subdomain?.[0],
        })) || [];

      const firstOrg = orgs[0] || null;

      setUser({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        roles: decoded.realm_access?.roles || [],
        tenantId:
          (decoded as { tenant_id?: string; tenantId?: string }).tenant_id ||
          (decoded as { tenant_id?: string; tenantId?: string }).tenantId ||
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

  //
  // Refresh from token
  //
  const refreshUser = useCallback(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const base = api.replace(/\/+$/, "");
    setLoading(true);
    axios
      .get(`${base}/api/v1/bff/auth/me`, { withCredentials: true })
      .then((r) => {
        const u = r.data?.user;
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
          tenantSlug: u.keycloakOrganizations?.[0]?.attributes?.subdomain?.[0] || null,
          organizations: (u.keycloakOrganizations || []).map((org: any) => ({
            id: org.id,
            name: org.name,
            roles: org.roles,
            tenantId: org.attributes?.tenant_id?.[0],
            subdomain: org.attributes?.subdomain?.[0],
          })),
        });
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  //
  // Load user on mount
  //
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
      window.removeEventListener(
        ACCESS_TOKEN_UPDATED_EVENT,
        onAccessTokenUpdated,
      );
    };
  }, [loadUserFromToken]);

  //
  // Login
  //
  const login = async (access: string, refresh: string, expiresIn: number) => {
    loadUserFromToken(access);

    const decoded = jwtService.decode(access);
    const isAdmin = decoded.realm_access?.roles?.includes("system_admin");

    if (isAdmin) {
      router.replace("/admin");
    } else {
      const firstOrg = decoded.organizations?.[0];
      const slug = firstOrg?.attributes?.subdomain?.[0];
      setCookie("slug_organization", slug);
      router.replace(`/tenant/${slug}/dashboard`);
    }
  };

  //
  // Logout
  //
  const logout = () => {
    setUser(null);
    const orgSlug = getCookie("slug_organization");
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const base = api.replace(/\/+$/, "");
    axios
      .post(`${base}/api/v1/bff/auth/logout`, {}, { withCredentials: true })
      .finally(() => {
        if (orgSlug) router.replace(`/tenant/${orgSlug}/auth/login`);
        else router.replace("/auth/login");
      });
  };

  //
  // Return current tenant slug
  //
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
