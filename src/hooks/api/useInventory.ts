import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import type {
  Product,
  ProductQueryParams,
  CreateProductPayload,
  UpdateProductPayload,
  ProductBatch,
  CreateBatchPayload,
  UpdateBatchPayload,
  InventoryAlert,
  InventoryKPIs,
  InventoryLocation,
  CreateInventoryLocationPayload,
  UpdateInventoryLocationPayload,
} from "@/types/inventory";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

// ─── Products ────────────────────────────────────────────────

export function useProducts(params?: ProductQueryParams) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["products", pharmacyId, params],
    queryFn: async () => {
      const res = await apiService.get<{ data?: Product[]; products?: Product[]; total: number }>(
        `/pharmacies/${pharmacyId}/inventory/products`,
        { params },
      );
      const data = res?.data ?? res?.products ?? [];
      const total = res?.total ?? data.length;
      return { data, total };
    },
    enabled: !!pharmacyId,
  });
}

export function useProductById(id: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["product", pharmacyId, id],
    queryFn: () =>
      apiService.get<Product>(`/pharmacies/${pharmacyId}/inventory/products/${id}`),
    enabled: !!pharmacyId && !!id,
  });
}

export function useCreateProduct() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductPayload) =>
      apiService.post(`/pharmacies/${pharmacyId}/inventory/products`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products", pharmacyId] });
      toast.success("Produit créé avec succès");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Erreur lors de la création");
    },
  });
}

export function useUpdateProduct() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductPayload }) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/products/${id}`, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["product", pharmacyId, vars.id] });
      toast.success("Produit mis à jour");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Erreur de mise à jour");
    },
  });
}

export function useDeleteProduct() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.delete(`/pharmacies/${pharmacyId}/inventory/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products", pharmacyId] });
      toast.success("Produit supprimé");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? "Erreur lors de la suppression"),
  });
}

export function useProductsWithPrices(params?: ProductQueryParams) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["products-with-prices", pharmacyId, params],
    queryFn: () =>
      apiService.get<{ data?: Product[]; total: number }>(
        `/pharmacies/${pharmacyId}/inventory/products/with-prices`,
        { params },
      ),
    enabled: !!pharmacyId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductStockSummary(productId: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["product-stock-summary", pharmacyId, productId],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/products/${productId}/stock-summary`),
    enabled: !!pharmacyId && !!productId,
  });
}

export function useProductAvailableStock(productId: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["product-available-stock", pharmacyId, productId],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/products/${productId}/available-stock`),
    enabled: !!pharmacyId && !!productId,
  });
}

// ─── Batches (Lots) ───────────────────────────────────────────

export function useBatches(params?: { productId?: string; status?: string; page?: number; limit?: number }) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-batches", pharmacyId, params],
    queryFn: () =>
      apiService.get<{ batches: ProductBatch[]; total: number }>(
        `/pharmacies/${pharmacyId}/inventory/batches`,
        { params },
      ),
    enabled: !!pharmacyId,
    staleTime: 60 * 1000,
  });
}

export function useBatchById(id: string | null) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-batch", pharmacyId, id],
    queryFn: () =>
      apiService.get<ProductBatch>(`/pharmacies/${pharmacyId}/inventory/batches/${id}`),
    enabled: !!pharmacyId && !!id,
  });
}

export function useExpiringBatches(days = 30) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-batches-expiring", pharmacyId, days],
    queryFn: () =>
      apiService.get<ProductBatch[]>(
        `/pharmacies/${pharmacyId}/inventory/batches/expiring`,
        { params: { days } },
      ),
    enabled: !!pharmacyId,
  });
}

export function useCreateBatch() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBatchPayload) =>
      apiService.post(`/pharmacies/${pharmacyId}/inventory/batches`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-batches", pharmacyId] });
      toast.success("Lot créé");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erreur création lot"),
  });
}

export function useUpdateBatch() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBatchPayload }) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/batches/${id}`, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["inventory-batches", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["inventory-batch", pharmacyId, vars.id] });
      toast.success("Lot mis à jour");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erreur mise à jour"),
  });
}

export function useAdjustBatchQuantity() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      batchId,
      data,
    }: {
      batchId: string;
      data: { quantity: number; reason: string; userId: string };
    }) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/inventory/batches/${batchId}/adjust-quantity`,
        data,
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["inventory-batches", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["inventory-batch", pharmacyId, vars.batchId] });
      toast.success("Quantité ajustée");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erreur ajustement"),
  });
}

