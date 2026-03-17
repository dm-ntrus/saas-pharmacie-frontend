"use client";

import React from "react";
import Link from "next/link";
import { useTenantPath } from "@/hooks/useTenantPath";
import {
  useQualityEvents,
  useCAPAs,
  useTrainingRecords,
  useQualityDashboard,
} from "@/hooks/api/useQuality";
import { formatDate } from "@/utils/formatters";
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
  ShieldAlert,
  AlertOctagon,
  GraduationCap,
  CalendarSearch,
  FilePlus,
  Eye,
  FileStack,
  ArrowRight,
  Activity,
} from "lucide-react";

export function QualityManagerDashboard() {
  const { buildPath } = useTenantPath();
  const { data: eventsData, isLoading: loadingEvents } = useQualityEvents({ status: "open", limit: 5 });
  const { data: capasData, isLoading: loadingCAPAs } = useCAPAs({ status: "open" });
  const { data: trainingData, isLoading: loadingTraining } = useTrainingRecords();
  const { data: dashboardData, isLoading: loadingDashboard } = useQualityDashboard();

  const isLoading = loadingEvents || loadingCAPAs || loadingTraining || loadingDashboard;

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

  const events = eventsData?.data ?? eventsData ?? [];
  const capas = capasData?.data ?? capasData ?? [];
  const training = trainingData?.data ?? trainingData ?? [];
  const dashboard = dashboardData?.data ?? dashboardData ?? {};

  const eventsList = Array.isArray(events) ? events : [];
  const capasList = Array.isArray(capas) ? capas : [];
  const trainingList = Array.isArray(training) ? training : [];

  const completedTraining = trainingList.filter((t: any) => t.status === "completed").length;
  const trainingCompliance = trainingList.length > 0
    ? Math.round((completedTraining / trainingList.length) * 100)
    : 100;

  const kpis = [
    {
      title: "Événements ouverts",
      value: (dashboard.openEvents ?? eventsList.length).toString(),
      icon: ShieldAlert,
      color: eventsList.length > 0
        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      title: "CAPAs en cours",
      value: (dashboard.pendingCAPAs ?? capasList.length).toString(),
      icon: AlertOctagon,
      color: capasList.length > 0
        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      title: "Conformité formation",
      value: `${trainingCompliance}%`,
      icon: GraduationCap,
      color: trainingCompliance >= 80
        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      title: "Audits à venir",
      value: (dashboard.upcomingAudits ?? 0).toString(),
      icon: CalendarSearch,
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
  ];

  const quickActions = [
    {
      title: "Créer événement",
      description: "Signaler un incident qualité",
      icon: FilePlus,
      href: buildPath("/quality/events/new"),
    },
    {
      title: "Voir CAPAs",
      description: `${capasList.length} action(s) corrective(s)`,
      icon: Eye,
      href: buildPath("/quality/capas"),
    },
    {
      title: "Gérer documents",
      description: "Procédures et formulaires",
      icon: FileStack,
      href: buildPath("/quality/documents"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
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

      {/* Actions rapides */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Actions rapides
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

      {/* Événements qualité récents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Événements qualité récents
            </CardTitle>
            <Link
              href={buildPath("/quality/events")}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {eventsList.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {eventsList.slice(0, 5).map((event: any, idx: number) => (
                <div key={event.id ?? idx} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {event.title || event.description || `Événement #${idx + 1}`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {event.type ? event.type.replace(/_/g, " ") : "—"}
                      {event.created_at ? ` — ${formatDate(event.created_at)}` : ""}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    event.severity === "critical"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : event.severity === "major"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    {event.severity === "critical" ? "Critique" :
                     event.severity === "major" ? "Majeur" :
                     event.severity === "minor" ? "Mineur" : event.severity ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShieldAlert className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Aucun événement qualité ouvert
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
