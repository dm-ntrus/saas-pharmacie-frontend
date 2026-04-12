"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useBatchById, useAdjustBatchQuantity } from "@/hooks/api/useInventory";
import type { ProductBatch } from "@/types/inventory";
import { BatchStatus, BATCH_STATUS_LABELS } from "@/types/inventory";
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
import { formatDate } from "@/utils/formatters";
import { ArrowLeft, Package, Calendar, AlertTriangle, Edit, FlaskConical } from "lucide-react";
import { cn } from "@/utils/cn";

function daysUntilExpiry(expirationDate: string): number | null {
  if (!expirationDate) return null;
  const exp = new Date(expirationDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);
  return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function BatchDetailPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.PRODUCT_BATCHES_READ]}>
      <BatchDetailContent />
    </ModuleGuard>
  );
}

function BatchDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const id = params?.id as string;
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState("");

  const { data: batch, isLoading, error, refetch } = useBatchById(id);
  const adjustMutation = useAdjustBatchQuantity();

  const b = batch as any;
  const productName = b?.product_name ?? b?.productName ?? "—";
  const batchNumber = b?.batch_number ?? b?.batchNumber ?? "—";
  const expirationDate = b?.expiration_date ?? b?.expirationDate;
  const days = expirationDate ? daysUntilExpiry(expirationDate) : null;
  const isExpiringSoon = days !== null && days >= 0 && days <= 30;
  const isExpired = days !== null && days < 0;

  const handleAdjust = () => {
    if (adjustReason.trim().length < 3) return;
    adjustMutation.mutate(
      {
        batchId: id,
        data: {
          quantity: adjustQty,
          reason: adjustReason.trim(),
          userId: "",
        },
      },
      {
        onSuccess: () => {
          setAdjustModalOpen(false);
          setAdjustQty(0);
          setAdjustReason("");
        },
      },
    );
  };

  if (isLoading || !id) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/batches"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <ErrorBanner message="Lot introuvable" onRetry={() => refetch()} />
      </div>
    );
  }

  const status = (b.status ?? b.batch_status) as BatchStatus;
  const currentQty = b.current_quantity ?? b.currentQuantity ?? 0;
  const initialQty = b.initial_quantity ?? b.initialQuantity ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/inventory/batches"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl",
              isExpired ? "bg-red-100 dark:bg-red-900/30" : isExpiringSoon ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30",
            )}>
              <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{productName}</h1>
              <p className="text-sm text-slate-500">Lot {batchNumber}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isExpiringSoon && (
            <Badge variant={isExpired ? "danger" : "warning"}>
              {isExpired ? "Expiré" : `J-${days}`}
            </Badge>
          )}
          <Badge variant={status === BatchStatus.ACTIVE ? "success" : "default"}>
            {BATCH_STATUS_LABELS[status] ?? status}
          </Badge>
          <ProtectedAction permission={Permission.INVENTORY_TRANSACTIONS_CREATE}>
            <Button variant="outline" size="sm" leftIcon={<Edit className="w-4 h-4" />} onClick={() => setAdjustModalOpen(true)}>
              Ajuster quantité
            </Button>
          </ProtectedAction>
        </div>
      </div>

      {isExpiringSoon && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {isExpired ? "Ce lot est expiré." : `Expiration dans ${days} jour(s).`}
              </p>
              <p className="text-sm text-slate-500">
                FEFO : premier expiré, premier sorti. À utiliser en priorité.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Informations lot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-slate-500">Produit</dt>
              <dd className="text-slate-900 dark:text-slate-100">{productName}</dd>
              <dt className="text-slate-500">N° lot</dt>
              <dd className="font-mono">{batchNumber}</dd>
              <dt className="text-slate-500">Date fabrication</dt>
              <dd>{b.manufacture_date || b.manufactureDate ? formatDate(b.manufacture_date ?? b.manufactureDate) : "—"}</dd>
              <dt className="text-slate-500">Date expiration</dt>
              <dd>{expirationDate ? formatDate(expirationDate) : "—"}</dd>
              <dt className="text-slate-500">Quantité actuelle</dt>
              <dd className="font-mono">{currentQty}</dd>
              <dt className="text-slate-500">Quantité initiale</dt>
              <dd className="font-mono">{initialQty}</dd>
              {b.reserved_quantity != null && (
                <>
                  <dt className="text-slate-500">Réservée</dt>
                  <dd className="font-mono">{b.reserved_quantity}</dd>
                </>
              )}
              {b.unit_cost != null && (
                <>
                  <dt className="text-slate-500">Coût unitaire</dt>
                  <dd>{Number(b.unit_cost).toFixed(2)}</dd>
                </>
              )}
              {b.supplier_name && (
                <>
                  <dt className="text-slate-500">Fournisseur</dt>
                  <dd>{b.supplier_name}</dd>
                </>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Traçabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Historique des mouvements et ajustements du lot. Les événements sont enregistrés côté backend.
            </p>
            {b.created_at && (
              <p className="text-xs text-slate-400 mt-2">Créé le {formatDate(b.created_at)}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal open={adjustModalOpen} onOpenChange={setAdjustModalOpen} title="Ajuster la quantité">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Quantité positive = ajout, négative = retrait. Raison obligatoire (min. 3 caractères).
          </p>
          <Input
            type="number"
            label="Variation quantité"
            value={adjustQty || ""}
            onChange={(e) => setAdjustQty(Number(e.target.value) || 0)}
            placeholder="ex: 10 ou -5"
          />
          <Input
            label="Raison"
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            placeholder="Inventaire, casse, retour..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAdjustModalOpen(false)}>Annuler</Button>
            <Button
              onClick={handleAdjust}
              disabled={adjustReason.trim().length < 3 || adjustMutation.isPending}
            >
              {adjustMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
