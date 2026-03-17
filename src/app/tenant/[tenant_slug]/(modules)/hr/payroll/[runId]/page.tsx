"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { usePayslipsByRun, useCalculatePayroll, useApprovePayrollRun } from "@/hooks/api/useHR";
import { Button, Card, CardContent, CardHeader, CardTitle, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function HrPayrollRunPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.PAYROLL_READ]}>
      <HrPayrollRunContent />
    </ModuleGuard>
  );
}

function HrPayrollRunContent() {
  const router = useRouter();
  const params = useParams();
  const { buildPath } = useTenantPath();
  const runId = (params?.runId as string) ?? "";
  const { data: payslips = [], isLoading, error, refetch } = usePayslipsByRun(runId);
  const calculatePayroll = useCalculatePayroll(runId);
  const approvePayroll = useApprovePayrollRun(runId);
  const list = Array.isArray(payslips) ? payslips : [];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/payroll"))} leftIcon={<ArrowLeft />}>Retour</Button>
          <h1 className="text-2xl font-bold">Cycle de paie</h1>
        </div>
        <div className="flex gap-2">
          <ProtectedAction permission={Permission.PAYROLL_CREATE}>
            <Button variant="outline" size="sm" onClick={() => calculatePayroll.mutate(undefined, { onSuccess: () => refetch() })} disabled={calculatePayroll.isPending}>Calculer</Button>
          </ProtectedAction>
          <ProtectedAction permission={Permission.PAYROLL_APPROVE}>
            <Button size="sm" onClick={() => approvePayroll.mutate(undefined, { onSuccess: () => refetch() })} disabled={approvePayroll.isPending}>Approuver</Button>
          </ProtectedAction>
        </div>
      </div>
      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
      {!isLoading && !error && (
        <Card>
          <CardHeader><CardTitle className="text-base">Fiches de paie ({list.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            {list.length === 0 ? <p className="p-4 text-sm text-slate-500">Aucune fiche pour ce cycle.</p> : (
              <ul className="divide-y divide-slate-100">
                {list.map((p: { id: string; employee_id?: string; period_start?: string; period_end?: string; net_salary?: number; currency?: string }) => (
                  <li key={p.id} className="p-4 flex justify-between items-center">
                    <span className="text-sm">{p.employee_id ?? p.id}</span>
                    <span className="text-sm text-slate-500">{p.period_start ? formatDate(p.period_start) : ""} → {p.period_end ? formatDate(p.period_end) : ""}</span>
                    <span className="font-medium">{p.net_salary != null ? `${p.net_salary} ${p.currency ?? "EUR"}` : ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
