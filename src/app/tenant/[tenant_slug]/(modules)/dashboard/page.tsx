"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { Role } from "@/types/roles";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonCard,
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
  Clock,
  DollarSign,
  Activity,
  Syringe,
  ClipboardCheck,
  UserCog,
  BarChart3,
} from "lucide-react";
import { AccountantDashboard } from "@/components/dashboards/AccountantDashboard";
import { HRDashboard } from "@/components/dashboards/HRDashboard";
import { InventoryManagerDashboard } from "@/components/dashboards/InventoryManagerDashboard";
import { QualityManagerDashboard } from "@/components/dashboards/QualityManagerDashboard";
import { PatientDashboard } from "@/components/dashboards/PatientDashboard";

function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  href,
  color = "emerald",
}: {
  title: string;
  value: string;
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
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {value}
            </p>
            {trend !== undefined && (
              <p
                className={`text-xs font-medium ${
                  trend >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend >= 0 ? "+" : ""}
                {trend}% {trendLabel || "vs hier"}
              </p>
            )}
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
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
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
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

  const isCashier = hasRole(Role.CASHIER) && !hasAnyPermission([Permission.ACCOUNTING_READ, Permission.EMPLOYEES_READ]);
  const isAccountant = hasRole(Role.ACCOUNTANT);
  const isHR = hasRole(Role.HR_MANAGER);
  const isInventoryManager = hasRole(Role.INVENTORY_MANAGER);
  const isQualityManager = hasRole(Role.QUALITY_MANAGER);
  const isPatient = hasRole(Role.PATIENT);

  if (isAccountant) return <AccountantDashboard />;
  if (isHR) return <HRDashboard />;
  if (isInventoryManager) return <InventoryManagerDashboard />;
  if (isQualityManager) return <QualityManagerDashboard />;
  if (isPatient) return <PatientDashboard />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {greeting}, {userName}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {currentOrganization?.name || "Pharmacie"} — Vue d&apos;ensemble de
          votre activité
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hasPermission(Permission.SALES_READ) && (
          <KPICard
            title="Ventes du jour"
            value="—"
            icon={ShoppingCart}
            color="emerald"
            href={buildPath("/sales")}
          />
        )}
        {hasPermission(Permission.SALES_READ) && (
          <KPICard
            title="Chiffre d'affaires"
            value="—"
            icon={DollarSign}
            color="blue"
          />
        )}
        {hasPermission(Permission.PRODUCTS_READ) && (
          <KPICard
            title="Produits en stock"
            value="—"
            icon={Package}
            color="indigo"
            href={buildPath("/inventory")}
          />
        )}
        {hasPermission(Permission.PATIENTS_READ) && (
          <KPICard
            title="Patients actifs"
            value="—"
            icon={Users}
            color="emerald"
            href={buildPath("/patients")}
          />
        )}
        {hasPermission(Permission.PRESCRIPTIONS_READ) && (
          <KPICard
            title="Ordonnances en attente"
            value="—"
            icon={FileText}
            color="amber"
            href={buildPath("/prescriptions")}
          />
        )}
        {hasPermission(Permission.INVENTORY_ALERTS_READ) && (
          <KPICard
            title="Alertes stock"
            value="—"
            icon={AlertTriangle}
            color="red"
            href={buildPath("/inventory/alerts")}
          />
        )}
        {isAccountant && (
          <KPICard
            title="CA mensuel"
            value="—"
            icon={TrendingUp}
            color="emerald"
            href={buildPath("/accounting")}
          />
        )}
        {isHR && (
          <KPICard
            title="Employés actifs"
            value="—"
            icon={UserCog}
            color="blue"
            href={buildPath("/hr")}
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
              href={buildPath("/sales/new")}
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

      {/* Charts */}
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
              <BarChartWidget
                data={[
                  { name: "Lun", ventes: 42 },
                  { name: "Mar", ventes: 58 },
                  { name: "Mer", ventes: 35 },
                  { name: "Jeu", ventes: 61 },
                  { name: "Ven", ventes: 73 },
                  { name: "Sam", ventes: 89 },
                  { name: "Dim", ventes: 24 },
                ]}
                xKey="name"
                yKey="ventes"
                height={260}
              />
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
              <AreaChartWidget
                data={[
                  { name: "Jan", revenue: 4250000 },
                  { name: "Fév", revenue: 3890000 },
                  { name: "Mar", revenue: 4780000 },
                  { name: "Avr", revenue: 5120000 },
                  { name: "Mai", revenue: 4950000 },
                  { name: "Jun", revenue: 5340000 },
                ]}
                xKey="name"
                yKey="revenue"
                height={260}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-600" />
                Ventes quotidiennes (30 derniers jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChartWidget
                data={[
                  { jour: "01", ventes: 38 },
                  { jour: "05", ventes: 52 },
                  { jour: "10", ventes: 47 },
                  { jour: "15", ventes: 63 },
                  { jour: "20", ventes: 55 },
                  { jour: "25", ventes: 71 },
                  { jour: "30", ventes: 68 },
                ]}
                xKey="jour"
                yKey="ventes"
                height={260}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                Répartition par catégorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChartWidget
                data={[
                  { name: "Médicaments", value: 45 },
                  { name: "Parapharmacie", value: 22 },
                  { name: "Cosmétique", value: 15 },
                  { name: "Matériel médical", value: 10 },
                  { name: "Autres", value: 8 },
                ]}
                dataKey="value"
                nameKey="name"
                height={260}
              />
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
