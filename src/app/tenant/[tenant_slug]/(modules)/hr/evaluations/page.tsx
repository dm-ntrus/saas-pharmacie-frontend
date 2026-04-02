"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useEmployeeEvaluations, useEmployees } from "@/hooks/api/useHR";
import { EVALUATION_STATUS_LABELS } from "@/types/hr";
import { Button, Card, CardContent, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { Plus, ChevronRight, FileText } from "lucide-react";

function safeId(id: string) {
  return id.includes(":") ? id.split(":")[1] : id;
}

export default function HrEvaluationsPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.EVALUATIONS_READ]}>
      <HrEvaluationsContent />
    </ModuleGuard>
  );
}

function HrEvaluationsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [selectedEmpId, setSelectedEmpId] = React.useState<string | null>(null);
  const { data: employees = [] } = useEmployees({ status: "active" });
  const empList = Array.isArray(employees) ? employees : [];
  const { data: evals = [], isLoading, error, refetch } = useEmployeeEvaluations(selectedEmpId);
  const list = Array.isArray(evals) ? evals : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Evaluations</h1>
          <p className="text-sm text-slate-500 mt-1">Evaluations des employes</p>
        </div>
        <ProtectedAction permission={Permission.EVALUATIONS_CREATE}>
          <Button leftIcon={<Plus />} onClick={() => router.push(buildPath("/hr/evaluations/new"))}>Nouvelle evaluation</Button>
        </ProtectedAction>
      </div>
      <div className="flex gap-2">
        <label className="text-sm font-medium self-center">Employe:</label>
        <select className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-w-[200px] focus:outline-none focus:ring-2 focus:ring-emerald-500" value={selectedEmpId ?? ""} onChange={(e) => setSelectedEmpId(e.target.value || null)}>
          <option value="">Selectionner un employe</option>
          {empList.map((emp: { id: string; first_name?: string; last_name?: string }) => (
            <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
          ))}
        </select>
      </div>
      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
      {!isLoading && !error && !selectedEmpId && (
        <p className="text-sm text-slate-500">Selectionnez un employe pour afficher ses evaluations.</p>
      )}
      {!isLoading && !error && selectedEmpId && list.length === 0 && (
        <EmptyState title="Aucune evaluation" description="Aucune evaluation pour cet employe." />
      )}
      {!isLoading && !error && selectedEmpId && list.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100">
              {list.map((e: { id: string; evaluation_period_start?: string; evaluation_period_end?: string; status?: string; overall_rating?: number }) => (
                <li key={e.id}>
                  <button type="button" className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50" onClick={() => router.push(buildPath("/hr/evaluations/" + safeId(e.id)))}>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium">{e.evaluation_period_start ?? ""} → {e.evaluation_period_end ?? ""}</p>
                        <p className="text-sm text-slate-500">{(EVALUATION_STATUS_LABELS as Record<string, string>)[e.status ?? ""] ?? e.status} · Note: {e.overall_rating ?? "—"}</p>
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
