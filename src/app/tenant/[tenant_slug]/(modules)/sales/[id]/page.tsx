"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useSaleById, useRefundSale } from "@/hooks/api/useSales";
import {
  SaleStatus,
  SALE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/types/sales";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Modal,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import {
  ArrowLeft,
  Printer,
  RotateCcw,
  CheckCircle,
  Clock,
  User,
  CreditCard,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/utils/formatters";

const STATUS_BADGE: Record<string, "success" | "danger" | "warning" | "default" | "info"> = {
  [SaleStatus.COMPLETED]: "success",
  [SaleStatus.REFUNDED]: "danger",
  [SaleStatus.CANCELLED]: "default",
  [SaleStatus.PENDING]: "warning",
  [SaleStatus.PARTIALLY_PAID]: "info",
};

export default function SaleDetailPage() {
  return (
    <ModuleGuard module="sales" requiredPermissions={[Permission.SALES_READ]}>
      <SaleDetailContent />
    </ModuleGuard>
  );
}

function SaleDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const id = params?.id as string;

  const { data: sale, isLoading, error, refetch } = useSaleById(id);
  const refundMutation = useRefundSale();

  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");

  const handleRefund = () => {
    if (!sale) return;
    refundMutation.mutate(
      { id: sale.id, reason: refundReason },
      {
        onSuccess: () => {
          setRefundModalOpen(false);
          setRefundReason("");
          void refetch();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <ErrorBanner
        message="Impossible de charger les détails de la vente"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/sales"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Vente #{sale.sale_number}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formatDateTime(sale.created_at)}
            </p>
          </div>
        </div>
        <Badge variant={STATUS_BADGE[sale.status] ?? "default"}>
          {SALE_STATUS_LABELS[sale.status] ?? sale.status}
        </Badge>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="h-4 w-4" />}
          >
            Imprimer le reçu
          </Button>
          {sale.status === SaleStatus.COMPLETED && (
            <ProtectedAction permission={Permission.SALES_UPDATE}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="h-4 w-4" />}
                onClick={() => setRefundModalOpen(true)}
              >
                Rembourser
              </Button>
            </ProtectedAction>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sale.patient ? (
                <div className="space-y-2">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {sale.patient.firstName} {sale.patient.lastName}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  Vente sans client enregistré
                </p>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>
                Articles vendus ({sale.items_count ?? sale.items?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sale.items && sale.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700/50">
                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-500">
                          Produit
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold uppercase text-slate-500">
                          Qté
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-500">
                          Prix unit.
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-500">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {sale.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                            {item.productId}
                            {item.batchNumber && (
                              <span className="block text-xs text-slate-400">
                                Lot: {item.batchNumber}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="info" size="sm">{item.quantity}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(
                              item.quantity * item.unitPrice -
                                (item.discountAmount ?? 0),
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  Détails des articles non disponibles
                </p>
              )}
            </CardContent>
          </Card>

          {sale.notes && (
            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {sale.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Transaction Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Transaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-slate-500">Caissier</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {sale.cashier
                    ? `${sale.cashier.firstName} ${sale.cashier.lastName}`
                    : sale.cashier_id}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Paiement</p>
                <Badge variant="default">
                  {PAYMENT_METHOD_LABELS[sale.payment_method] ?? sale.payment_method}
                </Badge>
              </div>
              {sale.source_type && (
                <div>
                  <p className="text-xs text-slate-500">Source</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                    {sale.source_type}
                    {sale.source_number && ` — ${sale.source_number}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader><CardTitle>Résumé financier</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Sous-total</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {formatCurrency(sale.subtotal)}
                </span>
              </div>
              {parseFloat(sale.discount_amount || "0") > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Remise</span>
                  <span>-{formatCurrency(sale.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">TVA</span>
                <span>{formatCurrency(sale.tax_amount)}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700/50 pt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Total</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(sale.total_amount)}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700/50 pt-2 space-y-1">
                <div className="flex justify-between text-green-600">
                  <span>Payé</span>
                  <span>{formatCurrency(sale.amount_paid)}</span>
                </div>
                {parseFloat(sale.change_given || "0") > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monnaie rendue</span>
                    <span>{formatCurrency(sale.change_given)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader><CardTitle>Historique</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Vente créée</p>
                  <p className="text-xs text-slate-500">{formatDateTime(sale.created_at)}</p>
                </div>
              </div>
              {sale.completed_at && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Complétée</p>
                    <p className="text-xs text-slate-500">{formatDateTime(sale.completed_at)}</p>
                  </div>
                </div>
              )}
              {sale.refunded_at && (
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Remboursée</p>
                    <p className="text-xs text-slate-500">{formatDateTime(sale.refunded_at)}</p>
                    {sale.sale_return_number && (
                      <p className="text-xs font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                        Document retour : {sale.sale_return_number}
                      </p>
                    )}
                    {sale.refund_reason && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Raison : {sale.refund_reason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Refund Modal */}
      <Modal
        open={refundModalOpen}
        onOpenChange={() => { setRefundModalOpen(false); setRefundReason(""); }}
        title="Rembourser la vente"
        description={`Vente ${sale.sale_number} — ${formatCurrency(sale.total_amount)}`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Un numéro de document retour (RET-…) sera attribué et visible sur la fiche après confirmation.
          </p>
          <Input
            label="Raison du remboursement"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Ex: Retour produit défectueux"
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRefundModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleRefund}
              loading={refundMutation.isPending}
              disabled={!refundReason.trim()}
            >
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
