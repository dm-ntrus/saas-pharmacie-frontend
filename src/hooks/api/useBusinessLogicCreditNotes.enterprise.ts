import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/api";
import { toast } from "sonner";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
import { useDebounce } from "@/hooks/useDebounce";
import { 
  BusinessLogicCreditNote,
  CreateBusinessLogicCreditNoteDto,
  ApplyBusinessLogicCreditNoteDto,
  VoidBusinessLogicCreditNoteDto,
  PatientCreditBalance,
  CreditNoteSummary,
  CreditNoteValidationResult,
  normalizeBusinessLogicCreditNotesList,
} from "@/types/business-logic-credit-notes";
import { ApiError } from "@/types/api.types";
import { 
  validateCreateCreditNoteDto,
  validateApplyCreditNoteDto,
  validateVoidCreditNoteDto 
} from "@/schemas/business-logic-credit-notes.schema";

// Clés de cache avec versioning
const BUSINESS_LOGIC_CREDIT_NOTES_KEY = "business-logic-credit-notes";
const VERSION = "v1";

// Configuration enterprise
const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,    // 10 minutes
  retry: (failureCount: number, error: ApiError) => {
    // Retry seulement sur erreurs réseau ou 5xx
    if (error.statusCode && error.statusCode >= 500) {
      return failureCount < 3;
    }
    return false;
  },
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// Helper pour récupérer le pharmacyId depuis le contexte avec validation
function usePharmacyId() {
  const context = useTenantApiContext();
  if (!context.pharmacyId) {
    throw new Error("useBusinessLogicCreditNotes hooks require pharmacyId in TenantApiContext");
  }
  return context.pharmacyId;
}

// Helper pour construire les clés de cache
function buildCacheKey(...parts: (string | number | boolean | null | undefined)[]) {
  const validParts = parts.filter(p => p != null).map(String);
  return [BUSINESS_LOGIC_CREDIT_NOTES_KEY, VERSION, ...validParts];
}

// Helper pour gérer les erreurs API de manière cohérente
function handleApiError(error: unknown, defaultMessage: string): never {
  const apiError = error as ApiError;
  const message = apiError.message || apiError.details?.message || defaultMessage;
  
  // Log l'erreur pour le monitoring
  console.error(`Credit Notes API Error:`, apiError);
  
  // Toast utilisateur-friendly
  toast.error(message, {
    duration: 5000,
    action: {
      label: "Détails",
      onClick: () => {
        // Ouvrir un modal avec les détails de l'erreur
        console.debug("Error details:", apiError);
      },
    },
  });
  
  throw new Error(message);
}

// Helper pour valider et sanitizer les données avant envoi
function sanitizeCreateDto(dto: CreateBusinessLogicCreditNoteDto): CreateBusinessLogicCreditNoteDto {
  const validated = validateCreateCreditNoteDto(dto);
  
  // Sanitization supplémentaire
  return {
    ...validated,
    reason: validated.reason.trim(),
    originalReference: validated.originalReference?.trim(),
    metadata: validated.metadata || {},
  };
}

/**
 * Hook enterprise-grade pour récupérer les notes de crédit d'une pharmacie avec pagination, filtres et debouncing
 */
