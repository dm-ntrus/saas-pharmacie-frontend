"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useBIReports, useGenerateSalesReport, useGenerateInventoryReport } from "@/hooks/api/useAnalytics";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, EmptyState, ErrorBanner, Skeleton } from "@/components/ui";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

export default function ReportsPage() {
  return (
    <ModuleGuard module="analytics" requiredPermissions={[Permission.BI_READ]}>
      <ReportsContent />
    </ModuleGuard>
  );
}

function ReportsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const { data: reports, isLoading, error, refetch } = useBIReports();
  const salesReportMutation = useGenerateSalesReport();
  const inventoryReportMutation = useGenerateInventoryReport();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const list = Array.isArray(reports) ? reports : [];

  const handleGenerateSales = () => {
    if (!startDate || !endDate) return;
    salesReportMutation.mutate({ startDate, endDate }, { onSuccess: () => refetch() });
  };

  const handleGenerateInventory = () => {
    inventoryReportMutation.mutate(undefined as any, { onSuccess: () => refetch() });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push(buildPath("/analytics"))} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Rapports</h1>
          <p className="text-sm text-slate-500">Générer et consulter les rapports ventes et inventaire</p>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-base">Générer un rapport</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Date début" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input label="Date fin" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={handleGenerateSales}
              disabled={!startDate || !endDate || salesReportMutation.isPending}
            >
              Rapport ventes
            </Button>
            <Button size="sm" variant="outline" onClick={handleGenerateInventory} disabled={inventoryReportMutation.isPending}>
              Rapport inventaire
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : error ? (
        <ErrorBanner message="Impossible de charger les rapports" onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState icon={<FileText className="w-8 h-8 text-slate-400" />} title="Aucun rapport" description="Générez un rapport ci-dessus." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {list.map((r: { id: string; title?: string; type?: string; generatedAt?: string }) => (
                <li key={r.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{r.title ?? r.type ?? r.id}</p>
                    <p className="text-sm text-slate-500">{r.generatedAt ? formatDateTime(r.generatedAt) : ""}</p>
                  </div>
                  <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>Télécharger</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
