"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useEvaluationById, useSubmitEvaluation, useFinalizeEvaluation } from "@/hooks/api/useHR";
import { EVALUATION_STATUS_LABELS } from "@/types/hr";
import { Button, Card, CardContent, CardHeader, CardTitle, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function HrEvaluationDetailPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.EVALUATIONS_READ]}>
      <HrEvaluationDetailContent />
    </ModuleGuard>
  );
}

function HrEvaluationDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: evaluation, isLoading, error, refetch } = useEvaluationById(id);
  const submitEval = useSubmitEvaluation(id);
  const finalizeEval = useFinalizeEvaluation(id);

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (error) return <ErrorBanner message="Evaluation introuvable" onRetry={() => refetch()} />;
  if (!evaluation) return null;

  const e = evaluation as {
    employee_id?: string;
    evaluation_period_start?: string;
    evaluation_period_end?: string;
    evaluation_type?: string;
    overall_rating?: number;
    status?: string;
    strengths?: string;
    areas_for_improvement?: string;
    employee_comments?: string;
    manager_comments?: string;
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/evaluations"))} leftIcon={<ArrowLeft />}>Retour</Button>
          <h1 className="text-2xl font-bold">Evaluation</h1>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-slate-500">{(EVALUATION_STATUS_LABELS as Record<string, string>)[e.status ?? ""] ?? e.status}</span>
          {e.status === "draft" && (
            <ProtectedAction permission={Permission.EVALUATIONS_UPDATE}>
              <Button size="sm" onClick={() => submitEval.mutate(undefined, { onSuccess: () => refetch() })} disabled={submitEval.isPending}>Soumettre</Button>
            </ProtectedAction>
          )}
          {(e.status === "submitted" || e.status === "employee_reviewed") && (
            <ProtectedAction permission={Permission.EVALUATIONS_UPDATE}>
              <Button size="sm" onClick={() => finalizeEval.mutate(undefined, { onSuccess: () => refetch() })} disabled={finalizeEval.isPending}>Finaliser</Button>
            </ProtectedAction>
          )}
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Detail</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><span className="font-medium text-slate-600">Periode</span> {e.evaluation_period_start ? formatDate(e.evaluation_period_start) : ""} → {e.evaluation_period_end ? formatDate(e.evaluation_period_end) : ""}</p>
          <p><span className="font-medium text-slate-600">Type</span> {e.evaluation_type ?? "—"}</p>
          <p><span className="font-medium text-slate-600">Note globale</span> {e.overall_rating ?? "—"}</p>
          {e.strengths && <p><span className="font-medium text-slate-600">Points forts</span><br />{e.strengths}</p>}
          {e.areas_for_improvement && <p><span className="font-medium text-slate-600">Axes d amelioration</span><br />{e.areas_for_improvement}</p>}
          {e.manager_comments && <p><span className="font-medium text-slate-600">Commentaire manager</span><br />{e.manager_comments}</p>}
          {e.employee_comments && <p><span className="font-medium text-slate-600">Commentaire employe</span><br />{e.employee_comments}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
