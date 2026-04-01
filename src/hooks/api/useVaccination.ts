"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { toast } from "react-hot-toast";
import type {
  ColdChainDevice,
  TemperatureReading,
  ColdChainAlert,
  VaccineVial,
  VaccinationAppointment,
  VaccinationInjection,
  VaccinationSideEffect,
  VaccinationCertificate,
  SmartProximityAlert,
  VaccineDemandForecast,
  DashboardMetric,
  VaccinationStats,
  ColdChainDashboard,
  VialDashboard,
  ProximityDashboard,
  RealTimeEvent,
  CreateColdChainDeviceDto,
  TemperatureReadingDto,
  AcknowledgeAlertDto,
  ResolveAlertDto,
  CreateVialDto,
  OpenVialDto,
  WithdrawDoseDto,
  ScheduleAppointmentDto,
  PreVaccinationQuestionnaireDto,
  RecordInjectionDto,
  ReportAdverseEventDto,
  GenerateCertificateDto,
  CreateProximityAlertDto,
  CreateDemandForecastDto,
} from "@/types/vaccination";

function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

function basePath(pharmacyId: string) {
  return `/pharmacies/${pharmacyId}/vaccination`;
}

function dashboardPath(pharmacyId: string) {
  return `${basePath(pharmacyId)}/dashboard`;
}

function buildQuery(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `?${q}` : "";
}

function safeId(id: string): string {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] ?? id : id;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export function useVaccinationDashboardMetrics() {
  const pid = usePharmacyId();
  return useQuery<DashboardMetric[]>({
    queryKey: ["vaccination-dashboard-metrics", pid],
    queryFn: () => apiService.get<DashboardMetric[]>(`${dashboardPath(pid)}/metrics`),
    enabled: !!pid,
    staleTime: 60_000,
  });
}

export function useVaccinationStats(period: "day" | "week" | "month" | "year" = "month") {
  const pid = usePharmacyId();
  return useQuery<VaccinationStats>({
    queryKey: ["vaccination-stats", pid, period],
    queryFn: () =>
      apiService.get<VaccinationStats>(`${dashboardPath(pid)}/stats${buildQuery({ period })}`),
    enabled: !!pid,
    staleTime: 60_000,
  });
}

