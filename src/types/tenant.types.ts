// Tenant registration & creation types

export enum TenantType {
  SINGLE_PHARMACY = 'single_pharmacy',
  PHARMACY_CHAIN = 'pharmacy_chain',
  WHOLESALER = 'wholesaler',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
}

export enum OrganizationType {
  PHARMACY = 'pharmacy',
}

export interface TenantContactDto {
  email: string;
  phone: string;
}

export interface TenantAddressDto {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface TenantLocalizationDto {
  timezone: string;
  currency: string;
  language: string;
  dateFormat: string;
}

export interface TenantDataDto {
  name: string;
  subdomain: string;
  companyName?: string;
  contact: TenantContactDto;
  address?: TenantAddressDto;
  website?: string;
  licenseNumber: string;
  taxId?: string;
  localization?: TenantLocalizationDto;
  tenantType: TenantType;
}

export interface OwnerDataDto {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  enable2FA?: boolean;
  acceptTerms: boolean;
  acceptPrivacyPolicy: boolean;
  acceptDataProcessing: boolean;
  acceptMarketing?: boolean;
}

export interface PlanSelectionDto {
  planId: string;
  billingInterval: BillingCycle;
  trialDays?: number;
  promoCode?: string;
}

export interface PaymentInfoDto {
  paymentMethod: PaymentMethod;
  paymentProviderCode?: string;
  customerId?: string;
  paymentMethodId?: string;
}

export interface OrganisationDataDto {
  type: OrganizationType;
}

// Backend-aligned: pharmacyData is required for tenant provisioning
export interface PharmacyDataDto {
  licenseNumber: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
  website?: string;
  pharmacistInCharge: string;
  pharmacistLicenseNumber: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: Record<string, { open: string; close: string; closed?: boolean }>;
  services?: string[];
  status?: 'active' | 'inactive' | 'suspended';
  licenseExpiryDate?: string;
  certifications?: string[];
}

export interface CreateTenantDto {
  tenantData: TenantDataDto;
  ownerData: OwnerDataDto;
  planSelection: PlanSelectionDto;
  paymentInfo: PaymentInfoDto;
  organisationData: OrganisationDataDto;
  pharmacyData: PharmacyDataDto;
}

export type TenantRegistrationResponse =
  | {
      success: true;
      status: 'queued' | 'processing';
      provisioningId: string;
      ownerEmail: string;
      message: string;
      statusUrl: string;
    }
  | {
      success: true;
      tenantId: string;
      subdomain?: string;
      keycloakOrganizationId?: string;
      adminUserId?: string;
      subscriptionId?: string;
      message: string;
      nextSteps: string[];
      metadata?: Record<string, unknown>;
    };
