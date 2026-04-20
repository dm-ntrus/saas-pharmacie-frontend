import { useQuery } from "@tanstack/react-query";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { apiService } from "@/lib/api";
export {
  useCreateBusinessLogicCreditNote,
  useApplyBusinessLogicCreditNote,
  useVoidBusinessLogicCreditNote,
  useBusinessLogicCreditNote,
  useBusinessLogicCreditNotesByInvoice,
  usePatientCreditBalance,
  useCreditNoteSummary,
  useValidateCreditNoteApplication,
} from "./useBusinessLogicCreditNotes";

function usePharmacyId(): string {
  return useTenantApiContext().pharmacyId;
}

export function useBusinessLogicCreditNotes(options: {
  page?: number;
  limit?: number;
  filters?: {
    status?: string;
    patientId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  };
} = {}) {
  const pharmacyId = usePharmacyId();
  const { page = 1, limit = 20, filters = {} } = options;
  return useQuery({
    queryKey: ["business-logic-credit-notes", pharmacyId, page, limit, filters],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (filters.status) params.append("status", filters.status);
      if (filters.patientId) params.append("patientId", filters.patientId);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.search) params.append("search", filters.search);
      const url = `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes?${params.toString()}`;
      const raw = await apiService.get<any>(url, { signal });
      const creditNotes = Array.isArray(raw?.creditNotes)
        ? raw.creditNotes
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw)
            ? raw
            : [];
      const pagination = raw?.pagination ?? {
        page,
        limit,
        total: creditNotes.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };
      return { creditNotes, pagination };
    },
    enabled: !!pharmacyId,
    retry: false,
  });
}

/**
 * Hook enterprise-grade pour récupérer les notes de crédit d'une pharmacie avec pagination, filtres et debouncing
 */
export function useCreditNotesAnalytics(
  period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month',
  startDate?: string,
  endDate?: string
) {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ['business-logic-credit-notes', 'analytics', pharmacyId, period, startDate, endDate],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({ period });
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      const url = `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/analytics?${params.toString()}`;
      return await apiService.get<{
        period: string;
        totalIssued: number;
        totalApplied: number;
        totalVoid: number;
        averageAmount: number;
        topReasons: Array<{ reason: string; count: number; amount: number }>;
        trend: Array<{ date: string; issued: number; applied: number }>;
      }>(url, { signal });
    },
    enabled: !!pharmacyId,
    staleTime: 60_000,
    retry: false,
  });
}