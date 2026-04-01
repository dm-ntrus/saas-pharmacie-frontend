export enum ProductType {
  PRESCRIPTION = "prescription",
  OTC = "otc",
  SUPPLEMENT = "supplement",
  MEDICAL_DEVICE = "medical_device",
  COSMETIC = "cosmetic",
}

export enum ProductStatus {
  ACTIVE = "active",
  DISCONTINUED = "discontinued",
  PENDING_APPROVAL = "pending_approval",
}

export enum ProductCategory {
  MEDICINE = "medicine",
  SUPPLEMENT = "supplement",
  MEDICAL_EQUIPMENT = "equipment",
  BEAUTY_SKINCARE = "beauty",
  MOTHER_BABY = "mother_baby",
  HYGIENE = "hygiene",
  FIRST_AID = "first_aid",
  ORTHOPEDICS = "orthopedics",
  VETERINARY = "veterinary",
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.MEDICINE]: "Médicaments",
  [ProductCategory.SUPPLEMENT]: "Compléments",
  [ProductCategory.MEDICAL_EQUIPMENT]: "Équipements médicaux",
  [ProductCategory.BEAUTY_SKINCARE]: "Beauté & Soins",
  [ProductCategory.MOTHER_BABY]: "Mère & Bébé",
  [ProductCategory.HYGIENE]: "Hygiène",
  [ProductCategory.FIRST_AID]: "Premiers secours",
  [ProductCategory.ORTHOPEDICS]: "Orthopédie",
  [ProductCategory.VETERINARY]: "Vétérinaire",
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: "Actif",
  [ProductStatus.DISCONTINUED]: "Discontinué",
  [ProductStatus.PENDING_APPROVAL]: "En attente",
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  [ProductType.PRESCRIPTION]: "Sur ordonnance",
  [ProductType.OTC]: "En vente libre",
  [ProductType.SUPPLEMENT]: "Complément",
  [ProductType.MEDICAL_DEVICE]: "Dispositif médical",
  [ProductType.COSMETIC]: "Cosmétique",
};

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  tenant_id: string;
  name: string;
  sku?: string;
  barcode: string;
  internal_code?: string;
  description?: string;
  manufacturer: string;
  brand?: string;
  active_ingredient: string;
  strength: string;
  dosage_form: string;
  unit_of_measure: string;
  packaging_size?: number;
  category: ProductCategory;
  type: ProductType;
  requires_prescription: boolean;
  is_narcotic?: boolean;
  is_cold_chain?: boolean;
  dea_schedule?: string;
  storage_conditions?: string;
  reference_price?: string;
  status: ProductStatus;
  metadata?: Record<string, unknown>;
  /** URL média (CDN, stockage objet) */
  primary_image_url?: string;
  /** Code ATC OMS (ex. N02BE01) */
  atc_code?: string;
  /** Libellé classe thérapeutique */
  therapeutic_class?: string;
}

export type ProductPriceKind =
  | "reference"
  | "sale"
  | "purchase"
  | "promotional"
  | "wholesale"
  | "insurance"
  | "member";

export type ProductPriceSource = "product" | "organization_price";

export interface ProductPriceHistoryItem {
  id: string;
  price_kind: ProductPriceKind | string;
  old_value: string | null;
  new_value: string;
  source: ProductPriceSource | string;
  created_at: string;
  changed_by?: string;
}

export interface ReorderSuggestionItem {
  product_id: string;
  quantity: number;
  product_name?: string;
  sku?: string;
  barcode?: string;
}