export function useBusinessLogicCreditNotes(
  options: {
    page?: number;
    limit?: number;
    filters?: {
      status?: BusinessLogicCreditNoteStatus;
      patientId?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
    };
    enabled?: boolean;
  } = {}
) {
  const pharmacyId = usePharmacyId();
  const { page = 1, limit = 20, filters = {}, enabled = true } = options;
  
  // Debounce les filtres pour éviter les requêtes excessives
  const debouncedFilters = useDebounce(filters, 300);
  
  const cacheKey = buildCacheKey(pharmacyId, "list", page, limit, debouncedFilters);
  
  return useQuery({
    queryKey: cacheKey,
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      
      if (debouncedFilters.status) params.append("status", debouncedFilters.status);
      if (debouncedFilters.patientId) params.append("patientId", debouncedFilters.patientId);
      if (debouncedFilters.startDate) params.append("startDate", debouncedFilters.startDate);
      if (debouncedFilters.endDate) params.append("endDate", debouncedFilters.endDate);
      if (debouncedFilters.search) params.append("search", debouncedFilters.search);
      
      const url = `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes?${params.toString()}`;
      
      try {
        const response = await apiService.get<{
          data: BusinessLogicCreditNote[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
          };
        }>(url, { signal });
        
        return {
          creditNotes: normalizeBusinessLogicCreditNotesList(response.data),
          pagination: response.pagination,
        };
      } catch (error) {
        return handleApiError(error, "Impossible de charger les notes de crédit");
      }
    },
    enabled: !!pharmacyId && enabled,
    ...QUERY_CONFIG,
  });
}

/**
 * Hook enterprise-grade pour créer une note de crédit avec optimistic updates et validation
 */
export function useCreateBusinessLogicCreditNote() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: CreateBusinessLogicCreditNoteDto) => {
      // Validation et sanitization côté client
      const sanitizedParams = sanitizeCreateDto(params);
      
      return apiService.post<BusinessLogicCreditNote>(
        `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes`,
        sanitizedParams
      );
    },
    onMutate: async (newCreditNote) => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey: buildCacheKey(pharmacyId, "list") });
      
      // Snapshot the previous value
      const previousCreditNotes = qc.getQueryData(buildCacheKey(pharmacyId, "list"));
      
      // Optimistically update to the new value
      qc.setQueryData(buildCacheKey(pharmacyId, "list"), (old: any) => {
        if (!old) return old;
        
        const optimisticNote: BusinessLogicCreditNote = {
          ...newCreditNote,
          id: `optimistic-${Date.now()}`,
          credit_note_number: `CN-OPT-${Date.now()}`,
          pharmacy_id: pharmacyId,
          status: 'issued',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        return {
          ...old,
          creditNotes: [optimisticNote, ...old.creditNotes],
          pagination: {
            ...old.pagination,
            total: old.pagination.total + 1,
          },
        };
      });
      
      return { previousCreditNotes };
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch
      qc.invalidateQueries({ queryKey: buildCacheKey(pharmacyId, "list") });
      qc.invalidateQueries({ queryKey: buildCacheKey(pharmacyId, "summary") });
      qc.invalidateQueries({ 
        queryKey: buildCacheKey(pharmacyId, "by-invoice", variables.originalInvoiceId) 
      });
      
      toast.success("Note de crédit créée avec succès", {
        description: `Numéro: ${data.credit_note_number}`,
        duration: 5000,
      });
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCreditNotes) {
        qc.setQueryData(buildCacheKey(pharmacyId, "list"), context.previousCreditNotes);
      }
      
      handleApiError(err, "Impossible de créer la note de crédit");
    },
    onSettled: () => {
      // Always refetch after error or success
      qc.invalidateQueries({ queryKey: buildCacheKey(pharmacyId, "list") });
    },
  });
}

/**
 * Hook enterprise-grade pour appliquer une note de crédit avec validation et rollback
 */
export function useApplyBusinessLogicCreditNote() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      creditNoteId: string;
      applyDto: ApplyBusinessLogicCreditNoteDto;
    }) => {
      // Validation côté client
      const validatedDto = validateApplyCreditNoteDto(params.applyDto);
      
      return apiService.post<BusinessLogicCreditNote>(
        `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/${encodeURIComponent(params.creditNoteId)}/apply`,
        validatedDto
      );
    },
    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: buildCacheKey(pharmacyId, variables.creditNoteId) });
      
      const previousCreditNote = qc.getQueryData(
        buildCacheKey(pharmacyId, variables.creditNoteId)
      );
      
      // Optimistic update
      qc.setQueryData(
        buildCacheKey(pharmacyId, variables.creditNoteId),
        (old: BusinessLogicCreditNote) => ({
          ...old,
          status: 'applied',
          applied_mode: variables.applyDto.applyMode,
          applied_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      );
      
      return { previousCreditNote };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: buildCacheKey(pharmacyId, "list") });
      qc.invalidateQueries({ queryKey: buildCacheKey(pharmacyId, "summary") });
      
      toast.success("Note de crédit appliquée", {
        description: `Mode: ${data.applied_mode}`,
        duration: 5000,
      });
    },
    onError: (err, variables, context) => {
      if (context?.previousCreditNote) {
        qc.setQueryData(
          buildCacheKey(pharmacyId, variables.creditNoteId),
          context.previousCreditNote
        );
      }
      
      handleApiError(err, "Impossible d'appliquer la note de crédit");
    },
  });
}

