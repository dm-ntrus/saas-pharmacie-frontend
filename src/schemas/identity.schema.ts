import { z } from "zod";

const organizationTypeEnum = z.enum(["pharmacy", "clinic", "hospital", "laboratory", "other"]);

export const createUserSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").optional(),
  phone: z.string().optional(),
  tenantId: z.string().optional(),
  organizationId: z.string().optional(),
  roles: z.array(z.string()).optional(),
  isPatient: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Le nom de l'organisation est requis"),
  description: z.string().optional(),
  tenantId: z.string().min(1, "Le tenant est requis"),
  pharmacyId: z.string().min(1, "La pharmacie est requise"),
  type: organizationTypeEnum.optional(),
  email: z.string().email("Adresse e-mail invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
});

export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;

export const createCustomRoleSchema = z.object({
  name: z.string().min(1, "Le nom technique est requis")
    .regex(/^[a-z_]+$/, "Le nom technique ne doit contenir que des lettres minuscules et underscores"),
  displayName: z.string().min(1, "Le nom affiché est requis"),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, "Au moins une permission est requise"),
  level: z.number().int().min(0).max(100).optional(),
  inheritsFrom: z.array(z.string()).optional(),
  requiresApproval: z.boolean().optional(),
  maxUsers: z.number().int().min(1).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateCustomRoleFormData = z.infer<typeof createCustomRoleSchema>;

export const pharmacyConfigSchema = z.object({
  name: z.string().min(1, "Le nom de la pharmacie est requis"),
  email: z.string().email("Adresse e-mail invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  language: z.enum(["fr", "en"]).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  openingHours: z.record(z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean(),
  })).optional(),
  logoUrl: z.string().url("URL du logo invalide").optional().or(z.literal("")),
  website: z.string().url("URL du site web invalide").optional().or(z.literal("")),
});

export type PharmacyConfigFormData = z.infer<typeof pharmacyConfigSchema>;
