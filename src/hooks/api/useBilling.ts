"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { invalidatePlanEntitlementsQueries } from "@/services/plan-entitlements.service";
import { toast } from "react-hot-toast";
import type {
  SubscriptionContext,
  SubscriptionHistory,
  SubscriptionHistoryItem,
  CreateCheckoutDto,
  CheckoutSessionResponse,
  CreatePortalDto,
  PortalSessionResponse,
  PayInvoiceStripeDto,
  PayInvoiceManualDto,
  SubscriptionCreditNote,
  SubscriptionCreditNoteReasonCode,
  TenantBillingDailyReport,
  TenantBillingMonthlyReport,
  TenantBillingOutstandingReport,
  TenantBillingSalesByProductReport,
  TenantBillingStatisticsReport,
} from "@/types/billing";
import { normalizeSubscriptionCreditNotesList } from "@/types/billing";

/** @see useTenantApiContext — `billingTenantId` pour `/tenants/:tenantId/billing/...` */
function useBillingTenantId(): string {
  return useTenantApiContext().billingTenantId;
}

const subscriptionContextKey = "billing-subscription-context";
const subscriptionHistoryKey = "billing-subscription-history";

/** Query sur la page facturation : retour navigateur après un changement d’abonnement (tout fournisseur). */
export const BILLING_RETURN_SYNC_PARAM = "billing_sync";

/**
 * Raisons reconnues pour déclencher un rafraîchissement abonnement + plan-entitlements.
 * - `checkout` : retour d’un flux de souscription hébergé (ex. Stripe Checkout, ou équivalent).
 * - `portal` : retour self-service (ex. portail client Stripe, ou équivalent).
 * - `subscription` : tout autre retour (mobile money, cash + deep link, validation manuelle côté plateforme, etc.).
 */
export type BillingReturnSyncReason = "checkout" | "portal" | "subscription";

const BILLING_RETURN_SYNC_REASONS = new Set<string>([
  "checkout",
  "portal",
  "subscription",
]);

function isBillingReturnSyncReason(
  v: string | null,
): v is BillingReturnSyncReason {
  return v != null && BILLING_RETURN_SYNC_REASONS.has(v);
}

/**
 * Ajoute {@link BILLING_RETURN_SYNC_PARAM} à une URL absolue (success / return URL quelconque).
 */
export function appendBillingReturnSyncMarker(
  absoluteUrl: string,
  reason: BillingReturnSyncReason,
): string {
  const u = new URL(absoluteUrl);
  u.searchParams.set(BILLING_RETURN_SYNC_PARAM, reason);
  return u.toString();
}

async function invalidateSubscriptionBillingAsync(
  qc: QueryClient,
  tenantId: string,
  pharmacyId: string | undefined,
): Promise<void> {
  invalidatePlanEntitlementsQueries(qc, pharmacyId);
  if (tenantId) {
    await qc.invalidateQueries({ queryKey: [subscriptionContextKey, tenantId] });
    await qc.invalidateQueries({ queryKey: [subscriptionHistoryKey, tenantId] });
  }
}

/**
 * Invalide contexte d’abonnement, historique et entitlements plan (pharmacie courante).
 * À utiliser après un paiement facture d’abonnement réussi (Stripe, preuve OCR, upload, mobile money API, etc.).
 */
export function syncSubscriptionBillingCaches(
  qc: QueryClient,
  tenantId: string,
  pharmacyId: string | undefined,
): void {
  void invalidateSubscriptionBillingAsync(qc, tenantId, pharmacyId);
}

/**
 * Après retour sur `/billing` avec `billing_sync` (tout fournisseur de paiement / portail).
 * À monter sur la page facturation ; préférer un enfant dans `<Suspense>`.
 */
