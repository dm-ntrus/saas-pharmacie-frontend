"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { useOrganization } from "@/context/OrganizationContext";
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
} from "@/types/billing";

/** Tenant ID pour les routes billing: tenantId si présent, sinon organization id */
function useBillingTenantId(): string {
  const { currentOrganization } = useOrganization();
  if (!currentOrganization) return "";
  return (currentOrganization as { tenantId?: string }).tenantId || currentOrganization.id;
}

const subscriptionContextKey = "billing-subscription-context";
const subscriptionHistoryKey = "billing-subscription-history";

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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCheckoutDto) =>
      apiService.post<CheckoutSessionResponse>(
        `/tenants/${encodeURIComponent(tenantId)}/billing/checkout`,
        dto
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [subscriptionContextKey, tenantId] });
      qc.invalidateQueries({ queryKey: [subscriptionHistoryKey, tenantId] });
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erreur lors de la création de la session de paiement"
      ),
  });
}

export function usePortalSession() {
  const tenantId = useBillingTenantId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePortalDto) =>
      apiService.post<PortalSessionResponse>(
        `/tenants/${encodeURIComponent(tenantId)}/billing/portal`,
        dto
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [subscriptionContextKey, tenantId] });
    },
    onError: () =>
      toast.error("Impossible d'ouvrir le portail de facturation (aucun abonnement actif ?)"),
  });
}

// —— Paiements facture (tenants/:tenantId/billing/payments) ——

export function usePayInvoiceStripe() {
  const tenantId = useBillingTenantId();
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
      qc.invalidateQueries({ queryKey: [subscriptionContextKey, tenantId] });
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
      qc.invalidateQueries({ queryKey: [subscriptionContextKey, tenantId] });
      toast.success("Preuve de paiement envoyée");
    },
    onError: () => toast.error("Erreur lors de l'envoi de la preuve"),
  });
}

export function usePayInvoiceUpload() {
  const tenantId = useBillingTenantId();
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
      qc.invalidateQueries({ queryKey: [subscriptionContextKey, tenantId] });
      toast.success("Preuve de paiement envoyée");
    },
    onError: () => toast.error("Erreur lors de l'envoi du fichier"),
  });
}
