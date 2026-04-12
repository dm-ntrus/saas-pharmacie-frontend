/**
 * Types Notifications — alignés avec backend business-logic/notification et plateform/notifications
 * Tenant: /pharmacies/:pharmacyId/notifications
 * Platform (in-app list): /notifications
 */

export type NotificationChannel = "SMS" | "EMAIL" | "PUSH" | "WHATSAPP" | "IN_APP";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface NotificationPayload {
  templateType?: string;
  channels: NotificationChannel[];
  recipientId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  variables?: Record<string, unknown>;
  priority?: NotificationPriority;
}

export interface NotificationTemplate {
  type: string;
  name?: string;
  description?: string;
  channels?: string[];
  variables?: string[];
}

export interface NotificationQueueStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

/** In-app notification (platform GET /notifications) */
export interface InAppNotification {
  id: string;
  type?: string;
  title?: string;
  message?: string;
  read: boolean;
  read_at?: string;
  created_at: string;
  data?: Record<string, unknown>;
  action_url?: string;
  module?: string;
}

export interface NotificationListResponse {
  data: InAppNotification[];
  meta?: { total: number; page: number; limit: number };
}
