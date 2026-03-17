"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { useOrganization } from "@/context/OrganizationContext";
import type {
  Sale,
  CreateSaleDto,
  SalesReportSummary,
  CashierSession,
  OpenSessionDto,
  CloseSessionDto,
} from "@/types/sales";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

function basePath(pharmacyId: string) {
  return `/pharmacies/${pharmacyId}/sales`;
}

function sessionPath(pharmacyId: string) {
  return `/pharmacies/${pharmacyId}/cashier-sessions`;
}

// ─── Queries ──────────────────────────────────────────────

export function useSalesList() {
  const pharmacyId = usePharmacyId();
  return useQuery<Sale[]>({
    queryKey: ["sales", pharmacyId],
    queryFn: () => apiService.get<Sale[]>(basePath(pharmacyId)),
    enabled: !!pharmacyId,
    staleTime: 30_000,
  });
}

export function useSaleById(id: string) {
  const pharmacyId = usePharmacyId();
  return useQuery<Sale>({
    queryKey: ["sales", pharmacyId, id],
    queryFn: () => apiService.get<Sale>(`${basePath(pharmacyId)}/${id}`),
    enabled: !!pharmacyId && !!id,
  });
}

export function useSaleByNumber(saleNumber: string) {
  const pharmacyId = usePharmacyId();
  return useQuery<Sale>({
    queryKey: ["sales", pharmacyId, "number", saleNumber],
    queryFn: () =>
      apiService.get<Sale>(`${basePath(pharmacyId)}/number/${saleNumber}`),
    enabled: !!pharmacyId && !!saleNumber,
  });
}

export function useSalesReport(startDate: string, endDate: string) {
  const pharmacyId = usePharmacyId();
  return useQuery<SalesReportSummary>({
    queryKey: ["sales", pharmacyId, "report", startDate, endDate],
    queryFn: () =>
      apiService.get<SalesReportSummary>(
        `${basePath(pharmacyId)}/reports/summary?startDate=${startDate}&endDate=${endDate}`,
      ),
    enabled: !!pharmacyId && !!startDate && !!endDate,
  });
}

// ─── Mutations ────────────────────────────────────────────

export function useCreateSale() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSaleDto) =>
      apiService.post<{ sale: Sale }>(basePath(pharmacyId), data),
    onSuccess: () => {
      toast.success("Vente créée avec succès");
      qc.invalidateQueries({ queryKey: ["sales"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRefundSale() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      reason,
      refundAmount,
    }: {
      id: string;
      reason?: string;
      refundAmount?: number;
    }) =>
      apiService.put<Sale>(`${basePath(pharmacyId)}/${id}/refund`, {
        reason,
        refundAmount,
      }),
    onSuccess: () => {
      toast.success("Remboursement effectué");
      qc.invalidateQueries({ queryKey: ["sales"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useReserveCartItems() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: (
      items: Array<{
        productId: string;
        quantity: number;
        locationId?: string;
      }>,
    ) =>
      apiService.post(`${basePath(pharmacyId)}/cart/reserve`, { items }),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useReleaseCartReservations() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: (reservationIds: string[]) =>
      apiService.post(`${basePath(pharmacyId)}/cart/release`, {
        reservationIds,
      }),
  });
}

// ─── Cashier Sessions ─────────────────────────────────────

export function useActiveSession() {
  const pharmacyId = usePharmacyId();
  return useQuery<CashierSession | null>({
    queryKey: ["cashier-session", pharmacyId, "active"],
    queryFn: () =>
      apiService.get<CashierSession | null>(
        `${sessionPath(pharmacyId)}/active`,
      ),
    enabled: !!pharmacyId,
    staleTime: 10_000,
  });
}

export function useSessionHistory(params?: {
  cashierId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  const pharmacyId = usePharmacyId();
  const searchParams = new URLSearchParams();
  if (params?.cashierId) searchParams.set("cashierId", params.cashierId);
  if (params?.startDate) searchParams.set("startDate", params.startDate);
  if (params?.endDate) searchParams.set("endDate", params.endDate);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();

  return useQuery<CashierSession[]>({
    queryKey: ["cashier-session", pharmacyId, "history", params],
    queryFn: () =>
      apiService.get<CashierSession[]>(
        `${sessionPath(pharmacyId)}/history${qs ? `?${qs}` : ""}`,
      ),
    enabled: !!pharmacyId,
  });
}

export function useOpenSession() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: OpenSessionDto) =>
      apiService.post<CashierSession>(
        `${sessionPath(pharmacyId)}/open`,
        dto,
      ),
    onSuccess: () => {
      toast.success("Session de caisse ouverte");
      qc.invalidateQueries({ queryKey: ["cashier-session"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCloseSession() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      dto,
    }: {
      sessionId: string;
      dto: CloseSessionDto;
    }) =>
      apiService.put<CashierSession>(
        `${sessionPath(pharmacyId)}/${sessionId}/close`,
        dto,
      ),
    onSuccess: () => {
      toast.success("Session de caisse clôturée");
      qc.invalidateQueries({ queryKey: ["cashier-session"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useXReport(sessionId: string) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["cashier-session", pharmacyId, sessionId, "x-report"],
    queryFn: () =>
      apiService.get(
        `${sessionPath(pharmacyId)}/${sessionId}/x-report`,
      ),
    enabled: !!pharmacyId && !!sessionId,
  });
}

// ─── Dashboard (base path: .../sales/dashboard) ─────────────────────

const dashboardPath = (pharmacyId: string) =>
  `/pharmacies/${pharmacyId}/sales/dashboard`;

export type DashboardPeriod = "today" | "week" | "month" | "quarter" | "year";

export function useSalesDashboard(period: DashboardPeriod = "month") {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-dashboard", pharmacyId, period],
    queryFn: () =>
      apiService.get<Record<string, unknown>>(dashboardPath(pharmacyId), {
        params: { period },
      }),
    enabled: !!pharmacyId,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useSalesDashboardKPIs(period: DashboardPeriod = "month") {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-dashboard-kpis", pharmacyId, period],
    queryFn: () =>
      apiService.get<{ kpis: unknown; lastUpdated: string }>(
        `${dashboardPath(pharmacyId)}/kpis`,
        { params: { period } },
      ),
    enabled: !!pharmacyId,
    staleTime: 30_000,
  });
}

export function useSalesDashboardRealtime() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-dashboard-realtime", pharmacyId],
    queryFn: () =>
      apiService.get<Record<string, unknown>>(
        `${dashboardPath(pharmacyId)}/realtime`,
      ),
    enabled: !!pharmacyId,
    staleTime: 15_000,
  });
}

export function useSalesDashboardTimeseries(period: DashboardPeriod = "month") {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-dashboard-timeseries", pharmacyId, period],
    queryFn: () =>
      apiService.get<{ timeSeries: unknown; period: string }>(
        `${dashboardPath(pharmacyId)}/timeseries`,
        { params: { period } },
      ),
    enabled: !!pharmacyId,
    staleTime: 30_000,
  });
}

