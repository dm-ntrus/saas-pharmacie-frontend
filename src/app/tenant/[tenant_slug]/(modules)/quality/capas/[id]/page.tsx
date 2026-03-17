"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCAPAById } from "@/hooks/api/useQuality";
import { CAPA_TYPE_LABELS, CAPA_STATUS_LABELS } from "@/types/quality";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function CAPADetailPage() {
  return (
    <ModuleGuard
      module="quality"
      requiredPermissions={[Permission.QUALITY_CAPAS_READ]}
    >
      <CAPADetailContent />
    </ModuleGuard>
  );
}

function CAPADetailContent() {
  const router = useRouter();
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: capa, isLoading, error, refetch } = useCAPAById(id);

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (error) return <ErrorBanner message="CAPA introuvable" onRetry={() => refetch()} />;
  if (!capa) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/quality/capas"))}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {capa.title ?? "CAPA"}
          </h1>
        </div>
        <Badge variant="default">{CAPA_TYPE_LABELS[capa.type as keyof typeof CAPA_TYPE_LABELS] ?? capa.type}</Badge>
        <Badge variant="default">{CAPA_STATUS_LABELS[capa.status as keyof typeof CAPA_STATUS_LABELS] ?? capa.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Description</span><br />{capa.description ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Responsable</span> {capa.assignedTo ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Échéance</span> {capa.dueDate ? formatDate(capa.dueDate) : "—"}</p>
          {capa.completedAt && <p><span className="font-medium text-slate-600 dark:text-slate-400">Clôturée le</span> {formatDate(capa.completedAt)}</p>}
          {capa.effectivenessNotes && <p><span className="font-medium text-slate-600 dark:text-slate-400">Efficacité</span><br />{capa.effectivenessNotes}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
