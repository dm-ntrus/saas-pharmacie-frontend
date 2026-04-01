"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import { useTenantPath } from "@/hooks/useTenantPath";
import { formatCurrency, formatNumber, formatDate, formatDateTime, formatPercent } from "@/utils/formatters";
import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Button, Input, Modal, Select,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Skeleton, EmptyState, ErrorBanner,
  DatePicker,
  BarChartWidget, LineChartWidget, AreaChartWidget,
} from "@/components/ui";
import {
  Truck, TrendingUp, Package, AlertTriangle,
  Plus, Search, Eye, Clock, Target,
  ArrowUpDown, BarChart3, Activity, Bell,
  CheckCircle, XCircle, RefreshCw, Shield,
  Gauge,   ShoppingCart, Calendar, ScrollText, ClipboardList,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { toast } from "react-hot-toast";

// ─── Hooks (inline) ────────────────────────────────────────

function usePharmacyId() {
  const { currentOrganization } = useOrganization();
  return currentOrganization?.id ?? "";
}

function useSupplyChainDashboard() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supply-chain-dashboard", pid],
    queryFn: () => apiService.get(`/pharmacies/${pid}/supply-chain/dashboard`),
    enabled: !!pid,
  });
}

function useDemandForecasts(params?: { startDate?: string; endDate?: string }) {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["demand-forecasts", pid, params],
    queryFn: () => apiService.get(`/pharmacies/${pid}/supply-chain/demand-forecasts`, { params }),
    enabled: !!pid,
  });
}

