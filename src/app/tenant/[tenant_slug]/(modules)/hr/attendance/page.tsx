"use client";

import React from "react";
import { useRouter } from "@/i18n/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useDailyAttendance, useClockIn, useEmployees } from "@/hooks/api/useHR";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import { Clock } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n-simple";

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
  const locale = useLocale();
  const t = useTranslations("hr");
  const tCommon = useTranslations("common");
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
          <h1 className="text-2xl font-bold">{t("timeTracking")}</h1>
          <p className="text-sm text-slate-500">{t("attendanceToday")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/hr/attendance/reports"))}>{tCommon("reports")}</Button>
      </div>
      <ProtectedAction permission={Permission.ATTENDANCE_CREATE}>
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">{t("clockInTitle")}</h2>
            <div className="flex gap-3 flex-wrap">
              <select className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-w-[200px] focus:outline-none focus:ring-2 focus:ring-emerald-500" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="">{t("employee")}</option>
                {empList.map((emp: { id: string; first_name?: string; last_name?: string }) => (
                  <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                ))}
              </select>
              <Button leftIcon={<Clock />} onClick={handleClockIn} disabled={!selectedId || clockIn.isPending}>{t("clockInButton")}</Button>
            </div>
          </CardContent>
        </Card>
      </ProtectedAction>
      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && <ErrorBanner message={tCommon("error")} onRetry={() => refetch()} />}
      {!isLoading && !error && (
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">{t("attendanceToday")}</h2>
            {list.length === 0 ? <p className="text-sm text-slate-500">{t("noAttendance")}</p> : (
              <ul className="space-y-2">
                {list.map((a: { id: string; clock_in?: string; clock_out?: string }) => (
                  <li key={a.id} className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span>{t("clockInLabel")}: {a.clock_in ? new Date(a.clock_in).toLocaleTimeString(locale) : "—"}</span>
                    <span>{t("clockOutLabel")}: {a.clock_out ? new Date(a.clock_out).toLocaleTimeString(locale) : "—"}</span>
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
