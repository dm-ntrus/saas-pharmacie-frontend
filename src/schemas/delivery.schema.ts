import { z } from "zod";

const vehicleTypeEnum = z.enum(["bike", "motorcycle", "car", "van"]);
const deliveryPriorityEnum = z.enum(["standard", "express", "same_day", "urgent"]);

export const createDriverSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  driverCode: z.string().min(1, "Le code chauffeur est requis"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  licenseNumber: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  vehicleType: vehicleTypeEnum.optional(),
  vehicleRegistration: z.string().optional(),
  vehicleModel: z.string().optional(),
  workingHours: z.record(z.object({
    start: z.string(),
    end: z.string(),
    available: z.boolean(),
  })).optional(),
  bankDetails: z.object({
    accountName: z.string().min(1, "Le titulaire du compte est requis"),
    accountNumber: z.string().min(1, "Le numéro de compte est requis"),
    bankName: z.string().min(1, "Le nom de la banque est requis"),
    routingNumber: z.string().optional(),
  }).optional(),
});

export type CreateDriverFormData = z.infer<typeof createDriverSchema>;

export const createZoneSchema = z.object({
  name: z.string().min(1, "Le nom de la zone est requis"),
  description: z.string().optional(),
  boundaries: z.object({
    type: z.enum(["polygon", "circle"]),
    coordinates: z.array(z.array(z.number())),
    radius: z.number().optional(),
    center: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  deliveryFee: z.number().min(0, "Les frais de livraison doivent être positifs"),
  estimatedDeliveryTimeMinutes: z.number().int().min(1).optional(),
  minimumOrderAmount: z.number().min(0).optional(),
  operatingHours: z.record(z.object({
    start: z.string(),
    end: z.string(),
    active: z.boolean(),
  })).optional(),
  specialInstructions: z.array(z.string()).optional(),
  maxDailyOrders: z.number().int().min(1).optional(),
});

export type CreateZoneFormData = z.infer<typeof createZoneSchema>;

const orderItemSchema = z.object({
  productName: z.string().min(1, "Le nom du produit est requis"),
  quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
  price: z.number().min(0, "Le prix doit être positif"),
  specialInstructions: z.string().optional(),
});

export const createOrderSchema = z.object({
  orderNumber: z.string().optional(),
  customerName: z.string().min(1, "Le nom du client est requis"),
  customerPhone: z.string().min(1, "Le numéro de téléphone est requis"),
  customerEmail: z
    .string()
    .optional()
    .refine((v) => !v || v === "" || z.string().email().safeParse(v).success, {
      message: "Adresse e-mail invalide",
    }),
  deliveryAddress: z.string().min(1, "L'adresse de livraison est requise"),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  latitude: z.preprocess((v) => {
    if (v === "" || v === undefined || v === null) return undefined;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : undefined;
  }, z.number().optional()),
  longitude: z.preprocess((v) => {
    if (v === "" || v === undefined || v === null) return undefined;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : undefined;
  }, z.number().optional()),
  /** ID zone Surreal (`uuid` ou `delivery_zones:uuid`) — optionnel si résolution auto CP/ville */
  deliveryZoneId: z.string().optional(),
  priority: deliveryPriorityEnum.optional(),
  deliveryFee: z.number().min(0, "Les frais de livraison doivent être positifs"),
  totalAmount: z.number().min(0, "Le montant total doit être positif"),
  items: z.array(orderItemSchema).optional(),
  deliveryInstructions: z.string().optional(),
  notes: z.string().optional(),
  scheduledDeliveryTime: z.string().optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
