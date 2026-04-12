"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useBatchRecalls,
  useCreateBatchRecall,
  useActivateRecall,
  useCompleteRecall,
} from "@/hooks/api/useInventory";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Modal,
  EmptyState,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import {
  ArrowLeft,
  ShieldAlert,
  Plus,
  Search,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Package,
} from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

type RecallStatus = "draft" | "active" | "completed" | "cancelled";
type RecallSeverity = "class_i" | "class_ii" | "class_iii";

interface BatchRecall {
  id: string;
  product_name: string;
  batch_numbers: string[];
  reason: string;
  severity: RecallSeverity;
  status: RecallStatus;
  created_at: string;
  completed_at?: string;
  notes?: string;
}

const STATUS_LABELS: Record<RecallStatus, string> = {
  draft: "Brouillon",
  active: "Actif",
  completed: "Clôturé",
  cancelled: "Annulé",
};

const STATUS_BADGE: Record<RecallStatus, "default" | "danger" | "success" | "warning"> = {
  draft: "default",
  active: "danger",
  completed: "success",
  cancelled: "warning",
};

const SEVERITY_LABELS: Record<RecallSeverity, string> = {
  class_i: "Classe I",
  class_ii: "Classe II",
  class_iii: "Classe III",
};

const SEVERITY_BADGE: Record<RecallSeverity, "danger" | "warning" | "info"> = {
  class_i: "danger",
  class_ii: "warning",
  class_iii: "info",
};

const SEVERITY_DESCRIPTIONS: Record<RecallSeverity, string> = {
  class_i: "Risque grave pour la santé",
  class_ii: "Risque modéré",
  class_iii: "Peu de risque pour la santé",
};

const ALL_STATUSES: RecallStatus[] = ["draft", "active", "completed", "cancelled"];
const ALL_SEVERITIES: RecallSeverity[] = ["class_i", "class_ii", "class_iii"];

export default function BatchRecallsPage() {
  return (
    <ModuleGuard
      module="inventory"
      requiredPermissions={[Permission.PRODUCT_BATCHES_READ]}
    >
      <RecallsContent />
    </ModuleGuard>
  );
}

function RecallsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RecallStatus | "">("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const recallsQuery = useBatchRecalls({
    status: statusFilter || undefined,
    limit: 50,
  });
  const data = recallsQuery.data as any;
  const isLoading = recallsQuery.isLoading;
  const error = recallsQuery.error as any;
  const refetch = recallsQuery.refetch;

  const activateMutation = useActivateRecall();
  const completeMutation = useCompleteRecall();

  const recalls: BatchRecall[] = (data?.data ?? []) as BatchRecall[];

  const filtered = recalls.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.product_name.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q) ||
      r.batch_numbers.some((b) => b.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/inventory"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Rappels de lots
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gérez les rappels de produits et lots défectueux
            </p>
          </div>
        </div>
        <ProtectedAction permission={Permission.PRODUCT_BATCHES_CREATE}>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Nouveau rappel
          </Button>
        </ProtectedAction>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par produit, lot ou motif..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={statusFilter === "" ? "info" : "default"}
            className="cursor-pointer"
            onClick={() => setStatusFilter("")}
          >
            Tous
          </Badge>
          {ALL_STATUSES.map((s) => (
            <Badge
              key={s}
              variant={statusFilter === s ? "info" : "default"}
              className="cursor-pointer"
              onClick={() => setStatusFilter(s)}
            >
              {STATUS_LABELS[s]}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Brouillons"
          value={recalls.filter((r) => r.status === "draft").length}
          color="text-slate-600"
        />
        <StatCard
          label="Actifs"
          value={recalls.filter((r) => r.status === "active").length}
          color="text-red-600"
        />
        <StatCard
          label="Clôturés"
          value={recalls.filter((r) => r.status === "completed").length}
          color="text-green-600"
        />
        <StatCard
          label="Classe I"
          value={recalls.filter((r) => r.severity === "class_i").length}
          color="text-red-600"
        />
      </div>

      {/* Recalls List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner
          message="Impossible de charger les rappels"
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ShieldAlert className="w-8 h-8 text-slate-400" />}
          title="Aucun rappel"
          description={
            search || statusFilter
              ? "Aucun résultat pour ces filtres."
              : "Aucun rappel de lot enregistré."
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((recall) => (
            <Card
              key={recall.id}
              className={
                recall.severity === "class_i" && recall.status === "active"
                  ? "border-red-300 dark:border-red-700"
                  : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      recall.severity === "class_i"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : recall.severity === "class_ii"
                          ? "bg-amber-100 dark:bg-amber-900/30"
                          : "bg-blue-50 dark:bg-blue-900/20"
                    }`}
                  >
                    <ShieldAlert
                      className={`w-5 h-5 ${
                        recall.severity === "class_i"
                          ? "text-red-600"
                          : recall.severity === "class_ii"
                            ? "text-amber-600"
                            : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {recall.product_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {recall.reason}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant={STATUS_BADGE[recall.status]} size="sm">
                        {STATUS_LABELS[recall.status]}
                      </Badge>
                      <Badge variant={SEVERITY_BADGE[recall.severity]} size="sm">
                        {SEVERITY_LABELS[recall.severity]}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {recall.batch_numbers.length} lot(s)
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDateTime(recall.created_at)}
                      </span>
                    </div>
                    {recall.batch_numbers.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {recall.batch_numbers.map((bn) => (
                          <span
                            key={bn}
                            className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded"
                          >
                            {bn}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0 flex-wrap">
                    {recall.status === "draft" && (
                      <ProtectedAction permission={Permission.PRODUCT_BATCHES_UPDATE}>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Zap className="w-3 h-3" />}
                          onClick={() => activateMutation.mutate(recall.id)}
                          loading={activateMutation.isPending}
                        >
                          Activer
                        </Button>
                      </ProtectedAction>
                    )}
                    {recall.status === "active" && (
                      <ProtectedAction permission={Permission.PRODUCT_BATCHES_UPDATE}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<CheckCircle2 className="w-3 h-3" />}
                          onClick={() => completeMutation.mutate(recall.id)}
                          loading={completeMutation.isPending}
                        >
                          Clôturer
                        </Button>
                      </ProtectedAction>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateRecallModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}

function CreateRecallModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createMutation = useCreateBatchRecall();
  const [productName, setProductName] = useState("");
  const [batchNumbers, setBatchNumbers] = useState("");
  const [reason, setReason] = useState("");
  const [severity, setSeverity] = useState<RecallSeverity>("class_ii");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        product_name: productName,
        batch_numbers: batchNumbers
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
        reason,
        severity,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setProductName("");
          setBatchNumbers("");
          setReason("");
          setSeverity("class_ii");
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Nouveau rappel de lot"
      description="Enregistrez un rappel pour un produit défectueux"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom du produit"
          placeholder="Ex: Paracétamol 500mg"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <Input
          label="Numéros de lots"
          placeholder="LOT-001, LOT-002 (séparés par des virgules)"
          value={batchNumbers}
          onChange={(e) => setBatchNumbers(e.target.value)}
          required
          helperText="Séparez les numéros de lots par des virgules"
        />
        <Input
          label="Motif du rappel"
          placeholder="Ex: Contamination détectée lors du contrôle qualité"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Sévérité <span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="space-y-2">
            {ALL_SEVERITIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeverity(s)}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${
                  severity === s
                    ? s === "class_i"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600"
                      : s === "class_ii"
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-600"
                        : "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    severity === s
                      ? s === "class_i"
                        ? "text-red-700 dark:text-red-400"
                        : s === "class_ii"
                          ? "text-amber-700 dark:text-amber-400"
                          : "text-blue-700 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {SEVERITY_LABELS[s]}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {SEVERITY_DESCRIPTIONS[s]}
                </p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={createMutation.isPending}
          >
            Créer le rappel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
