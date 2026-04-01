"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import apiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, BarChart3, TrendingDown, TrendingUp, Package, AlertTriangle, Calendar, DollarSign, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function InventoryReportsPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.INVENTORY_ITEMS_READ]}>
      <ReportsContent />
    </ModuleGuard>
  );
}

function ReportsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { currentOrganization } = useOrganization();
  const pharmacyId = currentOrganization?.id ?? "";
  const [activeReport, setActiveReport] = useState<"kpi" | "expiring" | "turnover" | "valuation">("kpi");

  const kpisQuery = useQuery({
    queryKey: ["inventory-kpis", pharmacyId],
    queryFn: () => apiService.get(`/pharmacies/${pharmacyId}/inventory/kpis`),
    enabled: !!pharmacyId && activeReport === "kpi",
  });
  const kpis = kpisQuery.data as any;
  const loadingKpis = kpisQuery.isLoading;

  const expiring = (useQuery({
    queryKey: ["inventory-expiring", pharmacyId],
    queryFn: () => apiService.get(`/pharmacies/${pharmacyId}/inventory/kpis/expiration-risk`),
    enabled: !!pharmacyId && activeReport === "expiring",
  }).data as any);

  const turnover = (useQuery({
    queryKey: ["inventory-turnover", pharmacyId],
    queryFn: () => apiService.get(`/pharmacies/${pharmacyId}/inventory/kpis/turnover`),
    enabled: !!pharmacyId && activeReport === "turnover",
  }).data as any);

  const valuation = (useQuery({
    queryKey: ["inventory-valuation", pharmacyId],
    queryFn: () => apiService.get(`/pharmacies/${pharmacyId}/inventory/kpis/stock-valuation`),
    enabled: !!pharmacyId && activeReport === "valuation",
  }).data as any);

  const tabs = [
    { key: "kpi" as const, label: "KPIs", icon: BarChart3 },
    { key: "expiring" as const, label: "Expirations", icon: Calendar },
    { key: "turnover" as const, label: "Rotation", icon: TrendingUp },
    { key: "valuation" as const, label: "Valorisation", icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>Retour</Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Rapports inventaire</h1>
            <p className="text-sm text-slate-500 mt-1">Analyse et indicateurs de performance du stock</p>
          </div>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Exporter</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <Button key={t.key} variant={activeReport === t.key ? "primary" : "outline"} size="sm" onClick={() => setActiveReport(t.key)} leftIcon={<t.icon className="w-4 h-4" />}>
            {t.label}
          </Button>
        ))}
      </div>

      {activeReport === "kpi" && (
        loadingKpis ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div> : kpis ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard label="Produits actifs" value={kpis.active_products ?? "—"} icon={<Package className="w-5 h-5 text-emerald-600" />} />
            <KPICard label="Ruptures de stock" value={kpis.out_of_stock ?? "—"} icon={<AlertTriangle className="w-5 h-5 text-red-600" />} alert={kpis.out_of_stock > 0} />
            <KPICard label="Stock bas" value={kpis.low_stock ?? "—"} icon={<TrendingDown className="w-5 h-5 text-amber-600" />} alert={kpis.low_stock > 0} />
            <KPICard label="Valeur totale" value={formatCurrency(kpis.total_value ?? 0)} icon={<DollarSign className="w-5 h-5 text-blue-600" />} />
          </div>
        ) : <EmptyState title="Aucune donnée" description="KPIs non disponibles pour cette pharmacie." />
      )}

      {activeReport === "expiring" && (
        <Card>
          <CardHeader><CardTitle>Produits à risque d'expiration</CardTitle></CardHeader>
          <CardContent>
            {!expiring || (Array.isArray(expiring) && expiring.length === 0) ? (
              <EmptyState title="Aucun produit" description="Aucun produit proche de la date d'expiration." />
            ) : (
              <div className="space-y-3">
                {(Array.isArray(expiring) ? expiring : []).map((item: any, i: number) => (
                  <div key={item.id ?? i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <div><p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.name ?? item.product_name}</p><p className="text-xs text-slate-500">Lot: {item.batch_number ?? "—"}</p></div>
                    <div className="text-right"><Badge variant={item.days_until_expiry <= 30 ? "danger" : item.days_until_expiry <= 90 ? "warning" : "default"} size="sm">{item.days_until_expiry}j</Badge><p className="text-xs text-slate-500 mt-1">{formatDate(item.expiry_date)}</p></div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeReport === "turnover" && (
        <Card>
          <CardHeader><CardTitle>Rotation des stocks</CardTitle></CardHeader>
          <CardContent>
            {!turnover || (Array.isArray(turnover) && turnover.length === 0) ? (
              <EmptyState title="Aucune donnée" description="Données de rotation non disponibles." />
            ) : (
              <div className="space-y-3">
                {(Array.isArray(turnover) ? turnover : []).map((item: any, i: number) => (
                  <div key={item.id ?? i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <div><p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.name ?? item.product_name}</p><p className="text-xs text-slate-500">Catégorie: {item.category ?? "—"}</p></div>
                    <div className="text-right"><p className="text-sm font-bold">{item.turnover_rate?.toFixed(2) ?? "—"}</p><p className="text-xs text-slate-500">Taux de rotation</p></div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeReport === "valuation" && (
        <Card>
          <CardHeader><CardTitle>Valorisation du stock</CardTitle></CardHeader>
          <CardContent>
            {!valuation ? (
              <EmptyState title="Aucune donnée" description="Valorisation non disponible." />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20"><p className="text-xs text-emerald-700 dark:text-emerald-400">Valeur totale</p><p className="text-xl font-bold text-emerald-800 dark:text-emerald-300">{formatCurrency(valuation.total_value ?? 0)}</p></div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20"><p className="text-xs text-blue-700 dark:text-blue-400">Coût moyen</p><p className="text-xl font-bold text-blue-800 dark:text-blue-300">{formatCurrency(valuation.average_cost ?? 0)}</p></div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20"><p className="text-xs text-amber-700 dark:text-amber-400">Stock mort</p><p className="text-xl font-bold text-amber-800 dark:text-amber-300">{formatCurrency(valuation.dead_stock_value ?? 0)}</p></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function KPICard({ label, value, icon, alert }: { label: string; value: string | number; icon: React.ReactNode; alert?: boolean }) {
  return (
    <Card className={alert ? "border-red-200 dark:border-red-800" : ""}>
      <CardContent className="p-4"><div className="flex items-center justify-between mb-2">{icon}{alert && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}</div><p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p><p className="text-xs text-slate-500">{label}</p></CardContent>
    </Card>
  );
}
