"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useSupplyChainPurchaseOrders } from "@/hooks/api/useSupplyChain";
import { useSuppliers } from "@/hooks/api/useSuppliers";
import { Card, Button, Badge, Input, DataTable, type Column, Skeleton, EmptyState, ErrorBanner } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Plus, Search, ArrowLeft } from "lucide-react";
import type { PurchaseOrder } from "@/types/suppliers";
import { PO_STATUS_LABELS } from "@/types/suppliers";

export default function SupplyChainPurchaseOrdersPage() {
  return (
    <ModuleGuard module="supply-chain" requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.PURCHASE_ORDERS_READ]}>
      <PurchaseOrdersList />
    </ModuleGuard>
  );
}

function PurchaseOrdersList() {
  const { buildPath } = useTenantPath();
  const [search, setSearch] = useState("");
  const { data: orders, isLoading, error, refetch } = useSupplyChainPurchaseOrders();
  const { data: suppliers } = useSuppliers();
  const rawOrders = orders as
    | { purchaseOrders?: PurchaseOrder[]; data?: PurchaseOrder[] }
    | PurchaseOrder[]
    | undefined;
  const list = Array.isArray(rawOrders)
    ? rawOrders
    : (rawOrders?.purchaseOrders ?? rawOrders?.data ?? []) as PurchaseOrder[];
  const suppliersMap = useMemo(() => {
    const s = (suppliers ?? []) as { id: string; name?: string }[];
    const m: Record<string, string> = {};
    for (const x of s) {
      const name = x.name ?? x.id;
      m[x.id] = name;
      const short = x.id.includes(":") ? x.id.split(":").pop() ?? x.id : x.id;
      m[short] = name;
      m[`suppliers:${short}`] = name;
    }
    return m;
  }, [suppliers]);
  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (o) =>
        (o.order_number ?? o.po_number ?? "").toString().toLowerCase().includes(q) ||
        (o.supplier_id ?? o.supplierId ?? "").toString().toLowerCase().includes(q) ||
        suppliersMap[o.supplier_id ?? o.supplierId ?? ""]?.toLowerCase().includes(q),
    );
  }, [list, search, suppliersMap]);

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "order_number",
      title: "N° Commande",
      width: "140px",
      render: (_, row) => {
        const o = row as unknown as PurchaseOrder;
        const oid = typeof o.id === "string" && o.id.includes(":") ? o.id.split(":")[1] : o.id;
        return (
          <Link href={buildPath(`/supply-chain/purchase-orders/${oid}`)} className="font-medium text-emerald-600 hover:underline">
            {String(o.order_number ?? o.po_number ?? o.id)}
          </Link>
        );
      },
    },
    { key: "supplier_id", title: "Fournisseur", render: (_, row) => { const o = row as unknown as PurchaseOrder; const sid = o.supplier_id ?? o.supplierId; return sid ? (suppliersMap[sid] ?? sid) : "—"; } },
    { key: "order_date", title: "Date", render: (_, row) => formatDate((row as unknown as PurchaseOrder).order_date) },
    { key: "expected_delivery_date", title: "Livraison prévue", render: (_, row) => formatDate((row as unknown as PurchaseOrder).expected_delivery_date) },
    { key: "status", title: "Statut", render: (_, row) => <Badge variant="default" size="sm">{PO_STATUS_LABELS[(row as unknown as PurchaseOrder).status ?? ""] ?? (row as unknown as PurchaseOrder).status ?? "—"}</Badge> },
    { key: "total_amount", title: "Total", align: "right", render: (_, row) => formatCurrency(Number((row as unknown as PurchaseOrder).total_amount ?? (row as unknown as PurchaseOrder).subtotal ?? 0)) },
  ];

  if (error) return (<div className="space-y-6"><Button variant="ghost" size="sm" asChild><Link href={buildPath("/supply-chain")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button><ErrorBanner title="Erreur" message="Impossible de charger les commandes" onRetry={() => refetch()} /></div>);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild><Link href={buildPath("/supply-chain")}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Link></Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Commandes d&apos;achat</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Liste des bons de commande</p>
            <p className="text-xs text-slate-400 mt-2 flex flex-wrap gap-x-2 gap-y-1">
              <Link href={buildPath("/supply-chain/purchase-requests")} className="text-emerald-600 hover:underline">
                Réquisitions
              </Link>
              <span>·</span>
              <Link href={buildPath("/supply-chain/supplier-quotes")} className="text-emerald-600 hover:underline">
                Devis fournisseurs
              </Link>
            </p>
          </div>
        </div>
        <ProtectedAction permission={Permission.PURCHASE_ORDERS_CREATE}><Button asChild><Link href={buildPath("/supply-chain/purchase-orders/new")}><Plus className="w-4 h-4 mr-2" /> Nouvelle commande</Link></Button></ProtectedAction>
      </div>
      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700"><Input placeholder="Rechercher par n° ou fournisseur..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} className="max-w-md" /></div>
        {isLoading ? <Skeleton className="h-64 w-full" /> : filtered.length === 0 ? <EmptyState title="Aucune commande" description="Créez une commande d'achat pour commencer." /> : <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} loading={false} rowKey={(row) => (row as unknown as PurchaseOrder).id} />}
      </Card>
    </div>
  );
}
