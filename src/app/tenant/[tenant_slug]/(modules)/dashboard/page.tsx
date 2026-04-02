"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { Role } from "@/types/roles";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  BarChartWidget,
  AreaChartWidget,
  LineChartWidget,
  PieChartWidget,
} from "@/components/ui";
import {
  ShoppingCart,
  Package,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Activity,
  Syringe,
  ClipboardCheck,
  UserCog,
  BarChart3,
} from "lucide-react";
import { PlanDowngradeBanner } from "@/components/billing/PlanDowngradeBanner";
import { AccountantDashboard } from "@/components/dashboards/AccountantDashboard";
import { HRDashboard } from "@/components/dashboards/HRDashboard";
import { InventoryManagerDashboard } from "@/components/dashboards/InventoryManagerDashboard";
import { QualityManagerDashboard } from "@/components/dashboards/QualityManagerDashboard";
import { PatientDashboard } from "@/components/dashboards/PatientDashboard";
import CashierDashboard from "@/components/dashboards/CashierDashboard";
import { useSalesDashboardKPIs, useSalesDashboardTimeseries, useSalesDashboardProducts } from "@/hooks/api/useSales";
import { useInventoryKPIs, useInventoryAlerts } from "@/hooks/api/useInventory";
import { usePatientSummary } from "@/hooks/api/usePatients";
import { usePrescriptionStats } from "@/hooks/api/usePrescriptions";
import { formatCurrency, formatNumber } from "@/utils/formatters";

