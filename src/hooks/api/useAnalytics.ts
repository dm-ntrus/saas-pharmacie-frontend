import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import type {
  BIDashboardOverview,
  KPIMetric,
  Dashboard,
  AnalyticsReport,
  CreateDashboardDto,
  UpdateDashboardDto,
  GenerateReportDto,
  KPIFrequency,
} from "@/types/analytics";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

/** GET /pharmacies/:id/bi/dashboard */
export function useBIDashboard() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["bi-dashboard", pharmacyId],
    queryFn: () =>
      apiService.get<BIDashboardOverview>(`/pharmacies/${pharmacyId}/bi/dashboard`),
    enabled: !!pharmacyId,
    staleTime: 60 * 1000,
  });
}

/** GET /pharmacies/:id/bi/kpis (query: startDate, endDate, frequency?) */
export function useBIKPIs(params: { startDate: string; endDate: string; frequency?: KPIFrequency }) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["bi-kpis", pharmacyId, params],
    queryFn: () =>
      apiService.get<KPIMetric[]>(`/pharmacies/${pharmacyId}/bi/kpis`, { params }),
    enabled: !!pharmacyId && !!params.startDate && !!params.endDate,
  });
}

/** GET /pharmacies/:id/bi/dashboards */
export function useBIDashboards() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["bi-dashboards", pharmacyId],
    queryFn: () =>
      apiService.get<Dashboard[]>(`/pharmacies/${pharmacyId}/bi/dashboards`),
    enabled: !!pharmacyId,
  });
}

/** GET /pharmacies/:id/bi/reports */
export function useBIReports() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["bi-reports", pharmacyId],
    queryFn: () =>
      apiService.get<AnalyticsReport[]>(`/pharmacies/${pharmacyId}/bi/reports`),
    enabled: !!pharmacyId,
  });
}

/** GET /pharmacies/:id/analytics/kpis */
export function useAnalyticsKPIs(frequency?: KPIFrequency) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["analytics-kpis", pharmacyId, frequency],
    queryFn: () =>
      apiService.get<KPIMetric[]>(`/pharmacies/${pharmacyId}/analytics/kpis`, {
        params: frequency ? { frequency } : {},
      }),
    enabled: !!pharmacyId,
  });
}

/** GET /pharmacies/:id/analytics/dashboards */
export function useAnalyticsDashboards(userId?: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["analytics-dashboards", pharmacyId, userId],
    queryFn: () =>
      apiService.get<Dashboard[]>(`/pharmacies/${pharmacyId}/analytics/dashboards`, {
        params: userId ? { userId } : {},
      }),
    enabled: !!pharmacyId,
  });
}

/** GET /pharmacies/:id/analytics/dashboards/:id */
export function useAnalyticsDashboardById(id: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["analytics-dashboard", pharmacyId, id],
    queryFn: () =>
      apiService.get<Dashboard>(`/pharmacies/${pharmacyId}/analytics/dashboards/${id}`),
    enabled: !!pharmacyId && !!id,
  });
}

/** POST /pharmacies/:id/analytics/dashboards */
export function useCreateAnalyticsDashboard() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDashboardDto) =>
      apiService.post<Dashboard>(`/pharmacies/${pharmacyId}/analytics/dashboards`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["analytics-dashboards", pharmacyId] });
      toast.success("Dashboard créé");
    },
    onError: () => toast.error("Erreur création dashboard"),
  });
}

/** PATCH /pharmacies/:id/analytics/dashboards/:id */
export function useUpdateAnalyticsDashboard() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDashboardDto }) =>
      apiService.patch<Dashboard>(`/pharmacies/${pharmacyId}/analytics/dashboards/${id}`, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["analytics-dashboard", pharmacyId, id] });
      qc.invalidateQueries({ queryKey: ["analytics-dashboards", pharmacyId] });
      toast.success("Dashboard mis à jour");
    },
    onError: () => toast.error("Erreur mise à jour"),
  });
}

/** POST /pharmacies/:id/analytics/reports/sales */
export function useGenerateSalesReport() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: GenerateReportDto) =>
      apiService.post<AnalyticsReport>(`/pharmacies/${pharmacyId}/analytics/reports/sales`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bi-reports", pharmacyId] });
      toast.success("Rapport ventes généré");
    },
    onError: () => toast.error("Erreur génération rapport"),
  });
}

/** POST /pharmacies/:id/analytics/reports/inventory */
export function useGenerateInventoryReport() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiService.post<AnalyticsReport>(`/pharmacies/${pharmacyId}/analytics/reports/inventory`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bi-reports", pharmacyId] });
      toast.success("Rapport inventaire généré");
    },
    onError: () => toast.error("Erreur génération rapport"),
  });
}
