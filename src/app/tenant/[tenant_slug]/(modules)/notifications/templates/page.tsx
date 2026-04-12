"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useNotificationTemplates } from "@/hooks/api/useNotifications";
import { Button, Card, CardContent, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, FileText } from "lucide-react";

export default function NotificationTemplatesPage() {
  return (
    <ModuleGuard module="notifications" requiredPermissions={[Permission.NOTIFICATIONS_READ]}>
      <TemplatesContent />
    </ModuleGuard>
  );
}

function TemplatesContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: templates, isLoading, error, refetch } = useNotificationTemplates();
  const list = Array.isArray(templates) ? templates : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/notifications"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Templates de notifications</h1>
          <p className="text-sm text-slate-500">Templates disponibles pour l'envoi</p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : error ? (
        <ErrorBanner message="Impossible de charger les templates" onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState icon={<FileText className="w-8 h-8 text-slate-400" />} title="Aucun template" description="Aucun template configuré." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((t: { type?: string; name?: string; description?: string; channels?: string[] }, i: number) => (
            <Card key={i}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.name ?? t.type ?? "Template"}</h3>
                <p className="text-sm text-slate-500 mt-1">{t.description ?? "—"}</p>
                {t.channels && t.channels.length > 0 && (
                  <p className="text-xs text-slate-400 mt-2">Canaux : {t.channels.join(", ")}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