export function useBillingReturnSync(): void {
  const qc = useQueryClient();
  const tenantId = useBillingTenantId();
  const { pharmacyId } = useTenantApiContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams || !pathname) return;
    const billingSync = searchParams.get(BILLING_RETURN_SYNC_PARAM);
    if (!isBillingReturnSyncReason(billingSync)) return;

    let cancelled = false;
    void (async () => {
      await invalidateSubscriptionBillingAsync(qc, tenantId, pharmacyId);
      if (cancelled) return;

      const params = new URLSearchParams(searchParams.toString());
      params.delete(BILLING_RETURN_SYNC_PARAM);
      const q = params.toString();
      const nextPath = q ? `${pathname}?${q}` : pathname;
      router.replace(nextPath, { scroll: false });
    })();

    return () => {
      cancelled = true;
    };
  }, [qc, tenantId, pharmacyId, pathname, router, searchParams]);
}

export function useSubscriptionContext() {
  const tenantId = useBillingTenantId();
  const path = tenantId ? `/tenants/${encodeURIComponent(tenantId)}/billing/context` : "";
  return useQuery<SubscriptionContext>({
    queryKey: [subscriptionContextKey, tenantId],
    queryFn: () => apiService.get<SubscriptionContext>(path),
    enabled: !!tenantId,
    staleTime: 60_000,
  });
}

function normalizeHistory(raw: SubscriptionHistory): SubscriptionHistoryItem[] {
  if (Array.isArray(raw)) return raw;
  const r = raw as { result?: SubscriptionHistoryItem[] };
  return Array.isArray(r?.result) ? r.result : [];
}

export function useSubscriptionHistory() {
  const tenantId = useBillingTenantId();
  const path = tenantId ? `/tenants/${encodeURIComponent(tenantId)}/billing/history` : "";
  return useQuery({
    queryKey: [subscriptionHistoryKey, tenantId],
    queryFn: async () => {
      const raw = await apiService.get<SubscriptionHistory>(path);
      return normalizeHistory(raw);
    },
    enabled: !!tenantId,
    staleTime: 60_000,
  });
}

export function useCheckoutSession() {
  const tenantId = useBillingTenantId();
  return useMutation({
    mutationFn: (dto: CreateCheckoutDto) =>
      apiService.post<CheckoutSessionResponse>(
        `/tenants/${encodeURIComponent(tenantId)}/billing/checkout`,
        dto
      ),
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erreur lors de la création de la session de paiement"
      ),
  });
}

export function usePortalSession() {
  const tenantId = useBillingTenantId();
  return useMutation({
    mutationFn: (dto: CreatePortalDto) =>
      apiService.post<PortalSessionResponse>(
        `/tenants/${encodeURIComponent(tenantId)}/billing/portal`,
        dto
      ),
    onError: () =>
      toast.error("Impossible d'ouvrir le portail de facturation (aucun abonnement actif ?)"),
  });
}

// —— Paiements facture (tenants/:tenantId/billing/payments) ——

export function usePayInvoiceStripe() {
  const tenantId = useBillingTenantId();
  const { pharmacyId } = useTenantApiContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      invoiceId,
      paymentMethodId,
    }: { invoiceId: string } & PayInvoiceStripeDto) =>
      apiService.post<unknown>(
        `/tenants/${encodeURIComponent(tenantId)}/billing/payments/invoices/${encodeURIComponent(invoiceId)}/stripe`,
        { paymentMethodId }
      ),
    onSuccess: () => {
      syncSubscriptionBillingCaches(qc, tenantId, pharmacyId);
      toast.success("Paiement enregistré");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erreur de paiement"
      ),
  });
}

export function usePayInvoiceManual() {
  const tenantId = useBillingTenantId();
  const { pharmacyId } = useTenantApiContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      invoiceId,
      imageBase64,
    }: { invoiceId: string } & PayInvoiceManualDto) =>
      apiService.post<unknown>(
        `/tenants/${encodeURIComponent(tenantId)}/billing/payments/invoices/${encodeURIComponent(invoiceId)}/manual`,
        { imageBase64 }
      ),
    onSuccess: () => {
      syncSubscriptionBillingCaches(qc, tenantId, pharmacyId);
      toast.success("Preuve de paiement envoyée");
    },
    onError: () => toast.error("Erreur lors de l'envoi de la preuve"),
  });
}

