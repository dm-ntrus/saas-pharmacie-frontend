"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useQualityMetricById } from "@/hooks/api/useQuality";
import { Button, Card, CardContent, CardHeader, CardTitle, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function QualityMetricDetailPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_METRICS_READ]}>
      <QualityMetricDetailContent />
    </ModuleGuard>
  );
}

function QualityMetricDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: metric, isLoading, error, refetch } = useQualityMetricById(id);

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (error) return <ErrorBanner message="Métrique introuvable" onRetry={() => refetch()} />;
  if (!metric) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/quality/metrics"))} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metric.metricName ?? "Métrique"}</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Détails</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Type</span> {metric.metricType ?? "—"}</p>
          {metric.description && <p><span className="font-medium text-slate-600 dark:text-slate-400">Description</span><br />{metric.description}</p>}
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Valeur cible</span> {metric.targetValue ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Valeur réelle</span> {metric.actualValue ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Date de mesure</span> {metric.measurementDate ? formatDate(metric.measurementDate) : "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Période</span> {metric.measurementPeriod ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Enregistré par</span> {metric.recordedBy ?? "—"}</p>
          {metric.notes && <p><span className="font-medium text-slate-600 dark:text-slate-400">Notes</span><br />{metric.notes}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