export interface ProductQueryParams {
  search?: string;
  category?: ProductCategory;
  type?: ProductType;
  status?: ProductStatus;
  manufacturer?: string;
  activeIngredient?: string;
  requiresPrescription?: boolean;
  /** Filtre "stock faible" (§3.4) */
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateProductPayload {
  name: string;
  barcode: string;
  manufacturer: string;
  activeIngredient: string;
  strength: string;
  dosageForm: string;
  unitOfMeasure: string;
  category: ProductCategory;
  type: ProductType;
  sku?: string;
  internalCode?: string;
  description?: string;
  brand?: string;
  packagingSize?: number;
  isNarcotic?: boolean;
  isColdChain?: boolean;
  requiresPrescription?: boolean;
  deaSchedule?: string;
  storageConditions?: string;
  referencePrice?: number;
  metadata?: Record<string, unknown>;
  primaryImageUrl?: string;
  atcCode?: string;
  therapeuticClass?: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  status?: ProductStatus;
};

// ─── Lots (Batches) ───────────────────────────────────────────

export enum BatchStatus {
  ACTIVE = "active",
  QUARANTINE = "quarantine",
  EXPIRED = "expired",
  RECALLED = "recalled",
  DEPLETED = "depleted",
  DAMAGED = "damaged",
}

export const BATCH_STATUS_LABELS: Record<BatchStatus, string> = {
  [BatchStatus.ACTIVE]: "Actif",
  [BatchStatus.QUARANTINE]: "Quarantaine",
  [BatchStatus.EXPIRED]: "Expiré",
  [BatchStatus.RECALLED]: "Rappelé",
  [BatchStatus.DEPLETED]: "Épuisé",
  [BatchStatus.DAMAGED]: "Endommagé",
};

export interface ProductBatch {
  id: string;
  product_id: string;
  product_name?: string;
  batch_number: string;
  lot_number?: string;
  manufacture_date?: string;
  expiration_date: string;
  received_date?: string;
  initial_quantity: number;
  current_quantity: number;
  reserved_quantity?: number;
  unit_cost?: number;
  wholesale_price?: number;
  status: BatchStatus | string;
  supplier_name?: string;
  storage_conditions?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBatchPayload {
  productId: string;
  batchNumber: string;
  manufactureDate?: string;
  expirationDate: string;
  receivedDate?: string;
  initialQuantity: number;
  unitCost?: number;
  supplierName?: string;
  storageConditions?: string;
  notes?: string;
}

export type UpdateBatchPayload = Partial<CreateBatchPayload>;

export enum AlertType {
  LOW_STOCK = "low_stock",
  OUT_OF_STOCK = "out_of_stock",
  EXPIRING_SOON = "expiring_soon",
  EXPIRED = "expired",
  OVERSTOCK = "overstock",
  RECALL = "recall",
  TEMPERATURE_DEVIATION = "temperature_deviation",
}

export enum AlertSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum AlertStatus {
  ACTIVE = "active",
  ACKNOWLEDGED = "acknowledged",
  RESOLVED = "resolved",
  SNOOZED = "snoozed",
}

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  [AlertType.LOW_STOCK]: "Stock bas",
  [AlertType.OUT_OF_STOCK]: "Rupture de stock",
  [AlertType.EXPIRING_SOON]: "Péremption proche",
  [AlertType.EXPIRED]: "Expiré",
  [AlertType.OVERSTOCK]: "Surstock",
  [AlertType.RECALL]: "Rappel de lot",
  [AlertType.TEMPERATURE_DEVIATION]: "Écart température",
};

export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  [AlertSeverity.LOW]: "Faible",
  [AlertSeverity.MEDIUM]: "Moyen",
  [AlertSeverity.HIGH]: "Élevé",
  [AlertSeverity.CRITICAL]: "Critique",
};

export interface InventoryAlert {
  id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  product_id?: string;
  product_name?: string;
  location_id?: string;
  message: string;
  details?: Record<string, unknown>;
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  snoozed_until?: string;
}

export interface InventoryKPIs {
  total_products: number;
  total_stock_value: string;
  turnover_rate: number;
  days_of_stock: number;
  expiry_rate: number;
  stockout_rate: number;
  low_stock_count: number;
  expired_count: number;
  expiring_soon_count: number;
}

export interface StockTransfer {
  id: string;
  transfer_number: string;
  from_location_id: string;
  from_location_name?: string;
  to_location_id: string;
  to_location_name?: string;
  status: string;
  items: StockTransferLine[];
  notes?: string;
  created_at: string;
  completed_at?: string;
}

export interface StockTransferLine {
  product_id: string;
  product_name?: string;
  batch_number?: string;
  quantity: number;
  received_quantity?: number;
}

// ─── Emplacements (Inventory Locations) ────────────────────────
// Aligné avec db/schema/tables/tenant/inventory_locations.surql et backend entity

