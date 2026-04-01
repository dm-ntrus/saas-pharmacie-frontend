"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { jwtService } from "@/services/jwt.service";
import { tokenService } from "@/services/token.service";
import { getCookie, setCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import { Permission } from "@/types/permissions";
import { Role, ROLE_PERMISSION_MAP } from "@/types/roles";
import { ACCESS_TOKEN_UPDATED_EVENT } from "@/utils/access-token-events";

/**
 * Une entrée = **une pharmacie** (organisation Keycloak dédiée).
 * L’utilisateur n’a accès qu’aux pharmacies du **même tenant** SaaS ; le JWT peut en lister plusieurs.
 */
export interface PharmacyOrganization {
  id: string;
  name: string;
  roles: string[];
  /** Identifiant tenant Keycloak / plateforme (facturation `tenants/:tenantId/...`). */
  tenantId: string;
  /** Sous-domaine pour l’URL `/tenant/{subdomain}/...`. */
  subdomain: string;
}

interface OrganizationContextType {
  /** Pharmacies du tenant courant (filtrées depuis le JWT). */
  organizations: PharmacyOrganization[];
  /** Alias explicite : même tableau que `organizations`. */
  pharmacies: PharmacyOrganization[];
  /** Tenant racine issu du JWT (`tenant_id`) — toutes les pharmacies listées partagent ce tenant. */
  rootTenantId: string;
  currentOrganization: PharmacyOrganization | null;
  /** Pharmacie active : `currentOrganization.id` = segment `pharmacies/:pharmacyId` API métier. */
  switchOrganization: (pharmacyOrgId: string) => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: Permission | string) => boolean;
  hasAnyPermission: (permissions: (Permission | string)[]) => boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

type OrganizationProviderProps = {
  children: React.ReactNode;
  /** Slug d’URL `app/tenant/[tenant_slug]` — aligne la pharmacie active sur la bonne branche. */
  tenantRouteSlug?: string;
};

function mapJwtOrgs(raw: Record<string, unknown>[]): PharmacyOrganization[] {
  return raw.map((org) => ({
    id: org.id as string,
    name: org.name as string,
    roles: (org.roles as string[]) || [],
    tenantId:
      ((org.attributes as Record<string, string[]>)?.tenant_id?.[0]) || "",
    subdomain:
      ((org.attributes as Record<string, string[]>)?.subdomain?.[0]) || "",
  }));
}

/** Garde uniquement les pharmacies rattachées au tenant racine du token (pas de fuite cross-tenant). */
function filterPharmaciesForRootTenant(
  mapped: PharmacyOrganization[],
  rootTenantId: string,
): PharmacyOrganization[] {
  if (!rootTenantId) {
    return mapped;
  }
  return mapped.filter((o) => {
    if (!o.tenantId) {
      return true;
    }
    return o.tenantId === rootTenantId;
  });
}

export const OrganizationProvider = ({
  children,
  tenantRouteSlug,
}: OrganizationProviderProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [organizations, setOrganizations] = useState<PharmacyOrganization[]>([]);
  const [rootTenantId, setRootTenantId] = useState("");
  const [currentOrganization, setCurrentOrganization] =
    useState<PharmacyOrganization | null>(null);

  const syncFromToken = useCallback(() => {
    const token = tokenService.getAccessToken();
    if (!token) {
      setOrganizations([]);
      setRootTenantId("");
      setCurrentOrganization(null);
      return;
    }

    const decoded = jwtService.decode(token) as {
      organizations?: Record<string, unknown>[];
      tenant_id?: string;
      tenantId?: string;
    };
    const root =
      (decoded.tenant_id || decoded.tenantId || "").trim();
    const rawOrgs = decoded.organizations || [];
    const mapped = mapJwtOrgs(rawOrgs);
    const pharmacies = filterPharmaciesForRootTenant(mapped, root);

    setOrganizations(pharmacies);
    setRootTenantId(root);

    const saved = getCookie("current_organization");

    let selected: PharmacyOrganization | undefined;
    if (tenantRouteSlug) {
      selected = pharmacies.find(
        (o) => o.subdomain && o.subdomain === tenantRouteSlug,
      );
    }
    if (!selected && saved) {
      selected = pharmacies.find((o) => o.id === saved);
    }
    if (!selected) {
      selected = pharmacies[0];
    }

    if (selected) {
      setCurrentOrganization(selected);
      if (selected.tenantId) {
        setCookie("tenant_id", selected.tenantId);
      } else if (root) {
        setCookie("tenant_id", root);
      }
      setCookie("current_organization", selected.id);
    } else {
      setCurrentOrganization(null);
    }
  }, [tenantRouteSlug]);

  useEffect(() => {
    syncFromToken();
  }, [syncFromToken]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === null) {
        syncFromToken();
      }
    };
    const onAccessTokenUpdated = () => syncFromToken();
    window.addEventListener("storage", onStorage);
    window.addEventListener(ACCESS_TOKEN_UPDATED_EVENT, onAccessTokenUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        ACCESS_TOKEN_UPDATED_EVENT,
        onAccessTokenUpdated,
      );
    };
  }, [syncFromToken]);

  const switchOrganization = (pharmacyOrgId: string) => {
    const org = organizations.find((o) => o.id === pharmacyOrgId);
    if (!org) {
      return;
    }

    void queryClient.invalidateQueries();

    setCurrentOrganization(org);
    setCookie("current_organization", pharmacyOrgId);
    localStorage.setItem("current_organization", pharmacyOrgId);
    setCookie("slug_organization", org.subdomain);
    localStorage.setItem("slug_organization", org.subdomain);
    if (org.tenantId) {
      setCookie("tenant_id", org.tenantId);
    } else if (rootTenantId) {
      setCookie("tenant_id", rootTenantId);
    }

    router.replace(`/tenant/${org.subdomain}/dashboard`);
  };

  const hasRole = (role: string): boolean => {
    return currentOrganization?.roles
      .map((r) => r.toLowerCase())
      .includes(role.toLowerCase()) ?? false;
  };

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
        organizations,
        pharmacies: organizations,
        rootTenantId,
        currentOrganization,
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
