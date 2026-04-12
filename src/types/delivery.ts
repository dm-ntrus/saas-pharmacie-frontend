/**
 * Types Livraison — Alignés avec le backend
 * Source: src/business-logic/delivery/entities/ + dto/delivery.dto.ts
 */

// ─── Types ───

export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
export type DeliveryPriority = 'standard' | 'express' | 'same_day' | 'urgent';
export type VehicleType = 'bike' | 'motorcycle' | 'car' | 'van';
export type DriverStatus = 'active' | 'inactive' | 'suspended' | 'offline';
export type TrackingStatus = 'order_placed' | 'order_assigned' | 'driver_picked_up' | 'in_transit' | 'arrived_at_destination' | 'delivered' | 'delivery_failed';

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  pending: 'En attente',
  assigned: 'Assignée',
  picked_up: 'Récupérée',
  in_transit: 'En transit',
  delivered: 'Livrée',
  failed: 'Échouée',
  cancelled: 'Annulée',
};

export const DELIVERY_PRIORITY_LABELS: Record<DeliveryPriority, string> = {
  standard: 'Standard',
  express: 'Express',
  same_day: 'Même jour',
  urgent: 'Urgent',
};

export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  suspended: 'Suspendu',
  offline: 'Hors ligne',
};

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  bike: 'Vélo',
  motorcycle: 'Moto',
  car: 'Voiture',
  van: 'Camionnette',
};

// ─── Entities ───

export interface DeliveryOrder {
  id: string;
  created_at: string;
  updated_at: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  city: string;
  postal_code: string;
  latitude?: string;
  longitude?: string;
  delivery_zone_id?: string;
  driver_id?: string;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  delivery_fee: string;
  total_amount: string;
  items?: Record<string, unknown>;
  delivery_instructions?: string;
  notes?: string;
  scheduled_delivery_time?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  assigned_at?: string;
  picked_up_at?: string;
  signature_url?: string;
  photo_url?: string;
  failure_reason?: string;
  customer_rating?: string;
  customer_feedback?: string;
}

export interface DeliveryDriver {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  driver_code: string;
  phone: string;
  email: string;
  license_number?: string;
  license_expiry_date?: string;
  vehicle_type: VehicleType;
  vehicle_registration?: string;
  vehicle_model?: string;
  status: DriverStatus;
  current_latitude?: string;
  current_longitude?: string;
  last_location_update?: string;
  average_rating: string;
  total_deliveries: number;
  successful_deliveries: number;
  success_rate: string;
  working_hours?: Record<string, unknown>;
  bank_details?: Record<string, unknown>;
  earnings_this_month: string;
  last_delivery_at?: string;
  is_verified: boolean;
  documents?: Record<string, unknown>;
}

export interface DeliveryZone {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  boundaries: Record<string, unknown>;
  delivery_fee: string;
  estimated_delivery_time_minutes: number;
  minimum_order_amount?: string;
  is_active: boolean;
  operating_hours?: Record<string, unknown>;
  special_instructions?: string[];
  max_daily_orders: number;
}

export interface DeliveryTracking {
  id: string;
  created_at: string;
  delivery_order_id: string;
  status: TrackingStatus;
  message?: string;
  latitude?: string;
  longitude?: string;
  driver_name?: string;
  notes?: string;
  photo_url?: string;
}

// ─── Create / Update DTOs ───

export interface CreateDeliveryDriverDto {
  firstName: string;
  lastName: string;
  driverCode: string;
  phone: string;
  email: string;
  licenseNumber?: string;
  licenseExpiryDate?: string;
  vehicleType?: VehicleType;
  vehicleRegistration?: string;
  vehicleModel?: string;
  workingHours?: Record<string, { start: string; end: string; available: boolean }>;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
  };
  documents?: Array<{
    type: 'license' | 'registration' | 'insurance' | 'photo';
    url: string;
    verified: boolean;
    uploadedAt: string;
  }>;
}

export interface UpdateDeliveryDriverDto extends Partial<CreateDeliveryDriverDto> {
  status?: DriverStatus;
  currentLatitude?: number;
  currentLongitude?: number;
  lastLocationUpdate?: string;
  averageRating?: number;
  earningsThisMonth?: number;
  lastDeliveryAt?: string;
  isVerified?: boolean;
}

export interface CreateDeliveryOrderDto {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  deliveryZoneId: number;
  priority?: DeliveryPriority;
  deliveryFee: number;
  totalAmount: number;
  items?: Array<{
    productName: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
  }>;
  deliveryInstructions?: string;
  notes?: string;
  scheduledDeliveryTime?: string;
}

export interface UpdateDeliveryOrderDto extends Partial<CreateDeliveryOrderDto> {
  driverId?: number;
  status?: DeliveryStatus;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  assignedAt?: string;
  pickedUpAt?: string;
  signatureUrl?: string;
  photoUrl?: string;
  failureReason?: string;
  customerRating?: number;
  customerFeedback?: string;
}

export interface CreateDeliveryZoneDto {
  name: string;
  description?: string;
  boundaries: {
    type: 'polygon' | 'circle';
    coordinates: number[][];
    radius?: number;
    center?: { lat: number; lng: number };
  };
  deliveryFee: number;
  estimatedDeliveryTimeMinutes?: number;
  minimumOrderAmount?: number;
  operatingHours?: Record<string, { start: string; end: string; active: boolean }>;
  specialInstructions?: string[];
  maxDailyOrders?: number;
}

export interface UpdateDeliveryZoneDto extends Partial<CreateDeliveryZoneDto> {
  isActive?: boolean;
}

export interface CreateDeliveryTrackingDto {
  deliveryOrderId: number;
  status: TrackingStatus;
  message?: string;
  latitude?: number;
  longitude?: number;
  driverName?: string;
  notes?: string;
  photoUrl?: string;
}

// ─── Query Params ───

export interface DeliveryDriverQueryParams {
  status?: DriverStatus;
  vehicleType?: VehicleType;
  isVerified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DeliveryOrderQueryParams {
  status?: DeliveryStatus;
  priority?: DeliveryPriority;
  deliveryZoneId?: number;
  driverId?: number;
  customerPhone?: string;
  search?: string;
  createdAfter?: string;
  createdBefore?: string;
  page?: number;
  limit?: number;
}

export interface DeliveryTrackingQueryParams {
  deliveryOrderId?: number;
  status?: TrackingStatus;
  page?: number;
  limit?: number;
}

export interface DeliveryZoneQueryParams {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// ─── Dashboard ───

export interface DeliveryDashboard {
  totalOrders: number;
  pendingOrders: number;
  inTransitOrders: number;
  deliveredOrders: number;
  failedOrders: number;
  totalDrivers: number;
  activeDrivers: number;
  totalRevenue: number;
  averageDeliveryTime: number;
  ordersByStatus: Record<string, number>;
  ordersByZone: Record<string, number>;
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    customerName: string;
    status: string;
    deliveryAddress: string;
    createdAt: string;
  }>;
  topDrivers: Array<{
    id: number;
    name: string;
    totalDeliveries: number;
    averageRating: number;
    successRate: number;
  }>;
}
