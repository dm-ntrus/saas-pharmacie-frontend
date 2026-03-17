"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useVaccinationDashboardMetrics,
  useVaccinationStats,
  useVaccinationColdChainDashboard,
  useVaccinationVialDashboard,
  useVaccinationProximityDashboard,
} from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton } from "@/components/ui";
import {
  Syringe,
  Thermometer,
  Package,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Snowflake,
  Activity,
} from "lucide-react";

export default function VaccinationDashboardPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <VaccinationDashboardContent />
    </ModuleGuard>
  );
}

function VaccinationDashboardContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } =
    useVaccinationDashboardMetrics();
  const { data: stats, isLoading: statsLoading } = useVaccinationStats("month");
  const { data: coldChain, isLoading: coldChainLoading } = useVaccinationColdChainDashboard();
  const { data: vialDashboard, isLoading: vialLoading } = useVaccinationVialDashboard();
  const { data: proximity, isLoading: proximityLoading } = useVaccinationProximityDashboard();

  const isLoading = metricsLoading || statsLoading;
  const error = metricsError;

  if (isLoading && !metrics && !stats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement du dashboard vaccination"
        onRetry={() => refetchMetrics()}
      />
    );
  }

  const metricsList = Array.isArray(metrics) ? metrics : [];
  const totalVaccinated =
    typeof stats?.totalVaccinations === "number"
      ? stats.totalVaccinations
      : Number((metricsList.find((m) => m.id === "total_vaccinated" || m.label?.toLowerCase().includes("vaccin"))?.value as string) ?? 0);
  const appointmentsToday =
    typeof stats?.todayVaccinations === "number"
      ? stats.todayVaccinations
      : Number(metricsList.find((m) => m.id === "appointments_today" || m.label?.toLowerCase().includes("rdv"))?.value ?? 0);
  const coldChainStatus = coldChain?.currentStatus ?? "optimal";
  const coldChainLabel =
    coldChainStatus === "optimal"
      ? "OK"
      : coldChainStatus === "warning"
        ? "Attention"
        : "Alerte";
  const dosesAvailable = vialDashboard?.dosesAvailable ?? 0;
  const activeAlerts = coldChain?.activeAlerts ?? 0;
  const proximityActive = proximity?.activeAlerts ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Vaccination
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dashboard vaccination, chaîne du froid et flacons
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(buildPath("/vaccination/appointments"))}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Syringe className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {totalVaccinated}
              </p>
              <p className="text-xs text-slate-500">Vaccinations (mois)</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(buildPath("/vaccination/appointments"))}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {appointmentsToday}
              </p>
              <p className="text-xs text-slate-500">RDV aujourd&apos;hui</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(buildPath("/vaccination/cold-chain"))}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                coldChainStatus === "critical"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : coldChainStatus === "warning"
                    ? "bg-amber-100 dark:bg-amber-900/30"
                    : "bg-green-100 dark:bg-green-900/30"
              }`}
            >
              <Snowflake
                className={`w-5 h-5 ${
                  coldChainStatus === "critical"
                    ? "text-red-600"
                    : coldChainStatus === "warning"
                      ? "text-amber-600"
                      : "text-green-600"
                }`}
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {coldChainLabel}
              </p>
              <p className="text-xs text-slate-500">Chaîne du froid</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(buildPath("/vaccination/vials"))}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {dosesAvailable}
              </p>
              <p className="text-xs text-slate-500">Doses disponibles</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(buildPath("/vaccination/cold-chain"))}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {activeAlerts}
              </p>
              <p className="text-xs text-slate-500">Alertes froid</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(buildPath("/vaccination/proximity-alerts"))}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {proximityActive}
              </p>
              <p className="text-xs text-slate-500">Alertes proximité</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Chaîne du froid
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(buildPath("/vaccination/cold-chain"))}
              >
                Voir tout
              </Button>
            </div>
            {coldChainLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="space-y-2 text-sm">
                <p>
                  Appareils en ligne :{" "}
                  <strong>{coldChain?.devicesOnline ?? 0}</strong> /{" "}
                  {coldChain?.totalDevices ?? 0}
                </p>
                <p>
                  Température moyenne :{" "}
                  <strong>{coldChain?.averageTemperature ?? "—"} °C</strong>
                </p>
                <p>
                  Alertes actives : <strong>{coldChain?.activeAlerts ?? 0}</strong>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Stock flacons
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(buildPath("/vaccination/vials"))}
              >
                Voir tout
              </Button>
            </div>
            {vialLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="space-y-2 text-sm">
                <p>
                  Flacons ouverts : <strong>{vialDashboard?.openVials ?? 0}</strong>
                </p>
                <p>
                  Expirent cette semaine :{" "}
                  <strong>{vialDashboard?.vialsExpiringThisWeek ?? 0}</strong>
                </p>
                <p>
                  Gaspillage ce mois :{" "}
                  <strong>{vialDashboard?.wastageThisMonth ?? 0}</strong> doses
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/vaccination/appointments/new"))}
          leftIcon={<Calendar className="w-4 h-4" />}
        >
          Nouveau RDV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/vaccination/vials/new"))}
          leftIcon={<Package className="w-4 h-4" />}
        >
          Enregistrer un flacon
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/vaccination/cold-chain"))}
          leftIcon={<Thermometer className="w-4 h-4" />}
        >
          Chaîne du froid
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/vaccination/injections"))}
          leftIcon={<Syringe className="w-4 h-4" />}
        >
          Registre injections
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/vaccination/compliance"))}
        >
          Conformité
        </Button>
      </div>
    </div>
  );
}
