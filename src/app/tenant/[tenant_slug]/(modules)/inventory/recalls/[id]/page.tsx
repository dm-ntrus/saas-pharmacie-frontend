"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useRecallById, useActivateRecall, useCompleteRecall, useCancelRecall } from "@/hooks/api/useInventory";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, AlertTriangle, Play, CheckCircle2, XCircle } from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

const RECALL_TYPE_LABELS: Record<string, string> = {
  voluntary: "Volontaire",
  mandatory: "Obligatoire",
  market_withdrawal: "Retrait de marché",
};

const RISK_LABELS: Record<string, string> = {
  class_i: "Classe I",
  class_ii: "Classe II",
  class_iii: "Classe III",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  active: "Actif",
  completed: "Clôturé",
  cancelled: "Annulé",
};

export default function RecallDetailPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.BATCH_RECALLS_READ]}>
      <RecallDetailContent />
    </ModuleGuard>
  );
}

function RecallDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { buildPath } = useTenantPath();

  const { data: recall, isLoading, error, refetch } = useRecallById(id);
  const activateMutation = useActivateRecall();
  const completeMutation = useCompleteRecall();
  const cancelMutation = useCancelRecall();

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !recall) return <ErrorBanner message="Rappel introuvable" onRetry={() => refetch()} />;

  const status = recall.status ?? recall.recall_status;
  const productName = recall.productName ?? recall.product_name ?? recall.productId ?? "—";
  const batchNumber = recall.batchNumber ?? recall.batch_number ?? recall.batchId ?? "—";
  const reason = recall.reason ?? recall.recall_reason ?? "—";
  const riskLevel = recall.riskLevel ?? recall.risk_level ?? recall.recall_risk_level;
  const instructions = recall.instructions ?? recall.recall_instructions ?? "";
  const description = recall.description ?? "";
  const issuedBy = recall.issuedBy ?? recall.issued_by ?? "—";
  const issuedAt = recall.issuedAt ?? recall.issued_at ?? recall.created_at;
  const recallType = recall.recallType ?? recall.recall_type;

  const canActivate = status === "draft";
  const canComplete = status === "active";
  const canCancel = status === "draft" || status === "active";

  const handleActivate = () => {
    activateMutation.mutate(id, { onSuccess: () => refetch() });
  };
  const handleComplete = () => {
    completeMutation.mutate(id, { onSuccess: () => router.push(buildPath("/inventory/recalls")) });
  };
  const handleCancel = () => {
    cancelMutation.mutate(id, { onSuccess: () => router.push(buildPath("/inventory/recalls")) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/recalls"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Détail du rappel</h1>
          <p className="text-sm text-slate-500">{productName} · Lot {batchNumber}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Rappel de lot
            </CardTitle>
            <Badge
              variant={
                status === "completed" ? "success" : status === "cancelled" ? "danger" : status === "active" ? "warning" : "default"
              }
            >
              {STATUS_LABELS[status] ?? status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Produit</span>
              <p className="font-medium">{productName}</p>
            </div>
            <div>
              <span className="text-slate-500">Lot</span>
              <p className="font-medium">{batchNumber}</p>
            </div>
            <div>
              <span className="text-slate-500">Type</span>
              <p className="font-medium">{RECALL_TYPE_LABELS[recallType] ?? recallType}</p>
            </div>
            <div>
              <span className="text-slate-500">Niveau de risque</span>
              <p className="font-medium">{RISK_LABELS[riskLevel] ?? riskLevel}</p>
            </div>
            <div>
              <span className="text-slate-500">Raison</span>
              <p className="font-medium">{reason}</p>
            </div>
            <div>
              <span className="text-slate-500">Émis par / le</span>
              <p className="font-medium">{issuedBy} {issuedAt ? ` · ${formatDateTime(issuedAt)}` : ""}</p>
            </div>
          </div>
          {description && (
            <div>
              <span className="text-slate-500 text-sm">Description</span>
              <p className="text-sm mt-1">{description}</p>
            </div>
          )}
          {instructions && (
            <div>
              <span className="text-slate-500 text-sm">Instructions</span>
              <p className="text-sm mt-1 whitespace-pre-wrap">{instructions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {canActivate && (
          <Button onClick={handleActivate} disabled={activateMutation.isPending} leftIcon={<Play className="h-4 w-4" />}>
            Activer le rappel
          </Button>
        )}
        {canComplete && (
          <Button onClick={handleComplete} disabled={completeMutation.isPending} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
            Clôturer le rappel
          </Button>
        )}
        {canCancel && (
          <Button variant="outline" onClick={handleCancel} disabled={cancelMutation.isPending} leftIcon={<XCircle className="h-4 w-4" />}>
            Annuler
          </Button>
        )}
      </div>
    </div>
  );
}
