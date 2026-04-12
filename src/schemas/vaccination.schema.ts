import { z } from "zod";

const storageUnitTypeEnum = z.enum([
  "refrigerator", "freezer", "ultra_low_freezer", "portable_cooler", "room_temperature",
]);
const injectionSiteEnum = z.enum([
  "deltoid_left", "deltoid_right",
  "vastus_lateralis_left", "vastus_lateralis_right",
  "ventrogluteal_left", "ventrogluteal_right",
  "subcutaneous_abdomen", "intradermal_forearm",
  "oral", "nasal",
]);
const lotValidationMethodEnum = z.enum(["datamatrix_scan", "manual_entry", "barcode_scan"]);
const visProvidedMethodEnum = z.enum(["physical", "digital", "both"]);
const adverseEventSeverityEnum = z.enum(["mild", "moderate", "severe", "life_threatening", "death"]);
const certificateFormatEnum = z.enum(["eu_dcc", "smart_health_card", "who", "national", "custom"]);

export const createDeviceSchema = z.object({
  deviceName: z.string().min(1, "Le nom de l'appareil est requis"),
  deviceModel: z.string().min(1, "Le modèle est requis"),
  serialNumber: z.string().min(1, "Le numéro de série est requis"),
  manufacturer: z.string().min(1, "Le fabricant est requis"),
  firmwareVersion: z.string().min(1, "La version du firmware est requise"),
  macAddress: z.string().optional(),
  bluetoothId: z.string().optional(),
  unitType: storageUnitTypeEnum,
  locationDescription: z.string().min(1, "La description de l'emplacement est requise"),
  capacityLiters: z.number().min(0.1, "La capacité doit être supérieure à 0"),
  minTempCelsius: z.number().optional(),
  maxTempCelsius: z.number().optional(),
  notificationChannels: z.array(z.string()).optional(),
});

export type CreateDeviceFormData = z.infer<typeof createDeviceSchema>;

export const scheduleAppointmentSchema = z.object({
  patientId: z.string().min(1, "Le patient est requis"),
  vaccineProductId: z.string().min(1, "Le vaccin est requis"),
  doseNumber: z.number().int().min(1, "Le numéro de dose est requis"),
  totalDosesInSeries: z.number().int().min(1, "Le nombre total de doses est requis"),
  scheduledDate: z.string().min(1, "La date de rendez-vous est requise"),
  timeSlot: z.string().min(1, "Le créneau horaire est requis"),
  isBooster: z.boolean().optional(),
});

export type ScheduleAppointmentFormData = z.infer<typeof scheduleAppointmentSchema>;

export const recordInjectionSchema = z.object({
  appointmentId: z.string().min(1, "Le rendez-vous est requis"),
  vialId: z.string().min(1, "Le flacon est requis"),
  lotNumber: z.string().min(1, "Le numéro de lot est requis"),
  administeredBy: z.string().min(1, "L'administrateur est requis"),
  injectionSite: injectionSiteEnum,
  needleGauge: z.string().optional(),
  needleLengthMm: z.number().min(1).optional(),
  doseVolumeMl: z.number().min(0.01, "Le volume de dose est requis"),
  lotValidationMethod: lotValidationMethodEnum,
  consentObtained: z.boolean().refine((val) => val === true, {
    message: "Le consentement du patient est obligatoire",
  }),
  consentSignatureImage: z.string().optional(),
  visProvided: z.boolean(),
  visProvidedMethod: visProvidedMethodEnum,
  nextDoseDueDate: z.string().optional(),
});

export type RecordInjectionFormData = z.infer<typeof recordInjectionSchema>;

export const reportAdverseEventSchema = z.object({
  injectionId: z.string().min(1, "L'injection est requise"),
  symptoms: z.array(z.string()).min(1, "Au moins un symptôme est requis"),
  primarySymptom: z.string().min(1, "Le symptôme principal est requis"),
  symptomDescription: z.string().min(1, "La description des symptômes est requise"),
  severity: adverseEventSeverityEnum,
  onsetAt: z.string().min(1, "La date de début des symptômes est requise"),
  lifeThreatening: z.boolean().optional(),
  hospitalizationRequired: z.boolean().optional(),
  treatmentGiven: z.string().optional(),
});

export type ReportAdverseEventFormData = z.infer<typeof reportAdverseEventSchema>;

export const generateCertificateSchema = z.object({
  injectionId: z.string().min(1, "L'injection est requise"),
  format: certificateFormatEnum,
  patientName: z.string().min(1, "Le nom du patient est requis"),
  patientDateOfBirth: z.string().min(1, "La date de naissance est requise"),
});

export type GenerateCertificateFormData = z.infer<typeof generateCertificateSchema>;
