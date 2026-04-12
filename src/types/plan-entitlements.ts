/** Réponse métier de `GET /pharmacies/:pharmacyId/plan-entitlements` (avant enveloppe API). */
export interface PlanEntitlementsSummary {
  billingOrganizationId: string;
  pharmacyContextId: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
  catalogKeys: readonly string[];
  subscriptionId?: string;
  planId?: string;
  reason?: string;
}