/**
 * Hook enterprise-grade pour annuler une note de crédit
 */
export function useVoidBusinessLogicCreditNote() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      creditNoteId: string;
      voidDto: VoidBusinessLogicCreditNoteDto;
    }) => {
      const validatedDto = validateVoidCreditNoteDto(params.voidDto);
      
      return apiService.post<BusinessLogicCreditNote>(
        `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/${encodeURIComponent(params.creditNoteId)}/void`,
        validatedDto
      );
    },
    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: buildCacheKey(pharmacyId, variables.creditNoteId) });
      
      const previousCreditNote = qc.getQueryData(
        buildCacheKey(pharmacyId, variables.creditNoteId)
      );
      
      qc.setQueryData(
        buildCacheKey(pharmacyId, variables.creditNoteId),
        (old: BusinessLogicCreditNote) => ({
          ...old,
          status: 'void',
          void_reason: variables.voidDto.voidReason,
          voided_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      );
      
      return { previousCreditNote };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: buildCacheKey(pharmacyId, "list") });
      qc.invalidateQueries({ queryKey: buildCacheKey(pharmacyId, "summary") });
      
      toast.success("Note de crédit annulée", {
        description: `Raison: ${data.void_reason}`,
        duration: 5000,
      });
    },
    onError: (err, variables, context) => {
      if (context?.previousCreditNote) {
        qc.setQueryData(
          buildCacheKey(pharmacyId, variables.creditNoteId),
          context.previousCreditNote
        );
      }
      
      handleApiError(err, "Impossible d'annuler la note de crédit");
    },
  });
}

/**
 * Hook enterprise-grade pour récupérer une note de crédit par son ID avec préfetching
 */
export function useBusinessLogicCreditNote(creditNoteId: string | null) {
  const pharmacyId = usePharmacyId();
  const cacheKey = buildCacheKey(pharmacyId, creditNoteId);
  
  return useQuery({
    queryKey: cacheKey,
    queryFn: async ({ signal }) => {
      if (!creditNoteId) return null;
      
      try {
        const url = `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/${encodeURIComponent(creditNoteId)}`;
        const response = await apiService.get<BusinessLogicCreditNote>(url, { signal });
        return response;
      } catch (error) {
        return handleApiError(error, "Impossible de charger la note de crédit");
      }
    },
    enabled: !!pharmacyId && !!creditNoteId,
    ...QUERY_CONFIG,
  });
}

/**
 * Prefetch une note de crédit pour améliorer l'UX
 */
export function prefetchBusinessLogicCreditNote(
  qc: ReturnType<typeof useQueryClient>,
  pharmacyId: string,
  creditNoteId: string
) {
  return qc.prefetchQuery({
    queryKey: buildCacheKey(pharmacyId, creditNoteId),
    queryFn: async () => {
      const url = `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/${encodeURIComponent(creditNoteId)}`;
      return await apiService.get<BusinessLogicCreditNote>(url);
    },
    ...QUERY_CONFIG,
  });
}

/**
 * Hook enterprise-grade pour récupérer les notes de crédit liées à une facture
 */
