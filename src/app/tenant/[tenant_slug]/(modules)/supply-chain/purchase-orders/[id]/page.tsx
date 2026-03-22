"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useSupplyChainPurchaseOrderById, useReceiveSupplyChainPurchaseOrder } from "@/hooks/api/useSupplyChain";
import { useSuppliers } from "@/hooks/api/useSuppliers";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Modal, Skeleton, ErrorBanner } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft, Package } from "lucide-react";
import type { PurchaseOrder, PurchaseOrderItem } from "@/types/suppliers";
import { PO_STATUS_LABELS } from "@/types/suppliers";

const receiveSchema = z.object({ received_date: z.string().min(1, "Date requise"), notes: z.string().optional() });
type ReceiveFormData = z.infer<typeof receiveSchema>;

export default function PurchaseOrderDetailPage() {
  return (
    <ModuleGuard module="supply-chain" requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_READ]}>
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
  const receivePo = useReceiveSupplyChainPurchaseOrder();
  const po = (poData?.data ?? poData) as PurchaseOrder | undefined;
  const supplierName = po?.supplier_id ? (suppliers ?? []).find((s: { id: string }) => s.id === po.supplier_id)?.name ?? po.supplier_id : "—";
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReceiveFormData>({ resolver: zodResolver(receiveSchema), defaultValues: { received_date: new Date().toISOString().slice(0, 10), notes: "" } });
  const onReceive = (data: ReceiveFormData) => {
    receivePo.mutate({ id, data: { received_date: data.received_date, notes: data.notes } }, { onSuccess: () => { setReceiveOpen(false); reset(); refetch(); } });
  };
  const canReceive = po?.status && !["received", "cancelled", "closed"].includes(po.status);

  if (error) return (<div className="space-y-6"><Button variant="ghost" size="sm" asChild><Link href={buildPath("/supply-chain/purchase-orders")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button><ErrorBanner title="Erreur" message="Impossible de charger la commande" onRetry={() => refetch()} /></div>);
  if (isLoading || !po) return <Skeleton className="h-64 w-full" />;

  const status = po.status ?? "—";
  const items = (po.items ?? []) as PurchaseOrderItem[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild><Link href={buildPath("/supply-chain/purchase-orders")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{po.order_number ?? po.po_number ?? po.id}</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{supplierName} · <Badge variant="default" size="sm">{PO_STATUS_LABELS[status] ?? status}</Badge></p></div>
        </div>
        {canReceive && <ProtectedAction permission={Permission.PURCHASE_ORDERS_UPDATE}><Button variant="outline" leftIcon={<Package className="w-4 h-4" />} onClick={() => setReceiveOpen(true)}>Réceptionner</Button></ProtectedAction>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>En-tête</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
          <p><span className="text-slate-500">Date commande :</span> {formatDate(po.order_date)}</p>
          <p><span className="text-slate-500">Livraison prévue :</span> {formatDate(po.expected_delivery_date)}</p>
          <p><span className="text-slate-500">Livraison réelle :</span> {formatDate(po.actual_delivery_date)}</p>
          <p><span className="text-slate-500">Sous-total :</span> {formatCurrency(Number(po.subtotal ?? 0))}</p>
          <p><span className="text-slate-500">Total :</span> <strong>{formatCurrency(Number(po.total_amount ?? po.subtotal ?? 0))}</strong></p>
          {po.notes && <p><span className="text-slate-500">Notes :</span> {po.notes}</p>}
        </CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Lignes</CardTitle></CardHeader><CardContent>
        {items.length === 0 ? <p className="text-sm text-slate-500">Aucune ligne.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-200 dark:border-slate-700"><th className="text-left py-2">Produit</th><th className="text-right py-2">Quantité</th><th className="text-right py-2">Prix unit.</th><th className="text-right py-2">Total</th></tr></thead>
              <tbody>{items.map((line, i) => (<tr key={line.id ?? i} className="border-b border-slate-100 dark:border-slate-800"><td className="py-2">{line.product_name ?? line.productName ?? "—"}</td><td className="text-right py-2">{line.quantity ?? line.ordered_quantity ?? 0}</td><td className="text-right py-2">{formatCurrency(Number(line.unit_price ?? line.unit_cost ?? 0))}</td><td className="text-right py-2">{formatCurrency(Number(line.line_total ?? 0))}</td></tr>))}</tbody>
            </table>
          </div>
        )}
      </CardContent></Card>
      <Modal open={receiveOpen} onOpenChange={setReceiveOpen} title="Réceptionner la commande" size="sm">
        <form onSubmit={handleSubmit(onReceive)} className="space-y-4">
          <Input label="Date de réception" type="date" {...register("received_date")} error={errors.received_date?.message} />
          <Input label="Notes" {...register("notes")} />
          <div className="flex justify-end gap-2 pt-2"><Button variant="outline" type="button" onClick={() => setReceiveOpen(false)}>Annuler</Button><Button type="submit" loading={receivePo.isPending}>Enregistrer la réception</Button></div>
        </form>
      </Modal>
    </div>
  );
}
