import { z } from "zod";
import {
  BusinessLogicCreditNoteStatus,
  BusinessLogicCreditNoteReasonCode,
  BusinessLogicCreditNoteApplyMode,
} from "@/types/business-logic-credit-notes";

// Schéma pour une ligne de note de crédit
export const creditNoteLineSchema = z.object({
  description: z.string().min(1, "La description est requise").max(500, "La description est trop longue"),
  amount: z.number().positive("Le montant doit être positif").max(999999.99, "Montant trop élevé"),
  quantity: z.number().positive("La quantité doit être positive").optional().default(1),
  productReference: z.string().max(100, "Référence produit trop longue").optional(),
  vatCode: z.string().max(20, "Code TVA trop long").optional(),
});

// Schéma pour créer une note de crédit
export const createCreditNoteDtoSchema = z.object({
  originalInvoiceId: z.string().min(1, "L'ID de la facture originale est requis"),
  pharmacyId: z.string().min(1, "L'ID de la pharmacie est requis"),
  patientId: z.string().optional(),
  reason: z.string().min(1, "La raison est requise").max(1000, "La raison est trop longue"),
  reasonCode: z.enum([
    'customer_discount',
    'price_correction', 
    'damaged_goods_refund',
    'service_issue',
    'loyalty_credit',
    'other_financial_adjustment'
  ]),
  totalAmount: z.number().positive("Le montant total doit être positif").max(999999.99, "Montant trop élevé"),
  vatAmount: z.number().min(0, "Le montant TVA ne peut pas être négatif").optional().default(0),
  currency: z.string().length(3, "La devise doit avoir 3 caractères").optional().default("EUR"),
  originalReference: z.string().max(200, "Référence trop longue").optional(),
  lines: z.array(creditNoteLineSchema).optional().default([]),
  metadata: z.record(z.any()).optional().default({}),
}).refine(
  (data) => {
    // Validation business: le total doit correspondre à la somme des lignes si des lignes sont fournies
    if (data.lines && data.lines.length > 0) {
      const linesTotal = data.lines.reduce((sum, line) => sum + (line.amount * (line.quantity || 1)), 0);
      return Math.abs(linesTotal - data.totalAmount) < 0.01; // Tolérance de 0.01
    }
    return true;
  },
  {
    message: "Le montant total doit correspondre à la somme des lignes",
    path: ["totalAmount"],
  }
);

// Schéma pour appliquer une note de crédit
export const applyCreditNoteDtoSchema = z.object({
  targetInvoiceId: z.string().optional(),
  applyMode: z.enum(['refund', 'credit_account', 'future_invoice']).optional().default('credit_account'),
  comment: z.string().max(500, "Commentaire trop long").optional(),
}).refine(
  (data) => {
    // Validation: targetInvoiceId est requis pour le mode refund
    if (data.applyMode === 'refund' && !data.targetInvoiceId) {
      return false;
    }
    return true;
  },
  {
    message: "targetInvoiceId est requis pour le mode refund",
    path: ["targetInvoiceId"],
  }
);

// Schéma pour annuler une note de crédit
export const voidCreditNoteDtoSchema = z.object({
  voidReason: z.string().min(1, "La raison d'annulation est requise").max(1000, "La raison est trop longue"),
  comment: z.string().max(500, "Commentaire trop long").optional(),
});

// Schéma pour les filtres de recherche
export const creditNotesFilterSchema = z.object({
  status: z.enum(['draft', 'issued', 'applied', 'void', 'expired']).optional(),
  patientId: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)").optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)").optional(),
  search: z.string().max(200, "Recherche trop longue").optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

// Schéma pour la pagination
export const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// Schéma pour la réponse paginée
export const paginatedCreditNotesResponseSchema = z.object({
  creditNotes: z.array(z.any()), // Utiliser le type BusinessLogicCreditNote après
  pagination: paginationSchema,
});

// Fonctions de validation exportées
export function validateCreateCreditNoteDto(data: unknown) {
  return createCreditNoteDtoSchema.parse(data);
}

export function validateApplyCreditNoteDto(data: unknown) {
  return applyCreditNoteDtoSchema.parse(data);
}

export function validateVoidCreditNoteDto(data: unknown) {
  return voidCreditNoteDtoSchema.parse(data);
}

export function validateCreditNotesFilters(data: unknown) {
  return creditNotesFilterSchema.parse(data);
}

// Types inférés
export type CreateCreditNoteDtoInput = z.input<typeof createCreditNoteDtoSchema>;
export type CreateCreditNoteDtoOutput = z.output<typeof createCreditNoteDtoSchema>;
export type ApplyCreditNoteDtoInput = z.input<typeof applyCreditNoteDtoSchema>;
export type ApplyCreditNoteDtoOutput = z.output<typeof applyCreditNoteDtoSchema>;
export type VoidCreditNoteDtoInput = z.input<typeof voidCreditNoteDtoSchema>;
export type VoidCreditNoteDtoOutput = z.output<typeof voidCreditNoteDtoSchema>;
export type CreditNotesFiltersInput = z.input<typeof creditNotesFilterSchema>;
export type CreditNotesFiltersOutput = z.output<typeof creditNotesFilterSchema>;
export type Pagination = z.infer<typeof paginationSchema>;