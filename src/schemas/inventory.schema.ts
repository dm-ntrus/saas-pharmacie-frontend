import { z } from "zod";

const productCategoryEnum = z.enum([
  "medicine", "supplement", "equipment", "beauty",
  "mother_baby", "hygiene", "first_aid", "orthopedics", "veterinary",
]);

const productTypeEnum = z.enum([
  "prescription", "otc", "supplement", "medical_device", "cosmetic",
]);

const productStatusEnum = z.enum(["active", "discontinued", "pending_approval"]);

export const createProductSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis"),
  barcode: z.string().min(1, "Le code-barres est requis"),
  manufacturer: z.string().min(1, "Le fabricant est requis"),
  activeIngredient: z.string().min(1, "Le principe actif est requis"),
  strength: z.string().min(1, "Le dosage est requis"),
  dosageForm: z.string().min(1, "La forme galénique est requise"),
  unitOfMeasure: z.string().min(1, "L'unité de mesure est requise"),
  category: productCategoryEnum,
  type: productTypeEnum,
  sku: z.string().optional(),
  internalCode: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  packagingSize: z.number().int().min(1).optional(),
  isNarcotic: z.boolean().optional(),
  isColdChain: z.boolean().optional(),
  requiresPrescription: z.boolean().optional(),
  deaSchedule: z.string().optional(),
  storageConditions: z.string().optional(),
  referencePrice: z.number().min(0, "Le prix de référence doit être positif").optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial().extend({
  status: productStatusEnum.optional(),
});

export type UpdateProductFormData = z.infer<typeof updateProductSchema>;

export const createBatchSchema = z.object({
  productId: z.string().min(1, "Le produit est requis"),
  batchNumber: z.string().min(1, "Le numéro de lot est requis"),
  expiryDate: z.string().min(1, "La date d'expiration est requise"),
  quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
  unitCost: z.number().min(0, "Le coût unitaire doit être positif"),
  supplierId: z.string().optional(),
  locationId: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateBatchFormData = z.infer<typeof createBatchSchema>;

const transferLineSchema = z.object({
  product_id: z.string().min(1, "Le produit est requis"),
  batch_number: z.string().optional(),
  quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
});

export const createTransferSchema = z.object({
  fromLocationId: z.string().min(1, "L'emplacement source est requis"),
  toLocationId: z.string().min(1, "L'emplacement destination est requis"),
  items: z.array(transferLineSchema).min(1, "Au moins un article est requis"),
  notes: z.string().optional(),
});

export type CreateTransferFormData = z.infer<typeof createTransferSchema>;

const countLineSchema = z.object({
  productId: z.string().min(1, "Le produit est requis"),
  expectedQuantity: z.number().int().min(0),
  actualQuantity: z.number().int().min(0, "La quantité réelle doit être positive"),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const createCountSchema = z.object({
  locationId: z.string().min(1, "L'emplacement est requis"),
  countDate: z.string().min(1, "La date du comptage est requise"),
  items: z.array(countLineSchema).min(1, "Au moins un article est requis"),
  notes: z.string().optional(),
});

export type CreateCountFormData = z.infer<typeof createCountSchema>;

export const createRecallSchema = z.object({
  productId: z.string().min(1, "Le produit est requis"),
  batchNumber: z.string().min(1, "Le numéro de lot est requis"),
  reason: z.string().min(1, "La raison du rappel est requise"),
  severity: z.enum(["low", "medium", "high", "critical"], {
    required_error: "La sévérité est requise",
  }),
  affectedQuantity: z.number().int().min(1, "La quantité affectée est requise"),
  instructions: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateRecallFormData = z.infer<typeof createRecallSchema>;

export const productPriceSchema = z.object({
  productId: z.string().min(1, "Le produit est requis"),
  sellingPrice: z.number().min(0, "Le prix de vente doit être positif"),
  costPrice: z.number().min(0, "Le prix d'achat doit être positif"),
  marginPercent: z.number().min(0).max(100).optional(),
  effectiveDate: z.string().min(1, "La date d'effet est requise"),
  notes: z.string().optional(),
});

export type ProductPriceFormData = z.infer<typeof productPriceSchema>;
