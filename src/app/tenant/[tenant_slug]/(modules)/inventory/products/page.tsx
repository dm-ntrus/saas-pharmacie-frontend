"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useProducts } from "@/hooks/api/useInventory";
import type { Product, ProductCategory, ProductType, ProductStatus } from "@/types/inventory";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_TYPE_LABELS,
  PRODUCT_STATUS_LABELS,
} from "@/types/inventory";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  EmptyState,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import { ArrowLeft, Package, Plus, Search } from "lucide-react";

export default function InventoryProductsPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.PRODUCTS_READ]}>
      <ProductsListContent />
    </ModuleGuard>
  );
}

function ProductsListContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [type, setType] = useState<ProductType | "">("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [manufacturer, setManufacturer] = useState("");
  const [requiresPrescription, setRequiresPrescription] = useState<boolean | "">("");
  const [lowStock, setLowStock] = useState(false);

  const params = useMemo(
    () => ({
      search: search || undefined,
      category: category || undefined,
      type: type || undefined,
      status: status || undefined,
      manufacturer: manufacturer || undefined,
      requiresPrescription: requiresPrescription === "" ? undefined : requiresPrescription,
      lowStock: lowStock || undefined,
      limit: 50,
      page: 1,
    }),
    [search, category, type, status, manufacturer, requiresPrescription, lowStock],
  );

  const { data, isLoading, error, refetch } = useProducts(params);
  const products: Product[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const toProductId = (rec: Product) => (typeof rec.id === "string" && rec.id.includes(":") ? rec.id.split(":")[1] : rec.id) || rec.id;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Produits</h1>
            <p className="text-sm text-slate-500">Liste et filtres (nom, code-barres, DCI, catégorie, fabricant, stock faible)</p>
          </div>
        </div>
        <ProtectedAction permission={Permission.PRODUCTS_CREATE}>
          <Button size="sm" onClick={() => router.push(buildPath("/inventory/products/new"))} leftIcon={<Plus className="h-4 w-4" />}>
            Nouveau produit
          </Button>
        </ProtectedAction>
      </div>

      {/* Filtres §3.4 */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recherche (nom, code-barres, DCI)</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory | "")}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="">Toutes</option>
                {(Object.keys(PRODUCT_CATEGORY_LABELS) as ProductCategory[]).map((c) => (
                  <option key={c} value={c}>{PRODUCT_CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProductType | "")}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="">Tous</option>
                {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((t) => (
                  <option key={t} value={t}>{PRODUCT_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus | "")}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="">Tous</option>
                {(Object.keys(PRODUCT_STATUS_LABELS) as ProductStatus[]).map((s) => (
                  <option key={s} value={s}>{PRODUCT_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fabricant</label>
              <Input
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="Fabricant"
              />
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={requiresPrescription === true}
                  onChange={(e) => setRequiresPrescription(e.target.checked ? true : "")}
                  className="rounded"
                />
                <span className="text-sm">Ordonnance requise</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lowStock}
                  onChange={(e) => setLowStock(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Stock faible</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger les produits" onRetry={() => refetch()} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8 text-slate-400" />}
          title="Aucun produit"
          description="Aucun produit ne correspond aux filtres ou la liste est vide."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left py-3 px-4">Nom</th>
                    <th className="text-left py-3 px-4">DCI / Présentation</th>
                    <th className="text-left py-3 px-4">Fabricant</th>
                    <th className="text-left py-3 px-4">Catégorie</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Statut</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer"
                      onClick={() => router.push(buildPath(`/inventory/products/${toProductId(p)}`))}
                    >
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">{p.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {(p as any).active_ingredient ?? (p as any).activeIngredient} · {(p as any).strength ?? ""}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{p.manufacturer}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default" size="sm">
                          {PRODUCT_CATEGORY_LABELS[p.category as ProductCategory] ?? p.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{PRODUCT_TYPE_LABELS[p.type as ProductType] ?? p.type}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={p.status === "active" ? "success" : p.status === "discontinued" ? "danger" : "default"}
                          size="sm"
                        >
                          {PRODUCT_STATUS_LABELS[p.status as ProductStatus] ?? p.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => router.push(buildPath(`/inventory/products/${toProductId(p)}`))}>
                          Voir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {total > 0 && (
              <div className="py-2 px-4 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                {products.length} produit(s) affiché(s) {total > products.length ? `· Total: ${total}` : ""}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
