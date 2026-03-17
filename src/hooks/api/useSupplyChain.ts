"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
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
      toast.success("Réception enregistrée");
      qc.invalidateQueries({ queryKey: ["supply-chain-purchase-orders", pid] });
      qc.invalidateQueries({ queryKey: ["supply-chain-purchase-order", pid, id] });
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
