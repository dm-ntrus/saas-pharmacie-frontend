"use client";

import React from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useDemandForecasts, useCreatePurchaseOrderFromForecast } from "@/hooks/api/useVaccination";
import { Button, Card, CardContent, ErrorBanner, Skeleton, Badge, EmptyState } from "@/components/ui";
import { BarChart3, Plus } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function ForecastsPage() {
  return (
    <ModuleGuard
      module="vaccination"
      requiredPermissions={[Permission.VACCINATION_READ]}
    >
      <ForecastsContent />
    </ModuleGuard>
  );
}

function ForecastsContent() {
  const { buildPath } = useTenantPath();
  const { data: forecasts, isLoading, error, refetch } = useDemandForecasts();
  const createPO = useCreatePurchaseOrderFromForecast();

  if (isLoading && !forecasts) {
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
        message="Erreur de chargement des prévisions"
        onRetry={() => refetch()}
      />
    );
  }

  const list = Array.isArray(forecasts) ? forecasts : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Prévisions de demande
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Prévisions vaccinales et commandes suggérées
        </p>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Aucune prévision"
          description="Générez une prévision à partir des RDV planifiés et du stock actuel."
        />
      ) : (
        <div className="space-y-2">
          {list.map((f) => (
            <Card key={f.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {f.vaccine_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    Semaine du {formatDate(f.forecast_for_week_starting)} · Doses
                    suggérées : {f.suggested_order_quantity} · Urgence : {f.urgency}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={f.purchase_order_created ? "default" : "secondary"}>
                    {f.purchase_order_created ? "Commande créée" : "En attente"}
                  </Badge>
                  {!f.purchase_order_created && (
                    <Button
                      size="sm"
                      onClick={() =>
                        createPO.mutate(f.id, {
                          onSuccess: () => refetch(),
                        })
                      }
                      disabled={createPO.isPending}
                    >
                      Créer la commande
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
