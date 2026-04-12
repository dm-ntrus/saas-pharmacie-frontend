"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useAnalyticsDashboardById } from "@/hooks/api/useAnalytics";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function DashboardDetailPage() {
  return (
    <ModuleGuard module="analytics" requiredPermissions={[Permission.BI_READ]}>
      <DashboardDetailContent />
    </ModuleGuard>
  );
}

function DashboardDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { buildPath } = useTenantPath();
  const { data: dashboard, isLoading, error, refetch } = useAnalyticsDashboardById(id);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !dashboard) return <ErrorBanner message="Dashboard introuvable" onRetry={() => refetch()} />;

  const d = dashboard as { id: string; name?: string; description?: string; widgets?: unknown[] };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/analytics/dashboards"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{d.name ?? "Dashboard"}</h1>
          <p className="text-sm text-slate-500">{d.description ?? "—"}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          {d.widgets && (d.widgets as unknown[]).length > 0 ? (
            <p className="text-sm text-slate-500">{(d.widgets as unknown[]).length} widget(s). Édition des widgets à venir.</p>
          ) : (
            <p className="text-sm text-slate-500">Aucun widget. Ajoutez des widgets pour personnaliser ce dashboard.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
