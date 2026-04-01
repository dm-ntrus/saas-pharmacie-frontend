"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useSupplyChainAlerts, useUpdateSupplyChainAlert } from "@/hooks/api/useSupplyChain";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Select,
  Skeleton,
  EmptyState,
  ErrorBanner,
} from "@/components/ui";
import { formatDateTime } from "@/utils/formatters";
import { ArrowLeft, AlertTriangle, Bell, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function SupplyChainAlertsPage() {
  return (
    <ModuleGuard
      module="supply-chain"
      requiredPermissions={[Permission.SUPPLY_CHAIN_READ, Permission.SUPPLY_CHAIN_ALERTS_READ]}
    >
      <AlertsContent />
    </ModuleGuard>
  );
}

function AlertsContent() {
  const { buildPath } = useTenantPath();
  const { data: alertsData, isLoading, error, refetch } = useSupplyChainAlerts();
  const updateAlert = useUpdateSupplyChainAlert();
  const [severityFilter, setSeverityFilter] = useState("");

  const raw = alertsData?.data ?? alertsData;
  const alerts = Array.isArray(raw) ? raw : [];
  const filtered = useMemo(() => {
    if (!severityFilter) return alerts;
    return alerts.filter((a: Record<string, unknown>) => a.severity === severityFilter);
  }, [alerts, severityFilter]);

  const severityConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    critical: { label: "Critique", icon: <XCircle className="w-4 h-4" />, className: "text-red-500" },
    high: { label: "Élevée", icon: <AlertTriangle className="w-4 h-4" />, className: "text-amber-500" },
    medium: { label: "Moyenne", icon: <Bell className="w-4 h-4" />, className: "text-blue-500" },
    low: { label: "Faible", icon: <CheckCircle className="w-4 h-4" />, className: "text-slate-400" },
  };

  const handleAcknowledge = (alertId: string) => {
    updateAlert.mutate({ id: alertId, data: { acknowledged: true } }, { onSuccess: () => refetch() });
  };

  const handleResolve = (alertId: string) => {
    updateAlert.mutate({ id: alertId, data: { status: "resolved" } }, { onSuccess: () => refetch() });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={buildPath("/supply-chain")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Alertes Supply Chain</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Alertes et notifications d&apos;approvisionnement</p>
          </div>
        </div>
        <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => refetch()}>
          Actualiser
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
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

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : error ? (
        <ErrorBanner title="Erreur" message="Impossible de charger les alertes" onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
          title="Aucune alerte"
          description={severityFilter ? "Aucune alerte de cette sévérité." : "Toutes les alertes sont traitées."}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((alert: Record<string, unknown>) => {
            const config = severityConfig[alert.severity as string] ?? severityConfig.low;
            const acknowledged = alert.acknowledged === true;
            const resolved = alert.status === "resolved";
            return (
              <Card key={String(alert.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 ${config.className}`}>{config.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {String(alert.title ?? alert.type ?? "Alerte")}
                        </p>
                        <Badge variant="default" size="sm">{config.label}</Badge>
                        {acknowledged && <Badge variant="success" size="sm">Acquittée</Badge>}
                        {resolved && <Badge variant="default" size="sm">Résolue</Badge>}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {String(alert.message ?? alert.description ?? "—")}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>{formatDateTime(alert.created_at as string)}</span>
                        {Boolean(alert.product_name) && (
                          <span>Produit: {String(alert.product_name)}</span>
                        )}
                        {Boolean(alert.supplier_name) && (
                          <span>Fournisseur: {String(alert.supplier_name)}</span>
                        )}
                      </div>
                    </div>
                    {!resolved && (
                      <div className="flex items-center gap-2 shrink-0">
                        {!acknowledged && (
                          <ProtectedAction permission={Permission.SUPPLY_CHAIN_ALERTS_UPDATE}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAcknowledge(alert.id as string)}
                              disabled={updateAlert.isPending}
                              leftIcon={<CheckCircle className="w-4 h-4" />}
                            >
                              Acquitter
                            </Button>
                          </ProtectedAction>
                        )}
                        <ProtectedAction permission={Permission.SUPPLY_CHAIN_ALERTS_UPDATE}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolve(alert.id as string)}
                            disabled={updateAlert.isPending}
                          >
                            Résoudre
                          </Button>
                        </ProtectedAction>
                      </div>
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
