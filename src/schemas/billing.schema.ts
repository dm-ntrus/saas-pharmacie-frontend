import { z } from "zod";

const invoiceTypeEnum = z.enum(["standard", "proforma", "insurance", "credit_note", "recurring"]);
const billingPaymentMethodEnum = z.enum([
  "cash", "credit_card", "debit_card", "mobile_money",
  "bank_transfer", "insurance", "check", "credit", "card", "mobile",
]);
const paymentTypeEnum = z.enum(["full", "partial", "deposit", "installment"]);
const invoiceItemTypeEnum = z.enum(["product", "service", "consultation", "prescription"]);

const invoiceItemSchema = z.object({
  product_id: z.string().optional(),
  prescription_id: z.string().optional(),
  item_type: invoiceItemTypeEnum,
  item_code: z.string().min(1, "Le code article est requis"),
  item_name: z.string().min(1, "Le nom de l'article est requis"),
  description: z.string().optional(),
  quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
  unit_price: z.number().min(0, "Le prix unitaire doit être positif"),
  discount_percentage: z.number().min(0).max(100).optional(),
  tax_rate: z.number().min(0).max(100).optional(),
  batch_number: z.string().optional(),
  expiry_date: z.string().optional(),
});

export const createInvoiceSchema = z.object({
  patient_id: z.string().optional(),
  customer_id: z.string().optional(),
  sale_id: z.string().optional(),
  prescription_id: z.string().optional(),
  invoice_type: invoiceTypeEnum.optional(),
  items: z.array(invoiceItemSchema).min(1, "Au moins un article est requis"),
  discount_percentage: z.number().min(0).max(100).optional(),
  payment_method: billingPaymentMethodEnum.optional(),
  payment_terms_days: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  terms_and_conditions: z.string().optional(),
  insurance_provider_id: z.string().optional(),
  insurance_policy_number: z.string().optional(),
  insurance_coverage_percent: z.number().min(0).max(100).optional(),
  source_type: z.string().optional(),
});

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

export const createPaymentSchema = z.object({
  invoice_id: z.string().min(1, "La facture est requise"),
  amount: z.number().min(0.01, "Le montant doit être supérieur à 0"),
  payment_method: billingPaymentMethodEnum,
  payment_type: paymentTypeEnum.optional(),
  mobile_money_provider: z.string().optional(),
  mobile_money_phone_number: z.string().optional(),
  card_last_four_digits: z.string().max(4).optional(),
  check_number: z.string().optional(),
  bank_name: z.string().optional(),
  notes: z.string().optional(),
  is_refund: z.boolean().optional(),
  original_payment_id: z.string().optional(),
  refund_reason: z.string().optional(),
});

export type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;

export const insuranceClaimSchema = z.object({
  invoiceId: z.string().min(1, "La facture est requise"),
  patientId: z.string().min(1, "Le patient est requis"),
  insuranceProviderId: z.string().min(1, "L'assureur est requis"),
  policyNumber: z.string().min(1, "Le numéro de police est requis"),
  coveragePercent: z.number().min(0).max(100, "Le pourcentage de couverture doit être entre 0 et 100"),
  diagnosisCodes: z.array(z.string()).optional(),
  treatmentCodes: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export type InsuranceClaimFormData = z.infer<typeof insuranceClaimSchema>;
