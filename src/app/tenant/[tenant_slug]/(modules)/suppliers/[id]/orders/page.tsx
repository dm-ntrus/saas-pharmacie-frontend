"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useSupplierById, useSupplierPurchaseOrders } from "@/hooks/api/useSuppliers";
import { Card, Button, Badge, DataTable, type Column, Skeleton, EmptyState } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ArrowLeft } from "lucide-react";
import type { PurchaseOrder } from "@/types/suppliers";
import { PO_STATUS_LABELS } from "@/types/suppliers";

export default function SupplierOrdersPage() {
  return (
    <ModuleGuard module="suppliers" requiredPermissions={[Permission.SUPPLIERS_READ]}>
      <SupplierOrders />
    </ModuleGuard>
  );
}

function SupplierOrders() {
  const params = useParams();
  const path = useTenantPath();
  const id = (params?.id as string) ?? "";
  const { data: supplier, isLoading: ls } = useSupplierById(id);
  const { data: orders, isLoading: lo } = useSupplierPurchaseOrders(id);
  const s = supplier as { name?: string } | undefined;
  const list = (orders ?? []) as PurchaseOrder[];

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "order_number",
      title: "N° Commande",
      width: "140px",
      render: (_, row) => {
        const o = row as unknown as PurchaseOrder;
        const oid = typeof o.id === "string" && o.id.includes(":") ? o.id.split(":")[1] : o.id;
        const num = (o as { order_number?: string; po_number?: string }).order_number ?? (o as { po_number?: string }).po_number ?? String(o.id);
        return (
          <Link href={path(`/supply-chain/purchase-orders/${oid}`)} className="font-medium text-emerald-600 hover:underline">
            {num}
          </Link>
        );
      },
    },
    { key: "order_date", title: "Date", render: (_, row) => formatDate((row as unknown as PurchaseOrder).order_date) },
    { key: "expected_delivery_date", title: "Livraison prévue", render: (_, row) => formatDate((row as unknown as PurchaseOrder).expected_delivery_date) },
    { key: "status", title: "Statut", render: (_, row) => <Badge variant="default" size="sm">{PO_STATUS_LABELS[(row as unknown as PurchaseOrder).status ?? ""] ?? (row as unknown as PurchaseOrder).status ?? "—"}</Badge> },
    { key: "total_amount", title: "Total", align: "right", render: (_, row) => formatCurrency(Number((row as unknown as PurchaseOrder).total_amount ?? 0)) },
  ];

  if (ls) return <Skeleton className="h-48 w-full" />;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={path(`/suppliers/${id}`)}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Commandes · {s?.name ?? ""}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Historique des commandes d&apos;achat</p>
        </div>
      </div>
      <Card>
        {lo ? <Skeleton className="h-48 w-full" /> : list.length === 0 ? (
          <EmptyState title="Aucune commande" description="Les commandes de ce fournisseur apparaîtront ici" />
        ) : (
          <DataTable columns={columns} data={list as unknown as Record<string, unknown>[]} loading={false} rowKey={(row) => (row as unknown as PurchaseOrder).id} />
        )}
      </Card>
    </div>
  );
}
