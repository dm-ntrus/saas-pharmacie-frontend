"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useInventoryAlerts,
  useAlertStatistics,
  useAcknowledgeAlert,
  useResolveAlert,
  useSnoozeAlert,
  useEscalateAlert,
} from "@/hooks/api/useInventory";
import {
  AlertSeverity,
  AlertType,
  AlertStatus,
  ALERT_TYPE_LABELS,
  ALERT_SEVERITY_LABELS,
} from "@/types/inventory";
import type { InventoryAlert } from "@/types/inventory";
import { useAuth } from "@/context/AuthContext";
import {
  Button,
  Card,
  CardContent,
  Badge,
  EmptyState,
  ErrorBanner,
  Skeleton,
  Modal,
  Input,
} from "@/components/ui";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Bell,
  BellOff,
  Package,
  Thermometer,
  Clock,
  ArrowUpCircle,
} from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

const SEVERITY_BADGE: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  [AlertSeverity.LOW]: "info",
  [AlertSeverity.MEDIUM]: "warning",
  [AlertSeverity.HIGH]: "danger",
  [AlertSeverity.CRITICAL]: "danger",
};

/** Guide §6.2: Critique red-600, Haute orange-500, Moyenne amber-400, Basse blue-400 */
const SEVERITY_BG: Record<string, string> = {
  [AlertSeverity.CRITICAL]: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700",
  [AlertSeverity.HIGH]: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  [AlertSeverity.MEDIUM]: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  [AlertSeverity.LOW]: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
};

const SEVERITY_ICON_COLOR: Record<string, string> = {
  [AlertSeverity.CRITICAL]: "text-red-600",
  [AlertSeverity.HIGH]: "text-orange-500",
  [AlertSeverity.MEDIUM]: "text-amber-400",
  [AlertSeverity.LOW]: "text-blue-400",
};

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  [AlertType.LOW_STOCK]: Package,
  [AlertType.OUT_OF_STOCK]: Package,
  [AlertType.EXPIRING_SOON]: AlertTriangle,
  [AlertType.EXPIRED]: AlertTriangle,
  [AlertType.OVERSTOCK]: Package,
  [AlertType.RECALL]: Bell,
  [AlertType.TEMPERATURE_DEVIATION]: Thermometer,
};

export default function InventoryAlertsPage() {
  return (
    <ModuleGuard
      module="inventory"
      requiredPermissions={[Permission.INVENTORY_ALERTS_READ]}
    >
      <AlertsContent />
    </ModuleGuard>
  );
}

const TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tous types" },
  { value: AlertType.LOW_STOCK, label: ALERT_TYPE_LABELS[AlertType.LOW_STOCK] },
  { value: AlertType.OUT_OF_STOCK, label: ALERT_TYPE_LABELS[AlertType.OUT_OF_STOCK] },
  { value: AlertType.EXPIRING_SOON, label: ALERT_TYPE_LABELS[AlertType.EXPIRING_SOON] },
  { value: AlertType.EXPIRED, label: ALERT_TYPE_LABELS[AlertType.EXPIRED] },
  { value: AlertType.RECALL, label: ALERT_TYPE_LABELS[AlertType.RECALL] },
  { value: AlertType.TEMPERATURE_DEVIATION, label: ALERT_TYPE_LABELS[AlertType.TEMPERATURE_DEVIATION] },
];

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tous statuts" },
  { value: AlertStatus.ACTIVE, label: "Active" },
  { value: AlertStatus.ACKNOWLEDGED, label: "Accusée" },
  { value: AlertStatus.RESOLVED, label: "Résolue" },
  { value: "snoozed", label: "Reportée" },
  { value: "escalated", label: "Escaladée" },
];

function AlertsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { user } = useAuth();

  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "">("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [snoozeAlertId, setSnoozeAlertId] = useState<string | null>(null);
  const [escalateAlertId, setEscalateAlertId] = useState<string | null>(null);
  const [snoozeUntil, setSnoozeUntil] = useState("");
  const [escalateReason, setEscalateReason] = useState("");

  const { data, isLoading, error, refetch } = useInventoryAlerts({
    severity: severityFilter || undefined,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
    limit: 50,
  });
  const { data: stats } = useAlertStatistics();
  const acknowledgeMutation = useAcknowledgeAlert();
  const resolveMutation = useResolveAlert();
  const snoozeMutation = useSnoozeAlert();
  const escalateMutation = useEscalateAlert();

  const alerts: InventoryAlert[] = data?.data ?? [];

  const severityCounts = React.useMemo(() => {
    const c = { [AlertSeverity.CRITICAL]: 0, [AlertSeverity.HIGH]: 0, [AlertSeverity.MEDIUM]: 0, [AlertSeverity.LOW]: 0 };
    alerts.forEach((a) => {
      if (a.severity && c[a.severity] !== undefined) c[a.severity]++;
    });
    return c;
  }, [alerts]);

  const userAction = {
    userId: user?.id ?? "",
    userName: user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "Utilisateur",
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeMutation.mutate({
      alertId,
      action: { userId: userAction.userId, notes: undefined },
    });
  };

  const handleResolve = (alertId: string) => {
    resolveMutation.mutate({
      alertId,
      action: {
        resolvedBy: userAction.userId,
        resolutionNotes: "Résolu par l'utilisateur",
      },
    });
  };

  const handleSnooze = () => {
    if (!snoozeAlertId || !snoozeUntil) return;
    snoozeMutation.mutate({
      alertId: snoozeAlertId,
      snoozeUntil: new Date(snoozeUntil).toISOString(),
      userId: userAction.userId,
      userName: userAction.userName,
    }, { onSuccess: () => { setSnoozeAlertId(null); setSnoozeUntil(""); } });
  };

  const handleEscalate = () => {
    if (!escalateAlertId) return;
    escalateMutation.mutate({
      alertId: escalateAlertId,
      reason: escalateReason || "Escalade manuelle",
      userId: userAction.userId,
      userName: userAction.userName,
    }, { onSuccess: () => { setEscalateAlertId(null); setEscalateReason(""); } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/inventory"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Alertes d&apos;inventaire
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Surveillez les ruptures, péremptions et anomalies
            </p>
          </div>
        </div>
      </div>

      {/* AlertsStatsBar — Compteurs par sévérité (§6.2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Critique" value={severityCounts[AlertSeverity.CRITICAL] ?? 0} color="text-red-600" />
        <StatCard label="Haute" value={severityCounts[AlertSeverity.HIGH] ?? 0} color="text-orange-500" />
        <StatCard label="Moyenne" value={severityCounts[AlertSeverity.MEDIUM] ?? 0} color="text-amber-400" />
        <StatCard label="Basse" value={severityCounts[AlertSeverity.LOW] ?? 0} color="text-blue-400" />
      </div>
      {stats && (
        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          <span>Actives: <strong className="text-slate-700 dark:text-slate-300">{stats.active ?? 0}</strong></span>
          <span>Accusées: <strong className="text-slate-700 dark:text-slate-300">{stats.acknowledged ?? 0}</strong></span>
          <span>Résolues: <strong className="text-slate-700 dark:text-slate-300">{stats.resolved ?? 0}</strong></span>
          <span>Reportées: <strong className="text-slate-700 dark:text-slate-300">{stats.snoozed ?? 0}</strong></span>
        </div>
      )}

      {/* AlertsFilters — Type, Sévérité, Statut (§6.2) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Sévérité:</span>
          <Badge variant={severityFilter === "" ? "info" : "default"} className="cursor-pointer" onClick={() => setSeverityFilter("")}>Toutes</Badge>
          {Object.values(AlertSeverity).map((sev) => (
            <Badge key={sev} variant={severityFilter === sev ? "info" : "default"} className="cursor-pointer" onClick={() => setSeverityFilter(sev)}>
              {ALERT_SEVERITY_LABELS[sev]}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
          >
            {TYPE_FILTER_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-2">Statut:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
          >
            {STATUS_FILTER_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner
          message="Impossible de charger les alertes"
          onRetry={() => refetch()}
        />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={<BellOff className="w-8 h-8 text-slate-400" />}
          title="Aucune alerte"
          description="Tout est en ordre pour le moment."
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = TYPE_ICONS[alert.alert_type] ?? AlertTriangle;
            const severityBg = SEVERITY_BG[alert.severity] ?? "bg-slate-50 dark:bg-slate-800";
            const iconColor = SEVERITY_ICON_COLOR[alert.severity] ?? "text-slate-500";
            const isActive = alert.status === AlertStatus.ACTIVE;
            const canAct = isActive || alert.status === AlertStatus.ACKNOWLEDGED;
            return (
              <Card key={alert.id} className={severityBg}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${severityBg}`}>
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{alert.message}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant={SEVERITY_BADGE[alert.severity] ?? "default"} size="sm">
                              {ALERT_SEVERITY_LABELS[alert.severity]}
                            </Badge>
                            <Badge variant="default" size="sm">
                              {ALERT_TYPE_LABELS[alert.alert_type] ?? alert.alert_type}
                            </Badge>
                            <span className="text-xs text-slate-400">{formatDateTime(alert.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0 flex-wrap">
                          {isActive && (
                            <ProtectedAction permission={Permission.INVENTORY_ALERTS_UPDATE}>
                              <Button variant="outline" size="sm" leftIcon={<Eye className="w-3 h-3" />} onClick={() => handleAcknowledge(alert.id)} loading={acknowledgeMutation.isPending}>
                                Accuser
                              </Button>
                            </ProtectedAction>
                          )}
                          {canAct && (
                            <ProtectedAction permission={Permission.INVENTORY_ALERTS_UPDATE}>
                              <Button variant="outline" size="sm" leftIcon={<CheckCircle2 className="w-3 h-3" />} onClick={() => handleResolve(alert.id)} loading={resolveMutation.isPending}>
                                Résoudre
                              </Button>
                            </ProtectedAction>
                          )}
                          {canAct && (
                            <ProtectedAction permission={Permission.INVENTORY_ALERTS_UPDATE}>
                              <Button variant="outline" size="sm" leftIcon={<Clock className="w-3 h-3" />} onClick={() => { setSnoozeAlertId(alert.id); setSnoozeUntil(""); }} loading={snoozeMutation.isPending}>
                                Reporter
                              </Button>
                            </ProtectedAction>
                          )}
                          {canAct && (
                            <ProtectedAction permission={Permission.INVENTORY_ALERTS_UPDATE}>
                              <Button variant="outline" size="sm" leftIcon={<ArrowUpCircle className="w-3 h-3" />} onClick={() => { setEscalateAlertId(alert.id); setEscalateReason(""); }} loading={escalateMutation.isPending}>
                                Escalader
                              </Button>
                            </ProtectedAction>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Reporter (Snooze) */}
      <Modal open={!!snoozeAlertId} onOpenChange={(o) => !o && setSnoozeAlertId(null)} title="Reporter l'alerte">
        <div className="space-y-4">
          <Input label="Reporter jusqu'au" type="datetime-local" value={snoozeUntil} onChange={(e) => setSnoozeUntil(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSnoozeAlertId(null)}>Annuler</Button>
            <Button onClick={handleSnooze} disabled={!snoozeUntil || snoozeMutation.isPending}>Reporter</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Escalader */}
      <Modal open={!!escalateAlertId} onOpenChange={(o) => !o && setEscalateAlertId(null)} title="Escalader l'alerte">
        <div className="space-y-4">
          <Input label="Raison (optionnel)" value={escalateReason} onChange={(e) => setEscalateReason(e.target.value)} placeholder="Ex: nécessite validation responsable" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEscalateAlertId(null)}>Annuler</Button>
            <Button onClick={handleEscalate} disabled={escalateMutation.isPending}>Escalader</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
