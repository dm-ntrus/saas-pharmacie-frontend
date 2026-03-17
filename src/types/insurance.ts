/**
 * Types Assurance (Insurance Providers) — alignés avec backend business-logic/insurance-providers
 * Endpoints: /pharmacies/:pharmacyId/insurance-providers
 */

export type InsuranceProviderStatus = "active" | "inactive" | "suspended";

export type InsuranceProviderType = "private" | "public" | "ngo" | "mutual" | "corporate";

export interface InsuranceProvider {
  id: string;
  created_at?: string;
  updated_at?: string;
  pharmacy_id?: string;
  name: string;
  code: string;
  status: InsuranceProviderStatus;
  type: InsuranceProviderType;
  contact_person?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  website?: string;
  coverage_types: string[];
  default_coverage_percent: number;
  max_coverage_amount?: number;
  requires_preauthorization?: boolean;
  preauthorization_required_for?: string[];
  excluded_products?: string[];
  payment_terms_days?: number;
  requires_policy_number?: boolean;
  requires_member_card?: boolean;
  notes?: string;
}

export interface CreateInsuranceProviderDto {
  name: string;
  code: string;
  type: InsuranceProviderType;
  status?: InsuranceProviderStatus;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  website?: string;
  coverageTypes?: string[];
  defaultCoveragePercent?: number;
  maxCoverageAmount?: number;
  requiresPreauthorization?: boolean;
  preauthorizationRequiredFor?: string[];
  excludedProducts?: string[];
  paymentTermsDays?: number;
  requiresPolicyNumber?: boolean;
  requiresMemberCard?: boolean;
  notes?: string;
}

export type UpdateInsuranceProviderDto = Partial<CreateInsuranceProviderDto>;

export const INSURANCE_PROVIDER_STATUS_LABELS: Record<InsuranceProviderStatus, string> = {
  active: "Actif",
  inactive: "Inactif",
  suspended: "Suspendu",
};

export const INSURANCE_PROVIDER_TYPE_LABELS: Record<InsuranceProviderType, string> = {
  private: "Privé",
  public: "Public",
  ngo: "ONG",
  mutual: "Mutuelle",
  corporate: "Entreprise",
};
