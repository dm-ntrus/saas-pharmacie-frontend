"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useQualityMetrics } from "@/hooks/api/useQuality";
import { Button, Card, CardContent, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { Plus, BarChart3, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/formatters";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function QualityMetricsPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_METRICS_READ]}>
      <QualityMetricsContent />
    </ModuleGuard>
  );
}

function QualityMetricsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: metrics = [], isLoading, error, refetch } = useQualityMetrics();
  const list = Array.isArray(metrics) ? metrics : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Métriques qualité</h1>
          <p className="text-sm text-slate-500 mt-1">Indicateurs et objectifs</p>
        </div>
        <ProtectedAction permission={Permission.QUALITY_METRICS_CREATE}>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => router.push(buildPath("/quality/metrics/new"))}>
            Nouvelle métrique
          </Button>
        </ProtectedAction>
      </div>
      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur de chargement" onRetry={() => refetch()} />}
      {!isLoading && !error && list.length === 0 && (
        <EmptyState title="Aucune métrique" description="Aucune métrique qualité." onAction={() => router.push(buildPath("/quality/metrics/new"))} actionLabel="Nouvelle métrique" />
      )}
      {!isLoading && !error && list.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {list.map((m: { id: string; metricName?: string; metricType?: string; targetValue?: number; actualValue?: number; measurementDate?: string }) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    onClick={() => router.push(buildPath("/quality/metrics/" + safeId(m.id)))}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{m.metricName ?? m.id}</p>
                        <p className="text-sm text-slate-500">
                          {m.metricType ?? "-"} - Cible {m.targetValue ?? "-"} / Réel {m.actualValue ?? "-"} - {m.measurementDate ? formatDate(m.measurementDate) : ""}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
