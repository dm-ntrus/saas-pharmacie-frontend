"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import { useSession } from "@/context/SessionContext";
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
  // Pull RBAC/ABAC predicates from the session — single source of truth.
  const session = useSession();

  const userAsUserType: User | null = auth.user
    ? {
        id: auth.user.id,
        email: auth.user.email,
        firstName: auth.user.given_name,
        lastName: auth.user.family_name,
        avatar: undefined,
        roles: auth.user.roles as UserRole[],
        permissions: auth.user.permissions as string[],
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
    hasRole: session.hasRole,
    hasPermission: session.hasPermission,
    hasAnyRole: (roles: string[]) => roles.some(session.hasRole),
    refetchUser: async () => {
      auth.refreshUser();
    },
  };
};

export const useRequireAuth = (requiredRoles?: string[]) => {
  const auth = useAuth();
  const { user, loading, isAuthenticated, hasAnyRole } = auth;
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
  }, [loading, isAuthenticated, requiredRoles, router, hasAnyRole]);

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
