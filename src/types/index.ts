  // ============================================================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================================================
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  PHARMACIST = 'pharmacist',
  CASHIER = 'cashier',
  TECHNICIAN = 'technician',
  LAB_TECHNICIAN = 'lab_technician',
  DELIVERY_MANAGER = 'delivery_manager',
  HR_MANAGER = 'hr_manager',
  MARKETING_MANAGER = 'marketing_manager',
  INSURANCE_MANAGER = 'insurance_manager',
  ACCOUNTANT = 'accountant',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  roles: UserRole[];
  permissions: string[];
  tenantId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TENANT & SUBSCRIPTIONS
// ============================================================================
export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  subscriptionPlan: 'SIMPLE' | 'MOYENNE' | 'STANDARD' | 'GROSSISTE';
  subscriptionStatus: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIAL';
  trialEndsAt?: string;
  maxUsers: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'MONTHLY' | 'YEARLY';
  features: string[];
  maxUsers: number;
  maxProducts: number;
  storageLimit: number;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIAL';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  paymentMethod?: PaymentMethod;
  lastPayment?: string;
  nextPayment?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHARMACY CONFIG
// ============================================================================
export interface PharmacyConfig {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  taxId: string;
  currency: string;
  timezone: string;
  logo?: string;
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// INVENTORY & PRODUCTS
// ============================================================================
export enum ProductType {
  MEDICATION = 'MEDICATION',
  OTC = 'OTC',
  MEDICAL_DEVICE = 'MEDICAL_DEVICE',
  SUPPLEMENT = 'SUPPLEMENT',
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

export enum BatchStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  RECALLED = 'RECALLED',
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

export interface ProductQueryDto {
  search?: string;
  status?: ProductStatus;
  type?: ProductType;
  manufacturer?: string;
  page?: number;
  limit?: number;
}


export interface CreateProductDto {
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  manufacturer: string;
  activeIngredient?: string;
  strength: string;
  dosageForm: string;
  type: ProductType;
  price: number;
  costPrice: number;
  requiresPrescription?: boolean;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  shelfLocation?: string;
}

export interface Product extends CreateProductDto {
  id: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductBatchDto {
  productId: string;
  batchNumber: string;
  manufactureDate: Date | string;
  expirationDate: Date | string;
  receivedDate: Date | string;
  initialQuantity: number;
  currentQuantity: number;
  reservedQuantity?: number;
  unitCost: number;
  status: BatchStatus;
  supplierName?: string;
}

export interface BatchQueryDto {
  productId?: string;
  status?: BatchStatus;
  expiringDays?: number;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export interface AdjustBatchQuantityDto {
  quantity: number;
  reason: string;
  userId: string;
}

// export interface InventoryAlert {
//   id: string;
//   type: string;
//   severity: string;
//   resolved: boolean;
//   product?: Product;
//   message: string;
//   createdAt: Date;
// }

export enum InventoryLocationType {
  SHELF = 'shelf',
  REFRIGERATOR = 'refrigerator',
  FREEZER = 'freezer',
  COUNTER = 'counter',
  WAREHOUSE = 'warehouse',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertType {
  LOW_STOCK = 'low_stock',
  EXPIRING_SOON = 'expiring_soon',
  EXPIRED = 'expired',
  OVERSTOCK = 'overstock',
  ABNORMAL_CONSUMPTION = 'abnormal_consumption',
}

export interface InventoryLocationDto {
  name: string;
  type: InventoryLocationType;
  displayCategory?: string;
  description?: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  type: InventoryLocationType;
  displayCategory?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  productId?: string;
  product?: Product;
  batchNumber?: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  snoozedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export enum DEASchedule {
  SCHEDULE_I = "schedule_i",
  SCHEDULE_II = "schedule_ii",
  SCHEDULE_III = "schedule_iii",
  SCHEDULE_IV = "schedule_iv",
  SCHEDULE_V = "schedule_v",
  UNSCHEDULED = "unscheduled",
}

export interface ControlledSubstanceLog {
  id: string;
  productId: string;
  batchId: string;
  action: string;
  deaSchedule: DEASchedule;
  quantity: number;
  createdAt: string;
  product?: Product;
  batch?: ProductBatchDto;
  user?: User;
  patient?: Patient;
  prescriber?: User;
  witness?: User;
  notes?: string;
}

// ============================================================================
// PATIENTS
// ============================================================================
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DECEASED = 'DECEASED',
  TRANSFERRED = 'TRANSFERRED',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
  gender: Gender;
  phone: string;
  email?: string;
  address: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies?: string;
  medicalConditions?: string;
  currentMedications?: string;
}

export interface Patient extends CreatePatientDto {
  id: string;
  patientNumber: string;
  status?: PatientStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientQueryDto {
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// PRESCRIPTIONS
// ============================================================================
export enum PrescriptionStatus {
  RECEIVED = 'RECEIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export interface PrescriptionItemDto {
  productId: string;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface CreatePrescriptionDto {
  doctorName: string;
  doctorLicense?: string;
  doctorPhone?: string;
  prescriptionDate: Date | string;
  validUntil: Date | string;
  items: PrescriptionItemDto[];
  notes?: string;
}

export interface DispensePrescriptionDto {
  dispenserId: string;
  items: Array<{
    prescriptionItemId: string;
    quantityDispensed: number;
    batchNumber?: string;
  }>;
}

export interface Prescription extends CreatePrescriptionDto {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  status: PrescriptionStatus | string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SALES & TRANSACTIONS
// ============================================================================
export enum SaleStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  INSURANCE = 'INSURANCE',
  CREDIT = 'CREDIT',
  CHECK = 'CHECK',
}

export interface SaleItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  batchNumber?: string;
}

export interface CreateSaleDto {
  patientId?: string;
  cashierId: string;
  items: SaleItemDto[];
  paymentMethod: PaymentMethod;
  amountPaid: number;
  notes?: string;
  prescriptionId?: string;
}

export interface UpdateSaleDto {
  status?: SaleStatus;
  notes?: string;
}

export interface SaleQueryDto {
  search?: string;
  page?: number;
  limit?: number;
  status?: SaleStatus;
  paymentMethod?: PaymentMethod;
  cashierId?: string;
  patientId?: string;
  startDate?: string;
  endDate?: string;
}

export interface SalesReportQueryDto {
  startDate: Date | string;
  endDate: Date | string;
  cashierId?: string;
  productId?: string;
  categoryId?: string;
}

export interface Sale {
  id: string;
  saleNumber: string;
  patient?: any;
  cashier: any;
  status: SaleStatus;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  changeGiven: number;
  notes?: string;
  items: SaleItemDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RefundSaleDto {
  reason: string;
}

export interface PartialRefundDto {
  items: Array<{
    itemId: string;
    quantityReturned: number;
    reason: string;
  }>;
}

// ============================================================================
// DELIVERY
// ============================================================================
export const DELIVERY_STATUSES = {
  PENDING: 'En attente',
  ASSIGNED: 'Assignée',
  IN_TRANSIT: 'En route',
  DELIVERED: 'Livrée',
  CANCELED: 'Annulée',
} as const;

export interface Delivery {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: Patient;
  deliveryAddress: Address;
  items: SaleItemDto[];
  status: keyof typeof DELIVERY_STATUSES;
  assignedTo?: string;
  deliveryFee: number;
  estimatedDelivery: string;
  actualDelivery?: string;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// HR & EMPLOYEES
// ============================================================================
export interface Employee {
  id: string;
  userId: string;
  user?: User;
  employeeNumber: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  isActive: boolean;
  manager?: Employee;
  permissions: string[];
  workSchedule: WorkSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkSchedule {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday...
  startTime: string;
  endTime: string;
  isWorkDay: boolean;
}

// ============================================================================
// ACCOUNTING
// ============================================================================
export interface CreateAccountDto {
  accountCode: string;
  accountName: string;
  accountType: string;
  normalBalance: string;
}

export interface CreateTransactionDto {
  accountId?: string;
  debit?: string;
  credit?: string;
  description: string;
  date: Date | string;
}

export interface CreateInvoiceDto {
  customerId: string;
  invoiceNumber: string;
  invoiceDate: Date | string;
  dueDate: Date | string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export interface CreateExpenseDto {
  accountId: number;
  amount: number;
  description: string;
  expenseDate: Date | string;
  category: string;
  approvedBy?: string;
}

// ============================================================================
// NOTIFICATIONS & UI
// ============================================================================
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
  data?: Record<string, any>;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface FormOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOption extends FormOption {}

// ============================================================================
// ANALYTICS
// ============================================================================
export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalPatients: number;
  lowStockProducts: number;
  expiringProducts: number;
  pendingPrescriptions: number;
}

export interface SalesAnalytics {
  period: string;
  totalSales: number;
  totalRevenue: number;
  averageTransactionValue: number;
  salesByDay: Array<{ date: string; sales: number; revenue: number }>;
  topProducts: Array<{ productId: string; name: string; quantity: number; revenue: number }>;
}

export interface DashboardMetrics {
  todaySales: {
    count: number;
    amount: number;
    changePercent: number;
  };
  todayRevenue: {
    amount: number;
    changePercent: number;
  };
  totalProducts: number;
  lowStockProducts: number;
  expiringProducts: number;
  activePatients: number;
  pendingPrescriptions: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  userId: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// UTILS
// ============================================================================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
