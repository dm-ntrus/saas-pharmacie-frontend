"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useGoodsReceiptById } from "@/hooks/api/useSupplyChain";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Skeleton, ErrorBanner } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import type { GoodsReceipt, GoodsReceiptLine } from "@/types/suppliers";
import { QC_STATUS_LABELS } from "@/types/suppliers";
import { formatDateTime } from "@/utils/formatters";

function shortId(id: string | undefined) {
  if (!id) return "";
  return id.includes(":") ? id.split(":").pop() ?? id : id;
}

export default function GoodsReceiptDetailPage() {
  return (
    <ModuleGuard
      module="supply-chain"
      requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_READ]}
    >
      <Content />
    </ModuleGuard>
  );
}

function Content() {
  const params = useParams();
  const grnId = (params?.grnId as string) ?? "";
  const { buildPath } = useTenantPath();
  const { data, isLoading, error, refetch } = useGoodsReceiptById(grnId);
  const gr = (data?.data ?? data) as GoodsReceipt | undefined;
  const lines = (gr?.lines ?? []) as GoodsReceiptLine[];
  const poShort = gr?.purchase_order_id ? shortId(gr.purchase_order_id) : "";

  if (error)
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/supply-chain/purchase-orders")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <ErrorBanner message="GRN introuvable" onRetry={() => refetch()} />
      </div>
    );
  if (isLoading || !gr) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={poShort ? buildPath(`/supply-chain/purchase-orders/${poShort}`) : buildPath("/supply-chain/purchase-orders")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour BC
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {gr.grn_number ?? gr.id}
          </h1>
          <p className="text-sm text-slate-500">
            {gr.created_at ? formatDateTime(gr.created_at) : ""}
            {poShort && (
              <>
                {" · "}
                <Link
                  href={buildPath(`/supply-chain/purchase-orders/${poShort}`)}
                  className="text-emerald-600 hover:underline"
                >
                  Bon de commande
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Synthèse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-slate-500">Réceptionné par :</span> {gr.received_by ?? "—"}
          </p>
          {gr.qc_summary && (
            <p>
              <span className="text-slate-500">QC :</span> {gr.qc_summary}
            </p>
          )}
          {gr.notes && (
            <p>
              <span className="text-slate-500">Notes :</span> {gr.notes}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lignes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2">Produit</th>
                  <th className="text-right py-2">Reçu</th>
                  <th className="text-right py-2">Accepté</th>
                  <th className="text-right py-2">Refus</th>
                  <th className="text-left py-2">QC</th>
                  <th className="text-left py-2">Lot</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={l.id ?? i} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 font-mono text-xs">{shortId(l.product_id)}</td>
                    <td className="text-right py-2">{l.quantity_received}</td>
                    <td className="text-right py-2">{l.quantity_accepted}</td>
                    <td className="text-right py-2">{l.quantity_rejected}</td>
                    <td className="py-2">
                      <Badge variant="default" size="sm">
                        {QC_STATUS_LABELS[l.qc_status ?? ""] ?? l.qc_status}
                      </Badge>
                    </td>
                    <td className="py-2 text-xs">{l.batch_number ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