// ─── Alerts ──────────────────────────────────────────────────

export function useInventoryAlerts(params?: {
  severity?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-alerts", pharmacyId, params],
    queryFn: () =>
      apiService.get<{ data: InventoryAlert[]; total: number }>(
        `/pharmacies/${pharmacyId}/inventory/alerts`,
        { params },
      ),
    enabled: !!pharmacyId,
  });
}

export function useAlertStatistics() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-alert-stats", pharmacyId],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/alerts/statistics`),
    enabled: !!pharmacyId,
  });
}

export function useAcknowledgeAlert() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      alertId,
      action,
    }: {
      alertId: string;
      action: { userId: string; notes?: string };
    }) =>
      apiService.put(
        `/pharmacies/${pharmacyId}/inventory/alerts/${alertId}/acknowledge`,
        action,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-alerts", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["inventory-alert-stats", pharmacyId] });
      toast.success("Alerte acquittée");
    },
  });
}

export function useResolveAlert() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      alertId,
      action,
    }: {
      alertId: string;
      action: { resolvedBy: string; resolutionNotes?: string };
    }) =>
      apiService.put(
        `/pharmacies/${pharmacyId}/inventory/alerts/${alertId}/resolve`,
        action,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-alerts", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["inventory-alert-stats", pharmacyId] });
      toast.success("Alerte résolue");
    },
  });
}

export function useSnoozeAlert() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      alertId,
      snoozeUntil,
      userId,
      userName,
    }: {
      alertId: string;
      snoozeUntil: string;
      userId: string;
      userName: string;
    }) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/inventory/alerts/${alertId}/snooze`,
        { snoozeUntil, userId, userName },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-alerts", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["inventory-alert-stats", pharmacyId] });
      toast.success("Alerte reportée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useEscalateAlert() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      alertId,
      reason,
      userId,
      userName,
    }: {
      alertId: string;
      reason: string;
      userId: string;
      userName: string;
    }) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/inventory/alerts/${alertId}/escalate`,
        { reason, userId, userName },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-alerts", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["inventory-alert-stats", pharmacyId] });
      toast.success("Alerte escaladée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCreateAlert() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      productId?: string;
      locationId?: string;
      alertType: string;
      severity: string;
      message: string;
      details?: Record<string, unknown>;
    }) =>
      apiService.post(`/pharmacies/${pharmacyId}/inventory/alerts`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-alerts", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["inventory-alert-stats", pharmacyId] });
      toast.success("Alerte créée");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erreur"),
  });
}

// ─── Locations (Emplacements) ─────────────────────────────────

export function useLocations(params?: {
  type?: string;
  category?: string;
  active?: boolean;
}) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-locations", pharmacyId, params],
    queryFn: () =>
      apiService.get<InventoryLocation[]>(
        `/pharmacies/${pharmacyId}/inventory/locations`,
        { params },
      ),
    enabled: !!pharmacyId,
    staleTime: 60 * 1000,
  });
}

export function useLocationById(id: string | null) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-location", pharmacyId, id],
    queryFn: () =>
      apiService.get<InventoryLocation>(
        `/pharmacies/${pharmacyId}/inventory/locations/${id}`,
      ),
    enabled: !!pharmacyId && !!id,
  });
}

export function useCapacityDashboard() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["capacity-dashboard", pharmacyId],
    queryFn: () =>
      apiService.get<{
        total_locations?: number;
        available?: number;
        near_capacity?: number;
        locations?: InventoryLocation[];
      }>(`/pharmacies/${pharmacyId}/inventory/capacity-dashboard`),
    enabled: !!pharmacyId,
    staleTime: 30 * 1000,
  });
}

export function useOverstockedLocations(threshold = 90) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["overstocked-locations", pharmacyId, threshold],
    queryFn: () =>
      apiService.get<InventoryLocation[]>(
        `/pharmacies/${pharmacyId}/inventory/locations/overstocked`,
        { params: { threshold } },
      ),
    enabled: !!pharmacyId,
  });
}

