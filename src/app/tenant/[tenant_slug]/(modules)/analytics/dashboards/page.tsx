"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useAnalyticsDashboards } from "@/hooks/api/useAnalytics";
import { Button, Card, CardContent, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, BarChart3, Plus } from "lucide-react";

export default function DashboardsListPage() {
  return (
    <ModuleGuard module="analytics" requiredPermissions={[Permission.BI_READ]}>
      <DashboardsListContent />
    </ModuleGuard>
  );
}

function DashboardsListContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: dashboards, isLoading, error, refetch } = useAnalyticsDashboards();
  const list = Array.isArray(dashboards) ? dashboards : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/analytics"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mes dashboards</h1>
            <p className="text-sm text-slate-500">Dashboards personnalisés</p>
          </div>
        </div>
        <ProtectedAction permission={Permission.BI_WRITE}>
          <Button size="sm" onClick={() => router.push(buildPath("/analytics/dashboards/new"))} leftIcon={<Plus className="h-4 w-4" />}>
            Nouveau dashboard
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger les dashboards" onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="w-8 h-8 text-slate-400" />}
          title="Aucun dashboard"
          description="Créez un dashboard personnalisé pour suivre vos indicateurs."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((d: { id: string; name?: string; description?: string }) => (
            <Card
              key={d.id}
              className="cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
              onClick={() => router.push(buildPath(`/analytics/dashboards/${d.id}`))}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{d.name ?? "Sans nom"}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{d.description ?? "—"}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={(e) => { e.stopPropagation(); router.push(buildPath(`/analytics/dashboards/${d.id}`)); }}>
                  Ouvrir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
