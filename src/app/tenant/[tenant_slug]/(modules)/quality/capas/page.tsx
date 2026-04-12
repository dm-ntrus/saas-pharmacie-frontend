"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useCAPAs } from "@/hooks/api/useQuality";
import { CAPA_TYPE_LABELS, CAPA_STATUS_LABELS } from "@/types/quality";
import { Button, Card, CardContent, Badge, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { Plus, ClipboardCheck, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/formatters";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function QualityCAPAsPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_CAPAS_READ]}>
      <QualityCAPAsContent />
    </ModuleGuard>
  );
}

function QualityCAPAsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const params: Record<string, string> = {};
  if (typeFilter) params.type = typeFilter;
  if (statusFilter) params.status = statusFilter;
  const { data: capas = [], isLoading, error, refetch } = useCAPAs(params);
  const list = Array.isArray(capas) ? capas : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">CAPAs</h1>
          <p className="text-sm text-slate-500 mt-1">Actions correctives et préventives</p>
        </div>
        <ProtectedAction permission={Permission.QUALITY_CAPAS_CREATE}>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => router.push(buildPath("/quality/capas/new"))}>
            Nouvelle CAPA
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
          {Object.entries(CAPA_TYPE_LABELS).map(([t, label]) => (
            <option key={t} value={t}>{label}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          {Object.entries(CAPA_STATUS_LABELS).map(([s, label]) => (
            <option key={s} value={s}>{label}</option>
          ))}
        </select>
      </div>
      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur de chargement" onRetry={() => refetch()} />}
      {!isLoading && !error && list.length === 0 && (
        <EmptyState
          title="Aucune CAPA"
          description="Aucune action corrective ou préventive."
          onAction={() => router.push(buildPath("/quality/capas/new"))}
          actionLabel="Nouvelle CAPA"
        />
      )}
      {!isLoading && !error && list.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {list.map((c: { id: string; title?: string; type?: string; assignedTo?: string; dueDate?: string; status?: string }) => (
                <li key={c.id}>
                  <button
                    className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    onClick={() => router.push(buildPath("/quality/capas/" + safeId(c.id)))}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <ClipboardCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{c.title ?? c.id}</p>
                        <p className="text-sm text-slate-500">
                          {(CAPA_TYPE_LABELS as Record<string, string>)[c.type ?? ""] ?? c.type} - {c.assignedTo ?? "-"} - Echeance {c.dueDate ? formatDate(c.dueDate) : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="default" size="sm">{(CAPA_STATUS_LABELS as Record<string, string>)[c.status ?? ""] ?? c.status}</Badge>
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
