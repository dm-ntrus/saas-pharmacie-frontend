"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtService } from "@/services/jwt.service";
import { tokenService } from "@/services/token.service";
import { getCookie, setCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";

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
  hasPermission: (permission: string) => boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
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

  // Load organizations from JWT
  useEffect(() => {
    const token = tokenService.getAccessToken();
    if (!token) return;

    const decoded = jwtService.decode(token);

    const orgs = decoded.organizations || [];

    const mapped = orgs.map((org: any) => ({
      id: org.id,
      name: org.name,
      roles: org.roles || [],
      tenantId: org.attributes?.tenant_id?.[0] || "",
      subdomain: org.attributes?.subdomain?.[0] || "",
    }));

    setOrganizations(mapped);

    // Load current org from cookie or default to first
    const saved = getCookie("current_organization");
    const selected = mapped.find((o) => o.id === saved) || mapped[0];
    if (selected) setCurrentOrganization(selected);
  }, []);

  // Switch organization manually
  const switchOrganization = (orgId: string) => {
    const org = organizations.find((o) => o.id === orgId);
    if (!org) return;

    setCurrentOrganization(org);
    // Save in cookie only
    setCookie("current_organization", orgId);
    localStorage.setItem("current_organization", orgId);
    setCookie("slug_organization", org.subdomain);
    localStorage.setItem("slug_organization", org.subdomain);
    router.replace(`/tenant/${org.subdomain}/dashboard`);
  };

  // Role check
  const hasRole = (role: string): boolean => {
    return currentOrganization?.roles.includes(role) || false;
  };

  // Permission check
  const hasPermission = (permission: string): boolean => {
    if (!currentOrganization) return false;

    const rolePermissions: Record<string, string[]> = {
      org_admin: [
        "read",
        "write",
        "delete",
        "manage_users",
        "manage_settings",
        "view_reports",
      ],
      pharmacist: [
        "read",
        "write",
        "manage_prescriptions",
        "manage_inventory",
        "manage_patients",
      ],
      cashier: ["read", "write", "process_sales", "manage_payments"],
      inventory_manager: [
        "read",
        "write",
        "manage_inventory",
        "manage_suppliers",
      ],
      patient: ["read", "view_own_data"],
    };

    for (const r of currentOrganization.roles) {
      if (rolePermissions[r]?.includes(permission)) return true;
    }

    return false;
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        organizations,
        switchOrganization,
        hasRole,
        hasPermission,
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
