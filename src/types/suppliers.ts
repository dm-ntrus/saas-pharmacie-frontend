/**
 * Types Fournisseurs & Supply Chain — alignés backend supplier / supply-chain
 */

export type SupplierStatus = "active" | "inactive" | "suspended" | "blacklisted";
export type SupplierType =
  | "manufacturer"
  | "distributor"
  | "wholesaler"
  | "importer"
  | "local_supplier"
  | "other";

export type PurchaseOrderStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "ordered"
  | "sent"
  | "confirmed"
  | "partially_received"
  | "received"
  | "cancelled"
  | "closed";

export interface Supplier {
  id: string;
  created_at?: string;
  updated_at?: string;
  supplier_code?: string;
  supplierCode?: string;
  name: string;
  type?: SupplierType;
  status?: SupplierStatus;
  contact_person?: string;
  contactPerson?: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  tax_id?: string;
  payment_terms?: string;
  paymentTerms?: Record<string, unknown>;
  lead_time_days?: number;
  leadTimeDays?: number;
  minimum_order_value?: string | number;
  minimumOrderValue?: number;
  rating?: string | number;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  deliveryTerms?: Record<string, unknown>;
  certifications?: string[];
  licenses?: string[];
  last_order_date?: string;
  total_orders?: number;
  total_order_value?: string;
  product_categories?: string[];
}

export interface PurchaseOrder {
  id: string;
  created_at?: string;
  updated_at?: string;
  order_number?: string;
  po_number?: string;
  supplier_id: string;
  supplierId?: string;
  status: PurchaseOrderStatus;
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  subtotal: string | number;
  tax_amount?: string | number;
  shipping_cost?: string | number;
  discount_amount?: string | number;
  total_amount: string | number;
  notes?: string;
  reference_number?: string;
  shipping_address?: string;
  currency?: string;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id?: string;
  product_id?: string;
  productId?: string;
  product_name?: string;
  productName?: string;
  product_sku?: string;
  quantity?: number;
  ordered_quantity?: number;
  received_quantity?: number;
  unit_price?: number;
  unit_cost?: string | number;
  line_total?: string | number;
  status?: string;
}

export interface SupplierContract {
  id: string;
  supplier_id?: string;
  start_date: string;
  end_date: string;
  status?: string;
  terms?: string;
}

export interface SupplierProduct {
  id: string;
  product_id?: string;
  product_name?: string;
  supplier_sku?: string;
  unit_price?: string | number;
}

export interface DemandForecast {
  id: string;
  product_id?: string;
  forecast_date?: string;
  forecast_period?: string;
  method?: string;
  forecasted_demand?: string | number;
  historical_demand?: string | number;
}

export interface InventoryPolicy {
  id: string;
  product_id?: string;
  policy?: string;
  reorder_point_method?: string;
  reorder_point?: number;
  safety_stock?: number;
}

export interface SupplyChainAlert {
  id: string;
  severity?: string;
  category?: string;
  status?: string;
  title?: string;
  message?: string;
  created_at?: string;
}

export const SUPPLIER_TYPE_LABELS: Record<string, string> = {
  manufacturer: "Fabricant",
  distributor: "Distributeur",
  wholesaler: "Grossiste",
  importer: "Importateur",
  local_supplier: "Fournisseur local",
  other: "Autre",
};

export const PO_STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  pending_approval: "En attente d'approbation",
  approved: "Approuvée",
  ordered: "Commandée",
  sent: "Envoyée",
  confirmed: "Confirmée",
  partially_received: "Partiellement reçue",
  received: "Reçue",
  cancelled: "Annulée",
  closed: "Clôturée",
};

/** Réquisition interne */
export type PurchaseRequestStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "converted"
  | "cancelled";

export interface PurchaseRequestLine {
  id?: string;
  product_id?: string;
  product_name?: string;
  product_sku?: string;
  quantity?: number;
  estimated_unit_cost?: string | number;
}

export interface PurchaseRequest {
  id: string;
  request_number?: string;
  status: PurchaseRequestStatus | string;
  title?: string;
  notes?: string;
  requested_by?: string;
  submitted_at?: string;
  approved_by?: string;
  approved_at?: string;
  rejected_reason?: string;
  preferred_supplier_id?: string;
  converted_purchase_order_id?: string;
  created_at?: string;
  lines?: PurchaseRequestLine[];
}

export const PR_STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  submitted: "Soumise",
  approved: "Approuvée",
  rejected: "Refusée",
  converted: "Transformée en BC",
  cancelled: "Annulée",
};

/** Bon de réception (GRN) */
export interface GoodsReceiptLine {
  id?: string;
  goods_receipt_id?: string;
  purchase_order_item_id?: string;
  product_id?: string;
  quantity_received?: number;
  quantity_accepted?: number;
  quantity_rejected?: number;
  qc_status?: string;
  batch_number?: string;
  expiry_date?: string;
  line_notes?: string;
}

export interface GoodsReceipt {
  id: string;
  grn_number?: string;
  purchase_order_id?: string;
  received_by?: string;
  notes?: string;
  qc_summary?: string;
  created_at?: string;
  lines?: GoodsReceiptLine[];
}

export const QC_STATUS_LABELS: Record<string, string> = {
  accepted: "Accepté",
  rejected: "Refusé",
  quarantine: "Quarantaine",
};

/** Devis fournisseur (comparaison) */
export interface SupplierProductQuote {
  id: string;
  supplier_id?: string;
  supplierName?: string;
  product_id?: string;
  unit_price?: string | number;
  currency?: string;
  min_order_qty?: number;
  lead_time_days?: number;
  quote_reference?: string;
  valid_until?: string;
  notes?: string;
  created_at?: string;
}
