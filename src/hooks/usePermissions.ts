"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { Permission, MODULE_PERMISSIONS } from "@/types/permissions";
import { Role, ROLE_PERMISSION_MAP } from "@/types/roles";

export function usePermissions() {
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();

  const resolvedPermissions = useMemo(() => {
    const permSet = new Set<string>();

    const realmRoles = user?.roles ?? [];
    const orgRoles = currentOrganization?.roles ?? [];
    const allRoles = [...realmRoles, ...orgRoles];

    for (const roleName of allRoles) {
      const roleKey = roleName.toLowerCase() as Role;
      const perms = ROLE_PERMISSION_MAP[roleKey];
      if (perms) {
        for (const p of perms) permSet.add(p);
      }
    }

    return permSet;
  }, [user?.roles, currentOrganization?.roles]);

  const userRoles = useMemo(() => {
    const realmRoles = user?.roles ?? [];
    const orgRoles = currentOrganization?.roles ?? [];
    return new Set([...realmRoles, ...orgRoles].map((r) => r.toLowerCase()));
  }, [user?.roles, currentOrganization?.roles]);

  const hasPermission = (permission: Permission | string): boolean => {
    return resolvedPermissions.has(permission);
  };

  const hasAnyPermission = (permissions: (Permission | string)[]): boolean => {
    return permissions.some((p) => resolvedPermissions.has(p));
  };

  const hasAllPermissions = (permissions: (Permission | string)[]): boolean => {
    return permissions.every((p) => resolvedPermissions.has(p));
  };

  const hasRole = (role: Role | string): boolean => {
    return userRoles.has(role.toLowerCase());
  };

  const hasAnyRole = (roles: (Role | string)[]): boolean => {
    return roles.some((r) => userRoles.has(r.toLowerCase()));
  };

  const canAccessModule = (module: string): boolean => {
    const required = MODULE_PERMISSIONS[module];
    if (!required || required.length === 0) return true;
    return required.some((p) => resolvedPermissions.has(p));
  };

  return {
    permissions: resolvedPermissions,
    roles: userRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canAccessModule,
  };
}
