/**
 * Types Billing & Abonnements — Alignés backend
 * Source: src/plateform/billing (subscriptions, plan, payments)
 */

// —— Plans (API publique) ——
export type BillingInterval = "monthly" | "yearly";
export type PlanType = "paid";
export type PlanTier =
  | "starter"
  | "professional"
  | "enterprise";
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
  type?: "paid";
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

// Legacy / UI typing support (pages may refine these later)
export type BillingInvoice = Record<string, unknown>;

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

// —— Invoices (minimal typing for UI) ——
export type InvoiceItemType = "product" | "service" | "consultation" | "prescription";

export interface CreateInvoiceItemDto {
  item_type: InvoiceItemType;
  item_code: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  tax_rate?: number;
}

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

// —— Paiements (billing/payments) ——
export interface BillingPayment {
  id: string;
  payment_number?: string;
  payment_date?: string;
  created_at?: string;
  amount: number;
  currency?: string;
  payment_method: string;
  status: string;
  is_refund?: boolean;
  invoice_id?: string;
  tenant_id?: string;
  [key: string]: unknown;
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: "Carte bancaire",
  cash: "Espèces",
  bank_transfer: "Virement bancaire",
  mobile_money: "Mobile Money",
  manual: "Manuel",
  check: "Chèque",
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  open: "Ouverte",
  pending: "En attente",
  paid: "Payée",
  void: "Annulée",
  uncollectible: "Irrécouvrable",
  canceled: "Annulée",
  refunded: "Remboursée",
  failed: "Échec",
};

/** Avoirs facture abonnement SaaS (GET/POST …/billing/payments/…/credit-notes) */
export interface SubscriptionCreditNote {
  id?: string;
  credit_note_number?: string;
  status?: string;
  credit_amount?: number | string;
  reason?: string;
  reason_code?: string;
  created_at?: string;
  applied_at?: string;
  currency?: string;
  [key: string]: unknown;
}

export const SUBSCRIPTION_CREDIT_NOTE_STATUS_LABELS: Record<string, string> = {
  open: "Ouverte",
  applied: "Appliquée",
  void: "Annulée",
};

export function normalizeSubscriptionCreditNotesList(raw: unknown): SubscriptionCreditNote[] {
  if (Array.isArray(raw)) return raw as SubscriptionCreditNote[];
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.creditNotes)) return o.creditNotes as SubscriptionCreditNote[];
    if (Array.isArray(o.data)) return o.data as SubscriptionCreditNote[];
    if (Array.isArray(o.result)) return o.result as SubscriptionCreditNote[];
  }
  return [];
}

export type SubscriptionCreditNoteReasonCode =
  | "duplicate"
  | "fraudulent"
  | "requested_by_customer"
  | "correction"
  | "discount";

/** Rapports GET tenants/:tenantId/billing/reports/* (facturation abonnement plateforme) */
export type TenantBillingReportScope = "platform_subscription";

export interface TenantBillingDailyReport {
  scope: TenantBillingReportScope;
  date: string;
  total_invoices: number;
  total_sales_amount: number;
  total_payments_received: number;
  payments: Array<{
    id: string;
    amount: number;
    invoice_id: string | null;
    processed_at?: string;
    currency?: string;
  }>;
}

export interface TenantBillingMonthlyReport {
  scope: TenantBillingReportScope;
  month: string;
  revenue_from_payments: number;
  invoice_total_amount_created: number;
  invoices_created_count: number;
  invoices_by_status: Record<string, number>;
}

export interface TenantBillingOutstandingReport {
  scope: TenantBillingReportScope;
  totalOutstanding: number;
  invoices: Array<{
    id: string;
    invoice_number: string;
    due_date?: string;
    total_amount: number;
    amount_paid: number;
    balance_due: number;
    currency?: string;
  }>;
}

export interface TenantBillingSalesByProductReport {
  scope: TenantBillingReportScope;
  note?: string;
  startDate?: string;
  endDate?: string;
  items: Array<{
    rank: number;
    product_key: string;
    label: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface TenantBillingStatisticsReport {
  scope: TenantBillingReportScope;
  period: { startDate?: string; endDate?: string };
  invoiceCount: number;
  invoicesByStatus: Record<string, number>;
  paidTotal: number;
  paymentRecordsInPeriod: number;
  openInvoicesCount: number;
  estimatedOpenBalance: number;
}
