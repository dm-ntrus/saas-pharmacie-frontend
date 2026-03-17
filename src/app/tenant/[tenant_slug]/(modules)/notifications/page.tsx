"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useInAppNotifications } from "@/hooks/api/useNotifications";
import { Button, Card, CardContent, Badge, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, Bell, BellOff } from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

export default function NotificationsPage() {
  return (
    <ModuleGuard module="notifications" requiredPermissions={[Permission.NOTIFICATIONS_READ]}>
      <NotificationCenterContent />
    </ModuleGuard>
  );
}

function NotificationCenterContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { data, isLoading, error, refetch } = useInAppNotifications({
    limit: 50,
    unread_only: filter === "unread",
  });

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/dashboard"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Centre de notifications</h1>
            <p className="text-sm text-slate-500">
              {unreadCount > 0 ? `${unreadCount} non lue(s)` : "Toutes lues"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "primary" : "outline"} size="sm" onClick={() => setFilter("all")}>
            Toutes
          </Button>
          <Button variant={filter === "unread" ? "primary" : "outline"} size="sm" onClick={() => setFilter("unread")}>
            Non lues
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/notifications/settings"))}>
            Paramètres
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/notifications/templates"))}>
            Templates
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger les notifications" onRetry={() => refetch()} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<BellOff className="w-8 h-8 text-slate-400" />}
          title="Aucune notification"
          description="Vous n'avez pas de notification pour le moment."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 p-4 ${!n.read ? "bg-slate-50 dark:bg-slate-800/30" : ""}`}
                >
                  <div className="mt-0.5">
                    {!n.read && <span className="block w-2 h-2 rounded-full bg-blue-500" />}
                    <Bell className={`w-5 h-5 text-slate-400 ${!n.read ? "text-blue-500" : ""}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{n.title ?? "Notification"}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{n.message ?? ""}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatDateTime(n.created_at)}</p>
                    {n.module && (
                      <Badge variant="default" size="sm" className="mt-2">{n.module}</Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