export enum LocationType {
  WAREHOUSE = "warehouse",
  PHARMACY_FLOOR = "pharmacy_floor",
  SHELF = "shelf",
  DRAWER = "drawer",
  REFRIGERATOR = "refrigerator",
  FREEZER = "freezer",
  SECURE_CABINET = "secure_cabinet",
  SAFE = "safe",
  COUNTER = "counter",
  STORAGE_ROOM = "storage_room",
  DISPENSARY = "dispensary",
  DISPLAY = "display",
  PROMOTIONAL_STAND = "promotional_stand",
  RECEIVING_AREA = "receiving_area",
  SHIPPING_AREA = "shipping_area",
}

export enum DisplayCategory {
  OTC_MEDICATIONS = "otc_medications",
  PRESCRIPTIONS = "prescriptions",
  VITAMINS = "vitamins",
  FIRST_AID = "first_aid",
  PERSONAL_CARE = "personal_care",
  CONTROLLED_SUBSTANCES = "controlled_substances",
  SEASONAL = "seasonal",
  PROMOTIONAL = "promotional",
}

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  [LocationType.WAREHOUSE]: "Entrepôt",
  [LocationType.PHARMACY_FLOOR]: "Salle de vente",
  [LocationType.SHELF]: "Étagère",
  [LocationType.DRAWER]: "Tiroir",
  [LocationType.REFRIGERATOR]: "Réfrigérateur",
  [LocationType.FREEZER]: "Congélateur",
  [LocationType.SECURE_CABINET]: "Armoire sécurisée",
  [LocationType.SAFE]: "Coffre-fort",
  [LocationType.COUNTER]: "Comptoir",
  [LocationType.STORAGE_ROOM]: "Réserve",
  [LocationType.DISPENSARY]: "Dispensaire",
  [LocationType.DISPLAY]: "Présentoir",
  [LocationType.PROMOTIONAL_STAND]: "Stand promotionnel",
  [LocationType.RECEIVING_AREA]: "Zone réception",
  [LocationType.SHIPPING_AREA]: "Zone expédition",
};

export interface Coordinates3D {
  x: number;
  y: number;
  z: number;
}

export interface InventoryLocation {
  id: string;
  created_at?: string;
  updated_at?: string;
  pharmacy_id?: string;
  code: string;
  name: string;
  description?: string;
  parent_location_id?: string | null;
  location_type: LocationType | string;
  allowed_categories?: string[];
  display_category?: DisplayCategory | string;
  zone_code?: string;
  aisle_number?: string;
  shelf_level?: string;
  position_code?: string;
  coordinates_3d?: Coordinates3D;
  is_secured: boolean;
  requires_key?: boolean;
  requires_badge?: boolean;
  is_refrigerated: boolean;
  is_humidity_controlled?: boolean;
  is_promotional?: boolean;
  compliance_required?: boolean;
  max_capacity?: number;
  max_weight_kg?: number;
  current_item_count: number;
  current_weight_kg?: number;
  utilization_percentage: number;
  temperature_min?: number;
  temperature_max?: number;
  temperature_current?: number;
  humidity_min?: number;
  humidity_max?: number;
  humidity_current?: number;
  last_sensor_reading_at?: string;
  merchandising_rules?: Record<string, unknown>;
  access_restrictions?: Record<string, unknown>;
  picking_priority?: number;
  putaway_priority?: number;
  active: boolean;
  temporarily_blocked: boolean;
  blocked_reason?: string;
  blocked_until?: string;
}

export interface CreateInventoryLocationPayload {
  code: string;
  name: string;
  description?: string;
  parent_location_id?: string;
  location_type: LocationType | string;
  display_category?: DisplayCategory | string;
  zone_code?: string;
  aisle_number?: string;
  shelf_level?: string;
  position_code?: string;
  coordinates_3d?: Coordinates3D;
  is_secured?: boolean;
  requires_key?: boolean;
  requires_badge?: boolean;
  is_refrigerated?: boolean;
  is_promotional?: boolean;
  compliance_required?: boolean;
  max_capacity?: number;
  temperature_min?: number;
  temperature_max?: number;
  active?: boolean;
}

export type UpdateInventoryLocationPayload = Partial<CreateInventoryLocationPayload>;
