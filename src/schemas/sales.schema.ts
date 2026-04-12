import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.string().min(1, "Le produit est requis"),
  quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
  unitPrice: z.number().min(0, "Le prix unitaire doit être positif"),
  discountAmount: z.number().min(0).optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  batchId: z.string().optional(),
  batchNumber: z.string().optional(),
  unitCost: z.number().min(0).optional(),
  locationId: z.string().optional(),
  notes: z.string().optional(),
  prescriptionLineId: z.string().optional(),
  isGift: z.boolean().optional(),
});

export type SaleItemFormData = z.infer<typeof saleItemSchema>;

export const paymentSchema = z.object({
  paymentMethod: z.enum(["CASH", "CARD", "MOBILE_MONEY", "INSURANCE", "CREDIT", "CHECK"], {
    required_error: "Le mode de paiement est requis",
  }),
  amountPaid: z.number().min(0, "Le montant payé doit être positif"),
  insuranceProviderId: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceCoveragePercent: z.number().min(0).max(100).optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export const createSaleSchema = z.object({
  patientId: z.string().optional(),
  cashierId: z.string().min(1, "Le caissier est requis"),
  items: z.array(saleItemSchema).min(1, "Au moins un article est requis"),
  paymentMethod: z.enum(["CASH", "CARD", "MOBILE_MONEY", "INSURANCE", "CREDIT", "CHECK"], {
    required_error: "Le mode de paiement est requis",
  }),
  amountPaid: z.number().min(0, "Le montant payé doit être positif"),
  notes: z.string().optional(),
  isCreditSale: z.boolean().optional(),
  taxRate: z.number().min(0).max(100).optional(),
  sourceType: z.enum(["manual", "prescription", "appointment", "recurring", "online"]).optional(),
  sourceId: z.string().optional(),
  sourceNumber: z.string().optional(),
  insuranceProviderId: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceCoveragePercent: z.number().min(0).max(100).optional(),
  internalNotes: z.string().optional(),
});

export type CreateSaleFormData = z.infer<typeof createSaleSchema>;

export const openSessionSchema = z.object({
  openingBalance: z.number().min(0, "Le solde d'ouverture doit être positif"),
  notes: z.string().optional(),
});

export type OpenSessionFormData = z.infer<typeof openSessionSchema>;

export const closeSessionSchema = z.object({
  closingBalance: z.number().min(0, "Le solde de clôture doit être positif"),
  notes: z.string().optional(),
  discrepancyReason: z.string().optional(),
});

export type CloseSessionFormData = z.infer<typeof closeSessionSchema>;
