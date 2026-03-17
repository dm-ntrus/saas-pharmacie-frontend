"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtService } from "@/services/jwt.service";
import { tokenService } from "@/services/token.service";
import { getCookie, setCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import { Permission } from "@/types/permissions";
import { Role, ROLE_PERMISSION_MAP } from "@/types/roles";

export interface Organization {
  id: string;
  name: string;
  roles: string[];
  tenantId: string;
  subdomain: string;
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  switchOrganization: (orgId: string) => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: Permission | string) => boolean;
  hasAnyPermission: (permissions: (Permission | string)[]) => boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

export const OrganizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);

  useEffect(() => {
    const token = tokenService.getAccessToken();
    if (!token) return;

    const decoded = jwtService.decode(token);
    const orgs = decoded.organizations || [];

    const mapped: Organization[] = orgs.map((org: Record<string, unknown>) => ({
      id: org.id as string,
      name: org.name as string,
      roles: (org.roles as string[]) || [],
      tenantId:
        ((org.attributes as Record<string, string[]>)?.tenant_id?.[0]) || "",
      subdomain:
        ((org.attributes as Record<string, string[]>)?.subdomain?.[0]) || "",
    }));

    setOrganizations(mapped);

    const saved = getCookie("current_organization");
    const selected = mapped.find((o) => o.id === saved) || mapped[0];
    if (selected) {
      setCurrentOrganization(selected);
      if (selected.tenantId) setCookie("tenant_id", selected.tenantId);
    }
  }, []);

  const switchOrganization = (orgId: string) => {
    const org = organizations.find((o) => o.id === orgId);
    if (!org) return;

    setCurrentOrganization(org);
    setCookie("current_organization", orgId);
    localStorage.setItem("current_organization", orgId);
    setCookie("slug_organization", org.subdomain);
    localStorage.setItem("slug_organization", org.subdomain);
    if (org.tenantId) setCookie("tenant_id", org.tenantId);
    router.replace(`/tenant/${org.subdomain}/dashboard`);
  };

  const hasRole = (role: string): boolean => {
    return currentOrganization?.roles
      .map((r) => r.toLowerCase())
      .includes(role.toLowerCase()) ?? false;
  };

  /**
   * Résout les permissions à partir des rôles de l'organisation
   * en utilisant le ROLE_PERMISSION_MAP (miroir exact du backend).
   */
  const hasPermission = (permission: Permission | string): boolean => {
    if (!currentOrganization) return false;

    for (const roleName of currentOrganization.roles) {
      const roleKey = roleName.toLowerCase() as Role;
      const perms = ROLE_PERMISSION_MAP[roleKey];
      if (perms?.includes(permission as Permission)) return true;
    }

    return false;
  };

  const hasAnyPermission = (permissions: (Permission | string)[]): boolean => {
    return permissions.some((p) => hasPermission(p));
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        organizations,
        switchOrganization,
        hasRole,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const ctx = useContext(OrganizationContext);
  if (!ctx)
    throw new Error("useOrganization must be used inside OrganizationProvider");
  return ctx;
};
