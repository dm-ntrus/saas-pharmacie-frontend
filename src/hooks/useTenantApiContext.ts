"use client";

import { useOrganization } from "@/context/OrganizationContext";

/**
 * Contexte API multi-tenant — à utiliser dans les hooks `use*` qui appellent le backend.
 *
 * **Deux espaces d’identifiants (alignés backend Nest) :**
 *
 * 1. **`pharmacyId`** — segment `pharmacies/:pharmacyId/...` (inventaire, ventes, supply-chain,
 *    patients, etc.). Ici on utilise `currentOrganization.id` (org Keycloak / site), cohérent avec
 *    `JwtAuthGuard` (`pharmacy_id` ou `org_id` dans le JWT).
 *
 * 2. **`billingTenantId`** — segment `tenants/:tenantId/billing/...` (abonnement plateforme).
 *    Utiliser le **`rootTenantId`** du JWT (`tenant_id` / `tenantId`), puis l’attribut org
 *    `tenant_id` ; ne pas confondre avec l’`id` Keycloak de la pharmacie.
 *
 * Le backend valide : `TenantAccessGuard` compare `:tenantId` au `tenant_id` JWT ; les routes
 * pharmacie s’appuient sur le paramètre + membership.
 */
export function useTenantApiContext(): {
  pharmacyId: string;
  billingTenantId: string;
  hasOrganization: boolean;
} {
  const { currentOrganization, rootTenantId } = useOrganization();
  if (!currentOrganization) {
    return { pharmacyId: "", billingTenantId: "", hasOrganization: false };
  }
  const billingTenantId =
    rootTenantId.trim() ||
    currentOrganization.tenantId?.trim() ||
    "";
  return {
    pharmacyId: currentOrganization.id,
    billingTenantId,
    hasOrganization: true,
  };
}