export function useBusinessLogicCreditNotesByInvoice(invoiceId: string | null) {
  const pharmacyId = usePharmacyId();
  const cacheKey = buildCacheKey(pharmacyId, "by-invoice", invoiceId);
  
  return useQuery({
    queryKey: cacheKey,
    queryFn: async ({ signal }) => {
      if (!invoiceId) return [];
      
      try {
        const url = `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/by-invoice/${encodeURIComponent(invoiceId)}`;
        const response = await apiService.get<unknown>(url, { signal });
        return normalizeBusinessLogicCreditNotesList(response);
      } catch (error) {
        return handleApiError(error, "Impossible de charger les notes de crédit liées à cette facture");
      }
    },
    enabled: !!pharmacyId && !!invoiceId,
    ...QUERY_CONFIG,
  });
}

/**
 * Hook enterprise-grade pour récupérer le solde créditeur d'un patient avec cache intelligent
 */
export function usePatientCreditBalance(patientId: string | null) {
  const pharmacyId = usePharmacyId();
  const cacheKey = buildCacheKey(pharmacyId, "patient-balance", patientId);
  
  return useQuery({
    queryKey: cacheKey,
    queryFn: async ({ signal }) => {
      if (!patientId) return null;
      
      try {
        const url = `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/patients/${encodeURIComponent(patientId)}/balance`;
        const response = await apiService.get<PatientCreditBalance>(url, { signal });
        return response;
      } catch (error) {
        return handleApiError(error, "Impossible de charger le solde créditeur du patient");
      }
    },
    enabled: !!pharmacyId && !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutes pour les soldes
    gcTime: 5 * 60 * 1000,    // 5 minutes
  });
}

/**
 * Hook enterprise-grade pour récupérer le résumé des crédits d'une pharmacie
 */
export function useCreditNoteSummary() {
  const pharmacyId = usePharmacyId();
  const cacheKey = buildCacheKey(pharmacyId, "summary");
  
  return useQuery({
    queryKey: cacheKey,
    queryFn: async ({ signal }) => {
      try {
        const url = `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/summary`;
        const response = await apiService.get<CreditNoteSummary>(url, { signal });
        return response;
      } catch (error) {
        return handleApiError(error, "Impossible de charger le résumé des crédits");
      }
    },
    enabled: !!pharmacyId,
    ...QUERY_CONFIG,
  });
}

/**
 * Hook enterprise-grade pour valider si une note de crédit peut être appliquée
 */
export function useValidateCreditNoteApplication(creditNoteId: string | null, targetInvoiceId?: string) {
  const pharmacyId = usePharmacyId();
  const cacheKey = buildCacheKey(pharmacyId, creditNoteId, "validate", targetInvoiceId);
  
  return useQuery({
    queryKey: cacheKey,
    queryFn: async ({ signal }) => {
      if (!creditNoteId) return null;
      
      try {
        const params = new URLSearchParams();
        if (targetInvoiceId) params.append("targetInvoiceId", targetInvoiceId);
        
        const url = `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/${encodeURIComponent(creditNoteId)}/validate-application?${params.toString()}`;
        const response = await apiService.get<CreditNoteValidationResult>(url, { signal });
        return response;
      } catch (error) {
        return handleApiError(error, "Impossible de valider l'application de la note de crédit");
      }
    },
    enabled: !!pharmacyId && !!creditNoteId,
    staleTime: 30 * 1000, // 30 secondes pour la validation
    gcTime: 60 * 1000,   // 1 minute
  });
}

/**
 * Hook pour récupérer les statistiques avancées des crédits
 */
export function useCreditNotesAnalytics(
  period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month',
  startDate?: string,
  endDate?: string
) {
  const pharmacyId = usePharmacyId();
  const cacheKey = buildCacheKey(pharmacyId, "analytics", period, startDate, endDate);
  
  return useQuery({
    queryKey: cacheKey,
    queryFn: async ({ signal }) => {
      try {
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
      } catch (error) {
        return handleApiError(error, "Impossible de charger les statistiques des crédits");
      }
    },
    enabled: !!pharmacyId,
    ...QUERY_CONFIG,
  });
}