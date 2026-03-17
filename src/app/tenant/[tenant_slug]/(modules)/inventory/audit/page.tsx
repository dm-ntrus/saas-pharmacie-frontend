"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { useTenantPath } from "@/hooks/useTenantPath";
import { Permission } from "@/types/permissions";
import { useAuditTrail } from "@/hooks/api/useInventory";
import { format } from "date-fns";
import { formatDateTime } from "@/utils/formatters";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  DataTable,
  EmptyState,
  ErrorBanner,
  Skeleton,
} from "@/components/ui";
import type { Column } from "@/components/ui";
import {
  ArrowLeft,
  Download,
  Search,
  Calendar,
  ClipboardList,
  Filter,
} from "lucide-react";

type ActionType = "create" | "update" | "delete" | "transfer" | "adjustment";

const ACTION_LABELS: Record<ActionType, string> = {
  create: "Création",
  update: "Modification",
  delete: "Suppression",
  transfer: "Transfert",
  adjustment: "Ajustement",
};

const ACTION_BADGE: Record<ActionType, "success" | "info" | "danger" | "primary" | "warning"> = {
  create: "success",
  update: "info",
  delete: "danger",
  transfer: "primary",
  adjustment: "warning",
};

interface AuditEntry extends Record<string, unknown> {
  id: string;
  timestamp: string;
  user_name?: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: string;
  ip_address?: string;
  created_at?: string;
}

export default function InventoryAuditPage() {
  return (
    <ModuleGuard
      module="inventory"
      requiredPermissions={[Permission.INVENTORY_ITEMS_READ]}
    >
      <AuditContent />
    </ModuleGuard>
  );
}

function AuditContent() {
  const router = useRouter();
  const { buildPath } = useTenantPath();

  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionType | "">("");
  const [userSearch, setUserSearch] = useState("");
  const limit = 20;

  const { data: auditData, isLoading, error, refetch } = useAuditTrail({
    page,
    limit,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const entries: AuditEntry[] = useMemo(() => {
    const raw = auditData?.data ?? (Array.isArray(auditData) ? auditData : []);
    return raw as AuditEntry[];
  }, [auditData]);

  const total = auditData?.total ?? entries.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (actionFilter && e.action !== actionFilter) return false;
      if (userSearch) {
        const q = userSearch.toLowerCase();
        const userName = (e.user_name ?? e.user_id ?? "").toLowerCase();
        if (!userName.includes(q)) return false;
      }
      return true;
    });
  }, [entries, actionFilter, userSearch]);

  const exportCSV = useCallback(() => {
    const headers = ["Date", "Utilisateur", "Action", "Entité", "Détails", "IP"];
    const rows = filtered.map((e) => [
      formatDateTime(e.timestamp ?? e.created_at),
      e.user_name ?? e.user_id ?? "",
      ACTION_LABELS[e.action as ActionType] ?? e.action,
      `${e.entity_type ?? ""}${e.entity_id ? ` #${e.entity_id}` : ""}`,
      (e.details ?? "").replace(/"/g, '""'),
      e.ip_address ?? "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-inventaire-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const columns: Column<AuditEntry>[] = [
    {
      key: "timestamp",
      title: "Date",
      render: (_, row) => (
        <span className="text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
          {formatDateTime(row.timestamp ?? row.created_at)}
        </span>
      ),
    },
    {
      key: "user_name",
      title: "Utilisateur",
      render: (_, row) => (
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {row.user_name ?? row.user_id ?? "—"}
        </span>
      ),
    },
    {
      key: "action",
      title: "Action",
      render: (_, row) => {
        const act = row.action as ActionType;
        return (
          <Badge variant={ACTION_BADGE[act] ?? "default"} size="sm">
            {ACTION_LABELS[act] ?? row.action}
          </Badge>
        );
      },
    },
    {
      key: "entity_type",
      title: "Entité",
      hideOnMobile: true,
      render: (_, row) => (
        <div className="text-sm text-slate-700 dark:text-slate-300">
          <span className="capitalize">{row.entity_type ?? "—"}</span>
          {row.entity_id && (
            <span className="text-xs text-slate-400 ml-1">#{String(row.entity_id).slice(0, 8)}</span>
          )}
        </div>
      ),
    },
    {
      key: "details",
      title: "Détails",
      hideOnMobile: true,
      render: (_, row) => (
        <p className="text-sm text-slate-500 truncate max-w-[200px]">
          {typeof row.details === "string"
            ? row.details
            : row.details
              ? JSON.stringify(row.details)
              : "—"}
        </p>
      ),
    },
    {
      key: "ip_address",
      title: "IP",
      hideOnMobile: true,
      render: (_, row) => (
        <span className="text-xs font-mono text-slate-400">
          {(row.ip_address as string) ?? "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Journal d&apos;audit
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Historique des actions sur l&apos;inventaire
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          leftIcon={<Download className="h-4 w-4" />}
        >
          Exporter CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            {/* Date range */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
              <span className="text-slate-400">—</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Action type filter */}
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={actionFilter === "" ? "info" : "default"}
                className="cursor-pointer"
                onClick={() => {
                  setActionFilter("");
                  setPage(1);
                }}
              >
                Toutes
              </Badge>
              {(Object.keys(ACTION_LABELS) as ActionType[]).map((a) => (
                <Badge
                  key={a}
                  variant={actionFilter === a ? "info" : "default"}
                  className="cursor-pointer"
                  onClick={() => {
                    setActionFilter(a);
                    setPage(1);
                  }}
                >
                  {ACTION_LABELS[a]}
                </Badge>
              ))}
            </div>

            {/* User search */}
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Filtrer par utilisateur..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setPage(1);
                }}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorBanner
          message="Impossible de charger le journal d'audit"
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-8 h-8 text-slate-400" />}
          title="Aucun enregistrement"
          description={
            startDate || endDate || actionFilter || userSearch
              ? "Aucun résultat pour ces filtres."
              : "L'historique d'audit est vide."
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          rowKey={(row) => row.id}
        />
      )}
    </div>
  );
}