export function useVaccinationColdChainDashboard() {
  const pid = usePharmacyId();
  return useQuery<ColdChainDashboard>({
    queryKey: ["vaccination-dashboard-cold-chain", pid],
    queryFn: () => apiService.get<ColdChainDashboard>(`${dashboardPath(pid)}/cold-chain`),
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useVaccinationVialDashboard() {
  const pid = usePharmacyId();
  return useQuery<VialDashboard>({
    queryKey: ["vaccination-dashboard-vials", pid],
    queryFn: () => apiService.get<VialDashboard>(`${dashboardPath(pid)}/vials`),
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useVaccinationProximityDashboard() {
  const pid = usePharmacyId();
  return useQuery<ProximityDashboard>({
    queryKey: ["vaccination-dashboard-proximity", pid],
    queryFn: () => apiService.get<ProximityDashboard>(`${dashboardPath(pid)}/proximity`),
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useVaccinationTimeSeries(
  metric: "vaccinations" | "appointments" | "revenue" | "wastage",
  granularity: "hour" | "day" | "week" | "month" = "day",
  days = 30
) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["vaccination-timeseries", pid, metric, granularity, days],
    queryFn: () =>
      apiService.get(
        `${dashboardPath(pid)}/timeseries${buildQuery({ metric, granularity, days })}`
      ),
    enabled: !!pid,
    staleTime: 60_000,
  });
}

export function useVaccinationComplianceReport(startDate: string, endDate: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["vaccination-compliance-report", pid, startDate, endDate],
    queryFn: () =>
      apiService.get(
        `${dashboardPath(pid)}/compliance-report${buildQuery({ startDate, endDate })}`
      ),
    enabled: !!pid && !!startDate && !!endDate,
    staleTime: 60_000,
  });
}

export function useVaccinationRealtimeEvents() {
  const pid = usePharmacyId();
  return useQuery<RealTimeEvent[]>({
    queryKey: ["vaccination-realtime-events", pid],
    queryFn: () => apiService.get<RealTimeEvent[]>(`${dashboardPath(pid)}/realtime/events`),
    enabled: !!pid,
    staleTime: 15_000,
  });
}

export function useVaccinationRealtimeMetrics() {
  const pid = usePharmacyId();
  return useQuery<DashboardMetric[]>({
    queryKey: ["vaccination-realtime-metrics", pid],
    queryFn: () => apiService.get<DashboardMetric[]>(`${dashboardPath(pid)}/realtime/metrics`),
    enabled: !!pid,
    staleTime: 15_000,
  });
}

// ─── Cold Chain ─────────────────────────────────────────────────────────────

export function useColdChainDevices() {
  const pid = usePharmacyId();
  return useQuery<ColdChainDevice[]>({
    queryKey: ["vaccination-cold-chain-devices", pid],
    queryFn: async () => {
      const res = await apiService.get<ColdChainDevice[]>(`${basePath(pid)}/cold-chain/devices`);
      return Array.isArray(res) ? res : [];
    },
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useColdChainDeviceById(deviceId: string) {
  const pid = usePharmacyId();
  const id = safeId(deviceId);
  return useQuery<ColdChainDevice>({
    queryKey: ["vaccination-cold-chain-device", pid, id],
    queryFn: () =>
      apiService.get<ColdChainDevice>(
        `${basePath(pid)}/cold-chain/devices/${id.includes(":") ? id : `cold_chain_devices:${id}`}`
      ),
    enabled: !!pid && !!id,
  });
}

export function useTemperatureReadings(deviceId: string, limit = 100) {
  const pid = usePharmacyId();
  const id = safeId(deviceId);
  return useQuery<TemperatureReading[]>({
    queryKey: ["vaccination-temperature-readings", pid, id, limit],
    queryFn: async () => {
      const res = await apiService.get<TemperatureReading[]>(
        `${basePath(pid)}/cold-chain/devices/${id.includes(":") ? id : `cold_chain_devices:${id}`}/readings${buildQuery({ limit })}`
      );
      return Array.isArray(res) ? res : [];
    },
    enabled: !!pid && !!id,
    staleTime: 15_000,
  });
}

export function useColdChainAlerts() {
  const pid = usePharmacyId();
  return useQuery<ColdChainAlert[]>({
    queryKey: ["vaccination-cold-chain-alerts", pid],
    queryFn: async () => {
      const res = await apiService.get<ColdChainAlert[]>(`${basePath(pid)}/cold-chain/alerts`);
      return Array.isArray(res) ? res : [];
    },
    enabled: !!pid,
    staleTime: 15_000,
  });
}

export function useCreateColdChainDevice() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateColdChainDeviceDto) =>
      apiService.post<ColdChainDevice>(`${basePath(pid)}/cold-chain/devices`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-cold-chain-devices", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-cold-chain", pid] });
      toast.success("Appareil enregistré");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erreur"
      ),
  });
}

