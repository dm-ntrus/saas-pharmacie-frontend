/**
 * Types Sales — Alignés avec le backend
 * Source: src/business-logic/entities/sale.entity.ts + src/business-logic/sales/dto/sales.dto.ts
 */

export enum SaleStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  PARTIALLY_PAID = "partially_paid",
}

/** Aligné avec backend payment.enums (valeurs envoyées à l'API) */
export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  MOBILE_MONEY = "mobile_money",
  BANK_TRANSFER = "bank_transfer",
  INSURANCE = "insurance",
  CHECK = "check",
  CREDIT = "credit",
}

export enum SaleSourceType {
  MANUAL = "manual",
  PRESCRIPTION = "prescription",
  APPOINTMENT = "appointment",
  RECURRING = "recurring",
  ONLINE = "online",
}

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  [SaleStatus.PENDING]: "En attente",
  [SaleStatus.COMPLETED]: "Complétée",
  [SaleStatus.CANCELLED]: "Annulée",
  [SaleStatus.REFUNDED]: "Remboursée",
  [SaleStatus.PARTIALLY_PAID]: "Partiellement payée",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Espèces",
  [PaymentMethod.CARD]: "Carte",
  [PaymentMethod.CREDIT_CARD]: "Carte bancaire",
  [PaymentMethod.DEBIT_CARD]: "Carte de débit",
  [PaymentMethod.MOBILE_MONEY]: "Mobile Money",
  [PaymentMethod.BANK_TRANSFER]: "Virement",
  [PaymentMethod.INSURANCE]: "Assurance",
  [PaymentMethod.CHECK]: "Chèque",
  [PaymentMethod.CREDIT]: "Crédit",
};

export interface SaleItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  discountPercent?: number;
  batchId?: string;
  batchNumber?: string;
  unitCost?: number;
  locationId?: string;
  notes?: string;
  prescriptionLineId?: string;
  isGift?: boolean;
}

export interface CreateSaleDto {
  idempotencyKey?: string;
  patientId?: string;
  cashierId: string;
  items: SaleItemDto[];
  paymentMethod: PaymentMethod;
  amountPaid: number;
  notes?: string;
  isCreditSale?: boolean;
  taxRate?: number;
  sourceType?: SaleSourceType;
  sourceId?: string;
  sourceNumber?: string;
  insuranceProviderId?: string;
  insurancePolicyNumber?: string;
  insuranceCoveragePercent?: number;
  internalNotes?: string;
}

export interface Sale {
  id: string;
  sale_number: string;
  pharmacy_id: string;
  patient_id?: string;
  cashier_id: string;
  status: SaleStatus;
  subtotal: string;
  tax_amount: string;
  tax_rate?: string;
  discount_amount: string;
  total_amount: string;
  payment_method: PaymentMethod;
  amount_paid: string;
  change_given: string;
  balance_due?: string;
  is_credit_sale?: boolean;
  items_count?: number;
  unique_products_count?: number;
  insurance_provider_id?: string;
  insurance_policy_number?: string;
  insurance_coverage_percent?: string;
  insurance_covered_amount?: string;
  patient_copay_amount?: string;
  source_type?: SaleSourceType;
  source_id?: string;
  source_number?: string;
  invoice_id?: string;
  invoice_number?: string;
  sale_date?: string;
  completed_at?: string;
  cancelled_at?: string;
  refunded_at?: string;
  /** Document retour (séquence RET-YYYYMMDD-####) après remboursement */
  sale_return_number?: string;
  notes?: string;
  internal_notes?: string;
  cancellation_reason?: string;
  refund_reason?: string;
  cost_of_goods_sold?: string;
  profit_margin_amount?: string;
  profit_margin_percent?: string;
  created_at: string;
  updated_at: string;
  // Populated relations
  patient?: { firstName: string; lastName: string };
  cashier?: { firstName: string; lastName: string };
  items?: SaleItemDto[];
}

export interface SalesReportQuery {
  startDate: string;
  endDate: string;
}

export interface SalesReportSummary {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}

// Cashier Sessions
export interface OpenSessionDto {
  openingBalance: number;
  notes?: string;
}

export interface CloseSessionDto {
  closingBalance: number;
  notes?: string;
  discrepancyReason?: string;
}

export interface CashierSession {
  id: string;
  cashier_id: string;
  pharmacy_id: string;
  status: "open" | "closed";
  opening_balance: string;
  closing_balance?: string;
  total_sales?: string;
  total_refunds?: string;
  total_cash_in?: string;
  total_cash_out?: string;
  discrepancy?: string;
  discrepancy_reason?: string;
  notes?: string;
  opened_at: string;
  closed_at?: string;
}
