import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

function deliveryOrderKeys(pid: string, id?: string) {
  return id
    ? (["delivery-order", pid, id] as const)
    : (["delivery-orders", pid] as const);
}

export function useDeliveryQuote() {
  const pid = usePharmacyId();
  return useMutation({
    mutationFn: (body: {
      postal_code: string;
      city: string;
      latitude?: number;
      longitude?: number;
      subtotal?: number;
    }) => apiService.post(`/pharmacies/${pid}/delivery/quote`, body),
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? "Erreur devis"),
  });
}

export function useDeliveryOrders() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: deliveryOrderKeys(pid),
    queryFn: () => apiService.get(`/pharmacies/${pid}/delivery/orders`),
    enabled: !!pid,
  });
}

export function useCreateDeliveryOrder() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`/pharmacies/${pid}/delivery/orders`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-orders", pid] });
      toast.success("Commande de livraison créée");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? "Erreur"),
  });
}

export function useUpdateDeliveryStatus() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
      failure_reason,
    }: {
      id: string;
      status: string;
      notes?: string;
      failure_reason?: string;
    }) =>
      apiService.patch(`/pharmacies/${pid}/delivery/orders/${id}/status`, {
        status,
        notes,
        failure_reason,
      }),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["delivery-orders", pid] });
      qc.invalidateQueries({ queryKey: ["delivery-order", pid, v.id] });
      toast.success("Statut mis à jour");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? "Erreur"),
  });
}

export function useDeliveryOrderById(id: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["delivery-order", pid, id],
    queryFn: () =>
      apiService.get(`/pharmacies/${pid}/delivery/orders/${id}`),
    enabled: !!pid && !!id,
  });
}

export function useOrderTracking(orderId: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["delivery-tracking", pid, orderId],
    queryFn: () =>
      apiService.get(
        `/pharmacies/${pid}/delivery/orders/${orderId}/tracking`,
      ),
    enabled: !!pid && !!orderId,
  });
}

export function useAppendOrderTracking() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      body,
    }: {
      orderId: string;
      body: Record<string, unknown>;
    }) =>
      apiService.post(
        `/pharmacies/${pid}/delivery/orders/${orderId}/tracking`,
        body,
      ),
    onSuccess: (_, v) => {
      qc.invalidateQueries({
        queryKey: ["delivery-tracking", pid, v.orderId],
      });
      qc.invalidateQueries({ queryKey: ["delivery-order", pid, v.orderId] });
    },
  });
}

export function useProofOfDelivery() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      body,
    }: {
      orderId: string;
      body: Record<string, unknown>;
    }) =>
      apiService.post(
        `/pharmacies/${pid}/delivery/orders/${orderId}/proof`,
        body,
      ),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["delivery-orders", pid] });
      qc.invalidateQueries({ queryKey: ["delivery-order", pid, v.orderId] });
      qc.invalidateQueries({
        queryKey: ["delivery-tracking", pid, v.orderId],
      });
      toast.success("Preuve de livraison enregistrée");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? "Erreur"),
  });
}

export function usePlanDeliveryRoute() {
  const pid = usePharmacyId();
  return useMutation({
    mutationFn: (body: {
      order_ids: string[];
      depot_latitude: number;
      depot_longitude: number;
    }) => apiService.post(`/pharmacies/${pid}/delivery/routes/plan`, body),
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? "Erreur planification"),
  });
}

export function useAssignDriver() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      driverId,
    }: {
      orderId: string;
      driverId: string;
    }) =>
      apiService.patch(
        `/pharmacies/${pid}/delivery/orders/${orderId}/assign/${driverId}`,
        {},
      ),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["delivery-orders", pid] });
      qc.invalidateQueries({ queryKey: ["delivery-order", pid, v.orderId] });
      toast.success("Livreur assigné");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useAvailableDrivers() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["available-drivers", pid],
    queryFn: () =>
      apiService.get(`/pharmacies/${pid}/delivery/drivers/available`),
    enabled: !!pid,
  });
}

/** Tous les livreurs (onglet équipe). */
export function useAllDrivers() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["all-drivers", pid],
    queryFn: () => apiService.get(`/pharmacies/${pid}/delivery/drivers`),
    enabled: !!pid,
  });
}

export function useCreateDriver() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`/pharmacies/${pid}/delivery/drivers`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["available-drivers", pid] });
      qc.invalidateQueries({ queryKey: ["all-drivers", pid] });
      toast.success("Livreur enregistré");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateDriverLocation() {
  const pid = usePharmacyId();
  return useMutation({
    mutationFn: ({
      driverId,
      data,
    }: {
      driverId: string;
      data: { latitude: number; longitude: number };
    }) =>
      apiService.patch(
        `/pharmacies/${pid}/delivery/drivers/${driverId}/location`,
        data,
      ),
  });
}

export function useDeliveryZones() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["delivery-zones", pid],
    queryFn: () => apiService.get(`/pharmacies/${pid}/delivery/zones`),
    enabled: !!pid,
  });
}

export function useCreateDeliveryZone() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`/pharmacies/${pid}/delivery/zones`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-zones", pid] });
      toast.success("Zone créée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateDeliveryZone() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      zoneId,
      data,
    }: {
      zoneId: string;
      data: Record<string, unknown>;
    }) =>
      apiService.patch(
        `/pharmacies/${pid}/delivery/zones/${zoneId}`,
        data,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-zones", pid] });
      toast.success("Zone mise à jour");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? "Erreur"),
  });
}

export function useDeliveryMetrics() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["delivery-metrics", pid],
    queryFn: () => apiService.get(`/pharmacies/${pid}/delivery/metrics`),
    enabled: !!pid,
  });
}

/** Affichage nom livreur (API first_name / last_name). */
export function formatDriverName(d: Record<string, unknown>): string {
  const fn = String(d.first_name ?? d.firstName ?? "").trim();
  const ln = String(d.last_name ?? d.lastName ?? "").trim();
  const full = `${fn} ${ln}`.trim();
  if (full) return full;
  const n = String(d.name ?? "").trim();
  return n || "—";
}
