"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "@/lib/i18n-simple";
import { useTenantPath } from "@/hooks/useTenantPath";
import { usePatientSummary } from "@/hooks/api/usePatients";
import { formatDate } from "@/utils/formatters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonCard,
} from "@/components/ui";
import {
  FileText,
  CalendarClock,
  ShoppingBag,
  Syringe,
  Eye,
  ArrowRight,
  Pill,
} from "lucide-react";

export function PatientDashboard() {
  const t = useTranslations("dashboardPatient");
  const { buildPath } = useTenantPath();
  const { data: summaryData, isLoading } = usePatientSummary();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonCard />
      </div>
    );
  }

  const summary = (summaryData as any)?.data ?? summaryData ?? {};

  const activePrescriptions = summary.activePrescriptions ?? summary.active_prescriptions ?? 0;
  const upcomingAppointments = summary.upcomingAppointments ?? summary.upcoming_appointments ?? 0;
  const recentPurchases = summary.recentPurchases ?? summary.recent_purchases ?? 0;
  const prescriptions = summary.prescriptions ?? [];
  const prescriptionsList = Array.isArray(prescriptions) ? prescriptions : [];

  const kpis = [
    {
      title: t("kpis.activePrescriptions"),
      value: activePrescriptions.toString(),
      icon: FileText,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: t("kpis.upcomingAppointments"),
      value: upcomingAppointments.toString(),
      icon: CalendarClock,
      color: upcomingAppointments > 0
        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      title: t("kpis.recentPurchases"),
      value: recentPurchases.toString(),
      icon: ShoppingBag,
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
  ];

  const quickActions = [
    {
      title: t("quickActions.myPrescriptions.title"),
      description: t("quickActions.myPrescriptions.description"),
      icon: Eye,
      href: buildPath("/prescriptions"),
    },
    {
      title: t("quickActions.vaccination.title"),
      description: t("quickActions.vaccination.description"),
      icon: Syringe,
      href: buildPath("/vaccination"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Actions rapides */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          {t("quickActionsTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* Historique ordonnances */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-600" />
              {t("history.title")}
            </CardTitle>
            <Link
              href={buildPath("/prescriptions")}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              {t("seeAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {prescriptionsList.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {prescriptionsList.slice(0, 5).map((rx: any, idx: number) => (
                <div key={rx.id ?? idx} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {rx.doctorName || rx.doctor_name || t("history.prescriptionFallback", { n: idx + 1 })}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(rx.date)}
                      {rx.itemCount ? ` — ${t("history.medicationCount", { count: rx.itemCount })}` : ""}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    rx.status === "active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : rx.status === "expired"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {rx.status === "active" ? t("status.active") :
                     rx.status === "expired" ? t("status.expired") :
                     rx.status === "dispensed" ? t("status.dispensed") : rx.status ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("history.empty")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
