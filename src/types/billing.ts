/**
 * Types Billing & Abonnements — Alignés backend
 * Source: src/plateform/billing (subscriptions, stripe, plan, payments)
 */

// —— Plans (API publique) ——
export type BillingInterval = "monthly" | "yearly";
export type PlanType = "free" | "paid";
export type PlanTier =
  | "free"
  | "starter"
  | "professional"
  | "enterprise"
  | "custom";
export type PricingModel = "flat" | "per_user";

export interface PlanEntitlement {
  is_included: boolean;
  limit_value?: number;
  configuration?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  feature_id?: string;
  feature_key?: string;
  feature_name?: string;
  feature_type?: string;
  category?: string;
  feature_is_active?: boolean;
  key?: string;
  name?: string;
  type?: string;
}

export interface Plan {
  id: string;
  plan_key: string;
  name: string;
  description: string;
  sort_order?: number;
  active: boolean;
  currency: string;
  billing_interval: BillingInterval | string;
  type: PlanType | string;
  plan_tier: PlanTier | string;
  pricing_model: PricingModel | string;
  stripe_price_id?: string;
  is_trial_available?: boolean;
  price: number;
  max_users?: number;
  max_storage_gb?: number;
  max_api_calls_per_month?: number;
  max_concurrent_sessions?: number;
  max_pharmacies?: number;
  features?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  version?: number;
  created_at?: string;
  updated_at?: string;
  feature_flags?: PlanEntitlement[];
  capabilities?: {
    isolation: string;
    siteMode: string;
    limits: { maxPharmacies: number };
  };
}

export interface PlanFilterParams {
  limit?: number;
  offset?: number;
  includeFeatureFlags?: boolean;
  sortBy?: string;
  sortDir?: "asc" | "desc" | "ASC" | "DESC";
  search?: string;
  planTier?: string;
  type?: "free" | "paid";
  interval?: "monthly" | "yearly";
  currency?: string;
  active?: boolean;
  minPrice?: number;
  maxPrice?: number;
  featureKey?: string;
  featureKeys?: string;
}

// —— Contexte abonnement (GET tenants/:tenantId/billing/context) ——
export interface SubscriptionEntitlementItem {
  is_included?: boolean;
  limit_value?: number;
  configuration?: Record<string, unknown>;
  key?: string;
  name?: string;
  type?: string;
}

export interface SubscriptionContext {
  id?: string;
  tenant_id?: string;
  plan_id?: string;
  status?: string;
  currency?: string;
  current_period_start?: string;
  current_period_end?: string;
  plan_details?: Plan | Record<string, unknown>;
  entitlements?: SubscriptionEntitlementItem[];
  usage?: unknown[];
  recent_invoices?: InvoiceSummary[];
  [key: string]: unknown;
}

export interface InvoiceSummary {
  id: string;
  tenant_id?: string;
  status?: string;
  amount_due?: number;
  amount_paid?: number;
  currency?: string;
  created_at?: string;
  due_date?: string;
  invoice_number?: string;
  [key: string]: unknown;
}

// —— Historique (GET tenants/:tenantId/billing/history) ——
export interface SubscriptionHistoryItem {
  id: string;
  tenant_id?: string;
  plan_id?: string;
  plan_name?: string;
  status?: string;
  currency?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at?: string;
  [key: string]: unknown;
}

export type SubscriptionHistory = SubscriptionHistoryItem[] | { result?: SubscriptionHistoryItem[] };

// —— Checkout (POST tenants/:tenantId/billing/checkout) ——
export interface CreateCheckoutDto {
  planId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  trialDays?: number;
  couponCode?: string;
}

export interface CheckoutSessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    url: string;
    expiresAt?: string;
  };
}

// —— Portal (POST tenants/:tenantId/billing/portal) ——
export interface CreatePortalDto {
  returnUrl: string;
}

export interface PortalSessionResponse {
  success: boolean;
  data: { url: string };
}

// —— Paiements facture ——
export interface PayInvoiceStripeDto {
  paymentMethodId: string;
}

export interface PayInvoiceManualDto {
  imageBase64: string;
}

// —— Entitlements (optionnel, si utilisé) ——
export interface EntitlementFeatureCheck {
  tenantId: string;
  featureKey: string;
  enabled: boolean;
}

export interface EntitlementUsage {
  tenantId: string;
  featureKey: string;
  usage: number | Record<string, unknown>;
}