function KPICard({
  title,
  value,
  loading,
  icon: Icon,
  trend,
  trendLabel,
  href,
  color = "emerald",
}: {
  title: string;
  value: string;
  loading?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  trendLabel?: string;
  href?: string;
  color?: "emerald" | "blue" | "amber" | "red" | "indigo";
}) {
  const colorMap = {
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  };

  const content = (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            )}
            {!loading && trend !== undefined && (
              <p
                className={`text-xs font-medium ${
                  trend >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend >= 0 ? "+" : ""}
                {trend.toFixed(1)}% {trendLabel || "vs hier"}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

function QuickAction({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all cursor-pointer group">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
            <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const { hasPermission, hasRole, hasAnyPermission } = usePermissions();
  const { buildPath } = useTenantPath();

  const greeting = getGreeting();
  const userName = user?.given_name || user?.name || "Utilisateur";

  // All hooks must be called unconditionally (React rules of hooks)
  const salesKPIs = useSalesDashboardKPIs("month");
  const inventoryKPIs = useInventoryKPIs(30);
  const patientSummary = usePatientSummary();
  const prescriptionStats = usePrescriptionStats();
  const inventoryAlerts = useInventoryAlerts({ limit: 1 });
  const salesTimeseries = useSalesDashboardTimeseries("week");
  const topProducts = useSalesDashboardProducts("month", 5);

  const isCashier =
    hasRole(Role.CASHIER) &&
    !hasAnyPermission([Permission.ACCOUNTING_READ, Permission.EMPLOYEES_READ]);
  const isAccountant = hasRole(Role.ACCOUNTANT);
  const isHR = hasRole(Role.HR_MANAGER);
  const isInventoryManager = hasRole(Role.INVENTORY_MANAGER);
  const isQualityManager = hasRole(Role.QUALITY_MANAGER);
  const isPatient = hasRole(Role.PATIENT);

  if (isCashier) return <CashierDashboard />;
  if (isAccountant) return <AccountantDashboard />;
  if (isHR) return <HRDashboard />;
  if (isInventoryManager) return <InventoryManagerDashboard />;
  if (isQualityManager) return <QualityManagerDashboard />;
  if (isPatient) return <PatientDashboard />;

  // Extract KPI values safely
  const kpis = (salesKPIs.data as any)?.kpis || {};
  const invKpis = (inventoryKPIs.data as any) || {};
  const patSummary = (patientSummary.data as any) || {};
  const rxStats = (prescriptionStats.data as any) || {};
  const alertCount = (inventoryAlerts.data as any)?.total ?? (inventoryAlerts.data as any)?.length ?? 0;

  const todaySalesCount = kpis.totalSales ?? kpis.salesCount ?? 0;
  const todayRevenue = kpis.totalRevenue ?? kpis.revenue ?? 0;
  const productCount = invKpis.totalProducts ?? invKpis.productCount ?? 0;
  const activePatients = patSummary.total ?? patSummary.activeCount ?? 0;
  const pendingRx = rxStats.pending ?? rxStats.pendingCount ?? 0;

  // Timeseries data for charts
  const timeseriesData = (salesTimeseries.data as any)?.timeSeries || [];
  const topProductsData = (topProducts.data as any)?.products || (topProducts.data as any)?.items || [];

  const anyLoading = salesKPIs.isLoading;

  const dashSearchParams = useSearchParams();
  const crossTenantBlocked = dashSearchParams?.get("cross_tenant_blocked");

  return (
    <div className="space-y-6">
      <PlanDowngradeBanner />

      {crossTenantBlocked && (
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <span className="font-semibold shrink-0">Organisation incorrecte :</span>
          <span>
            Vous avez tenté d&apos;accéder à <strong>{crossTenantBlocked}</strong>.
            Vous avez été redirigé vers votre propre organisation.
          </span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {greeting}, {userName}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {currentOrganization?.name || "Pharmacie"} — Vue d&apos;ensemble de votre activité
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {hasPermission(Permission.SALES_READ) && (
          <KPICard
            title="Ventes du jour"
            value={formatNumber(todaySalesCount)}
            loading={anyLoading}
            icon={ShoppingCart}
            color="emerald"
            href={buildPath("/sales")}
          />
        )}
        {hasPermission(Permission.SALES_READ) && (
          <KPICard
            title="Chiffre d'affaires"
            value={formatCurrency(todayRevenue)}
            loading={anyLoading}
            icon={DollarSign}
            color="blue"
          />
        )}
        {hasPermission(Permission.PRODUCTS_READ) && (
          <KPICard
            title="Produits en stock"
            value={formatNumber(productCount)}
            loading={inventoryKPIs.isLoading}
            icon={Package}
            color="indigo"
            href={buildPath("/inventory")}
          />
        )}
        {hasPermission(Permission.PATIENTS_READ) && (
          <KPICard
            title="Patients actifs"
            value={formatNumber(activePatients)}
            loading={patientSummary.isLoading}
            icon={Users}
            color="emerald"
            href={buildPath("/patients")}
          />
        )}
        {hasPermission(Permission.PRESCRIPTIONS_READ) && (
          <KPICard
            title="Ordonnances en attente"
            value={formatNumber(pendingRx)}
            loading={prescriptionStats.isLoading}
            icon={FileText}
            color="amber"
            href={buildPath("/prescriptions")}
          />
        )}
        {hasPermission(Permission.INVENTORY_ALERTS_READ) && (
          <KPICard
            title="Alertes stock"
            value={formatNumber(alertCount)}
            loading={inventoryAlerts.isLoading}
            icon={AlertTriangle}
            color="red"
            href={buildPath("/inventory/alerts")}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {hasPermission(Permission.SALES_CREATE) && (
            <QuickAction
              title="Nouvelle vente"
              description="Démarrer une vente rapide"
              icon={ShoppingCart}
              href={buildPath("/sales/pos")}
            />
          )}
          {hasPermission(Permission.PRESCRIPTIONS_WRITE) && (
            <QuickAction
              title="Nouvelle ordonnance"
              description="Enregistrer une prescription"
              icon={FileText}
              href={buildPath("/prescriptions")}
            />
          )}
          {hasPermission(Permission.PATIENTS_WRITE) && (
            <QuickAction
              title="Nouveau patient"
              description="Ajouter un patient"
              icon={Users}
              href={buildPath("/patients/new")}
            />
          )}
          {hasPermission(Permission.PRODUCTS_CREATE) && (
            <QuickAction
              title="Nouveau produit"
              description="Ajouter au catalogue"
              icon={Package}
              href={buildPath("/inventory/products/new")}
            />
          )}
          {hasPermission(Permission.VACCINATION_WRITE) && (
            <QuickAction
              title="Vaccination"
              description="Planifier un rendez-vous"
              icon={Syringe}
              href={buildPath("/vaccination")}
            />
          )}
          {hasPermission(Permission.QUALITY_EVENTS_CREATE) && (
            <QuickAction
              title="Événement qualité"
              description="Signaler un incident"
              icon={ClipboardCheck}
              href={buildPath("/quality")}
            />
          )}
          {hasPermission(Permission.BI_READ) && (
            <QuickAction
              title="Rapports"
              description="Consulter les analytics"
              icon={BarChart3}
              href={buildPath("/analytics")}
            />
          )}
        </div>
      </div>

      {/* Charts — wired to real data with fallback */}
      {hasPermission(Permission.SALES_READ) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Ventes de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              {salesTimeseries.isLoading ? (
                <Skeleton className="h-[260px] w-full rounded-lg" />
              ) : (
                <BarChartWidget
                  data={
                    timeseriesData.length > 0
                      ? timeseriesData.map((d: any) => ({
                          name: d.date || d.label || d.day || "",
                          ventes: d.count ?? d.sales ?? d.value ?? 0,
                        }))
                      : [
                          { name: "Lun", ventes: 0 },
                          { name: "Mar", ventes: 0 },
                          { name: "Mer", ventes: 0 },
                          { name: "Jeu", ventes: 0 },
                          { name: "Ven", ventes: 0 },
                          { name: "Sam", ventes: 0 },
                          { name: "Dim", ventes: 0 },
                        ]
                  }
                  xKey="name"
                  yKey="ventes"
                  height={260}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Tendance du chiffre d&apos;affaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              {salesTimeseries.isLoading ? (
                <Skeleton className="h-[260px] w-full rounded-lg" />
              ) : (
                <AreaChartWidget
                  data={
                    timeseriesData.length > 0
                      ? timeseriesData.map((d: any) => ({
                          name: d.date || d.label || d.day || "",
                          revenue: d.revenue ?? d.totalAmount ?? 0,
                        }))
                      : [{ name: "—", revenue: 0 }]
                  }
                  xKey="name"
                  yKey="revenue"
                  height={260}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-600" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {salesTimeseries.isLoading ? (
                <Skeleton className="h-[260px] w-full rounded-lg" />
              ) : (
                <LineChartWidget
                  data={
                    timeseriesData.length > 0
                      ? timeseriesData.map((d: any) => ({
                          jour: d.date || d.label || "",
                          ventes: d.count ?? d.sales ?? 0,
                        }))
                      : [{ jour: "—", ventes: 0 }]
                  }
                  xKey="jour"
                  yKey="ventes"
                  height={260}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                Top produits vendus
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.isLoading ? (
                <Skeleton className="h-[260px] w-full rounded-lg" />
              ) : (
                <PieChartWidget
                  data={
                    topProductsData.length > 0
                      ? topProductsData.map((p: any) => ({
                          name: p.name || p.productName || "Produit",
                          value: p.totalQuantity ?? p.count ?? p.value ?? 0,
                        }))
                      : [{ name: "Aucune donnée", value: 1 }]
                  }
                  dataKey="value"
                  nameKey="name"
                  height={260}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}
