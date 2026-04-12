"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useControlledSubstanceLogs } from "@/hooks/api/usePrescriptions";
import { Button, Card, CardContent, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function ControlledSubstancesPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_READ]}
    >
      <ControlledSubstancesContent />
    </ModuleGuard>
  );
}

function ControlledSubstancesContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: logs = [], isLoading, error, refetch } = useControlledSubstanceLogs();

  const list = Array.isArray(logs) ? logs : [];

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
            Substances contrôlées
          </h1>
          <p className="text-sm text-slate-500">
            Journal des mouvements et délivrances
          </p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full rounded-lg" />
      ) : error ? (
        <ErrorBanner message="Erreur de chargement des logs" onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<ShieldAlert className="w-12 h-12 text-slate-400" />}
          title="Aucun enregistrement"
          description="Aucun log de substance contrôlée pour les critères sélectionnés."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">Type / Produit</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">Quantité</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">Référence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {list.map((log: any, i: number) => (
                    <tr key={log.id ?? i}>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {log.created_at ? formatDate(log.created_at) : log.date ?? "—"}
                      </td>
                      <td className="px-4 py-3">{log.product_name ?? log.type ?? "—"}</td>
                      <td className="px-4 py-3">{log.quantity ?? "—"}</td>
                      <td className="px-4 py-3">{log.prescription_id ?? log.reference ?? "—"}</td>
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
