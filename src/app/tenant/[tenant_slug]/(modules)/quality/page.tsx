"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useQualityDashboard,
  useCheckOverdueCAPAs,
  useCheckDocumentReviews,
} from "@/hooks/api/useQuality";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import {
  AlertTriangle,
  FileText,
  ClipboardCheck,
  BookOpen,
  BarChart3,
  GraduationCap,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { QUALITY_EVENT_SEVERITY_LABELS } from "@/types/quality";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function QualityDashboardPage() {
  return (
    <ModuleGuard
      module="quality"
      requiredPermissions={[Permission.QUALITY_EVENTS_READ]}
    >
      <QualityDashboardContent />
    </ModuleGuard>
  );
}

function QualityDashboardContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: dashboard, isLoading, error, refetch } = useQualityDashboard();
  const checkOverdue = useCheckOverdueCAPAs();
  const checkReviews = useCheckDocumentReviews();

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
      <ErrorBanner message="Erreur de chargement du dashboard" onRetry={() => refetch()} />
    );
  }

  const d = dashboard ?? {};
  const openEvents = Number(d.openQualityEvents ?? d.totalQualityEvents ?? 0);
  const activeCAPAs = Number(d.activeCAPAs ?? 0);
  const approvedDocs = Number(d.approvedDocuments ?? 0);
  const pendingTraining = Number(d.pendingTrainings ?? 0);
  const recentEvents = Array.isArray(d.recentEvents) ? d.recentEvents : [];
  const upcomingCAPAs = Array.isArray(d.upcomingCAPAs) ? d.upcomingCAPAs : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Qualité
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dashboard qualité et conformité
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => checkOverdue.mutate()}
            disabled={checkOverdue.isPending}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Vérifier CAPAs en retard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => checkReviews.mutate()}
            disabled={checkReviews.isPending}
          >
            Vérifier révisions docs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(buildPath("/quality/events"))}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{openEvents}</p>
              <p className="text-xs text-slate-500">Événements ouverts</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(buildPath("/quality/capas"))}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{activeCAPAs}</p>
              <p className="text-xs text-slate-500">CAPAs actives</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(buildPath("/quality/documents"))}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{approvedDocs}</p>
              <p className="text-xs text-slate-500">Documents approuvés</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(buildPath("/quality/training"))}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{pendingTraining}</p>
              <p className="text-xs text-slate-500">Formations à planifier</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Événements récents
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(buildPath("/quality/events"))}
              >
                Voir tout
              </Button>
            </div>
            {recentEvents.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun événement récent</p>
            ) : (
              <ul className="space-y-2">
                {recentEvents.slice(0, 5).map((e: any) => (
                  <li key={e.id}>
                    <button
                      className="text-left w-full flex items-center justify-between gap-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      onClick={() =>
                        router.push(buildPath(`/quality/events/${safeId(e.id)}`))
                      }
                    >
                      <span className="text-sm font-medium truncate">{e.title ?? e.id}</span>
                      <span className="text-xs text-slate-500 shrink-0">
                        {QUALITY_EVENT_SEVERITY_LABELS[
                          e.severity as keyof typeof QUALITY_EVENT_SEVERITY_LABELS
                        ] ?? e.severity}{" "}
                        · {e.reportedAt ? formatDate(e.reportedAt) : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                CAPAs à venir
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(buildPath("/quality/capas"))}
              >
                Voir tout
              </Button>
            </div>
            {upcomingCAPAs.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune CAPA à échéance</p>
            ) : (
              <ul className="space-y-2">
                {upcomingCAPAs.slice(0, 5).map((c: any) => (
                  <li key={c.id}>
                    <button
                      className="text-left w-full flex items-center justify-between gap-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      onClick={() =>
                        router.push(buildPath(`/quality/capas/${safeId(c.id)}`))
                      }
                    >
                      <span className="text-sm font-medium truncate">{c.title ?? c.id}</span>
                      <span className="text-xs text-slate-500 shrink-0">
                        {c.dueDate ? formatDate(c.dueDate) : ""}
                        {c.daysUntilDue != null ? ` (J${c.daysUntilDue})` : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/quality/events/new"))}
          leftIcon={<AlertTriangle className="w-4 h-4" />}
        >
          Signaler un événement
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/quality/documents"))}
          leftIcon={<FileText className="w-4 h-4" />}
        >
          Documents
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/quality/metrics"))}
          leftIcon={<BarChart3 className="w-4 h-4" />}
        >
          Métriques
        </Button>
      </div>
    </div>
  );
}
