"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useAnalyticsKPIs } from "@/hooks/api/useAnalytics";
import { Button, Card, CardContent, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

const FREQUENCIES = [
  { value: "daily", label: "Quotidien" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
  { value: "quarterly", label: "Trimestriel" },
];

export default function KPIsPage() {
  return (
    <ModuleGuard module="analytics" requiredPermissions={[Permission.BI_READ]}>
      <KPIsContent />
    </ModuleGuard>
  );
}

function KPIsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "quarterly" | undefined>(undefined);
  const { data: kpis, isLoading, error, refetch } = useAnalyticsKPIs(frequency);

  const list = Array.isArray(kpis) ? kpis : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/analytics"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">KPIs</h1>
            <p className="text-sm text-slate-500">Indicateurs configurés</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={frequency ?? ""}
            onChange={(e) => setFrequency((e.target.value || undefined) as any)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          >
            <option value="">Toutes fréquences</option>
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger les KPIs" onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState icon={<TrendingUp className="w-8 h-8 text-slate-400" />} title="Aucun KPI" description="Les KPIs sont calculés depuis le dashboard BI." />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((kpi: { name?: string; value?: number; unit?: string; trend?: string }, i: number) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 uppercase">{kpi.name}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {formatNumber(kpi.value ?? 0)} {kpi.unit ?? ""}
                </p>
                {kpi.trend && (
                  <span className="text-xs text-slate-500 mt-1">{kpi.trend}</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
