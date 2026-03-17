import { z } from "zod";

const genderEnum = z.enum([
  "male",
  "female",
  "other",
  "prefer_not_to_say",
]);

export const createPatientSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  date_of_birth: z.string().min(1, "La date de naissance est requise"),
  gender: genderEnum,
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  address: z.string().min(1, "L'adresse est requise"),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_number: z.string().optional(),
  allergies: z.string().optional(),
  medical_conditions: z.string().optional(),
  current_medications: z.string().optional(),
});

export type CreatePatientFormData = z.infer<typeof createPatientSchema>;

export const updatePatientSchema = createPatientSchema.partial().extend({
  status: z.enum(["active", "inactive", "deceased", "transferred"]).optional(),
});

export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>;
