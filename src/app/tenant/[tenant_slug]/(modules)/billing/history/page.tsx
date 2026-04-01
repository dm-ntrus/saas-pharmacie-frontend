"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useSubscriptionHistory } from "@/hooks/api/useBilling";
import {
  Button,
  Card,
  CardContent,
  ErrorBanner,
  Skeleton,
  Badge,
  EmptyState,
} from "@/components/ui";
import { ArrowLeft, Receipt } from "lucide-react";
import type { SubscriptionHistoryItem } from "@/types/billing";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function BillingHistoryPage() {
  return (
    <ModuleGuard
      module="billing"
      requiredPermissions={[Permission.INVOICES_READ]}
    >
      <BillingHistoryContent />
    </ModuleGuard>
  );
}

function BillingHistoryContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: history, isLoading, error, refetch } = useSubscriptionHistory();

  if (error) {
    return (
      <ErrorBanner
        message="Erreur de chargement de l'historique"
        onRetry={() => refetch()}
      />
    );
  }

  const items = Array.isArray(history) ? history : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(buildPath("/billing"))}
        >
          Retour
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Historique des abonnements
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Liste des souscriptions passées et actuelles
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : items.length === 0 ? (
        <EmptyState
          title="Aucun historique"
          description="Aucune souscription enregistrée."
          actionLabel="Retour à la facturation"
          onAction={() => router.push(buildPath("/billing"))}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-3">Plan</th>
                    <th className="text-left p-3">Statut</th>
                    <th className="text-left p-3">Période</th>
                    <th className="text-left p-3">Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row: SubscriptionHistoryItem) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="p-3 font-medium">
                        {row.plan_name ?? row.plan_id ?? "—"}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            row.status === "active" ? "success" : "default"
                          }
                        >
                          {row.status ?? "—"}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {row.current_period_start && row.current_period_end
                          ? `${format(new Date(row.current_period_start), "d MMM y", { locale: fr })} — ${format(new Date(row.current_period_end), "d MMM y", { locale: fr })}`
                          : "—"}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {row.created_at
                          ? format(new Date(row.created_at), "d MMM y", {
                              locale: fr,
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
