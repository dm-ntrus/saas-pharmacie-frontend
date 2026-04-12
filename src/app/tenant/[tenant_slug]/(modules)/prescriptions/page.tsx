"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  usePrescriptions,
  usePrescriptionStats,
} from "@/hooks/api/usePrescriptions";
import {
  PrescriptionStatus,
  PRESCRIPTION_STATUS_LABELS,
} from "@/types/prescriptions";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  EmptyState,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import { Search, FileText, ChevronRight, Plus } from "lucide-react";
import { formatDate } from "@/utils/formatters";

const STATUS_BADGE: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
  [PrescriptionStatus.PENDING]: "default",
  [PrescriptionStatus.VERIFIED]: "info",
  [PrescriptionStatus.IN_PROGRESS]: "warning",
  [PrescriptionStatus.READY]: "info",
  [PrescriptionStatus.DISPENSED]: "success",
  [PrescriptionStatus.CANCELLED]: "danger",
  [PrescriptionStatus.ON_HOLD]: "warning",
};

export default function PrescriptionsPage() {
  return (
    <ModuleGuard
      module="prescriptions"
      requiredPermissions={[Permission.PRESCRIPTIONS_READ]}
    >
      <PrescriptionsContent />
    </ModuleGuard>
  );
}

function PrescriptionsContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: prescriptions = [], isLoading, error, refetch } = usePrescriptions(
    statusFilter || undefined
  );
  const { data: stats } = usePrescriptionStats();

  const filtered = prescriptions.filter((p: { prescription_number?: string; patient_id?: string }) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.prescription_number?.toLowerCase().includes(s) ||
      String(p.patient_id ?? "").toLowerCase().includes(s)
    );
  });

  const safeId = (id: string) =>
    typeof id === "string" && id.includes(":") ? id.split(":")[1] : id;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Ordonnances
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Liste et suivi des ordonnances
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/prescriptions/alerts"))}
          >
            Alertes fin de traitement
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/prescriptions/digital"))}
          >
            e-Ordonnance
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/prescriptions/medication-review"))}
          >
            BPM
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/prescriptions/dose-preparation"))}
          >
            Préparation de doses
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/prescriptions/controlled-substances"))}
          >
            Substances contrôlées
          </Button>
        </div>
      </div>

      {stats && typeof stats === "object" && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(stats as Record<string, number>).map(([key, val]) => (
            <Card key={key}>
              <CardContent className="p-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide">{key}</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{Number(val)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par n° ordonnance ou patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <select
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          {Object.values(PrescriptionStatus).map((s) => (
            <option key={s} value={s}>
              {PRESCRIPTION_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <ProtectedAction permission={Permission.PRESCRIPTIONS_WRITE}>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => router.push(buildPath("/prescriptions/new"))}
          >
            Nouvelle ordonnance
          </Button>
        </ProtectedAction>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner
          message="Erreur de chargement des ordonnances"
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Aucune ordonnance"
          description="Aucune ordonnance trouvée pour les critères sélectionnés."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((p: any) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <button
                    className="text-left flex-1 min-w-0"
                    onClick={() =>
                      router.push(buildPath(`/prescriptions/${safeId(p.id)}`))
                    }
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {p.prescription_number ?? p.id}
                      </span>
                      <Badge
                        variant={STATUS_BADGE[p.status] ?? "default"}
                        size="sm"
                      >
                        {PRESCRIPTION_STATUS_LABELS[p.status as PrescriptionStatus] ?? p.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Prescripteur: {p.prescriber_name ?? "—"} ·{" "}
                      {p.prescribed_date
                        ? formatDate(p.prescribed_date)
                        : p.created_at
                        ? formatDate(p.created_at)
                        : ""}
                    </p>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      router.push(buildPath(`/prescriptions/${safeId(p.id)}`))
                    }
                    leftIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Voir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