export function usePayInvoiceUpload() {
  const tenantId = useBillingTenantId();
  const { pharmacyId } = useTenantApiContext();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, file }: { invoiceId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiService.upload<unknown>(
        `/tenants/${encodeURIComponent(tenantId)}/billing/payments/invoices/${encodeURIComponent(invoiceId)}/manual-upload`,
        formData
      );
    },
    onSuccess: () => {
      syncSubscriptionBillingCaches(qc, tenantId, pharmacyId);
      toast.success("Preuve de paiement envoyée");
    },
    onError: () => toast.error("Erreur lors de l'envoi du fichier"),
  });
}

function tenantPaymentsInvoicesPath(tenantId: string, invoiceId: string) {
  return `/tenants/${encodeURIComponent(tenantId)}/billing/payments/invoices/${encodeURIComponent(invoiceId)}`;
}

const subscriptionCreditNotesKey = "subscription-credit-notes";

/** Avoirs liés à une facture d'abonnement (base plateforme) */
export function useSubscriptionCreditNotes(invoiceId: string | null) {
  const tenantId = useBillingTenantId();
  const path =
    tenantId && invoiceId ? `${tenantPaymentsInvoicesPath(tenantId, invoiceId)}/credit-notes` : "";
  return useQuery({
    queryKey: [subscriptionCreditNotesKey, tenantId, invoiceId],
    queryFn: async () => {
      const raw = await apiService.get<unknown>(path);
      return normalizeSubscriptionCreditNotesList(raw);
    },
    enabled: !!tenantId && !!invoiceId,
    staleTime: 30_000,
    retry: false,
  });
}

export function useCreateSubscriptionCreditNote() {
  const tenantId = useBillingTenantId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      invoiceId: string;
      amount: number;
      reason: string;
      reasonCode?: SubscriptionCreditNoteReasonCode;
      pharmacyId?: string;
    }) =>
      apiService.post<SubscriptionCreditNote>(
        `${tenantPaymentsInvoicesPath(tenantId, params.invoiceId)}/credit-notes`,
        {
          amount: params.amount,
          reason: params.reason,
          reasonCode: params.reasonCode,
          pharmacyId: params.pharmacyId,
        }
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [subscriptionCreditNotesKey, tenantId, vars.invoiceId] });
      qc.invalidateQueries({ queryKey: ["billing-invoice", tenantId, vars.invoiceId] });
      qc.invalidateQueries({ queryKey: ["billing-invoices", tenantId] });
      qc.invalidateQueries({ queryKey: [subscriptionContextKey, tenantId] });
      toast.success("Note de crédit créée");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { message?: string })?.message ??
          "Impossible de créer la note de crédit (facture abonnement uniquement)"
      ),
  });
}

export function useApplySubscriptionCreditNote() {
  const tenantId = useBillingTenantId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { creditNoteId: string; invoiceId: string }) =>
      apiService.post(
        `/tenants/${encodeURIComponent(tenantId)}/billing/payments/credit-notes/${encodeURIComponent(params.creditNoteId)}/apply`,
        {}
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [subscriptionCreditNotesKey, tenantId, vars.invoiceId] });
      qc.invalidateQueries({ queryKey: ["billing-invoice", tenantId, vars.invoiceId] });
      qc.invalidateQueries({ queryKey: ["billing-invoices", tenantId] });
      qc.invalidateQueries({ queryKey: [subscriptionContextKey, tenantId] });
      toast.success("Avoir appliqué à la facture");
    },
    onError: (err: unknown) =>
      toast.error((err as { message?: string })?.message ?? "Erreur lors de l'application"),
  });
}

