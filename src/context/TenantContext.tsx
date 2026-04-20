"use client";

import { useOrganization } from "@/context/OrganizationContext";

/**
 * Legacy compatibility adapter.
 * New code should use OrganizationContext directly.
 */
export function useTenantContext() {
  const { currentOrganization } = useOrganization();
  return {
    currentTenant: currentOrganization
      ? {
          id: currentOrganization.tenantId || currentOrganization.id,
          slug: currentOrganization.subdomain,
          name: currentOrganization.name,
        }
      : null,
  };
}

