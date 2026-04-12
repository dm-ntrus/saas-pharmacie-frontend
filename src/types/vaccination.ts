/**
 * Types Vaccination — Alignés backend
 * Source: business-logic/vaccination/dto/vaccination.dto.ts, entities/vaccination-advanced.entity.ts
 */

// ─── Enums ─────────────────────────────────────────────────────────────────

export type ColdChainUnitType =
  | "refrigerator"
  | "freezer"
  | "ultra_low_freezer"
  | "portable_cooler"
  | "room_temperature";

export type ResolutionAction =
  | "temperature_stabilized"
  | "inventory_moved"
  | "inventory_discarded"
  | "device_replaced"
  | "false_alarm";

export type VialStatus =
  | "sealed"
  | "opened"
  | "expired_open"
  | "exhausted"
  | "discarded"
  | "quarantined";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "no_show"
  | "cancelled_by_patient"
  | "cancelled_by_pharmacy"
  | "rescheduled";

export type InjectionSite =
  | "deltoid_left"
  | "deltoid_right"
  | "vastus_lateralis_left"
  | "vastus_lateralis_right"
  | "ventrogluteal_left"
  | "ventrogluteal_right"
  | "subcutaneous_abdomen"
  | "intradermal_forearm"
  | "oral"
  | "nasal";

export type LotValidationMethod = "datamatrix_scan" | "manual_entry" | "barcode_scan";
export type VisProvidedMethod = "physical" | "digital" | "both";

export type AdverseEventSeverity = "mild" | "moderate" | "severe" | "life_threatening" | "death";

export type CertificateFormat =
  | "eu_dcc"
  | "smart_health_card"
  | "who"
  | "national"
  | "custom";

export type PregnancyStatus =
  | "not_pregnant"
  | "pregnant"
  | "possibly_pregnant"
  | "breastfeeding";

// ─── DTOs (entrée API) ────────────────────────────────────────────────────

export interface CreateColdChainDeviceDto {
  deviceName: string;
  deviceModel: string;
  serialNumber: string;
  manufacturer: string;
  firmwareVersion: string;
  macAddress?: string;
  bluetoothId?: string;
  unitType: ColdChainUnitType;
  locationDescription: string;
  capacityLiters: number;
  minTempCelsius?: number;
  maxTempCelsius?: number;
  notificationChannels?: string[];
}

export interface TemperatureReadingDto {
  deviceId: string;
  temperatureCelsius: number;
  humidityPercent?: number;
  doorOpen?: boolean;
  batteryPercent?: number;
  timestamp: string;
}

export interface AcknowledgeAlertDto {
  notes?: string;
}

export interface ResolveAlertDto {
  resolutionAction: ResolutionAction;
  notes?: string;
}

export interface CreateVialDto {
  vialNumber: string;
  gs1Datamatrix?: string;
  lotNumber: string;
  productId: string;
  vaccineName: string;
  vaccineType: string;
  manufacturer: string;
  totalDoses: number;
  doseVolumeMl: number;
  sealedExpiryDate: string;
  stabilityHoursAfterOpening: number;
  unitCost: string;
}

export interface OpenVialDto {
  vialId: string;
  openedAt: string;
  openedBy: string;
  expectedDoses: number;
}

export interface WithdrawDoseDto {
  vialId: string;
  dosesToWithdraw: number;
  administeredBy: string;
  appointmentId?: string;
  notes?: string;
}

export interface ScheduleAppointmentDto {
  patientId: string;
  vaccineProductId: string;
  doseNumber: number;
  totalDosesInSeries: number;
  scheduledDate: string;
  timeSlot: string;
  isBooster?: boolean;
}

export interface AllergyEntry {
  allergen: string;
  reactionType: string;
  severity: "mild" | "moderate" | "severe";
}

export interface PreVaccinationQuestionnaireDto {
  chronicDiseases?: string[];
  immunodeficiency?: boolean;
  feverPresent?: boolean;
  pregnancyStatus?: PregnancyStatus;
  recentImmunoglobulin?: boolean;
  anticoagulants?: boolean;
  allergies?: AllergyEntry[];
  eggAllergy?: boolean;
  latexAllergy?: boolean;
  recentCovidInfection?: boolean;
}

export interface RecordInjectionDto {
  appointmentId: string;
  vialId: string;
  lotNumber: string;
  administeredBy: string;
  injectionSite: InjectionSite;
  needleGauge?: string;
  needleLengthMm?: number;
  doseVolumeMl: number;
  lotValidationMethod: LotValidationMethod;
  consentObtained: boolean;
  consentSignatureImage?: string;
  visProvided: boolean;
  visProvidedMethod: VisProvidedMethod;
  nextDoseDueDate?: string;
}

