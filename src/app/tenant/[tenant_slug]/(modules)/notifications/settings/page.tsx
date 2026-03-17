"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useNotificationQueueStatus } from "@/hooks/api/useNotifications";
import { Button, Card, CardContent, Skeleton, ErrorBanner } from "@/components/ui";
import { ArrowLeft, Settings } from "lucide-react";

export default function NotificationSettingsPage() {
  return (
    <ModuleGuard module="notifications" requiredPermissions={[Permission.NOTIFICATIONS_READ]}>
      <NotificationSettingsContent />
    </ModuleGuard>
  );
}

function NotificationSettingsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: queue, isLoading, error, refetch } = useNotificationQueueStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/notifications"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Paramètres notifications</h1>
          <p className="text-sm text-slate-500">Canaux et file d&apos;attente</p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : error ? (
        <ErrorBanner message="Impossible de charger le statut" onRetry={() => refetch()} />
      ) : (
        <Card>
          <CardContent className="p-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              File d&apos;attente
            </h2>
            {queue && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div><p className="text-2xl font-bold">{(queue as any).waiting ?? 0}</p><p className="text-xs text-slate-500">En attente</p></div>
                <div><p className="text-2xl font-bold text-amber-600">{(queue as any).active ?? 0}</p><p className="text-xs text-slate-500">En cours</p></div>
                <div><p className="text-2xl font-bold text-emerald-600">{(queue as any).completed ?? 0}</p><p className="text-xs text-slate-500">Terminées</p></div>
                <div><p className="text-2xl font-bold text-red-600">{(queue as any).failed ?? 0}</p><p className="text-xs text-slate-500">Échouées</p></div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
