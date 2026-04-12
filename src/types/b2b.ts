export type BusinessPartnerType = "retailer" | "wholesaler" | "clinic" | "hospital";
export type BusinessPartnerStatus = "active" | "inactive" | "blocked";

export interface BusinessPartner {
  id: string;
  partner_code: string;
  type: BusinessPartnerType;
  legal_name: string;
  trade_name?: string;
  status: BusinessPartnerStatus;
  payment_terms_days?: number;
  credit_limit?: number;
  email?: string;
  phone?: string;
}

export interface SalesOrderB2BLine {
  id?: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  discount_amount?: number;
  line_total?: number;
}

export interface SalesOrderB2B {
  id: string;
  order_number: string;
  partner_id: string;
  status: "draft" | "confirmed" | "allocated" | "shipped" | "invoiced" | "closed" | "cancelled";
  total_amount: number;
  created_at: string;
  lines?: SalesOrderB2BLine[];
}