export interface ReportAdverseEventDto {
  injectionId: string;
  symptoms: string[];
  primarySymptom: string;
  symptomDescription: string;
  severity: AdverseEventSeverity;
  onsetAt: string;
  lifeThreatening?: boolean;
  hospitalizationRequired?: boolean;
  treatmentGiven?: string;
}

export interface GenerateCertificateDto {
  injectionId: string;
  format: CertificateFormat;
  patientName: string;
  patientDateOfBirth: string;
}

export interface CreateProximityAlertDto {
  vialId: string;
  ageMin?: number;
  ageMax?: number;
  withinDistanceKm?: number;
}

export interface CreateDemandForecastDto {
  productId: string;
  vaccineName: string;
  appointmentsScheduled: number;
  historicalAvgWeekly: number;
  seasonalityFactor: number;
  trendFactor: number;
  dosesInStock: number;
  dosesReserved: number;
}

// ─── Entités (sortie API) ───────────────────────────────────────────────────

export interface ColdChainDevice {
  id: string;
  pharmacy_id: string;
  created_at: string;
  updated_at: string;
  device_name: string;
  device_model: string;
  serial_number: string;
  manufacturer: string;
  firmware_version: string;
  mac_address?: string;
  bluetooth_id?: string;
  last_seen_at: string;
  connection_status: "online" | "offline" | "unstable";
  unit_type: ColdChainUnitType;
  location_description: string;
  capacity_liters: number;
  min_temp_celsius: number;
  max_temp_celsius: number;
  alert_delay_minutes: number;
  notification_channels: string[];
  is_active: boolean;
}

export interface TemperatureReading {
  id: string;
  created_at: string;
  device_id: string;
  pharmacy_id: string;
  reading_at: string;
  temperature_celsius: number;
  humidity_percent?: number;
  door_open?: boolean;
  battery_percent?: number;
  status?: string;
}

export interface ColdChainAlert {
  id: string;
  created_at: string;
  updated_at: string;
  pharmacy_id: string;
  device_id: string;
  alert_type: string;
  severity: string;
  status: string;
  started_at: string;
  ended_at?: string;
  acknowledged_at?: string;
  acknowledged_notes?: string;
  resolved_at?: string;
  resolution_notes?: string;
  resolution_action?: ResolutionAction;
}

export interface VaccineVial {
  id: string;
  pharmacy_id: string;
  created_at: string;
  updated_at: string;
  vial_number: string;
  gs1_datamatrix?: string;
  lot_number: string;
  product_id: string;
  vaccine_name: string;
  vaccine_type: string;
  manufacturer: string;
  total_doses: number;
  doses_remaining: number;
  dose_volume_ml: number;
  sealed_expiry_date: string;
  opened_at?: string;
  beyond_use_date?: string;
  stability_hours_after_opening: number;
  status: VialStatus;
  current_device_id?: string;
  storage_location?: string;
  unit_cost: string;
  wastage_cost?: string;
}

export interface VaccinationAppointment {
  id: string;
  pharmacy_id: string;
  created_at: string;
  updated_at: string;
  appointment_number: string;
  patient_id: string;
  vaccine_product_id: string;
  vaccine_name: string;
  vaccine_type: string;
  dose_number: number;
  total_doses_in_series: number;
  is_booster: boolean;
  scheduled_date: string;
  time_slot: string;
  status: AppointmentStatus;
  questionnaire?: Record<string, unknown>;
  questionnaire_completed_at?: string;
  checked_in_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  injection_id?: string;
  notes?: string;
}

export interface VaccinationInjection {
  id: string;
  pharmacy_id: string;
  created_at: string;
  updated_at: string;
  appointment_id: string;
  patient_id: string;
  vaccine_product_id: string;
  vaccine_name: string;
  lot_number: string;
  vial_id?: string;
  administered_at: string;
  administered_by: string;
  injection_site: InjectionSite;
  dose_volume_ml: number;
  lot_validation_method: LotValidationMethod;
  consent_obtained: boolean;
  vis_provided: boolean;
  vis_provided_method: VisProvidedMethod;
  certificate_id?: string;
  next_dose_due_date?: string;
}

export interface VaccinationSideEffect {
  id: string;
  pharmacy_id: string;
  created_at: string;
  updated_at: string;
  injection_id: string;
  patient_id: string;
  reported_at: string;
  onset_at: string;
  symptoms: string[];
  primary_symptom: string;
  symptom_description: string;
  severity: AdverseEventSeverity;
  life_threatening: boolean;
  resulted_in_hospitalization: boolean;
  treatment_given?: string;
  reporting_status: string;
  vaccine_name: string;
  lot_number: string;
  national_report_id?: string;
}

