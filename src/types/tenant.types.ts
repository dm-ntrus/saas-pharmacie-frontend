export enum TenantType {
  SINGLE_PHARMACY = 'single_pharmacy',
  PHARMACY_CHAIN = 'pharmacy_chain',
  HOSPITAL_NETWORK = 'hospital_network',
  CLINIC_CHAIN = 'clinic_chain',
  ENTERPRISE = 'enterprise',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  QUARTERLY = 'quarterly',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  CASH = 'cash',
}

export enum OrganizationType {
  PHARMACY = 'pharmacy',
  CLINIC = 'clinic',
  HOSPITAL = 'hospital',
  LABORATORY = 'laboratory',
}

export enum PharmacyType {
  // Officines de ville (retail / community)
  COMMUNITY = 'community',
  INDEPENDENT = 'independent',
  CHAIN = 'chain',
  FRANCHISE = 'franchise',
  COOPERATIVE = 'cooperative',
  RURAL = 'rural',
  URBAN = 'urban',

  // Grande distribution & parapharmacie
  PARAPHARMACY = 'parapharmacy',
  SUPERMARKET = 'supermarket',

  // Pharmacies hospitalières & cliniques
  HOSPITAL = 'hospital',
  CLINIC = 'clinic',
  POLYCLINIC = 'polyclinic',
  UNIVERSITY_HOSPITAL = 'university_hospital',

  // Pharmacies spécialisées
  COMPOUNDING = 'compounding',
  HOMEOPATHIC = 'homeopathic',
  HERBAL = 'herbal',
  VETERINARY = 'veterinary',
  ONCOLOGY = 'oncology',
  PEDIATRIC = 'pediatric',
  GERIATRIC = 'geriatric',
  OPHTHALMIC = 'ophthalmic',
  DERMATOLOGY = 'dermatology',
  NUCLEAR = 'nuclear',
  INFUSION = 'infusion',

  // Distribution & grossiste
  WHOLESALE = 'wholesale',
  CENTRAL_PURCHASING = 'central_purchasing',
  DISTRIBUTOR = 'distributor',

  // Pharmacie en ligne & télémédecine
  ONLINE = 'online',
  MAIL_ORDER = 'mail_order',
  TELEPHARMACY = 'telepharmacy',

  // Pharmacies institutionnelles & publiques
  MILITARY = 'military',
  PRISON = 'prison',
  GOVERNMENT = 'government',
  NGO_HUMANITARIAN = 'ngo_humanitarian',

  // Pharmacie industrielle & recherche
  INDUSTRIAL = 'industrial',
  RESEARCH = 'research',
  TEACHING = 'teaching',

  // Soins de longue durée
  LONG_TERM_CARE = 'long_term_care',
  HOME_HEALTH = 'home_health',

  // Garde & urgences
  ON_CALL = 'on_call',
  EMERGENCY = 'emergency',

  // Autre
  OTHER = 'other',
}

export interface TenantContactDto {
  email: string;
  phone?: string;
}

export interface TenantAddressDto {
  street?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
}

export interface TenantLocalizationDto {
  timezone?: string;
  currency?: string;
  language?: string;
  dateFormat?: string;
}

export interface TenantDataDto {
  name: string;
  subdomain: string;
  companyName?: string;
  contact: TenantContactDto;
  address?: TenantAddressDto;
  localization?: TenantLocalizationDto;
  tenantType?: TenantType;
  website?: string;
  licenseNumber?: string;
  taxId?: string;
  customDomain?: string;
}

export interface OwnerDataDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  acceptTerms: boolean;
  acceptPrivacyPolicy: boolean;
  acceptDataProcessing: boolean;
  fullName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  nationality?: string;
  profession?: string;
  identityDocumentType?: string;
  identityNumber?: string;
  identityDocumentRecto?: string;
  identityDocumentVerso?: string;
  professionalLicenseNumber?: string;
  enable2FA?: boolean;
  acceptMarketing?: boolean;
}

export interface PlanSelectionDto {
  planId: string;
  billingInterval?: BillingCycle;
  promoCode?: string;
}

export interface PaymentInfoDto {
  paymentMethod?: PaymentMethod;
  paymentProviderCode?: string;
  customerId?: string;
  paymentMethodId?: string;
}

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
  pharmacyType?: PharmacyType;
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
  paymentInfo?: PaymentInfoDto;
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
