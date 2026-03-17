"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useEndOfTreatmentAlerts } from "@/hooks/api/usePrescriptions";
import { Button, Card, CardContent, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function PrescriptionAlertsPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_READ]}
    >
      <PrescriptionAlertsContent />
    </ModuleGuard>
  );
}

function PrescriptionAlertsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: alerts = [], isLoading, error, refetch } = useEndOfTreatmentAlerts();

  const list = Array.isArray(alerts) ? alerts : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(buildPath("/prescriptions"))}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Alertes fin de traitement
          </h1>
          <p className="text-sm text-slate-500">
            Ordonnances en fin de traitement ou à renouveler
          </p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full rounded-lg" />
      ) : error ? (
        <ErrorBanner message="Erreur de chargement des alertes" onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState
          title="Aucune alerte"
          description="Aucune alerte fin de traitement pour le moment."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {list.map((alert: any, i: number) => (
                <li key={alert.alertId ?? i} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {alert.drugName ?? alert.drug_name ?? "Médicament"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Patient: {alert.patientId ?? alert.patient_id ?? "—"} · Fin prévue:{" "}
                      {alert.endDate ? formatDate(alert.endDate) : alert.daysRemaining != null ? `J-${alert.daysRemaining}` : "—"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