export function useRecordTemperatureReading() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: TemperatureReadingDto) =>
      apiService.post(`${basePath(pid)}/cold-chain/temperature-reading`, dto),
    onSuccess: (_, dto) => {
      qc.invalidateQueries({ queryKey: ["vaccination-cold-chain-devices", pid] });
      qc.invalidateQueries({
        queryKey: ["vaccination-temperature-readings", pid, dto.deviceId],
      });
      qc.invalidateQueries({ queryKey: ["vaccination-cold-chain-alerts", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-cold-chain", pid] });
      toast.success("Lecture enregistrée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useAcknowledgeColdChainAlert() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ alertId, dto }: { alertId: string; dto: AcknowledgeAlertDto }) =>
      apiService.put(
        `${basePath(pid)}/cold-chain/alerts/${safeId(alertId)}/acknowledge`,
        dto
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-cold-chain-alerts", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-cold-chain", pid] });
      toast.success("Alerte accusée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useResolveColdChainAlert() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ alertId, dto }: { alertId: string; dto: ResolveAlertDto }) =>
      apiService.put(
        `${basePath(pid)}/cold-chain/alerts/${safeId(alertId)}/resolve`,
        dto
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-cold-chain-alerts", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-cold-chain", pid] });
      toast.success("Alerte résolue");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Vials ─────────────────────────────────────────────────────────────────

export function useVaccinationVials() {
  const pid = usePharmacyId();
  return useQuery<VaccineVial[]>({
    queryKey: ["vaccination-vials", pid],
    queryFn: async () => {
      const res = await apiService.get<VaccineVial[]>(`${basePath(pid)}/vials`);
      return Array.isArray(res) ? res : [];
    },
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useVaccinationVialById(vialId: string) {
  const pid = usePharmacyId();
  const id = safeId(vialId);
  return useQuery<VaccineVial>({
    queryKey: ["vaccination-vial", pid, id],
    queryFn: () =>
      apiService.get<VaccineVial>(
        `${basePath(pid)}/vials/${id.includes(":") ? id : `vaccine_vials:${id}`}`
      ),
    enabled: !!pid && !!id,
  });
}

export function useVialsNeedingAttention() {
  const pid = usePharmacyId();
  return useQuery<VaccineVial[]>({
    queryKey: ["vaccination-vials-attention", pid],
    queryFn: async () => {
      const res = await apiService.get<VaccineVial[]>(`${basePath(pid)}/vials/attention-needed`);
      return Array.isArray(res) ? res : [];
    },
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useVialWastage(vialId: string) {
  const pid = usePharmacyId();
  const id = safeId(vialId);
  return useQuery<{ wastageCost?: string; [key: string]: unknown }>({
    queryKey: ["vaccination-vial-wastage", pid, id],
    queryFn: () =>
      apiService.get(
        `${basePath(pid)}/vials/${id.includes(":") ? id : `vaccine_vials:${id}`}/wastage`
      ),
    enabled: !!pid && !!id,
  });
}

export function useCreateVial() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateVialDto) =>
      apiService.post<VaccineVial>(`${basePath(pid)}/vials`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-vials", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-vials-attention", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-vials", pid] });
      toast.success("Flacon enregistré");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erreur"
      ),
  });
}

export function useOpenVial() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ vialId, dto }: { vialId: string; dto: OpenVialDto }) =>
      apiService.post<VaccineVial>(
        `${basePath(pid)}/vials/${safeId(vialId)}/open`,
        { ...dto, vialId: vialId.includes(":") ? vialId : `vaccine_vials:${safeId(vialId)}` }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-vials", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-vials-attention", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-vials", pid] });
      toast.success("Flacon ouvert");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useWithdrawDoses() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ vialId, dto }: { vialId: string; dto: WithdrawDoseDto }) =>
      apiService.post(
        `${basePath(pid)}/vials/${safeId(vialId)}/withdraw`,
        { ...dto, vialId: vialId.includes(":") ? vialId : `vaccine_vials:${safeId(vialId)}` }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-vials", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-vials-attention", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-vials", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-stats", pid] });
      toast.success("Doses retirées");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Appointments ──────────────────────────────────────────────────────────

export function useVaccinationAppointments(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const pid = usePharmacyId();
  return useQuery<VaccinationAppointment[]>({
    queryKey: ["vaccination-appointments", pid, params],
    queryFn: async () => {
      const res = await apiService.get<VaccinationAppointment[]>(
        `${basePath(pid)}/appointments${buildQuery(params)}`
      );
      return Array.isArray(res) ? res : [];
    },
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useVaccinationAppointmentById(appointmentId: string) {
  const pid = usePharmacyId();
  const id = safeId(appointmentId);
  return useQuery<VaccinationAppointment>({
    queryKey: ["vaccination-appointment", pid, id],
    queryFn: () =>
      apiService.get<VaccinationAppointment>(
        `${basePath(pid)}/appointments/${id.includes(":") ? id : `vaccination_appointments:${id}`}`
      ),
    enabled: !!pid && !!id,
  });
}

export function useScheduleAppointment() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ScheduleAppointmentDto) =>
      apiService.post<VaccinationAppointment>(`${basePath(pid)}/appointments`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-appointments", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-stats", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-metrics", pid] });
      toast.success("Rendez-vous créé");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erreur"
      ),
  });
}

