import { z } from "zod";
import { CAPAType, DocumentType, QualityEventSeverity, QualityEventType } from "@/types/quality";

const qualityEventTypeEnum = z.nativeEnum(QualityEventType);
const qualityEventSeverityEnum = z.nativeEnum(QualityEventSeverity);
const capaTypeEnum = z.nativeEnum(CAPAType);
const documentTypeEnum = z.nativeEnum(DocumentType);

export const createQualityEventSchema = z.object({
  type: qualityEventTypeEnum,
  severity: qualityEventSeverityEnum,
  title: z.string().min(1, "Titre requis"),
  description: z.string().min(1, "Description requise"),
  reportedBy: z.string().min(1, "Champ requis"),
  assignedTo: z.string().optional(),
  occurredAt: z.string().min(1, "Date requise"),
});

export type CreateQualityEventFormData = z.infer<typeof createQualityEventSchema>;

export const createCAPASchema = z.object({
  qualityEventId: z.string().uuid("ID événement invalide"),
  type: capaTypeEnum,
  title: z.string().min(1, "Titre requis"),
  description: z.string().min(1, "Description requise"),
  assignedTo: z.string().min(1, "Responsable requis"),
  dueDate: z.string().min(1, "Date d'échéance requise"),
});

export type CreateCAPAFormData = z.infer<typeof createCAPASchema>;

export const createQualityDocumentSchema = z.object({
  type: documentTypeEnum,
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  effectiveDate: z.string().min(1, "Date d'effet requise"),
  reviewDate: z.string().optional(),
  content: z.string().optional(),
  trainingRequired: z.boolean().optional(),
});

export type CreateQualityDocumentFormData = z.infer<typeof createQualityDocumentSchema>;

export const createQualityMetricSchema = z.object({
  metricType: z.string().min(1, "Type de métrique requis"),
  metricName: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
  targetValue: z.number(),
  actualValue: z.number().optional(),
  measurementDate: z.string().min(1, "Date requise"),
  measurementPeriod: z.string().min(1, "Période requise"),
  notes: z.string().optional(),
  recordedBy: z.string().min(1, "Champ requis"),
});

export type CreateQualityMetricFormData = z.infer<typeof createQualityMetricSchema>;

export const createTrainingRecordSchema = z.object({
  userId: z.string().uuid("Utilisateur requis"),
  documentId: z.string().uuid("Document requis"),
  trainingDate: z.string().min(1, "Date requise"),
  completionDate: z.string().optional(),
  trainerName: z.string().min(1, "Formateur requis"),
  trainingMethod: z.string().min(1, "Méthode requise"),
  trainingDurationHours: z.number().min(0),
  assessmentScore: z.number().min(0).max(100).optional(),
  competencyLevel: z.string().min(1, "Niveau requis"),
  nextReviewDate: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateTrainingRecordFormData = z.infer<typeof createTrainingRecordSchema>;
