"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useQualityDocumentById, useApproveQualityDocument } from "@/hooks/api/useQuality";
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from "@/types/quality";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { formatDate } from "@/utils/formatters";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;
}

export default function QualityDocumentDetailPage() {
  return (
    <ModuleGuard module="quality" requiredPermissions={[Permission.QUALITY_DOCUMENTS_READ]}>
      <QualityDocumentDetailContent />
    </ModuleGuard>
  );
}

function QualityDocumentDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: doc, isLoading, error, refetch } = useQualityDocumentById(id);
  const approveDoc = useApproveQualityDocument();

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (error) return <ErrorBanner message="Document introuvable" onRetry={() => refetch()} />;
  if (!doc) return null;

  const canApprove = doc.status !== "approved" && doc.status !== "obsolete";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/quality/documents"))} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{doc.title ?? "Document"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default">{(DOCUMENT_TYPE_LABELS as Record<string, string>)[doc.type ?? ""] ?? doc.type}</Badge>
          <Badge variant={doc.status === "approved" ? "success" : "default"}>
            {(DOCUMENT_STATUS_LABELS as Record<string, string>)[doc.status ?? ""] ?? doc.status}
          </Badge>
          {canApprove && (
            <ProtectedAction permission={Permission.QUALITY_DOCUMENTS_UPDATE}>
              <Button
                size="sm"
                leftIcon={<CheckCircle className="w-4 h-4" />}
                onClick={() => approveDoc.mutate(id, { onSuccess: () => refetch() })}
                disabled={approveDoc.isPending}
              >
                Approuver
              </Button>
            </ProtectedAction>
          )}
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Détails</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {doc.description && <p><span className="font-medium text-slate-600 dark:text-slate-400">Description</span><br />{doc.description}</p>}
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Date d'effet</span> {doc.effectiveDate ? formatDate(doc.effectiveDate) : "—"}</p>
          <p><span className="font-medium text-slate-600 dark:text-slate-400">Date de révision</span> {doc.reviewDate ? formatDate(doc.reviewDate) : "—"}</p>
          {doc.content && <div><span className="font-medium text-slate-600 dark:text-slate-400">Contenu</span><div className="mt-2 whitespace-pre-wrap rounded bg-slate-50 dark:bg-slate-800/50 p-3">{doc.content}</div></div>}
        </CardContent>
      </Card>
    </div>
  );
}
