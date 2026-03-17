import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@/context/OrganizationContext";
import { apiService } from "@/services/api.service";
import type {
  NotificationTemplate,
  NotificationQueueStatus,
  NotificationPayload,
  InAppNotification,
  NotificationListResponse,
} from "@/types/notifications";
import { toast } from "react-hot-toast";

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

/** GET /pharmacies/:id/notifications/templates */
export function useNotificationTemplates() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["notification-templates", pharmacyId],
    queryFn: () =>
      apiService.get<NotificationTemplate[]>(`/pharmacies/${pharmacyId}/notifications/templates`),
    enabled: !!pharmacyId,
  });
}

/** GET /pharmacies/:id/notifications/queue-status */
export function useNotificationQueueStatus() {
  const pharmacyId = usePharmacyId();
  return useQuery({
    queryKey: ["notification-queue-status", pharmacyId],
    queryFn: () =>
      apiService.get<NotificationQueueStatus>(`/pharmacies/${pharmacyId}/notifications/queue-status`),
    enabled: !!pharmacyId,
  });
}

/** POST /pharmacies/:id/notifications/send */
export function useSendNotification() {
  const pharmacyId = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NotificationPayload) =>
      apiService.post(`/pharmacies/${pharmacyId}/notifications/send`, payload),
    onSuccess: () => {
      toast.success("Notification envoyée");
      qc.invalidateQueries({ queryKey: ["notifications-list"] });
    },
    onError: () => toast.error("Erreur envoi notification"),
  });
}

/** GET /notifications — liste in-app (platform, user from token) */
export function useInAppNotifications(params?: { page?: number; limit?: number; unread_only?: boolean }) {
  return useQuery({
    queryKey: ["notifications-list", params],
    queryFn: async () => {
      const res = await apiService.get<{ success?: boolean; data?: InAppNotification[]; meta?: unknown } | InAppNotification[]>(
        "/notifications",
        { params }
      );
      const data = Array.isArray(res) ? res : (res as any)?.data ?? [];
      const meta = Array.isArray(res) ? undefined : (res as any)?.meta;
      return { data: Array.isArray(data) ? data : [], meta };
    },
  });
}

/** GET /notifications/unread-count */
export function useUnreadNotificationsCount(tenantId?: string) {
  return useQuery({
    queryKey: ["notifications-unread-count", tenantId],
    queryFn: async () => {
      const res = await apiService.get<{ data?: { count: number } }>("/notifications/unread-count", {
        params: tenantId ? { tenantId } : {},
      });
      return res?.data?.count ?? 0;
    },
  });
}
