"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useStockTransferById,
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
  EmptyState,
  ErrorBanner,
  Skeleton,
  Stepper,
} from "@/components/ui";
import { formatDateTime } from "@/utils/formatters";
import {
  ArrowLeft,
  ArrowLeftRight,
  MapPin,
  Package,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
} from "lucide-react";

const STEPS = [
  { key: "pending", label: "Demande", icon: ArrowLeftRight },
  { key: "approved", label: "Approuvé", icon: CheckCircle2 },
  { key: "in_transit", label: "Expédié", icon: Truck },
  { key: "received", label: "Reçu", icon: PackageCheck },
];

export default function TransferDetailPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.STOCK_TRANSFERS_READ]}>
      <TransferDetailContent />
    </ModuleGuard>
  );
}

function TransferDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const id = params?.id as string;

  const { data: transfer, isLoading, error, refetch } = useStockTransferById(id);
  const approveMutation = useApproveTransfer();
  const shipMutation = useShipTransfer();
  const receiveMutation = useReceiveTransfer();
  const cancelMutation = useCancelTransfer();

  if (isLoading || !id) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (error || !transfer) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/transfers"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <ErrorBanner message="Transfert introuvable" onRetry={() => refetch()} />
      </div>
    );
  }

  const t = transfer as any;
  const status = (t.status ?? t.transfer_status) as string;
  const fromLocation = t.from_location ?? t.from_location_name ?? t.sourceLocationId ?? "—";
  const toLocation = t.to_location ?? t.to_location_name ?? t.destinationLocationId ?? "—";
  const items = t.items ?? t.transfer_lines ?? t.transferLines ?? [];
  const currentStepIndex = Math.max(0, STEPS.findIndex((s) => s.key === status));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory/transfers"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Transfert #{t.transfer_number ?? t.id?.slice(0, 8)}</h1>
            <p className="text-sm text-slate-500">{fromLocation} → {toLocation}</p>
          </div>
        </div>
        <Badge variant={status === "received" ? "success" : status === "cancelled" ? "danger" : "warning"} size="sm">
          {status}
        </Badge>
      </div>

      <Stepper steps={STEPS.map((s) => ({ label: s.label, description: undefined }))} currentStep={currentStepIndex} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Emplacements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-slate-500">Source :</span> {fromLocation}</p>
            <p><span className="text-slate-500">Destination :</span> {toLocation}</p>
            {t.notes && <p className="text-slate-500 mt-2">{t.notes}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <EmptyState title="Aucune ligne" description="Détails des lignes non disponibles." />
            ) : (
              <ul className="space-y-2 text-sm">
                {items.map((line: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>{line.product_name ?? line.productId ?? "Produit"}</span>
                    <span className="font-mono">{line.quantity ?? 0} unités</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-slate-500">Créé le {formatDateTime(t.created_at ?? t.createdAt)}</span>
          <div className="flex gap-2 flex-wrap">
            {status === "pending" && (
              <ProtectedAction permission={Permission.STOCK_TRANSFERS_UPDATE}>
                <Button size="sm" leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={() => approveMutation.mutate(id)} disabled={approveMutation.isPending}>
                  Approuver
                </Button>
              </ProtectedAction>
            )}
            {status === "approved" && (
              <ProtectedAction permission={Permission.STOCK_TRANSFERS_UPDATE}>
                <Button size="sm" leftIcon={<Truck className="w-4 h-4" />} onClick={() => shipMutation.mutate(id)} disabled={shipMutation.isPending}>
                  Expédier
                </Button>
              </ProtectedAction>
            )}
            {status === "in_transit" && (
              <ProtectedAction permission={Permission.STOCK_TRANSFERS_UPDATE}>
                <Button size="sm" leftIcon={<PackageCheck className="w-4 h-4" />} onClick={() => receiveMutation.mutate({ id, data: {} })} disabled={receiveMutation.isPending}>
                  Réceptionner
                </Button>
              </ProtectedAction>
            )}
            {["pending", "approved", "in_transit"].includes(status) && (
              <ProtectedAction permission={Permission.STOCK_TRANSFERS_UPDATE}>
                <Button variant="outline" size="sm" leftIcon={<XCircle className="w-4 h-4" />} onClick={() => cancelMutation.mutate(id)} disabled={cancelMutation.isPending}>
                  Annuler
                </Button>
              </ProtectedAction>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
