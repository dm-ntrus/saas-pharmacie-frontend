"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

function suppliersPath(pid: string) {
  return `/pharmacies/${pid}/suppliers`;
}

export function useSuppliers() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["suppliers", pid],
    queryFn: () => apiService.get(suppliersPath(pid)),
    enabled: !!pid,
  });
}

export function useSupplierById(id: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supplier", pid, id],
    queryFn: () => apiService.get(`${suppliersPath(pid)}/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useSupplierPerformance(supplierId: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supplier-performance", pid, supplierId],
    queryFn: () => apiService.get(`${suppliersPath(pid)}/${supplierId}/performance`),
    enabled: !!pid && !!supplierId,
  });
}

export function useCreateSupplier() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.post(suppliersPath(pid), data),
    onSuccess: () => {
      toast.success("Fournisseur créé");
      qc.invalidateQueries({ queryKey: ["suppliers", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSupplier() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.patch(`${suppliersPath(pid)}/${id}`, data),
    onSuccess: (_, { id }) => {
      toast.success("Fournisseur mis à jour");
      qc.invalidateQueries({ queryKey: ["suppliers", pid] });
      qc.invalidateQueries({ queryKey: ["supplier", pid, id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteSupplier() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`${suppliersPath(pid)}/${id}`),
    onSuccess: () => {
      toast.success("Fournisseur supprimé");
      qc.invalidateQueries({ queryKey: ["suppliers", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSupplierPurchaseOrders(supplierId?: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supplier-purchase-orders", pid, supplierId],
    queryFn: () =>
      apiService.get(`${suppliersPath(pid)}/purchase-orders`, {
        params: supplierId ? { supplierId } : {},
      }),
    enabled: !!pid,
  });
}

export function useAllPurchaseOrders(supplierId?: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["purchase-orders", pid, supplierId],
    queryFn: () =>
      apiService.get(`${suppliersPath(pid)}/purchase-orders`, {
        params: supplierId ? { supplierId } : {},
      }),
    enabled: !!pid,
  });
}

// Legacy alias used by some pages
export const usePurchaseOrders = useAllPurchaseOrders;

export function usePurchaseOrderById(id: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["purchase-order", pid, id],
    queryFn: () => apiService.get(`${suppliersPath(pid)}/purchase-orders/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useCreatePurchaseOrder() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`${suppliersPath(pid)}/purchase-orders`, data),
    onSuccess: () => {
      toast.success("Commande créée");
      qc.invalidateQueries({ queryKey: ["purchase-orders", pid] });
      qc.invalidateQueries({ queryKey: ["supplier-purchase-orders", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdatePurchaseOrderStatus() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiService.patch(`${suppliersPath(pid)}/purchase-orders/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase-orders", pid] });
      qc.invalidateQueries({ queryKey: ["purchase-order", pid] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSupplierProducts(supplierId: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supplier-products", pid, supplierId],
    queryFn: () => apiService.get(`${suppliersPath(pid)}/${supplierId}/products`),
    enabled: !!pid && !!supplierId,
  });
}

export function useSupplierContracts(supplierId: string | null) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supplier-contracts", pid, supplierId],
    queryFn: () => apiService.get(`${suppliersPath(pid)}/${supplierId}/contracts`),
    enabled: !!pid && !!supplierId,
  });
}

export function useCreateSupplierContract() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ supplierId, data }: { supplierId: string; data: Record<string, unknown> }) =>
      apiService.post(`${suppliersPath(pid)}/${supplierId}/contracts`, data),
    onSuccess: (_, { supplierId }) => {
      toast.success("Contrat créé");
      qc.invalidateQueries({ queryKey: ["supplier-contracts", pid, supplierId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