export function useVoidSubscriptionCreditNote() {
  const tenantId = useBillingTenantId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { creditNoteId: string; invoiceId: string; voidReason: string }) =>
      apiService.post(
        `/tenants/${encodeURIComponent(tenantId)}/billing/payments/credit-notes/${encodeURIComponent(params.creditNoteId)}/void`,
        { voidReason: params.voidReason }
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [subscriptionCreditNotesKey, tenantId, vars.invoiceId] });
      qc.invalidateQueries({ queryKey: ["billing-invoice", tenantId, vars.invoiceId] });
      qc.invalidateQueries({ queryKey: ["billing-invoices", tenantId] });
      qc.invalidateQueries({ queryKey: [subscriptionContextKey, tenantId] });
      toast.success("Note de crédit annulée");
    },
    onError: (err: unknown) =>
      toast.error((err as { message?: string })?.message ?? "Erreur lors de l'annulation"),
  });
}

export function useBillingPaymentHistory(params?: Record<string, string | number | undefined>) {
  const tenantId = useBillingTenantId();
  const search = params
    ? "?" + new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))).toString()
    : "";
  const path = tenantId
    ? `/tenants/${encodeURIComponent(tenantId)}/billing/payments${search}`
    : "";
  return useQuery({
    queryKey: ["billing-payments", tenantId, params],
    queryFn: () => apiService.get(path),
    enabled: !!tenantId,
    staleTime: 30_000,
  });
}

export function usePaymentById(id: string) {
  const tenantId = useBillingTenantId();
  return useQuery({
    queryKey: ["billing-payment", tenantId, id],
    queryFn: () =>
      apiService.get(`/tenants/${encodeURIComponent(tenantId)}/billing/payments/${encodeURIComponent(id)}`),
    enabled: !!tenantId && !!id,
    staleTime: 30_000,
  });
}

// ---------------------------------------------------------------------------
// Invoices (compat exports for tenant billing pages)
// ---------------------------------------------------------------------------

function invoicesBase(tenantId: string) {
  return `/tenants/${encodeURIComponent(tenantId)}/billing/invoices`;
}

function normalizeBillingInvoiceList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.invoices)) return o.invoices;
    if (Array.isArray(o.result)) return o.result;
  }
  return [];
}

export function useBillingInvoices(params?: Record<string, string | number | undefined>) {
  const tenantId = useBillingTenantId();
  return useQuery({
    queryKey: ["billing-invoices", tenantId, params],
    queryFn: async () => {
      const raw = await apiService.get<unknown>(invoicesBase(tenantId), {
        params: params
          ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
          : {},
      });
      return normalizeBillingInvoiceList(raw);
    },
    enabled: !!tenantId,
    staleTime: 30_000,
  });
}

function unwrapBillingInvoiceDetail(raw: unknown): unknown {
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (o.data && typeof o.data === "object") return o.data;
  }
  return raw;
}

export function useBillingInvoice(id: string) {
  const tenantId = useBillingTenantId();
  return useQuery({
    queryKey: ["billing-invoice", tenantId, id],
    queryFn: async () => {
      const raw = await apiService.get<unknown>(
        `${invoicesBase(tenantId)}/${encodeURIComponent(id)}`,
      );
      return unwrapBillingInvoiceDetail(raw);
    },
    enabled: !!tenantId && !!id,
    staleTime: 30_000,
  });
}

export function useCreateBillingInvoice() {
  const tenantId = useBillingTenantId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) => apiService.post(invoicesBase(tenantId), dto),
    onSuccess: () => {
      toast.success("Facture créée");
      qc.invalidateQueries({ queryKey: ["billing-invoices", tenantId] });
    },
    onError: () => toast.error("Erreur création facture"),
  });
}

export function useCancelBillingInvoice() {
  const tenantId = useBillingTenantId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      apiService.post(`${invoicesBase(tenantId)}/${encodeURIComponent(id)}/cancel`, { reason }),
    onSuccess: () => {
      toast.success("Facture annulée");
      qc.invalidateQueries({ queryKey: ["billing-invoices", tenantId] });
    },
    onError: () => toast.error("Erreur annulation facture"),
  });
}

