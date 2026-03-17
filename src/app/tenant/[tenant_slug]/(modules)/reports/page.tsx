"use client";

import React, { useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import apiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, EmptyState, ErrorBanner, Skeleton, BarChartWidget, LineChartWidget, PieChartWidget } from "@/components/ui";
import { BarChart3, FileText, TrendingUp, DollarSign, Package, Users, Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  return (
    <ModuleGuard module="analytics" requiredPermissions={[Permission.DASHBOARDS_READ]}>
      <ReportsContent />
    </ModuleGuard>
  );
}

type ReportType = "sales" | "inventory" | "financial" | "patients";

function ReportsContent() {
  const { currentOrganization } = useOrganization();
  const pharmacyId = currentOrganization?.id ?? "";
  const [activeReport, setActiveReport] = useState<ReportType>("sales");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const { data: salesReport, isLoading: loadingSales } = useQuery({
    queryKey: ["report-sales", pharmacyId, dateRange],
    queryFn: () => apiService.get(`/pharmacies/${pharmacyId}/sales/reports/daily`, { params: { startDate: dateRange.start || undefined, endDate: dateRange.end || undefined } }),
    enabled: !!pharmacyId && activeReport === "sales",
  });

  const { data: inventoryReport, isLoading: loadingInventory } = useQuery({
    queryKey: ["report-inventory", pharmacyId],
    queryFn: () => apiService.get(`/pharmacies/${pharmacyId}/inventory/kpis`),
    enabled: !!pharmacyId && activeReport === "inventory",
  });

  const tabs: { key: ReportType; label: string; icon: React.ComponentType<any> }[] = [
    { key: "sales", label: "Ventes", icon: DollarSign },
    { key: "inventory", label: "Inventaire", icon: Package },
    { key: "financial", label: "Financier", icon: TrendingUp },
    { key: "patients", label: "Patients", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Rapports</h1>
          <p className="text-sm text-slate-500 mt-1">Rapports globaux et analyses de performance</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Exporter</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 flex gap-2 flex-wrap">
              {tabs.map((t) => (
                <Button key={t.key} variant={activeReport === t.key ? "primary" : "outline"} size="sm" onClick={() => setActiveReport(t.key)} leftIcon={<t.icon className="w-4 h-4" />}>
                  {t.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="date" value={dateRange.start} onChange={(e) => setDateRange((p) => ({ ...p, start: e.target.value }))} className="h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800" />
              <input type="date" value={dateRange.end} onChange={(e) => setDateRange((p) => ({ ...p, end: e.target.value }))} className="h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800" />
            </div>
          </div>
        </CardContent>
      </Card>

      {activeReport === "sales" && (
        loadingSales ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div> : salesReport ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPI label="Chiffre d'affaires" value={formatCurrency(salesReport.total_revenue ?? 0)} icon={<DollarSign className="w-5 h-5 text-emerald-600" />} />
              <KPI label="Nombre de ventes" value={salesReport.total_sales ?? "—"} icon={<FileText className="w-5 h-5 text-blue-600" />} />
              <KPI label="Panier moyen" value={formatCurrency(salesReport.average_basket ?? 0)} icon={<BarChart3 className="w-5 h-5 text-indigo-600" />} />
              <KPI label="Remboursements" value={formatCurrency(salesReport.total_refunds ?? 0)} icon={<TrendingUp className="w-5 h-5 text-red-600" />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Évolution du chiffre d&apos;affaires</CardTitle></CardHeader>
                <CardContent>
                  {salesReport.daily_data && Array.isArray(salesReport.daily_data) && salesReport.daily_data.length > 0 ? (
                    <LineChartWidget
                      data={salesReport.daily_data.map((day: any, i: number) => ({
                        date: day.date ? formatDate(day.date) : `J${i + 1}`,
                        revenue: day.revenue ?? 0,
                      }))}
                      xKey="date"
                      yKey="revenue"
                      height={280}
                    />
                  ) : <EmptyState title="Aucune donnée" description="Sélectionnez une période pour voir le graphique." />}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Nombre de ventes par jour</CardTitle></CardHeader>
                <CardContent>
                  {salesReport.daily_data && Array.isArray(salesReport.daily_data) && salesReport.daily_data.length > 0 ? (
                    <BarChartWidget
                      data={salesReport.daily_data.map((day: any, i: number) => ({
                        date: day.date ? formatDate(day.date) : `J${i + 1}`,
                        count: day.count ?? 0,
                      }))}
                      xKey="date"
                      yKey="count"
                      height={280}
                    />
                  ) : <EmptyState title="Aucune donnée" description="Sélectionnez une période pour voir le graphique." />}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Détails quotidiens</CardTitle></CardHeader>
              <CardContent>
                {salesReport.daily_data && Array.isArray(salesReport.daily_data) && salesReport.daily_data.length > 0 ? (
                  <div className="space-y-2">{salesReport.daily_data.map((day: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{day.date ? formatDate(day.date) : `Jour ${i + 1}`}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(day.revenue ?? 0)}</span>
                        <span className="text-xs text-slate-500 ml-2">({day.count ?? 0} ventes)</span>
                      </div>
                    </div>
                  ))}</div>
                ) : <EmptyState title="Aucune donnée" description="Sélectionnez une période pour voir les rapports." />}
              </CardContent>
            </Card>
          </div>
        ) : <EmptyState title="Aucun rapport" description="Les rapports de ventes seront disponibles une fois les donnees chargees." />
      )}

      {activeReport === "inventory" && (
        loadingInventory ? <Skeleton className="h-40 w-full rounded-xl" /> : inventoryReport ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPI label="Produits actifs" value={inventoryReport.active_products ?? "—"} icon={<Package className="w-5 h-5 text-emerald-600" />} />
              <KPI label="Ruptures de stock" value={inventoryReport.out_of_stock ?? "—"} icon={<Package className="w-5 h-5 text-red-600" />} alert />
              <KPI label="Stock bas" value={inventoryReport.low_stock ?? "—"} icon={<Package className="w-5 h-5 text-amber-600" />} />
              <KPI label="Valeur totale" value={formatCurrency(inventoryReport.total_value ?? 0)} icon={<DollarSign className="w-5 h-5 text-blue-600" />} />
            </div>
            <Card>
              <CardHeader><CardTitle>État du stock</CardTitle></CardHeader>
              <CardContent>
                <PieChartWidget
                  data={[
                    { name: "En stock", value: Number(inventoryReport.active_products ?? 0) - Number(inventoryReport.low_stock ?? 0) - Number(inventoryReport.out_of_stock ?? 0) },
                    { name: "Stock bas", value: Number(inventoryReport.low_stock ?? 0) },
                    { name: "Rupture", value: Number(inventoryReport.out_of_stock ?? 0) },
                  ].filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  height={280}
                  colors={["#10b981", "#f59e0b", "#ef4444"]}
                />
              </CardContent>
            </Card>
          </div>
        ) : <EmptyState title="Aucun rapport" description="Les rapports d&apos;inventaire seront disponibles une fois les données chargées." />
      )}

      {activeReport === "financial" && (
        <Card><CardContent className="p-12"><EmptyState icon={<TrendingUp className="w-8 h-8 text-slate-400" />} title="Rapports financiers" description="Les rapports financiers detailles sont disponibles dans le module Comptabilite." /></CardContent></Card>
      )}

      {activeReport === "patients" && (
        <Card><CardContent className="p-12"><EmptyState icon={<Users className="w-8 h-8 text-slate-400" />} title="Rapports patients" description="Les rapports patients sont disponibles dans le module Patients." /></CardContent></Card>
      )}
    </div>
  );
}

function KPI({ label, value, icon, alert }: { label: string; value: string | number; icon: React.ReactNode; alert?: boolean }) {
  return (
    <Card className={alert ? "border-red-200 dark:border-red-800" : ""}>
      <CardContent className="p-4"><div className="flex items-center justify-between mb-2">{icon}{alert && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}</div><p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p><p className="text-xs text-slate-500">{label}</p></CardContent>
    </Card>
  );
}