function useCreateDemandForecast() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`/pharmacies/${pid}/supply-chain/demand-forecasts`, data),
    onSuccess: () => {
      toast.success("Prévision créée");
      qc.invalidateQueries({ queryKey: ["demand-forecasts"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useInventoryPolicies() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["inventory-policies", pid],
    queryFn: () => apiService.get(`/pharmacies/${pid}/supply-chain/inventory-policies`),
    enabled: !!pid,
  });
}

function useCreateInventoryPolicy() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiService.post(`/pharmacies/${pid}/supply-chain/inventory-policies`, data),
    onSuccess: () => {
      toast.success("Politique créée");
      qc.invalidateQueries({ queryKey: ["inventory-policies"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useUpdateInventoryPolicy() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiService.patch(`/pharmacies/${pid}/supply-chain/inventory-policies/${id}`, data),
    onSuccess: () => {
      toast.success("Politique mise à jour");
      qc.invalidateQueries({ queryKey: ["inventory-policies"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

function useSupplyChainAlerts() {
  const pid = usePharmacyId();
  return useQuery({
    queryKey: ["supply-chain-alerts", pid],
    queryFn: () => apiService.get(`/pharmacies/${pid}/supply-chain/alerts`),
    enabled: !!pid,
  });
}

function useAcknowledgeAlert() {
  const pid = usePharmacyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) =>
      apiService.patch(`/pharmacies/${pid}/supply-chain/alerts/${alertId}/acknowledge`, {}),
    onSuccess: () => {
      toast.success("Alerte acquittée");
      qc.invalidateQueries({ queryKey: ["supply-chain-alerts"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Page ──────────────────────────────────────────────────

export default function SupplyChainPage() {
  return (
    <ModuleGuard module="supply-chain" requiredPermissions={[Permission.SUPPLY_CHAIN_READ]}>
      <SupplyChainContent />
    </ModuleGuard>
  );
}

function SupplyChainContent() {
  const { buildPath } = useTenantPath();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Supply Chain</h1>
          <p className="text-sm text-slate-500 mt-1">Gestion de la chaîne d&apos;approvisionnement</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <Link href={buildPath("/supply-chain/purchase-orders")} className="inline-flex items-center gap-1.5 font-medium text-emerald-600 hover:underline">
            <ShoppingCart className="w-4 h-4" /> Commandes
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link href={buildPath("/supply-chain/purchase-requests")} className="inline-flex items-center gap-1.5 font-medium text-emerald-600 hover:underline">
            <ClipboardList className="w-4 h-4" /> Réquisitions
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link href={buildPath("/supply-chain/supplier-quotes")} className="inline-flex items-center gap-1.5 font-medium text-emerald-600 hover:underline">
            <ScrollText className="w-4 h-4" /> Devis
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link href={buildPath("/supply-chain/performance")} className="inline-flex items-center gap-1.5 font-medium text-emerald-600 hover:underline">
            <TrendingUp className="w-4 h-4" /> Performance
          </Link>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard" className="gap-1.5">
            <BarChart3 className="w-4 h-4" />Dashboard
          </TabsTrigger>
          <TabsTrigger value="forecasts" className="gap-1.5">
            <TrendingUp className="w-4 h-4" />Prévisions
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-1.5">
            <Shield className="w-4 h-4" />Politiques
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-1.5">
            <AlertTriangle className="w-4 h-4" />Alertes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard"><SCDashboardTab /></TabsContent>
        <TabsContent value="forecasts"><ForecastsTab /></TabsContent>
        <TabsContent value="policies"><PoliciesTab /></TabsContent>
        <TabsContent value="alerts"><AlertsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 1 — Dashboard
// ═══════════════════════════════════════════════════════════════

function SCDashboardTab() {
  const { data: dashData, isLoading, error, refetch } = useSupplyChainDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message="Impossible de charger le dashboard" onRetry={() => refetch()} />;
  }

  const dashboard = dashData?.data ?? dashData ?? {};

  const leadTimeData: Record<string, unknown>[] = dashboard.lead_times ?? [
    { fournisseur: "PharmaCorp", jours: 3 },
    { fournisseur: "MedSupply", jours: 5 },
    { fournisseur: "HealthDist", jours: 4 },
    { fournisseur: "BioLab", jours: 7 },
    { fournisseur: "GeneriPharma", jours: 2 },
  ];

  const orderFrequency: Record<string, unknown>[] = dashboard.order_frequency ?? [
    { mois: "Jan", commandes: 12 },
    { mois: "Fév", commandes: 15 },
    { mois: "Mar", commandes: 18 },
    { mois: "Avr", commandes: 14 },
    { mois: "Mai", commandes: 22 },
    { mois: "Jun", commandes: 19 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SCKpiCard
          label="Délai moyen"
          value={dashboard.avg_lead_time ? `${dashboard.avg_lead_time} j` : "4.2 j"}
          icon={<Clock className="w-5 h-5" />}
          color="text-blue-600 bg-blue-50 dark:bg-blue-900/30"
        />
        <SCKpiCard
          label="Taux de service"
          value={dashboard.fill_rate ? `${dashboard.fill_rate}%` : "94.5%"}
          icon={<Target className="w-5 h-5" />}
          color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"
        />
        <SCKpiCard
          label="Commandes actives"
          value={dashboard.active_orders != null ? formatNumber(dashboard.active_orders) : "8"}
          icon={<ShoppingCart className="w-5 h-5" />}
          color="text-amber-600 bg-amber-50 dark:bg-amber-900/30"
        />
        <SCKpiCard
          label="Alertes actives"
          value={dashboard.active_alerts != null ? formatNumber(dashboard.active_alerts) : "3"}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="text-red-600 bg-red-50 dark:bg-red-900/30"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Délais par fournisseur (jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartWidget data={leadTimeData} xKey="fournisseur" yKey="jours" height={280} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Fréquence des commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChartWidget data={orderFrequency} xKey="mois" yKey="commandes" height={280} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SCKpiCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} mb-3`}>
          {icon}
        </div>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 2 — Prévisions
// ═══════════════════════════════════════════════════════════════

const forecastSchema = z.object({
  product_name: z.string().min(2, "Produit requis"),
  period_start: z.string().min(1, "Date début requise"),
  period_end: z.string().min(1, "Date fin requise"),
  predicted_quantity: z.string().min(1, "Quantité requise"),
  method: z.string().optional(),
});
type ForecastFormData = z.infer<typeof forecastSchema>;

function ForecastsTab() {
  const { data: forecastsData, isLoading, error, refetch } = useDemandForecasts();
  const createForecast = useCreateDemandForecast();
  const [createOpen, setCreateOpen] = useState(false);

  const forecasts: any[] = forecastsData?.data ?? (Array.isArray(forecastsData) ? forecastsData : []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ForecastFormData>({
    resolver: zodResolver(forecastSchema),
    defaultValues: { product_name: "", period_start: "", period_end: "", predicted_quantity: "", method: "moving_average" },
  });

  const onSubmit = (data: ForecastFormData) => {
    createForecast.mutate(
      { ...data, predicted_quantity: parseInt(data.predicted_quantity, 10) },
      { onSuccess: () => { setCreateOpen(false); reset(); } },
    );
  };

  const chartData: Record<string, unknown>[] = useMemo(() => {
    return forecasts.slice(0, 12).map((f: any, i: number) => ({
      periode: f.period_label ?? `P${i + 1}`,
      prévu: f.predicted_quantity ?? 0,
      réel: f.actual_quantity ?? 0,
    }));
  }, [forecasts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {forecasts.length} prévision{forecasts.length !== 1 ? "s" : ""}
        </p>
        <ProtectedAction permission={Permission.DEMAND_FORECASTS_CREATE}>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
            Nouvelle prévision
          </Button>
        </ProtectedAction>
      </div>

      {/* Predicted vs Actual chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Prévu vs Réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChartWidget
              data={chartData}
              xKey="periode"
              yKey={["prévu", "réel"]}
              height={280}
            />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger les prévisions" onRetry={() => refetch()} />
      ) : forecasts.length === 0 ? (
        <EmptyState
          icon={<TrendingUp className="w-8 h-8 text-slate-400" />}
          title="Aucune prévision"
          description="Créez des prévisions de demande pour optimiser votre stock."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {forecasts.map((f: any) => (
                <div key={f.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {f.product_name ?? "Produit"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(f.period_start)} — {formatDate(f.period_end)} • Méthode: {f.method ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Prévu: {formatNumber(f.predicted_quantity ?? 0)}
                      </p>
                      {f.actual_quantity != null && (
                        <p className="text-xs text-slate-500">
                          Réel: {formatNumber(f.actual_quantity)}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={f.accuracy != null && f.accuracy >= 90 ? "success" : f.accuracy != null && f.accuracy >= 70 ? "warning" : "default"}
                      size="sm"
                    >
                      {f.accuracy != null ? `${f.accuracy}%` : "—"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onOpenChange={setCreateOpen} title="Nouvelle prévision" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Produit" {...register("product_name")} error={errors.product_name?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Période début" type="date" {...register("period_start")} error={errors.period_start?.message} />
            <Input label="Période fin" type="date" {...register("period_end")} error={errors.period_end?.message} />
          </div>
          <Input label="Quantité prévue" type="number" {...register("predicted_quantity")} error={errors.predicted_quantity?.message} />
          <Controller
            name="method"
            control={control}
            render={({ field }) => (
              <Select
                label="Méthode de prévision"
                value={field.value ?? "moving_average"}
                onChange={field.onChange}
                options={[
                  { value: "moving_average", label: "Moyenne mobile" },
                  { value: "exponential_smoothing", label: "Lissage exponentiel" },
                  { value: "linear_regression", label: "Régression linéaire" },
                  { value: "seasonal", label: "Saisonnier" },
                  { value: "manual", label: "Manuel" },
                ]}
              />
            )}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => { setCreateOpen(false); reset(); }}>Annuler</Button>
            <Button type="submit" loading={createForecast.isPending}>Créer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 3 — Politiques d'inventaire
// ═══════════════════════════════════════════════════════════════

const policySchema = z.object({
  product_name: z.string().min(2, "Produit requis"),
  reorder_point: z.string().min(1, "Point de réapprovisionnement requis"),
  safety_stock: z.string().min(1, "Stock de sécurité requis"),
  eoq: z.string().optional(),
  lead_time_days: z.string().optional(),
  review_period: z.string().optional(),
});
type PolicyFormData = z.infer<typeof policySchema>;

function PoliciesTab() {
  const { data: policiesData, isLoading, error, refetch } = useInventoryPolicies();
  const createPolicy = useCreateInventoryPolicy();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");

  const policies: any[] = policiesData?.data ?? (Array.isArray(policiesData) ? policiesData : []);
  const filtered = useMemo(() => {
    if (!search) return policies;
    const s = search.toLowerCase();
    return policies.filter((p: any) => p.product_name?.toLowerCase().includes(s));
  }, [policies, search]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: { product_name: "", reorder_point: "", safety_stock: "", eoq: "", lead_time_days: "", review_period: "weekly" },
  });

  const onSubmit = (data: PolicyFormData) => {
    createPolicy.mutate(
      {
        ...data,
        reorder_point: parseInt(data.reorder_point, 10),
        safety_stock: parseInt(data.safety_stock, 10),
        eoq: data.eoq ? parseInt(data.eoq, 10) : undefined,
        lead_time_days: data.lead_time_days ? parseInt(data.lead_time_days, 10) : undefined,
      },
      { onSuccess: () => { setCreateOpen(false); reset(); } },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher une politique..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <ProtectedAction permission={Permission.INVENTORY_POLICIES_CREATE}>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
            Nouvelle politique
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger les politiques" onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Shield className="w-8 h-8 text-slate-400" />}
          title="Aucune politique"
          description={search ? "Aucun résultat." : "Définissez des politiques de réapprovisionnement."}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((policy: any) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {policy.product_name ?? "Produit"}
                    </p>
                  </div>
                  <Badge variant={policy.is_active !== false ? "success" : "default"} size="sm">
                    {policy.is_active !== false ? "Actif" : "Inactif"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-slate-400">Point réappro</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                      {formatNumber(policy.reorder_point ?? 0)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-slate-400">Stock sécurité</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                      {formatNumber(policy.safety_stock ?? 0)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-slate-400">QEO</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                      {policy.eoq ? formatNumber(policy.eoq) : "—"}
                    </p>
                  </div>
                </div>

                {policy.lead_time_days != null && (
                  <p className="text-xs text-slate-500 mt-2">
                    Délai: {policy.lead_time_days} jour{policy.lead_time_days !== 1 ? "s" : ""} • Révision: {policy.review_period ?? "—"}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onOpenChange={setCreateOpen} title="Nouvelle politique" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Produit" {...register("product_name")} error={errors.product_name?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Point de réappro" type="number" {...register("reorder_point")} error={errors.reorder_point?.message} />
            <Input label="Stock de sécurité" type="number" {...register("safety_stock")} error={errors.safety_stock?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="QEO (optionnel)" type="number" {...register("eoq")} />
            <Input label="Délai (jours)" type="number" {...register("lead_time_days")} />
          </div>
          <Controller
            name="review_period"
            control={control}
            render={({ field }) => (
              <Select
                label="Période de révision"
                value={field.value ?? "weekly"}
                onChange={field.onChange}
                options={[
                  { value: "daily", label: "Quotidienne" },
                  { value: "weekly", label: "Hebdomadaire" },
                  { value: "biweekly", label: "Bi-hebdomadaire" },
                  { value: "monthly", label: "Mensuelle" },
                ]}
              />
            )}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => { setCreateOpen(false); reset(); }}>Annuler</Button>
            <Button type="submit" loading={createPolicy.isPending}>Créer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 4 — Alertes
// ═══════════════════════════════════════════════════════════════

function AlertsTab() {
  const { data: alertsData, isLoading, error, refetch } = useSupplyChainAlerts();
  const ackAlert = useAcknowledgeAlert();
  const [severityFilter, setSeverityFilter] = useState("");

  const alerts: any[] = alertsData?.data ?? (Array.isArray(alertsData) ? alertsData : []);
  const filtered = useMemo(() => {
    if (!severityFilter) return alerts;
    return alerts.filter((a: any) => a.severity === severityFilter);
  }, [alerts, severityFilter]);

  const severityConfig: Record<string, { variant: any; label: string; icon: React.ReactNode }> = {
    critical: { variant: "danger", label: "Critique", icon: <XCircle className="w-4 h-4" /> },
    high: { variant: "warning", label: "Élevée", icon: <AlertTriangle className="w-4 h-4" /> },
    medium: { variant: "info", label: "Moyenne", icon: <Bell className="w-4 h-4" /> },
    low: { variant: "default", label: "Faible", icon: <CheckCircle className="w-4 h-4" /> },
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <Select
            placeholder="Toutes les sévérités"
            value={severityFilter}
            onChange={setSeverityFilter}
            options={[
              { value: "", label: "Toutes les sévérités" },
              { value: "critical", label: "Critique" },
              { value: "high", label: "Élevée" },
              { value: "medium", label: "Moyenne" },
              { value: "low", label: "Faible" },
            ]}
          />
        </div>
        <Button variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => refetch()}>
          Actualiser
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger les alertes" onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
          title="Aucune alerte"
          description={severityFilter ? "Aucune alerte de cette sévérité." : "Toutes les alertes sont traitées."}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((alert: any) => {
            const config = severityConfig[alert.severity] ?? severityConfig.low;
            return (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 ${
                      alert.severity === "critical" ? "text-red-500" :
                      alert.severity === "high" ? "text-amber-500" :
                      alert.severity === "medium" ? "text-blue-500" : "text-slate-400"
                    }`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {alert.title ?? alert.type ?? "Alerte"}
                        </p>
                        <Badge variant={config.variant} size="sm">{config.label}</Badge>
                        {alert.acknowledged && (
                          <Badge variant="success" size="sm">Acquittée</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{alert.message ?? alert.description ?? "—"}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>{formatDateTime(alert.created_at)}</span>
                        {alert.product_name && <span>Produit: {alert.product_name}</span>}
                        {alert.supplier_name && <span>Fournisseur: {alert.supplier_name}</span>}
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <ProtectedAction permission={Permission.SUPPLY_CHAIN_ALERTS_UPDATE}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => ackAlert.mutate(alert.id)}
                          disabled={ackAlert.isPending}
                          leftIcon={<CheckCircle className="w-4 h-4" />}
                        >
                          Acquitter
                        </Button>
                      </ProtectedAction>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
