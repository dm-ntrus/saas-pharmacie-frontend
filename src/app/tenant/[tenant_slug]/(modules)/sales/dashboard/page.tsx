"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useSalesDashboard,
  type DashboardPeriod,
} from "@/hooks/api/useSales";
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
  BarChart3,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Package,
  RefreshCw,
} from "lucide-react";

const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  today: "Aujourd'hui",
  week: "Semaine",
  month: "Mois",
  quarter: "Trimestre",
  year: "Année",
};

export default function SalesDashboardPage() {
  return (
    <ModuleGuard module="sales" requiredPermissions={[Permission.SALES_READ]}>
      <SalesDashboardContent />
    </ModuleGuard>
  );
}

function SalesDashboardContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [period, setPeriod] = useState<DashboardPeriod>("month");

  const { data: dashboard, isLoading, error, refetch } = useSalesDashboard(period);

  const kpis = dashboard?.kpis;
  const timeSeries = dashboard?.timeSeries;
  const topProducts = dashboard?.topProducts;
  const paymentMethods = dashboard?.paymentMethods;

  const hourlyData: Record<string, unknown>[] =
    timeSeries?.hourly?.map((h: any) => ({
      hour: `${String(h.hour ?? h.label).padStart(2, "0")}h`,
      ventes: h.count ?? h.sales ?? 0,
      revenue: h.revenue ?? h.amount ?? 0,
    })) ?? [];

  const trendData: Record<string, unknown>[] =
    timeSeries?.daily?.map((d: any) => ({
      date: d.label ?? d.date,
      revenue: d.revenue ?? d.amount ?? 0,
    })) ?? [];

  const paymentData: Record<string, unknown>[] = paymentMethods
    ? (Array.isArray(paymentMethods)
        ? paymentMethods
        : Object.entries(paymentMethods)
      ).map((item: any) => {
        if (Array.isArray(item)) {
          const [name, val] = item;
          return { name: String(name).replace(/_/g, " "), value: val?.total ?? val?.amount ?? val ?? 0 };
        }
        return { name: (item.method ?? item.name ?? "").replace(/_/g, " "), value: item.total ?? item.amount ?? 0 };
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/sales"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Tableau de bord des ventes
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Suivi en temps réel des performances de vente
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Actualiser
        </Button>
      </div>

      {/* Period filter */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(PERIOD_LABELS) as DashboardPeriod[]).map((p) => (
          <Button
            key={p}
            variant={period === p ? "primary" : "outline"}
            size="sm"
            onClick={() => setPeriod(p)}
          >
            {PERIOD_LABELS[p]}
          </Button>
        ))}
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
          onRetry={() => refetch()}
        />
      ) : !dashboard ? (
        <EmptyState
          icon={<BarChart3 className="w-8 h-8 text-slate-400" />}
          title="Aucune donnée"
          description="Les données du tableau de bord ne sont pas encore disponibles."
        />
      ) : (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              label="Ventes totales"
              value={formatNumber(kpis?.totalSales ?? kpis?.total_sales ?? 0)}
              icon={<ShoppingCart className="w-5 h-5 text-blue-600" />}
              trend={kpis?.salesGrowth ?? kpis?.sales_growth}
            />
            <KPICard
              label="Chiffre d'affaires"
              value={formatCurrency(kpis?.totalRevenue ?? kpis?.total_revenue ?? 0)}
              icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
              trend={kpis?.revenueGrowth ?? kpis?.revenue_growth}
            />
            <KPICard
              label="Panier moyen"
              value={formatCurrency(kpis?.averageBasket ?? kpis?.average_basket ?? 0)}
              icon={<BarChart3 className="w-5 h-5 text-indigo-600" />}
            />
            <KPICard
              label="Articles vendus"
              value={formatNumber(kpis?.totalItemsSold ?? kpis?.total_items_sold ?? 0)}
              icon={<Package className="w-5 h-5 text-amber-600" />}
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hourlyData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ventes par heure</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChartWidget
                    data={hourlyData}
                    xKey="hour"
                    yKey="ventes"
                    height={280}
                  />
                </CardContent>
              </Card>
            )}

            {trendData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tendance du chiffre d&apos;affaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChartWidget
                    data={trendData}
                    xKey="date"
                    yKey="revenue"
                    height={280}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment methods pie + top products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paymentData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par mode de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChartWidget
                    data={paymentData}
                    dataKey="value"
                    nameKey="name"
                    height={300}
                  />
                </CardContent>
              </Card>
            )}

            {topProducts && topProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Produits les plus vendus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {topProducts.slice(0, 10).map((product: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {product.name ?? product.product_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {product.quantity_sold ?? product.qty ?? 0} unités
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(product.revenue ?? product.total ?? 0)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Last updated */}
          {dashboard.lastUpdated && (
            <p className="text-xs text-slate-400 text-right">
              Mis à jour : {formatDateTime(dashboard.lastUpdated)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function KPICard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          {icon}
          {trend != null && (
            <Badge
              variant={trend >= 0 ? "success" : "danger"}
              size="sm"
              className="flex items-center gap-0.5"
            >
              {trend >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </Badge>
          )}
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
