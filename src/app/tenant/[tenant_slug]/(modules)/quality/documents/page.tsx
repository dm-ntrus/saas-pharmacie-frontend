"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useQualityDocuments } from "@/hooks/api/useQuality";
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from "@/types/quality";
import { Button, Card, CardContent, Badge, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { Plus, FileText, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/formatters";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function QualityDocumentsPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_DOCUMENTS_READ]}>
      <QualityDocumentsContent />
    </ModuleGuard>
  );
}

function QualityDocumentsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const params: Record<string, string> = {};
  if (typeFilter) params.type = typeFilter;
  if (statusFilter) params.status = statusFilter;
  const { data: documents = [], isLoading, error, refetch } = useQualityDocuments(params);
  const list = Array.isArray(documents) ? documents : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents qualité</h1>
          <p className="text-sm text-slate-500 mt-1">Procédures, instructions, formulaires</p>
        </div>
        <ProtectedAction permission={Permission.QUALITY_DOCUMENTS_CREATE}>
          <Button leftIcon={<Plus />} onClick={() => router.push(buildPath("/quality/documents/new"))}>
            Nouveau document
          </Button>
        </ProtectedAction>
      </div>
      <div className="flex flex-wrap gap-2">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
          <option value="">Tous les types</option>
          {Object.entries(DOCUMENT_TYPE_LABELS).map(([t, label]) => <option key={t} value={t}>{label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
          <option value="">Tous les statuts</option>
          {Object.entries(DOCUMENT_STATUS_LABELS).map(([s, label]) => <option key={s} value={s}>{label}</option>)}
        </select>
      </div>
      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && <ErrorBanner message="Erreur" onRetry={() => refetch()} />}
      {!isLoading && !error && list.length === 0 && (
        <EmptyState title="Aucun document" description="Aucun document qualité." onAction={() => router.push(buildPath("/quality/documents/new"))} actionLabel="Nouveau document" />
      )}
      {!isLoading && !error && list.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100">
              {list.map((d: { id: string; title?: string; type?: string; status?: string; effectiveDate?: string; reviewDate?: string }) => (
                <li key={d.id}>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50"
                    onClick={() => router.push(buildPath("/quality/documents/" + safeId(d.id)))}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium truncate">{d.title ?? d.id}</p>
                        <p className="text-sm text-slate-500">
                          {(DOCUMENT_TYPE_LABELS as Record<string, string>)[d.type ?? ""] ?? d.type} - {d.effectiveDate ? formatDate(d.effectiveDate) : "-"}
                        </p>
                      </div>
                    </div>
                    <Badge size="sm">{(DOCUMENT_STATUS_LABELS as Record<string, string>)[d.status ?? ""] ?? d.status}</Badge>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
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
