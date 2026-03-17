"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useAttendanceSummary } from "@/hooks/api/useHR";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function HrAttendanceReportsPage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.ATTENDANCE_READ]}>
      <HrAttendanceReportsContent />
    </ModuleGuard>
  );
}

function HrAttendanceReportsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const start = new Date();
  start.setDate(1);
  start.setMonth(start.getMonth() - 1);
  const end = new Date();
  const from = start.toISOString().slice(0, 10);
  const to = end.toISOString().slice(0, 10);
  const { data, isLoading, error, refetch } = useAttendanceSummary(from, to);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/attendance"))} leftIcon={<ArrowLeft />}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Rapports de presence</h1>
      </div>
      {isLoading && <Skeleton className="h-32 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
      {!isLoading && !error && data && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 mb-2">Periode: {from} → {to}</p>
            <ul className="space-y-2 text-sm">
              <li>Presents: {data.present ?? 0}</li>
              <li>Absents: {data.absent ?? 0}</li>
              <li>Retards: {data.late ?? 0}</li>
              <li>Maladie: {data.sick ?? 0}</li>
              <li>Distanciel: {data.remote ?? 0}</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
