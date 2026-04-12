// Types de base pour l'authentification
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

// Types pour l'inventaire
export interface Product {
  id: string;
  name: string;
  barcode?: string;
  description?: string;
  price: number;
  cost: number;
  quantity: number;
  unit: string;
  category: ProductCategory;
  manufacturer: string;
  expiryDate?: string;
  batchNumber?: string;
  prescriptionRequired: boolean;
  isActive: boolean;
  lowStockThreshold: number;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

// Types pour les patients
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'OTHER';
  phone?: string;
  email?: string;
  address?: Address;
  insuranceNumber?: string;
  insuranceProvider?: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact?: EmergencyContact;
  loyaltyPoints: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

// Types pour les prescriptions
export interface Prescription {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorName: string;
  doctorLicense: string;
  prescriptionNumber: string;
  dateIssued: string;
  dateReceived: string;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'DISPENSED' | 'CANCELED';
  medications: PrescriptionMedication[];
  notes?: string;
  dispensedBy?: string;
  dispensedAt?: string;
  totalAmount: number;
  insuranceCovered: number;
  copayAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionMedication {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  isGenericAllowed: boolean;
  dispensedQuantity?: number;
}

// Types pour les transactions/facturation
export interface Transaction {
  id: string;
  transactionNumber: string;
  type: 'SALE' | 'RETURN' | 'ADJUSTMENT';
  customerId?: string;
  customer?: Patient;
  prescriptionId?: string;
  prescription?: Prescription;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: PaymentMethod;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'REFUNDED';
  processedBy: string;
  processedAt: string;
  receiptNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  taxRate: number;
  batchNumber?: string;
  expiryDate?: string;
}

export interface PaymentMethod {
  type: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'INSURANCE' | 'CREDIT' | 'CHECK';
  provider?: string;
  reference?: string;
  cardLastFour?: string;
}

// Types pour les notifications
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

// Types pour les rapports
export interface ReportConfig {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  schedule?: ReportSchedule;
  isActive: boolean;
}

export interface ReportSchedule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
}

// Types pour les employés/RH
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
  dayOfWeek: number; // 0 = Dimanche, 1 = Lundi, etc.
  startTime: string;
  endTime: string;
  isWorkDay: boolean;
}

// Types pour les livraisons
export interface Delivery {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: Patient;
  deliveryAddress: Address;
  items: TransactionItem[];
  status: 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELED';
  assignedTo?: string;
  deliveryFee: number;
  estimatedDelivery: string;
  actualDelivery?: string;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Types pour les analyses et métriques
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

// Types pour l'abonnement
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

// Types utilitaires
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

// Types pour les formulaires
export interface FormOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOption extends FormOption {}

// Types pour les modals et UI
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

// Types pour les permissions
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
}

// Constantes pour les statuts
export const PRESCRIPTION_STATUSES = {
  PENDING: 'En attente',
  PROCESSING: 'En cours de traitement',
  READY: 'Prête',
  DISPENSED: 'Dispensée',
  CANCELED: 'Annulée',
} as const;

export const TRANSACTION_STATUSES = {
  PENDING: 'En attente',
  COMPLETED: 'Terminée',
  CANCELED: 'Annulée',
  REFUNDED: 'Remboursée',
} as const;

export const DELIVERY_STATUSES = {
  PENDING: 'En attente',
  ASSIGNED: 'Assignée',
  IN_TRANSIT: 'En route',
  DELIVERED: 'Livrée',
  CANCELED: 'Annulée',
} as const;

// Enums manquants pour l'app
export enum ProductCategory {
  PRESCRIPTION = 'PRESCRIPTION',
  OTC = 'OTC',
  SUPPLEMENT = 'SUPPLEMENT',
  MEDICAL_DEVICE = 'MEDICAL_DEVICE',
  COSMETIC = 'COSMETIC',
  PERSONAL_CARE = 'PERSONAL_CARE',
}

export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DECEASED = 'DECEASED',
  TRANSFERRED = 'TRANSFERRED',
}

export enum PrescriptionStatus {
  RECEIVED = 'RECEIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export enum SaleStatus {
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