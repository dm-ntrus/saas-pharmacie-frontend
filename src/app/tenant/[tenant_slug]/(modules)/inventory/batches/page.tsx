"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { ProtectedAction } from "@/components/guards/ProtectedAction";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import {
  useBatches,
  useExpiringBatches,
} from "@/hooks/api/useInventory";
import type { ProductBatch } from "@/types/inventory";
import { BatchStatus, BATCH_STATUS_LABELS } from "@/types/inventory";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  EmptyState,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import { formatDate } from "@/utils/formatters";
import {
  ArrowLeft,
  Plus,
  Search,
  Package,
  Calendar,
  AlertTriangle,
  ChevronRight,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/utils/cn";

function daysUntilExpiry(expirationDate: string): number | null {
  if (!expirationDate) return null;
  const exp = new Date(expirationDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);
  return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ expirationDate }: { expirationDate: string }) {
  const days = daysUntilExpiry(expirationDate);
  if (days === null) return <Badge variant="default">—</Badge>;
  if (days < 0) return <Badge variant="danger">Expiré</Badge>;
  if (days <= 7) return <Badge variant="danger">J-{days}</Badge>;
  if (days <= 30) return <Badge variant="warning">J-{days}</Badge>;
  return <Badge variant="success">J-{days}</Badge>;
}

export default function BatchesListPage() {
  return (
    <ModuleGuard module="inventory" requiredPermissions={[Permission.PRODUCT_BATCHES_READ]}>
      <BatchesContent />
    </ModuleGuard>
  );
}

function BatchesContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BatchStatus | "">("");

  const { data, isLoading, error, refetch } = useBatches({
    status: statusFilter || undefined,
    limit: 100,
  });
  const { data: expiring } = useExpiringBatches(30);

  const batches: ProductBatch[] = data?.batches ?? [];
  const filtered = batches.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.batch_number?.toLowerCase().includes(q) ||
      b.product_name?.toLowerCase().includes(q) ||
      b.product_id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(buildPath("/inventory"))}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Lots</h1>
            <p className="text-sm text-slate-500 mt-0.5">Traçabilité, FEFO et expiration</p>
          </div>
        </div>
        <ProtectedAction permission={Permission.PRODUCT_BATCHES_CREATE}>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => router.push(buildPath("/inventory/batches/new"))}
          >
            Nouveau lot
          </Button>
        </ProtectedAction>
      </div>

      {expiring && expiring.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {expiring.length} lot(s) expirant dans les 30 jours
              </p>
              <p className="text-sm text-slate-500">Priorité FEFO : premier expiré, premier sorti</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSearch("")}>
              Voir les lots
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Rechercher (n° lot, produit)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter((e.target.value as BatchStatus) || "")}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
        >
          <option value="">Tous les statuts</option>
          {(Object.keys(BATCH_STATUS_LABELS) as BatchStatus[]).map((s) => (
            <option key={s} value={s}>{BATCH_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message="Impossible de charger les lots" onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8 text-slate-400" />}
          title="Aucun lot"
          description="Créez un premier lot ou ajustez les filtres."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((batch) => {
            const days = daysUntilExpiry(batch.expiration_date ?? "");
            const isExpiringSoon = typeof days === "number" && days >= 0 && days <= 30;
            return (
              <Card
                key={batch.id}
                className={cn(
                  "hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer",
                  isExpiringSoon && "border-amber-200 dark:border-amber-800",
                )}
                onClick={() => router.push(buildPath(`/inventory/batches/${batch.id}`))}
              >
                <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {batch.product_name ?? batch.product_id ?? "—"}
                      </p>
                      <p className="text-sm text-slate-500">
                        Lot {batch.batch_number}
                        {batch.expiration_date && (
                          <span className="ml-2">
                            · Exp. {formatDate(batch.expiration_date)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <ExpiryBadge expirationDate={batch.expiration_date ?? ""} />
                    <Badge variant={batch.status === BatchStatus.ACTIVE ? "success" : "default"} size="sm">
                      {BATCH_STATUS_LABELS[batch.status as BatchStatus] ?? batch.status}
                    </Badge>
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
                      {batch.current_quantity ?? 0} / {batch.initial_quantity ?? 0} unités
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
