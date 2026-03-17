"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useProducts, useInventoryKPIs } from "@/hooks/api/useInventory";
import {
  ProductCategory,
  ProductStatus,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_STATUS_LABELS,
} from "@/types/inventory";
import type { Product, ProductQueryParams } from "@/types/inventory";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  EmptyState,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Filter,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

const STATUS_BADGE_MAP: Record<string, "success" | "danger" | "warning" | "default"> = {
  [ProductStatus.ACTIVE]: "success",
  [ProductStatus.DISCONTINUED]: "danger",
  [ProductStatus.PENDING_APPROVAL]: "warning",
};

export default function InventoryPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.INVENTORY_ITEMS_READ]}>
      <InventoryContent />
    </ModuleGuard>
  );
}

function InventoryContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [page, setPage] = useState(1);

  const queryParams: ProductQueryParams = {
    search: search || undefined,
    category: category || undefined,
    status: status || undefined,
    page,
    limit: 25,
  };

  const { data, isLoading, error, refetch } = useProducts(queryParams);
  const { data: kpis, isLoading: kpisLoading } = useInventoryKPIs();

  const products: Product[] = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Inventaire & Stock
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestion des produits, alertes et mouvements de stock
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<AlertTriangle className="w-4 h-4" />}
            onClick={() => router.push(buildPath("/inventory/alerts"))}
          >
            Alertes
          </Button>
          <ProtectedAction permission={Permission.PRODUCTS_CREATE}>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => router.push(buildPath("/inventory/products/new"))}
            >
              Nouveau produit
            </Button>
          </ProtectedAction>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpisLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : (
          <>
            <KPICard
              label="Produits"
              value={kpis?.total_products?.toString() ?? "—"}
              icon={<Package className="w-5 h-5 text-emerald-600" />}
            />
            <KPICard
              label="Valeur du stock"
              value={kpis ? formatCurrency(kpis.total_stock_value) : "—"}
              icon={<DollarSign className="w-5 h-5 text-blue-600" />}
            />
            <KPICard
              label="Taux rotation"
              value={kpis ? `${kpis.turnover_rate.toFixed(1)}x` : "—"}
              icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
            />
            <KPICard
              label="Alertes"
              value={
                kpis
                  ? `${(kpis.low_stock_count ?? 0) + (kpis.expired_count ?? 0)}`
                  : "—"
              }
              icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
              alert={(kpis?.expired_count ?? 0) > 0}
            />
          </>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, SKU, code-barres..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value as ProductCategory); setPage(1); }}
              className="h-10 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">Toutes catégories</option>
              {Object.values(ProductCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {PRODUCT_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value as ProductStatus); setPage(1); }}
              className="h-10 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">Tous statuts</option>
              {Object.values(ProductStatus).map((s) => (
                <option key={s} value={s}>
                  {PRODUCT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner
          message="Impossible de charger les produits"
          onRetry={() => refetch()}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="Aucun produit trouvé"
          description={
            search || category || status
              ? "Essayez de modifier vos filtres de recherche."
              : "Ajoutez votre premier produit pour commencer."
          }
          actionLabel="Nouveau produit"
          onAction={() => router.push(buildPath("/inventory/products/new"))}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Produit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Catégorie
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Fabricant
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                      Statut
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                      onClick={() =>
                        router.push(buildPath(`/inventory/products/${typeof product.id === "string" && product.id.includes(":") ? product.id.split(":")[1] : product.id}`))
                      }
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.sku && `SKU: ${product.sku}`}
                            {product.sku && product.barcode && " | "}
                            {product.barcode && product.barcode}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {PRODUCT_CATEGORY_LABELS[product.category]}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {product.manufacturer}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-1">
                          {product.requires_prescription && (
                            <Badge variant="info" size="sm">Rx</Badge>
                          )}
                          {product.is_narcotic && (
                            <Badge variant="danger" size="sm">Ctrl</Badge>
                          )}
                          {product.is_cold_chain && (
                            <Badge variant="warning" size="sm">Froid</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={STATUS_BADGE_MAP[product.status] ?? "default"} size="sm">
                          {PRODUCT_STATUS_LABELS[product.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {products.map((product) => (
                <button
                  key={product.id}
                  className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  onClick={() =>
                    router.push(buildPath(`/inventory/products/${typeof product.id === "string" && product.id.includes(":") ? product.id.split(":")[1] : product.id}`))
                  }
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {product.manufacturer} • {PRODUCT_CATEGORY_LABELS[product.category]}
                      </p>
                    </div>
                    <Badge variant={STATUS_BADGE_MAP[product.status] ?? "default"} size="sm">
                      {PRODUCT_STATUS_LABELS[product.status]}
                    </Badge>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {product.requires_prescription && (
                      <Badge variant="info" size="sm">Rx</Badge>
                    )}
                    {product.is_narcotic && (
                      <Badge variant="danger" size="sm">Ctrl</Badge>
                    )}
                    {product.is_cold_chain && (
                      <Badge variant="warning" size="sm">Froid</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {(data?.total ?? 0) > 25 && (
              <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                <p className="text-xs text-slate-500">
                  Page {page} — {data?.total} produits
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={products.length < 25}
                    onClick={() => setPage(page + 1)}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function KPICard({
  label,
  value,
  icon,
  alert,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <Card className={alert ? "border-red-200 dark:border-red-800" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          {icon}
          {alert && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </CardContent>
    </Card>
  );
}
