"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ModuleGuard } from "@/components/guards/ModuleGuard";
import { Permission } from "@/types/permissions";
import { useTenantPath } from "@/hooks/useTenantPath";
import { apiService } from "@/services/api.service";
import { formatDateTime } from "@/utils/formatters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  EmptyState,
  Skeleton,
} from "@/components/ui";
import {
  ArrowLeft,
  FileText,
  Search,
  Shield,
  UserCog,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function SettingsAuditPage() {
  return (
    <ModuleGuard module="settings" requiredPermissions={[Permission.ROLES_READ]}>
      <AuditContent />
    </ModuleGuard>
  );
}

function AuditContent() {
  const { buildPath: path } = useTenantPath();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<string>("");
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["role-audit", search, actionFilter, page],
    queryFn: () =>
      apiService
        .get("/identity/audit/roles", {
          params: {
            ...(search ? { search } : {}),
            ...(actionFilter ? { action: actionFilter } : {}),
            page,
            limit,
          },
        })
        .then((r: any) => r.data ?? r ?? { logs: [], total: 0 }),
  });

  const logs: any[] = data?.logs ?? data ?? [];
  const total: number = data?.total ?? logs.length;

  const actionBadgeVariant = (action: string): "success" | "warning" | "danger" | "info" | "default" => {
    if (action?.includes("create") || action?.includes("assign")) return "success";
    if (action?.includes("update") || action?.includes("modify")) return "warning";
    if (action?.includes("delete") || action?.includes("remove")) return "danger";
    return "info";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={path("/settings")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Audit des rôles et permissions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Historique des modifications de rôles et attributions
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par utilisateur, rôle..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 px-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Toutes les actions</option>
                <option value="create">Création</option>
                <option value="update">Modification</option>
                <option value="delete">Suppression</option>
                <option value="assign">Attribution</option>
                <option value="revoke">Révocation</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Historique ({total} entrées)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Shield className="w-8 h-8 text-slate-400" />}
                title="Aucun événement d'audit"
                description="Les modifications de rôles et permissions apparaîtront ici."
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log: any, i: number) => (
                <div
                  key={log.id || i}
                  className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                        <UserCog className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {log.performedBy || log.actor || log.user || "Système"}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                          {log.description || log.details || `${log.action} — ${log.targetRole || log.roleName || ""}`}
                        </p>
                        {log.targetUser && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            Cible: {log.targetUser}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={actionBadgeVariant(log.action)} size="sm">
                        {log.action || "action"}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {log.timestamp || log.createdAt
                          ? formatDateTime(log.timestamp || log.createdAt)
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500">
                Page {page} sur {Math.ceil(total / limit)}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Préc.
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(total / limit)}
                  onClick={() => setPage((p) => p + 1)}
                  leftIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Suiv.
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
