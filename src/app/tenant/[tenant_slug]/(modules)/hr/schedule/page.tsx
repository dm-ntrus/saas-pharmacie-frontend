"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useShiftSchedule } from "@/hooks/api/useHR";
import { Button, Card, CardContent, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { Plus } from "lucide-react";

export default function HrSchedulePage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.SHIFTS_READ]}>
      <HrScheduleContent />
    </ModuleGuard>
  );
}

function HrScheduleContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay() + 1);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const from = start.toISOString().slice(0, 10);
  const to = end.toISOString().slice(0, 10);
  const { data: shifts = [], isLoading, error, refetch } = useShiftSchedule(from, to);
  const list = Array.isArray(shifts) ? shifts : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Planning</h1>
          <p className="text-sm text-slate-500">Semaine du {from} au {to}</p>
        </div>
        <ProtectedAction permission={Permission.SHIFTS_CREATE}>
          <Button leftIcon={<Plus />} onClick={() => router.push(buildPath("/hr/schedule/shifts/new"))}>Nouveau shift</Button>
        </ProtectedAction>
      </div>
      {isLoading && <Skeleton className="h-64 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
      {!isLoading && !error && list.length === 0 && (
        <EmptyState title="Aucun shift" onAction={() => router.push(buildPath("/hr/schedule/shifts/new"))} actionLabel="Nouveau shift" />
      )}
      {!isLoading && !error && list.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-3">
              {list.map((s: { id: string; shift_date?: string; start_time?: string; end_time?: string }) => (
                <li key={s.id} className="py-2 border-b border-slate-100 text-sm">{s.shift_date} {s.start_time} - {s.end_time}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