export function useSalesDashboardPayments(period: DashboardPeriod = "month") {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-dashboard-payments", pharmacyId, period],
    queryFn: () =>
      apiService.get<{ paymentMethods: unknown }>(
        `${dashboardPath(pharmacyId)}/payments`,
        { params: { period } },
      ),
    enabled: !!pharmacyId,
    staleTime: 30_000,
  });
}

export function useSalesDashboardProducts(
  period: DashboardPeriod = "month",
  limit = 20,
) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-dashboard-products", pharmacyId, period, limit],
    queryFn: () =>
      apiService.get<{ products: unknown }>(
        `${dashboardPath(pharmacyId)}/products`,
        { params: { period, limit } },
      ),
    enabled: !!pharmacyId,
    staleTime: 30_000,
  });
}

export function useSalesDashboardCompare(params: {
  currentStart: string;
  currentEnd: string;
  previousStart: string;
  previousEnd: string;
}) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-dashboard-compare", pharmacyId, params],
    queryFn: () =>
      apiService.get<Record<string, unknown>>(
        `${dashboardPath(pharmacyId)}/compare`,
        { params },
      ),
    enabled: !!pharmacyId && !!params.currentStart && !!params.previousStart,
  });
}

export function useSalesDashboardExport() {
  const pharmacyId = usePharmacyId();
  return useMutation({
    mutationFn: (params: {
      format?: "json" | "csv";
      startDate: string;
      endDate: string;
      includeItems?: boolean;
    }) =>
      apiService.get<Record<string, unknown>>(
        `${dashboardPath(pharmacyId)}/export`,
        { params },
      ),
  });
}

// ─── Live (base path: .../sales/live) ───────────────────────────────

const livePath = (pharmacyId: string) =>
  `/pharmacies/${pharmacyId}/sales/live`;

export function useSalesLiveKPIs() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-live-kpis", pharmacyId],
    queryFn: () =>
      apiService.get<{ success: boolean; data: unknown }>(
        `${livePath(pharmacyId)}/kpis`,
      ),
    enabled: !!pharmacyId,
    staleTime: 10_000,
  });
}

export function useSalesLiveSnapshot() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-live-snapshot", pharmacyId],
    queryFn: () =>
      apiService.get<{ success: boolean; data: Record<string, unknown> }>(
        `${livePath(pharmacyId)}/snapshot`,
      ),
    enabled: !!pharmacyId,
    staleTime: 15_000,
  });
}

export function useSalesLiveProductVelocity() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-live-velocity", pharmacyId],
    queryFn: () =>
      apiService.get<{ success: boolean; data: unknown }>(
        `${livePath(pharmacyId)}/products/velocity`,
      ),
    enabled: !!pharmacyId,
    staleTime: 15_000,
  });
}

export function useSalesLiveCashierActivity() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-live-cashiers", pharmacyId],
    queryFn: () =>
      apiService.get<{ success: boolean; data: unknown }>(
        `${livePath(pharmacyId)}/cashiers/activity`,
      ),
    enabled: !!pharmacyId,
    staleTime: 15_000,
  });
}

export function useSalesLivePaymentTrends() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["sales-live-payment-trends", pharmacyId],
    queryFn: () =>
      apiService.get<{ success: boolean; data: unknown }>(
        `${livePath(pharmacyId)}/payments/trends`,
      ),
    enabled: !!pharmacyId,
    staleTime: 15_000,
  });
}
