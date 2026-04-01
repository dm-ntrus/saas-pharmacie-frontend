"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useInventoryKPIs,
  useExpirationRisk,
  useStockValuation,
  useInventoryAlerts,
  useCapacityDashboard,
  useDashboardChartsAll,
  useDashboardTimeline,
  useDashboardExportSummary,
} from "@/hooks/api/useInventory";
import { formatCurrency, formatNumber, formatDateTime } from "@/utils/formatters";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  EmptyState,
  ErrorBanner,
  Skeleton,
  BarChartWidget,
  LineChartWidget,
  PieChartWidget,
} from "@/components/ui";
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  RefreshCw,
  ShieldAlert,
  Download,
  MapPin,
} from "lucide-react";

export default function InventoryDashboardPage() {
  return (
    <ModuleGuard
      module="inventory"
      requiredPermissions={[Permission.INVENTORY_ITEMS_READ]}
    >
      <InventoryDashboardContent />
    </ModuleGuard>
  );
}

function InventoryDashboardContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [chartDays, setChartDays] = useState(30);

  const {
    data: kpis,
    isLoading: kpisLoading,
    error: kpisError,
    refetch: refetchKpis,
  } = useInventoryKPIs(chartDays);
  // Query results are loosely typed in apiService => cast locally for safe property access.
  const expirationRisk = useExpirationRisk().data as any;
  const stockValuation = useStockValuation().data as any;
  const { data: alerts } = useInventoryAlerts({ limit: 5, status: "active" });
  // `apiService.get()` is loosely typed, so the query result may infer `{}`.
  // We keep runtime identical but cast for safe property access below.
  const charts = useDashboardChartsAll(chartDays).data as any;
  const timeline = useDashboardTimeline(10).data as any;
  const { data: capacityDashboard } = useCapacityDashboard();
  const exportSummaryMutation = useDashboardExportSummary();

  const isLoading = kpisLoading;
  const error = kpisError;

  const categoryData: Record<string, unknown>[] =
    charts?.categoryDistribution?.data?.map((c: any) => ({
      name: c.category ?? c.name ?? c.label,
      value: c.value ?? c.total ?? c.count ?? 0,
    })) ?? [];

  const stockTrendData: Record<string, unknown>[] =
    charts?.stockTrend?.data?.map((d: any) => ({
      date: d.label ?? d.date,
      stock: d.value ?? d.total ?? 0,
    })) ?? [];

  const transactionVolumeData: Record<string, unknown>[] =
    charts?.transactionVolume?.data?.map((d: any) => ({
      date: d.label ?? d.date,
      entrées: d.incoming ?? d.in ?? 0,
      sorties: d.outgoing ?? d.out ?? 0,
    })) ?? [];

  const alertList = alerts?.data ?? [];
  const expiringCount =
    expirationRisk?.expiring_30_days ??
    expirationRisk?.expiringWithin30Days ??
    expirationRisk?.count ??
    0;
  const lowStockCount =
    kpis?.low_stock_count ?? 0;

  const dayOptions = [
    { value: 7, label: "7j" },
    { value: 30, label: "30j" },
    { value: 90, label: "90j" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Tableau de bord inventaire
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Vue d&apos;ensemble de votre stock et alertes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dayOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={chartDays === opt.value ? "primary" : "outline"}
              size="sm"
              onClick={() => setChartDays(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchKpis()}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Actualiser
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={exportSummaryMutation.isPending}
            onClick={async () => {
              try {
                const res = await exportSummaryMutation.mutateAsync();
                const blob = new Blob([JSON.stringify(res, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `inventory-dashboard-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              } catch {
                /* ignore */
              }
            }}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      ) : error ? (
        <ErrorBanner
          message="Impossible de charger le tableau de bord"
          onRetry={() => refetchKpis()}
        />
      ) : (
        <div className="space-y-6">
          {/* KPIGrid — 6 cartes (§11.2) */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard
              label="Total produits"
              value={formatNumber(kpis?.total_products ?? 0)}
              icon={<Package className="w-5 h-5 text-blue-600" />}
            />
            <KPICard
              label="Valeur totale du stock"
              value={formatCurrency(
                stockValuation?.totalValue ??
                  stockValuation?.total_value ??
                  kpis?.total_stock_value ??
                  0,
              )}
              icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
            />
            <KPICard
              label="Stock bas"
              value={lowStockCount}
              icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
              variant={lowStockCount > 0 ? "warning" : undefined}
            />
            <KPICard
              label="Péremption ≤30j"
              value={expiringCount}
              icon={<Clock className="w-5 h-5 text-red-600" />}
              variant={expiringCount > 0 ? "danger" : undefined}
            />
            <KPICard
              label="Taux de rotation"
              value={kpis?.turnover_rate != null ? formatNumber(kpis.turnover_rate as number) : "—"}
              icon={<TrendingUp className="w-5 h-5 text-slate-600" />}
            />
            <KPICard
              label="Alertes actives"
              value={alertList.length}
              icon={<ShieldAlert className="w-5 h-5 text-orange-500" />}
              variant={alertList.length > 0 ? "warning" : undefined}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {transactionVolumeData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Mouvements de stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChartWidget
                    data={transactionVolumeData}
                    xKey="date"
                    yKey={["entrées", "sorties"]}
                    height={280}
                  />
                </CardContent>
              </Card>
            ) : stockTrendData.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Tendance du stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChartWidget
                    data={stockTrendData}
                    xKey="date"
                    yKey="stock"
                    height={280}
                  />
                </CardContent>
              </Card>
            ) : null}

            {categoryData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChartWidget
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    height={300}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* HeatmapSection — Utilisation des emplacements (§11.2) */}
          {capacityDashboard?.locations && capacityDashboard.locations.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  Utilisation des emplacements
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => router.push(buildPath("/inventory/locations"))}>
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {(capacityDashboard.locations as any[]).slice(0, 24).map((loc: any) => {
                    const pct = Number(loc.utilization_percentage ?? loc.utilizationPercentage ?? 0);
                    const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-400" : pct >= 10 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-600";
                    return (
                      <div
                        key={loc.id}
                        className={`rounded-lg p-2 text-center text-xs ${color} ${pct >= 70 ? "text-white" : pct >= 10 ? "text-white" : "text-slate-600 dark:text-slate-400"}`}
                        title={`${loc.name ?? loc.code} — ${Math.round(pct)}%`}
                      >
                        <div className="font-medium truncate">{loc.code ?? loc.name}</div>
                        <div>{Math.round(pct)}%</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alerts summary + recent movements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alerts */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Alertes actives
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(buildPath("/inventory/alerts"))}
                >
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent>
                {alertList.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">
                    Aucune alerte active
                  </p>
                ) : (
                  <div className="space-y-2">
                    {alertList.map((alert: any, i: number) => (
                      <div
                        key={alert.id ?? i}
                        className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50"
                      >
                        <AlertTriangle
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            alert.severity === "critical"
                              ? "text-red-500"
                              : alert.severity === "high"
                                ? "text-amber-500"
                                : "text-blue-500"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {alert.title ?? alert.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {alert.product_name ?? alert.productName ?? ""}
                          </p>
                        </div>
                        <Badge
                          variant={
                            alert.severity === "critical"
                              ? "danger"
                              : alert.severity === "high"
                                ? "warning"
                                : "info"
                          }
                          size="sm"
                          className="shrink-0"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent movements */}
            <Card>
              <CardHeader>
                <CardTitle>Mouvements récents</CardTitle>
              </CardHeader>
              <CardContent>
                {!timeline || (Array.isArray(timeline) && timeline.length === 0) ? (
                  <p className="text-sm text-slate-500 py-4 text-center">
                    Aucun mouvement récent
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto">
                    {(Array.isArray(timeline) ? timeline : timeline?.events ?? [])
                      .slice(0, 10)
                      .map((event: any, i: number) => (
                        <div
                          key={event.id ?? i}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                              {event.description ?? event.action ?? event.type}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {formatDateTime(event.created_at ?? event.timestamp)}
                            </p>
                          </div>
                          <Badge variant="default" size="sm" className="shrink-0 capitalize">
                            {event.type ?? event.action ?? "—"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function KPICard({
  label,
  value,
  icon,
  variant,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "warning" | "danger";
}) {
  return (
    <Card
      className={
        variant === "danger"
          ? "border-red-200 dark:border-red-900/50"
          : variant === "warning"
            ? "border-amber-200 dark:border-amber-900/50"
            : ""
      }
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">{icon}</div>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
