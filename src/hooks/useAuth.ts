"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import type { User, UserRole } from "@/types";

export { AuthProvider } from "@/context/AuthContext";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: unknown) => Promise<void>;
  register: (userData: unknown) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refetchUser: () => Promise<void>;
}

/**
 * Adapter: utilise le AuthProvider réel (context/AuthContext) et expose
 * une API compatible avec les pages qui utilisent useAuth / useRequireAuth.
 */
export const useAuth = (): AuthContextType => {
  const auth = useAuthContext();
  const realmRoles = auth.user?.roles ?? [];
  const orgRoles = auth.user?.organizations?.[0]?.roles ?? [];
  const allRoles = [...new Set([...realmRoles, ...orgRoles])];

  const hasRole = (role: string): boolean =>
    allRoles.some((r) => r.toLowerCase() === role.toLowerCase());

  const hasAnyRole = (roles: string[]): boolean =>
    roles.some((role) => hasRole(role));

  const hasPermission = (_permission: string): boolean => {
    return false;
  };

  const userAsUserType: User | null = auth.user
    ? {
        id: auth.user.id,
        email: auth.user.email,
        firstName: auth.user.given_name,
        lastName: auth.user.family_name,
        avatar: undefined,
        roles: auth.user.roles as UserRole[],
        permissions: [],
        tenantId: auth.user.tenantId ?? undefined,
        isActive: true,
        lastLogin: undefined,
        createdAt: "",
        updatedAt: "",
      }
    : null;

  return {
    user: userAsUserType,
    loading: auth.loading,
    isAuthenticated: auth.isAuthenticated,
    login: async () => {
      throw new Error("Utilisez la page de login pour vous connecter.");
    },
    register: async () => {
      throw new Error("Utilisez la page d'inscription pour créer un compte.");
    },
    logout: auth.logout,
    hasRole,
    hasPermission,
    hasAnyRole,
    refetchUser: async () => {
      auth.refreshUser();
    },
  };
};

export const useRequireAuth = (requiredRoles?: string[]) => {
  const { user, loading, isAuthenticated, hasAnyRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (
      requiredRoles &&
      requiredRoles.length > 0 &&
      !hasAnyRole(requiredRoles)
    ) {
      router.replace("/unauthorized");
      return;
    }
  }, [loading, isAuthenticated, hasAnyRole, requiredRoles, router]);

  return { user, loading, isAuthenticated };
};

export const useRedirectIfAuthenticated = (
  redirectTo: string = "/dashboard"
) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  return { loading };
};
