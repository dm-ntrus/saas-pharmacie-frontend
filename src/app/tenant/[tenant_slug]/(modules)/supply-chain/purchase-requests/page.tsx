"use client";

import React from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { usePurchaseRequests } from "@/hooks/api/useSupplyChain";
import { Button, Card, CardContent, Badge, Skeleton, ErrorBanner, EmptyState } from "@/components/ui";
import { ArrowLeft, Plus } from "lucide-react";
import type { PurchaseRequest } from "@/types/suppliers";
import { PR_STATUS_LABELS } from "@/types/suppliers";
import { formatDateTime } from "@/utils/formatters";

function shortId(id: string) {
  return id.includes(":") ? id.split(":").pop() ?? id : id;
}

export default function PurchaseRequestsListPage() {
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
  const { buildPath } = useTenantPath();
  const { data, isLoading, error, refetch } = usePurchaseRequests();
  const raw = data as { purchaseRequests?: PurchaseRequest[] } | PurchaseRequest[] | undefined;
  const list = Array.isArray(raw) ? raw : raw?.purchaseRequests ?? [];

  if (error)
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={buildPath("/supply-chain")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <ErrorBanner message="Impossible de charger les demandes" onRetry={() => refetch()} />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={buildPath("/supply-chain")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Demandes d&apos;achat
            </h1>
            <p className="text-sm text-slate-500">Réquisitions internes → validation → bon de commande</p>
          </div>
        </div>
        <ProtectedAction permission={Permission.PURCHASE_ORDERS_CREATE}>
          <Button asChild>
            <Link href={buildPath("/supply-chain/purchase-requests/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle demande
            </Link>
          </Button>
        </ProtectedAction>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : list.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Aucune demande"
                description="Créez une réquisition pour lancer le circuit d'achat."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-700 dark:bg-slate-800/50">
                    <th className="px-4 py-3">N°</th>
                    <th className="px-4 py-3">Titre</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Créée</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {list.map((row) => {
                    const rid = shortId(row.id);
                    return (
                      <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="px-4 py-3 font-mono text-xs">
                          {row.request_number ?? rid}
                        </td>
                        <td className="px-4 py-3">{row.title ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant="default" size="sm">
                            {PR_STATUS_LABELS[row.status] ?? row.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {row.created_at ? formatDateTime(row.created_at) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={buildPath(`/supply-chain/purchase-requests/${rid}`)}
                            className="text-emerald-600 hover:underline"
                          >
                            Ouvrir
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
