"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useInventoryCounts,
  useCreateInventoryCount,
  useStartCount,
  useCompleteCount,
  useApplyCountAdjustments,
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
  ClipboardList,
  Plus,
  Search,
  Play,
  CheckCircle2,
  Settings2,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

type CountStatus = "planned" | "in_progress" | "completed" | "cancelled";
type CountType = "full" | "cycle" | "spot";

interface InventoryCount {
  id: string;
  count_type: CountType;
  status: CountStatus;
  scheduled_date: string;
  completed_date?: string;
  items_counted: number;
  items_total: number;
  discrepancy_count: number;
  created_at: string;
  notes?: string;
}

const STATUS_LABELS: Record<CountStatus, string> = {
  planned: "Planifié",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

const STATUS_BADGE: Record<CountStatus, "default" | "info" | "warning" | "success" | "danger"> = {
  planned: "info",
  in_progress: "warning",
  completed: "success",
  cancelled: "danger",
};

const TYPE_LABELS: Record<CountType, string> = {
  full: "Complet",
  cycle: "Cyclique",
  spot: "Ponctuel",
};

const TYPE_BADGE: Record<CountType, "default" | "primary" | "info"> = {
  full: "primary",
  cycle: "info",
  spot: "default",
};

const ALL_STATUSES: CountStatus[] = ["planned", "in_progress", "completed", "cancelled"];
const ALL_TYPES: CountType[] = ["full", "cycle", "spot"];

export default function InventoryCountsPage() {
  return (
    <ModuleGuard
      module="inventory"
      requiredPermissions={[Permission.INVENTORY_COUNTS_READ]}
    >
      <CountsContent />
    </ModuleGuard>
  );
}

function CountsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CountStatus | "">("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, error, refetch } = useInventoryCounts({
    status: statusFilter || undefined,
    limit: 50,
  });

  const startMutation = useStartCount();
  const completeMutation = useCompleteCount();
  const adjustMutation = useApplyCountAdjustments();

  const counts: InventoryCount[] = data?.data ?? [];

  const filtered = counts.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      TYPE_LABELS[c.count_type].toLowerCase().includes(q)
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
              Comptages d&apos;inventaire
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Planifiez et suivez vos comptages de stock
            </p>
          </div>
        </div>
        <ProtectedAction permission={Permission.INVENTORY_COUNTS_CREATE}>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Nouveau comptage
          </Button>
        </ProtectedAction>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un comptage..."
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
        {ALL_STATUSES.map((s) => (
          <StatCard
            key={s}
            label={STATUS_LABELS[s]}
            value={counts.filter((c) => c.status === s).length}
            color={
              s === "in_progress"
                ? "text-amber-600"
                : s === "completed"
                  ? "text-green-600"
                  : s === "cancelled"
                    ? "text-red-600"
                    : "text-blue-600"
            }
          />
        ))}
      </div>

      {/* Count List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner
          message="Impossible de charger les comptages"
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-8 h-8 text-slate-400" />}
          title="Aucun comptage"
          description={
            search || statusFilter
              ? "Aucun résultat pour ces filtres."
              : "Planifiez votre premier comptage d'inventaire."
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((count) => (
            <Card key={count.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Comptage {TYPE_LABELS[count.count_type].toLowerCase()}
                      </span>
                      <Badge variant={TYPE_BADGE[count.count_type]} size="sm">
                        {TYPE_LABELS[count.count_type]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <Badge variant={STATUS_BADGE[count.status]} size="sm">
                        {STATUS_LABELS[count.status]}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {count.items_counted}/{count.items_total} articles
                      </span>
                      {count.discrepancy_count > 0 && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {count.discrepancy_count} écart(s)
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {formatDateTime(count.scheduled_date || count.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0 flex-wrap">
                    {count.status === "planned" && (
                      <ProtectedAction permission={Permission.INVENTORY_COUNTS_UPDATE}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Play className="w-3 h-3" />}
                          onClick={() => startMutation.mutate(count.id)}
                          loading={startMutation.isPending}
                        >
                          Démarrer
                        </Button>
                      </ProtectedAction>
                    )}
                    {count.status === "in_progress" && (
                      <ProtectedAction permission={Permission.INVENTORY_COUNTS_UPDATE}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<CheckCircle2 className="w-3 h-3" />}
                          onClick={() => completeMutation.mutate(count.id)}
                          loading={completeMutation.isPending}
                        >
                          Terminer
                        </Button>
                      </ProtectedAction>
                    )}
                    {count.status === "completed" && count.discrepancy_count > 0 && (
                      <ProtectedAction permission={Permission.INVENTORY_COUNTS_UPDATE}>
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Settings2 className="w-3 h-3" />}
                          onClick={() => adjustMutation.mutate(count.id)}
                          loading={adjustMutation.isPending}
                        >
                          Appliquer ajustements
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
      <CreateCountModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}

function CreateCountModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createMutation = useCreateInventoryCount();
  const [countType, setCountType] = useState<CountType>("full");
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        count_type: countType,
        scheduled_date: scheduledDate || new Date().toISOString(),
        notes,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setCountType("full");
          setScheduledDate("");
          setNotes("");
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Nouveau comptage"
      description="Planifiez un comptage d'inventaire"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Type de comptage <span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ALL_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCountType(t)}
                className={`rounded-lg border p-3 text-center text-sm font-medium transition-colors ${
                  countType === t
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-600"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
        <Input
          label="Date planifiée"
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
        />
        <Input
          label="Notes"
          placeholder="Notes optionnelles..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
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
            Créer le comptage
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