export function useUnderutilizedLocations(threshold = 10) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["underutilized-locations", pharmacyId, threshold],
    queryFn: () =>
      apiService.get<InventoryLocation[]>(
        `/pharmacies/${pharmacyId}/inventory/locations/underutilized`,
        { params: { threshold } },
      ),
    enabled: !!pharmacyId,
  });
}

export function useCreateLocation() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInventoryLocationPayload) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/inventory/locations`,
        data,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-locations", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["capacity-dashboard", pharmacyId] });
      toast.success("Emplacement créé");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? "Erreur création emplacement"),
  });
}

export function useUpdateLocation() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateInventoryLocationPayload;
    }) =>
      apiService.put(
        `/pharmacies/${pharmacyId}/inventory/locations/${id}`,
        data,
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["inventory-locations", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["inventory-location", pharmacyId, vars.id] });
      qc.invalidateQueries({ queryKey: ["capacity-dashboard", pharmacyId] });
      toast.success("Emplacement mis à jour");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? "Erreur mise à jour"),
  });
}

export function useBlockLocation() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      locationId,
      body,
    }: {
      locationId: string;
      body: { userId: string; userName: string; estimatedDurationMinutes?: number };
    }) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/inventory/locations/${locationId}/block`,
        body,
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["inventory-locations", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["inventory-location", pharmacyId, vars.locationId] });
      qc.invalidateQueries({ queryKey: ["capacity-dashboard", pharmacyId] });
      toast.success("Emplacement bloqué");
    },
  });
}

export function useUnblockLocation() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      locationId,
      body,
    }: {
      locationId: string;
      body: { userId: string; userName: string };
    }) =>
      apiService.post(
        `/pharmacies/${pharmacyId}/inventory/locations/${locationId}/unblock`,
        body,
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["inventory-locations", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["inventory-location", pharmacyId, vars.locationId] });
      qc.invalidateQueries({ queryKey: ["capacity-dashboard", pharmacyId] });
      toast.success("Emplacement débloqué");
    },
  });
}

// ─── KPIs ────────────────────────────────────────────────────

export function useInventoryKPIs(periodDays = 30) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-kpis", pharmacyId, periodDays],
    queryFn: () =>
      apiService.get<InventoryKPIs>(
        `/pharmacies/${pharmacyId}/inventory/kpis`,
        { params: { periodDays } },
      ),
    enabled: !!pharmacyId,
  });
}

export function useExpirationRisk() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-expiration-risk", pharmacyId],
    queryFn: () =>
      apiService.get(
        `/pharmacies/${pharmacyId}/inventory/kpis/expiration-risk`,
      ),
    enabled: !!pharmacyId,
  });
}

export function useStockValuation() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-stock-valuation", pharmacyId],
    queryFn: () =>
      apiService.get(
        `/pharmacies/${pharmacyId}/inventory/kpis/stock-valuation`,
      ),
    enabled: !!pharmacyId,
  });
}

// ─── Audit Trail ─────────────────────────────────────────────

export function useAuditTrail(params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-audit-trail", pharmacyId, params],
    queryFn: () =>
      apiService.get(
        `/pharmacies/${pharmacyId}/inventory/audit-trail`,
        { params },
      ),
    enabled: !!pharmacyId,
  });
}

// ─── Stock Transfers ──────────────────────────────────────────

export function useStockTransfers(params?: { status?: string; limit?: number }) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["stock-transfers", pharmacyId, params],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/transfers`, { params }),
    enabled: !!pharmacyId,
  });
}

export function useStockTransferById(id: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["stock-transfer", id],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/transfers/${id}`),
    enabled: !!pharmacyId && !!id,
  });
}

export function useCreateStockTransfer() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      apiService.post(`/pharmacies/${pharmacyId}/inventory/transfers`, data),
    onSuccess: () => {
      toast.success("Transfert créé");
      qc.invalidateQueries({ queryKey: ["stock-transfers"] });
    },
    onError: () => toast.error("Erreur lors de la création"),
  });
}

