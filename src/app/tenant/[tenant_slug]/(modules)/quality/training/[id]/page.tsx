"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useTrainingRecordById } from "@/hooks/api/useQuality";
import { Button, Card, CardContent, CardHeader, CardTitle, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function TrainingRecordDetailPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_TRAINING_READ]}>
      <TrainingRecordDetailContent />
    </ModuleGuard>
  );
}

function TrainingRecordDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: record, isLoading, error, refetch } = useTrainingRecordById(id);

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (error) return <ErrorBanner message="Enregistrement introuvable" onRetry={() => refetch()} />;
  if (!record) return null;

  const r = record as { trainerName?: string; trainingDate?: string; completionDate?: string; trainingMethod?: string; trainingDurationHours?: number; competencyLevel?: string; assessmentScore?: number; notes?: string };
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/quality/training"))} leftIcon={<ArrowLeft />}>Retour</Button>
        <h1 className="text-2xl font-bold">Formation - {r.trainerName ?? id}</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Détails</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><span className="font-medium text-slate-600">Date</span> {r.trainingDate ? formatDate(r.trainingDate) : "—"}</p>
          <p><span className="font-medium text-slate-600">Complétion</span> {r.completionDate ? formatDate(r.completionDate) : "—"}</p>
          <p><span className="font-medium text-slate-600">Méthode</span> {r.trainingMethod ?? "—"}</p>
          <p><span className="font-medium text-slate-600">Durée (h)</span> {r.trainingDurationHours ?? "—"}</p>
          <p><span className="font-medium text-slate-600">Niveau</span> {r.competencyLevel ?? "—"}</p>
          {r.assessmentScore != null && <p><span className="font-medium text-slate-600">Score</span> {r.assessmentScore}</p>}
          {r.notes && <p><span className="font-medium text-slate-600">Notes</span><br />{r.notes}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
