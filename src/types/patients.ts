/**
 * Types Patients — Alignés backend
 * Source: business-logic/entities/patient.entity.ts, patients.service.ts
 */

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

export enum PatientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DECEASED = "deceased",
  TRANSFERRED = "transferred",
}

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: "Homme",
  [Gender.FEMALE]: "Femme",
  [Gender.OTHER]: "Autre",
  [Gender.PREFER_NOT_TO_SAY]: "Ne pas préciser",
};

export const PATIENT_STATUS_LABELS: Record<PatientStatus, string> = {
  [PatientStatus.ACTIVE]: "Actif",
  [PatientStatus.INACTIVE]: "Inactif",
  [PatientStatus.DECEASED]: "Décédé",
  [PatientStatus.TRANSFERRED]: "Transféré",
};

export interface Patient {
  id: string;
  created_at: string;
  updated_at: string;
  pharmacy_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  phone: string;
  email?: string;
  address: string;
  emergency_contact?: string;
  emergency_phone?: string;
  insurance_provider?: string;
  insurance_number?: string;
  allergies?: string;
  medical_conditions?: string;
  current_medications?: string;
  status: PatientStatus;
}

export interface CreatePatientDto {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  phone: string;
  email?: string;
  address: string;
  emergency_contact?: string;
  emergency_phone?: string;
  insurance_provider?: string;
  insurance_number?: string;
  allergies?: string;
  medical_conditions?: string;
  current_medications?: string;
}

export type UpdatePatientDto = Partial<CreatePatientDto> & { status?: PatientStatus };

export interface PatientUserLinkDto {
  userId: string;
  relationshipType?: string;
  isPrimary?: boolean;
  canViewRecords?: boolean;
  canManageRecords?: boolean;
  canViewPrescriptions?: boolean;
  canManagePrescriptions?: boolean;
  emergencyContact?: boolean;
  notes?: string;
}
