/**
 * Types Qualité — Alignés backend
 * Source: business-logic/inventory/entities/quality.entity.ts, dto/quality.dto.ts
 */

export enum QualityEventType {
  DEVIATION = "deviation",
  NON_CONFORMITY = "non_conformity",
  COMPLAINT = "complaint",
  INCIDENT = "incident",
  ADVERSE_EVENT = "adverse_event",
  INCOMING_INSPECTION = "incoming_inspection",
}

export enum QualityEventStatus {
  OPEN = "open",
  INVESTIGATION = "investigation",
  RESOLVED = "resolved",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

export enum QualityEventSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum CAPAStatus {
  IDENTIFIED = "identified",
  PLANNED = "planned",
  IMPLEMENTED = "implemented",
  VERIFIED = "verified",
  CLOSED = "closed",
}

export enum CAPAType {
  CORRECTIVE = "corrective",
  PREVENTIVE = "preventive",
}

export enum DocumentType {
  PROCEDURE = "procedure",
  WORK_INSTRUCTION = "work_instruction",
  FORM = "form",
  RECORD = "record",
  POLICY = "policy",
  TEMPLATE = "template",
}

export enum DocumentStatus {
  DRAFT = "draft",
  REVIEW = "review",
  APPROVED = "approved",
  OBSOLETE = "obsolete",
}

export const QUALITY_EVENT_TYPE_LABELS: Record<QualityEventType, string> = {
  [QualityEventType.DEVIATION]: "Écart",
  [QualityEventType.NON_CONFORMITY]: "Non-conformité",
  [QualityEventType.COMPLAINT]: "Réclamation",
  [QualityEventType.INCIDENT]: "Incident",
  [QualityEventType.ADVERSE_EVENT]: "Événement indésirable",
  [QualityEventType.INCOMING_INSPECTION]: "Contrôle à réception",
};

export const QUALITY_EVENT_STATUS_LABELS: Record<QualityEventStatus, string> = {
  [QualityEventStatus.OPEN]: "Ouvert",
  [QualityEventStatus.INVESTIGATION]: "En investigation",
  [QualityEventStatus.RESOLVED]: "Résolu",
  [QualityEventStatus.CLOSED]: "Clôturé",
  [QualityEventStatus.CANCELLED]: "Annulé",
};

export const QUALITY_EVENT_SEVERITY_LABELS: Record<QualityEventSeverity, string> = {
  [QualityEventSeverity.LOW]: "Faible",
  [QualityEventSeverity.MEDIUM]: "Moyen",
  [QualityEventSeverity.HIGH]: "Élevé",
  [QualityEventSeverity.CRITICAL]: "Critique",
};

export const CAPA_STATUS_LABELS: Record<CAPAStatus, string> = {
  [CAPAStatus.IDENTIFIED]: "Identifié",
  [CAPAStatus.PLANNED]: "Planifié",
  [CAPAStatus.IMPLEMENTED]: "Implémenté",
  [CAPAStatus.VERIFIED]: "Vérifié",
  [CAPAStatus.CLOSED]: "Clôturé",
};

export const CAPA_TYPE_LABELS: Record<CAPAType, string> = {
  [CAPAType.CORRECTIVE]: "Corrective",
  [CAPAType.PREVENTIVE]: "Préventive",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.PROCEDURE]: "Procédure",
  [DocumentType.WORK_INSTRUCTION]: "Instruction de travail",
  [DocumentType.FORM]: "Formulaire",
  [DocumentType.RECORD]: "Enregistrement",
  [DocumentType.POLICY]: "Politique",
  [DocumentType.TEMPLATE]: "Modèle",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  [DocumentStatus.DRAFT]: "Brouillon",
  [DocumentStatus.REVIEW]: "En revue",
  [DocumentStatus.APPROVED]: "Approuvé",
  [DocumentStatus.OBSOLETE]: "Obsolète",
};

