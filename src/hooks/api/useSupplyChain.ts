"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

function supplyChainPath(pid: string) {
  return `/pharmacies/${pid}/supply-chain`;
}

export function useSupplyChainDashboard() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supply-chain-dashboard", pid],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/dashboard`),
    enabled: !!pid,
  });
}

export function useSupplyChainSuppliers(params?: Record<string, unknown>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supply-chain-suppliers", pid, params],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/suppliers`, { params }),
    enabled: !!pid,
  });
}

export function useSupplyChainSupplierById(id: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supply-chain-supplier", pid, id],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/suppliers/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateSupplyChainSupplier() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${supplyChainPath(pid)}/suppliers`, data),
    onSuccess: () => {
      toast.success("Fournisseur créé");
      qc.invalidateQueries({ queryKey: ["supply-chain-suppliers", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSupplyChainSupplier() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.put(`${supplyChainPath(pid)}/suppliers/${id}`, data),
    onSuccess: (_, { id }) => {
      toast.success("Fournisseur mis à jour");
      qc.invalidateQueries({ queryKey: ["supply-chain-suppliers", pid] });
      qc.invalidateQueries({ queryKey: ["supply-chain-supplier", pid, id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSupplierRating() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      rating,
      reason,
      onTimeDeliveryRate,
      qualityScore,
      responsivenessScore,
    }: {
      id: string;
      rating: number;
      reason?: string;
      onTimeDeliveryRate?: number;
      qualityScore?: number;
      responsivenessScore?: number;
    }) =>
      apiService.put(`${supplyChainPath(pid)}/suppliers/${id}/rating`, {
        rating,
        reason,
        onTimeDeliveryRate,
        qualityScore,
        responsivenessScore,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["supply-chain-suppliers", pid] });
      qc.invalidateQueries({ queryKey: ["supply-chain-dashboard", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteSupplyChainSupplier() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`${supplyChainPath(pid)}/suppliers/${id}`),
    onSuccess: () => {
      toast.success("Fournisseur supprimé");
      qc.invalidateQueries({ queryKey: ["supply-chain-suppliers", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSupplyChainPurchaseOrders(params?: Record<string, unknown>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supply-chain-purchase-orders", pid, params],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/purchase-orders`, { params }),
    enabled: !!pid,
  });
}

export function useSupplyChainPurchaseOrderById(id: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supply-chain-purchase-order", pid, id],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/purchase-orders/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateSupplyChainPurchaseOrder() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${supplyChainPath(pid)}/purchase-orders`, data),
    onSuccess: () => {
      toast.success("Commande créée");
      qc.invalidateQueries({ queryKey: ["supply-chain-purchase-orders", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSupplyChainPurchaseOrder() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.put(`${supplyChainPath(pid)}/purchase-orders/${id}`, data),
    onSuccess: (_, { id }) => {
      toast.success("Commande mise à jour");
      qc.invalidateQueries({ queryKey: ["supply-chain-purchase-orders", pid] });
      qc.invalidateQueries({ queryKey: ["supply-chain-purchase-order", pid, id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useReceiveSupplyChainPurchaseOrder() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.post(`${supplyChainPath(pid)}/purchase-orders/${id}/receive`, data),
    onSuccess: (_, { id }) => {
      toast.success("Réception enregistrée (GRN créé)");
      qc.invalidateQueries({ queryKey: ["supply-chain-purchase-orders", pid] });
      qc.invalidateQueries({ queryKey: ["supply-chain-purchase-order", pid, id] });
      qc.invalidateQueries({ queryKey: ["goods-receipts", pid, id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useGoodsReceiptsForPurchaseOrder(purchaseOrderId: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["goods-receipts", pid, purchaseOrderId],
    queryFn: () =>
      apiService.get(
        `${supplyChainPath(pid)}/goods-receipts?purchaseOrderId=${encodeURIComponent(purchaseOrderId ?? "")}`,
      ),
    enabled: !!pid && !!purchaseOrderId,
  });
}

export function useGoodsReceiptById(grnId: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["goods-receipt", pid, grnId],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/goods-receipts/${grnId}`),
    enabled: !!pid && !!grnId,
  });
}

export function usePurchaseRequests(params?: { status?: string; page?: number; limit?: number }) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["purchase-requests", pid, params],
    queryFn: () =>
      apiService.get(`${supplyChainPath(pid)}/purchase-requests`, { params }),
    enabled: !!pid,
  });
}

export function usePurchaseRequestById(id: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["purchase-request", pid, id],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/purchase-requests/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreatePurchaseRequest() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${supplyChainPath(pid)}/purchase-requests`, data),
    onSuccess: () => {
      toast.success("Demande d'achat créée");
      qc.invalidateQueries({ queryKey: ["purchase-requests", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSubmitPurchaseRequest() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post(`${supplyChainPath(pid)}/purchase-requests/${id}/submit`, {}),
    onSuccess: () => {
      toast.success("Demande soumise");
      qc.invalidateQueries({ queryKey: ["purchase-requests", pid] });
      qc.invalidateQueries({ queryKey: ["purchase-request", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useApprovePurchaseRequest() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post(`${supplyChainPath(pid)}/purchase-requests/${id}/approve`, {}),
    onSuccess: () => {
      toast.success("Demande approuvée");
      qc.invalidateQueries({ queryKey: ["purchase-requests", pid] });
      qc.invalidateQueries({ queryKey: ["purchase-request", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRejectPurchaseRequest() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiService.post(`${supplyChainPath(pid)}/purchase-requests/${id}/reject`, { reason }),
    onSuccess: () => {
      toast.success("Demande refusée");
      qc.invalidateQueries({ queryKey: ["purchase-requests", pid] });
      qc.invalidateQueries({ queryKey: ["purchase-request", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCancelPurchaseRequest() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post(`${supplyChainPath(pid)}/purchase-requests/${id}/cancel`, {}),
    onSuccess: () => {
      toast.success("Demande annulée");
      qc.invalidateQueries({ queryKey: ["purchase-requests", pid] });
      qc.invalidateQueries({ queryKey: ["purchase-request", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useConvertPurchaseRequest() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, supplierId }: { id: string; supplierId: string }) =>
      apiService.post(`${supplyChainPath(pid)}/purchase-requests/${id}/convert-to-order`, {
        supplierId,
      }),
    onSuccess: () => {
      toast.success("Bon de commande créé");
      qc.invalidateQueries({ queryKey: ["purchase-requests", pid] });
      qc.invalidateQueries({ queryKey: ["purchase-request", pid] });
      qc.invalidateQueries({ queryKey: ["supply-chain-purchase-orders", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCreateSupplierQuote() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${supplyChainPath(pid)}/supplier-quotes`, data),
    onSuccess: () => {
      toast.success("Devis enregistré");
      qc.invalidateQueries({ queryKey: ["supplier-quotes-compare", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSupplierQuotesCompare(productId: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supplier-quotes-compare", pid, productId],
    queryFn: () =>
      apiService.get(`${supplyChainPath(pid)}/supplier-quotes/compare`, {
        params: { productId },
      }),
    enabled: !!pid && !!productId,
  });
}

export function useDeleteSupplierQuote() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (quoteId: string) =>
      apiService.delete(`${supplyChainPath(pid)}/supplier-quotes/${quoteId}`),
    onSuccess: () => {
      toast.success("Devis supprimé");
      qc.invalidateQueries({ queryKey: ["supplier-quotes-compare", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDemandForecasts(params?: Record<string, unknown>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["demand-forecasts", pid, params],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/demand-forecasts`, { params }),
    enabled: !!pid,
  });
}

export function useDemandForecastById(id: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["demand-forecast", pid, id],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/demand-forecasts/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateDemandForecast() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${supplyChainPath(pid)}/demand-forecasts`, data),
    onSuccess: () => {
      toast.success("Prévision créée");
      qc.invalidateQueries({ queryKey: ["demand-forecasts", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateDemandForecast() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.put(`${supplyChainPath(pid)}/demand-forecasts/${id}`, data),
    onSuccess: (_, { id }) => {
      toast.success("Prévision mise à jour");
      qc.invalidateQueries({ queryKey: ["demand-forecasts", pid] });
      qc.invalidateQueries({ queryKey: ["demand-forecast", pid, id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useInventoryPolicies(params?: Record<string, unknown>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-policies", pid, params],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/inventory-policies`, { params }),
    enabled: !!pid,
  });
}

export function useInventoryPolicyById(id: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-policy", pid, id],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/inventory-policies/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreateInventoryPolicy() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${supplyChainPath(pid)}/inventory-policies`, data),
    onSuccess: () => {
      toast.success("Politique créée");
      qc.invalidateQueries({ queryKey: ["inventory-policies", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateInventoryPolicy() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.put(`${supplyChainPath(pid)}/inventory-policies/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-policies", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSupplierPerformances(params?: Record<string, unknown>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supplier-performances", pid, params],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/supplier-performance`, { params }),
    enabled: !!pid,
  });
}

export function useSupplyChainAlerts(params?: Record<string, unknown>) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supply-chain-alerts", pid, params],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/alerts`, { params }),
    enabled: !!pid,
  });
}

export function useSupplyChainAlertById(id: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supply-chain-alert", pid, id],
    queryFn: () => apiService.get(`${supplyChainPath(pid)}/alerts/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useUpdateSupplyChainAlert() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.put(`${supplyChainPath(pid)}/alerts/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["supply-chain-alerts", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCheckOverdueDeliveries() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiService.post(`${supplyChainPath(pid)}/check-overdue-deliveries`),
    onSuccess: () => {
      toast.success("Vérification des retards effectuée");
      qc.invalidateQueries({ queryKey: ["supply-chain-dashboard", pid] });
      qc.invalidateQueries({ queryKey: ["supply-chain-purchase-orders", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
