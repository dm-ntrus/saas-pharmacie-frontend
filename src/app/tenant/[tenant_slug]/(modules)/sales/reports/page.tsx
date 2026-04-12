"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useSalesReport } from "@/hooks/api/useSales";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, BarChart3, DollarSign, ShoppingCart, TrendingUp, TrendingDown, Download, Calendar } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

export default function SalesReportsPage() {
  return (
    <ModuleGuard module="sales" requiredPermissions={[Permission.SALES_READ]}>
      <SalesReportsContent />
    </ModuleGuard>
  );
}

function SalesReportsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: report, isLoading, error, refetch } = useSalesReport(
    startDate,
    endDate,
  );
  const r = report as any;

  const reportTabs = [
    { key: "daily" as const, label: "Journalier" },
    { key: "weekly" as const, label: "Hebdomadaire" },
    { key: "monthly" as const, label: "Mensuel" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/sales"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Rapports de ventes</h1>
            <p className="text-sm text-slate-500 mt-1">Analyse detaillee des performances de vente</p>
          </div>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Exporter</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex gap-2">
              {reportTabs.map((tab) => (
                <Button key={tab.key} variant={reportType === tab.key ? "primary" : "outline"} size="sm" onClick={() => setReportType(tab.key)}>
                  {tab.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 flex-1 justify-end">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800" />
                <span className="text-slate-400">—</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger le rapport" onRetry={() => refetch()} />
      ) : r ? (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI label="Chiffre d'affaires" value={formatCurrency(r.total_revenue ?? r.totalRevenue ?? 0)} icon={<DollarSign className="w-5 h-5 text-emerald-600" />} />
            <KPI label="Nombre de ventes" value={r.total_sales ?? r.totalSales ?? 0} icon={<ShoppingCart className="w-5 h-5 text-blue-600" />} />
            <KPI label="Panier moyen" value={formatCurrency(r.average_basket ?? r.averageBasket ?? 0)} icon={<BarChart3 className="w-5 h-5 text-indigo-600" />} />
            <KPI
              label="Variation"
              value={`${r.growth_percent ?? r.growthPercent ?? 0}%`}
              icon={
                (r.growth_percent ?? r.growthPercent ?? 0) >= 0
                  ? <TrendingUp className="w-5 h-5 text-emerald-600" />
                  : <TrendingDown className="w-5 h-5 text-red-600" />
              }
            />
          </div>

          {/* Payment methods breakdown */}
          {r.by_payment_method && (
            <Card>
              <CardHeader><CardTitle>Par mode de paiement</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(r.by_payment_method).map(([method, data]: [string, any]) => (
                    <div key={method} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">{method.replace(/_/g, " ")}</p>
                        <p className="text-xs text-slate-500">{data.count ?? 0} transactions</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(data.total ?? data.amount ?? 0)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top products */}
          {r.top_products && Array.isArray(r.top_products) && (
            <Card>
              <CardHeader><CardTitle>Produits les plus vendus</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {r.top_products.slice(0, 10).map((product: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{product.name ?? product.product_name}</p>
                          <p className="text-xs text-slate-500">{product.quantity_sold ?? product.qty} unites</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold">{formatCurrency(product.revenue ?? product.total ?? 0)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <EmptyState icon={<BarChart3 className="w-8 h-8 text-slate-400" />} title="Aucun rapport" description="Selectionnez une periode pour generer un rapport." />
      )}
    </div>
  );
}

function KPI({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">{icon}</div>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </CardContent>
    </Card>
  );
}