export function useSubmitPreVaccinationQuestionnaire() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      dto,
    }: {
      appointmentId: string;
      dto: PreVaccinationQuestionnaireDto;
    }) =>
      apiService.put<VaccinationAppointment>(
        `${basePath(pid)}/appointments/${safeId(appointmentId)}/questionnaire`,
        dto
      ),
    onSuccess: (_, { appointmentId }) => {
      qc.invalidateQueries({ queryKey: ["vaccination-appointments", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-appointment", pid, appointmentId] });
      toast.success("Questionnaire enregistré");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCheckInAppointment() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (appointmentId: string) =>
      apiService.post<VaccinationAppointment>(
        `${basePath(pid)}/appointments/${safeId(appointmentId)}/check-in`
      ),
    onSuccess: (_, appointmentId) => {
      qc.invalidateQueries({ queryKey: ["vaccination-appointments", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-appointment", pid, appointmentId] });
      toast.success("Patient enregistré");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCancelAppointment() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason: string }) =>
      apiService.put<VaccinationAppointment>(
        `${basePath(pid)}/appointments/${safeId(appointmentId)}/cancel`,
        { reason }
      ),
    onSuccess: (_, { appointmentId }) => {
      qc.invalidateQueries({ queryKey: ["vaccination-appointments", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-appointment", pid, appointmentId] });
      qc.invalidateQueries({ queryKey: ["vaccination-stats", pid] });
      toast.success("Rendez-vous annulé");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Injections ─────────────────────────────────────────────────────────────

export function useVaccinationInjectionById(injectionId: string) {
  const pid = usePharmacyId();
  const id = safeId(injectionId);
  return useQuery<VaccinationInjection>({
    queryKey: ["vaccination-injection", pid, id],
    queryFn: () =>
      apiService.get<VaccinationInjection>(
        `${basePath(pid)}/injections/${id.includes(":") ? id : `vaccination_injections:${id}`}`
      ),
    enabled: !!pid && !!id,
  });
}

export function useRecordInjection() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: RecordInjectionDto) =>
      apiService.post<VaccinationInjection>(`${basePath(pid)}/injections`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-appointments", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-vials", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-stats", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-metrics", pid] });
      toast.success("Injection enregistrée");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erreur"
      ),
  });
}

// ─── Adverse Events ────────────────────────────────────────────────────────

export function useReportAdverseEvent() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ReportAdverseEventDto) =>
      apiService.post<VaccinationSideEffect>(`${basePath(pid)}/adverse-events`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-adverse-events", pid] });
      toast.success("Effet indésirable déclaré");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erreur"
      ),
  });
}

export function useSubmitAdverseEventToNational() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) =>
      apiService.post(
        `${basePath(pid)}/adverse-events/${safeId(eventId)}/submit-national`
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-adverse-events", pid] });
      toast.success("Soumis au registre national");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Certificates ──────────────────────────────────────────────────────────

export function useVaccinationCertificateById(certificateId: string) {
  const pid = usePharmacyId();
  const id = safeId(certificateId);
  return useQuery<VaccinationCertificate>({
    queryKey: ["vaccination-certificate", pid, id],
    queryFn: () =>
      apiService.get<VaccinationCertificate>(
        `${basePath(pid)}/certificates/${id.includes(":") ? id : `vaccination_certificates:${id}`}`
      ),
    enabled: !!pid && !!id,
  });
}

export function useGenerateCertificate() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: GenerateCertificateDto) =>
      apiService.post<VaccinationCertificate>(`${basePath(pid)}/certificates`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-certificates", pid] });
      toast.success("Certificat généré");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Erreur"
      ),
  });
}

