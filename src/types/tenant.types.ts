// Tenant registration & creation types

export enum TenantType {
  SINGLE_PHARMACY = 'single_pharmacy',
  PHARMACY_CHAIN = 'pharmacy_chain',
  WHOLESALER = 'wholesaler',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
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
  password: string;
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
}

export interface OrganisationDataDto {
  type: OrganizationType;
}

export interface CreateTenantDto {
  tenantData: TenantDataDto;
  ownerData: OwnerDataDto;
  planSelection: PlanSelectionDto;
  paymentInfo: PaymentInfoDto;
  organisationData: OrganisationDataDto;
}
