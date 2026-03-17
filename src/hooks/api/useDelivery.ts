import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

export function useDeliveryOrders() {
  const pid = usePharmacyId();
  return useQuery({ queryKey: ["delivery-orders", pid], queryFn: () => apiService.get(`/pharmacies/${pid}/delivery/orders`), enabled: !!pid });
}

export function useCreateDeliveryOrder() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.post(`/pharmacies/${pid}/delivery/orders`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["delivery-orders", pid] }); toast.success("Commande de livraison créée"); },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erreur"),
  });
}

export function useUpdateDeliveryStatus() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      apiService.patch(`/pharmacies/${pid}/delivery/orders/${id}/status`, { status, notes }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["delivery-orders", pid] }); toast.success("Statut mis à jour"); },
  });
}

export function useDeliveryOrderById(id: string) {
  const pid = usePharmacyId();
  return useQuery({ queryKey: ["delivery-order", id], queryFn: () => apiService.get(`/pharmacies/${pid}/delivery/orders/${id}`), enabled: !!pid && !!id });
}

export function useAssignDriver() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, driverId }: { orderId: string; driverId: string }) =>
      apiService.patch(`/pharmacies/${pid}/delivery/orders/${orderId}/assign/${driverId}`, {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["delivery-orders", pid] }); toast.success("Livreur assigné"); },
    onError: () => toast.error("Erreur"),
  });
}

export function useAvailableDrivers() {
  const pid = usePharmacyId();
  return useQuery({ queryKey: ["available-drivers", pid], queryFn: () => apiService.get(`/pharmacies/${pid}/delivery/drivers/available`), enabled: !!pid });
}

export function useCreateDriver() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.post(`/pharmacies/${pid}/delivery/drivers`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["available-drivers", pid] }); toast.success("Livreur enregistré"); },
    onError: () => toast.error("Erreur"),
  });
}

export function useUpdateDriverLocation() {
  const pid = usePharmacyId();
  return useMutation({
    mutationFn: ({ driverId, data }: { driverId: string; data: any }) =>
      apiService.patch(`/pharmacies/${pid}/delivery/drivers/${driverId}/location`, data),
  });
}

export function useDeliveryZones() {
  const pid = usePharmacyId();
  return useQuery({ queryKey: ["delivery-zones", pid], queryFn: () => apiService.get(`/pharmacies/${pid}/delivery/zones`), enabled: !!pid });
}

export function useCreateDeliveryZone() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.post(`/pharmacies/${pid}/delivery/zones`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["delivery-zones", pid] }); toast.success("Zone créée"); },
    onError: () => toast.error("Erreur"),
  });
}

export function useDeliveryMetrics() {
  const pid = usePharmacyId();
  return useQuery({ queryKey: ["delivery-metrics", pid], queryFn: () => apiService.get(`/pharmacies/${pid}/delivery/metrics`), enabled: !!pid });
}
