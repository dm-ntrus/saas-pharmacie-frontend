"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useEmployees } from "@/hooks/api/useHR";
import { EMPLOYMENT_STATUS_LABELS, CONTRACT_TYPE_LABELS } from "@/types/hr";
import { Button, Card, CardContent, Badge, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { Plus, User, ChevronRight } from "lucide-react";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function HrEmployeesPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.EMPLOYEES_READ]}>
      <HrEmployeesContent />
    </ModuleGuard>
  );
}

function HrEmployeesContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [statusFilter, setStatusFilter] = useState("");
  const params: Record<string, string> = {};
  if (statusFilter) params.status = statusFilter;
  const { data: employees = [], isLoading, error, refetch } = useEmployees(params);
  const list = Array.isArray(employees) ? employees : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employes</h1>
          <p className="text-sm text-slate-500 mt-1">Effectif et contrats</p>
        </div>
        <ProtectedAction permission={Permission.EMPLOYEES_CREATE}>
          <Button leftIcon={<Plus />} onClick={() => router.push(buildPath("/hr/employees/new"))}>
            Nouvel employe
          </Button>
        </ProtectedAction>
      </div>
      <div className="flex flex-wrap gap-2">
        <select className="rounded-lg border px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(EMPLOYMENT_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
      {!isLoading && !error && list.length === 0 && (
        <EmptyState title="Aucun employe" onAction={() => router.push(buildPath("/hr/employees/new"))} actionLabel="Nouvel employe" />
      )}
      {!isLoading && !error && list.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100">
              {list.map((e: { id: string; first_name?: string; last_name?: string; job_title?: string; department?: string; employment_status?: string; contract_type?: string }) => (
                <li key={e.id}>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50"
                    onClick={() => router.push(buildPath("/hr/employees/" + safeId(e.id)))}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium">{e.first_name} {e.last_name}</p>
                        <p className="text-sm text-slate-500">{e.job_title} {(CONTRACT_TYPE_LABELS as Record<string, string>)[e.contract_type ?? ""] ?? e.contract_type}</p>
                      </div>
                    </div>
                    <Badge size="sm">{(EMPLOYMENT_STATUS_LABELS as Record<string, string>)[e.employment_status ?? ""] ?? e.employment_status}</Badge>
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
