"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useEmployeeById } from "@/hooks/api/useHR";
import { CONTRACT_TYPE_LABELS, EMPLOYMENT_STATUS_LABELS } from "@/types/hr";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, User, Edit } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function HrEmployeeDetailPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.EMPLOYEES_READ]}>
      <HrEmployeeDetailContent />
    </ModuleGuard>
  );
}

function HrEmployeeDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: employee, isLoading, error, refetch } = useEmployeeById(id);

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (error) return <ErrorBanner message="Employé introuvable" onRetry={() => refetch()} />;
  if (!employee) return null;

  const e = employee as {
    first_name?: string;
    last_name?: string;
    employee_number?: string;
    email?: string;
    phone?: string;
    job_title?: string;
    department?: string;
    contract_type?: string;
    employment_status?: string;
    contract_start_date?: string;
    contract_end_date?: string;
    base_salary?: number;
    salary_currency?: string;
    weekly_hours?: number;
    address?: { street?: string; city?: string; postal_code?: string; country?: string };
    annual_leave_balance?: number;
    sick_leave_balance?: number;
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/hr/employees"))}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {e.first_name} {e.last_name}
          </h1>
        </div>
        <ProtectedAction permission={Permission.EMPLOYEES_UPDATE}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit className="w-4 h-4" />}
            onClick={() => router.push(buildPath("/hr/employees/" + id + "/edit"))}
          >
            Modifier
          </Button>
        </ProtectedAction>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" /> Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Matricule</span> {e.employee_number ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Email</span> {e.email ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Téléphone</span> {e.phone ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Poste</span> {e.job_title ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Département</span> {e.department ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Statut</span> {(EMPLOYMENT_STATUS_LABELS as Record<string, string>)[e.employment_status ?? ""] ?? e.employment_status}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Type de contrat</span> {(CONTRACT_TYPE_LABELS as Record<string, string>)[e.contract_type ?? ""] ?? e.contract_type}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Début contrat</span> {e.contract_start_date ? formatDate(e.contract_start_date) : "—"}</p>
          {e.contract_end_date && <p><span className="font-medium text-slate-600 dark:text-slate-400">Fin contrat</span> {formatDate(e.contract_end_date)}</p>}
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Heures/semaine</span> {e.weekly_hours ?? "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Salaire de base</span> {e.base_salary != null ? `${e.base_salary} ${e.salary_currency ?? "EUR"}` : "—"}</p>
          {(e.annual_leave_balance != null || e.sick_leave_balance != null) && (
            <p><span className="font-medium text-slate-600 dark:text-slate-400">Soldes congés</span> Annuels: {e.annual_leave_balance ?? 0} · Maladie: {e.sick_leave_balance ?? 0}</p>
          )}
          {e.address && (e.address.street || e.address.city) && (
            <p><span className="font-medium text-slate-600 dark:text-slate-400">Adresse</span> {[e.address.street, e.address.city, e.address.postal_code, e.address.country].filter(Boolean).join(", ")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
