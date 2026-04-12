/**
 * Types Pharmacy & Configuration — Alignés backend
 * Source: src/pharmacy/pharmacy-config (enums, DTOs, interfaces)
 */

export enum ValueType {
  string = "string",
  integer = "integer",
  float = "float",
  boolean = "boolean",
  json = "json",
  array = "array",
  object = "object",
}

export enum Category {
  inventory = "inventory",
  billing = "billing",
  workflow = "workflow",
  clinical = "clinical",
  integration = "integration",
  notification = "notification",
  security = "security",
  feature_flag = "feature_flag",
  pos = "pos",
  reports = "reports",
  multi_site = "multi_site",
  patient_engagement = "patient_engagement",
  compounding = "compounding",
  immunization = "immunization",
  compliance = "compliance",
  ui = "ui",
}

export enum UiType {
  text = "text",
  number = "number",
  textarea = "textarea",
  toggle = "toggle",
  select = "select",
  multiselect = "multiselect",
  json_editor = "json_editor",
}

export interface PharmacyConfig {
  id: string;
  organization_id: string;
  tenant_id?: string;
  pharmacy_id?: string;
  user_id?: string;
  config_key: string;
  config_value: unknown;
  value_type: ValueType;
  description?: string;
  category: Category;
  is_system_config: boolean;
  is_sensitive: boolean;
  is_feature_flag: boolean;
  ui_type?: UiType;
  select_options?: string[];
  validation_rules?: Record<string, unknown>;
  default_value?: unknown;
  effective_from?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePharmacyConfigDto {
  config_key: string;
  config_value: unknown;
  value_type: ValueType;
  category: Category;
  description?: string;
  is_sensitive?: boolean;
  is_system_config?: boolean;
  select_options?: string[];
  validation_rules?: Record<string, unknown>;
  pharmacy_id?: string;
  tenant_id?: string;
  user_id?: string;
}

export type UpdatePharmacyConfigDto = Partial<CreatePharmacyConfigDto>;

export interface PharmacyConfigFindManyParams {
  organization_id: string;
  category?: Category;
  pharmacy_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PharmacyConfigFindManyResult {
  items: PharmacyConfig[];
  total: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.inventory]: "Inventaire",
  [Category.billing]: "Facturation",
  [Category.workflow]: "Workflow",
  [Category.clinical]: "Clinique",
  [Category.integration]: "Intégration",
  [Category.notification]: "Notifications",
  [Category.security]: "Sécurité",
  [Category.feature_flag]: "Fonctionnalités",
  [Category.pos]: "Point de vente",
  [Category.reports]: "Rapports",
  [Category.multi_site]: "Multi-sites",
  [Category.patient_engagement]: "Engagement patient",
  [Category.compounding]: "Préparation",
  [Category.immunization]: "Vaccination",
  [Category.compliance]: "Conformité",
  [Category.ui]: "Interface",
};

export const VALUE_TYPE_LABELS: Record<ValueType, string> = {
  [ValueType.string]: "Texte",
  [ValueType.integer]: "Entier",
  [ValueType.float]: "Décimal",
  [ValueType.boolean]: "Oui/Non",
  [ValueType.json]: "JSON",
  [ValueType.array]: "Liste",
  [ValueType.object]: "Objet",
};
