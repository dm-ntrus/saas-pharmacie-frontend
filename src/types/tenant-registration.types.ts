/** Statut public `GET /tenants/register/status/:provisioningId` (corps métier après unwrap). */
export type TenantProvisioningPublicStatus = {
  success: boolean;
  status: "queued" | "processing" | "completed" | "failed";
  provisioningId?: string;
  message?: string;
  tenantId?: string;
  subdomain?: string;
  keycloakOrganizationId?: string;
  adminUserId?: string;
  subscriptionId?: string;
  pharmacyId?: string;
  nextSteps?: string[];
  metadata?: Record<string, unknown>;
};