export function useApproveTransfer() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/transfers/${id}/approve`, {}),
    onSuccess: () => {
      toast.success("Transfert approuvé");
      qc.invalidateQueries({ queryKey: ["stock-transfers"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useShipTransfer() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/transfers/${id}/ship`, {}),
    onSuccess: () => {
      toast.success("Transfert expédié");
      qc.invalidateQueries({ queryKey: ["stock-transfers"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useReceiveTransfer() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/transfers/${id}/receive`, data),
    onSuccess: () => {
      toast.success("Transfert réceptionné");
      qc.invalidateQueries({ queryKey: ["stock-transfers"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCancelTransfer() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/transfers/${id}/cancel`, {}),
    onSuccess: () => {
      toast.success("Transfert annulé");
      qc.invalidateQueries({ queryKey: ["stock-transfers"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateTransfer() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/transfers/${id}`, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["stock-transfers", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["stock-transfer", vars.id] });
      toast.success("Transfert mis à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Inventory Counts ─────────────────────────────────────────

export function useInventoryCounts(params?: { status?: string; limit?: number }) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-counts", pharmacyId, params],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/counts`, { params }),
    enabled: !!pharmacyId,
  });
}

export function useCountById(id: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-count", id],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/counts/${id}`),
    enabled: !!pharmacyId && !!id,
  });
}

export function useCreateInventoryCount() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      apiService.post(`/pharmacies/${pharmacyId}/inventory/counts`, data),
    onSuccess: () => {
      toast.success("Comptage créé");
      qc.invalidateQueries({ queryKey: ["inventory-counts"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useStartCount() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/counts/${id}/start`, {}),
    onSuccess: (_, id) => {
      toast.success("Comptage démarré");
      qc.invalidateQueries({ queryKey: ["inventory-count", id] });
      qc.invalidateQueries({ queryKey: ["inventory-counts"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useSubmitCountLine() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/counts/${id}/submit-line`, data),
    onSuccess: (_, { id }) => {
      toast.success("Ligne soumise");
      qc.invalidateQueries({ queryKey: ["inventory-count", id] });
      qc.invalidateQueries({ queryKey: ["inventory-counts"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCompleteCount() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/counts/${id}/complete`, {}),
    onSuccess: () => {
      toast.success("Comptage terminé");
      qc.invalidateQueries({ queryKey: ["inventory-counts"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useApplyCountAdjustments() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/counts/${id}/apply-adjustments`, {}),
    onSuccess: () => {
      toast.success("Ajustements appliqués");
      qc.invalidateQueries({ queryKey: ["inventory-counts"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCancelCount() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/counts/${id}/cancel`, {}),
    onSuccess: () => {
      toast.success("Comptage annulé");
      qc.invalidateQueries({ queryKey: ["inventory-counts"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Batch Recalls ────────────────────────────────────────────

export function useBatchRecalls(params?: { status?: string; limit?: number }) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["batch-recalls", pharmacyId, params],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/recalls`, { params }),
    enabled: !!pharmacyId,
  });
}

export function useRecallById(id: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["batch-recall", id],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/recalls/${id}`),
    enabled: !!pharmacyId && !!id,
  });
}

export function useCreateBatchRecall() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      apiService.post(`/pharmacies/${pharmacyId}/inventory/recalls`, data),
    onSuccess: () => {
      toast.success("Rappel créé");
      qc.invalidateQueries({ queryKey: ["batch-recalls"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useActivateRecall() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/recalls/${id}/activate`, {}),
    onSuccess: () => {
      toast.success("Rappel activé");
      qc.invalidateQueries({ queryKey: ["batch-recalls"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCompleteRecall() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/recalls/${id}/complete`, {}),
    onSuccess: () => {
      toast.success("Rappel clôturé");
      qc.invalidateQueries({ queryKey: ["batch-recalls"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCancelRecall() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/recalls/${id}/cancel`, {}),
    onSuccess: () => {
      toast.success("Rappel annulé");
      qc.invalidateQueries({ queryKey: ["batch-recalls"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useRecallUpdateReturns() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { returnedQuantity?: number; notes?: string } }) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/recalls/${id}/update-returns`, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["batch-recalls", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["batch-recall", vars.id] });
      toast.success("Retours mis à jour");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Reservations ──────────────────────────────────────────────

export function useReservations(params?: { productId?: string; status?: string }) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-reservations", pharmacyId, params],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/reservations`, { params }),
    enabled: !!pharmacyId,
  });
}

export function useCreateReservation() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { productId: string; batchId?: string; quantity: number; expiresAt?: string }) =>
      apiService.post(`/pharmacies/${pharmacyId}/inventory/reservations`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-reservations", pharmacyId] });
      toast.success("Réservation créée");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erreur"),
  });
}

export function useCancelReservation() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/reservations/${id}/cancel`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-reservations", pharmacyId] });
      toast.success("Réservation annulée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCommitReservation() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.put(`/pharmacies/${pharmacyId}/inventory/reservations/${id}/commit`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory-reservations", pharmacyId] });
      qc.invalidateQueries({ queryKey: ["products", pharmacyId] });
      toast.success("Réservation validée");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Controlled substances ────────────────────────────────────

export function useControlledSubstanceLogs(params?: {
  productId?: string;
  batchId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["controlled-substance-logs", pharmacyId, params],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/controlled-substances`, { params }),
    enabled: !!pharmacyId,
  });
}

export function useCreateControlledSubstanceLog() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      productId: string;
      batchId?: string;
      action: string;
      quantity: number;
      balanceAfter?: number;
      performedBy?: string;
      notes?: string;
    }) =>
      apiService.post(`/pharmacies/${pharmacyId}/inventory/controlled-substances/log`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["controlled-substance-logs", pharmacyId] });
      toast.success("Entrée enregistrée");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erreur"),
  });
}

