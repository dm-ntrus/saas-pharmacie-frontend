import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/services/api.service";
import type {
  InsuranceProvider,
  CreateInsuranceProviderDto,
  UpdateInsuranceProviderDto,
} from "@/types/insurance";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

/** GET /pharmacies/:id/insurance-providers */
export function useInsuranceProviders() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["insurance-providers", pharmacyId],
    queryFn: async () => {
      const res = await apiService.get<InsuranceProvider[] | { data?: InsuranceProvider[] }>(
        `/pharmacies/${pharmacyId}/insurance-providers`
      );
      return Array.isArray(res) ? res : res?.data ?? [];
    },
    enabled: !!pharmacyId,
  });
}

/** GET /pharmacies/:id/insurance-providers/:id */
export function useInsuranceProviderById(id: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["insurance-provider", pharmacyId, id],
    queryFn: () =>
      apiService.get<InsuranceProvider>(`/pharmacies/${pharmacyId}/insurance-providers/${id}`),
    enabled: !!pharmacyId && !!id,
  });
}

/** POST /pharmacies/:id/insurance-providers */
export function useCreateInsuranceProvider() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateInsuranceProviderDto) =>
      apiService.post<InsuranceProvider>(`/pharmacies/${pharmacyId}/insurance-providers`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["insurance-providers", pharmacyId] });
      toast.success("Assureur créé");
    },
    onError: (e: unknown) => toast.error((e as Error)?.message ?? "Erreur création"),
  });
}

/** PATCH /pharmacies/:id/insurance-providers/:id */
export function useUpdateInsuranceProvider() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateInsuranceProviderDto }) =>
      apiService.patch<InsuranceProvider>(`/pharmacies/${pharmacyId}/insurance-providers/${id}`, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["insurance-provider", pharmacyId, id] });
      qc.invalidateQueries({ queryKey: ["insurance-providers", pharmacyId] });
      toast.success("Assureur mis à jour");
    },
    onError: () => toast.error("Erreur mise à jour"),
  });
}

/** DELETE /pharmacies/:id/insurance-providers/:id */
export function useDeleteInsuranceProvider() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.delete(`/pharmacies/${pharmacyId}/insurance-providers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["insurance-providers", pharmacyId] });
      toast.success("Assureur supprimé");
    },
    onError: () => toast.error("Erreur suppression"),
  });
}
