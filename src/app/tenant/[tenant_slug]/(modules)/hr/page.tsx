"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useHrDashboard, usePendingLeaves } from "@/hooks/api/useHR";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import { Users, UserCheck, CalendarOff, FileText, ChevronRight, ClipboardList, DollarSign } from "lucide-react";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function HrDashboardPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.EMPLOYEES_READ]}>
      <HrDashboardContent />
    </ModuleGuard>
  );
}

function HrDashboardContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: dashboard, isLoading, error, refetch } = useHrDashboard();
  const { data: pendingLeaves = [] } = usePendingLeaves();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBanner message="Erreur de chargement du dashboard RH" onRetry={() => refetch()} />
    );
  }

  const emp = dashboard?.employees ?? { total: 0, active: 0, on_leave: 0 };
  const att = dashboard?.attendance_this_month ?? { present: 0, absent: 0, late: 0, sick: 0, remote: 0 };
  const pendingCount = dashboard?.pending_leave_requests ?? pendingLeaves.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ressources Humaines</h1>
          <p className="text-sm text-slate-500 mt-1">Dashboard RH et effectifs</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => router.push(buildPath("/hr/employees"))}
          className="text-left"
        >
          <Card className="hover:border-emerald-500 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{emp.total}</p>
                <p className="text-sm text-slate-500">Effectif total</p>
              </div>
            </CardContent>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => router.push(buildPath("/hr/employees"))}
          className="text-left"
        >
          <Card className="hover:border-blue-500 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{emp.active}</p>
                <p className="text-sm text-slate-500">Actifs</p>
              </div>
            </CardContent>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => router.push(buildPath("/hr/leaves"))}
          className="text-left"
        >
          <Card className="hover:border-amber-500 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <CalendarOff className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{pendingCount}</p>
                <p className="text-sm text-slate-500">Congés en attente</p>
              </div>
            </CardContent>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => router.push(buildPath("/hr/attendance"))}
          className="text-left"
        >
          <Card className="hover:border-violet-500 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{att.present}</p>
                <p className="text-sm text-slate-500">Présents ce mois</p>
              </div>
            </CardContent>
          </Card>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Accès rapides</h2>
            <ul className="space-y-2">
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => router.push(buildPath("/hr/employees"))}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Employés
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => router.push(buildPath("/hr/schedule"))}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Planning
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => router.push(buildPath("/hr/attendance"))}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Pointage
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => router.push(buildPath("/hr/leaves"))}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Congés
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => router.push(buildPath("/hr/payroll"))}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Paie
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => router.push(buildPath("/hr/evaluations"))}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Évaluations
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Demandes de congé en attente</h2>
            {Array.isArray(pendingLeaves) && pendingLeaves.length > 0 ? (
              <ul className="space-y-2">
                {(pendingLeaves as { id: string; employee_id?: string; leave_type?: string; start_date?: string }[]).slice(0, 5).map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between text-left py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      onClick={() => router.push(buildPath("/hr/leaves"))}
                    >
                      <span className="text-sm truncate">{l.leave_type ?? "Congé"} — {l.start_date ? new Date(l.start_date).toLocaleDateString("fr-FR") : ""}</span>
                      <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Aucune demande en attente</p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => router.push(buildPath("/hr/leaves"))}
            >
              Voir les congés
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
