"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import {
  useSupplyChainPurchaseOrderById,
  useReceiveSupplyChainPurchaseOrder,
  useGoodsReceiptsForPurchaseOrder,
} from "@/hooks/api/useSupplyChain";
import { useSuppliers } from "@/hooks/api/useSuppliers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Modal,
  Skeleton,
  ErrorBanner,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft, Package, ClipboardList } from "lucide-react";
import type { PurchaseOrder, PurchaseOrderItem } from "@/types/suppliers";
import { PO_STATUS_LABELS } from "@/types/suppliers";
import type { GoodsReceipt } from "@/types/suppliers";

function recordShortId(id: string | undefined): string {
  if (!id) return "";
  return String(id).includes(":") ? String(id).split(":").pop() ?? id : id;
}

export default function PurchaseOrderDetailPage() {
  return (
    <ModuleGuard
      module="supply-chain"
      requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_READ]}
    >
      <PurchaseOrderDetail />
    </ModuleGuard>
  );
}

function PurchaseOrderDetail() {
  const params = useParams();
  const { buildPath } = useTenantPath();
  const id = (params?.id as string) ?? "";
  const [receiveOpen, setReceiveOpen] = useState(false);
  const { data: poData, isLoading, error, refetch } = useSupplyChainPurchaseOrderById(id);
  const { data: suppliers } = useSuppliers();
  const { data: grnRaw, refetch: refetchGrn } = useGoodsReceiptsForPurchaseOrder(id);
  const receivePo = useReceiveSupplyChainPurchaseOrder();
  const po = (poData?.data ?? poData) as PurchaseOrder | undefined;
  const supplierName = po?.supplier_id
    ? (suppliers ?? []).find((s: { id: string }) => s.id === po.supplier_id)?.name ??
      po.supplier_id
    : "—";
  const grnList = (Array.isArray(grnRaw) ? grnRaw : (grnRaw as { data?: unknown })?.data ?? []) as GoodsReceipt[];

  const items = (po?.items ?? []) as PurchaseOrderItem[];
  const [receiveLines, setReceiveLines] = useState<
    Record<
      string,
      {
        receivedQuantity: number;
        backorderedQuantity: number;
        batchNumber: string;
        expiryDate: string;
        qcStatus: "accepted" | "rejected" | "quarantine";
        notes: string;
      }
    >
  >({});
  const [receiveMeta, setReceiveMeta] = useState({
    actualDate: new Date().toISOString().slice(0, 10),
    notes: "",
    qcSummary: "",
  });

  const openReceive = () => {
    const next: typeof receiveLines = {};
    for (const line of items) {
      const lid = recordShortId(line.id);
      if (!lid) continue;
      const ordered = line.ordered_quantity ?? line.quantity ?? 0;
      const already = line.received_quantity ?? 0;
      next[lid] = {
        receivedQuantity: Math.max(0, ordered - already),
        backorderedQuantity: 0,
        batchNumber: "",
        expiryDate: "",
        qcStatus: "accepted",
        notes: "",
      };
    }
    setReceiveLines(next);
    setReceiveMeta({
      actualDate: new Date().toISOString().slice(0, 10),
      notes: "",
      qcSummary: "",
    });
    setReceiveOpen(true);
  };

  const onReceiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!po) return;
    const payloadItems = items
      .map((line) => {
        const lid = recordShortId(line.id);
        if (!lid) return null;
        const st = receiveLines[lid];
        if (!st || st.receivedQuantity < 0) return null;
        return {
          itemId: line.id ?? lid,
          receivedQuantity: st.receivedQuantity,
          backorderedQuantity: st.backorderedQuantity || 0,
          batchNumber: st.batchNumber || undefined,
          expiryDate: st.expiryDate || undefined,
          qcStatus: st.qcStatus,
          notes: st.notes || undefined,
        };
      })
      .filter(Boolean) as Record<string, unknown>[];

    if (payloadItems.length === 0) return;

    const actualDeliveryDate = new Date(receiveMeta.actualDate + "T12:00:00.000Z").toISOString();
    receivePo.mutate(
      {
        id,
        data: {
          items: payloadItems,
          actualDeliveryDate,
          notes: receiveMeta.notes || undefined,
          qcSummary: receiveMeta.qcSummary || undefined,
        },
      },
      {
        onSuccess: () => {
          setReceiveOpen(false);
          void refetch();
          void refetchGrn();
        },
      },
    );
  };

  const canReceive = po?.status && !["received", "cancelled", "closed"].includes(po.status);

  if (error)
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/supply-chain/purchase-orders")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <ErrorBanner
          title="Erreur"
          message="Impossible de charger la commande"
          onRetry={() => refetch()}
        />
      </div>
    );
  if (isLoading || !po) return <Skeleton className="h-64 w-full" />;

  const status = po.status ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={buildPath("/supply-chain/purchase-orders")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {po.order_number ?? po.po_number ?? po.id}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {supplierName} ·{" "}
              <Badge variant="default" size="sm">
                {PO_STATUS_LABELS[status] ?? status}
              </Badge>
            </p>
          </div>
        </div>
        {canReceive && (
          <ProtectedAction permission={Permission.PURCHASE_ORDERS_UPDATE}>
            <Button variant="outline" leftIcon={<Package className="w-4 h-4" />} onClick={openReceive}>
              Réceptionner
            </Button>
          </ProtectedAction>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Bons de réception (GRN)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {grnList.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune réception enregistrée pour cette commande.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {grnList.map((g) => {
                const gid = recordShortId(g.id);
                return (
                  <li key={g.id}>
                    <Link
                      href={buildPath(`/supply-chain/goods-receipts/${gid}`)}
                      className="text-emerald-600 hover:underline font-medium"
                    >
                      {g.grn_number ?? g.id}
                    </Link>
                    <span className="text-slate-500 ml-2">
                      {g.created_at ? formatDate(g.created_at) : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>En-tête</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">Date commande :</span> {formatDate(po.order_date)}
            </p>
            <p>
              <span className="text-slate-500">Livraison prévue :</span>{" "}
              {formatDate(po.expected_delivery_date)}
            </p>
            <p>
              <span className="text-slate-500">Livraison réelle :</span>{" "}
              {formatDate(po.actual_delivery_date)}
            </p>
            <p>
              <span className="text-slate-500">Sous-total :</span>{" "}
              {formatCurrency(Number(po.subtotal ?? 0))}
            </p>
            <p>
              <span className="text-slate-500">Total :</span>{" "}
              <strong>{formatCurrency(Number(po.total_amount ?? po.subtotal ?? 0))}</strong>
            </p>
            {po.notes && (
              <p>
                <span className="text-slate-500">Notes :</span> {po.notes}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lignes</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune ligne.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2">Produit</th>
                    <th className="text-right py-2">Cmd</th>
                    <th className="text-right py-2">Reçu</th>
                    <th className="text-right py-2">Prix unit.</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((line, i) => (
                    <tr key={line.id ?? i} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2">{line.product_name ?? line.productName ?? "—"}</td>
                      <td className="text-right py-2">{line.ordered_quantity ?? line.quantity ?? 0}</td>
                      <td className="text-right py-2">{line.received_quantity ?? 0}</td>
                      <td className="text-right py-2">
                        {formatCurrency(Number(line.unit_price ?? line.unit_cost ?? 0))}
                      </td>
                      <td className="text-right py-2">
                        {formatCurrency(Number(line.line_total ?? 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={receiveOpen} onOpenChange={setReceiveOpen} title="Réception & contrôle qualité" size="lg">
        <form onSubmit={onReceiveSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input
            label="Date de livraison effective"
            type="date"
            value={receiveMeta.actualDate}
            onChange={(e) => setReceiveMeta((m) => ({ ...m, actualDate: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Synthèse QC (optionnel)
            </label>
            <textarea
              value={receiveMeta.qcSummary}
              onChange={(e) => setReceiveMeta((m) => ({ ...m, qcSummary: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <Input
            label="Notes réception"
            value={receiveMeta.notes}
            onChange={(e) => setReceiveMeta((m) => ({ ...m, notes: e.target.value }))}
          />

          <div className="space-y-3 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500">Par ligne</p>
            {items.map((line) => {
              const lid = recordShortId(line.id);
              if (!lid) return null;
              const st = receiveLines[lid];
              if (!st) return null;
              const label = line.product_name ?? line.productName ?? lid;
              return (
                <div key={lid} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0">
                  <div className="sm:col-span-2 text-sm font-medium">{label}</div>
                  <Input
                    label="Qté reçue"
                    type="number"
                    min={0}
                    value={st.receivedQuantity}
                    onChange={(e) =>
                      setReceiveLines((prev) => ({
                        ...prev,
                        [lid]: { ...st, receivedQuantity: Number(e.target.value) || 0 },
                      }))
                    }
                  />
                  <Input
                    label="Qté refusée / backlog"
                    type="number"
                    min={0}
                    value={st.backorderedQuantity}
                    onChange={(e) =>
                      setReceiveLines((prev) => ({
                        ...prev,
                        [lid]: { ...st, backorderedQuantity: Number(e.target.value) || 0 },
                      }))
                    }
                  />
                  <Input
                    label="N° lot"
                    value={st.batchNumber}
                    onChange={(e) =>
                      setReceiveLines((prev) => ({
                        ...prev,
                        [lid]: { ...st, batchNumber: e.target.value },
                      }))
                    }
                  />
                  <Input
                    label="Péremption"
                    type="date"
                    value={st.expiryDate}
                    onChange={(e) =>
                      setReceiveLines((prev) => ({
                        ...prev,
                        [lid]: { ...st, expiryDate: e.target.value },
                      }))
                    }
                  />
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">QC</label>
                    <select
                      value={st.qcStatus}
                      onChange={(e) =>
                        setReceiveLines((prev) => ({
                          ...prev,
                          [lid]: {
                            ...st,
                            qcStatus: e.target.value as "accepted" | "rejected" | "quarantine",
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2 text-sm"
                    >
                      <option value="accepted">Accepté</option>
                      <option value="quarantine">Quarantaine</option>
                      <option value="rejected">Refusé</option>
                    </select>
                  </div>
                  <Input
                    label="Notes ligne"
                    value={st.notes}
                    onChange={(e) =>
                      setReceiveLines((prev) => ({
                        ...prev,
                        [lid]: { ...st, notes: e.target.value },
                      }))
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setReceiveOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" loading={receivePo.isPending}>
              Valider réception (GRN)
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
