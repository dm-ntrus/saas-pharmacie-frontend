"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtService } from "@/services/jwt.service";
import { tokenService } from "@/services/token.service";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: string;
  email: string;
  name: string;
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
  // Load user on mount
  //
  useEffect(() => {
    const token = tokenService.getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    loadUserFromToken(token);
  }, []);

  //
  // Decode token + extract roles, tenant, slug, etc.
  //
  const loadUserFromToken = (token: string) => {
    try {
      const decoded = jwtService.decode(token);

      const isAdmin = decoded.realm_access?.roles?.includes("system_admin");

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
        tenantId: firstOrg?.tenantId || null,
        tenantSlug: firstOrg?.subdomain || null,
        organizations: orgs,
      });
    } catch (error) {
      console.error("Failed to decode token", error);
    } finally {
      setLoading(false);
    }
  };

  //
  // Login
  //
  const login = async (access: string, refresh: string, expiresIn: number) => {
    tokenService.setTokens(access, refresh, expiresIn);
    loadUserFromToken(access);

    const decoded = jwtService.decode(access);
    const isAdmin = decoded.realm_access?.roles?.includes("system_admin");

    if (isAdmin) {
      router.replace("/admin");
    } else {
      const firstOrg = decoded.organizations?.[0];
      const slug = firstOrg?.attributes?.subdomain?.[0];
      router.replace(`/tenant/${slug}/dashboard`);
    }
  };

  //
  // Logout
  //
  const logout = () => {
    tokenService.clearTokens();
    setUser(null);
    router.replace("/auth/login");
  };

  //
  // Refresh from token
  //
  const refreshUser = () => {
    const token = tokenService.getAccessToken();
    if (token) loadUserFromToken(token);
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
