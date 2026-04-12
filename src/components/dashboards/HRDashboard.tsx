"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "@/lib/i18n-simple";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useEmployeeStats, usePendingLeaves, useDailyAttendance, useShiftSchedule } from "@/hooks/api/useHR";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonCard,
  BarChartWidget,
  PieChartWidget,
} from "@/components/ui";
import {
  Users,
  UserCheck,
  CalendarOff,
  ClipboardList,
  CalendarPlus,
  CheckSquare,
  Banknote,
  ArrowRight,
  Clock,
} from "lucide-react";

export function HRDashboard() {
  const t = useTranslations("dashboardHr");
  const locale = useLocale();
  const { buildPath } = useTenantPath();
  const { data: statsData, isLoading: loadingStats } = useEmployeeStats();
  const { data: leavesData, isLoading: loadingLeaves } = usePendingLeaves();
  const { data: attendanceData, isLoading: loadingAttendance } = useDailyAttendance();
  const today = new Date().toISOString().slice(0, 10);
  const { data: shiftsData, isLoading: loadingShifts } = useShiftSchedule(today, today);

  const isLoading = loadingStats || loadingLeaves || loadingAttendance || loadingShifts;

  const seriesPresent = t("chart.present");
  const seriesAbsent = t("chart.absent");
  const dayLabels = [
    t("days.mon"),
    t("days.tue"),
    t("days.wed"),
    t("days.thu"),
    t("days.fri"),
    t("days.sat"),
  ];
  const barWeekData = dayLabels.map((name) => ({
    name,
    [seriesPresent]: 0,
    [seriesAbsent]: 0,
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const stats = (statsData as any)?.data ?? statsData ?? {};
  const pendingLeaves = (leavesData as any)?.data ?? leavesData ?? [];
  const attendance = (attendanceData as any)?.data ?? attendanceData ?? [];
  const shifts = (shiftsData as any)?.data ?? shiftsData ?? [];

  const totalEmployees = stats.total ?? 0;
  const presentToday = Array.isArray(attendance) ? attendance.length : (stats.active ?? 0);
  const pendingLeavesCount = Array.isArray(pendingLeaves) ? pendingLeaves.length : 0;
  const upcomingShiftsCount = Array.isArray(shifts) ? shifts.length : 0;

  const kpis = [
    {
      title: t("kpis.totalEmployees"),
      value: totalEmployees.toString(),
      icon: Users,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: t("kpis.presentToday"),
      value: presentToday.toString(),
      icon: UserCheck,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      title: t("kpis.pendingLeaves"),
      value: pendingLeavesCount.toString(),
      icon: CalendarOff,
      color: pendingLeavesCount > 0
        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      title: t("kpis.scheduledShifts"),
      value: upcomingShiftsCount.toString(),
      icon: ClipboardList,
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
  ];

  const quickActions = [
    {
      title: t("quickActions.createShift.title"),
      description: t("quickActions.createShift.description"),
      icon: CalendarPlus,
      href: buildPath("/hr/shifts/new"),
    },
    {
      title: t("quickActions.approveLeaves.title"),
      description: t("quickActions.approveLeaves.description", { count: pendingLeavesCount }),
      icon: CheckSquare,
      href: buildPath("/hr/leaves"),
    },
    {
      title: t("quickActions.payroll.title"),
      description: t("quickActions.payroll.description"),
      icon: Banknote,
      href: buildPath("/hr/payroll"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{kpi.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          {t("quickActionsTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                    <action.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{action.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              {t("charts.weeklyAttendance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartWidget
              data={barWeekData}
              xKey="name"
              yKey={[seriesPresent, seriesAbsent]}
              colors={["#10b981", "#ef4444"]}
              height={260}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              {t("charts.leaveDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartWidget
              data={[
                { name: t("leavePie.pending"), value: pendingLeavesCount },
                { name: t("leavePie.approved"), value: 0 },
                { name: t("leavePie.rejected"), value: 0 },
              ]}
              dataKey="value"
              nameKey="name"
              height={260}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              {t("attendance.title")}
            </CardTitle>
            <Link
              href={buildPath("/hr/attendance")}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              {t("seeAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {Array.isArray(attendance) && attendance.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {attendance.slice(0, 5).map((entry: any, idx: number) => (
                <div key={entry.id ?? idx} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {entry.employeeName || entry.employee_name || t("employeeFallback", { n: idx + 1 })}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {entry.clockIn
                        ? new Date(entry.clockIn).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                      {entry.clockOut
                        ? ` — ${new Date(entry.clockOut).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}`
                        : entry.clockIn
                          ? ` ${t("attendance.inProgress")}`
                          : ""}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    entry.status === "present"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : entry.status === "late"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {entry.status === "present"
                      ? t("status.present")
                      : entry.status === "late"
                        ? t("status.late")
                        : entry.status ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UserCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("attendance.empty")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
