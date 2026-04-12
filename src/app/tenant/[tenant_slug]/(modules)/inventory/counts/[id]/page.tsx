"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useAuth } from "@/context/AuthContext";
import {
  useCountById,
  useStartCount,
  useSubmitCountLine,
  useCompleteCount,
  useApplyCountAdjustments,
  useCancelCount,
} from "@/hooks/api/useInventory";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  EmptyState,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import { ArrowLeft, ClipboardList, Play, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

const TYPE_LABELS: Record<string, string> = {
  full: "Complet",
  partial: "Partiel",
  cycle: "Cyclique",
  spot: "Ponctuel",
};

const STATUS_LABELS: Record<string, string> = {
  planned: "Planifié",
  in_progress: "En cours",
  submitted: "Soumis",
  completed: "Terminé",
  adjustments_applied: "Ajustements appliqués",
  cancelled: "Annulé",
};

interface CountLine {
  lineIndex?: number;
  productId?: string;
  productName?: string;
  barcode?: string;
  batchId?: string;
  batchNumber?: string;
  systemQuantity?: number;
  countedQuantity?: number;
  variance?: number;
}

function getCountData(c: any) {
  const lines = (c?.lines ?? c?.count_lines ?? []) as CountLine[];
  const type = c?.count_type ?? c?.type ?? "cycle";
  const status = c?.status ?? "planned";
  const locationName = c?.location_name ?? c?.locationId ?? "—";
  const scheduledDate = c?.scheduled_date ?? c?.scheduledDate;
  const startedAt = c?.started_at ?? c?.startedAt;
  const completedAt = c?.completed_at ?? c?.completedAt;
  return { lines, type, status, locationName, scheduledDate, startedAt, completedAt };
}

function formatDuration(start: string | undefined, end: string | undefined): string {
  if (!start) return "—";
  const a = new Date(start).getTime();
  const b = end ? new Date(end).getTime() : Date.now();
  const ms = Math.max(0, b - a);
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m} min ${s} s`;
}

export default function CountSessionPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.INVENTORY_COUNTS_READ]}>
      <CountSessionContent />
    </ModuleGuard>
  );
}

function CountSessionContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { buildPath } = useTenantPath();
  const { user } = useAuth();

  const { data: count, isLoading, error, refetch } = useCountById(id);
  const startMutation = useStartCount();
  const submitLineMutation = useSubmitCountLine();
  const completeMutation = useCompleteCount();
  const applyMutation = useApplyCountAdjustments();
  const cancelMutation = useCancelCount();

  const [countedByLine, setCountedByLine] = useState<Record<number, number>>({});

  const { lines, type, status, locationName, scheduledDate, startedAt, completedAt } = useMemo(
    () => getCountData(count),
    [count],
  );

  const completedLines = useMemo(
    () => lines.filter((l) => (l.countedQuantity ?? 0) >= 0 && l.countedQuantity !== undefined && l.countedQuantity !== null).length,
    [lines],
  );
  const totalLines = lines.length;
  const varianceSummary = useMemo(() => {
    let over = 0;
    let under = 0;
    lines.forEach((l) => {
      const v = l.variance ?? (l.countedQuantity ?? 0) - (l.systemQuantity ?? 0);
      if (v > 0) over += v;
      else if (v < 0) under += Math.abs(v);
    });
    return { over, under, total: over - under };
  }, [lines]);

  const handleStart = () => {
    startMutation.mutate(id, { onSuccess: () => refetch() });
  };

  const handleSubmitLine = (lineIndex: number, countedQuantity: number) => {
    submitLineMutation.mutate(
      { id, data: { lineIndex, countedQuantity, countedBy: user?.id ?? "" } },
      { onSuccess: () => { refetch(); setCountedByLine((prev) => ({ ...prev, [lineIndex]: countedQuantity })); } },
    );
  };

  const handleComplete = () => {
    completeMutation.mutate(id, { onSuccess: () => router.push(buildPath("/inventory/counts")) });
  };

  const handleApply = () => {
    applyMutation.mutate(id, { onSuccess: () => router.push(buildPath("/inventory/counts")) });
  };

  const handleCancel = () => {
    cancelMutation.mutate(id, { onSuccess: () => router.push(buildPath("/inventory/counts")) });
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error || !count) return <ErrorBanner message="Comptage introuvable" onRetry={() => refetch()} />;

  const canStart = status === "planned";
  const canSubmitLines = status === "in_progress";
  const canComplete = status === "in_progress" && totalLines > 0;
  const canApply = status === "completed";
  const canCancel = status === "planned" || status === "in_progress";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/counts"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Session de comptage</h1>
          <p className="text-sm text-slate-500">{TYPE_LABELS[type] ?? type} · {locationName}</p>
        </div>
      </div>

      {/* CountHeader */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              Comptage · {TYPE_LABELS[type] ?? type}
            </CardTitle>
            <Badge variant={status === "completed" || status === "adjustments_applied" ? "success" : status === "in_progress" ? "warning" : "info"}>
              {STATUS_LABELS[status] ?? status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Emplacement</span>
              <p className="font-medium">{locationName}</p>
            </div>
            <div>
              <span className="text-slate-500">Date planifiée</span>
              <p className="font-medium">{scheduledDate ? formatDateTime(scheduledDate) : "—"}</p>
            </div>
            <div>
              <span className="text-slate-500">Durée</span>
              <p className="font-medium">{formatDuration(startedAt, completedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Lignes complétées</span>
                <span>{completedLines} / {totalLines}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: totalLines ? `${(100 * completedLines) / totalLines}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VarianceSummary */}
      {totalLines > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Résumé des écarts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold">{varianceSummary.total >= 0 ? `+${varianceSummary.total}` : varianceSummary.total}</p>
                <p className="text-sm text-slate-500">Écart total</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-emerald-600">+{varianceSummary.over}</p>
                <p className="text-sm text-slate-500">Excédents</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-red-600">-{varianceSummary.under}</p>
                <p className="text-sm text-slate-500">Manquants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CountLinesList */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lignes à compter</CardTitle>
        </CardHeader>
        <CardContent>
          {lines.length === 0 ? (
            <EmptyState title="Aucune ligne" description="Démarrez le comptage pour charger les lignes ou aucune ligne n'est prévue." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2">Produit / Lot</th>
                    <th className="text-right py-2">Qté système</th>
                    <th className="text-right py-2">Qté comptée</th>
                    <th className="text-right py-2">Écart</th>
                    {canSubmitLines && <th className="w-24" />}
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, idx) => {
                    const lineIndex = line.lineIndex ?? idx;
                    const sysQty = line.systemQuantity ?? 0;
                    const counted = line.countedQuantity ?? countedByLine[lineIndex];
                    const variance = line.variance ?? (counted != null ? (counted as number) - sysQty : null);
                    return (
                      <tr key={lineIndex} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2">
                          <div className="font-medium">{line.productName ?? line.productId ?? "—"}</div>
                          {(line.batchNumber ?? line.batchId) && (
                            <div className="text-slate-500 text-xs">Lot: {line.batchNumber ?? line.batchId}</div>
                          )}
                        </td>
                        <td className="text-right py-2">{sysQty}</td>
                        <td className="text-right py-2">
                          {canSubmitLines ? (
                            <CountedInput
                              value={counted}
                              onSubmit={(q) => handleSubmitLine(lineIndex, q)}
                              disabled={submitLineMutation.isPending}
                            />
                          ) : (
                            counted ?? "—"
                          )}
                        </td>
                        <td className="text-right py-2">
                          {variance != null ? (
                            <span className={variance > 0 ? "text-emerald-600" : variance < 0 ? "text-red-600" : "text-slate-500"}>
                              {variance > 0 ? "+" : ""}{variance}
                            </span>
                          ) : "—"}
                        </td>
                        {canSubmitLines && <td />}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {canStart && (
          <Button onClick={handleStart} disabled={startMutation.isPending} leftIcon={<Play className="h-4 w-4" />}>
            Démarrer le comptage
          </Button>
        )}
        {canComplete && (
          <Button onClick={handleComplete} disabled={completeMutation.isPending} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
            Terminer le comptage
          </Button>
        )}
        {canApply && (
          <Button onClick={handleApply} disabled={applyMutation.isPending} leftIcon={<BarChart3 className="h-4 w-4" />}>
            Appliquer les ajustements
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

function CountedInput({
  value,
  onSubmit,
  disabled,
}: {
  value?: number;
  onSubmit: (q: number) => void;
  disabled?: boolean;
}) {
  const [v, setV] = useState(String(value ?? ""));
  const num = parseInt(v, 10);
  const valid = !isNaN(num) && num >= 0;

  return (
    <div className="flex items-center gap-1 justify-end">
      <input
        type="number"
        min={0}
        value={v}
        onChange={(e) => setV(e.target.value)}
        className="w-20 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-right text-sm"
      />
      <Button size="sm" disabled={!valid || disabled} onClick={() => valid && onSubmit(num)}>
        OK
      </Button>
    </div>
  );
}
