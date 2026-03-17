"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useBIDashboard } from "@/hooks/api/useAnalytics";
import { Button, Card, CardContent, Skeleton, ErrorBanner } from "@/components/ui";
import { ArrowLeft, BarChart3, TrendingUp } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

const PERIODS = [
  { label: "7j", start: 7 },
  { label: "30j", start: 30 },
  { label: "90j", start: 90 },
];

export default function AnalyticsPage() {
  return (
    <ModuleGuard module="analytics" requiredPermissions={[Permission.BI_READ]}>
      <AnalyticsDashboardContent />
    </ModuleGuard>
  );
}

function AnalyticsDashboardContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [periodDays, setPeriodDays] = useState(30);
  const { data: overview, isLoading, error, refetch } = useBIDashboard();

  const kpis = overview?.kpis ?? [];
  const period = overview?.period;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/dashboard"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">BI & Analytics</h1>
            <p className="text-sm text-slate-500">Dashboard principal, KPIs et rapports</p>
          </div>
        </div>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <Button
              key={p.start}
              variant={periodDays === p.start ? "primary" : "outline"}
              size="sm"
              onClick={() => setPeriodDays(p.start)}
            >
              {p.label}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/analytics/dashboards"))}>
            Mes dashboards
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/analytics/reports"))}>
            Rapports
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/analytics/kpis"))}>
            KPIs
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger le dashboard BI" onRetry={() => refetch()} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.length > 0 ? (
              kpis.slice(0, 6).map((kpi, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">{kpi.name}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {formatNumber(kpi.value)} {kpi.unit ?? ""}
                    </p>
                    {kpi.trend && (
                      <span
                        className={`text-xs mt-1 inline-flex items-center gap-0.5 ${
                          kpi.trend === "up" ? "text-emerald-600" : kpi.trend === "down" ? "text-red-600" : "text-slate-500"
                        }`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        {kpi.trend}
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-500">Aucun KPI configuré. Allez dans KPIs pour calculer.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {period && (
            <p className="text-xs text-slate-500">
              Période : {period.start} → {period.end}
            </p>
          )}
        </>
      )}
    </div>
  );
}
