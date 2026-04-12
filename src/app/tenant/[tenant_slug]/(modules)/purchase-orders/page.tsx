"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { usePurchaseOrders } from "@/hooks/api/useSuppliers";
import { PO_STATUS_LABELS } from "@/types/suppliers";
import type { PurchaseOrder } from "@/types/suppliers";
import { Button, Card, CardContent, Badge, Input, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { Plus, Search, ArrowLeft, ChevronRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";

const STATUS_BADGE: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  draft: "default", sent: "info", confirmed: "info", partially_received: "warning", received: "success", cancelled: "danger",
};

export default function PurchaseOrdersPage() {
  return (
    <ModuleGuard module="suppliers" requiredPermissions={[Permission.PURCHASE_ORDERS_READ]}>
      <POContent />
    </ModuleGuard>
  );
}

function POContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [search, setSearch] = useState("");
  const { data: orders, isLoading, error, refetch } = usePurchaseOrders();

  const filtered = (orders ?? []).filter((o: PurchaseOrder) => {
    if (!search) return true;
    return (o.order_number ?? "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/suppliers"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Fournisseurs
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Bons de commande</h1>
            <p className="text-sm text-slate-500 mt-1">Suivi des approvisionnements</p>
          </div>
        </div>
        <ProtectedAction permission={Permission.PURCHASE_ORDERS_CREATE}>
          <Button leftIcon={<Plus className="w-4 h-4" />}>Nouveau bon</Button>
        </ProtectedAction>
      </div>

      <Input
        placeholder="Rechercher par numéro..."
        value={search}
        onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
        leftIcon={<Search className="w-4 h-4" />}
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
      ) : error ? (
        <ErrorBanner message="Erreur de chargement" onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title="Aucun bon de commande" description="Créez votre premier bon de commande." />
      ) : (
        <Card>
          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((po: PurchaseOrder) => (
              <button key={po.id} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                onClick={() => router.push(buildPath(`/purchase-orders/${po.id}`))}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">#{po.order_number}</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(po.order_date)}{" "}
                    {(po as any).supplier_name && `• ${(po as any).supplier_name}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 hidden sm:block">{formatCurrency(po.total_amount)}</span>
                  <Badge variant={STATUS_BADGE[po.status] ?? "default"} size="sm">{PO_STATUS_LABELS[po.status]}</Badge>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
