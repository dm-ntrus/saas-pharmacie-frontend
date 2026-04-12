"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "@/lib/i18n-simple";
import { useTenantPath } from "@/hooks/useTenantPath";
import {
  useProducts,
  useInventoryAlerts,
  useInventoryKPIs,
  useExpirationRisk,
  useStockTransfers,
} from "@/hooks/api/useInventory";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonCard,
  BarChartWidget,
  PieChartWidget,
} from "@/components/ui";
import {
  Package,
  AlertTriangle,
  Clock,
  Repeat,
  ClipboardCheck,
  Bell,
  Truck,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export function InventoryManagerDashboard() {
  const t = useTranslations("dashboardInventoryManager");
  const { buildPath } = useTenantPath();
  const { data: kpisData, isLoading: loadingKPIs } = useInventoryKPIs();
  const { data: alertsData, isLoading: loadingAlerts } = useInventoryAlerts({ status: "active", limit: 5 });
  const { data: expirationData, isLoading: loadingExpiration } = useExpirationRisk();
  const { data: transfersData, isLoading: loadingTransfers } = useStockTransfers({ status: "pending", limit: 5 });
  const { data: productsData, isLoading: loadingProducts } = useProducts({ limit: 1 });

  const isLoading = loadingKPIs || loadingAlerts || loadingExpiration || loadingTransfers || loadingProducts;

  const seriesIn = t("chart.in");
  const seriesOut = t("chart.out");
  const dayLabels = [
    t("days.mon"),
    t("days.tue"),
    t("days.wed"),
    t("days.thu"),
    t("days.fri"),
    t("days.sat"),
    t("days.sun"),
  ];
  const barMovementData = dayLabels.map((name) => ({
    name,
    [seriesIn]: 0,
    [seriesOut]: 0,
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const kpis = (kpisData as any)?.data ?? kpisData ?? {};
  const alerts = (alertsData as any)?.data ?? alertsData ?? [];
  const expiration = (expirationData as any)?.data ?? expirationData ?? {};
  const transfers = (transfersData as any)?.data ?? transfersData ?? [];
  const totalProducts = productsData?.total ?? (Array.isArray(productsData?.data) ? productsData.data.length : 0);

  const alertsList = Array.isArray(alerts) ? alerts : [];
  const transfersList = Array.isArray(transfers) ? transfers : [];
  const expiringCount = expiration?.count ?? expiration?.total ?? 0;

  const kpiCards = [
    {
      title: t("kpis.totalProducts"),
      value: (kpis.totalProducts ?? totalProducts ?? 0).toString(),
      icon: Package,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      title: t("kpis.lowStockAlerts"),
      value: (kpis.lowStockAlerts ?? alertsList.length).toString(),
      icon: AlertTriangle,
      color: alertsList.length > 0
        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      title: t("kpis.expiringSoon"),
      value: expiringCount.toString(),
      icon: Clock,
      color: expiringCount > 0
        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      title: t("kpis.pendingTransfers"),
      value: transfersList.length.toString(),
      icon: Repeat,
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
  ];

  const quickActions = [
    {
      title: t("quickActions.count.title"),
      description: t("quickActions.count.description"),
      icon: ClipboardCheck,
      href: buildPath("/inventory/counts/new"),
    },
    {
      title: t("quickActions.alerts.title"),
      description: t("quickActions.alerts.description", { count: alertsList.length }),
      icon: Bell,
      href: buildPath("/inventory/alerts"),
    },
    {
      title: t("quickActions.transfers.title"),
      description: t("quickActions.transfers.description"),
      icon: Truck,
      href: buildPath("/inventory/transfers"),
    },
  ];

  const alertTypeLabel = (type: string | undefined) => {
    if (type === "low_stock") return t("alertTypes.lowStock");
    if (type === "expiration") return t("alertTypes.expiration");
    return type ?? t("alertTypes.generic");
  };

  const severityLabel = (sev: string | undefined) => {
    if (sev === "critical") return t("severity.critical");
    if (sev === "warning") return t("severity.warning");
    return sev ?? t("severity.info");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{kpi.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          {t("quickActionsTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                    <action.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{action.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              {t("charts.stockMovements")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartWidget
              data={barMovementData}
              xKey="name"
              yKey={[seriesIn, seriesOut]}
              colors={["#10b981", "#f59e0b"]}
              height={260}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              {t("charts.alertDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartWidget
              data={[
                { name: t("pie.lowStock"), value: Number(kpis.lowStockAlerts ?? alertsList.length) || 0 },
                { name: t("pie.expiration"), value: expiringCount },
                { name: t("pie.transfers"), value: transfersList.length },
              ]}
              dataKey="value"
              nameKey="name"
              height={260}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {t("alerts.title")}
            </CardTitle>
            <Link
              href={buildPath("/inventory/alerts")}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              {t("seeAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {alertsList.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {alertsList.slice(0, 5).map((alert: any, idx: number) => (
                <div key={alert.id ?? idx} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {alert.productName || alert.product_name || alert.message || t("alertFallback", { n: idx + 1 })}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {alertTypeLabel(alert.type)}
                      {alert.currentStock != null && ` — ${t("stockLabel")}: ${alert.currentStock}`}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    alert.severity === "critical"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : alert.severity === "warning"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    {severityLabel(alert.severity)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("alerts.empty")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
