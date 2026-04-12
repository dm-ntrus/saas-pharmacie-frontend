"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { usePendingLeaves, useApproveLeave, useRejectLeave } from "@/hooks/api/useHR";
import { LEAVE_TYPE_LABELS, LEAVE_STATUS_LABELS } from "@/types/hr";
import { Button, Card, CardContent, Badge, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { Plus, Calendar, ChevronRight, Check, X } from "lucide-react";
import { formatDate } from "@/utils/formatters";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function HrLeavesPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.LEAVES_READ]}>
      <HrLeavesContent />
    </ModuleGuard>
  );
}

function HrLeavesContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: pending = [], isLoading, error, refetch } = usePendingLeaves();
  const approveLeave = useApproveLeave();
  const rejectLeave = useRejectLeave();
  const list = Array.isArray(pending) ? pending : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Conges</h1>
          <p className="text-sm text-slate-500 mt-1">Demandes et soldes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/leaves/calendar"))} leftIcon={<Calendar />}>
            Calendrier
          </Button>
          <ProtectedAction permission={Permission.LEAVES_CREATE}>
            <Button leftIcon={<Plus />} onClick={() => router.push(buildPath("/hr/leaves"))}>
              Demander un conge
            </Button>
          </ProtectedAction>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-3">Demandes en attente</h2>
          {isLoading && <Skeleton className="h-24" />}
          {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
          {!isLoading && !error && list.length === 0 && (
            <EmptyState title="Aucune demande en attente" description="Toutes les demandes ont ete traitees." />
          )}
          {!isLoading && !error && list.length > 0 && (
            <ul className="space-y-3">
              {list.map((l: { id: string; employee_id?: string; leave_type?: string; start_date?: string; end_date?: string; total_days?: number; reason?: string }) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium">{(LEAVE_TYPE_LABELS as Record<string, string>)[l.leave_type ?? ""] ?? l.leave_type}</p>
                    <p className="text-sm text-slate-500">{l.start_date ? formatDate(l.start_date) : ""} → {l.end_date ? formatDate(l.end_date) : ""} · {l.total_days ?? 0} jour(s)</p>
                    {l.reason && <p className="text-sm text-slate-500">{l.reason}</p>}
                  </div>
                  <div className="flex gap-2">
                    <ProtectedAction permission={Permission.LEAVES_APPROVE}>
                      <Button size="sm" leftIcon={<Check />} onClick={() => approveLeave.mutate({ leaveId: l.id }, { onSuccess: () => refetch() })} disabled={approveLeave.isPending}>
                        Approuver
                      </Button>
                      <Button size="sm" variant="outline" leftIcon={<X />} onClick={() => rejectLeave.mutate({ leaveId: l.id }, { onSuccess: () => refetch() })} disabled={rejectLeave.isPending}>
                        Refuser
                      </Button>
                    </ProtectedAction>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
