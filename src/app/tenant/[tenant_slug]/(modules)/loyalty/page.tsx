"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useOrganization } from "@/context/OrganizationContext";
import { apiClient } from "@/lib/apiClient";
import { Permission } from "@/types/permissions";
import { Card, CardContent, ErrorBanner, Skeleton, Button, Input, Badge } from "@/components/ui";
import { formatDateTime } from "@/utils/formatters";
import { Star, RefreshCw, Plus, UserPlus, ListOrdered } from "lucide-react";

type LoyaltyProgram = {
  id: string;
  name: string;
  status: "draft" | "active" | "archived";
  points_per_currency: number;
  rounding_mode: "floor" | "round" | "ceil";
  min_purchase_amount: number;
};

type LoyaltyOverview = {
  activePrograms: number;
  enrolledPatients: number;
  pointsIssued30d: number;
};

type LoyaltyTxRow = {
  id: string;
  type?: string;
  points?: number;
  reason?: string;
  source_type?: string;
  source_id?: string;
  account_id?: string;
  created_at?: string;
};

export default function LoyaltyPage() {
  return (
    <ModuleGuard module="loyalty" requiredPermissions={[Permission.LOYALTY_READ]}>
      <LoyaltyContent />
    </ModuleGuard>
  );
}

function LoyaltyContent() {
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization?.id;
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
  const [overview, setOverview] = useState<LoyaltyOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState<LoyaltyProgram["status"]>("draft");
  const [newPointsPerCurrency, setNewPointsPerCurrency] = useState<number>(1);
  const [newRoundingMode, setNewRoundingMode] = useState<LoyaltyProgram["rounding_mode"]>("floor");
  const [newMinPurchase, setNewMinPurchase] = useState<number>(0);
  const [transactions, setTransactions] = useState<LoyaltyTxRow[]>([]);
  const [enrollPatientId, setEnrollPatientId] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    try {
      const [p, o, tx] = await Promise.all([
        apiClient.get(`/pharmacies/${orgId}/loyalty/programs`),
        apiClient.get(`/pharmacies/${orgId}/loyalty/overview`),
        apiClient.get(`/pharmacies/${orgId}/loyalty/transactions`, { params: { limit: 50 } }),
      ]);
      const programsPayload = p.data?.data ?? p.data;
      const overviewPayload = o.data?.data ?? o.data;
      const txPayload = tx.data?.data ?? tx.data;
      setPrograms(programsPayload?.programs ?? []);
      setOverview(overviewPayload ?? null);
      setTransactions(txPayload?.transactions ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Chargement impossible");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    void load();
  }, [load]);

  const canCreate = useMemo(() => newName.trim().length > 0 && newPointsPerCurrency >= 0, [newName, newPointsPerCurrency]);

  const createProgram = useCallback(async () => {
    if (!orgId || !canCreate) return;
    setCreating(true);
    setError(null);
    try {
      await apiClient.post(`/pharmacies/${orgId}/loyalty/programs`, {
        name: newName.trim(),
        status: newStatus,
        points_per_currency: Number(newPointsPerCurrency),
        rounding_mode: newRoundingMode,
        min_purchase_amount: Number(newMinPurchase),
      });
      setNewName("");
      setNewStatus("draft");
      setNewPointsPerCurrency(1);
      setNewRoundingMode("floor");
      setNewMinPurchase(0);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Création impossible");
    } finally {
      setCreating(false);
    }
  }, [orgId, canCreate, newName, newStatus, newPointsPerCurrency, newRoundingMode, newMinPurchase, load]);

  const enrollPatient = useCallback(async () => {
    if (!orgId) return;
    const raw = enrollPatientId.trim();
    if (!raw) {
      toast.error("Indiquez l’identifiant patient");
      return;
    }
    const patient_id = raw.includes(":") ? raw : `patients:${raw}`;
    setEnrolling(true);
    setError(null);
    try {
      await apiClient.post(`/pharmacies/${orgId}/loyalty/accounts/enroll`, { patient_id });
      toast.success("Patient inscrit au programme fidélité");
      setEnrollPatientId("");
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Inscription impossible";
      setError(msg);
      toast.error(msg);
    } finally {
      setEnrolling(false);
    }
  }, [orgId, enrollPatientId, load]);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Star className="w-8 h-8 text-amber-500" />
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Fidélité & CRM
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Programmes, comptes points et transactions (P0).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => void createProgram()}
            disabled={creating || loading || !canCreate}
          >
            <Plus className="w-4 h-4 mr-1" />
            Créer
          </Button>
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Actualiser
          </Button>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading && <Skeleton className="h-40 w-full" />}

      {!loading && (
        <>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Aperçu
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Programmes actifs</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {overview?.activePrograms ?? 0}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Patients inscrits</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {overview?.enrolledPatients ?? 0}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Points émis (30j)</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {overview?.pointsIssued30d ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Inscrire un patient
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crée ou retrouve le compte points pour un patient (ID Surreal, ex.{" "}
                <code className="text-[11px]">patients:uuid</code> ou UUID seul).
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Input
                  value={enrollPatientId}
                  onChange={(e) => setEnrollPatientId(e.target.value)}
                  placeholder="patients:… ou UUID"
                  className="sm:flex-1"
                />
                <ProtectedAction permission={Permission.LOYALTY_WRITE}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void enrollPatient()}
                    disabled={enrolling || !enrollPatientId.trim()}
                    loading={enrolling}
                  >
                    Inscrire
                  </Button>
                </ProtectedAction>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Nouveau programme
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Nom</p>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Fidélité standard" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Statut</p>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as LoyaltyProgram["status"])}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Points / unité devise</p>
                  <Input
                    type="number"
                    value={newPointsPerCurrency}
                    onChange={(e) => setNewPointsPerCurrency(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Arrondi</p>
                  <select
                    value={newRoundingMode}
                    onChange={(e) => setNewRoundingMode(e.target.value as LoyaltyProgram["rounding_mode"])}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="floor">Floor</option>
                    <option value="round">Round</option>
                    <option value="ceil">Ceil</option>
                  </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Achat minimum</p>
                  <Input
                    type="number"
                    value={newMinPurchase}
                    onChange={(e) => setNewMinPurchase(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Programmes
              </h2>
              {programs.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Aucun programme pour l’instant.
                </p>
              ) : (
                <div className="space-y-2">
                  {programs.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {p.status} • {p.points_per_currency} pts/unité • arrondi {p.rounding_mode} • min {p.min_purchase_amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-slate-600" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Dernières transactions de points
                </h2>
              </div>
              {transactions.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Aucune transaction pour l’instant (ventes créditées ou ajustements manuels apparaîtront ici).
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2 text-right">Points</th>
                        <th className="px-3 py-2 hidden md:table-cell">Motif / source</th>
                        <th className="px-3 py-2 hidden lg:table-cell">Compte</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((row) => {
                        const t = row.type ?? "";
                        const variant =
                          t === "credit" ? "success" : t === "debit" ? "danger" : "default";
                        return (
                          <tr
                            key={String(row.id)}
                            className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                          >
                            <td className="px-3 py-2 whitespace-nowrap text-slate-600 dark:text-slate-300">
                              {row.created_at ? formatDateTime(row.created_at) : "—"}
                            </td>
                            <td className="px-3 py-2">
                              <Badge variant={variant} size="sm">
                                {t || "—"}
                              </Badge>
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums font-medium">
                              {row.points != null ? (
                                <span
                                  className={
                                    t === "debit"
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-emerald-600 dark:text-emerald-400"
                                  }
                                >
                                  {t === "debit" ? "−" : "+"}
                                  {Math.abs(row.points)}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400 hidden md:table-cell">
                              <span className="line-clamp-2">
                                {[row.reason, row.source_type && row.source_id ? `${row.source_type}` : ""]
                                  .filter(Boolean)
                                  .join(" · ") || "—"}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-mono text-xs text-slate-500 hidden lg:table-cell truncate max-w-[140px]">
                              {row.account_id != null ? String(row.account_id) : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
