import { z } from "zod";

const prescriptionTypeEnum = z.enum([
  "new",
  "refill",
  "transfer_in",
  "transfer_out",
  "emergency",
  "compound",
]);

export const createPrescriptionSchema = z.object({
  patient_id: z.string().min(1, "Le patient est requis"),
  prescriber_name: z.string().min(1, "Le nom du prescripteur est requis"),
  prescriber_npi: z.string().optional(),
  prescribed_date: z.string().optional(),
  type: prescriptionTypeEnum.optional(),
  refills_allowed: z.number().int().min(0).optional(),
  refills_remaining: z.number().int().min(0).optional(),
  special_instructions: z.string().optional(),
  pharmacy_notes: z.string().optional(),
});

export type CreatePrescriptionFormData = z.infer<typeof createPrescriptionSchema>;

export const createPrescriptionItemSchema = z.object({
  product_id: z.string().optional(),
  drug_name: z.string().min(1, "Le nom du médicament est requis"),
  strength: z.string().min(1, "Le dosage est requis"),
  quantity_prescribed: z.string().min(1, "La quantité est requise"),
  unit_of_measure: z.string().min(1, "L'unité est requise"),
  directions_for_use: z.string().min(1, "Les instructions sont requises"),
  dosage_frequency: z.string().min(1, "La fréquence est requise"),
  dosage_amount: z.string().optional(),
  unit_price: z.string().optional(),
  total_price: z.string().optional(),
});

export type CreatePrescriptionItemFormData = z.infer<
  typeof createPrescriptionItemSchema
>;
