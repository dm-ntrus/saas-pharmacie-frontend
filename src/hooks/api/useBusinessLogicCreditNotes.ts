import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/api";
import toast from "react-hot-toast";
import { useTenantApiContext } from "@/hooks/useTenantApiContext";
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

// Clés de cache
const businessLogicCreditNotesKey = "business-logic-credit-notes";

// Helper pour récupérer le pharmacyId depuis le contexte
function usePharmacyId() {
  return useTenantApiContext().pharmacyId;
}

/**
 * Hook pour récupérer les notes de crédit d'une pharmacie (business logic)
 */
export function useBusinessLogicCreditNotes(filters?: {
  status?: string;
  patientId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const pharmacyId = usePharmacyId();
  const path = pharmacyId ? `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes` : "";
  
  return useQuery({
    queryKey: [businessLogicCreditNotesKey, pharmacyId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.patientId) params.append("patientId", filters.patientId);
      if (filters?.startDate) params.append("startDate", filters.startDate);
      if (filters?.endDate) params.append("endDate", filters.endDate);
      
      const url = params.toString() ? `${path}?${params.toString()}` : path;
      const raw = await apiService.get<unknown>(url);
      return normalizeBusinessLogicCreditNotesList(raw);
    },
    enabled: !!pharmacyId,
    staleTime: 30_000,
    retry: false,
  });
}

/**
 * Hook pour créer une note de crédit (business logic)
 */
export function useCreateBusinessLogicCreditNote() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (params: CreateBusinessLogicCreditNoteDto) =>
      apiService.post<BusinessLogicCreditNote>(
        `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes`,
        {
          originalInvoiceId: params.originalInvoiceId,
          patientId: params.patientId,
          reason: params.reason,
          reasonCode: params.reasonCode,
          totalAmount: params.totalAmount,
          vatAmount: params.vatAmount,
          currency: params.currency,
          originalReference: params.originalReference,
          lines: params.lines,
          metadata: params.metadata,
        }
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [businessLogicCreditNotesKey, pharmacyId] });
      qc.invalidateQueries({ queryKey: [businessLogicCreditNotesKey, pharmacyId, "summary"] });
      qc.invalidateQueries({ queryKey: [businessLogicCreditNotesKey, pharmacyId, "by-invoice", vars.originalInvoiceId] });
      toast.success("Note de crédit créée");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { message?: string })?.message ??
          "Impossible de créer la note de crédit"
      ),
  });
}

/**
 * Hook pour appliquer une note de crédit (business logic)
 */
export function useApplyBusinessLogicCreditNote() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      creditNoteId: string;
      applyDto: ApplyBusinessLogicCreditNoteDto;
    }) =>
      apiService.post<BusinessLogicCreditNote>(
        `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/${encodeURIComponent(params.creditNoteId)}/apply`,
        params.applyDto
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [businessLogicCreditNotesKey, pharmacyId] });
      qc.invalidateQueries({ queryKey: [businessLogicCreditNotesKey, pharmacyId, "summary"] });
      toast.success("Note de crédit appliquée");
    },
    onError: (err: unknown) =>
      toast.error((err as { message?: string })?.message ?? "Erreur lors de l'application"),
  });
}

/**
 * Hook pour annuler une note de crédit (business logic)
 */
export function useVoidBusinessLogicCreditNote() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      creditNoteId: string;
      voidDto: VoidBusinessLogicCreditNoteDto;
    }) =>
      apiService.post<BusinessLogicCreditNote>(
        `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/${encodeURIComponent(params.creditNoteId)}/void`,
        params.voidDto
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [businessLogicCreditNotesKey, pharmacyId] });
      qc.invalidateQueries({ queryKey: [businessLogicCreditNotesKey, pharmacyId, "summary"] });
      toast.success("Note de crédit annulée");
    },
    onError: (err: unknown) =>
      toast.error((err as { message?: string })?.message ?? "Erreur lors de l'annulation"),
  });
}

/**
 * Hook pour récupérer une note de crédit par son ID (business logic)
 */
export function useBusinessLogicCreditNote(creditNoteId: string | null) {
  const pharmacyId = usePharmacyId();
  const path = pharmacyId && creditNoteId 
    ? `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/${encodeURIComponent(creditNoteId)}`
    : "";
  
  return useQuery({
    queryKey: [businessLogicCreditNotesKey, pharmacyId, creditNoteId],
    queryFn: async () => {
      const raw = await apiService.get<unknown>(path);
      return raw as BusinessLogicCreditNote;
    },
    enabled: !!pharmacyId && !!creditNoteId,
    staleTime: 30_000,
    retry: false,
  });
}

/**
 * Hook pour récupérer les notes de crédit liées à une facture (business logic)
 */
export function useBusinessLogicCreditNotesByInvoice(invoiceId: string | null) {
  const pharmacyId = usePharmacyId();
  const path = pharmacyId && invoiceId 
    ? `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/by-invoice/${encodeURIComponent(invoiceId)}`
    : "";
  
  return useQuery({
    queryKey: [businessLogicCreditNotesKey, pharmacyId, "by-invoice", invoiceId],
    queryFn: async () => {
      const raw = await apiService.get<unknown>(path);
      return normalizeBusinessLogicCreditNotesList(raw);
    },
    enabled: !!pharmacyId && !!invoiceId,
    staleTime: 30_000,
    retry: false,
  });
}

/**
 * Hook pour récupérer le solde créditeur d'un patient (business logic)
 */
export function usePatientCreditBalance(patientId: string | null) {
  const pharmacyId = usePharmacyId();
  const path = pharmacyId && patientId 
    ? `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/patients/${encodeURIComponent(patientId)}/balance`
    : "";
  
  return useQuery({
    queryKey: [businessLogicCreditNotesKey, pharmacyId, "patient-balance", patientId],
    queryFn: async () => {
      const raw = await apiService.get<unknown>(path);
      return raw as PatientCreditBalance;
    },
    enabled: !!pharmacyId && !!patientId,
    staleTime: 30_000,
    retry: false,
  });
}

/**
 * Hook pour récupérer le résumé des crédits d'une pharmacie (business logic)
 */
export function useCreditNoteSummary() {
  const pharmacyId = usePharmacyId();
  const path = pharmacyId 
    ? `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/summary`
    : "";
  
  return useQuery({
    queryKey: [businessLogicCreditNotesKey, pharmacyId, "summary"],
    queryFn: async () => {
      const raw = await apiService.get<unknown>(path);
      return raw as CreditNoteSummary;
    },
    enabled: !!pharmacyId,
    staleTime: 30_000,
    retry: false,
  });
}

/**
 * Hook pour valider si une note de crédit peut être appliquée (business logic)
 */
export function useValidateCreditNoteApplication(creditNoteId: string | null, targetInvoiceId?: string) {
  const pharmacyId = usePharmacyId();
  const path = pharmacyId && creditNoteId 
    ? `/business-logic/pharmacies/${encodeURIComponent(pharmacyId)}/credit-notes/${encodeURIComponent(creditNoteId)}/validate-application`
    : "";
  
  return useQuery({
    queryKey: [businessLogicCreditNotesKey, pharmacyId, creditNoteId, "validate", targetInvoiceId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (targetInvoiceId) params.append("targetInvoiceId", targetInvoiceId);
      
      const url = params.toString() ? `${path}?${params.toString()}` : path;
      const raw = await apiService.get<unknown>(url);
      return raw as CreditNoteValidationResult;
    },
    enabled: !!pharmacyId && !!creditNoteId,
    staleTime: 30_000,
    retry: false,
  });
}