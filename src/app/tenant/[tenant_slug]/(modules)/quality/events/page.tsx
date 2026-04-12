"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useQualityEvents } from "@/hooks/api/useQuality";
import {
  QUALITY_EVENT_TYPE_LABELS,
  QUALITY_EVENT_STATUS_LABELS,
  QUALITY_EVENT_SEVERITY_LABELS,
  type QualityEventType,
  type QualityEventStatus,
  type QualityEventSeverity,
} from "@/types/quality";
import { Button, Card, CardContent, Badge, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { Plus, AlertTriangle, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/formatters";

const SEVERITY_VARIANT: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "default",
};

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function QualityEventsPage() {
  return (
    <ModuleGuard
      module="quality"
      requiredPermissions={[Permission.QUALITY_EVENTS_READ]}
    >
      <QualityEventsContent />
    </ModuleGuard>
  );
}

function QualityEventsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("");

  const params: Record<string, string> = {};
  if (typeFilter) params.type = typeFilter;
  if (statusFilter) params.status = statusFilter;
  if (severityFilter) params.severity = severityFilter;

  const { data: events = [], isLoading, error, refetch } = useQualityEvents(params);

  const list = Array.isArray(events) ? events : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Événements qualité
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Signaler et suivre les écarts, réclamations, incidents
          </p>
        </div>
        <ProtectedAction permission={Permission.QUALITY_EVENTS_CREATE}>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => router.push(buildPath("/quality/events/new"))}
          >
            Signaler un événement
          </Button>
        </ProtectedAction>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Tous les types</option>
          {(Object.keys(QUALITY_EVENT_TYPE_LABELS) as QualityEventType[]).map((t) => (
            <option key={t} value={t}>
              {QUALITY_EVENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          {(Object.keys(QUALITY_EVENT_STATUS_LABELS) as QualityEventStatus[]).map((s) => (
            <option key={s} value={s}>
              {QUALITY_EVENT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="">Toutes sévérités</option>
          {(Object.keys(QUALITY_EVENT_SEVERITY_LABELS) as QualityEventSeverity[]).map((s) => (
            <option key={s} value={s}>
              {QUALITY_EVENT_SEVERITY_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full rounded-lg" />
      ) : error ? (
        <ErrorBanner message="Erreur de chargement" onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState
          title="Aucun événement"
          description="Aucun événement qualité pour les critères sélectionnés."
          onAction={() => router.push(buildPath("/quality/events/new"))}
          actionLabel="Signaler un événement"
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {list.map((e: any) => (
                <li key={e.id}>
                  <button
                    className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    onClick={() =>
                      router.push(buildPath(`/quality/events/${safeId(e.id)}`))
                    }
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {e.title ?? e.event_number ?? e.id}
                        </p>
                        <p className="text-sm text-slate-500">
                          {QUALITY_EVENT_TYPE_LABELS[
                            e.type as keyof typeof QUALITY_EVENT_TYPE_LABELS
                          ] ?? e.type}{" "}
                          · {e.reportedBy ?? "—"} ·{" "}
                          {e.occurredAt ? formatDate(e.occurredAt) : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={SEVERITY_VARIANT[e.severity] ?? "default"} size="sm">
                        {QUALITY_EVENT_SEVERITY_LABELS[
                          e.severity as keyof typeof QUALITY_EVENT_SEVERITY_LABELS
                        ] ?? e.severity}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {QUALITY_EVENT_STATUS_LABELS[
                          e.status as keyof typeof QUALITY_EVENT_STATUS_LABELS
                        ] ?? e.status}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