export function useVerifyCertificate(certificateId: string) {
  const pid = usePharmacyId();
  const id = safeId(certificateId);
  return useQuery({
    queryKey: ["vaccination-certificate-verify", pid, id],
    queryFn: () =>
      apiService.get(
        `${basePath(pid)}/certificates/${id.includes(":") ? id : `vaccination_certificates:${id}`}/verify`
      ),
    enabled: !!pid && !!id,
  });
}

// Certificate PDF: use apiService.get with responseType blob in component
export function getCertificatePdfUrl(pharmacyId: string, certificateId: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  return `${base}/pharmacies/${pharmacyId}/vaccination/certificates/${certificateId}/pdf`;
}

// ─── Proximity Alerts ─────────────────────────────────────────────────────

export function useProximityAlerts() {
  const pid = usePharmacyId();
  return useQuery<SmartProximityAlert[]>({
    queryKey: ["vaccination-proximity-alerts", pid],
    queryFn: async () => {
      const res = await apiService.get<SmartProximityAlert[]>(
        `${basePath(pid)}/proximity-alerts`
      );
      return Array.isArray(res) ? res : [];
    },
    enabled: !!pid,
    staleTime: 30_000,
  });
}

export function useCreateProximityAlert() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProximityAlertDto) =>
      apiService.post<SmartProximityAlert>(`${basePath(pid)}/proximity-alerts`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-proximity-alerts", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-proximity", pid] });
      toast.success("Alerte créée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useSendProximityNotifications() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) =>
      apiService.post(
        `${basePath(pid)}/proximity-alerts/${safeId(alertId)}/notify`
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-proximity-alerts", pid] });
      qc.invalidateQueries({ queryKey: ["vaccination-dashboard-proximity", pid] });
      toast.success("Notifications envoyées");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Demand Forecasts ───────────────────────────────────────────────────────

export function useDemandForecasts() {
  const pid = usePharmacyId();
  return useQuery<VaccineDemandForecast[]>({
    queryKey: ["vaccination-demand-forecasts", pid],
    queryFn: async () => {
      const res = await apiService.get<VaccineDemandForecast[]>(
        `${basePath(pid)}/demand-forecasts`
      );
      return Array.isArray(res) ? res : [];
    },
    enabled: !!pid,
    staleTime: 60_000,
  });
}

export function useGenerateDemandForecast() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDemandForecastDto) =>
      apiService.post<VaccineDemandForecast>(`${basePath(pid)}/demand-forecasts`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-demand-forecasts", pid] });
      toast.success("Prévision générée");
    },
    onError: () => toast.error("Erreur"),
  });
}

export function useCreatePurchaseOrderFromForecast() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (forecastId: string) =>
      apiService.post(
        `${basePath(pid)}/demand-forecasts/${safeId(forecastId)}/create-po`
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccination-demand-forecasts", pid] });
      toast.success("Commande créée");
    },
    onError: () => toast.error("Erreur"),
  });
}

// ─── Analytics & Reports ───────────────────────────────────────────────────

export function useVaccinationAnalytics(params?: { startDate?: string; endDate?: string }) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["vaccination-analytics", pid, params],
    queryFn: () =>
      apiService.get(`${basePath(pid)}/analytics/vaccinations${buildQuery(params)}`),
    enabled: !!pid,
    staleTime: 60_000,
  });
}

export function useComplianceReport(startDate: string, endDate: string, vaccineType?: string) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["vaccination-compliance", pid, startDate, endDate, vaccineType],
    queryFn: () =>
      apiService.get(
        `${basePath(pid)}/reports/compliance${buildQuery({
          startDate,
          endDate,
          vaccineType,
        })}`
      ),
    enabled: !!pid && !!startDate && !!endDate,
    staleTime: 60_000,
  });
}
