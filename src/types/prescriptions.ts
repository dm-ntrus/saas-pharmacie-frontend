/**
 * Types Prescriptions — Alignés backend
 * Source: business-logic/entities/prescription.entity.ts, prescription-item.entity.ts, prescriptions.service.ts
 */

export enum PrescriptionStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  IN_PROGRESS = "in_progress",
  READY = "ready",
  DISPENSED = "dispensed",
  CANCELLED = "cancelled",
  RETURNED = "returned",
  ON_HOLD = "on_hold",
}

export enum PrescriptionType {
  NEW = "new",
  REFILL = "refill",
  TRANSFER_IN = "transfer_in",
  TRANSFER_OUT = "transfer_out",
  EMERGENCY = "emergency",
  COMPOUND = "compound",
}

export enum PrescriptionItemStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  DISPENSED = "dispensed",
  SUBSTITUTED = "substituted",
  OUT_OF_STOCK = "out_of_stock",
  PARTIAL_FILL = "partial_fill",
}

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  [PrescriptionStatus.PENDING]: "En attente",
  [PrescriptionStatus.VERIFIED]: "Vérifiée",
  [PrescriptionStatus.IN_PROGRESS]: "En cours",
  [PrescriptionStatus.READY]: "Prête",
  [PrescriptionStatus.DISPENSED]: "Délivrée",
  [PrescriptionStatus.CANCELLED]: "Annulée",
  [PrescriptionStatus.RETURNED]: "Retournée",
  [PrescriptionStatus.ON_HOLD]: "En attente",
};

export interface Prescription {
  id: string;
  created_at: string;
  updated_at: string;
  pharmacy_id: string;
  prescription_number: string;
  patient_id: string;
  prescriber_name: string;
  prescriber_npi?: string;
  prescribed_date: string;
  received_date: string;
  verified_date?: string;
  dispensed_date?: string;
  status: PrescriptionStatus;
  type: PrescriptionType;
  refills_allowed?: number;
  refills_remaining?: number;
  total_amount?: string;
  patient_pay?: string;
  special_instructions?: string;
  pharmacy_notes?: string;
  verified_by?: string;
  dispensed_by?: string;

  // UI convenience fields (some endpoints embed relations / flags)
  patient?: any;
  items?: PrescriptionItem[];
  is_emergency?: boolean;
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  product_id?: string;
  batch_id?: string;
  drug_name: string;
  strength: string;
  quantity_prescribed: string;
  quantity_dispensed: string;
  unit_of_measure: string;
  directions_for_use: string;
  dosage_frequency: string;
  status: PrescriptionItemStatus;
  unit_price?: string;
  total_price?: string;

  // UI legacy aliases
  product_name?: string;
  quantity?: string | number;
  dosage?: string;
  frequency?: string;
  instructions?: string;
}

export interface CreatePrescriptionDto {
  patient_id: string;
  prescriber_name: string;
  prescriber_npi?: string;
  prescribed_date?: string;
  type?: PrescriptionType;
  refills_allowed?: number;
  refills_remaining?: number;
  special_instructions?: string;
  pharmacy_notes?: string;
}

export interface CreatePrescriptionItemDto {
  product_id?: string;
  drug_name: string;
  strength: string;
  quantity_prescribed: string;
  unit_of_measure: string;
  directions_for_use: string;
  dosage_frequency: string;
  dosage_amount?: string;
  unit_price?: string;
  total_price?: string;
}
