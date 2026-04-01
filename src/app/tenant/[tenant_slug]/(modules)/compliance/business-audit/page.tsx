"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useOrganization } from "@/context/OrganizationContext";
import { apiClient } from "@/lib/apiClient";
import { Permission } from "@/types/permissions";
import {
  Card,
  CardContent,
  Button,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import { ScrollText, Download, RefreshCw } from "lucide-react";

interface AuditListPayload {
  rows: Record<string, unknown>[];
  total: number;
}

export default function TenantBusinessAuditPage() {
  return (
    <ModuleGuard
      module="audit-events"
      requiredPermissions={[Permission.TENANT_AUDIT_READ]}
    >
      <TenantBusinessAuditContent />
    </ModuleGuard>
  );
}

function TenantBusinessAuditContent() {
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id;
  const [data, setData] = useState<AuditListPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: AuditListPayload;
      }>(`/pharmacies/${orgId}/audit-events`, { params: { limit: 100, offset: 0 } });
      const payload = res.data?.data ?? (res.data as unknown as AuditListPayload);
      setData(
        payload && "rows" in payload
          ? payload
          : { rows: [], total: 0 },
      );
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "message" in e ? String((e as Error).message) : "Erreur de chargement";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    void load();
  }, [load]);

  const exportCsv = async () => {
    if (!orgId) return;
    try {
      const res = await apiClient.get(`/pharmacies/${orgId}/audit-events/export`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tenant-business-audit.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Export CSV impossible (vérifiez la session).");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <ScrollText className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Journal métier (audit)
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Événements enregistrés pour la conformité (ventes, patients, ordonnances…).
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={() => void exportCsv()} disabled={!orgId}>
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      <Card>
        <CardContent className="pt-6">
          {loading && <Skeleton className="h-48 w-full" />}
          {!loading && data && (
            <>
              <p className="text-sm text-slate-500 mb-3">
                {data.total} événement(s) (100 derniers affichés)
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="text-left p-2 font-medium">Date</th>
                      <th className="text-left p-2 font-medium">Action</th>
                      <th className="text-left p-2 font-medium">Ressource</th>
                      <th className="text-left p-2 font-medium">Id</th>
                      <th className="text-left p-2 font-medium">Acteur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500">
                          Aucun événement pour l’instant.
                        </td>
                      </tr>
                    )}
                    {data.rows.map((row, i) => (
                      <tr
                        key={String(row.id ?? i)}
                        className="border-t border-slate-100 dark:border-slate-700/80"
                      >
                        <td className="p-2 whitespace-nowrap">
                          {String(row.created_at ?? "")}
                        </td>
                        <td className="p-2">{String(row.action ?? "")}</td>
                        <td className="p-2">{String(row.resource_type ?? "")}</td>
                        <td className="p-2 font-mono text-xs">{String(row.resource_id ?? "")}</td>
                        <td className="p-2 text-xs">{String(row.actor_user_id ?? "")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