export interface VaccinationCertificate {
  id: string;
  created_at: string;
  updated_at: string;
  injection_id: string;
  patient_id: string;
  certificate_id: string;
  qr_code_data: string;
  qr_code_image_url?: string;
  patient_name: string;
  patient_date_of_birth: string;
  vaccine_name: string;
  vaccine_type: string;
  manufacturer: string;
  lot_number: string;
  dose_number: number;
  total_doses: number;
  injection_date: string;
  format: CertificateFormat;
  verification_url: string;
  pdf_url?: string;
}

export interface SmartProximityAlert {
  id: string;
  pharmacy_id: string;
  created_at: string;
  updated_at: string;
  alert_type: string;
  status: string;
  vial_id: string;
  vaccine_name: string;
  doses_remaining: number;
  hours_until_expiry: number;
  target_count: number;
  notifications_sent: number;
  appointments_created: number;
  doses_saved: number;
  doses_wasted: number;
}

export interface VaccineDemandForecast {
  id: string;
  pharmacy_id: string;
  created_at: string;
  forecast_for_week_starting: string;
  product_id: string;
  vaccine_name: string;
  appointments_scheduled: number;
  historical_avg_weekly: number;
  seasonality_factor: number;
  trend_factor: number;
  predicted_doses_needed: number;
  doses_in_stock: number;
  doses_reserved_for_appointments: number;
  suggested_order_quantity: number;
  urgency: string;
  purchase_order_created: boolean;
  purchase_order_id?: string;
}

// ─── Dashboard & Analytics ──────────────────────────────────────────────────

export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  trend?: "up" | "down" | "stable";
  icon?: string;
  color?: string;
  updatedAt: string;
}

export interface VaccinationStats {
  totalVaccinations: number;
  todayVaccinations: number;
  weekVaccinations: number;
  monthVaccinations: number;
  vaccinesByType: Array<{ type: string; count: number; percentage: number }>;
  appointmentsStatus: Array<{ status: string; count: number; percentage: number }>;
  patientsByAge: Array<{ range: string; count: number }>;
  revenueGenerated: number;
  dosesAdministered: number;
  dosesWasted: number;
  wastageRate: number;
}

export interface ColdChainDashboard {
  devicesOnline: number;
  devicesOffline: number;
  totalDevices: number;
  currentStatus: "optimal" | "warning" | "critical";
  averageTemperature: number;
  activeAlerts: number;
  alertsLast24h: number;
  devicesNeedingMaintenance: number;
  lastReadingAt: string;
}

export interface VialDashboard {
  totalVials: number;
  openVials: number;
  sealedVials: number;
  exhaustedVials: number;
  vialsExpiringToday: number;
  vialsExpiringThisWeek: number;
  dosesAvailable: number;
  dosesAtRisk: number;
  costAtRisk: number;
  wastageToday: number;
  wastageThisMonth: number;
}

export interface ProximityDashboard {
  activeAlerts: number;
  dosesSaved: number;
  dosesWasted: number;
  notificationsSent: number;
  appointmentsCreated: number;
  walkInsConverted: number;
  financialImpact: number;
  conversionRate: number;
}

export interface RealTimeEvent {
  type: string;
  action: string;
  timestamp: string;
  organizationId: string;
  data: unknown;
}

// ─── Labels ───────────────────────────────────────────────────────────────

export const VIAL_STATUS_LABELS: Record<string, string> = {
  sealed: "Scellé",
  opened: "Ouvert",
  expired_open: "Expiré (ouvert)",
  exhausted: "Épuisé",
  discarded: "Éliminé",
  quarantined: "En quarantaine",
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  scheduled: "Planifié",
  confirmed: "Confirmé",
  checked_in: "Enregistré",
  in_progress: "En cours",
  completed: "Terminé",
  no_show: "Absent",
  cancelled_by_patient: "Annulé (patient)",
  cancelled_by_pharmacy: "Annulé (pharmacie)",
  rescheduled: "Reporté",
};

export const ADVERSE_EVENT_SEVERITY_LABELS: Record<string, string> = {
  mild: "Léger",
  moderate: "Modéré",
  severe: "Sévère",
  life_threatening: "Grave",
  death: "Décès",
};

export const COLD_CHAIN_UNIT_TYPE_LABELS: Record<ColdChainUnitType, string> = {
  refrigerator: "Réfrigérateur",
  freezer: "Congélateur",
  ultra_low_freezer: "Congélateur ultra-bas",
  portable_cooler: "Glacière",
  room_temperature: "Température ambiante",
};