export interface QualityEvent {
  id: string;
  eventNumber?: string;
  type: QualityEventType;
  status: QualityEventStatus;
  severity: QualityEventSeverity;
  title: string;
  description: string;
  reportedBy: string;
  assignedTo?: string;
  occurredAt: string;
  reportedAt?: string;
  investigation?: Record<string, unknown>;
  rootCause?: Record<string, unknown>;
  impactAssessment?: Record<string, unknown>;
  immediateActions?: Record<string, unknown>;
  conclusion?: string;
  closedAt?: string;
  closedBy?: string;
  attachments?: string[];
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CAPA {
  id: string;
  capaNumber?: string;
  qualityEventId: string;
  type: CAPAType;
  status: CAPAStatus;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  rootCauseAnalysis?: Record<string, unknown>;
  actionPlan?: Record<string, unknown>;
  implementation?: Record<string, unknown>;
  verification?: Record<string, unknown>;
  completedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QualityDocument {
  id: string;
  type: DocumentType;
  title: string;
  description?: string;
  effectiveDate: string;
  reviewDate?: string;
  content?: string;
  status?: DocumentStatus;
  version?: string;
  approvalDate?: string;
  approvedBy?: string;
  trainingRequired?: boolean;
  attachments?: string[];
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface QualityMetric {
  id: string;
  metricType: string;
  metricName: string;
  description?: string;
  targetValue: number;
  actualValue?: number;
  measurementDate: string;
  measurementPeriod: string;
  dataPoints?: Record<string, unknown>;
  notes?: string;
  recordedBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainingRecord {
  id: string;
  userId: string;
  documentId: string;
  trainingDate: string;
  completionDate?: string;
  trainerName: string;
  trainingMethod: string;
  trainingDurationHours: number;
  assessmentScore?: number;
  competencyLevel: string;
  nextReviewDate?: string;
  notes?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQualityEventDto {
  type: QualityEventType;
  severity: QualityEventSeverity;
  title: string;
  description: string;
  reportedBy: string;
  assignedTo?: string;
  occurredAt: string;
  investigation?: Record<string, unknown>;
  rootCause?: Record<string, unknown>;
  impactAssessment?: Record<string, unknown>;
  immediateActions?: Record<string, unknown>;
  attachments?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateCAPADto {
  qualityEventId: string;
  type: CAPAType;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  rootCauseAnalysis?: Record<string, unknown>;
  actionPlan?: Record<string, unknown>;
}

export interface CreateQualityDocumentDto {
  type: DocumentType;
  title: string;
  description?: string;
  effectiveDate: string;
  reviewDate?: string;
  content?: string;
  metadata?: Record<string, unknown>;
  attachments?: string[];
  trainingRequired?: boolean;
}

export interface CreateQualityMetricDto {
  metricType: string;
  metricName: string;
  description?: string;
  targetValue: number;
  actualValue?: number;
  measurementDate: string;
  measurementPeriod: string;
  dataPoints?: Record<string, unknown>;
  notes?: string;
  recordedBy: string;
}

export interface CreateTrainingRecordDto {
  userId: string;
  documentId: string;
  trainingDate: string;
  completionDate?: string;
  trainerName: string;
  trainingMethod: string;
  trainingDurationHours: number;
  assessmentScore?: number;
  competencyLevel: string;
  nextReviewDate?: string;
  notes?: string;
  attachments?: string[];
}

export interface QualityDashboardDto {
  totalQualityEvents?: number;
  openQualityEvents?: number;
  activeCAPAs?: number;
  approvedDocuments?: number;
  pendingTrainings?: number;
  eventsByType?: Record<string, number>;
  eventsBySeverity?: Record<string, number>;
  capasByStatus?: Record<string, number>;
  recentEvents?: Array<{ id: string; title: string; type: string; severity: string; status: string; reportedAt: string }>;
  upcomingCAPAs?: Array<{ id: string; title: string; type: string; assignedTo: string; dueDate: string; daysUntilDue?: number }>;
  metricTrends?: Array<{ metricType: string; metricName: string; targetValue: number; actualValue: number; measurementDate: string; performanceIndicator?: string }>;
}
