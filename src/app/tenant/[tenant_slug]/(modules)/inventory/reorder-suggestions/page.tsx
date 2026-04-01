"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useReorderSuggestions } from "@/hooks/api/useInventory";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorBanner,
  Input,
  Skeleton,
} from "@/components/ui";
import { ArrowLeft, Truck } from "lucide-react";

export default function ReorderSuggestionsPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.INVENTORY_ITEMS_READ]}>
      <ReorderSuggestionsContent />
    </ModuleGuard>
  );
}

function ReorderSuggestionsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [thresholdInput, setThresholdInput] = useState("20");
  const [appliedThreshold, setAppliedThreshold] = useState(20);

  const threshold = appliedThreshold;
  const { data, isLoading, error, refetch } = useReorderSuggestions(threshold, 200);

  const applyThreshold = () => {
    const n = parseInt(thresholdInput, 10);
    if (Number.isNaN(n) || n < 1) return;
    setAppliedThreshold(Math.min(9999, n));
  };

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/inventory"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Truck className="w-7 h-7 text-amber-600" />
              Suggestions de réapprovisionnement
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Stock total des lots actifs sous le seuil, et produits actifs sans lot actif pour cette pharmacie
              (stock 0, jusqu’à 500 entrées triées par nom).
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seuil de stock</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label htmlFor="threshold" className="text-xs text-slate-500">
              Quantité max pour apparaître dans la liste (unités disponibles par produit)
            </label>
            <Input
              id="threshold"
              type="number"
              min={1}
              max={9999}
              className="w-40"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(e.target.value)}
            />
          </div>
          <Button type="button" onClick={applyThreshold}>
            Actualiser
          </Button>
          {data != null && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Seuil appliqué : <span className="font-medium">{data.threshold}</span> —{" "}
              {items.length} produit{items.length !== 1 ? "s" : ""}
            </p>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : error ? (
        <ErrorBanner message="Impossible de charger les suggestions" onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Aucun produit sous le seuil"
          description="Augmentez le seuil ou vérifiez que les lots actifs sont à jour."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Code-barres</th>
                <th className="px-4 py-3 text-right">Stock total</th>
                <th className="px-4 py-3 w-32" />
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row.product_id}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {row.product_name ?? row.product_id}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.sku ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{row.barcode ?? "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-amber-700 dark:text-amber-400">
                    {row.quantity}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(buildPath(`/inventory/products/${row.product_id}`))
                      }
                    >
                      Fiche
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