export function useProcessBillingPayment() {
  const tenantId = useBillingTenantId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.post(`${invoicesBase(tenantId)}/${encodeURIComponent(id)}/payments`, data),
    onSuccess: () => {
      toast.success("Paiement enregistré");
      qc.invalidateQueries({ queryKey: ["billing-invoices", tenantId] });
    },
    onError: () => toast.error("Erreur paiement"),
  });
}

export function useProcessRefund() {
  const tenantId = useBillingTenantId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.post(`${invoicesBase(tenantId)}/${encodeURIComponent(id)}/refunds`, data),
    onSuccess: () => {
      toast.success("Remboursement enregistré");
      qc.invalidateQueries({ queryKey: ["billing-invoices", tenantId] });
    },
    onError: () => toast.error("Erreur remboursement"),
  });
}

export function useConvertProformaToInvoice() {
  const tenantId = useBillingTenantId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post(`${invoicesBase(tenantId)}/${encodeURIComponent(id)}/convert-proforma`, {}),
    onSuccess: () => {
      toast.success("Proforma convertie");
      qc.invalidateQueries({ queryKey: ["billing-invoices", tenantId] });
    },
    onError: () => toast.error("Erreur conversion proforma"),
  });
}

// Rapports (une requête active selon l’onglet : `params` défini seulement pour le type sélectionné)
export function useBillingDailyReport(params?: Record<string, string | number | undefined>) {
  const tenantId = useBillingTenantId();
  return useQuery<TenantBillingDailyReport>({
    queryKey: ["billing-report-daily", tenantId, params],
    queryFn: () =>
      apiService.get(`/tenants/${encodeURIComponent(tenantId)}/billing/reports/daily`, { params }),
    enabled: !!tenantId && params !== undefined,
    staleTime: 30_000,
  });
}

export function useBillingMonthlyReport(params?: Record<string, string | number | undefined>) {
  const tenantId = useBillingTenantId();
  return useQuery<TenantBillingMonthlyReport>({
    queryKey: ["billing-report-monthly", tenantId, params],
    queryFn: () =>
      apiService.get(`/tenants/${encodeURIComponent(tenantId)}/billing/reports/monthly`, { params }),
    enabled: !!tenantId && params !== undefined,
    staleTime: 30_000,
  });
}

export function useBillingOutstandingInvoices(params?: Record<string, string | number | undefined>) {
  const tenantId = useBillingTenantId();
  return useQuery<TenantBillingOutstandingReport>({
    queryKey: ["billing-outstanding", tenantId, params],
    queryFn: () =>
      apiService.get(`/tenants/${encodeURIComponent(tenantId)}/billing/reports/outstanding`, { params }),
    enabled: !!tenantId && params !== undefined,
    staleTime: 30_000,
  });
}

export function useBillingSalesByProduct(params?: Record<string, string | number | undefined>) {
  const tenantId = useBillingTenantId();
  return useQuery<TenantBillingSalesByProductReport>({
    queryKey: ["billing-sales-by-product", tenantId, params],
    queryFn: () =>
      apiService.get(`/tenants/${encodeURIComponent(tenantId)}/billing/reports/sales-by-product`, { params }),
    enabled: !!tenantId && params !== undefined,
    staleTime: 30_000,
  });
}

export function useBillingStatistics(params?: Record<string, string | number | undefined>) {
  const tenantId = useBillingTenantId();
  return useQuery<TenantBillingStatisticsReport>({
    queryKey: ["billing-statistics", tenantId, params],
    queryFn: () =>
      apiService.get(`/tenants/${encodeURIComponent(tenantId)}/billing/reports/statistics`, { params }),
    enabled: !!tenantId && params !== undefined,
    staleTime: 30_000,
  });
}
