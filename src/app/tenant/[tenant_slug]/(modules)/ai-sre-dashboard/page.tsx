"use client";

import React, { useMemo, useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { BarChartWidget, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useAISreDashboard } from "@/hooks/api/useAI";
import { useTranslations } from "@/lib/i18n-simple";

export default function AISreDashboardPage() {
  return (
    <ModuleGuard module="analytics" requiredPermissions={[Permission.BI_READ]}>
      <AISreDashboardContent />
    </ModuleGuard>
  );
}

function AISreDashboardContent() {
  const t = useTranslations("ai");
  const [windowDays, setWindowDays] = useState(30);
  const dashboard = useAISreDashboard({ window_days: windowDays });
  const checks = dashboard.data?.readiness?.checks ?? {};
  const advancedChecks = dashboard.data?.health_advanced?.checks ?? {};
  const metrics = dashboard.data?.metrics ?? {};
  const latency = dashboard.data?.readiness?.latency_ms ?? {};

  const numericMetricData = useMemo(
    () =>
      Object.entries(metrics)
        .filter(([, value]) => typeof value === "number")
        .map(([name, value]) => ({ name, value: Number(value) })),
    [metrics],
  );

  const latencyData = useMemo(
    () => Object.entries(latency).map(([name, value]) => ({ name, value: Number(value) })),
    [latency],
  );

  const exportJson = () => {
    if (!dashboard.data) return;
    const blob = new Blob([JSON.stringify(dashboard.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-sre-dashboard-${windowDays}d.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    if (!dashboard.data) return;
    const rows = [
      ["section", "key", "value"],
      ...Object.entries(checks).map(([k, v]) => ["readiness.check", k, String(v)]),
      ...Object.entries(advancedChecks).map(([k, v]) => ["health_advanced.check", k, String(v)]),
      ...Object.entries(metrics).map(([k, v]) => ["metrics", k, typeof v === "object" ? JSON.stringify(v) : String(v)]),
      ...Object.entries(latency).map(([k, v]) => ["readiness.latency_ms", k, String(v)]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, `""`)}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-sre-dashboard-${windowDays}d.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("sreTitle")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("sreSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((days) => (
            <Button
              key={days}
              size="sm"
              variant={windowDays === days ? "primary" : "outline"}
              onClick={() => setWindowDays(days)}
            >
              {days}d
            </Button>
          ))}
          <Button variant="outline" onClick={() => dashboard.refetch()} disabled={dashboard.isFetching}>
            {t("refresh")}
          </Button>
          <Button variant="outline" onClick={exportJson} disabled={!dashboard.data}>
            {t("exportJson")}
          </Button>
          <Button variant="outline" onClick={exportCsv} disabled={!dashboard.data}>
            {t("exportCsv")}
          </Button>
        </div>
      </div>

      {dashboard.isLoading && <p className="text-sm text-slate-500">{t("loading")}</p>}
      {dashboard.error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-sm text-red-700">{t("loadError")}</p>
          <Button size="sm" variant="outline" onClick={() => dashboard.refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}

      {dashboard.data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("status")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{String(dashboard.data.readiness?.status ?? "unknown")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("readyChecks")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{Object.values(checks).filter(Boolean).length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("failedChecks")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">
                  {Object.values(checks).filter((value) => !value).length}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("healthAdvanced")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(advancedChecks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{key}</span>
                      <span className={value ? "text-emerald-600" : "text-red-600"}>
                        {value ? t("ok") : t("ko")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("readiness")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(checks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{key}</span>
                      <span className={value ? "text-emerald-600" : "text-red-600"}>
                        {value ? t("ok") : t("ko")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {latencyData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("latencyChart")}</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartWidget data={latencyData} xKey="name" yKey="value" height={260} />
              </CardContent>
            </Card>
          )}
          {numericMetricData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("metricsChart")}</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChartWidget data={numericMetricData} xKey="name" yKey="value" height={260} />
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>{t("tenantMetrics")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-xs text-slate-500">{key}</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100 break-all">
                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
      {!dashboard.isLoading && !dashboard.error && !dashboard.data && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("emptyState")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
