"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useStockTransfers,
  useCreateStockTransfer,
  useApproveTransfer,
  useShipTransfer,
  useReceiveTransfer,
  useCancelTransfer,
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
  ArrowLeftRight,
  Plus,
  Search,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  MapPin,
  Package,
} from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

type TransferStatus =
  | "draft"
  | "pending"
  | "approved"
  | "in_transit"
  | "received"
  | "cancelled";

interface StockTransfer {
  id: string;
  from_location: string;
  to_location: string;
  items: { product_id: string; quantity: number }[];
  status: TransferStatus;
  created_at: string;
  updated_at: string;
  notes?: string;
}

const STATUS_LABELS: Record<TransferStatus, string> = {
  draft: "Brouillon",
  pending: "En attente",
  approved: "Approuvé",
  in_transit: "En transit",
  received: "Réceptionné",
  cancelled: "Annulé",
};

const STATUS_BADGE: Record<TransferStatus, "default" | "info" | "warning" | "success" | "danger" | "primary"> = {
  draft: "default",
  pending: "warning",
  approved: "info",
  in_transit: "primary",
  received: "success",
  cancelled: "danger",
};

const ALL_STATUSES: TransferStatus[] = [
  "draft",
  "pending",
  "approved",
  "in_transit",
  "received",
  "cancelled",
];

export default function StockTransfersPage() {
  return (
    <ModuleGuard
      module="inventory"
      requiredPermissions={[Permission.STOCK_TRANSFERS_READ]}
    >
      <TransfersContent />
    </ModuleGuard>
  );
}

function TransfersContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransferStatus | "">("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, error, refetch } = useStockTransfers({
    status: statusFilter || undefined,
    limit: 50,
  });

  const approveMutation = useApproveTransfer();
  const shipMutation = useShipTransfer();
  const receiveMutation = useReceiveTransfer();
  const cancelMutation = useCancelTransfer();

  const transfers: StockTransfer[] = data?.data ?? [];

  const filtered = transfers.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.from_location.toLowerCase().includes(q) ||
      t.to_location.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
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
              Transferts de stock
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gérez les mouvements de stock entre emplacements
            </p>
          </div>
        </div>
        <ProtectedAction permission={Permission.STOCK_TRANSFERS_CREATE}>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Nouveau transfert
          </Button>
        </ProtectedAction>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par emplacement..."
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
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {ALL_STATUSES.map((s) => (
          <StatCard
            key={s}
            label={STATUS_LABELS[s]}
            value={transfers.filter((t) => t.status === s).length}
          />
        ))}
      </div>

      {/* Transfer List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner
          message="Impossible de charger les transferts"
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ArrowLeftRight className="w-8 h-8 text-slate-400" />}
          title="Aucun transfert"
          description={
            search || statusFilter
              ? "Aucun résultat pour ces filtres."
              : "Créez votre premier transfert de stock."
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((transfer) => (
            <Card key={transfer.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                    <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {transfer.from_location}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {transfer.to_location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge variant={STATUS_BADGE[transfer.status]} size="sm">
                        {STATUS_LABELS[transfer.status]}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {transfer.items?.length ?? 0} article(s)
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDateTime(transfer.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0 flex-wrap">
                    {transfer.status === "draft" && (
                      <ProtectedAction permission={Permission.STOCK_TRANSFERS_UPDATE}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<CheckCircle2 className="w-3 h-3" />}
                          onClick={() => approveMutation.mutate(transfer.id)}
                          loading={approveMutation.isPending}
                        >
                          Approuver
                        </Button>
                      </ProtectedAction>
                    )}
                    {transfer.status === "approved" && (
                      <ProtectedAction permission={Permission.STOCK_TRANSFERS_UPDATE}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Truck className="w-3 h-3" />}
                          onClick={() => shipMutation.mutate(transfer.id)}
                          loading={shipMutation.isPending}
                        >
                          Expédier
                        </Button>
                      </ProtectedAction>
                    )}
                    {transfer.status === "in_transit" && (
                      <ProtectedAction permission={Permission.STOCK_TRANSFERS_UPDATE}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<PackageCheck className="w-3 h-3" />}
                          onClick={() =>
                            receiveMutation.mutate({ id: transfer.id, data: {} })
                          }
                          loading={receiveMutation.isPending}
                        >
                          Réceptionner
                        </Button>
                      </ProtectedAction>
                    )}
                    {(transfer.status === "draft" ||
                      transfer.status === "pending" ||
                      transfer.status === "approved") && (
                      <ProtectedAction permission={Permission.STOCK_TRANSFERS_UPDATE}>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<XCircle className="w-3 h-3" />}
                          onClick={() => cancelMutation.mutate(transfer.id)}
                          loading={cancelMutation.isPending}
                        >
                          Annuler
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
      <CreateTransferModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}

function CreateTransferModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createMutation = useCreateStockTransfer();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        from_location: fromLocation,
        to_location: toLocation,
        notes,
        items: [],
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setFromLocation("");
          setToLocation("");
          setNotes("");
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Nouveau transfert de stock"
      description="Créez un transfert entre deux emplacements"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Emplacement source"
          placeholder="Ex: Dépôt principal"
          value={fromLocation}
          onChange={(e) => setFromLocation(e.target.value)}
          required
        />
        <Input
          label="Emplacement destination"
          placeholder="Ex: Officine"
          value={toLocation}
          onChange={(e) => setToLocation(e.target.value)}
          required
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
            Créer le transfert
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-3 text-center">
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {value}
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}
