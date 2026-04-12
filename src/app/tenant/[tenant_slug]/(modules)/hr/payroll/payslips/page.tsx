"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useEmployeePayslips, useEmployees } from "@/hooks/api/useHR";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function HrPayslipsPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.PAYROLL_READ]}>
      <HrPayslipsContent />
    </ModuleGuard>
  );
}

function HrPayslipsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const { data: employees = [] } = useEmployees({ status: "active" });
  const { data: payslips = [], isLoading, error, refetch } = useEmployeePayslips(employeeId);
  const empList = Array.isArray(employees) ? employees : [];
  const list = Array.isArray(payslips) ? payslips : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/payroll"))} leftIcon={<ArrowLeft />}>Retour</Button>
        <h1 className="text-2xl font-bold">Fiches de paie</h1>
      </div>
      <Card>
        <CardContent className="p-4">
          <label className="block text-sm font-medium mb-2">Employe</label>
          <select
            className="w-full max-w-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            value={employeeId ?? ""}
            onChange={(e) => setEmployeeId(e.target.value || null)}
          >
            <option value="">Selectionner un employe</option>
            {empList.map((e: { id: string; first_name?: string; last_name?: string }) => (
              <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
            ))}
          </select>
        </CardContent>
      </Card>
      {isLoading && <Skeleton className="h-32 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
      {!isLoading && !error && employeeId && (
        <Card>
          <CardContent className="p-0">
            {list.length === 0 ? <p className="p-4 text-sm text-slate-500">Aucune fiche pour cet employe.</p> : (
              <ul className="divide-y divide-slate-100">
                {list.map((p: { id: string; period_start?: string; period_end?: string; net_salary?: number; currency?: string }) => (
                  <li key={p.id} className="p-4 flex justify-between items-center text-sm">
                    <span>{p.period_start ? formatDate(p.period_start) : ""} → {p.period_end ? formatDate(p.period_end) : ""}</span>
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
