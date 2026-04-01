"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useOrganization } from "@/context/OrganizationContext";
import { apiClient } from "@/lib/apiClient";
import { Permission } from "@/types/permissions";
import {
  Card,
  CardContent,
  ErrorBanner,
  Skeleton,
  Button,
} from "@/components/ui";
import { Hash, RefreshCw } from "lucide-react";

type SequenceRow = {
  id: string;
  sequenceKey: string;
  periodKey: string;
  lastAllocated: number;
  updatedAt: string | null;
  label: string;
  format: string;
  periodHint: string;
};

export default function DocumentSequencesPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <DocumentSequencesContent />
    </ModuleGuard>
  );
}

function DocumentSequencesContent() {
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id;
  const [data, setData] = useState<{
    sequences: SequenceRow[];
    note?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(
        `/pharmacies/${orgId}/document-sequences`,
      );
      const payload = res.data?.data ?? res.data;
      setData(payload);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Chargement impossible");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Hash className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Numérotation documentaire
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Compteurs atomiques (ventes, factures, frais, écritures). Lecture
              seule — migration / ajustement côté base si besoin.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void load()}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading && <Skeleton className="h-48 w-full" />}

      {!loading && data?.note && (
        <p className="text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50/80 dark:bg-slate-800/40">
          {data.note}
        </p>
      )}

      {!loading && data && data.sequences.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-slate-500">
            Aucun compteur encore créé. Les lignes apparaissent après la
            première vente / facture / écriture utilisant une séquence.
          </CardContent>
        </Card>
      )}

      {!loading && data && data.sequences.length > 0 && (
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-2 pr-3">Type</th>
                  <th className="pb-2 pr-3">Période</th>
                  <th className="pb-2 pr-3">Dernier n° séquentiel</th>
                  <th className="pb-2">Format</th>
                </tr>
              </thead>
              <tbody>
                {data.sequences.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="py-2 pr-3 font-medium text-slate-900 dark:text-slate-100">
                      {row.label}
                      <span className="block text-xs font-normal text-slate-500">
                        {row.sequenceKey}
                      </span>
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">{row.periodKey}</td>
                    <td className="py-2 pr-3 font-mono">{row.lastAllocated}</td>
                    <td className="py-2 text-xs text-slate-600 dark:text-slate-400">
                      {row.format}
                      <span className="block text-slate-500">{row.periodHint}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
