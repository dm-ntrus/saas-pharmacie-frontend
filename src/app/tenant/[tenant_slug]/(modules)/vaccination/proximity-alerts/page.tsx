"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useProximityAlerts, useCreateProximityAlert, useSendProximityNotifications } from "@/hooks/api/useVaccination";
import { useVaccinationVials } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton, Badge, EmptyState } from "@/components/ui";
import { Plus, Bell } from "lucide-react";

function safeId(id: string) {
  return typeof id === "string" && id.includes(":") ? id.split(":")[1] ?? id : id;
}

export default function ProximityAlertsPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <ProximityAlertsContent />
    </ModuleGuard>
  );
}

function ProximityAlertsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: alerts, isLoading, error, refetch } = useProximityAlerts();
  const { data: vials } = useVaccinationVials();
  const sendNotify = useSendProximityNotifications();

  if (isLoading && !alerts) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement des alertes"
        onRetry={() => refetch()}
      />
    );
  }

  const list = Array.isArray(alerts) ? alerts : [];
  const openVials = Array.isArray(vials) ? vials.filter((v) => v.status === "opened" && v.doses_remaining > 0) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Alertes de proximité
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Flacons à écouler : notifier les patients éligibles
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Aucune alerte active"
          description="Créez une alerte pour un flacon à écouler (ex. expiration proche) pour envoyer des notifications aux patients éligibles."
        />
      ) : (
        <div className="space-y-2">
          {list.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {alert.vaccine_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {alert.doses_remaining} doses · Expire dans {alert.hours_until_expiry} h
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{alert.status}</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Bell className="w-4 h-4" />}
                    onClick={() =>
                      sendNotify.mutate(alert.id, {
                        onSuccess: () => refetch(),
                      })
                    }
                    disabled={sendNotify.isPending}
                  >
                    Envoyer notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Créer une alerte
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Sélectionnez un flacon ouvert à écouler pour créer une alerte et cibler les
            patients éligibles (âge, proximité).
          </p>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => router.push(buildPath("/vaccination/proximity-alerts/new"))}
          >
            Nouvelle alerte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
