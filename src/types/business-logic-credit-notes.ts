/**
 * Types pour le module Business Logic Credit Notes
 * Notes de crédit pour les pharmacies (business logic)
 */

export interface BusinessLogicCreditNoteLine {
  description: string;
  amount: number;
  quantity?: number;
  productReference?: string;
  vatCode?: string;
}

export interface BusinessLogicCreditNote {
  id?: string;
  credit_note_number: string;
  pharmacy_id: string;
  original_invoice_id: string;
  patient_id?: string;
  reason: string;
  reason_code: BusinessLogicCreditNoteReasonCode;
  total_amount: number;
  vat_amount?: number;
  currency: string;
  status: BusinessLogicCreditNoteStatus;
  lines?: BusinessLogicCreditNoteLine[];
  applied_to_invoice_id?: string;
  applied_at?: string;
  applied_mode?: BusinessLogicCreditNoteApplyMode;
  void_reason?: string;
  voided_at?: string;
  original_reference?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export type BusinessLogicCreditNoteStatus = 
  | 'draft'
  | 'issued'
  | 'applied'
  | 'void'
  | 'expired';

export type BusinessLogicCreditNoteReasonCode =
  | 'customer_discount'
  | 'price_correction'
  | 'damaged_goods_refund'
  | 'service_issue'
  | 'loyalty_credit'
  | 'other_financial_adjustment';

export type BusinessLogicCreditNoteApplyMode =
  | 'refund'
  | 'credit_account'
  | 'future_invoice';

export interface CreateBusinessLogicCreditNoteDto {
  originalInvoiceId: string;
  pharmacyId: string;
  patientId?: string;
  reason: string;
  reasonCode: BusinessLogicCreditNoteReasonCode;
  totalAmount: number;
  vatAmount?: number;
  currency?: string;
  originalReference?: string;
  lines?: BusinessLogicCreditNoteLine[];
  metadata?: Record<string, any>;
}

export interface ApplyBusinessLogicCreditNoteDto {
  targetInvoiceId?: string;
  applyMode?: BusinessLogicCreditNoteApplyMode;
  comment?: string;
}

export interface VoidBusinessLogicCreditNoteDto {
  voidReason: string;
  comment?: string;
}

export interface PatientCreditBalance {
  patient_id: string;
  total_issued: number;
  total_applied: number;
  available_credit: number;
  credit_note_numbers: string[];
}

export interface CreditNoteSummary {
  total_issued: number;
  total_applied: number;
  total_void: number;
  total_pending: number;
  total_amount_issued: number;
  total_amount_applied: number;
}

export interface CreditNoteValidationResult {
  valid: boolean;
  reason?: string;
  creditNote: BusinessLogicCreditNote;
}

// Helper pour normaliser les données depuis l'API
export function normalizeBusinessLogicCreditNotesList(raw: unknown): BusinessLogicCreditNote[] {
  if (Array.isArray(raw)) return raw as BusinessLogicCreditNote[];
  
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.creditNotes)) return o.creditNotes as BusinessLogicCreditNote[];
    if (Array.isArray(o.data)) return o.data as BusinessLogicCreditNote[];
    if (Array.isArray(o.result)) return o.result as BusinessLogicCreditNote[];
  }
  
  return [];
}

// Labels pour l'UI
export const BUSINESS_LOGIC_CREDIT_NOTE_STATUS_LABELS: Record<BusinessLogicCreditNoteStatus, string> = {
  draft: "Brouillon",
  issued: "Émise",
  applied: "Appliquée",
  void: "Annulée",
  expired: "Expirée",
};

export const BUSINESS_LOGIC_CREDIT_NOTE_REASON_LABELS: Record<BusinessLogicCreditNoteReasonCode, string> = {
  customer_discount: "Remise client",
  price_correction: "Correction de prix",
  damaged_goods_refund: "Remboursement marchandises endommagées",
  service_issue: "Problème de service",
  loyalty_credit: "Crédit fidélité",
  other_financial_adjustment: "Autre ajustement financier",
};

export const BUSINESS_LOGIC_CREDIT_NOTE_APPLY_MODE_LABELS: Record<BusinessLogicCreditNoteApplyMode, string> = {
  refund: "Remboursement",
  credit_account: "Crédit sur compte",
  future_invoice: "Future facture",
};