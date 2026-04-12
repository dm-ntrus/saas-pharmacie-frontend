"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useOrganization } from "@/context/OrganizationContext";
import apiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import {
  Button, Card, CardContent, CardHeader, CardTitle, Badge, Input, EmptyState, ErrorBanner, Skeleton,
} from "@/components/ui";
import { ArrowLeft, Search, Shield, AlertTriangle, FileText } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export default function ControlledSubstancesPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.PRESCRIPTIONS_READ]}>
      <ControlledSubstancesContent />
    </ModuleGuard>
  );
}

function ControlledSubstancesContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { currentOrganization } = useOrganization();
  const pharmacyId = currentOrganization?.id ?? "";

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const { data: logs, isLoading, error, refetch } = useQuery({
    queryKey: ["controlled-substance-logs", pharmacyId, dateRange],
    queryFn: () =>
      apiService.get(`/pharmacies/${pharmacyId}/prescriptions/controlled-substances`, {
        params: {
          startDate: dateRange.start || undefined,
          endDate: dateRange.end || undefined,
        },
      }),
    enabled: !!pharmacyId,
  });

  const allLogs: any[] = Array.isArray(logs) ? logs : [];
  const filtered = allLogs.filter((log: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      log.product_name?.toLowerCase().includes(s) ||
      log.patient_name?.toLowerCase().includes(s) ||
      log.dea_schedule?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/inventory"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Substances contrôlées</h1>
          <p className="text-sm text-slate-500 mt-1">Registre de traçabilité des stupéfiants et substances réglementées</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input placeholder="Rechercher produit, patient, classe DEA..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
            </div>
            <Input type="date" label="" value={dateRange.start} onChange={(e) => setDateRange((p) => ({ ...p, start: e.target.value }))} />
            <Input type="date" label="" value={dateRange.end} onChange={(e) => setDateRange((p) => ({ ...p, end: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger les registres" onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Shield className="w-8 h-8 text-slate-400" />} title="Aucun enregistrement" description="Pas de mouvements de substances contrôlées enregistrés." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Produit</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Patient</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">Action</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">Quantité</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">Classe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filtered.map((log: any, i: number) => (
                    <tr key={log.id ?? i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{log.product_name ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{log.patient_name ?? "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={log.action === "dispense" ? "info" : log.action === "receive" ? "success" : "default"} size="sm">
                          {log.action === "dispense" ? "Dispensation" : log.action === "receive" ? "Réception" : log.action ?? "—"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium">{log.quantity ?? "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="danger" size="sm">{log.dea_schedule ?? "—"}</Badge>
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
