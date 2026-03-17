"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useDailyAttendance, useClockIn, useEmployees } from "@/hooks/api/useHR";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import { Clock } from "lucide-react";

export default function HrAttendancePage() {
  return (
    <ModuleGuard module="hr" requiredPermissions={[Permission.ATTENDANCE_READ]}>
      <HrAttendanceContent />
    </ModuleGuard>
  );
}

function HrAttendanceContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const date = new Date().toISOString().slice(0, 10);
  const { data: attendance = [], isLoading, error, refetch } = useDailyAttendance(date);
  const { data: employees = [] } = useEmployees({ status: "active" });
  const clockIn = useClockIn();
  const list = Array.isArray(attendance) ? attendance : [];
  const empList = Array.isArray(employees) ? employees : [];
  const [selectedId, setSelectedId] = React.useState("");

  const handleClockIn = () => {
    if (!selectedId) return;
    const id = selectedId.includes(":") ? selectedId.split(":")[1] : selectedId;
    clockIn.mutate({ employeeId: id }, { onSuccess: () => refetch() });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pointage</h1>
          <p className="text-sm text-slate-500">Presence du jour</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/attendance/reports"))}>Rapports</Button>
      </div>
      <ProtectedAction permission={Permission.ATTENDANCE_CREATE}>
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Pointer une entree</h2>
            <div className="flex gap-3 flex-wrap">
              <select className="rounded-lg border px-3 py-2 text-sm min-w-[200px]" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="">Employe</option>
                {empList.map((emp: { id: string; first_name?: string; last_name?: string }) => (
                  <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                ))}
              </select>
              <Button leftIcon={<Clock />} onClick={handleClockIn} disabled={!selectedId || clockIn.isPending}>Pointer entree</Button>
            </div>
          </CardContent>
        </Card>
      </ProtectedAction>
      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
      {!isLoading && !error && (
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Presences du jour</h2>
            {list.length === 0 ? <p className="text-sm text-slate-500">Aucun pointage.</p> : (
              <ul className="space-y-2">
                {list.map((a: { id: string; clock_in?: string; clock_out?: string }) => (
                  <li key={a.id} className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span>Entree: {a.clock_in ? new Date(a.clock_in).toLocaleTimeString("fr-FR") : "—"}</span>
                    <span>Sortie: {a.clock_out ? new Date(a.clock_out).toLocaleTimeString("fr-FR") : "—"}</span>
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