// ─── Reports & analytics ───────────────────────────────────────

export function useExpiringBatchesReport(days?: number) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["expiring-batches-report", pharmacyId, days],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/inventory/reports/expiring-batches`, {
        params: days != null ? { days } : undefined,
      }),
    enabled: !!pharmacyId,
  });
}

// ─── Dashboard (base path: /pharmacies/:id/dashboard) ───────────

export function useDashboardMetricsSnapshot() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["dashboard-metrics-snapshot", pharmacyId],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/dashboard/metrics/snapshot`),
    enabled: !!pharmacyId,
    staleTime: 30 * 1000,
  });
}

export function useDashboardChartsAll(days = 30) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["dashboard-charts-all", pharmacyId, days],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/dashboard/charts/all`, { params: { days } }),
    enabled: !!pharmacyId,
    staleTime: 60 * 1000,
  });
}

export function useDashboardTimeline(limit = 10) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["dashboard-timeline", pharmacyId, limit],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/dashboard/timeline`, { params: { limit } }),
    enabled: !!pharmacyId,
    staleTime: 30 * 1000,
  });
}

export function useDashboardFull(period: "daily" | "weekly" | "monthly" | "quarterly" = "daily") {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["dashboard-full", pharmacyId, period],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/dashboard/full`, { params: { period } }),
    enabled: !!pharmacyId,
    staleTime: 60 * 1000,
  });
}

export function useDashboardExportSummary() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: async () => {
      const data = await apiService.get(`/pharmacies/${pharmacyId}/dashboard/export/summary`);
      return data as Record<string, unknown>;
    },
  });
}

// ─── Product Pricing ──────────────────────────────────────────

export function useProductPrices() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["product-prices", pharmacyId],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/product-prices`),
    enabled: !!pharmacyId,
  });
}

export function useProductEffectivePrice(productId: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["product-effective-price", pharmacyId, productId],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/product-prices/products/${productId}/effective`),
    enabled: !!pharmacyId && !!productId,
  });
}

export function useCreateProductPrice() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      apiService.post(`/pharmacies/${pharmacyId}/product-prices`, data),
    onSuccess: () => {
      toast.success("Prix créé");
      qc.invalidateQueries({ queryKey: ["product-prices"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateProductPrice() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ priceId, data }: { priceId: string; data: any }) =>
      apiService.put(`/pharmacies/${pharmacyId}/product-prices/${priceId}`, data),
    onSuccess: () => {
      toast.success("Prix mis à jour");
      qc.invalidateQueries({ queryKey: ["product-prices"] });
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useDeleteProductPrice() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (priceId: string) =>
      apiService.delete(`/pharmacies/${pharmacyId}/product-prices/${priceId}`),
    onSuccess: () => {
      toast.success("Prix supprimé");
      qc.invalidateQueries({ queryKey: ["product-prices"] });
    },
    onError: () => toast.error("Erreur"),
  });
}
